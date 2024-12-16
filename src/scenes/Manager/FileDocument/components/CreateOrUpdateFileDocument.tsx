import * as React from 'react';
import { Col, Row, Button, Card, Form, Upload, message, Checkbox } from 'antd';
import { L } from '@lib/abpUtility';
import { FileDocumentDto,FileParameter } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload/interface';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import SelectedDocument from '@src/components/Manager/SelectedDocument';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (fileDocument: FileDocumentDto) => void;
	onCancel: () => void;
	fileDocumentSelected: FileDocumentDto;
	isCreate: boolean;
}

export default class CreateOrUpdateFileDocument extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();
	state = {
		isLoadFile: false,
		isLoadDone: false,
		idSelected: -1,
		is_download: true,
		isChangeFile: false,
		do_id: undefined,
	};
	listFile: any = [];
	fileDocumentSelected: FileDocumentDto;
	fileToUpload: FileParameter | undefined;
	async componentDidMount() {
		await this.setState({ isLoadFile: false });
		await this.initData(this.props.fileDocumentSelected);
		await this.mapFiletoUpload(this.props.fileDocumentSelected);

		await this.setState({ isLoadFile: true });
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.fileDocumentSelected.fi_do_id !== prevState.idSelected) {
			if (nextProps.fileDocumentSelected.fi_do_id == undefined) {
				return { idSelected: -1 };
			}
			return { idSelected: nextProps.fileDocumentSelected.fi_do_id };
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			await this.initData(this.props.fileDocumentSelected);
			await this.mapFiletoUpload(this.props.fileDocumentSelected);
			// await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined
			// );
		}
	}
	// async componentDidUpdate(prevProps, prevState) {
	// 	if (this.props.fileDocumentSelected.fi_do_id !== prevProps.fileDocumentSelected.fi_do_id) {
	// 		await this.initData(this.props.fileDocumentSelected);
	// 		await this.mapFiletoUpload(this.props.fileDocumentSelected);
	// 	}
	// }
	mapFiletoUpload = (files: FileDocumentDto) => {
		this.setState({ isLoadDone: false });
		if (files.fi_do_id != undefined) {
			this.listFile = [
				{
					uid: '-1',
					name: files.fi_do_name!,
					status: files.fi_do_id != undefined ? 'done' : '',
					ext: files.fi_do_extension,
					url: this.getFileDocument(files),
				},
			];
		}
		this.setState({ isLoadDone: true });
	};
	initData = async (inputfileDocument: FileDocumentDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputfileDocument !== undefined) {
			this.fileDocumentSelected = inputfileDocument;
			this.setState({ is_download: this.fileDocumentSelected.isDownload });
		} else {
			this.fileDocumentSelected = new FileDocumentDto();
		}
		if (
			this.fileDocumentSelected.fi_do_id !== undefined ||
			this.fileDocumentSelected.do_id !== undefined
		) {
			await this.initFileDocument();
			if (this.fileDocumentSelected.fi_do_desc === null) {
				this.fileDocumentSelected.fi_do_desc = '';
			}
			await this.formRef.current!.setFieldsValue({
				...this.fileDocumentSelected,
			});
		} else {
			this.listFile = [];
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });
	};
	initFileDocument = async () => {
		this.setState({ isLoadDone: false });
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
		headers.append('Origin', AppConsts.appBaseUrl!);

		await fetch(this.getFileDocument(this.props.fileDocumentSelected), {
			mode: 'cors',
			credentials: 'include',
			method: 'POST',
			headers: headers,
		})
			.then((response) => {
				response.blob().then(async (blob) => {
					blob = new Blob([blob], { type: blob.type });
					const fileParameter = new File([blob], this.props.fileDocumentSelected.fi_do_name!, {
						type: 'text/plain',
					});
					this.fileToUpload = await { data: fileParameter, fileName: fileParameter.name };
					await this.setFilePayload(this.fileToUpload);
				});
			})
			.then((json) => console.log(json))
			.catch((error) => console.log('Authorization failed: ' + error.message));

		await this.setState({ isLoadDone: true });
	};

	onCreateUpdate = () => {
		const { fileDocumentSelected } = this.props;
		const form = this.formRef.current;
		this.setState({ isLoadDone: false });
		form!.validateFields().then(async (values: any) => {
			if (fileDocumentSelected.fi_do_id === undefined) {
				await stores.fileDocumentStore.createFileDocument(
					values.do_id,
					values.fi_do_desc,
					this.state.is_download,
					this.fileToUpload
				);
				message.success(L('CreateSuccessfully'));
			} else {
				await stores.fileDocumentStore.updateFileDocument(
					fileDocumentSelected.fi_do_id,
					values.do_id,
					values.fi_do_desc,
					this.state.is_download,
					this.fileToUpload
				);
				message.success(L('UpdateSuccessful'));
			}
			await this.onCreateUpdateSuccess();
			this.setState({ isLoadDone: true });
			this.onCancel();
		});
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	};
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.fileDocumentSelected);
		}
	};
	handleChange = async ({ fileList: newFileList }) => {
		const { hostSetting } = stores.settingStore;
		this.setState({ isLoadDone: false });
		this.listFile = [];
		let item = newFileList.pop();
		try {
			if (item.status === 'done') {
				if (item.size > hostSetting.general.maxUploadedData) {
					message.error(
						L('khong_the_up_file_tren') + hostSetting.general.maxUploadedData / 1024 / 1024 + 'mb'
					);
					this.fileToUpload = undefined;
				} else {
					this.listFile = [item];
					let file = { data: item.originFileObj, fileName: item.name };
					this.fileToUpload = file;
					await this.setFilePayload(this.fileToUpload);
					message.success(L('CreateSuccessfully'));
					this.setState({ isLoadDone: true });
				}
			} else if (item.status === 'error') {
				message.error(item.name + L('FileUploadFailed') + '.');
			}
		}
		catch
		{
			this.listFile = [];
			this.setState({ isLoadDone: true });
		}
	};

	uploadImage = async (options) => {
		const { onSuccess, file } = options;
		onSuccess('done');
	};
	setFilePayload = async (fileToUpload: FileParameter | undefined) => {
		const form = this.formRef.current;
		await form.setFieldsValue({ filePayload: fileToUpload });
	};
	beforeUpload = (file: RcFile) => {
		const limitSize = file.size / 1024 / 1024 < 500;
		if (!limitSize) {
			message.error(L('tep_phai_nho_hon_500mb'));
		}
		return limitSize;
	};
	render() {
		const { fileDocumentSelected } = this.props;
		const props = {
			action: AppConsts.remoteServiceBaseUrl,
			onChange: this.handleChange,
			beforeUpload: this.beforeUpload,
			customRequest: this.uploadImage,
			multiple: false,
			showUploadList: true,
			fileList: this.listFile,
		};
		return (
			<Card>
				<Row style={{ marginTop: 10, display: 'flex', flexDirection: 'row' }}>
					<Col span={12}>
						<h3>
							{this.state.idSelected === -1 ? L('AddFileDocument') : L('EditFileDocument') + ': ' + this.props.fileDocumentSelected.document.name}
						</h3>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button
							danger
							onClick={() => this.onCancel()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
						>
							{L('huy')}
						</Button>
						<Button
							type="primary"
							onClick={() => this.onCreateUpdate()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
						>
							{L('luu')}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: 'block', flexDirection: 'row' }}>
					<Form ref={this.formRef}>
						<Form.Item
							label={L('Title')}
							{...AppConsts.formItemLayout}
							rules={[rules.required]}
							name={'do_id'}
						>
							<SelectedDocument
								documentID={fileDocumentSelected.do_id}
								onChangeDocument={(value) => {
									this.formRef.current!.setFieldsValue({ do_id: value.id });
								}}
							/>
						</Form.Item>
						<Form.Item
							label={L('File')}
							{...AppConsts.formItemLayout}
							name={'filePayload'}
							rules={[rules.required]}
						>
							<Upload {...props}>
								<Button icon={<UploadOutlined />}>{L('tai_len')}</Button>
							</Upload>
						</Form.Item>
						<Form.Item
							label={L('mo_ta')}
							{...AppConsts.formItemLayout}
							name={'fi_do_desc'}
							rules={[rules.description]}
							valuePropName="data"
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}
						>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>
						<Form.Item label={L('Download')} {...AppConsts.formItemLayout}>
							<Checkbox
								checked={this.state.is_download}
								onChange={() => this.setState({ is_download: !this.state.is_download })}
							/>
						</Form.Item>
					</Form>
				</Row>
			</Card>
		);
	}
}
