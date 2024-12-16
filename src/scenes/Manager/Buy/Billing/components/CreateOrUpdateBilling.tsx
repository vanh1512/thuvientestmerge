import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, Select, message, Checkbox, Tag, Table } from 'antd';
import { L } from '@lib/abpUtility';
import { AttachmentItem, BillingDto, CreateBillingInput, CreatePlanDetailArrInput, ItemSupplier, PlanDetailDto, PlanDto, UpdateBillingInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import moment, { Moment } from 'moment';
import SelectedSupplier from '@src/components/Manager/SelectedSupplier';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { ePlanDetailStatus } from '@src/lib/enumconst';
import BillingItem from '../BillingItem';
import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import FileAttachments from '@src/components/FileAttachments';
import rules from '@src/scenes/Validation';
import { ColumnsType } from 'antd/lib/table';

export interface IProps {
	billingSelected: BillingDto;
	co_id: number;
	onCreateUpdateSuccess?: () => void;
	onCancel: () => void;
	changeStatus?: () => void;
	changeBilling?: (item: BillingDto) => void;
}
const dateFormat = 'DD/MM/YYYY';
export default class CreateOrUpdateBilling extends React.Component<IProps>{
	private formRef: any = React.createRef();
	private buttonAddOrDeleteRef: any = React.createRef();

	state = {
		isLoadDone: false,
		disabled: false,
		disabledIsExistBillingItem: false,
		billing_id: -1,
		bi_export: moment() || null,
		listPlanDetailId: [],
		co_id: undefined,
		isLoadFile: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
	}

	listAttachmentItem: AttachmentItem[] = [];
	planDetailList: PlanDetailDto[] = [];
	billing_selected: BillingDto = new BillingDto();

	async componentDidMount() {

		await this.initData(this.props.billingSelected);
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.props.billingSelected!.bi_id !== prevProps.billingSelected.bi_id) {
			await this.initData(this.props.billingSelected);
		}
	}
	initData = async (inputBilling: BillingDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputBilling == undefined) {
			inputBilling = new BillingDto();
		}
		if (inputBilling.bi_id !== undefined) {
			this.setState({ bi_export: moment(inputBilling.bi_export, dateFormat), listPlanDetailId: inputBilling.pl_de_id_arr });
			this.listAttachmentItem = (inputBilling.fi_id_arr === undefined) ? [] : inputBilling.fi_id_arr.filter(item => item.isdelete == false);
			await this.formRef.current!.setFieldsValue({ ...inputBilling });
		} else {
			this.listAttachmentItem = [];
		}
		this.planDetailList = await stores.planDetailStore.getByContractId(this.props.co_id);
		this.setState({ billing_id: inputBilling.bi_id });
		await this.formRef.current!.setFieldsValue({ ...inputBilling });
		await this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
	}
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.onCreateUpdateSuccess();
		})
	}
	onCreateUpdate = () => {
		const { billingSelected, co_id } = this.props;
		this.setState({ isLoadDone: false });
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (billingSelected.bi_id === undefined || billingSelected.bi_id < 0) {
				let unitData = new CreateBillingInput(values);
				unitData.co_id = co_id;
				unitData.pl_de_id_arr = this.state.listPlanDetailId;
				unitData.fi_id_arr = this.listAttachmentItem;
				this.billing_selected = await stores.billingStore.createBilling(unitData);
				this.setState({ billing_id: this.billing_selected.bi_id, isLoadDone: true });
				this.changeBilling(this.billing_selected);
				// await this.changeStatus();
				message.success(L("CreateSuccessfully"));
			} else {
				let unitData = new UpdateBillingInput({ bi_id: billingSelected.bi_id, ...values });
				unitData.supplier = values.su_id;
				unitData.fi_id_arr = this.listAttachmentItem;
				await stores.billingStore.updateBilling(unitData);
				message.success(L("EditSuccessfully"));
				await this.onCreateUpdateSuccess();
			}
		})
		this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}
	onLoadTableDocumentInBilling = async () => {
		this.setState({ isLoadDone: false });
		this.planDetailList = await stores.planDetailStore.getByContractId(this.props.co_id);
		this.setState({ isLoadDone: true });

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess();
		}
	}

	changeStatus = () => {
		if (!!this.props.changeStatus) { this.props.changeStatus(); }
	}
	onChangePlan = async (planDto: PlanDto) => {
		this.setState({ isLoadDone: false });
		await this.formRef.current!.setFieldsValue({ pl_id: planDto.pl_id });
		this.onChangeCheckBox([]);
		this.setState({ isLoadDone: true });
	};
	onCheckAction = async (planDetail: PlanDetailDto) => {
		this.setState({ isLoadDone: false });
		if (planDetail.pl_de_quantity == planDetail.pl_de_quantity_import) {
			message.error(L('da_nhap_du_so_luong_sach_trong_ke_hoach'));
			return;
		}
		this.buttonAddOrDeleteRef.current.onCreateBillingItem(planDetail.pl_de_id);
		// let billingItem = await stores.billingItemStore.checkPlanDetailHasBilling(pl_de_id, bi_id);
		// if (billingItem != undefined && billingItem.bi_it_id >= 0) {
		// 	this.buttonAddOrDeleteRef.current.onDeleteBillingItem(billingItem.bi_it_id);
		// 	this.setState({ disabledIsExistBillingItem: true });
		// } else {
		// 	this.buttonAddOrDeleteRef.current.onCreateBillingItem(pl_de_id);
		// }
		this.setState({ isLoadDone: true });
	};

	changeBilling = (item: BillingDto) => {
		if (!!this.props.changeBilling) {
			this.props.changeBilling(item);
		}
	}
	onChangeCheckBox = async (listItem: CheckboxValueType[] | undefined) => {
		this.setState({ isLoadDone: false });
		if (listItem != undefined) {
			await this.setState({
				listPlanDetailId: listItem,
			});
			if (this.props.billingSelected.bi_id != undefined && this.props.billingSelected.bi_id > 0) {
				let item = new CreatePlanDetailArrInput();
				item.bi_id = this.props.billingSelected.bi_id;
				item.pl_de_id_arr = this.state.listPlanDetailId;
				await stores.billingStore.createPlanDetailArrInput(item);
			}
		}
		this.setState({ isLoadDone: true });
	};
	render() {
		const { billingSelected } = this.props;
		const self = this;
		const columns: ColumnsType<PlanDetailDto> = [
			{ title: L('N.O'), dataIndex: '', width: 50, key: 'no_bill_table', render: (text: string, item: PlanDetailDto, index: number) => <div>{index + 1}</div>, },
			{ title: L('DocumentName'), dataIndex: 'bi_code', key: 'bi_code_bill_table', render: (text: string, item: PlanDetailDto, index: number) => <div>{item.do_id.name}</div>, },
			{ title: L('so_luong_trong_ke_hoach'), dataIndex: 'bi_export', key: 'bi_export_bill_table', render: (text: string, item: PlanDetailDto) => <div>{item.pl_de_quantity}</div> },
			{ title: L('so_luong_da_nhap'), dataIndex: 'bi_export', key: 'bi_export_bill_table', render: (text: string, item: PlanDetailDto) => <div>{item.pl_de_quantity_import}</div> },
			{
				title: "", dataIndex: '', key: 'action_billing_index', className: "no-print center",
				render: (text: string, item: PlanDetailDto) => (
					<div >
						{/* <Checkbox
							disabled={item.pl_de_status == ePlanDetailStatus.da_nhap_kho.num || this.state.disabled ? true : false}
							value={item.pl_de_id}
							onClick={() => this.onCheckAction(item.pl_de_id, this.state.billing_id)}
							style={{ marginLeft: 0 }}
						>
						</Checkbox> */}
						<Button type='primary' icon={<PlusOutlined />} onClick={() => this.onCheckAction(item)}></Button>
					</div>
				)
			}
		];

		return (
			<>
				<Row style={{ marginTop: 10, }} justify='space-between'>
					{(this.state.billing_id == undefined || this.state.billing_id < 1) ?
						<>
							<Col ><h3>{L("CreateBill")}</h3></Col>
							<Col ><Button type="primary" icon={<CheckCircleOutlined />} onClick={() => this.onCreateUpdate()}>{L("Save")}</Button></Col>
						</>
						:
						<Col ><h3>{L('EditBill') + ": " + billingSelected.bi_code}</h3></Col>

					}
				</Row>
				<Row>
					<Col {...(this.state.billing_id === undefined ? cssCol(24) : {
						xs: { span: 24, order: 2 },
						sm: { span: 24, order: 2 },
						md: { span: 24, order: 2 },
						lg: { span: 12, order: 1 },
						xl: { span: 12, order: 1 },
						xxl: { span: 12, order: 1 },
					})} >

						<Form scrollToFirstError ref={this.formRef} style={{ textAlign: 'center', marginTop: '10px' }}>
							{billingSelected.bi_id != undefined ?
								<Row gutter={[8, 8]}>
									<Col {...cssColResponsiveSpan(24, 24, 24, 24, 12, 12)}>
										<Form.Item label={L('BillCode')} {...AppConsts.formItemLayout} rules={[rules.required, rules.noSpaces, rules.chucai_so_kytudacbiet]} name={'bi_code'}  >
											<Input placeholder={L('BillCode')} />
										</Form.Item>
									</Col>
									<Col {...cssColResponsiveSpan(24, 24, 24, 24, 12, 12)}>
										<Form.Item label={L('ExportBillDate')} labelCol={cssColResponsiveSpan(8, 8, 8, 8, 14, 14)} wrapperCol={cssColResponsiveSpan(16, 16, 16, 16, 10, 10)} rules={[rules.required]} name="bi_export" valuePropName="bi_export">
											<DatePicker
												style={{ width: "100%" }}
												value={billingSelected.bi_id != undefined ? this.state.bi_export : undefined}
												onChange={(date: Moment | null, valueString) => { this.setState({ bi_export: date }); this.formRef.current!.setFieldsValue({ bi_export: date }); }}
												format={dateFormat}
												disabledDate={(current) => current ? current >= moment().endOf('day') : false}
											/>
										</Form.Item>
									</Col>
								</Row>
								:
								<Row gutter={[8, 8]}>
									<Col {...cssColResponsiveSpan(24, 24, 24, 24, 24, 24)}>
										<Form.Item label={L('BillCode')} {...AppConsts.formItemLayout} rules={[rules.required, rules.noSpaces, rules.chucai_so_kytudacbiet]} name={'bi_code'}  >
											<Input placeholder={L('BillCode')} />
										</Form.Item>
									</Col>
									<Col {...cssColResponsiveSpan(24, 24, 24, 24, 24, 24)}>
										<Form.Item label={L('ExportBillDate')} {...AppConsts.formItemLayout} rules={[rules.required]} name="bi_export" valuePropName="bi_export">
											<DatePicker
												placeholder={L('ExportBillDate')}
												style={{ width: "100%" }}
												value={billingSelected.bi_id != undefined ? this.state.bi_export : undefined}
												onChange={(date: Moment | null, valueString) => { this.setState({ bi_export: date }); this.formRef.current!.setFieldsValue({ bi_export: date }); }}
												format={dateFormat}
												disabledDate={(current) => current ? current >= moment().endOf('day') : false}
											/>
										</Form.Item>
									</Col>
								</Row>
							}
							<Form.Item label={L('Supplier')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'su_id'}>
								<SelectedSupplier supplier={billingSelected.su_id} onChangeSupplier={(item: ItemSupplier) => { this.formRef.current!.setFieldsValue({ su_id: item }) }} />
							</Form.Item>
							<Form.Item label={L('Note')} {...AppConsts.formItemLayout} name={'bi_note'} valuePropName='data'
								getValueFromEvent={(event, editor) => {
									const data = editor.getData();
									return data;
								}}
							>
								<CKEditor editor={ClassicEditor} />
							</Form.Item>
							<Form.Item label={L('Description')} {...AppConsts.formItemLayout} name={'bi_desc'} valuePropName='data'
								getValueFromEvent={(event, editor) => {
									const data = editor.getData();
									return data;
								}}
							>
								<CKEditor editor={ClassicEditor} />
							</Form.Item>
							{this.state.billing_id != undefined &&
								<Table
									scroll={{ y: 500 }}
									className='centerTable'
									dataSource={this.planDetailList}
									columns={columns}
									// rowClassName={(record, index) => (this.billingSelected.bi_id == record.bi_id) ? "bg-click" : "bg-white"}
									rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
									size={'middle'}
									bordered={true}
									locale={{ "emptyText": L('NoData') }}
									pagination={{
										pageSize: this.state.pageSize,
										total: this.planDetailList.length,
										current: this.state.currentPage,
										showTotal: (tot) => L("Total") + ": " + tot + "",
										showQuickJumper: true,
										showSizeChanger: true,
										pageSizeOptions: ['10', '20', '50', '100'],
										onShowSizeChange(current: number, size: number) {
											self.onChangePage(current, size)
										},
										onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
									}}
								>
								</Table>
							}
							<Row>
								<Col span={8} style={{ textAlign: 'right', paddingRight: "3px" }}>{L('ScanBillFile')}</Col>
								<Col span={16} style={{ textAlign: "left" }}>
									<FileAttachments
										files={self.listAttachmentItem}
										isMultiple={true}
										isLoadFile={this.state.isLoadFile}
										componentUpload={FileUploadType.Billing}
										onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
											self.listAttachmentItem = itemFile;
										}}
									/>
								</Col>
							</Row>
						</Form>
					</Col>
					<Col {...(this.state.billing_id === undefined ? cssCol(0) : {
						xs: { span: 24, order: 1 },
						sm: { span: 24, order: 1 },
						md: { span: 24, order: 1 },
						lg: { span: 12, order: 2 },
						xl: { span: 12, order: 2 },
						xxl: { span: 12, order: 2 },
					})} >
						<BillingItem
							billingItem={self.billing_selected.bi_id !== undefined ? self.billing_selected : this.props.billingSelected}
							ref={this.buttonAddOrDeleteRef}
							onCreateUpdateSuccess={this.onLoadTableDocumentInBilling}
							planDetailList={this.planDetailList}
						/>
					</Col>
				</Row>
			</ >
		)
	}
}