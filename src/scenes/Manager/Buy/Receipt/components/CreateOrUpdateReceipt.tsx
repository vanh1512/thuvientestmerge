import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message, DatePicker, Checkbox, Tag } from 'antd';
import { L } from '@lib/abpUtility';
import { ReceiptDto, CreateReceiptInput, UpdateReceiptInput, PlanDto, PlanDetailDto, ContractDto, BillingItemDto } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import moment from 'moment';
import SelectPlan from '@src/components/Manager/SelectPlan';
import { ePlanDetailStatus } from '@src/lib/enumconst';
import TableMainCreate from './TableMainCreate';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SelectContract from '@src/components/Manager/SelectContract';
import rules from '@src/scenes/Validation';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { SearchOutlined } from '@ant-design/icons';
import GetNameItem from '@src/components/Manager/GetNameItem';

export interface IProps {
	onCreateUpdateSuccess?: (receipt: ReceiptDto) => void;
	onCancel: () => void;
	receiptSelected: ReceiptDto;
	contractSelected?: ContractDto;
}

export default class CreateOrUpdateReceipt extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		filter: undefined,
		idSelected: -1,
		co_id: -1,
		indeterminate: false,
		checkAll: false,
		listBillingItemId: [],
		rec_import_date: undefined || moment(),
	}
	receiptSelected: ReceiptDto;
	billingItemList: BillingItemDto[] = [];
	billingItemListDisplay: BillingItemDto[] = [];

	async componentDidMount() {
		this.initData(this.props.receiptSelected);
		if (this.props.receiptSelected != undefined && this.props.receiptSelected.co_id != undefined) {
			await this.onChangeContract(this.props.receiptSelected.co_id);
		}
		if (this.props.contractSelected != undefined && this.props.contractSelected.co_id != undefined) {
			await this.onChangeContract(this.props.contractSelected.co_id);
		}
		if (this.props.receiptSelected != undefined && this.props.receiptSelected.bi_it_id_arr != undefined) {
			await this.onChangeCheckBox(this.props.receiptSelected.bi_it_id_arr);
		}

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.receiptSelected.rec_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.receiptSelected.rec_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.receiptSelected);
		}
	}

	initData = async (inputReceipt: ReceiptDto | undefined) => {
		this.setState({ isLoadDone: false, rec_import_date: undefined });
		if (inputReceipt == undefined) {
			inputReceipt = new ReceiptDto();
		}
		if (inputReceipt !== undefined && inputReceipt.rec_id !== undefined) {
			let dateImport = moment(inputReceipt.rec_import_date);
			this.setState({ rec_import_date: dateImport });
		}
		if (inputReceipt.rec_reason == null) {
			inputReceipt.rec_reason = "";
		}
		if (!this.props.contractSelected) {
			await stores.contractStore.getAll(undefined, undefined, undefined, undefined, undefined);
		}
		await this.formRef.current!.setFieldsValue({ ...inputReceipt });
		this.onChangeCheckBox(this.billingItemList.map(item => item.bi_it_id));
		await this.setState({ isLoadDone: true });
	}

	onCreateUpdate = () => {
		if (this.billingItemListDisplay.length > 0) {
			const { receiptSelected } = this.props;

			const form = this.formRef.current;
			form!.validateFields().then(async (values: any) => {
				this.setState({ isLoadDone: false });
				if (receiptSelected.rec_id === undefined || receiptSelected.rec_id < 0) {
					let unitData = new CreateReceiptInput(values);
					unitData.bi_it_id_arr = this.state.listBillingItemId;
					await stores.receiptStore.createReceipt(unitData);
					message.success(L("CreateSuccessfully"));
					this.formRef.current.resetFields();
				} else {
					let unitData = new UpdateReceiptInput({ rec_id: receiptSelected.rec_id, ...values });
					unitData.bi_it_id_arr = this.state.listBillingItemId;
					await stores.receiptStore.updateReceipt(unitData);

					message.success(L("EditSuccessfully"));
				}
				await this.onCreateUpdateSuccess();
				this.setState({ isLoadDone: true });
			})
		}
		else {
			message.error(L("Khong_co_tai_lieu_duoc_chon"));
			return;

		}
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.receiptSelected);
		}
	}
	checkDateInit = (date: string): moment.Moment | undefined => {
		if (date == "" || date == undefined) {
			return undefined;
		}
		return moment(date);
	};
	onChangeDate = async (date: moment.Moment | null) => {
		await this.setState({ rec_import_date: date });
		this.formRef.current!.setFieldsValue({ rec_import_date: this.state.rec_import_date });
	};
	onChangeContract = async (co_id: number) => {
		this.setState({ isLoadDone: false });
		await this.formRef.current!.setFieldsValue({ co_id: co_id });
		this.setState({ co_id: co_id });
		this.billingItemList = await stores.contractStore.getAllBillingItem(co_id);
		if (this.billingItemList.length > 0) {
			this.billingItemList = this.billingItemList.filter(item => item.pl_de_id > 0);
		}
		await this.onChangeCheckBox([]);
		this.setState({ isLoadDone: true });
	};
	onChangeCheckBox = async (listItem: CheckboxValueType[] | undefined) => {
		this.setState({ isLoadDone: false });
		if (listItem != undefined) {
			const lengthNotImportedBillingItemList = this.billingItemList.filter(item => item.bi_it_status !== ePlanDetailStatus.da_nhap_kho.num).length
			await this.setState({
				listBillingItemId: listItem,
				indeterminate: !!listItem.length && listItem.length < lengthNotImportedBillingItemList,
				checkAll: listItem.length === lengthNotImportedBillingItemList,
			});
			this.billingItemListDisplay = await stores.billingItemStore.getByListId(this.state.listBillingItemId);
		}
		this.setState({ isLoadDone: true });
	};
	async findDocumentInPlan(filter: string | undefined) {
		this.setState({ isLoadDone: false })
		if (filter == undefined) {
			this.billingItemList = await stores.contractStore.getAllBillingItem(this.state.co_id);
			if (this.billingItemList.length > 0) {
				this.billingItemList = this.billingItemList.filter(item => item.pl_de_id > 0);
			}
		} else {
			this.billingItemList = this.billingItemList.filter(item => AppConsts.boDauTiengViet1(item.bi_it_name!.toLowerCase()).includes(AppConsts.boDauTiengViet1(filter.toLowerCase())));
		}
		this.setState({ isLoadDone: true, filter: undefined });
	}
	onCheckAllChange = async () => {
		const arr = this.state.checkAll === true ? [] : this.billingItemList
			.filter(item => item !== null && item.bi_it_status != ePlanDetailStatus.da_nhap_kho.num)
			.map(item => item.bi_it_id);
		this.onChangeCheckBox(arr);
	};
	render() {
		const { receiptSelected, contractSelected } = this.props;
		return (
			<>
				<Row>
					<Col span={12}><h3>{this.state.idSelected === undefined ? L("CreateReceipt") : L('Edit') + " " + L('Receipt') + ": "}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("Cancel")}
						</Button>
						<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("Save")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef}>
						<Row gutter={[16, 16]}>
							<Col span={12}>
								<Row gutter={16}>
									{/* <Col span={12}>
										<label><span style={{ color: 'red' }}>*</span>{L("ReceiptIndex")}</label>
										<Form.Item rules={[rules.required, rules.chucai_so_kytudacbiet]} name={'rec_code'}>
											<Input maxLength={AppConsts.maxLength.name} style={{ width: '100%' }} placeholder={L("ReceiptIndex") + "...."} />
										</Form.Item>
									</Col> */}
									<Col {...cssColResponsiveSpan(24, 24, 24, 10, 10, 10)}>
										<label><span style={{ color: 'red' }}>*</span>{L("ImportingDate")}</label>
										<Form.Item rules={[rules.required]} name={'rec_import_date'} valuePropName={'rec_import_date'}>
											<DatePicker placeholder={L("ImportingDate") + "..."} style={{ width: '100%' }} format={"DD/MM/YYYY"} value={this.state.rec_import_date} onChange={this.onChangeDate} />
										</Form.Item>
									</Col>
									{contractSelected == undefined ?
										<Col {...cssColResponsiveSpan(24, 24, 24, 14, 14, 14)}>
											<label><span style={{ color: 'red' }}>*</span>{L("Contract")}</label>
											<Form.Item rules={[rules.required]} name={'co_id'} >
												<SelectContract co_id={receiptSelected.co_id} onChangeContract={async (contractDto: number) => this.onChangeContract(contractDto)} />
											</Form.Item>
										</Col>

										:
										<>
											<label><span style={{ color: 'red' }}>*</span>{L("Contract")}: </label>
											<div>
												<b>
													{contractSelected.co_name}
												</b>
											</div>
										</>
									}
								</Row>
								{/* <Row gutter={[16, 16]}>
									{contractSelected == undefined ?
										<Col span={24}>
											<label><span style={{ color: 'red' }}>*</span>{L("Contract")}</label>
											<Form.Item rules={[rules.required]} name={'co_id'} >
												<SelectContract co_id={receiptSelected.co_id} onChangeContract={async (contractDto: number) => this.onChangeContract(contractDto)} />
											</Form.Item>
										</Col>

										:
										<>
											<label><span style={{ color: 'red' }}>*</span>{L("Contract")}: </label>
											<div>
												<b>
													{contractSelected.co_name}
												</b>
											</div>
										</>
									}
								</Row> */}
								<Row>
									<Col span={24}>

										<label>{L("ReceiptReason")}</label>
										<Form.Item name={'rec_reason'} valuePropName='data'
											getValueFromEvent={(event, editor) => {
												const data = editor.getData();
												return data;
											}}
										>
											<CKEditor editor={ClassicEditor} disable={true} />
										</Form.Item>

									</Col>
								</Row>
							</Col>
							<Col span={12} style={{ backgroundColor: '#ebebeb', padding: '5px', borderRadius: '5px' }}>
								<Row><strong>{L("DocumentListOfPlan")} </strong></Row>
								<Row>
									<Input allowClear onPressEnter={() => this.findDocumentInPlan(this.state.filter)} onChange={(e) => this.setState({ filter: e.target.value })} placeholder={L("nhap_tim_kiem")} style={{ width: '80%' }} />
									<Button onClick={() => this.findDocumentInPlan(this.state.filter)} type='primary'><SearchOutlined /></Button>
								</Row>
								<Row>
									{(!!this.billingItemList && this.billingItemList.length > 0 && this.billingItemList.some(item => item.bi_it_status !== ePlanDetailStatus.da_nhap_kho.num)) &&
										<Checkbox indeterminate={this.state.indeterminate} checked={this.state.checkAll} onChange={this.onCheckAllChange}>
											{L("ChooseAll")}
										</Checkbox>
									}
									<Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeCheckBox} value={this.state.listBillingItemId} >
										<Col>
											{this.billingItemList != undefined && this.billingItemList.length > 0 && this.billingItemList.map((item: BillingItemDto, index: number) =>
												<Row key={index}>
													{item.bi_it_status !== ePlanDetailStatus.da_nhap_kho.num ?
														<Checkbox
															key={"key_check_" + index}
															disabled={item.bi_it_status == ePlanDetailStatus.da_nhap_kho.num ? true : false}
															value={item.bi_it_id}
															style={{ marginLeft: 0 }}
														>
															{`${index + 1}. ${item.bi_it_name} - ${GetNameItem.getCodeBilling(item.bi_id)}`}
														</Checkbox>
														:
														<div>{`${index + 1}. ${item.bi_it_name} - ${GetNameItem.getCodeBilling(item.bi_id)}`}&nbsp;&nbsp;{<Tag color='f50' style={{ backgroundColor: '#f50', transform: 'rotateZ(-5deg)', fontSize: '10px' }}>{'Đã nhập'}</Tag>}</div>
													}
												</Row>

											)}
										</Col>

									</Checkbox.Group>
								</Row>
							</Col>
						</Row>
					</Form>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<TableMainCreate
						billingItemListDisplay={this.billingItemListDisplay}
					/>
				</Row>
			</ >
		)
	}
}