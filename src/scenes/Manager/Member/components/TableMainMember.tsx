import * as React from 'react';
import { Avatar, Button, Popover, Row, Table, Tag, } from 'antd';
import { CaretDownOutlined, CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, CreditCardOutlined, DashOutlined, DeleteFilled, EditOutlined, InfoCircleOutlined, KeyOutlined, LockOutlined, MinusOutlined, SyncOutlined, UnlockOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import { MemberDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { eMemberRegisterStatus, valueOfeGENDER, valueOfeMemberRegisterStatus } from '@src/lib/enumconst';
import AppConsts from '@src/lib/appconst';
import { SorterResult, TableRowSelection } from 'antd/lib/table/interface';


export const ActionTableMember = {
	DoubleClickRow: 0,
	CreateOrUpdate: 1,
	Delete: 2,
	CreateCard: 3,
	LockMember: 4,
	Confirm: 5,
	Reject: 6,
	InfoMember: 7,
	ChangePassword: 8,
}

export interface IProps {
	onActionMember?: (item: MemberDto, action: number) => void;
	memberListResult: MemberDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	hiddenAvatar?: boolean;
	width?: number;
	noScroll?: boolean;
	isLoadDone?: boolean;
	changeColumnSort?: (fieldSort: SorterResult<MemberDto> | SorterResult<MemberDto>[]) => void;
}
export default class TableMainMember extends AppComponentBase<IProps> {
	state = {
		visibleModalCreateUpdate: false,
		me_id: undefined,
		clicked: false,
	};
	memberSelected: MemberDto = new MemberDto();

	onActionMember = (item: MemberDto, action: number) => {
		this.memberSelected.init(item);
		if (!!this.props.onActionMember) {
			this.props.onActionMember(item, action);
		}
	}

	selectRowItem = (record: MemberDto) => {
		if (record.me_is_locked) {
			return "bg-red-display";
		}
		if (this.memberSelected.me_id == record.me_id) {
			return "bg-click";
		} else {
			return "bg-white";
		}
	}
	content = (item: MemberDto) => (
		<div >
			{item.me_status != eMemberRegisterStatus.REJECT.num ?
				(item.me_is_locked == false && this.isGranted(AppConsts.Permission.Subscriber_Member_Edit)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type='primary'
						icon={<EditOutlined />} title={L("Edit")}
						size='small'
						style={{ marginLeft: '10px', marginTop: '5px' }}
						onClick={() => { this.onActionMember(item!, ActionTableMember.CreateOrUpdate); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMember(item!, ActionTableMember.CreateOrUpdate); this.hide() }}>{L("Edit")}</a>
				</Row>)
				: <></>
			}
			{(item.me_status == eMemberRegisterStatus.NONE.num) ?
				item.me_is_locked == false &&
				<>


					{this.isGranted(AppConsts.Permission.Subscriber_Member_Approve) &&
						(<Row style={{ alignItems: "center" }}>
							<Button
								type='primary'
								icon={<CheckOutlined />} title={L('ApproveMember')}
								size='small'
								style={{ marginLeft: '10px', marginTop: '5px' }}
								onClick={() => { this.onActionMember(item!, ActionTableMember.Confirm); this.hide() }}

							></Button>
							<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMember(item!, ActionTableMember.Confirm); this.hide() }}>{L('ApproveMember')}</a>

						</Row>
						)
					}
					{this.isGranted(AppConsts.Permission.Subscriber_Member_Approve) &&
						(<Row style={{ alignItems: "center" }}>

							<Button
								danger
								icon={<MinusOutlined />} title={L('DenyMember')}
								size='small'
								style={{ marginLeft: '10px', marginTop: '5px' }}
								onClick={() => { this.onActionMember(item!, ActionTableMember.Reject); this.hide() }}
							></Button>
							<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMember(item!, ActionTableMember.Reject); this.hide() }}>{L('DenyMember')}</a>

						</Row>
						)}
				</>
				: <></>
			}
			{item.me_is_locked ?
				(this.isGranted(AppConsts.Permission.Subscriber_Member_Lock) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							type='primary' icon={<UnlockOutlined />} title={L('UnlockMember')}
							size='small'
							style={{ marginLeft: '10px', marginTop: '5px' }}
							onClick={() => { this.onActionMember(item!, ActionTableMember.LockMember); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMember(item!, ActionTableMember.LockMember); this.hide() }}>{L('UnlockMember')}</a>
					</Row>)
				)
				:
				(this.isGranted(AppConsts.Permission.Subscriber_Member_Lock) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							danger
							type='primary' icon={<LockOutlined />} title={L('LockMember')}
							size='small'
							style={{ marginLeft: '10px', marginTop: '5px' }}
							onClick={() => { this.onActionMember(item!, ActionTableMember.LockMember); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onActionMember(item!, ActionTableMember.LockMember); this.hide() }}>{L('LockMember')}</a>
					</Row>)
				)
			}

			{item.me_status != eMemberRegisterStatus.REJECT.num ?
				item.me_is_locked == false &&
				(this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Create) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							type='primary'
							icon={<CreditCardOutlined />} title={L('ManageMemberCard')}
							size='small'
							style={{ marginLeft: '10px', marginTop: '5px' }}
							onClick={() => { this.onActionMember(item!, ActionTableMember.CreateCard); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionMember(item!, ActionTableMember.CreateCard); this.hide() }}>{L('ManageMemberCard')}</a>
					</Row>)
				)
				: <></>}
			{
				this.isGranted(AppConsts.Permission.Subscriber_Member_Detail) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						icon={<InfoCircleOutlined />} title={L('Information') + " " + L('Member')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionMember(item!, ActionTableMember.InfoMember); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px", color: "black" }} onClick={() => { this.onActionMember(item!, ActionTableMember.InfoMember); this.hide() }}>{L('Information') + " " + L('Member')}</a>
				</Row>)
			}
			{
				this.isGranted(AppConsts.Permission.Subscriber_Member_ChangePassWord) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						icon={<KeyOutlined />} title={L('ChangePassword')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionMember(item!, ActionTableMember.ChangePassword); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px", color: "black" }} onClick={() => { this.onActionMember(item!, ActionTableMember.ChangePassword); this.hide() }}>{L('ChangePassword')}</a>
				</Row>)

			}
			{
				this.isGranted(AppConsts.Permission.Subscriber_Member_Delete) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionMember(item!, ActionTableMember.Delete); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onActionMember(item!, ActionTableMember.Delete); this.hide() }}>{L('Delete')}</a>

				</Row>)
			}
		</div>
	);
	handleVisibleChange = (visible, item: MemberDto) => {
		this.setState({ clicked: visible, me_id: item.me_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	render() {
		const { memberListResult, pagination, hasAction } = this.props;
		let action: ColumnGroupType<MemberDto> = {
			title: "", children: [], key: 'action_member_index', className: "no-print center", fixed: 'right', width: 50,
			render: (text: string, item: MemberDto) => (
				<Popover visible={this.state.clicked && this.state.me_id == item.me_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.me_id == item.me_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};
		const columns: ColumnsType<MemberDto> = [
			{
				title: L('N.O'), dataIndex: '', key: 'no_member_index', fixed: "left", width: 50,
				render: (text: string, item: MemberDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div>
			},

			...(hasAction != undefined && hasAction === true ? [
				{
					title: L('Avatar'), key: 'fi_id_member_index',
					render: (text: string, item: MemberDto, index: number) => (<div style={{ textAlign: 'center' }}><Avatar style={{ backgroundColor: AppConsts.backGroundColorByName[item.me_name!.charAt(0)] }} size={50} src={(item.fi_id.id != undefined && item.fi_id.isdelete == false) ? this.getFile(item.fi_id.id) : ""}>{(item.fi_id.id > 0 && item.fi_id.isdelete == false) ? "" : item.me_name?.charAt(0)}</Avatar></div>)
				},
			] : []),
			{
				title: L('MemberCode'), sorter: true, dataIndex: 'me_code', key: 'me_code',
				render: (text: string, item: MemberDto) => <div>{item.me_code}</div>
			},
			{
				title: L('MemberName'), sorter: true, dataIndex: 'me_name', key: 'me_name', width: 200,
				render: (text: string, item: MemberDto) => <div>{item.me_name}</div>
			},
			{
				title: L('Identification'), key: 'me_identify', width: 200,
				render: (text: string, item: MemberDto) => <div>{item.me_identify}</div>
			},
			{
				title: L('Status'), key: 'me_status', width: 150,
				render: (text: string, item: MemberDto) => {
					if (this.props.noScroll !== undefined && this.props.noScroll) {
						return <div>{valueOfeMemberRegisterStatus(item.me_status)}</div>
					}
					else {
						return <div>
							{item.me_status == eMemberRegisterStatus.NONE.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeMemberRegisterStatus(item.me_status)}</Tag> ||
								item.me_status == eMemberRegisterStatus.ACCEPTED.num && <Tag icon={<CheckCircleOutlined />} color="success">{valueOfeMemberRegisterStatus(item.me_status)}</Tag> ||
								item.me_status == eMemberRegisterStatus.REJECT.num && <Tag icon={<CloseCircleOutlined />} color="error">{valueOfeMemberRegisterStatus(item.me_status)}</Tag>}
						</div>
					}
				}
			},
			{
				title: L('trang_thai_the'), key: 'me_status', width: 150,
				render: (text: string, item: MemberDto) => {
					if (this.props.noScroll !== undefined && this.props.noScroll) {
						return <div>{item.me_has_card == true ? <div>{L("da_co_the_doc_gia")}</div> : <div>{L("chua_co_the")}</div>}</div>
					}
					else {
						return <div>{item.me_has_card == true ? <Tag color="success">{L("da_co_the_doc_gia")}</Tag> : <Tag color="error">{L("chua_co_the")}</Tag>}</div>
					}
				}
			},
		];
		if (hasAction != undefined && hasAction === true &&
			this.isGranted(AppConsts.Permission.Subscriber_Member_Edit ||
				AppConsts.Permission.Subscriber_Member_Lock ||
				AppConsts.Permission.Subscriber_MemberCard_Create ||
				AppConsts.Permission.Subscriber_Member_Detail ||
				AppConsts.Permission.Subscriber_Member_Delete)) {
			columns.push(action);
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onActionMember(record, ActionTableMember.DoubleClickRow) }
					};
				}}
				className="centerTable"
				scroll={this.props.noScroll ? { y: undefined } : { x: 1000, y: 500 }}
				loading={!this.props.isLoadDone}
				rowClassName={(record, index) => this.selectRowItem(record)}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				columns={columns}
				dataSource={memberListResult.length > 0 ? memberListResult : []}
				pagination={this.props.pagination}
				onChange={(a, b, sort: SorterResult<MemberDto> | SorterResult<MemberDto>[]) => {
					if (!!this.props.changeColumnSort) {
						this.props.changeColumnSort(sort);
					}
				}}
			/>
		)
	}
}