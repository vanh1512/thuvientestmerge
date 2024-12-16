import * as React from 'react';
import { Col, Dropdown, Typography, List, Menu, Row } from 'antd';
import { AttachmentItem, FilesOfUserDto, FolderDto } from '@src/services/services_autogen';
import { DeleteOutlined, DeliveredProcedureOutlined, DownloadOutlined, EditOutlined, FolderFilled, FullscreenOutlined, InfoCircleOutlined, LinkOutlined, MoreOutlined, StarFilled, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import { actionTable } from './TableFolderAndFile';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { FileUploadType, RouterPath } from '@src/lib/appconst';
import { L } from '@src/lib/abpUtility';
import MineTypeConst from '@src/lib/minetypeConst';
import FileOfUserAttachmentest from '../FileOfUserAttachmentest';

const { Paragraph } = Typography;
export interface Iprops {
	foldersInside: FolderDto[];
	filesInside: FilesOfUserDto[];
	folderSelected: FolderDto;
	fileSelected: FilesOfUserDto;
	isLoadFile: boolean;
	onAction: (action: number, item?) => void;
}
export default class ListFolderAndFile extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,
	};
	attachmentItem: AttachmentItem = new AttachmentItem;
	onAction = async (action: number, item?) => {
		this.setState({ isLoadDone: false, })
		if (this.props.onAction != undefined) {
			await this.props.onAction(action, item);
			this.setState({ isLoadDone: true, });
		}
	}
	render() {
		const { foldersInside, filesInside, fileSelected, folderSelected } = this.props;
		const marker = fileSelected.fi_us_id !== undefined ? fileSelected.fi_us_marker : folderSelected.fo_is_marker;

		const prefixManager = RouterPath.admin_subscriber;
		const link = fileSelected.fi_us_id !== undefined ? this.getFileOfUser(fileSelected) : AppConsts.appBaseUrl + prefixManager + '/filesOfUser' + '?link=' + folderSelected.fo_link!;

		const menuClickRow = (
			<Menu>
				<Menu.Item key="Row_open" onClick={() => this.onAction(actionTable.onDoubleClickRow)}><FullscreenOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Open")}</Menu.Item>
				<Menu.Item key="Row_share" onClick={() => this.onAction(actionTable.onShareItem)}><UserAddOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Share")}</Menu.Item>
				<Menu.Item key="Row_move" onClick={() => this.onAction(actionTable.onMoveLocation)}><DeliveredProcedureOutlined style={{ fontSize: '18px' }} />&nbsp;{L("MoveTo")}</Menu.Item>
				<Menu.Item key="Row_star" onClick={() => this.onAction(actionTable.onStarred)}>{marker ? <><StarFilled style={{ fontSize: '18px' }} />&nbsp;{L("RemoveStar")}</> : <><StarOutlined style={{ fontSize: '18px' }} />{L("Starred")}  </>} </Menu.Item>
				<Menu.Item key="Row_copy_link" >
					<Paragraph
						style={{ padding: '4px 0', margin: '-4px', }}
						copyable={{
							text: link,
							icon: [<div style={{ color: 'black' }}><LinkOutlined style={{ fontSize: '18px' }} />&nbsp;&nbsp;&nbsp;{L("CopyLink")}</div>],
							tooltips: false,
						}}
					/>
				</Menu.Item>
				<Menu.Item key="Row_change_name" onClick={() => this.onAction(actionTable.onCreateUpdateModal)}><EditOutlined style={{ fontSize: '18px' }} />&nbsp;{L("ChangeName")}</Menu.Item>
				<Menu.Item key="Row_detail" onClick={() => this.onAction(actionTable.onDetailModal)}><InfoCircleOutlined style={{ fontSize: '18px' }} />&nbsp;{L("SeeDetails")}</Menu.Item>
				<Menu.Item key="Row_download" onClick={() => this.onAction(actionTable.onDownload)}><DownloadOutlined target="_blank" href={process.env.PUBLIC_URL + "/1.png"} download style={{ fontSize: '18px' }} />&nbsp;{L("Download")}</Menu.Item>
				<Menu.Item key="Row_delete" onClick={() => this.onAction(actionTable.onDelete)}><DeleteOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Delete")}</Menu.Item>
			</Menu>
		);
		return (
			<>
				<h2>{L("Folder")}</h2>
				<List
					grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5, xl: 5, xxl: 5 }}
					dataSource={[...foldersInside]}
					locale={{ "emptyText": true }}
					renderItem={item => (
						<List.Item onClick={() => this.onAction(actionTable.initDataFolder, item)} onDoubleClick={() => this.onAction(actionTable.onDoubleClickRow)} className={folderSelected.fo_id == item.fo_id ? "bg-click" : "bg-folder"} style={{ padding: '15px', borderRadius: '15px', fontSize: '17px', textAlign: 'center' }}>
							<Row style={{ alignItems: 'center' }}>
								<Col span={4}><FolderFilled style={{ fontSize: '24px', color: '#fad165' }} /></Col>
								<Col span={17}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.fo_name}</span></Col>
								<Col span={3}>
									<Dropdown overlay={menuClickRow} trigger={['click']} >
										<MoreOutlined style={{ fontSize: '18px' }} onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.onAction(actionTable.initDataFolder, item)} />
									</Dropdown>
								</Col>
							</Row>
						</List.Item>
					)}
				/>
				<h2>{L("File")}</h2>
				<List
					grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5, xl: 5, xxl: 5 }}
					dataSource={[...filesInside]}
					locale={{ "emptyText": true }}
					renderItem={item => (
						<List.Item onClick={() => this.onAction(actionTable.initDataFile, item)} className={fileSelected.fi_us_id == item.fi_us_id ? "bg-click" : "bg-folder"} style={{ padding: '15px', borderRadius: '15px', fontSize: '17px', textAlign: 'center' }}>
							<Row style={{ alignItems: 'center' }}>
								<Col span={4}>{
									MineTypeConst.checkIconExtension(item.fi_us_extension!)
								}
								</Col>
								<Col span={17}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.fi_us_name}</span></Col>
								<Col span={3}>
									<Dropdown overlay={menuClickRow} trigger={['click']} >
										<MoreOutlined style={{ fontSize: '18px' }} onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.onAction(actionTable.initDataFile, item)} />
									</Dropdown>
								</Col>
							</Row>
							<Col>
								<FileOfUserAttachmentest
									files={[item]}
									allowEditting={true}
									componentUpload={FileUploadType.Contracts}
									isLoadFile={this.props.isLoadFile}
									onRemove={async (id: number) => {
										await this.onAction(actionTable.onDelete);
									}}
								/>
							</Col>
						</List.Item>
					)}
				/>
			</>
		)
	}
}