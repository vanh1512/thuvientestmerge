import * as React from 'react';
import { Col, Row, Button, Card, Form, message, InputNumber } from 'antd';
import { L } from '@lib/abpUtility';
import { PlanDetailDto, CreatePlanDetailInput, UpdatePlanDetailInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import { ePlanDetailStatusBook, ePlanDetailType } from '@src/lib/enumconst';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SelectEnum from '@src/components/Manager/SelectEnum';
import SelectedDocument from '@src/components/Manager/SelectedDocument';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (planDetail: PlanDetailDto) => void;
	onCancel: () => void;
	planDetailSelected: PlanDetailDto;
	pl_id: number;
}

export default class CreateOrUpdatePlanDetail extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		pl_de_id: -1,
		pl_de_status_book: undefined,
	}
	planDetailSelected: PlanDetailDto;

	async componentDidMount() {
		await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
		this.initData(this.props.planDetailSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.planDetailSelected.pl_de_id !== prevState.pl_de_id) {
			return ({ pl_de_id: nextProps.planDetailSelected.pl_de_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.pl_de_id !== prevState.pl_de_id) {
			this.initData(this.props.planDetailSelected);
		}
	}

	initData = async (inputplanDetail: PlanDetailDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputplanDetail != undefined) {
			this.planDetailSelected = inputplanDetail;
		} else {
			this.planDetailSelected = new PlanDetailDto();
		}
		if (this.planDetailSelected.pl_de_id !== undefined) {
			this.formRef.current!.setFieldsValue({
				... this.planDetailSelected,
			});
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { planDetailSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (planDetailSelected.pl_id === undefined || planDetailSelected.pl_id < 0) {
				let unitData = new CreatePlanDetailInput(values);
				unitData.pl_id = this.props.pl_id;
				await stores.planDetailStore.createPlanDetail(unitData);
				message.success(L("CreateSuccessfully"))
				this.formRef.current.resetFields();
			} else {
				let unitData = new UpdatePlanDetailInput({ pl_de_id: planDetailSelected.pl_de_id, ...values });
				unitData.pl_id = this.props.pl_id;
				await stores.planDetailStore.updatePlanDetail(unitData);
				message.success(L("EditSuccessfully"))

			}
			await this.onCreateUpdateSuccess();
			this.setState({ isLoadDone: true });
		})
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.planDetailSelected);
		}

	}
	render() {
		const { planDetailSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginBottom: '10px' }}>
					<Col span={12}><h3>{this.state.pl_de_id === undefined ? L("CreatePlanDetail") : L('EditPlanDetail') + ": "}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("Cancel")}
						</Button>
						<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("Save")}
						</Button>
					</Col>
				</Row>
				<Row >
					<Form ref={this.formRef} style={{ width: "100%" }}>
						<Form.Item label={L("TitleDocuemnt")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'do_id'}>
							<SelectedDocument document={planDetailSelected.do_id} onChangeDocument={(value) => { this.formRef.current!.setFieldsValue({ do_id: value }) }} />
						</Form.Item>
						{/* <Form.Item label={L("Supplier")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'su_id'}  >
							<SelectedSupplier supplier={planDetailSelected.su_id} onChangeSupplier={(value: ItemSupplier) => { this.formRef.current!.setFieldsValue({ su_id: value }) }} />
						</Form.Item> */}
						<Form.Item label={L("Quantity")} {...AppConsts.formItemLayout} rules={[rules.required, rules.numberOnly]} name={'pl_de_quantity'}>
							<InputNumber style={{ width: '100%' }} min={1}
								formatter={a => AppConsts.numberWithCommas(a)}
								parser={a => a!.replace(/\$\s?|(,*)/g, '')} />
						</Form.Item>
						<Form.Item label={L("Price")} {...AppConsts.formItemLayout} rules={[rules.required, rules.numberOnly]} name={'pl_de_price'}  >
							<InputNumber style={{ width: '100%' }} min={0}
								formatter={a => AppConsts.numberWithCommas(a)}
								parser={a => a!.replace(/\$\s?|(,*)/g, '')} />
						</Form.Item>
						<Form.Item label={L("TypeDocument")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pl_de_type'}>
							<SelectEnum eNum={ePlanDetailType} enum_value={planDetailSelected.pl_de_type} onChangeEnum={async (value: number) => { await this.formRef.current!.setFieldsValue({ pl_de_type: value }) }} />
						</Form.Item>
						<Form.Item label={L("StatusDocument")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pl_de_status_book'}>
							<SelectEnum eNum={ePlanDetailStatusBook} enum_value={planDetailSelected.pl_de_status_book} onChangeEnum={async (value: number) => { await this.formRef.current!.setFieldsValue({ pl_de_status_book: value }) }} />
						</Form.Item>
						<Form.Item label={L("Note")} {...AppConsts.formItemLayout} name={'pl_de_note'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}
						>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>
					</Form>
				</Row>
			</Card >
		)
	}
}