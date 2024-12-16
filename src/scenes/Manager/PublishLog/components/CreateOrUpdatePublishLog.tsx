import * as React from 'react';
import { Col, Row, Button, Table, Card, Modal, Form, Input, Checkbox, DatePicker, Select, InputNumber } from 'antd';
import { L } from '@lib/abpUtility';
import { PublishLogDto, CreatePublishLogInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (publishLogDto: PublishLogDto) => void;
	onCancel: () => void;
	publishLogSelected: PublishLogDto;
}

export default class CreateOrUpdatePublishLog extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		publishLog_id: -1,
	}
	publishLogSelected: PublishLogDto;

	async componentDidMount() {
		this.initData(this.props.publishLogSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.publishLogSelected.pu_lo_id !== prevState.publishLog_id) {
			return ({ publishLog_id: nextProps.publishLogSelected.pu_lo_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.publishLog_id !== prevState.publishLog_id) {
			this.initData(this.props.publishLogSelected);
		}
	}


	initData = async (inputPublishLog: PublishLogDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputPublishLog != undefined) {
			this.publishLogSelected = inputPublishLog;
		} else {
			this.publishLogSelected = new PublishLogDto();
		}
		if (this.publishLogSelected.pu_lo_id !== undefined) {
			this.formRef.current!.setFieldsValue({
				... this.publishLogSelected,
			});
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { publishLogSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			let unitData = new CreatePublishLogInput(values);
			await stores.publishLogStore.createPublishLog(unitData);

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
			this.props.onCreateUpdateSuccess(this.publishLogSelected);
		}

	}
	render() {
		const { publishLogSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.publishLog_id === undefined ? L("AddPublishLog") : L('EditPublishLog') + ": " + publishLogSelected.pu_lo_id}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Form ref={this.formRef} style={{ textAlign: 'center', marginTop: '10px' }}>
					{/* <Form.Item label={L('Code')} {...AppConsts.formItemLayout} rules={rules.pu_lo_id} name={'pu_lo_id'}  >
						<Input />
					</Form.Item> */}
					<Form.Item label={L('PublishRegisterID')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pu_re_id'}  >
						<Input />
					</Form.Item>
					<Form.Item label={L('PublishLogNotes')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pu_lo_notes'}  >
						<Input />
					</Form.Item>
					<Form.Item label={L('UserID')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'us_id_created'}  >
						<Input />
					</Form.Item>
				</Form>
			</Card >
		)
	}
}