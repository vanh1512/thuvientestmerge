import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message } from 'antd';
import { L } from '@lib/abpUtility';
import { PublisherDto, CreatePublisherInput, UpdatePublisherInput, AttachmentItem } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';
import FileAttachments from '@src/components/FileAttachments';

export interface IProps {
	onCreateUpdateSuccess?: (borrowReDto: PublisherDto) => void;
	onCancel: () => void;
	publisherSelected: PublisherDto;
}

export default class CreateOrUpdatePublisher extends React.Component<IProps>{
	private formRef: any = React.createRef();
	listAttachmentItem: AttachmentItem[] = [];
	state = {
		isLoadDone: false,
		isLoadFile: false,
		idSelected: -1,
	}
	publisherSelected: PublisherDto;

	async componentDidMount() {
		this.initData(this.props.publisherSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.publisherSelected.pu_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.publisherSelected.pu_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.publisherSelected);
		}
	}

	initData = async (inputContract: PublisherDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputContract === undefined) {
			inputContract = new PublisherDto();
		}
		if (inputContract !== undefined && inputContract.pu_id !== undefined) {
			this.listAttachmentItem = (inputContract.fi_id_arr === undefined) ? [] : inputContract.fi_id_arr.filter(item => item.isdelete === false);
		} else {
			this.listAttachmentItem = [];
		}
		if (inputContract.pu_infor == null) {
			inputContract.pu_infor = "";
		}
		if (inputContract.pu_address == null) {
			inputContract.pu_address = "";
		}
		await this.formRef.current!.setFieldsValue({ ...inputContract });
		await this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });

	}
	onCreateUpdate = () => {
		const { publisherSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			this.setState({ isLoadDone: false });
			if (publisherSelected.pu_id === undefined || publisherSelected.pu_id < 0) {
				let unitData = new CreatePublisherInput(values);
				unitData.fi_id_arr = this.listAttachmentItem;
				await stores.publisherStore.createPublisher(unitData);
				this.formRef.current.resetFields();
				message.success(L("SuccessfullyAdded"));
			} else {
				let unitData = new UpdatePublisherInput({ pu_id: publisherSelected.pu_id, ...values });
				unitData.fi_id_arr = this.listAttachmentItem;
				await stores.publisherStore.updatePublisher(unitData);
				await this.formRef.current!.setFieldsValue({ ...unitData });
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
			this.props.onCreateUpdateSuccess(this.publisherSelected);
		}

	}
	render() {
		const self = this;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={14}><h3>{this.state.idSelected === undefined ? L("AddPublisher") : L('EditPublisher') + ": " + self.props.publisherSelected.pu_name}</h3></Col>
					<Col span={10} style={{ textAlign: 'right' }}>
						<Button title={L("huy")} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L("luu")} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form {...AppConsts.formItemLayoutResponsive([24, 24], [12, 12], [8, 16], [10, 14], [10, 14], [12, 12])} ref={this.formRef}>
						<Form.Item label={L('PublisherName')} rules={[rules.required, rules.chucai_so]} name={'pu_name'}>
							<Input maxLength={AppConsts.maxLength.name} placeholder={L('PublisherName')} />
						</Form.Item>
						<Form.Item label={L('ShortNamePublisher')} name={'pu_short_name'}  >
							<Input maxLength={AppConsts.maxLength.name} placeholder={L('ShortNamePublisher')} />
						</Form.Item>
						<Form.Item label={L('Address')} rules={[rules.required, rules.noAllSpaces]} name={'pu_address'} >
							<Input maxLength={AppConsts.maxLength.address} placeholder={L('Address')} />
						</Form.Item>
						<Form.Item label={L('PublisherLicense')} name={'pu_license'}>
							<FileAttachments
								files={self.listAttachmentItem}
								isLoadFile={this.state.isLoadFile}
								allowRemove={true}
								isMultiple={true}
								componentUpload={FileUploadType.Contracts}
								onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
									self.listAttachmentItem = itemFile;
								}}
							/>
						</Form.Item>
						<Form.Item label={L('Email')} rules={[rules.required, rules.emailAddress]} name={'pu_email'}
						>
							<Input placeholder={L('Email')} />
						</Form.Item>
						<Form.Item label={L('ContactPhone')} rules={[rules.required, rules.phone]} name={'pu_phone'}>
							<Input maxLength={AppConsts.maxLength.phone} placeholder={L('ContactPhone')} />
						</Form.Item>
						<Form.Item label={L('Website')} rules={[rules.required, rules.noSpaces]} name={'pu_website'}
						>
							<Input placeholder={L('Website')} />
						</Form.Item>
						<Form.Item label={L('Information')} rules={[rules.description]} name={'pu_infor'}
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