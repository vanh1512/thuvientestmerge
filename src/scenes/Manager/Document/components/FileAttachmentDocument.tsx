import * as React from 'react';
import { cssCol, FileUploadType } from '@lib/appconst';
import { Row, Col, Modal, Upload, message, Button } from 'antd';
import MineTypeConst from '@lib/minetypeConst';
import { L } from '@lib/abpUtility';
import { stores } from '@stores/storeInitializer';
import { AttachmentItem, FilesDto, FileParameter, FileDocumentDto } from '@services/services_autogen';
import ViewFileContent from '../../../../components/ViewFile/viewFileContent';
import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { RcFile } from 'antd/lib/upload';
import ViewFileOfUserContent from '@src/components/ViewFile/viewFileOfUserContent';

const { confirm } = Modal;
export interface IFileAttachmentsProps {
	files?: FileDocumentDto[];
	isLoadFile?: boolean;
	allowEditting: boolean;
	allowRemove?: boolean;
	isMultiple?: boolean;
	isViewDetailFileAsModal?: boolean;
	componentUpload?: FileUploadType;
	onCreateFileDocument?: (fileDocument: FileParameter[]) => void;
	onRemoveFileDocument?: (listFileDocumentId: number[]) => void;
}
export interface IFileAttachmentsStates {
	visibleModalViewFile: boolean;
	itemAttachment: AttachmentItem;
	isLoadDone: boolean,
	ext: string,
}

export default class FileAttachmentDocument extends AppComponentBase<IFileAttachmentsProps, IFileAttachmentsStates> {
	fileInput: any = React.createRef();
	listFile: any = [];
	listFileTemp: any = [];
	newListFileDocument: FileParameter[] = [];
	listFileDocumentId: number[] = [];
	state = {
		ext: "",
		isLoadDone: false,
		url: "",
		itemAttachment: new AttachmentItem(),
		visibleModalViewFile: false,

	};
	url: "";
	async componentDidUpdate(prevProps, prevState) {
		if (this.props.isLoadFile !== prevProps.isLoadFile) {
			this.listFile = [];
			this.props.files!.map(item => {
				if (item != undefined && item.fi_do_id != undefined) {

					let upload = {
						uid: item.fi_do_id.toString(),
						name: item.fi_do_name!,
						status: 'done',
						ext: item.fi_do_extension,
						url: this.getFileDocument(item),
						thumbUrl: MineTypeConst.getThumUrl(item.fi_do_extension!),
					}
					this.listFile.push(upload);
				}
			})
			this.setState({ isLoadDone: !this.state.isLoadDone });
		}
	}

	handleChange = ({ fileList: newFileList }) => {
		this.listFileTemp = newFileList;
	}

	uploadImage = async (options) => {
		const { onSuccess, file } = options;
		let fileUp: any = ({ "data": file, "fileName": file.name });
		let fileToUpload: FileParameter = fileUp;
		this.newListFileDocument.push(fileToUpload);
		onSuccess("done");
		this.setState({ isLoadDone: false });

		if (this.props.onCreateFileDocument != undefined) {
			this.props.onCreateFileDocument(this.newListFileDocument);

		}
		this.listFile = this.listFileTemp;
		this.setState({ isLoadDone: true });


	}
	onViewDetailFile = (file) => {
		let attach = new AttachmentItem();
		if (isNaN(Number(file.uid))) {
			attach.id = Number(file.originFileObj.uid);
		} else {
			attach.id = Number(file.uid);
		}
		attach.key = file.name;
		attach.ext = file.ext;
		this.url = file.url;
		this.setState({ visibleModalViewFile: true, itemAttachment: attach, ext: attach.ext! });
	}

	deleteFileItem = async (file) => {
		let self = this;
		confirm({
			title: L('YouWantToDelete') + ": " + file.name + "?" + L('cac_thay_doi_se_chi_thanh_cong_khi_ban_nhan_nut_luu'),
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				self.setState({ isLoadDone: false });
				self.listFile = self.listFileTemp;
				const fi_id = Number(file.uid);
				const indexDelete = self.newListFileDocument.map(item => item.data.uid).indexOf(file.uid);
				self.newListFileDocument = self.newListFileDocument.splice(indexDelete, 1);
				if (fi_id === undefined || isNaN(fi_id)) {
					return;
				} else {
					self.listFileDocumentId.push(fi_id);
				}
				if (self.props.onCreateFileDocument != undefined) {
					self.props.onCreateFileDocument(self.newListFileDocument);

				}
				if (!!self.props.onRemoveFileDocument) {
					await self.props.onRemoveFileDocument(self.listFileDocumentId);
				}
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});


	};
	beforeUpload = (file: RcFile) => {
		const limitSize = file.size / 1024 / 1024 < 500;
		if (!limitSize) {
			message.error(L('tep_phai_nho_hon_500mb'));
		}
		return limitSize;
	};

	render() {
		const { files, allowEditting, isMultiple, isViewDetailFileAsModal } = this.props;
		const col24 = cssCol(24);
		const uploadButton = (
			<Button icon={<UploadOutlined />}>{L("tai_len")}</Button>
		);
		return (
			<Row style={{ width: '100%', margin: '2px', display: 'block' }}>
				{allowEditting &&
					<Upload
						//listType="picture-card"
						//className="avatar-uploader"
						customRequest={this.uploadImage}
						onPreview={this.onViewDetailFile}
						onRemove={this.deleteFileItem}
						fileList={this.listFile}
						beforeUpload={this.beforeUpload}
						onChange={this.handleChange}
						showUploadList={{
							showDownloadIcon: true,
							downloadIcon: <DownloadOutlined />,
							showRemoveIcon: true,
						}}
					>
						{(isMultiple != undefined && isMultiple == true) ? uploadButton : (this.listFile.length >= 1 ? null : uploadButton)}
					</Upload>

				}
				{(isViewDetailFileAsModal == undefined || isViewDetailFileAsModal == true) &&
					<Modal
						width="50vw"
						bodyStyle={{ height: (MineTypeConst.checkExtentionFileType(this.state.ext) === MineTypeConst.IMAGE_EXT) ? "100%" : "" }}
						title={L("ViewFile " + this.state.itemAttachment.key)}
						visible={this.state.visibleModalViewFile}
						onCancel={() => this.setState({ visibleModalViewFile: false })}
						footer={null}
						destroyOnClose={true}
						maskClosable={true}
					>
						<Row>
							<Col
								{...col24}
								id={"ViewFileContentDocumentId"}
							>
								{this.state.itemAttachment != undefined && this.state.itemAttachment.id != undefined ?
									<ViewFileOfUserContent
										visible={this.state.visibleModalViewFile}
										onCancel={() => this.setState({ visibleModalViewFile: false })}
										urlView={this.url}
										ext={this.state.ext} />
									: null}
							</Col>
						</Row>
					</Modal>
				}
			</Row>
		);
	}

}