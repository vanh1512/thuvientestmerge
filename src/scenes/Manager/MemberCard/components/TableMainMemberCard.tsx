import * as React from 'react';
import { Button, Popover, Row, Table, Tag, } from 'antd';
import { AccountBookOutlined, CaretDownOutlined, CheckOutlined, ClockCircleOutlined, CloseCircleOutlined, ContainerOutlined, DeleteFilled, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, FileTextOutlined, LockOutlined, PrinterTwoTone, ReloadOutlined, UnlockOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import { MemberCardDto, MemberDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { ActionMemberCard } from '..';
import { eMCardStatus, eMemberAction, valueOfeMCardStatus, valueOfeMCardType } from '@src/lib/enumconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';

export interface IProps {
	onActionMemberCard?: (item: MemberCardDto, action: number) => void;
	memberCardListResult: MemberCardDto[],
	memberListResult: MemberDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	isPrint?: boolean;
	isLoadDone?: boolean;
	addListMemberCard?: (input: MemberCardDto[]) => void;
}
export default class TableMainMemberCard extends AppComponentBase<IProps> {
	state = {

		visibleModalCreateUpdate: false,
		me_ca_id: undefined,
		clicked: false,
	};
	listMemberCard: MemberCardDto[] = [];
	memberCardSelected: MemberCardDto = new MemberCardDto();
	onActionMemberCard = (item: MemberCardDto, action: number) => {
		this.memberCardSelected.init(item);
		if (!!this.props.onActionMemberCard) {
			this.props.onActionMemberCard(item, action);
		}
	}
	getNameMember = (me_id: number | undefined) => {
		if (me_id == undefined) {
			return "";
		}
		let itemResult = this.props.memberListResult.find(item => item.me_id == me_id);
		if (itemResult == undefined) {
			return "";
		}
		return itemResult.me_name;
	}

	selectRowItem = (record: MemberCardDto) => {
		if (record.me_ca_is_locked) {
			return "bg-red-display";
		}
		if (this.memberCardSelected.me_ca_id == record.me_ca_id) {
			return "bg-click";
		} else {
			return "bg-white";
		}
	}
	addListMemberCard = (input: MemberCardDto[] | undefined) => {
		if (!!this.props.addListMemberCard) {
			this.props.addListMemberCard(input!)
		}
	}
	content = (item: MemberCardDto) => (
		<div >
			{
				(item.me_ca_status == eMCardStatus.Register.num) ?
					<>
						{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Approve) &&
							(<Row style={{ alignItems: "center" }}>
								<Button
									type="primary" icon={<CheckOutlined />} title={L("ApproveCard")}
									size='small'
									style={{ marginLeft: '10px', marginTop: "5px" }}
									onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.approveCard); this.hide() }}
								></Button>
								<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.approveCard); this.hide() }}>{L('ApproveCard')}</a>
							</Row>)}
						{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Delete) &&
							(<Row style={{ alignItems: "center" }}>
								<Button
									danger icon={<DeleteFilled />} title={L("Delete")}
									size='small'
									style={{ marginLeft: '10px', marginTop: "5px" }}
									onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Delete); this.hide() }}
								></Button>
								<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Delete); this.hide() }}>{L('Delete')}</a>

							</Row>)
						}
					</>
					:
					(this.props.memberListResult.find(member => member.me_id == item.me_id) === undefined) ?
						(this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Detail) &&
							(<Row style={{ alignItems: "center" }}>
								<Button
									type="primary" icon={<EyeOutlined />} title={L("ViewCardInformation")}
									size='small'
									style={{ marginLeft: '10px', marginTop: "5px" }}
									onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Create); this.hide() }}
								></Button>
								<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Create); this.hide() }}>{L('ViewCardInformation')}</a>

							</Row>)
						)

						:
						(item.me_ca_is_locked) ?
							<>
								{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Detail) &&
									(<Row style={{ alignItems: "center" }}>
										<Button
											type="primary" icon={<EyeOutlined />} title={L("ViewCardInformation")}
											size='small'
											style={{ marginLeft: '10px', marginTop: "5px" }}
											onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Create); this.hide() }}
										></Button>
										<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Create); this.hide() }}>{L('ViewCardInformation')}</a>
									</Row>)}
								{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Lock) &&
									(<Row style={{ alignItems: "center" }}>
										<Button
											type="primary" icon={<UnlockOutlined />} title={L('UnlockCard')}
											size='small'
											style={{ marginLeft: '10px', marginTop: "5px" }}
											onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.lockCard); this.hide() }}
										></Button>
										<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.lockCard); this.hide() }}>{L('UnlockCard')}</a>
									</Row>)}
							</>
							:
							<>
								{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Edit) &&
									(<Row style={{ alignItems: "center" }}>
										<Button
											type="primary" icon={<ContainerOutlined />} title={L("chi_tiet_the")}
											size='small'
											style={{ marginLeft: '10px', marginTop: "5px" }}
											onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.informationCard); this.hide() }}
										></Button>
										<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.informationCard); this.hide() }}>{L('chi_tiet_the')}</a>
									</Row>)}

								{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Extend) &&
									(<Row style={{ alignItems: "center" }}>
										<Button
											icon={<ContainerOutlined />} title={L('gia_han_the')}
											size='small'
											style={{ marginLeft: '10px', marginTop: "5px", color: '#003a8c' }}
											onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.extendTimeCard); this.hide() }}
										></Button>
										<a style={{ paddingLeft: "10px", color: "#446fab" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.extendTimeCard); this.hide() }}>{L('gia_han_the')}</a>
									</Row>)}
								{item.me_ca_status != eMCardStatus.Timeup.num &&
									(this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Recharge) &&
										(<Row style={{ alignItems: "center" }}>
											<Button
												type="primary" icon={<AccountBookOutlined />} title={L("Recharge")}
												size='small'
												style={{ marginLeft: '10px', marginTop: "5px" }}
												onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.rechargeCard); this.hide() }}
											></Button>
											<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.rechargeCard); this.hide() }}>{L('RechargeMoney')}</a>
										</Row>))
								}

								{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_PrintRegister) &&
									(<Row style={{ alignItems: "center" }}>
										<Button
											type="primary" icon={<FileTextOutlined />} title={L('PrintRegistrationForm')}
											size='small'
											style={{ marginLeft: '10px', marginTop: "5px" }}
											onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.printRegisterForm); this.hide() }}
										></Button>
										<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.printRegisterForm); this.hide() }}>{L('PrintRegistrationForm')}</a>
									</Row>)}
								{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Lock) &&
									(<Row style={{ alignItems: "center" }}>
										<Button
											danger
											type="primary" icon={<LockOutlined />} title={L("LockCard")}
											size='small'
											style={{ marginLeft: '10px', marginTop: "5px" }}
											onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.lockCard); this.hide() }}
										></Button>
										<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.lockCard); this.hide() }}>{L('LockCard')}</a>
									</Row>)}
								{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Delete) &&
									(<Row style={{ alignItems: "center" }}>
										<Button
											danger
											type="primary" icon={<DeleteOutlined />} title={L("Delete")}
											size='small'
											style={{ marginLeft: '10px', marginTop: "5px" }}
											onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Delete); this.hide() }}
										></Button>
										<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onActionMemberCard(item!, ActionMemberCard.Delete); this.hide() }}>{L('Delete')}</a>
									</Row>)}
							</>}
		</div>
	)
	handleVisibleChange = (visible, item: MemberCardDto) => {
		this.setState({ clicked: visible, me_ca_id: item.me_ca_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	render() {
		const { memberCardListResult, pagination, hasAction, memberListResult, isPrint } = this.props;

		let action: ColumnGroupType<MemberCardDto> = {
			title: "", children: [], key: 'action_memberCard_index', className: "no-print center", fixed: "right", width: 50,
			render: (text: string, item: MemberCardDto) => (
				<Popover style={{ width: "200px" }} visible={this.state.clicked && this.state.me_ca_id == item.me_ca_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="leftTop" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.me_ca_id == item.me_ca_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};
		const columns: ColumnsType<MemberCardDto> = [
			{ title: L('N.O'), key: 'no_memberCard_index', width: 50, fixed: "left", render: (text: string, item: MemberCardDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div> },
			{ title: L('Member'), key: 'me_id', fixed: "left", render: (text: string, item: MemberCardDto) => <div>{this.getNameMember(item.me_id)}</div> },
			{ title: L('CardNumber'), key: 'me_ca_number', render: (text: string, item: MemberCardDto) => <div>{item.me_ca_number}</div> },
			{ title: L('CardCode'), key: 'me_ca_code', render: (text: string, item: MemberCardDto) => <div>{item.me_ca_code}</div> },
			{ title: L('ValidityStartDate'), key: 'me_ca_use_from', render: (text: string, item: MemberCardDto) => <div>{(item.me_ca_use_from != undefined) ? moment(item.me_ca_use_from).format("DD/MM/YYYY") : ""}</div> },
			{ title: L('ExpirationDate'), key: 'me_ca_use_to', render: (text: string, item: MemberCardDto) => <div>{(item.me_ca_use_from != undefined) ? moment(item.me_ca_use_to).format("DD/MM/YYYY") : ""}</div> },
			{ title: L('RemainedMoney'), key: 'me_ca_level', render: (text: string, item: MemberCardDto) => <div>{item.me_ca_money.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div> },
			{
				title: L('Status'), width: 150, key: 'me_ca_type', className: 'no-print', render: (text: string, item: MemberCardDto) =>
				(
					item.me_ca_is_locked ?
						<div>{L("da_khoa")}</div>
						:
						(isPrint == true ?
							<>
								{item.me_ca_status === eMCardStatus.Register.num &&
									<div>{valueOfeMCardStatus(item.me_ca_status)}</div>
								}
								{item.me_ca_status === eMCardStatus.Creating.num &&
									<div>{valueOfeMCardStatus(item.me_ca_status)}</div>
								}
								{
									item.me_ca_status === eMCardStatus.Timeup.num &&
									<div>{valueOfeMCardStatus(item.me_ca_status)}</div>
								}
								{
									item.me_ca_status === eMCardStatus.DebtDocument.num &&
									<div>{valueOfeMCardStatus(item.me_ca_status)}</div>
								}
								{
									item.me_ca_status === eMCardStatus.DebtMoney.num &&
									<div>{valueOfeMCardStatus(item.me_ca_status)}</div>
								}
							</>
							:
							<>
								{item.me_ca_status === eMCardStatus.Register.num &&
									<Tag color='#cac709' icon={<ReloadOutlined spin />}>{valueOfeMCardStatus(item.me_ca_status)}</Tag>
								}
								{item.me_ca_status === eMCardStatus.Creating.num &&
									<Tag color='green' icon={<CheckOutlined />}>{valueOfeMCardStatus(item.me_ca_status)}</Tag>
								}
								{
									item.me_ca_status === eMCardStatus.Timeup.num &&
									<Tag color='red' icon={<CloseCircleOutlined />}>{valueOfeMCardStatus(item.me_ca_status)}</Tag>
								}
								{
									item.me_ca_status === eMCardStatus.DebtDocument.num &&
									<Tag color='orange' icon={<ExclamationCircleOutlined />}>{valueOfeMCardStatus(item.me_ca_status)}</Tag>
								}
								{
									item.me_ca_status === eMCardStatus.DebtMoney.num &&
									<Tag color='blue' icon={<ClockCircleOutlined />}>{valueOfeMCardStatus(item.me_ca_status)}</Tag>
								}
							</>
						)

				)
			},
			{ title: L('CardType'), key: 'me_ca_type', render: (text: string, item: MemberCardDto) => <div>{valueOfeMCardType(item.me_ca_type)}</div> },

		];
		if (hasAction != undefined && hasAction === true &&
			this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Approve ||
				AppConsts.Permission.Subscriber_MemberCard_Delete ||
				AppConsts.Permission.Subscriber_MemberCard_Detail ||
				AppConsts.Permission.Subscriber_MemberCard_Lock ||
				AppConsts.Permission.Subscriber_MemberCard_Edit ||
				AppConsts.Permission.Subscriber_MemberCard_Extend ||
				AppConsts.Permission.Subscriber_MemberCard_PrintCard ||
				AppConsts.Permission.Subscriber_MemberCard_Lock)) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<MemberCardDto> = {

			onChange: (listIdMember: React.Key[], listItem: MemberCardDto[]) => {
				this.addListMemberCard(listItem)
			}
		}
		return (
			<Table
				className='centerTable'
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onActionMemberCard(record, ActionMemberCard.DoubleClick) }
					};
				}}
				scroll={this.props.isPrint ? { x: undefined } : { x: 1000 }}
				loading={!this.props.isLoadDone}
				rowClassName={(record, index) => this.selectRowItem(record)}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'small'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				rowSelection={hasAction ? rowSelection : undefined}
				dataSource={memberCardListResult.length > 0 ? memberCardListResult : []}
				pagination={this.props.pagination}
			/>
		)
	}
}