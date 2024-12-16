import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message, Checkbox } from 'antd';
import { L } from '@lib/abpUtility';
import { TopicDto, CreateTopicInput, UpdateTopicInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (borrowReDto: TopicDto) => void;
	onCancel: () => void;
	topicSelected: TopicDto;
}

export default class CreateOrUpdateTopic extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		idSelected: -1,
		isActive: true,
	}
	topicSelected: TopicDto = new TopicDto();

	async componentDidMount() {
		this.initData(this.props.topicSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.topicSelected.to_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.topicSelected.to_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.topicSelected);
		}
	}


	initData = async (inputTopic: TopicDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputTopic == undefined) {
			inputTopic = new TopicDto();
		}
		if (inputTopic !== undefined) {
			this.topicSelected = inputTopic!;
			this.setState({ isActive: inputTopic.to_is_active });
		}
		if (inputTopic.to_desc == null) {
			inputTopic.to_desc = "";
		}
		await this.formRef.current!.setFieldsValue({ ...inputTopic });
		await this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { topicSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (topicSelected.to_id === undefined || topicSelected.to_id < 0) {
				let unitData = new CreateTopicInput(values);
				await stores.topicStore.createTopic(unitData);
				this.formRef.current.resetFields();
				message.success(L("SuccessfullyAdded"));
			} else {
				let unitData = new UpdateTopicInput({ to_id: topicSelected.to_id, ...values });
				unitData.to_is_active = this.state.isActive;
				await stores.topicStore.updateTopic(unitData);
				message.success(L("SuccessfullyEdited"));
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
			this.props.onCreateUpdateSuccess(this.topicSelected);
		}

	}
	render() {
		const { topicSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.idSelected === undefined ? L("AddNewTopics") : L('EditTopic') +" "+ topicSelected.to_name + " : "}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L('huy')} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L('luu')} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef}>
						<Form.Item label={L('TopicName')} {...AppConsts.formItemLayout} rules={[rules.required, rules.chucai_so_kytudacbiet]} name={'to_name'}  >
							<Input maxLength={AppConsts.maxLength.name} placeholder={L('TopicName')} />
						</Form.Item>
						<Form.Item label={L('Description')} {...AppConsts.formItemLayout} rules={[rules.description]} name={'to_desc'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>
						{this.topicSelected.to_id != undefined &&
							<Form.Item label={L('kich_hoat')} {...AppConsts.formItemLayout} name={'to_is_active'} >
								<Checkbox checked={this.state.isActive} onChange={(e) => this.setState({ isActive: e.target.checked })} ></Checkbox>
							</Form.Item>
						}
					</Form>
				</Row>
			</Card >
		)
	}
}