import * as React from 'react';
import { Col, Row, Button, Form, Input, message, DatePicker } from 'antd';
import { L } from '@lib/abpUtility';
import { AttachmentItem, ContractDto, CreateContractInput, ItemSupplier, ItemUser, PlanDto, UpdateContractInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import moment, { Moment } from 'moment';
import SelectPlan from '@src/components/Manager/SelectPlan';
import { eProcess, eUserType } from '@src/lib/enumconst';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SelectedSupplier from '@src/components/Manager/SelectedSupplier';
import SelectUser from '@src/components/Manager/SelectUser';
import GetNameItem from '@src/components/Manager/GetNameItem';
import FileAttachments from '@src/components/FileAttachments';
import rules from '@src/scenes/Validation';
import { FileUnknownOutlined } from '@ant-design/icons';

export interface IProps {
	onCreateUpdateSuccess?: (contract: ContractDto) => void;
	onCancel: () => void;
	contractSelected: ContractDto;
	pl_id: number;
	allow_editted?: boolean;
}

export default class CreateOrUpdateContract extends React.Component<IProps>{
	private formRef: any = React.createRef();
	listAttachmentItem: AttachmentItem[] = [];

	state = {
		isLoadDone: false,
		idSelected: -1,
		co_signed_at: undefined,
		pl_id: undefined,
		su_id: undefined,
		check: false,
		isLoadFile: false,
		visibleModalPrintContract: false,
	}
	contractSelected: ContractDto;

	async componentDidMount() {

		this.initData(this.props.contractSelected);
		await stores.planStore.getAll(undefined, undefined, undefined, undefined);
		await stores.sessionStore.getSuppliersToManager()
		const { planListResult } = stores.planStore;
		const planDetail = planListResult.find((item) => item.pl_id === this.props.contractSelected.pl_id);
		this.setState({ check: planDetail != undefined && planDetail!.pl_process === eProcess.Complete.num });

	}

	static getDerivedStateFromProps(nextProps, prevState) {

		if (nextProps.contractSelected.co_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.contractSelected.co_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.contractSelected);
		}
	}


	initData = async (inputContract: ContractDto | undefined) => {
		this.setState({ isLoadDone: false, isLoadFile: !this.state.isLoadFile });
		if (inputContract === undefined) {
			inputContract = new ContractDto();
		}
		if (inputContract !== undefined && inputContract.co_id !== undefined) {
			this.listAttachmentItem = (inputContract.fi_id_arr === undefined) ? [] : inputContract.fi_id_arr.filter(item => item.isdelete == false);
			let timeSigned = moment(this.props.contractSelected.co_signed_at);
			this.setState({ co_signed_at: timeSigned });
		}
		if (inputContract.co_desc == null) {
			inputContract.co_desc = "";
		}
		if (this.props.allow_editted != true)
			await this.formRef.current!.setFieldsValue({ ...inputContract });
		await this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });

	}

	onCreateUpdate = () => {
		const { contractSelected, pl_id } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			this.setState({ isLoadDone: false });
			if (contractSelected.co_id === undefined || contractSelected.co_id < 0) {
				let unitData = new CreateContractInput(values);
				unitData.fi_id_arr = this.listAttachmentItem;
				if (pl_id !== undefined) {
					unitData.pl_id = pl_id;
				}
				await stores.contractStore.createContract(unitData);
				message.success(L('SuccessfullyAdded'));
				this.formRef.current.resetFields();
			} else {
				let unitData = new UpdateContractInput({ co_id: contractSelected.co_id, ...values });
				unitData.fi_id_arr = this.listAttachmentItem;
				if (pl_id !== undefined) {
					unitData.pl_id = pl_id;
				}
				await stores.contractStore.updateContract(unitData);
				message.success(L("SuccessfullyEdited"));
			}
			await this.onCreateUpdateSuccess();
			this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
		})
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.contractSelected);
		}

	}
	checkDateInit = (date: string): moment.Moment | undefined => {
		if (date === "" || date === undefined) {
			return undefined;
		}
		return moment(date);
	};
	onChangeDate = async (date: moment.Moment | null) => {
		await this.setState({ co_signed_at: moment(date).format("DD/MM/YYYY") });
		this.formRef.current!.setFieldsValue({ co_signed_at: this.state.co_signed_at });
	};

	render() {
		const { contractSelected, pl_id, allow_editted } = this.props;
		const self = this
		return (
			<>
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={18}><h3 style={{ marginLeft: '5px' }}>{allow_editted ? L("Contract") + ": " + contractSelected.co_name : this.state.idSelected === undefined ? L("them_hop_dong") : L('chinh_sua_hop_dong') + contractSelected.co_name}</h3></Col>
					{!allow_editted ?
						<Col span={6} style={{ textAlign: 'right' }}>
							<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("Save")}
							</Button>
						</Col>
						:
						<Col span={6} style={{ textAlign: 'right' }}>
							<Button type="primary" onClick={() => this.setState({ visibleModalPrintContract: true, isLoadFile: !this.state.isLoadFile })} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("in_hop_dong")}
							</Button>
						</Col>
					}
				</Row>
				{!allow_editted &&
					<Row style={{ justifyContent: "center" }}>
						<FileAttachments
							files={self.listAttachmentItem}
							isLoadFile={this.state.isLoadFile}
							isMultiple={true}
							componentUpload={FileUploadType.Contracts}
							onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
								self.listAttachmentItem = itemFile;
							}}
						/>
					</Row>}
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<div>{allow_editted ?
						<div>
							<Row gutter={16}>
								<Col span={12}>
									<Row style={{ marginBottom: '10px', marginLeft: '5px' }}>
										<span><strong>{L('ContractCode')} : </strong> {contractSelected.co_code}</span>
									</Row>
									<Row style={{ marginBottom: '10px', marginLeft: '5px' }}>
										<span><strong>{L('ContractName')} : </strong> {contractSelected.co_name}</span>
									</Row>
									<Row style={{ marginBottom: '10px', marginLeft: '5px' }}>
										<span><strong>{L('Supplier')} : </strong> {stores.sessionStore.getNameSupplier(contractSelected.su_id)}</span>
									</Row>
									<Row>
										<span style={{ display: '-webkit-inline-box', marginLeft: '5px' }}><strong>{L('Description')} : </strong> <p dangerouslySetInnerHTML={{ __html: contractSelected.co_desc! }}></p></span>
									</Row>
								</Col>
								<Col span={12} >
									<Row style={{ marginBottom: '10px' }}>
										<span><strong>{L('SelectedPlan')} : </strong> {GetNameItem.getNamePlan(contractSelected.pl_id)}</span>
									</Row>
									<Row style={{ marginBottom: '10px' }}>
										<span><strong>{L('Signer')} : </strong> {stores.sessionStore.getUserNameById(contractSelected.us_id_accept)}</span>
									</Row>
									<Row style={{ marginBottom: '10px' }}>
										<span ><strong >{L('SignAt')} : </strong> {moment(contractSelected.co_created_at, 'DD/MM/YYYY').format('DD/MM/YYYY')}</span>
									</Row>
									<Row>
										<span><strong>{L("File")}: &nbsp;</strong></span>
										{contractSelected.fi_id_arr != undefined && contractSelected.fi_id_arr.length > 0 ?
											<>
												<FileAttachments
													files={contractSelected.fi_id_arr.filter(item => item.isdelete == false)}
													isLoadFile={this.state.isLoadFile}
													isMultiple={false}
													allowRemove={false}
													visibleModalViewFile={this.state.visibleModalPrintContract}
												/>
											</> :
											<><FileUnknownOutlined style={{ fontSize: 16 }} /> &nbsp;{L("NoData")}</>
										}
									</Row>
								</Col>
							</Row>
						</div>

						: <Form ref={this.formRef}>
							{/* <Form.Item label={L('ContractCode')} {...AppConsts.formItemLayout} rules={[rules.required, rules.chucai_so_kytudacbiet, rules.noSpaces]} name={'co_code'}>
								<Input />
							</Form.Item> */}
							<Form.Item label={L('ContractName')} {...AppConsts.formItemLayout} rules={[rules.required, rules.noAllSpaces]} name={'co_name'}  >
								<Input />
							</Form.Item>
							<Form.Item label={L('Supplier')} {...AppConsts.formItemLayout} name={'su_id'} rules={[rules.required]}>
								<SelectedSupplier supplierID={contractSelected.su_id} onChangeSupplier={(item: ItemSupplier) => { this.formRef.current!.setFieldsValue({ su_id: item.id }) }} checkItem={allow_editted} />

							</Form.Item>
							{pl_id === undefined ?
								<Form.Item label={L('SelectedPlan')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pl_id'}>
									<SelectPlan enum={contractSelected.co_status} pl_id={contractSelected.pl_id} onChangePlan={(item: PlanDto) => this.formRef.current!.setFieldsValue({ pl_id: item.pl_id })} />
								</Form.Item> : ""}
							{/*Người ký chưa phân quyền */}
							<Form.Item label={L('Signer')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'us_id_accept'}  >
								{/*<Input disabled={allow_editted} />*/}
								<SelectUser role_user={eUserType.Manager.num} user_id={contractSelected.us_id_accept} onChangeUser={(item: ItemUser[]) => this.formRef.current!.setFieldsValue({ us_id_accept: item[0].id })} />
							</Form.Item>
							<Form.Item label={L('SignAt')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_signed_at'} valuePropName={'co_signed_at'}>
								<DatePicker
									style={{ width: '100%' }}
									value={this.state.co_signed_at}
									onChange={(date: Moment | null, dateString: string) => { this.setState({ co_signed_at: date }); this.formRef.current.setFieldsValue({ co_signed_at: date }); }}
									format={'DD/MM/YYYY'}
								/>
							</Form.Item>
							<Form.Item label={L('Description')} {...AppConsts.formItemLayout} rules={[rules.description]} name={'co_desc'} valuePropName='data'
								getValueFromEvent={(event, editor) => {
									const data = editor.getData();
									return data;
								}}
							>
								<CKEditor editor={ClassicEditor} />
							</Form.Item>
						</Form>
					}</div>
				</Row>
			</>
		)
	}
}