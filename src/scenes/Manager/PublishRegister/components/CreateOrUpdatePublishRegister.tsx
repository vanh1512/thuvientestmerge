import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, Select } from 'antd';
import { L } from '@lib/abpUtility';
import {  PublishRegisterDto, CreatePublishRegisterInput, UpdatePublishRegisterInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (publishRegister: PublishRegisterDto) => void;
	onCancel: () => void;
	publishRegisterSelected: PublishRegisterDto;
}

export default class CreateOrUpdatePublishRegister extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		idSelected: -1,
	}
	publishRegisterSelected: PublishRegisterDto;

	async componentDidMount() {
		this.initData(this.props.publishRegisterSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.publishRegisterSelected.pu_re_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.publishRegisterSelected.pu_re_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.publishRegisterSelected);
		}
	}


	initData = async (inputpublishRegister: PublishRegisterDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputpublishRegister != undefined) {
			this.publishRegisterSelected = inputpublishRegister;
		} else {
			this.publishRegisterSelected = new PublishRegisterDto();
		}
		if (this.publishRegisterSelected.pu_re_id !== undefined) {
			this.formRef.current!.setFieldsValue({
				... this.publishRegisterSelected,
			});
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { publishRegisterSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (publishRegisterSelected.pu_re_id === undefined || publishRegisterSelected.pu_re_id < 0) {
				let unitData = new CreatePublishRegisterInput(values);
				await stores.publishRegisterStore.createPublishRegister(unitData);
			} else {
				let unitData = new UpdatePublishRegisterInput(values);
				// unitData.pu_re_id = publishRegister.pu_re_id;
				await stores.publishRegisterStore.updatePublishRegister(unitData);
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
			this.props.onCreateUpdateSuccess(this.publishRegisterSelected);
		}

	}
	render() {
		const { publishRegisterSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.idSelected === undefined ? L("AddPublishRegister") : L('EditPublishRegister') + ": "}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef}>
						<Form.Item label={L('co_id')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_id'}  >
							<Input />
						</Form.Item>
						<Form.Item label={L('co_code')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_code'}>
							<Input />
						</Form.Item>
						<Form.Item label={L('co_name')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_name'}  >
							<Input />
						</Form.Item>
						<Form.Item label={L('co_desc')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_desc'}>
							<Input />
						</Form.Item>
						<Form.Item label={L('fi_id_arr')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'fi_id_arr'}  >
							<Select />
						</Form.Item>
						<Form.Item label={L('pl_id')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pl_id'}>
							<Input />
						</Form.Item>
						<Form.Item label={L('co_user_sign')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_user_sign'}  >
							<Input />
						</Form.Item>
						<Form.Item label={L('co_time_end')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_time_end'}>
							<Input />
						</Form.Item>
						<Form.Item label={L('co_signed_at')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'co_signed_at'}  >
							<Input />
						</Form.Item>
						<Form.Item label={L('su_id')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'su_id'}>
							<Input />
						</Form.Item>
					</Form>
				</Row>
			</Card >
		)
	}
}