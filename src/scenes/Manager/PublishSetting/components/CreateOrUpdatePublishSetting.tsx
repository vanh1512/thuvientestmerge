import * as React from 'react';
import { Col, Row, Button, Table, Card, Modal, Form, Input, Checkbox } from 'antd';
import { L } from '@lib/abpUtility';
import { PublishSettingDto, CreatePublishSettingInput, UpdatePublishSettingInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import TextArea from 'antd/lib/input/TextArea';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (publishSettingDto: PublishSettingDto) => void;
	onCancel: () => void;
	publishSettingSelected: PublishSettingDto;
}

export default class CreateOrUpdatePublishSetting extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		publishSetting_id: -1,
	}
	publishSettingSelected: PublishSettingDto;

	async componentDidMount() {
		this.initData(this.props.publishSettingSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.publishSettingSelected.pu_se_Id !== prevState.publishSetting_id) {
			return ({ publishSetting_id: nextProps.publishSettingSelected.pu_se_Id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.publishSetting_id !== prevState.publishSetting_id) {
			this.initData(this.props.publishSettingSelected);
		}
	}


	initData = async (inputPublishSetting: PublishSettingDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputPublishSetting != undefined) {
			this.publishSettingSelected = inputPublishSetting;
		} else {
			this.publishSettingSelected = new PublishSettingDto();
		}
		if (this.publishSettingSelected.pu_se_Id !== undefined) {
			this.formRef.current!.setFieldsValue({
				... this.publishSettingSelected,
			});
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { publishSettingSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (publishSettingSelected.pu_se_Id === undefined) {
				let unitData = new CreatePublishSettingInput(values);
				await stores.publishSettingStore.createPublishSetting(unitData);
			} else {
				let unitData = new UpdatePublishSettingInput(values);
				// unitData.pu_se_Id = publishSettingDto.pu_se_Id;
				await stores.publishSettingStore.updatePublishSetting(unitData);
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
			this.props.onCreateUpdateSuccess(this.publishSettingSelected);
		}

	}
	render() {
		const { publishSettingSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.publishSetting_id === undefined ? L("AddPublishSetting") : L('EditPublishSetting') + ": " + publishSettingSelected.pu_se_Id}</h3></Col>
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
						<Form.Item label={L('CategoryID')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'ca_id'}  >
							<Input />
						</Form.Item>
						<Form.Item label={L('PublishSettingNotes')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pu_se_note'} >
							<TextArea />
						</Form.Item>
						<Form.Item label={L('PublishSettingDay')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pu_se_day'} >
							<Input />
						</Form.Item>
						<Form.Item label={L('PublishSettingMonth')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pu_se_month'}>
							<Input />
						</Form.Item>
						<Form.Item label={L('PublishSettingYear')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pu_se_year'}>
							<Input />
						</Form.Item>
						<Form.Item label={L('PublishSettingType')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'pu_se_type'}>
							<Input />
						</Form.Item>
					</Form>
				</Row>
			</Card >
		)
	}
}