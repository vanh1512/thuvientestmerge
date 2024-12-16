import * as React from 'react';
import { Col, Dropdown, Typography, List, Menu, Row, Image } from 'antd';
import { AttachmentItem, FilesOfUserRolesDto, FolderRolesDto } from '@src/services/services_autogen';
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileTextOutlined, FolderFilled, FullscreenOutlined, InfoCircleOutlined, LinkOutlined, MoreOutlined, StarFilled, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import { actionTable } from './TableFolderAndFileRoles';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { FileUploadType, RouterPath } from '@src/lib/appconst';
import { eResourceRoleStatus } from '@src/lib/enumconst';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import MineTypeConst from '@src/lib/minetypeConst';
import FileOfUserAttachmentest from '../../../FilesOfUser/components/FileOfUserAttachmentest';

const { Paragraph } = Typography;
export interface Iprops {
	foldersRolesInside: FolderRolesDto[];
	filesRolesInside: FilesOfUserRolesDto[];
	folderRolesSelected: FolderRolesDto;
	fileRolesSelected: FilesOfUserRolesDto;
	onAction: (action: number, item?) => void;
	isLoadFile: boolean;
}
export default class ListFolderAndFileRoles extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,

	};
	onAction = async (action: number, item?) => {
		this.setState({ isLoadDone: false, })
		if (this.props.onAction != undefined) {
			await this.props.onAction(action, item);
		}
		await this.setState({ isLoadDone: true })
	}

	render() {
		const { foldersRolesInside, filesRolesInside, fileRolesSelected, folderRolesSelected } = this.props;
		const marker = fileRolesSelected.fi_us_id !== undefined ? fileRolesSelected.fi_ro_marker : folderRolesSelected.fo_ro_marker;
		let isCheckPermissionEdit = folderRolesSelected.fo_id !== undefined ? folderRolesSelected.fo_ro_role == eResourceRoleStatus.EDITOR.num : fileRolesSelected.fi_ro_role == eResourceRoleStatus.EDITOR.num;
		const prefixManager = RouterPath.admin_subscriber;
		let link = (folderRolesSelected.fo_id !== undefined && folderRolesSelected.itemFolder != undefined) ? AppConsts.appBaseUrl + prefixManager + '/filesSharedWithUser' + '?link=' + folderRolesSelected.itemFolder.fo_link! : folderRolesSelected.fo_id !== undefined ? this.getFileOfUser(fileRolesSelected.itemFileOfUser!) : "";
		const menuClickRow = (
			<Menu>
				<Menu.Item key="Row_open" onClick={() => this.onAction(actionTable.onDoubleClickRow)}><FullscreenOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Open")}</Menu.Item>
				<Menu.Item key="Row_share" disabled={!isCheckPermissionEdit} onClick={() => this.onAction(actionTable.onShareItem)}><UserAddOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Share")}</Menu.Item>
				<Menu.Item key="Row_star" onClick={() => this.onAction(actionTable.onStarred)}>{marker ? <><StarFilled style={{ fontSize: '18px' }} />&nbsp;{L("RemoveStar")} </> : <><StarOutlined style={{ fontSize: '18px' }} /> {L("Starred")}  </>} </Menu.Item>
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
				<Menu.Item key="Row_change_name" disabled={!isCheckPermissionEdit} onClick={() => this.onAction(actionTable.onCreateUpdateModal)}><EditOutlined style={{ fontSize: '18px' }} />&nbsp;{L("ChangeName")}</Menu.Item>
				<Menu.Item key="Row_detail" onClick={() => this.onAction(actionTable.onDetailModal)}><InfoCircleOutlined style={{ fontSize: '18px' }} />&nbsp;{L("SeeDetails")}</Menu.Item>
				{/* download folder doing (file cứng)*/}
				<Menu.Item key="Row_download" onClick={() => this.onAction(actionTable.onDownload)}><DownloadOutlined target="_blank" href={process.env.PUBLIC_URL + "/1.png"} download style={{ fontSize: '18px' }} />&nbsp;{L("Download")}</Menu.Item>
				<Menu.Item key="Row_delete" onClick={() => this.onAction(actionTable.onDelete)}><DeleteOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Delete")}</Menu.Item>
			</Menu>
		);
		return (
			<>
				<h2>{L("Folder")}</h2>
				<List
					grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5, xl: 6, xxl: 7 }}
					dataSource={[...foldersRolesInside]}
					locale={{ "emptyText": true }}
					renderItem={item => (
						<List.Item onClick={() => this.onAction(actionTable.initDataFolder, item)} onDoubleClick={() => this.onAction(actionTable.onDoubleClickRow)} className={folderRolesSelected.fo_id == item.fo_id ? "bg-click" : "bg-folder"} style={{ padding: '15px', borderRadius: '15px', fontSize: '17px', textAlign: 'center' }}>
							<Row style={{ alignItems: 'center' }}>
								<Col span={4}><FolderFilled style={{ fontSize: '24px', color: '#fad165' }} /></Col>
								<Col span={17}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.itemFolder != undefined && item.itemFolder.fo_name}</span></Col>
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
					grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5, xl: 6, xxl: 7 }}
					dataSource={[...filesRolesInside]}
					locale={{ "emptyText": true }}
					renderItem={item => (
						<List.Item onClick={() => this.onAction(actionTable.initDataFile, item)} className={fileRolesSelected.fi_us_id == item.fi_us_id ? "bg-click" : "bg-folder"} style={{ padding: '15px', borderRadius: '15px', fontSize: '17px', textAlign: 'center' }}>
							<Row style={{ alignItems: 'center' }}>
								<Col span={4}>{
									MineTypeConst.checkIconExtension(item.itemFileOfUser.fi_us_extension!)
								}
								</Col>
								<Col span={17}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.itemFileOfUser != undefined && item.itemFileOfUser.fi_us_name}</span></Col>
								<Col span={3}>
									<Dropdown overlay={menuClickRow} trigger={['click']} >
										<MoreOutlined style={{ fontSize: '18px' }} onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.onAction(actionTable.initDataFile, item)} />
									</Dropdown>
								</Col>
							</Row>
							<FileOfUserAttachmentest
								files={[item.itemFileOfUser]}
								allowEditting={true}
								componentUpload={FileUploadType.Contracts}
								isLoadFile={this.props.isLoadFile}
								onRemove={async (id: number) => {
									await this.onAction(actionTable.onDelete);
								}}
							/>
						</List.Item>
					)}
				/>
			</>
		)
	}
}