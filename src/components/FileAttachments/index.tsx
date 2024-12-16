import * as React from 'react';
import { cssCol, FileUploadType } from '@lib/appconst';
import { Row, Col, Modal, Upload, message, Button } from 'antd';
import MineTypeConst from '@lib/minetypeConst';
import { L } from '@lib/abpUtility';
import { stores } from '@stores/storeInitializer';
import { AttachmentItem, FilesDto, FileParameter } from '@services/services_autogen';
import ViewFileContent from '../ViewFile/viewFileContent';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { RcFile } from 'antd/lib/upload';

const { confirm } = Modal;
export interface IFileAttachmentsProps {
	onSubmitUpdate?: (data: AttachmentItem[]) => void;
	files?: AttachmentItem[];
	visibleModalViewFile?: boolean;
	isLoadFile?: boolean;
	allowRemove?: boolean;
	isMultiple?: boolean;
	isViewFile?: boolean;
	componentUpload?: FileUploadType;
}
export interface IFileAttachmentsStates {
	visibleModalViewFile: boolean;
	itemAttachment: AttachmentItem;
	isLoadDone: boolean,
	className: string,
}

export default class FileAttachments extends AppComponentBase<IFileAttachmentsProps, IFileAttachmentsStates> {
	fileInput: any = React.createRef();
	listFile: any = [];
	listFileTemp: any = [];
	listFileAttachmentResult: AttachmentItem[] = [];
	state = {
		isLoadDone: false,
		itemAttachment: new AttachmentItem(),
		visibleModalViewFile: false,
		className: "",
	};
	async componentDidMount() {
		await stores.settingStore.getAll();

	}
	async componentDidUpdate(prevProps, prevState) {
		if (this.props.isLoadFile !== prevProps.isLoadFile) {
			this.listFile = [];
			this.listFileAttachmentResult = [];
			this.props.files!.map(item => {
				if (item != undefined && item.id != undefined && item.id > 0) {
					let upload = {
						uid: item.id.toString(),
						name: item.key!,
						status: 'done',
						ext: item.ext,
						url: this.getFile(item.id),
						thumbUrl: MineTypeConst.getThumUrl(item.ext!),
					}
					this.listFile.push(upload);
					this.listFileAttachmentResult.push(item);
				}
			});
			await this.initClassName();
			if (!!this.props.visibleModalViewFile) {
				await this.setState({ visibleModalViewFile: this.props.visibleModalViewFile });
				this.onViewDetailFile(this.listFile[0]);
			}
			this.setState({ isLoadDone: !this.state.isLoadDone });
		}
	}
	initClassName = async () => {
		let className = "upload-list-inline";
		if (this.props.allowRemove == false)
			className = className.concat(" hiddenDelete");
		if (this.props.isViewFile == false)
			className = className.concat(" hiddenEye");
		await this.setState({ className: className });

	}
	handleChange = async ({ fileList: newFileList }) => {
		this.listFileTemp = newFileList;
	}

	uploadImage = async (options) => {
		const { onSuccess, file } = options;
		let fileUp: any = ({ "data": file, "fileName": file.name });
		let fileToUpload: FileParameter = fileUp;
		let typeFile = (this.props.componentUpload);

		let result: FilesDto = await stores.fileStore.createFile(typeFile, fileToUpload);
		if (!!result && result.fi_id != undefined) {
			onSuccess("done");
			this.setState({ isLoadDone: false });

			let attachmentItem = new AttachmentItem();
			attachmentItem.id = result.fi_id;
			attachmentItem.key = result.fi_name;
			attachmentItem.ext = result.fi_extension;
			attachmentItem.path = result.fi_path;
			attachmentItem.isdelete = false;
			this.listFileAttachmentResult.push(attachmentItem);
			this.listFile = this.listFileTemp;
			if (this.props.onSubmitUpdate != undefined) {
				await this.props.onSubmitUpdate(this.listFileAttachmentResult);
			}
			this.setState({ isLoadDone: true });

		}
	}
	onViewDetailFile = (file) => {
		let index1 = this.listFile.findIndex(item => item.uid == file.uid);
		let attach = this.listFileAttachmentResult[index1];
		this.setState({ visibleModalViewFile: true, itemAttachment: attach });
	}

	deleteFileItem = async (file) => {
		let self = this;
		confirm({
			title: L('YouWantToDelete') + ": " + file.name + "?" + L('cac_thay_doi_se_chi_thanh_cong_khi_ban_nhan_nut_luu'),
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				self.setState({ isLoadDone: true });
				let index = self.listFile.findIndex(item => item.uid == file.uid);
				if (self.listFileAttachmentResult.length > index) {
					self.listFileAttachmentResult[index].isdelete = true;
					self.listFileAttachmentResult.splice(index, 1);
					if (self.props.onSubmitUpdate !== undefined) {
						self.props.onSubmitUpdate(self.listFileAttachmentResult);
					}
				}
				self.listFile = self.listFileTemp;
				self.setState({ isLoadDone: false });
			},
			onCancel() {

			},
		});

	};
	beforeUpload = (file: RcFile) => {
		const { componentUpload } = this.props;
		const { hostSetting } = stores.settingStore;
		let limitSize = false;
		if (componentUpload == FileUploadType.Avatar) {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				message.error(L('anh_phai_la_tep_jpg_png'));
				return Promise.reject(false);
			}
			limitSize = file.size / 1024 / 1024 < 0.2;
			if (!limitSize) {
				message.error(L('anh_phai_nho_hon_2_mb'));
				return Promise.reject(false);
			}
		} else {
			limitSize = file.size < hostSetting.general.maxUploadedData;
			if (!limitSize) {
				message.error(L("tep_phai_nho_hon") + ` ${hostSetting.general.maxUploadedData / 1024 / 1024}MB!`);
				return Promise.reject(false);
			}
		}
		return true;
	}
	render() {
		const { isMultiple, allowRemove, isViewFile } = this.props;
		const col24 = cssCol(24);
		const uploadButton = (
			<Button icon={<UploadOutlined />}>{L('tai_len')}</Button>
		);
		return (
			<Row style={{ width: '100%', margin: '2px', display: 'block' }}>
				<Upload
					listType="picture"
					className={this.state.className}
					beforeUpload={this.beforeUpload}
					customRequest={this.uploadImage}
					onPreview={this.onViewDetailFile}
					onRemove={async (file) => { allowRemove && await this.deleteFileItem(file) }}

					fileList={this.listFile}
					onChange={allowRemove == false ? () => { } : this.handleChange}
					showUploadList={{
						showDownloadIcon: true,
						downloadIcon: <DownloadOutlined />,
						showRemoveIcon: true,
					}}
				>
					{(isMultiple != undefined && isMultiple == true) ? uploadButton : (this.listFile.length >= 1 ? null : uploadButton)}
				</Upload>

				{(isViewFile == undefined || isViewFile == true) &&
					<Modal
						width="80vw"
						bodyStyle={{ height: (MineTypeConst.checkExtentionFileType(this.state.itemAttachment.ext!) === MineTypeConst.IMAGE_EXT) ? "100%" : "" }}
						title={L("ViewFile" + " " + this.state.itemAttachment.key)}
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
									<ViewFileContent
										key={this.state.itemAttachment.id! + "_" + this.state.itemAttachment.key!}
										itemAttach={this.state.itemAttachment}
										isFileScan={true}
									/>
									: null}
							</Col>
						</Row>
					</Modal>
				}
			</Row>
		);
	}

}

