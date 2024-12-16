import * as React from 'react';
import { cssCol, FileUploadType } from '@lib/appconst';
import { Row, Button, Spin, Col, Modal, Image, Upload, message } from 'antd';
import MineTypeConst from '@lib/minetypeConst';
import { L } from '@lib/abpUtility';
import { AttachmentItem, FilesDto, FileParameter, FilesOfUserDto } from '@services/services_autogen';
import { PlusOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import ViewFileOfUserContent from '../../../../../components/ViewFile/viewFileOfUserContent';
import { UploadFile } from 'antd/lib/upload/interface';

export interface IFileAttachmentsProps {
	files: FilesOfUserDto[];
	allowEditting: boolean;
	isViewDetailFileAsModal?: boolean;
	componentUpload?: FileUploadType;
	isLoadFile?: boolean;
	onRemove: (id: number) => void;
}
export interface IFileAttachmentsStates {
	visibleModalViewFile: boolean;
	isLoadDone: boolean,
}

export default class FileOfUserAttachmentest extends AppComponentBase<IFileAttachmentsProps, IFileAttachmentsStates> {

	state = {
		isLoadDone: false,
		visibleModalViewFile: false,
		check: -1,
	};
	fileInput: any = React.createRef();
	listFile: any = [];
	itemFileView: any;

	componentDidMount() {
		this.setState({ isLoadDone: false });
		this.mapFiletoUpload(this.props.files);
		this.setState({ isLoadDone: true });

	}

	//dang sua loi chua cap nhat upload theo file list
	componentDidUpdate(prevProps, prevState): void {
		if (this.props.isLoadFile != prevProps.isLoadFile) {
			this.mapFiletoUpload(this.props.files);
		}
	}

	mapFiletoUpload = (files: FilesOfUserDto[]) => {
		this.listFile = [];
		files.map(item => {
			let upload = {
				uid: item.fi_us_id.toString(),
				name: item.fi_us_name!,
				status: 'done',
				ext: item.fi_us_extension,
				url: this.getFileOfUser(item),
				thumbUrl: MineTypeConst.getThumUrl(item.fi_us_extension!),
			};
			this.listFile.push(upload);
		})
		this.setState({ isLoadDone: true });
	}

	onRemove = (id: number) => {
		this.setState({ isLoadDone: false });
		if (!!this.props.onRemove) {
			this.props.onRemove(id);
		}
		this.setState({ isLoadDone: true });
	}

	onViewDetailFile = (file) => {
		this.itemFileView = file;
		this.setState({ visibleModalViewFile: true });

	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {
		const { files, allowEditting, isViewDetailFileAsModal } = this.props;
		const col24 = cssCol(24);

		return (
			<Row justify='center' style={{ width: '100%', margin: '2px' }}>
				{allowEditting &&
					<Col>
						<Upload
							listType="picture-card"
							className="avatar-uploader"
							onPreview={this.onViewDetailFile}
							onRemove={async (file) => { this.setState({ isLoadDone: false }); await this.onRemove(Number(file.uid)); this.setState({ isLoadDone: true }); }}
							fileList={this.listFile}
						/>
					</Col>
				}
				{(isViewDetailFileAsModal == undefined || isViewDetailFileAsModal == true) &&
					<Row>
						<Col
							{...col24}
							id={"ViewFileContentDocumentId"}
						>
							{this.itemFileView != undefined && this.itemFileView.uid != undefined ?
								<ViewFileOfUserContent
									visible={this.state.visibleModalViewFile}
									onCancel={() => this.setState({ visibleModalViewFile: false })}
									urlView={this.itemFileView.url!}
									ext={this.itemFileView.ext}
								/>
								: null}
						</Col>
					</Row>

				}
			</Row>
		);
	}

}

