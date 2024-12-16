import * as React from 'react';
import { Avatar, Col, Dropdown, Image, Menu, Row, Table, Tooltip, } from 'antd';
import { FilesOfUserDto, FolderDto, GetCurrentLoginInformationsOutput } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, DeliveredProcedureOutlined, DownloadOutlined, EditOutlined, FileExcelOutlined, FileImageOutlined, FilePdfOutlined, FilePptOutlined, FileTextOutlined, FileWordOutlined, FileZipOutlined, FolderFilled, FullscreenOutlined, InfoCircleOutlined, LinkOutlined, MoreOutlined, StarFilled, StarOutlined, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment';
import Paragraph from 'antd/lib/typography/Paragraph';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { RouterPath } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import FileSaver from 'file-saver';
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
	foldersInside: FolderDto[];
	filesInside: FilesOfUserDto[];
	folderSelected: FolderDto;
	fileSelected: FilesOfUserDto;
	onAction: (action: number, item?) => void;
	currentLogin: GetCurrentLoginInformationsOutput;
}
export default class TableFolderAndFile extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,
		marker: undefined,
	};
	fileHover: FilesOfUserDto = new FilesOfUserDto();
	folderHover: FolderDto = new FolderDto();

	onAction = async (action: number, item?) => {
		if (this.props.onAction != undefined) {
			this.props.onAction(action, item);
		}
	}
	onHoverFile = async (file: FilesOfUserDto) => {
		this.setState({ isLoadDone: false });
		this.folderHover = await new FolderDto();
		this.fileHover = await file;
		this.setState({ marker: file.fi_us_marker, isLoadDone: true });
	}

	onHoverFolder = async (folder: FolderDto) => {
		this.setState({ isLoadDone: false });
		this.fileHover = await new FilesOfUserDto();
		this.folderHover = await folder;
		this.setState({ marker: folder.fo_is_marker, isLoadDone: true });
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {
		const { foldersInside, filesInside, fileSelected, folderSelected, currentLogin } = this.props;
		const sessionStore = stores.sessionStore;
		const prefixManager = RouterPath.admin_subscriber;
		let link = fileSelected.fi_us_id !== undefined ? this.getFileOfUser(fileSelected) : AppConsts.appBaseUrl + prefixManager + '/filesOfUser' + '?link=' + folderSelected.fo_link!;

		const columnsFolder: ColumnsType<FolderDto> = [
			{
				title: L('Name'), key: 'folder_1', width: "22%",
				ellipsis: {
					showTitle: false,
				},
				render: (value, item) => (
					<Tooltip placement="topLeft" title={item.fo_name}>
						<FolderFilled style={{ color: '#fad165', fontSize: '19px', paddingTop: '5px' }} />&nbsp;
						{item.fo_name}&nbsp;&nbsp;&nbsp;&nbsp;
						{item.fo_is_marker && <StarFilled style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }} />}
					</Tooltip>
				),
			},
			{
				title: L('Owner'), key: 'folder_2', width: '22%', render: (text: string, item: FolderDto, index: number) => <div>
					<Avatar style={{ cursor: "pointer", backgroundColor: AppConsts.backGroundColorByName[currentLogin.user.name!.charAt(0)] }} className='rounded-image' shape='circle'>
						{(!!currentLogin.user.us_avatar && currentLogin.user.us_avatar > 0) ?
							<Image width={35} height={35} src={this.getFile(currentLogin.user!.us_avatar!)} style={{ width: 32 }} />
							: currentLogin.user.name?.charAt(0)}
					</Avatar>&nbsp;&nbsp;{sessionStore.getUserLogin().name}</div>
			},
			{ title: L('LastUpdate'), key: 'folder_3', width: '22%', render: (text: string, item: FolderDto, index: number) => <div>{moment(item.fo_last_updated_at).format("DD/MM/YYYY")}</div> },
			{ title: L('Size'), key: 'folder_4', width: '12%', render: (text: string, item: FolderDto, index: number) => <div>{"-"}</div> },
			{
				title: L(''), key: 'folder_5', width: '22%', render: (text: string, item: FolderDto, index: number) =>
					<Row style={{ alignItems: 'center' }}>
						<Col span={18}>
							{this.folderHover.fo_id == item.fo_id &&
								<Row justify='space-around'>
									<UserAddOutlined title={L("Share")} onClick={async () => { await this.onAction(actionTable.initDataFolder, item); await this.onAction(actionTable.onShareItem) }} />
									<DownloadOutlined title={L("Download")} onClick={async () => { await this.onAction(actionTable.initDataFolder, item); await this.onAction(actionTable.onDownload, item) }} />
									<EditOutlined title={L("ChangeName")} onClick={async () => { await this.onAction(actionTable.initDataFolder, item); await this.onAction(actionTable.onCreateUpdateModal) }} />
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
								<MoreOutlined style={{ fontSize: '18px' }} />
							</Dropdown>
						</Col>
					</Row>
			},
		];
		const columnsFile: ColumnsType<FilesOfUserDto> = [
			{
				title: L('Name'), key: 'file_1', width: "22%",
				ellipsis: {
					showTitle: false,
				},
				render: (value, item) => (
					<Tooltip placement="topLeft" title={item.fi_us_name}>
						{MineTypeConst.checkIconExtension(item.fi_us_extension!)}&nbsp;
						{item.fi_us_name}&nbsp;&nbsp;&nbsp;&nbsp;
						{item.fi_us_marker && <StarFilled style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }} />}
					</Tooltip>
				),

			},
			{
				title: L('Owner'), key: 'file_2', width: '22%', render: (text: string, item: FilesOfUserDto, index: number) => <div>
					{/* <Avatar src={<Image rounded-image="rounded-image" height={30} width={30} src={currentLogin.user.us_avatar != undefined ? this.getFile(currentLogin.user!.us_avatar!) : ""} />} />&nbsp;&nbsp;{sessionStore.getUserLogin().name} */}
					<Avatar style={{ cursor: "pointer", backgroundColor: AppConsts.backGroundColorByName[currentLogin.user.name!.charAt(0)] }} className='rounded-image' shape='circle'>
						{(!!currentLogin.user.us_avatar && currentLogin.user.us_avatar > 0) ?
							<Image width={35} height={35} src={this.getFile(currentLogin.user!.us_avatar!)} style={{ width: 32 }} />
							: currentLogin.user.name?.charAt(0)}
					</Avatar>&nbsp;&nbsp;{sessionStore.getUserLogin().name}
				</div>
			},
			{
				title: L('LastUpdate'), key: 'file_3', width: '22%',
				render: (text: string, item: FilesOfUserDto, index: number) => <div>{moment(item.fi_us_updated_at).format("DD/MM/YYYY")}</div>
			},
			{
				title: L('Size'), key: 'file_4', width: '12%',
				render: (text: string, item: FilesOfUserDto, index: number) =>
					<div>
						{item.fi_us_size != undefined && AppConsts.convertResourceFile(Math.round(item.fi_us_size / 1024 * 10) / 10)}
					</div>
			},
			{
				title: L(''), key: 'file_5', width: '22%', render: (text: string, item: FilesOfUserDto, index: number) =>
					<Row style={{ alignItems: 'center' }}>
						<Col span={18}>
							{this.fileHover.fi_us_id == item.fi_us_id &&
								<Row style={{ justifyContent: 'space-around' }}>
									<UserAddOutlined title={L("Share")} onClick={async () => { await this.onAction(actionTable.initDataFile, item); await this.onAction(actionTable.onShareItem) }} />
									<DownloadOutlined title={L("Download")} onClick={async () => { await this.onAction(actionTable.initDataFile, item); this.onAction(actionTable.onDownload, item) }} />
									<EditOutlined title={L("ChangeName")} onClick={async () => { await this.onAction(actionTable.initDataFile, item); await this.onAction(actionTable.onCreateUpdateModal) }} />
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
								<MoreOutlined style={{ fontSize: '18px' }} />
							</Dropdown>
						</Col>
					</Row>
			},
		];
		const menuClickRow = (
			<Menu>
				<Menu.Item key="Row_open" onClick={() => this.onAction(actionTable.onDoubleClickRow)}><FullscreenOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Open")}</Menu.Item>
				<Menu.Item key="Row_share" onClick={() => this.onAction(actionTable.onShareItem)}><UserAddOutlined style={{ fontSize: '18px' }} />&nbsp;{L("Share")}</Menu.Item>
				<Menu.Item key="Row_move" onClick={() => this.onAction(actionTable.onMoveLocation)}><DeliveredProcedureOutlined style={{ fontSize: '18px' }} />&nbsp;{L("MoveTo")}</Menu.Item>
				<Menu.Item key="Row_star" onClick={() => this.onAction(actionTable.onStarred)}>{this.state.marker ? <><StarFilled style={{ fontSize: '18px' }} />&nbsp;{L("RemoveStar")}</> : <><StarOutlined style={{ fontSize: '18px' }} /> {L("Starred")}</>} </Menu.Item>
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
				{/* download folder doing (file cứng)*/}
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
							onMouseEnter: (event: any) => { this.onHoverFolder(record) },
						};
					}}
					rowClassName={(record, index) => (folderSelected.fo_id == record.fo_id) ? "bg-folder" : "bg-white"}
					rowKey={(record, index) => "folder_index__" + JSON.stringify(record) + index}
					size={'small'}
					locale={{ "emptyText": true }}
					columns={columnsFolder}
					dataSource={[...foldersInside]}
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
					rowClassName={(record, index) => (fileSelected.fi_us_id == record.fi_us_id) ? "bg-folder" : "bg-white"}
					size={'small'}
					showHeader={false}
					locale={{ "emptyText": true }}
					columns={columnsFile}
					dataSource={[...filesInside]}
					pagination={false}
				/>

			</>
		)
	}
}