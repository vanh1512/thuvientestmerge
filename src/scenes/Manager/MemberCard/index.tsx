import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, DatePicker, Tag, Badge, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { MemberCardDto, ExtendTimeMemberCardInput, ItemUser, MemberDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, PlusOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateMemberCard from './components/CreateOrUpdateMemberCard';
import TableMainMemberCard from './components/TableMainMemberCard';
import moment, { Moment } from 'moment';
import confirm from 'antd/lib/modal/confirm';
import { eMCardStatus, eMCardType, eUserType } from '@src/lib/enumconst';
import ExtendCardForm from './components/ExtendCardForm';
import SelectEnum from '@src/components/Manager/SelectEnum';
import SelectUser from '@src/components/Manager/SelectUser';
import ModalExportMemberCard from './components/ModalExportMemberCard';
import ModalPrintCardMember from './components/ModalPrintCardMember';
import ModalPrintRegistrationForm from './components/ModalPrintRegistrationForm';
import FormCreateMemberCardOnline from '@src/scenes/UserInformation/components/FormCreateMemberCardOnline';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import SelectState from '@src/components/Manager/SelectedState';
import InformationCard from './components/InformationCard';
import TabReChargeOrAddMoneyCard from './components/TabReChargeOrAddMoneyCard';

export const ActionMemberCard = {
	Create: 0,
	DoubleClick: 1,
	Delete: 2,
	lockCard: 3,
	extendTimeCard: 4,
	printRegisterForm: 5,
	printCardMember: 6,
	rechargeCard: 7,
	approveCard: 8,
	informationCard: 9,
}

export interface IProps {
	memberSelected?: MemberDto;
	is_redirected_member_card?: boolean;
	update?: boolean;
}

export default class MemberCard extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreate: false,
		visibleExportMemberCard: false,
		viewPrintRegisterForm: false,
		viewPrintCardMember: false,
		visibleExtendCard: false,
		visibleRechargeCard: false,
		visibleFormCreateCardOnline: false,
		visibleInformationCard: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		me_id: undefined,
		me_ca_id: undefined,
		me_ca_number: undefined,
		me_ca_code: undefined,
		me_ca_status: undefined,
		me_ca_use_from: undefined,
		me_ca_use_to: undefined,
		me_ca_type: undefined,
		me_ca_is_locked: false,
		extend_time: undefined,
		me_ca_time_receive: undefined,
		approveCard: false,
		noPrint: true,
		totalItem: 0,
		me_has_card: undefined,
	};
	memberCardSelected: MemberCardDto = new MemberCardDto();
	listMemberCard: MemberCardDto[] = [];
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		if (!!this.props.memberSelected && this.props.memberSelected.me_id != undefined) {
			await this.setState({ me_id: this.props.memberSelected?.me_id });
		}
		await this.getAll();
		await stores.memberStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined);
		this.setState({ isLoadDone: true });
	}
	async componentDidUpdate(prevProps) {
		if (!!this.props.memberSelected && this.props.update !== prevProps.update) {
			await this.setState({ me_id: this.props.memberSelected?.me_id });
			await this.getAll();
		}
	}
	clearSearch = async () => {
		await this.setState({
			me_id: undefined,
			me_ca_id: undefined,
			me_ca_number: undefined,
			me_ca_code: undefined,
			me_ca_status: undefined,
			me_ca_use_from: undefined,
			me_ca_use_to: undefined,
			me_ca_type: undefined,
			me_ca_is_locked: false,
			extend_time: undefined,
			me_ca_time_receive: undefined,

		});
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.memberCardStore.getAll(
			this.state.me_id,
			this.state.me_ca_number,
			this.state.me_ca_code,
			this.state.me_ca_status,
			this.state.me_ca_use_from,
			this.state.me_ca_use_to,
			this.state.me_ca_type,
			this.state.me_ca_is_locked,
			this.state.skipCount,
			undefined
		);
		await this.setState({ isLoadDone: true, visibleModalCreate: false, visibleExportMemberCard: false, viewPrintRegisterForm: false, visibleExtendCard: false, visibleFormCreateCardOnline: false });
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
		this.setState({ noPrint: this.state.me_ca_is_locked == false ? true : false })
	}
	addListMemberCard = (memberCard: MemberCardDto[] | undefined) => {
		if (memberCard != undefined) {
			this.listMemberCard = memberCard;
			this.setState({ totalItem: this.listMemberCard.length })
		}
	}
	createModalOpen = async () => {
		await this.setState({ visibleModalCreate: true, });
	}
	informationCard = async (input: MemberCardDto) => {
		this.memberCardSelected.init(input);
		await this.setState({ visibleInformationCard: true });
	}

	onCreateSuccess = async () => {
		await this.getAll();
	}
	onActionMemberCard = (item: MemberCardDto, action: number) => {
		action == ActionMemberCard.Create && this.createModalOpen();
		action == ActionMemberCard.DoubleClick && this.onDoubleClickRow(item);
		action == ActionMemberCard.Delete && this.deleteMemberCard(item);
		action == ActionMemberCard.lockCard && this.lockCard(item);
		action == ActionMemberCard.extendTimeCard && this.extendTimeCard(item);
		action == ActionMemberCard.printRegisterForm && this.printRegisterForm(item);
		action == ActionMemberCard.rechargeCard && this.rechargeCard(item);
		action == ActionMemberCard.approveCard && this.approveCard(item);
		action == ActionMemberCard.informationCard && this.informationCard(item);
	}

	onDoubleClickRow = (value: MemberCardDto) => {
		if (value == undefined || value.me_ca_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.setState({ visibleModalCreate: false })
		this.informationCard(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { memberCardListResult, totalMemberCard } = stores.memberCardStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalMemberCard;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	onChangeDatePickerStart(date: Moment | null | undefined) {
		if (date == null) {
			date = undefined;
		}
		this.setState({ me_ca_use_from: date });
	}

	onChangeDatePickerEnd(date: Moment | null | undefined) {
		if (date == null) {
			date = undefined;
		}
		this.setState({ me_ca_use_to: date });
	}

	lockCard = async (item: MemberCardDto) => {
		let self = this;
		let lock = item.me_ca_is_locked ? L("Unlocked") : L("lock");
		self.memberCardSelected.init(item);
		confirm({
			title: L('DoYouWantTo') + lock + "?",
			okText: lock,
			cancelText: L('Cancel'),
			async onOk() {
				self.setState({ isLoadDone: false });
				let result = await stores.memberCardStore.lockMemberCard(item.me_ca_id);
				if (result != undefined) {
					let mes = result.me_ca_is_locked ? L("lock") : L("Unlocked");
					message.success(L('Success'));
					await self.getAll()
				}
				self.setState({ isLoadDone: true });
			},
			onCancel() {
			},
		});
	}
	extendTimeCard = async (item: MemberCardDto) => {
		this.memberCardSelected.init(item);
		this.setState({ visibleExtendCard: true, me_ca_id: item.me_ca_id });
	}
	printRegisterForm = async (item: MemberCardDto) => {
		this.memberCardSelected.init(item);
		this.setState({ viewPrintRegisterForm: true, me_ca_id: item.me_ca_id });
	}

	rechargeCard = async (item: MemberCardDto) => {
		this.memberCardSelected.init(item);
		this.setState({ visibleRechargeCard: true, me_ca_id: item.me_ca_id });
	}
	approveCard = async (item: MemberCardDto) => {
		this.memberCardSelected.init(item);
		this.setState({ visibleFormCreateCardOnline: true, me_ca_id: item.me_ca_id, approveCard: true });
	}
	onSaveExtendCard = async () => {
		let input = new ExtendTimeMemberCardInput();
		input.me_ca_id = this.state.me_ca_id!;
		input.me_ca_use_to = this.state.extend_time!;
		await stores.memberCardStore.extendMemberCard(input);
		this.setState({ isLoadDone: true, visibleExtendCard: false });
	}

	async deleteMemberCard(memberCard: MemberCardDto) {
		let self = this;
		const { totalMemberCard } = stores.memberCardStore
		confirm({
			title: L('YouWantToDelete') + " " + L("MemberCard") + ": " + stores.sessionStore.getMemberNameById(memberCard.me_id) + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalMemberCard - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.memberCardStore.deleteMemberCard(memberCard);
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() { },
		});
	}
	printCardMember = async () => {
		if (this.listMemberCard.length > 0) {
			this.setState({ viewPrintCardMember: true });
		}
		else message.warning(L("ban_phai_chon_1_the_bat_ky"))

	}
	render() {

		const self = this;
		const { is_redirected_member_card, memberSelected } = this.props;
		let left, right;
		if (is_redirected_member_card) {
			left = this.state.visibleModalCreate ? AppConsts.cssPanel(0) : AppConsts.cssPanel(24);
			right = this.state.visibleModalCreate ? AppConsts.cssPanel(24) : AppConsts.cssPanel(0);
		} else {
			left = this.state.visibleModalCreate ? cssColResponsiveSpan(0, 0, 0, 0, 14, 12) : AppConsts.cssPanel(24);
			right = this.state.visibleModalCreate ? cssColResponsiveSpan(24, 24, 24, 24, 10, 12) : AppConsts.cssPanel(0);
		}
		const { memberCardListResult, totalMemberCard } = stores.memberCardStore;
		const { memberListResult } = stores.memberStore;
		const windowWidth = window.innerWidth;
		const span = { ...cssColResponsiveSpan(24, 12, 12, 6, 6, 6) };

		return (
			<Card>
				<Row >
					<Col {...cssColResponsiveSpan(24, 8, 12, 12, 12, 12)} >
						<h2>{L('MemberCard')} </h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 12, 12, 12, 12)} style={windowWidth <= 574 ? { textAlign: "left" } : { textAlign: "right" }}>
						&nbsp;&nbsp;
						{((!!memberSelected && memberSelected.me_has_card == false) || !memberSelected) &&
							((this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Create)) &&
								<Button style={{ marginBottom: 10 }} title={L('CreateNew')} type="primary" icon={<PlusOutlined />} onClick={() => this.createModalOpen()}>{L('CreateNew')}</Button>
							)
						}
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.Subscriber_MemberCard_Export) &&
							<Button style={{ marginBottom: 10 }} title={L('ExportData')} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportMemberCard: true })}>{L('ExportData')}</Button>
						}
					</Col>
				</Row>
				{!!this.props.memberSelected && this.props.memberSelected.me_id != undefined ?
					<Row>
						<Col span={6} style={{ textAlign: 'right', marginTop: '30px' }}>
							<Tag color='red' style={{ height: '10px', background: 'red' }}></Tag>
							<b>{L('MemberCardIsLocked')}</b>
						</Col>
					</Row>
					: <>
						<Row gutter={16} style={{ marginBottom: '5px' }}>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('Member')}:</strong>&nbsp;&nbsp;
								<SelectUser role_user={eUserType.Member.num} onClear={() => this.setState({ us_id_borrow: undefined })} update={this.state.isLoadDone} userItem={!!this.state.me_id ? [ItemUser.fromJS({ id: this.state.me_id })] : undefined} mode={undefined} onChangeUser={(value) => this.setState({ me_id: value[0].me_id })}></SelectUser>
							</Col>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('CardNumber')}:</strong>&nbsp;&nbsp;<Input value={this.state.me_ca_number} onChange={(e) => this.setState({ me_ca_number: e.target.value.trim() })} allowClear placeholder={L("nhap_tim_kiem")} onPressEnter={this.handleSubmitSearch} />
							</Col>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('CardCode')}:</strong>&nbsp;&nbsp;<Input value={this.state.me_ca_code} onChange={(e) => this.setState({ me_ca_code: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} allowClear onPressEnter={this.handleSubmitSearch} />
							</Col>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('Status')}:</strong>&nbsp;&nbsp;
								<SelectEnum eNum={eMCardStatus} enum_value={this.state.me_ca_status} onChangeEnum={async (value: number) => { await this.setState({ me_ca_status: value }) }} />
							</Col>
						</Row>
						<Row gutter={16} style={{ marginBottom: '5px' }}>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('ValidityStartDate')}:</strong>&nbsp;&nbsp;
								<DatePicker
									style={{ width: "100%" }}
									value={this.state.me_ca_use_from}
									onChange={(date: Moment | null) => this.onChangeDatePickerStart(date)}
									format='DD-MM-YYYY'
									placeholder={L("nhap_tim_kiem")}
									disabledDate={(current) => current ? current >= moment().endOf('day') : false}
								/>
							</Col>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('ExpirationDate')}:</strong>&nbsp;&nbsp;
								<DatePicker
									style={{ width: "100%" }}
									value={this.state.me_ca_use_to}
									onChange={(date: Moment | null) => this.onChangeDatePickerEnd(date)}
									format='DD-MM-YYYY'
									disabledDate={(current) => current ? current <= moment().startOf('day') : false}
									placeholder={L("nhap_tim_kiem")} />
							</Col>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('CardType')}:</strong>&nbsp;&nbsp;
								<SelectEnum eNum={eMCardType} enum_value={this.state.me_ca_type} onChangeEnum={async (value: number) => { await this.setState({ me_ca_type: value }) }} />
							</Col>
							<Col {...span} style={{ fontSize: '16px' }}>
								<strong>{L('CardState')}:</strong>&nbsp;&nbsp;
								<SelectState enum_value={this.state.me_ca_is_locked} onChangeEnum={async (value: boolean | undefined) => { await this.setState({ me_ca_is_locked: value }) }} />
							</Col>
						</Row>
						<Row align='bottom'>
							<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}>
								{this.state.noPrint ?
									<Col style={{ fontSize: '16px', marginTop: '25px' }}>
										<Badge count={this.state.totalItem}>
											<Button type='primary' title={L('PrintLibraryCard')} icon={<PrinterOutlined />} onClick={this.printCardMember} >{L("PrintLibraryCard")}</Button>
										</Badge>
									</Col>
									:
									<Col style={{ marginTop: '30px', display: "flex", justifyContent: "start", alignItems: "center" }}>
										<Tag color='red' style={{ height: '10px', background: 'red' }}></Tag>
										<b>{L('MemberCardIsLocked')}</b>
									</Col>
								}
							</Col>
							<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)} className='textAlign-col-576' >
								<Button style={{ margin: '0 0.5rem 0.5rem 0' }} type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
								{(this.state.me_id != undefined
									|| this.state.me_ca_id != undefined
									|| this.state.me_ca_number != undefined
									|| this.state.me_ca_code != undefined
									|| this.state.me_ca_status != undefined
									|| this.state.me_ca_use_from != undefined
									|| this.state.me_ca_use_to != undefined
									|| this.state.me_ca_type != undefined
									|| this.state.me_ca_is_locked != undefined
									|| this.state.extend_time != undefined
									|| this.state.me_ca_time_receive != undefined) &&
									<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
								}
							</Col>
						</Row>
					</>}
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainMemberCard
							isLoadDone={this.state.isLoadDone}
							isPrint={false}
							onActionMemberCard={this.onActionMemberCard}
							memberCardListResult={memberCardListResult}
							addListMemberCard={this.addListMemberCard}
							memberListResult={memberListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalMemberCard,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => {
									self.onChangePage(page, pagesize)

								}
							}}
						/>
					</Col>
					{this.state.visibleModalCreate &&
						<Col {...right}>
							<CreateOrUpdateMemberCard
								onCreateUpdateSuccess={this.onCreateSuccess}
								onCancel={() => this.setState({ visibleModalCreate: false })}
								memberCardSelected={new MemberCardDto}
								me_id={!!this.props.memberSelected ? this.props.memberSelected.me_id : undefined}
								me_name={!!this.props.memberSelected ? this.props.memberSelected.me_name : undefined}
							/>
						</Col>
					}
				</Row>
				<ModalExportMemberCard
					memberCardListResult={memberCardListResult}
					memberListResult={memberListResult}
					visible={this.state.visibleExportMemberCard}
					onCancel={() => this.setState({ visibleExportMemberCard: false })}
				/>
				<ModalPrintRegistrationForm
					memberCardSelected={this.memberCardSelected}
					memberSelected={memberListResult.find((item) => item.me_id == this.memberCardSelected.me_id)}
					visible={this.state.viewPrintRegisterForm}
					onCancel={() => this.setState({ viewPrintRegisterForm: false })}
				/>
				{this.state.viewPrintCardMember &&
					<ModalPrintCardMember
						listMemberCard={this.listMemberCard}
						memberListResult={memberListResult}
						visible={this.state.viewPrintCardMember}
						onCancel={() => this.setState({ viewPrintCardMember: false })}
					/>
				}
				<Modal
					visible={this.state.visibleExtendCard}
					title={
						<Row style={{ justifyContent: 'end', }}>
							<Button danger onClick={() => this.setState({ visibleExtendCard: false })}>{L('Exit')}</Button>
							&nbsp;
							{this.state.extend_time != undefined &&
								<Button type='primary' onClick={this.onSaveExtendCard}>{L('Save')}</Button>
							}
						</Row>
					}
					footer={null}
					width='50vw'
					closable={false}
					maskClosable={false}
					onCancel={() => { this.setState({ visibleExtendCard: false }) }}
				>
					<ExtendCardForm
						memberCardSelected={this.memberCardSelected}
						memberSelected={memberListResult.find((item) => item.me_id == this.memberCardSelected.me_id)}
						onChangeExtendTime={(value) => this.setState({ extend_time: value })}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleRechargeCard}
					footer={null}
					width='60vw'
					closable={false}
					maskClosable={false}
					onCancel={() => { this.setState({ visibleRechargeCard: false }) }}
				>
					<TabReChargeOrAddMoneyCard
						memberCardSelected={this.memberCardSelected}
						memberSelected={memberListResult.find((item) => item.me_id == this.memberCardSelected.me_id)}
						onCancel={() => this.setState({ visibleRechargeCard: false })}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleFormCreateCardOnline}
					onCancel={() => this.setState({ visibleFormCreateCardOnline: false })}
					closable={false}
					maskClosable={false}
					footer={null}
				>
					<FormCreateMemberCardOnline
						onCancel={() => this.setState({ visibleFormCreateCardOnline: false })}
						onSuccessRegister={async () => await this.getAll()}
						memberCardSelected={this.memberCardSelected}
						approveCard={this.state.approveCard}
					></FormCreateMemberCardOnline>

				</Modal>
				<Modal
					visible={this.state.visibleInformationCard}
					onCancel={() => this.setState({ visibleInformationCard: false })}
					closable={true}
					maskClosable={true}
					footer={null}
					width='55vw'
				>
					<InformationCard
						memberCard={this.memberCardSelected}
						member={memberListResult}
					></InformationCard>

				</Modal>
			</Card>
		)
	}
}