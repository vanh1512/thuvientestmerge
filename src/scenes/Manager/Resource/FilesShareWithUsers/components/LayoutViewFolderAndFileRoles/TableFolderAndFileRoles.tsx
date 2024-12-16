import * as React from 'react';
import { Avatar, Button, Col, Dropdown, Image, Menu, Row, Table, Tooltip, message, } from 'antd';
import { FilesOfUserRolesDto, FolderRolesDto } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileTextOutlined, FolderFilled, FullscreenOutlined, InfoCircleOutlined, LinkOutlined, MoreOutlined, StarFilled, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment';
import Paragraph from 'antd/lib/typography/Paragraph';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { RouterPath } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import { eResourceRoleStatus } from '@src/lib/enumconst';
import HistoryHelper from '@src/lib/historyHelper';
import MineTypeConst from '@src/lib/minetypeConst';

export const actionTable = {
	initDataFolder: 1,
	initDataFile: 2,
	onStarred: 3,
	onCreateUpdateModal: 4,
	onDelete: 5,
	onDoubleClickRow: 6,
	onDetailModal: 7,
	onMoveLocation: 8,
	onShareItem: 9,
	onChangeTypeFileOrFolder: 10,
	onDownload: 11,
}

export interface Iprops {
	foldersRolesInside: FolderRolesDto[];
	filesRolesInside: FilesOfUserRolesDto[];
	folderRolesSelected: FolderRolesDto;
	fileRolesSelected: FilesOfUserRolesDto;
	onAction: (action: number, item?) => void;
}
export default class TableFolderAndFileRoles extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,
		marker: undefined,
	};
	fileHover: FilesOfUserRolesDto = new FilesOfUserRolesDto();
	folderHover: FolderRolesDto = new FolderRolesDto();
	isCheckPermissionEditHover: boolean = false;




	onAction = async (action: number, item?) => {
		if (this.props.onAction != undefined) {
			this.props.onAction(action, item);
		}
	}
	onHoverFile = async (file: FilesOfUserRolesDto) => {


		this.setState({ isLoadDone: false });
		this.folderHover = await new FolderRolesDto();
		this.fileHover = await file;
		this.isCheckPermissionEditHover = this.fileHover.fi_ro_role == eResourceRoleStatus.EDITOR.num;
		this.setState({ marker: file.fi_ro_marker, isLoadDone: true });
	}

	onHoverFolder = (folder: FolderRolesDto) => {
		this.setState({ isLoadDone: false });
		this.fileHover = new FilesOfUserRolesDto();
		this.folderHover = folder;
		this.isCheckPermissionEditHover = this.folderHover.fo_ro_role == eResourceRoleStatus.EDITOR.num;
		this.setState({ marker: folder.fo_ro_marker, isLoadDone: true });
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	onShareFolder = async (item) => {
		if (this.isCheckPermissionEditHover == false) { message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay")) }
		else {
			await this.onAction(actionTable.initDataFolder, item);
			await this.onAction(actionTable.onShareItem);
		}
	}

	onShareFile = async (item) => {
		if (this.isCheckPermissionEditHover == false) { message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay")) }
		else {
			await this.onAction(actionTable.initDataFile, item);
			await this.onAction(actionTable.onShareItem);
		}
	}
	render() {
		const { foldersRolesInside, filesRolesInside, fileRolesSelected, folderRolesSelected } = this.props;
		const sessionStore = stores.sessionStore;
		const prefixManager = RouterPath.admin_subscriber;
		let link = (folderRolesSelected.fo_id !== undefined && folderRolesSelected.itemFolder != undefined) ? AppConsts.appBaseUrl + prefixManager + '/filesSharedWithUser' + '?link=' + folderRolesSelected.itemFolder.fo_link! : folderRolesSelected.fo_id !== undefined ? this.getFileOfUser(fileRolesSelected.itemFileOfUser!) : "";

		const columnsFolder: ColumnsType<FolderRolesDto> = [
			{
				title: L('Name'), key: 'folder_1', width: "22%",
				ellipsis: {
					showTitle: false,
				},
				render: (value, item) => (
					<Tooltip placement="topLeft" title={item.itemFolder.fo_name}>
						<FolderFilled style={{ color: '#fad165', fontSize: '19px', paddingTop: '5px' }} />&nbsp;
						{item.itemFolder.fo_name}&nbsp;&nbsp;&nbsp;&nbsp;
						{item.fo_ro_marker && <StarFilled style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }} />}
					</Tooltip>
				),
			},
			{
				title: L('Owner'), key: 'folder_2', width: '22%', render: (text: string, item: FolderRolesDto, index: number) => <div>
					{/* <Avatar style={{ height: 30, width: 30 }} shape="circle" alt={'profile'} src={item.itemFolder != undefined ? this.getFile(stores.sessionStore.getUserAvatarByUserId(item.itemFolder.us_id_owner)) : ""} />&nbsp;&nbsp;{item.itemFolder != undefined && sessionStore.getUserNameById(item.itemFolder.us_id_owner)} */}
					<Avatar style={{ cursor: "pointer", backgroundColor: AppConsts.backGroundColorByName[sessionStore.getUserNameById(item.itemFolder.us_id_owner).charAt(0)] }} alt={'profile'} shape='circle'>
						{sessionStore.getUserAvatarByUserId(item.itemFolder.us_id_owner)! > 0 ?
							<Image width={35} height={35} src={item.itemFolder != undefined ? this.getFile(stores.sessionStore.getUserAvatarByUserId(item.itemFolder.us_id_owner)) : ""} />
							:
							sessionStore.getUserNameById(item.itemFolder.us_id_owner).charAt(0)
						}
					</Avatar>&nbsp;&nbsp;{item.itemFolder != undefined && sessionStore.getUserNameById(item.itemFolder.us_id_owner)}
				</div>
			},
			{ title: L('LastUpdate'), key: 'folder_3', width: '22%', render: (text: string, item: FolderRolesDto, index: number) => <div>{item.itemFolder != undefined && moment(item.itemFolder.fo_last_updated_at).format("DD/MM/YYYY")}</div> },
			{
				title: L('Size'), key: 'folder_4', width: '12%',
				render: (text: string, item: FolderRolesDto, index: number) => <div>{"-"}</div>
			},
			{
				title: L(''), key: 'folder_5', width: '22%', render: (text: string, item: FolderRolesDto, index: number) =>
					<Row style={{ alignItems: 'center' }}>
						<Col span={18}>
							{this.folderHover.fo_id == item.fo_id &&
								<Row style={{ justifyContent: 'space-around' }}>
									<UserAddOutlined title={L("Share")} onClick={async () => { this.onShareFolder(item) }} />
									<DownloadOutlined title={L("Download")} onClick={async () => { await this.onAction(actionTable.initDataFolder, item); this.onAction(actionTable.onDownload) }} />
									<EditOutlined title={L("ChangeName")} onClick={async () => {
										if (!this.isCheckPermissionEditHover) {
											message.error(L("DontHavePermissionFolder"));
											return;
										}
										await this.onAction(actionTable.initDataFolder, item);
										await this.onAction(actionTable.onCreateUpdateModal);
									}} />
									{this.state.marker ?
										<StarFilled
											title={L("RemoveStar")}
											onClick={async () => {
												await this.onAction(actionTable.initDataFolder, item);
												await this.onAction(actionTable.onStarred);
												this.setState({ marker: !this.state.marker });
											}} />
										:
										<StarOutlined
											title={L("Starred")}
											onClick={async () => {
												await this.onAction(actionTable.initDataFolder, item);
												this.onAction(actionTable.onStarred);
												this.setState({ marker: !this.state.marker });
											}}
										/>
									}
								</Row>
							}
						</Col>
						<Col span={6}>
							<Dropdown overlay={menuClickRow} trigger={['click']}>
								<MoreOutlined style={{ fontSize: '18px' }} onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.onAction(actionTable.initDataFolder, item)} />
							</Dropdown>
						</Col>
					</Row>
			},
		];
		const columnsFile: ColumnsType<FilesOfUserRolesDto> = [

			{
				title: L('Name'), key: 'file_1', width: "22%",
				ellipsis: {
					showTitle: false,
				},
				render: (value, item) => (
					<Tooltip placement="topLeft" title={item.itemFileOfUser.fi_us_name}>
						{MineTypeConst.checkIconExtension(item.itemFileOfUser.fi_us_extension!)}&nbsp;
						{item.itemFileOfUser.fi_us_name}&nbsp;&nbsp;&nbsp;&nbsp;
						{item.fi_ro_marker && <StarFilled style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }} />}
					</Tooltip>
				),

			},
			{
				title: L('Owner'), key: 'file_2', width: '22%', render: (text: string, item: FilesOfUserRolesDto, index: number) => <div>
					<Avatar style={{ cursor: "pointer" }} alt={'profile'} shape='circle'><Image width={35} height={35} src={item.itemFileOfUser != undefined ? this.getFile(stores.sessionStore.getUserAvatarByUserId(item.itemFileOfUser.us_id)) : ""} /></Avatar>&nbsp;&nbsp;{item.itemFileOfUser != undefined && sessionStore.getUserNameById(item.itemFileOfUser.us_id)}
				</div>
			},
			{ title: L('LastUpdate'), key: 'file_3', width: '22%', render: (text: string, item: FilesOfUserRolesDto, index: number) => <div>{item.itemFileOfUser != undefined && moment(item.itemFileOfUser.fi_us_updated_at).format("DD/MM/YYYY")}</div> },
			{
				title: L('Size'), key: 'file_4', width: '12%',
				render: (text: string, item: FilesOfUserRolesDto, index: number) => <div>{item.itemFileOfUser != undefined && AppConsts.convertResourceFile((Math.round(item.itemFileOfUser.fi_us_size / 1024 * 10) / 10))}</div>
			},
			{
				title: L(''), key: 'file_5', width: '22%', render: (text: string, item: FilesOfUserRolesDto, index: number) =>
					<Row style={{ alignItems: 'center' }}>
						<Col span={18}>
							{this.fileHover.fi_us_id == item.fi_us_id &&
								<Row style={{ justifyContent: 'space-around' }}>
									<UserAddOutlined title={L("Share")} onClick={async () => { await this.onShareFile(item) }} />
									<DownloadOutlined title={L("Download")} onClick={async () => { await this.onAction(actionTable.initDataFile, item); this.onAction(actionTable.onDownload) }} />
									<EditOutlined title={L("ChangeName")} onClick={async () => {
										if (!this.isCheckPermissionEditHover) {
											message.error(L("DontHavePermissionFile"));
											return;
										}
										await this.onAction(actionTable.initDataFile, item);
										await this.onAction(actionTable.onCreateUpdateModal);
									}} />
									{this.state.marker ?
										<StarFilled
											title={L("RemoveStar")}
											onClick={async () => {
												await this.onAction(actionTable.initDataFile, item);
												await this.onAction(actionTable.onStarred);
												this.setState({ marker: !this.state.marker });
											}}
										/>
										:
										<StarOutlined
											title={L("Starred")}
											onClick={async () => {
												await this.onAction(actionTable.initDataFile, item);
												this.onAction(actionTable.onStarred);
												this.setState({ marker: !this.state.marker });
											}}
										/>}
								</Row>
							}
						</Col>
						<Col span={6}>
							<Dropdown overlay={menuClickRow} trigger={['click']} >
								<MoreOutlined style={{ fontSize: '18px' }} onClick={(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => this.onAction(actionTable.initDataFile, item)} />
							</Dropdown>
						</Col>
					</Row>
			},
		];
		const menuClickRow = (
			<Menu>
				<Menu.Item key="Row_open" onClick={() => this.onAction(actionTable.onDoubleClickRow)}><FullscreenOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Open")}</Menu.Item>
				<Menu.Item key="Row_share" disabled={!this.isCheckPermissionEditHover} onClick={() => this.onAction(actionTable.onShareItem)}><UserAddOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Share")}</Menu.Item>
				<Menu.Item key="Row_star" onClick={() => this.onAction(actionTable.onStarred)}>{this.state.marker ? <><StarFilled style={{ fontSize: '18px' }} />&nbsp;{L("RemoveStar")}</> : <><StarOutlined style={{ fontSize: '18px' }} />{L("Starred")} </>} </Menu.Item>
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
				<Menu.Item key="Row_change_name" disabled={!this.isCheckPermissionEditHover} onClick={() => this.onAction(actionTable.onCreateUpdateModal)}><EditOutlined style={{ fontSize: '18px' }} />&nbsp;{L("ChangeName")}</Menu.Item>
				<Menu.Item key="Row_detail" onClick={() => this.onAction(actionTable.onDetailModal)}><InfoCircleOutlined style={{ fontSize: '18px' }} />&nbsp;{L("SeeDetails")}</Menu.Item>
				<Menu.Item key="Row_download" onClick={() => this.onAction(actionTable.onDownload)}><DownloadOutlined target="_blank" href={process.env.PUBLIC_URL + "/1.png"} download style={{ fontSize: '18px' }} />&nbsp;{L("Download")}</Menu.Item>
				<Menu.Item key="Row_delete" onClick={() => this.onAction(actionTable.onDelete)}><DeleteOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Delete")}</Menu.Item>
			</Menu>
		);
		return (
			<>
				<Table
					onRow={(record, rowIndex) => {
						return {
							onClick: (event: any) => { this.onAction(actionTable.initDataFolder, record) },
							onDoubleClick: (event: any) => { this.onAction(actionTable.onDoubleClickRow) },
							onMouseOver: (event: any) => { this.onHoverFolder(record) },
						};
					}}
					rowClassName={(record, index) => (folderRolesSelected.fo_id == record.fo_id) ? "bg-folder" : "bg-white"}
					rowKey={(record, index) => "folder_index__" + JSON.stringify(record) + index}
					size={'small'}
					locale={{ "emptyText": true }}
					columns={columnsFolder}
					dataSource={[...foldersRolesInside]}
					pagination={false}
				/>
				<Table
					onRow={(record, rowIndex) => {
						return {
							onClick: (event: any) => { this.onAction(actionTable.initDataFile, record) },
							onDoubleClick: (event: any) => { this.onAction(actionTable.onDoubleClickRow) },
							onMouseEnter: (event: any) => { this.onHoverFile(record) },
						};
					}}
					rowKey={(record, index) => "file_index__" + JSON.stringify(record) + index}
					rowClassName={(record, index) => (fileRolesSelected.fi_us_id == record.fi_us_id) ? "bg-folder" : "bg-white"}
					size={'small'}
					showHeader={false}
					locale={{ "emptyText": true }}
					columns={columnsFile}
					dataSource={[...filesRolesInside]}
					pagination={false}
				/>
			</>
		)
	}
}