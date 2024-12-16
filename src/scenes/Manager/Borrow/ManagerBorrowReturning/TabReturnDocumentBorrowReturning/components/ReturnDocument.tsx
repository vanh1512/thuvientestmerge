import * as React from 'react';
import { Col, Row, Button, Card, Input, message, Tag, Modal, Table, InputNumber, } from 'antd';
import { AttachmentItem, BorrowReturningDetailsWithListDocumentDto, BorrowReturningIDetailDto, DeliveryDocumentInput, GetDocumentInforByDKCBDto, FindMemberBorrowDto, ReturnBorrowReturningDetailItem, ReturnDocumentInput, CreatePunishInput, PunishDto, MemberDto, MemberCardDto, RechargeCardInput, BorrowReturningDto } from '@services/services_autogen';
import { eBorrowReturningDetailStatus, ePunishError, valueOfePunishError, } from '@src/lib/enumconst';
import AppConsts, { FileUploadType, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import InformationMember from '@src/scenes/Manager/Member/components/InformationMember';
import { CheckCircleOutlined, } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import CreatePunish from './CreatePunish';
import moment from 'moment';
import AppSetting from '@src/lib/appsetting';
import RechargeCard from '@src/scenes/Manager/MemberCard/components/RechargeCard';

export class ErrorColumns {
	do_title: string | undefined;
	dkcb_code: string | undefined;
	pun_error: number | undefined;
	pun_money: number | undefined;
}

export interface IProps {
	detailBorrow: BorrowReturningDetailsWithListDocumentDto;
	memberBorrow: FindMemberBorrowDto,
	borrowReSelected: BorrowReturningDto,
	onCancel: () => void;
	onSuccessAction: () => void;
	onSuccessRecharge: (item: BorrowReturningDto) => void;

}
const DEFAULT_MONEY_OUT_OF_DATE: number = abp.setting.get(AppSetting.GeneralSettings_DefaultMoneyOutOfDate);

export default class ReturnDocument extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalPunish: false,
		visibleModalRechargeMoney: false,
		inputDKCBCode: '',
		punishMoney: undefined,
		isLost: true,
		outDate: 0,
		moneyCard: -1
	};
	listAttachmentItem_file: AttachmentItem[] = [];
	detailBorrowPunish: BorrowReturningIDetailDto;
	detailBorrowLost: BorrowReturningIDetailDto;
	punishListResult: PunishDto[] = [];
	punishListInput: CreatePunishInput[] = [];
	memberSelected: MemberDto = new MemberDto;
	memberCardSelected: MemberCardDto = new MemberCardDto;
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		this.memberSelected.init(this.props.memberBorrow);
		this.memberCardSelected.init(this.props.memberBorrow.memberCard);
		await stores.punishStore.getPunishWithBorrowReturning(this.props.detailBorrow.br_re_id, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
		this.setState({ isLoadDone: true });

	}

	onSaveReturnRequest = async () => {
		const { detailBorrow } = this.props;
		let input = new ReturnDocumentInput();
		input.br_re_id = detailBorrow.br_re_id;
		input.list_document = [];
		input.fi_id_arr = this.listAttachmentItem_file;
		detailBorrow.list_borrow!.forEach(element => {
			let item = new ReturnBorrowReturningDetailItem();
			if (element.br_re_status === eBorrowReturningDetailStatus.DANG_QUET.num) {
				item.br_re_de_id = element.br_re_de_id;
				item.do_id = element.do_id;
				item.do_in_id = element.do_in_id;
				item.has_lost = false;
				input.list_document!.push(item);
			}
			if (element.br_re_status === eBorrowReturningDetailStatus.DANG_BAO_MAT.num) {
				item.br_re_de_id = element.br_re_de_id;
				item.do_id = element.do_id;
				item.do_in_id = element.do_in_id;
				item.has_lost = true;
				input.list_document!.push(item);
			}
		});
		await stores.borrowReturningStore.returnDocument(input);
		message.success(L("SuccessFullyReturned"));
		await this.onSuccessAction();
	}
	handleCheckBorrow = async (value: string) => {
		if (value == undefined || value == "") {
			message.error(L('PleaseEnterTheĐkcbNumber.'));
			return;
		}
		let dkcbCode = this.props.detailBorrow.list_borrow!.find(doc => this.punishListResult.find(item => item.br_re_de_id == doc.br_re_de_id))?.documentInfor.dkcb_code;
		if (value == dkcbCode) {
			message.error(L('Đã quét mã dkcb này'));
			return;
		}
		let result: GetDocumentInforByDKCBDto = await stores.borrowReturningStore.getDocumentInforByDKCB(value);

		if (!!result) {
			const item = this.props.detailBorrow.list_borrow!.find(item => item.do_in_id === result.documentInfo.do_in_id && (item.br_re_status != eBorrowReturningDetailStatus.DA_TRA.num));
			if (item !== undefined) {
				this.setState({ isLoadDone: false });
				item.br_re_status = eBorrowReturningDetailStatus.DANG_QUET.num;
				const endDate = new Date(moment(item.br_re_end_at!).format("YYYY/MM/DD"));
				const now = new Date();
				let outOfDate: number = (now.getDate() - endDate.getDate());
				if (outOfDate > 0) {
					this.setState({ outDate: outOfDate });
					let punish: PunishDto = new PunishDto();
					punish.br_re_de_id = item.br_re_de_id;
					punish.us_id_borrow = item.us_id_borrow
					punish.pun_error = 2;
					punish.pun_id = -1;
					punish.pun_reason = "Quá hạn";
					punish.pun_money = DEFAULT_MONEY_OUT_OF_DATE * Math.round(outOfDate);
					this.punishListResult.push(punish);

					let punishInput: CreatePunishInput = new CreatePunishInput();
					punishInput.br_re_de_id = punish.br_re_de_id;
					punishInput.us_id_borrow = punish.us_id_borrow;
					punishInput.pun_reason = punish.pun_reason;
					punishInput.pun_error = punish.pun_error;
					punishInput.pun_money = punish.pun_money;
					this.punishListInput.push(punishInput);
					message.error(L('OutDateDocument.'));
				}
				message.success(L('DocumentScannedSuccessfully.'));
				this.setState({ inputDKCBCode: '', isLoadDone: true });
			} else {
				message.warning(L('NoDocumentFound.'))
			}
		}
	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}
	punish = (item: BorrowReturningIDetailDto) => {
		this.setState({ visibleModalPunish: true, isLost: false });
		this.detailBorrowPunish = item;
	}
	lost = (item: BorrowReturningIDetailDto) => {
		this.setState({ visibleModalPunish: true });
		this.detailBorrowLost = item;
	}

	onSuccessAction = () => {
		if (!!this.props.onSuccessAction) {
			this.props.onSuccessAction();
		}
	}
	onChangeStatus = (item: BorrowReturningIDetailDto) => {
		item.br_re_status = eBorrowReturningDetailStatus.DANG_BAO_MAT.num;
	}
	change = (input: PunishDto) => {
		this.setState({ isLoadDone: false });
		let punish: PunishDto = input;
		punish.pun_id = -1;
		this.punishListResult.push(punish);
		let item: CreatePunishInput = new CreatePunishInput();
		item.br_re_de_id = input.br_re_de_id;
		item.us_id_borrow = input.us_id_borrow;
		item.pun_reason = input.pun_reason;
		item.pun_error = input.pun_error;
		item.pun_money = input.pun_money;
		this.punishListInput.push(item);
		this.setState({ isLoadDone: true, });
	}
	onCreatePunish = async () => {
		await stores.punishStore.createPunish(this.punishListInput);
		await this.onSaveReturnRequest();
		message.success(L("Success"));
	}
	onChangePunishMoney = async (value: number | undefined | string, br_re_de_id: number, pun_error: number) => {
		if (value == undefined) {
			value = 0;
		}
		this.punishListInput.find(item => item.br_re_de_id == br_re_de_id && item.pun_error == pun_error)!.pun_money = Number(value);
		return Number(value);
	}
	calculateTotal = () => {
		let total = 0;
		this.punishListResult.forEach((row) => {
			total += row.pun_money;
		});
		return total;
	};
	onSaveOrChangeRechargeCard = async () => {
		this.setState({ isLoadDone: false });
		let input = new RechargeCardInput();
		input.me_ca_id = this.memberCardSelected!.me_ca_id;
		input.me_ca_money = this.state.moneyCard!;
		if (/^\d+$/.test(this.state.moneyCard.toString())) {
			if (+this.state.moneyCard.toString() <= 0) {
				message.error(L("so_tien_phai_lon_hon_0"));
				return;
			}
			await stores.memberCardStore.rechargeCard(input);
			message.success(L("nap_tien_thanh_cong"));
		}
		else {
			message.error(L("chi_nhap_so_nguyen_duong"));
			return;
		}
		if (!!this.props.onSuccessRecharge) {
			this.props.onSuccessRecharge(this.props.borrowReSelected);
		}
		this.setState({ isLoadDone: true, visibleModalRechargeMoney: false });
	}
	render() {
		const { detailBorrow } = this.props;
		let left = this.state.visibleModalPunish ? { ...cssColResponsiveSpan(24, 24, 12, 12, 12, 12) } : cssCol(24);
		let right = this.state.visibleModalPunish ? { ...cssColResponsiveSpan(24, 24, 12, 12, 12, 12) } : cssCol(0);
		const self = this;
		const columns = [
			{
				title: L('DocumentName'), key: 'code_borrowReturning',
				render: (text: string, item: PunishDto) => <div>{this.props.detailBorrow.list_borrow!.find(doc => doc.br_re_de_id == item.br_re_de_id)!.document.do_title}</div>
			},
			{
				title: L('CodeDkcb'), key: 'us_borrowReturning',
				render: (text: string, item: PunishDto) => <div>{this.props.detailBorrow.list_borrow!.find(doc => doc.br_re_de_id == item.br_re_de_id)!.documentInfor.dkcb_code}</div>
			},
			{
				title: L('BorrowDate'), key: 'br_re_start_at',
				render: (text: string, item: PunishDto) => <div>{moment(this.props.detailBorrow.list_borrow!.find(doc => doc.br_re_de_id == item.br_re_de_id)!.br_re_start_at).format("DD/MM/YYYY")}</div>
			}, {
				title: L('ngay_hen_tra'), key: 'br_re_de_return_at',
				render: (text: string, item: PunishDto) => <div>{moment(this.props.detailBorrow.list_borrow!.find(doc => doc.br_re_de_id == item.br_re_de_id)!.br_re_de_return_at).format("DD/MM/YYYY")}</div>
			},
			{
				title: L('loi'), key: 'create_borrowReturning',
				render: (text: string, item: PunishDto) => <div>{valueOfePunishError(item.pun_error)}</div>
			},
			{
				title: L('ly_do_phat'), key: 'create_borrowReturning',
				render: (text: string, item: PunishDto) => <div>{item.pun_reason}</div>
			},
			{
				title: L('PunishmentMoney'), key: 'received_borrowReturning',
				render: (text: string, item: PunishDto) =>
					<div>
						{item.pun_error == ePunishError.QUA_HAN.num ?
							AppConsts.formatNumber(item.pun_money)
							:
							<InputNumber
								min={0}
								onBlur={() => this.setState({ isLoadDone: false })}
								formatter={a => AppConsts.numberWithCommas(a)}
								parser={a => a!.replace(/\$s?|(,*)/g, '')}
								value={item.pun_money}
								onChange={async (value) => item.pun_money = await this.onChangePunishMoney(value, item.br_re_de_id, item.pun_error)} />
						}
						(VNĐ)
					</div>

			},
			{
				title: L('Status'), key: 'borrowReturning',
				render: (text: string, item: PunishDto) => <div>
					{item.pun_id < 0 ? <Tag color='red'>{L("chua_phat")}</Tag> : <Tag color='green'>{L("da_phat")}</Tag>}
				</div>
			},
		];


		return (
			<>
				<InformationMember memberSelected={this.props.memberBorrow} />
				<Row>
					<Col span={24}><h3>{L('ListOfRegisteredDocumentBorrowings')}</h3></Col>
				</Row>

				<Row style={{ justifyContent: 'center', margin: '0 0 20px 0' }}>
					<Col offset={8} span={10}>
						<Input onPressEnter={() => this.handleCheckBorrow(this.state.inputDKCBCode)} onChange={(e) => this.setState({ inputDKCBCode: e.target.value.trim() })} allowClear placeholder={L("ma_dang_ky_ca_biet")} />
					</Col>
					<Col span={2} >
						<Button onClick={() => this.handleCheckBorrow(this.state.inputDKCBCode)} type='primary'><CheckCircleOutlined /></Button>
					</Col>
					<Col span={4} style={{ textAlign: 'right' }}>
						<Button onClick={() => this.setState({ visibleModalRechargeMoney: true })} type='primary'>{L('Recharge')}</Button>
					</Col>
				</Row>
				<Row gutter={[8, 8]} style={{ marginBottom: '10px' }}>
					<Col {...left}>
						{detailBorrow != undefined && detailBorrow.list_borrow!.map((item: BorrowReturningIDetailDto, index: number) =>
							<Row key={index + "_"} gutter={16} style={{ padding: '3px', justifyContent: 'start', alignItems: 'center', marginTop: '5px', backgroundColor: index % 2 == 0 ? '#f1f3f4' : '#fff' }}>
								<Col {...cssColResponsiveSpan(12, 4, 8, 4, 4, 4)}>
									<b>{L('DocumentNumber') + (index + 1) + ": "}</b>
								</Col>
								<Col {...cssColResponsiveSpan(12, 8, 8, 8, 8, 8)}>
									{item.document.do_title}
								</Col>
								<Col {...cssColResponsiveSpan(12, 8, 8, 8, 8, 8)}>
									<>
										<b>{L('CodeDkcb')}: </b>{item.documentInfor != undefined ? <span>{item.documentInfor.dkcb_code}</span> : ""}
										&nbsp;&nbsp;
										{item.br_re_status == eBorrowReturningDetailStatus.DA_TRA.num &&
											<Tag color='f50' style={{ backgroundColor: '#f50', transform: 'rotateZ(-5deg)', fontSize: '10px' }}>{L('Returned')}</Tag>
										}
										{item.br_re_status == eBorrowReturningDetailStatus.DANG_QUET.num &&
											<Tag color='f50' style={{ backgroundColor: 'green', transform: 'rotateZ(-5deg)', fontSize: '10px' }}>{L('Scanning')}</Tag>
										}
										{(item.br_re_status == eBorrowReturningDetailStatus.MAT.num) &&
											<Tag color='f50' style={{ backgroundColor: 'red', transform: 'rotateZ(-5deg)', fontSize: '10px' }}>{L('LostNotification')}</Tag>
										}
										{(item.br_re_status == eBorrowReturningDetailStatus.DANG_BAO_MAT.num) &&
											<Tag color='f50' style={{ backgroundColor: 'yellow', color: 'red', transform: 'rotateZ(-5deg)', fontSize: '10px' }}>{L('ReportingLost')}</Tag>
										}
									</>
								</Col>
								<Col {...cssColResponsiveSpan(12, 4, 4, 4, 4, 4)} style={{ textAlign: 'center' }}>
									{(item.br_re_status == eBorrowReturningDetailStatus.DANG_QUET.num) &&
										<Button style={{ backgroundColor: 'red', color: '#fff' }} onClick={() => this.punish(item)} title={L('Punish')}>{L('Punish')}</Button>
									}
									{(item.br_re_status == eBorrowReturningDetailStatus.DANG_MUON.num) &&
										<Button danger onClick={() => this.lost(item)} title={L('LostNotification')}>{L('LostNotification')}</Button>
									}
								</Col>
							</Row>
						)}
					</Col>
					<Col {...right}>
						<CreatePunish
							isLost={this.state.isLost}
							punishSelected={this.detailBorrowPunish}
							lostSelected={this.detailBorrowLost}
							us_is_borrow={detailBorrow.us_id_borrow}
							onCancel={() => this.setState({ visibleModalPunish: false })}
							onChangeStatus={this.onChangeStatus}
							change={this.change}
						></CreatePunish>
					</Col>
				</Row>

				<Row >
					<Table
						className='centerTable'
						rowKey={record => Math.random() + "_" + record.pun_id}
						bordered={true}
						scroll={{ x: 500 }}
						dataSource={[...this.punishListResult]}
						columns={columns}
						locale={{ "emptyText": L('NoData') }}
						style={{ width: '100%' }}
						footer={() => (
							<div style={{ display: 'flex' }}>
								<Col span={16} ><strong>{L("Total") + "(" + L("chua_phat") + ")"}</strong> </Col>
								<Col span={11} style={{ marginLeft: '10px' }}><strong>{this.calculateTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong> </Col>
							</div>
						)}
					/>
				</Row>
				<Row style={{ textAlign: "right", marginTop: "20px" }}>
					<Col span={24}>
						<Button danger onClick={() => this.onCancel()}>{L('Exit')}</Button>
						&nbsp;
						<Button type='primary' onClick={() => this.onCreatePunish()}>{L('Save')}</Button>
					</Col>
				</Row>
				<Modal
					visible={this.state.visibleModalRechargeMoney}
					closable={false}
					maskClosable={false}
					footer={null}
					width={'60vw'}
					title={
						<Row style={{ justifyContent: 'end', }}>
							<Button style={{ margin: '0 0.5em 0.5em 0' }} danger onClick={() => { this.setState({ visibleModalRechargeMoney: false }) }}>{L('Cancel')}</Button>
							<Button type='primary' title={L('Save')} onClick={() => this.onSaveOrChangeRechargeCard()}>{L('Save')}</Button>
						</Row>
					}
				>
					<RechargeCard
						changed={false}
						memberCardSelected={this.memberCardSelected}
						memberSelected={this.memberSelected}
						onChangeRechargeCard={(value: number) => this.setState({ moneyCard: value })}
					></RechargeCard>
				</Modal>
			</>
		)
	}
}