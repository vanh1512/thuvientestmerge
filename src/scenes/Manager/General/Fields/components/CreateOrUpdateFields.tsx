import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, Select, Checkbox, message } from 'antd';
import { L } from '@lib/abpUtility';
import { FieldsDto, CreateFieldsInput, UpdateFieldsInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

const { Option } = Select;
export interface IProps {
	onCreateUpdateSuccess?: (fieldsDto: FieldsDto) => void;
	onCancel: () => void;
	fieldsSelected: FieldsDto;
}

export default class CreateOrUpdateFields extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		idSelected: -1,
		isDelete: false,
		modalUpdate: false,
		fie_id: -1,
	}
	fieldsSelected: FieldsDto = new FieldsDto();

	async componentDidMount() {
		this.initData(this.props.fieldsSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.fieldsSelected.fie_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.fieldsSelected.fie_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.fieldsSelected);
		}
	}

	initData = async (inputfields: FieldsDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputfields == undefined) {
			inputfields = new FieldsDto();
		}
		if (inputfields !== undefined && inputfields.fie_id !== undefined) {
			this.fieldsSelected = inputfields!;
		}
		if (inputfields.fie_desc == null) {
			inputfields.fie_desc = "";
		}
		await this.formRef.current!.setFieldsValue({ ...inputfields });
		await this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { fieldsSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (fieldsSelected.fie_id === undefined) {
				let unitData = new CreateFieldsInput({ ...values });
				await stores.fieldsStore.createFields(unitData);
				await this.onCreateUpdateSuccess();
				message.success(L("SuccessfullyAdded") + "!");
			}
			else {
				let unitData = new UpdateFieldsInput({ fie_id: fieldsSelected.fie_id, ...values });
				await stores.fieldsStore.updateFields(unitData);
				await this.onCreateUpdateSuccess();
				message.success(L("SuccessfullyEdited") + "!");
			}
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
			this.props.onCreateUpdateSuccess(this.fieldsSelected);
		}

	}
	render() {
		const { fieldsSelected } = this.props;
		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{fieldsSelected.fie_id=== undefined ?
						L("AddField")
						: (L("Field")) +
						": " + fieldsSelected.fie_name}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L("huy")} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L("luu")} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>

					<Form ref={this.formRef}>
						<Form.Item label={L('FieldName')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'fie_name'}  >
							<Input maxLength={AppConsts.maxLength.name} placeholder={L('FieldName')} />
						</Form.Item>
						<Form.Item label={L('Description')} {...AppConsts.formItemLayout} rules={[rules.description]} name={'fie_desc'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>
					</Form>

				</Row>
			</Card >
		)
	}
}