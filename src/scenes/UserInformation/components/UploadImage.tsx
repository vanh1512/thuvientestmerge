import * as React from 'react';
import { cssCol, FileUploadType } from '@lib/appconst';
import { Row, Col, Modal, Upload, message, Button } from 'antd';
import MineTypeConst from '@lib/minetypeConst';
import { L } from '@lib/abpUtility';
import { stores } from '@stores/storeInitializer';
import { AttachmentItem, FilesDto, FileParameter } from '@services/services_autogen';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { RcFile } from 'antd/lib/upload';
import ViewFileContent from '@src/components/ViewFile/viewFileContent';

export interface IFileAttachmentsProps {
    onSubmitUpdate?: (data: AttachmentItem[]) => void;
    files?: AttachmentItem[];
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

export default class UploadImage extends AppComponentBase<IFileAttachmentsProps, IFileAttachmentsStates> {
    fileInput: any = React.createRef();
    listFile: any = [];
    listFileAttachmentResult: AttachmentItem[] = [];
    state = {
        isLoadDone: false,
        itemAttachment: new AttachmentItem(),
        visibleModalViewFile: false,
        className: "",
    };
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
            this.setState({ isLoadDone: !this.state.isLoadDone });
        }
    }
    initClassName = async () => {
        let className = "avatar-uploader";
        if (this.props.allowRemove == false)
            className = className.concat(" hiddenDelete");
        if (this.props.isViewFile == false)
            className = className.concat(" hiddenEye");
        await this.setState({ className: className });

    }
    handleChange = async ({ fileList: newFileList }) => {
        this.setState({ isLoadDone: false });
        this.listFile = newFileList;
        this.setState({ isLoadDone: true });
    }
    uploadImage = async (options) => {
        const { onSuccess, file } = options;
        let fileUp: any = ({ "data": file, "fileName": file.name });
        let fileToUpload: FileParameter = fileUp;
        let typeFile = (this.props.componentUpload);

        let result: FilesDto = await stores.fileStore.createFile(typeFile, fileToUpload);
        if (!!result && result.fi_id != undefined) {
            onSuccess("done");
            let attachmentItem = new AttachmentItem();
            attachmentItem.id = result.fi_id;
            attachmentItem.key = result.fi_name;
            attachmentItem.ext = result.fi_extension;
            attachmentItem.path = result.fi_path;
            attachmentItem.isdelete = false;
            this.listFileAttachmentResult.push(attachmentItem);

            if (this.props.onSubmitUpdate != undefined) {
                await this.props.onSubmitUpdate(this.listFileAttachmentResult);
            }
        }
    }
    onViewDetailFile = (file) => {
        let index1 = this.listFile.findIndex(item => item.uid == file.uid);
        let attach = this.listFileAttachmentResult[index1];
        this.setState({ visibleModalViewFile: true, itemAttachment: attach });
    }

    deleteFileItem = async (file) => {
        this.setState({ isLoadDone: true });
        let self = this;
        let index = this.listFile.findIndex(item => item.uid == file.uid);
        if (this.listFileAttachmentResult.length > index) {
            this.listFileAttachmentResult[index].isdelete = true;
            this.listFileAttachmentResult.splice(index, 1);
            if (self.props.onSubmitUpdate !== undefined) {
                self.props.onSubmitUpdate(this.listFileAttachmentResult);
            }
        }
        this.setState({ isLoadDone: false });
    };
    beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Ảnh phải là tệp JPG/PNG!');
            return Promise.reject(false);
        }

        const limitSize = file.size / 1024 / 1024 < 0.1;
        if (!limitSize) {
            message.error('Ảnh phải nhỏ hơn 0.1MB!');
            return Promise.reject(false);
        }
        return true;
    };

    render() {
        const { isMultiple, allowRemove, isViewFile, componentUpload } = this.props;
        const col24 = cssCol(24);
        const uploadButton = (
            <div style={{ borderBlock: "1px" }}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}></div>
            </div>
        );
        return (
            <Row style={{ width: '100%', margin: '2px', display: 'block' }}>
                <Upload
                    listType="picture-card"
                    className={this.state.className}
                    beforeUpload={componentUpload == FileUploadType.Avatar ? this.beforeUpload : undefined}
                    customRequest={this.uploadImage}
                    onPreview={this.onViewDetailFile}
                    onRemove={allowRemove == false ? () => { } : this.deleteFileItem}
                    fileList={this.listFile}
                    onChange={allowRemove == false ? () => { } : this.handleChange}
                >
                    {(isMultiple != undefined && isMultiple == true) ? uploadButton : (this.listFile.length >= 1 ? null : uploadButton)}
                </Upload>

                {(isViewFile == undefined || isViewFile == true) &&
                    <Modal
                        width="80vw"
                        bodyStyle={{ height: (MineTypeConst.checkExtentionFileType(this.state.itemAttachment.ext!) === MineTypeConst.IMAGE_EXT) ? "100%" : "" }}
                        // title={L("ViewFile " + this.state.itemAttachment.key)}
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

