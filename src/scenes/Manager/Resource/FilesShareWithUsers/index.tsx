import * as React from 'react';
import { Breadcrumb, Card, Checkbox, Col, Modal, Radio, Row, message } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { AttachmentItem, FilesOfUserRolesDto, FolderDto, FolderRolesDto, UpdateFilesOfUserWithRolesInput, UpdateFolderWithRolesInput } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import AppConsts, { RouterPath } from '@src/lib/appconst';
import HistoryHelper from '@src/lib/historyHelper';
import { actionTable } from './components/LayoutViewFolderAndFileRoles/TableFolderAndFileRoles';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import ShareFolderAndFileRoles from './components/ShareFolderAndFileRoles';
import LayoutViewFolderAndFileRoles, { ViewLayout } from './components/LayoutViewFolderAndFileRoles';
import CreateOrUpdateNameRoles from './components/CreateOrUpdateName';
import TabFileFolderRolesLog from './components/TabFileFolderRolesLog';
import { L } from '@src/lib/abpUtility';
import FileSaver from 'file-saver';
import ViewFileOfUserContent from '@src/components/ViewFile/viewFileOfUserContent';
import { TreeFolderDto } from '@src/stores/resourseStore';

export const ActionUpload = {
	File: 1,
	Folder: 2,
};
const { confirm } = Modal;

export default class FilesShareWithUsers extends AppComponentBase {
	state = {
		isLoadDone: false,
		visibleModalRename: false,
		visibleMoveLocation: false,
		visibleShareFolderAndFile: false,
		actionUpload: ActionUpload.File,
		name: "",
		desc: "",
		marker: false,
		viewLayout: ViewLayout.List,
		visibleModalDetail: false,
		visibleFile: false,
		linkFolder: undefined,
		itemAttachment: new AttachmentItem(),
		isLoadFile: false,
		urlFileView: "",
		extFileView: "",
	};
	folderRolesSelected: FolderRolesDto = new FolderRolesDto();
	fileRolesSelected: FilesOfUserRolesDto = new FilesOfUserRolesDto();
	listBreadcrumb: FolderRolesDto[] = [];
	treeFolder: TreeFolderDto = new TreeFolderDto();
	async componentDidMount() {
		await this.initDataByLink();
	}
	async componentDidUpdate(prevProps, prevState) {
		let params = new URLSearchParams(window.location.search);
		let link: string | null | undefined = params.get('link');
		if (link != prevState.linkFolder) {
			await this.initDataByLink();
		}
	}
	initDataByLink = async () => {
		this.setState({ isLoadDone: false });
		let params = new URLSearchParams(window.location.search);
		let link: string | null | undefined = params.get('link');
		if (link == null) {
			link = undefined;
		}
		await this.setState({ linkFolder: link });
		await this.getAll();
		await this.setState({ isLoadDone: true });

	}
	getAll = async () => {
		this.setState({ isLoadDone: false });
		let result = await stores.resourseRolesStore.getResoundRolesByLink(this.state.linkFolder, this.state.marker);
		if (result.fo_ro_id < 1) {
			const prefixManager = RouterPath.admin_resource;
			HistoryHelper.redirect(prefixManager + '/filesSharedWithUser');
		}
		await this.getParentBreadcrumb();
		this.setState({ isLoadDone: true });
	}
	onDelete = async () => {
		this.setState({ isLoadDone: false });
		let self = this
		confirm({
			title: L('ban_co_chac_muon_xoa') + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				if (self.state.actionUpload == ActionUpload.File) {
					await stores.resourseRolesStore.deleteFilesOfUserRoles(self.fileRolesSelected);
				}
				if (self.state.actionUpload == ActionUpload.Folder) {
					await stores.resourseRolesStore.deleteFolderRoles(self.folderRolesSelected);
				}
				await self.initDataByLink();
				self.setState({ isLoadDone: true, isLoadFile: !self.state.isLoadFile });
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {
			},
		});
	}
	getParentBreadcrumb = async () => {
		this.setState({ isLoadDone: false });
		this.listBreadcrumb = [];
		let itemRoot: FolderRolesDto = new FolderRolesDto();
		let itemFolderDto: FolderDto = new FolderDto();
		itemFolderDto.fo_name = L("Tai_nguyen_chia_se");
		itemFolderDto.fo_id = -1;

		itemRoot.fo_id = -1;
		itemRoot.itemFolder = itemFolderDto;
		let result = await stores.folderRolesStore.getParentBreadcrumb(this.state.linkFolder);
		if (result != undefined) {
			this.listBreadcrumb = result;
			this.listBreadcrumb.unshift(itemRoot);
		}
		this.setState({ isLoadDone: true });
	}
	onChangeParentBreadcrumb = async (folder: FolderRolesDto) => {
		this.setState({ isLoadDone: true });
		await this.setState({ actionUpload: ActionUpload.Folder })
		this.folderRolesSelected = await folder;
		await this.onDoubleClickRow();
		this.setState({ isLoadDone: false });
	}
	onUpdateDesc = async (desc: string) => {
		await this.setState({ desc: desc });
		if (this.state.actionUpload == ActionUpload.File) {
			let unitData = new UpdateFilesOfUserWithRolesInput();
			unitData.init(this.fileRolesSelected.itemFileOfUser);
			unitData.fi_ro_id = this.fileRolesSelected.fi_ro_id;
			unitData.fi_us_decs = this.state.desc;
			await stores.resourseRolesStore.updateFilesOfUserWithRoles(unitData);
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			let unitData = new UpdateFolderWithRolesInput();
			unitData.init(this.folderRolesSelected.itemFolder);
			unitData.fo_ro_id = this.folderRolesSelected.fo_ro_id;
			unitData.fo_decs = this.state.desc;
			await stores.resourseRolesStore.updateFolderWithRoles(unitData);
		}
		this.setState({ isLoadDone: true });
	}

	// gắn dấu sao cho file, folder
	onStarred = async () => {
		if (this.state.actionUpload == ActionUpload.File) {
			await stores.resourseRolesStore.markerFileRoles(this.fileRolesSelected);
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			await stores.resourseRolesStore.markerFolderRoles(this.folderRolesSelected);
		}
		this.setState({ isLoadDone: true });
	}

	onCreateUpdate = async (action: number) => {
		if (this.state.name != undefined && this.state.name.trim() != '') {
			if (action == ActionUpload.File) {
				await this.onUpdateFile();
			}
			if (action == ActionUpload.Folder) {
				await this.onUpdateFolder();
			}
		}
		else {
			message.warning(L('yeu_cau_nhap_ten_thu_muc'))
		}
	}
	onUpdateFolder = async () => {
		if (this.folderRolesSelected.fo_id != undefined) {
			let unitData = new UpdateFolderWithRolesInput();
			unitData.init(this.folderRolesSelected.itemFolder);
			unitData.fo_ro_id = this.folderRolesSelected.fo_ro_id;
			unitData.fo_name = this.state.name.trim();
			await stores.resourseRolesStore.updateFolderWithRoles(unitData);
		}
		this.setState({ visibleModalRename: false, name: "" });
	}
	onUpdateFile = async () => {
		let unitData = new UpdateFilesOfUserWithRolesInput();
		unitData.init(this.fileRolesSelected.itemFileOfUser);
		unitData.fi_ro_id = this.fileRolesSelected.fi_ro_id;
		unitData.fi_us_name = this.state.name.trim();
		await stores.resourseRolesStore.updateFilesOfUserWithRoles(unitData);
		this.setState({ visibleModalRename: false, name: "" });
	}

	onDoubleClickRow = async () => {
		this.setState({ isLoadDone: false });
		if (this.state.actionUpload == ActionUpload.Folder) {
			const prefixManager = RouterPath.admin_resource;
			await this.setState({ linkFolder: this.folderRolesSelected.itemFolder.fo_link });
			if (this.folderRolesSelected.fo_id < 1) {
				HistoryHelper.redirect(prefixManager + '/filesSharedWithUser');
			} else {
				HistoryHelper.redirect(prefixManager + '/filesSharedWithUser' + '?link=' + this.state.linkFolder);
			}
			await this.getAll();
		}
		if (this.state.actionUpload == ActionUpload.File) {
			let urlItem = await this.getFileOfUser(this.fileRolesSelected.itemFileOfUser);
			await this.setState({ urlFileView: urlItem, extFileView: this.fileRolesSelected.itemFileOfUser.fi_us_extension });
			await this.setState({ visibleFile: true });
		}
		this.setState({ isLoadDone: true });
	}

	onDetailModal = async (record: FolderRolesDto) => {
		this.setState({ visibleModalDetail: true });
	}

	onCreateUpdateModal = async () => {
		if (this.state.actionUpload == ActionUpload.Folder) {
			await this.setState({ name: this.folderRolesSelected.itemFolder.fo_name, });
		}
		if (this.state.actionUpload == ActionUpload.File) {
			await this.setState({ name: this.fileRolesSelected.itemFileOfUser.fi_us_name });
		}
		this.setState({ visibleModalRename: true })
	}

	onShareItem = async (item: FolderRolesDto) => {
		await this.setState({ visibleShareFolderAndFile: true });
	}
	onDownload = async (item) => {
		this.setState({ isLoadDone: false });
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
		headers.append('Origin', AppConsts.appBaseUrl + "");
		if (this.state.actionUpload == ActionUpload.File) {
			fetch(this.getFileOfUser(this.fileRolesSelected.itemFileOfUser), {
				mode: 'cors',
				credentials: 'include',
				method: 'POST',
				headers: headers,
			})
				.then(response => {
					response.blob().then((blob) => {
						blob = new Blob([blob], { type: blob.type });
						FileSaver.saveAs(blob, this.fileRolesSelected.itemFileOfUser.fi_us_name);
					});
				})
				.then(json => console.log(json))
				.catch(error => console.log('Authorization failed: ' + error.message));
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			fetch(this.getFolder(this.folderRolesSelected.itemFolder), {
				mode: 'cors',
				credentials: 'include',
				method: 'POST',
				headers: headers,
			})
				.then(response => {
					response.blob().then((blob) => {
						blob = new Blob([blob], { type: blob.type });
						FileSaver.saveAs(blob, this.folderRolesSelected.itemFolder.fo_name);
					});
				})
				.then(json => console.log(json))
				.catch(error => console.log('Authorization failed: ' + error.message));
		}
		await this.setState({ isLoadDone: true });
	}
	initDataFolder = async (item: FolderRolesDto) => {
		this.fileRolesSelected = new FilesOfUserRolesDto();
		await this.folderRolesSelected.init(item);
		await this.setState({ desc: this.folderRolesSelected.itemFolder.fo_decs, actionUpload: ActionUpload.Folder });
	}
	initDataFile = async (item: FilesOfUserRolesDto) => {
		this.folderRolesSelected = new FolderRolesDto();
		await this.fileRolesSelected.init(item);

		await this.setState({ desc: this.fileRolesSelected.itemFileOfUser.fi_us_decs, actionUpload: ActionUpload.File });
	}
	onAction = async (action: number, item?) => {
		action == actionTable.initDataFolder && this.initDataFolder(item);
		action == actionTable.initDataFile && this.initDataFile(item);
		action == actionTable.onStarred && this.onStarred();
		action == actionTable.onCreateUpdateModal && this.onCreateUpdateModal();
		action == actionTable.onDelete && this.onDelete();
		action == actionTable.onDoubleClickRow && this.onDoubleClickRow();
		action == actionTable.onDetailModal && this.onDetailModal(item);
		action == actionTable.onShareItem && this.onShareItem(item);
		action == actionTable.onDownload && this.onDownload(item);
	}
	onRefeshModal = async () => {
		this.setState({ visibleShareFolderAndFile: false })
		this.getAll();
	}
	render() {
		const { resourseRolesSelect } = stores.resourseRolesStore;
		const foldersRolesInside = resourseRolesSelect.foldersRolesInside != undefined ? resourseRolesSelect.foldersRolesInside : [];
		const filesRolesInside = resourseRolesSelect.filesRolesInside != undefined ? resourseRolesSelect.filesRolesInside : [];
		const left = this.state.visibleModalDetail ? AppConsts.cssPanel(18) : AppConsts.cssPanel(24);
		const right = this.state.visibleModalDetail ? AppConsts.cssPanel(6) : AppConsts.cssPanel(0);

		return (
			<Card>
				<Row>
					<h2>{L("DataShareWithMe")}</h2>
				</Row>
				<Row style={{ marginBottom: "10px" }}>
					<Col span={12}>
						<Row style={{ alignItems: 'center', fontSize: 'large' }}>
							<div style={{ width: '3px', height: '20px', backgroundColor: 'antiquewhite' }}></div>
							&nbsp;
							<Breadcrumb separator=">" style={{ fontSize: 'large' }}>
								{this.listBreadcrumb != undefined &&
									this.listBreadcrumb.map(item =>
										<Breadcrumb.Item key={item.fo_id} onClick={() => this.onChangeParentBreadcrumb(item)} >{item.itemFolder != undefined ? item.itemFolder.fo_name : ""}</Breadcrumb.Item>
									)}
							</Breadcrumb>
						</Row>
					</Col>
					<Col span={12} style={{ textAlign: 'end' }}>
						<Checkbox
							checked={this.state.marker}
							onChange={async (e) => {
								await this.setState({ isLoadDone: false, marker: e.target.checked });
								this.getAll();
								this.setState({ isLoadDone: true });
							}}
						>
							<span>
								{L("Starred")}
							</span>
						</Checkbox>
						<Radio.Group onChange={(e) => this.setState({ viewLayout: e.target.value })} defaultValue={ViewLayout.List}>
							<Radio.Button value={ViewLayout.List}><BarsOutlined title={L("hien_thi_theo_bang")} /></Radio.Button>
							<Radio.Button value={ViewLayout.Grid}><AppstoreOutlined title={L("hien_thi_theo_tung_muc")} /></Radio.Button>
						</Radio.Group>
					</Col>
				</Row>
				<Row>
					<Col {...left}>
						<LayoutViewFolderAndFileRoles
							isLoadFile={this.state.isLoadFile}
							viewLayout={this.state.viewLayout}
							foldersRolesInside={foldersRolesInside}
							filesRolesInside={filesRolesInside}
							folderRolesSelected={this.folderRolesSelected}
							fileRolesSelected={this.fileRolesSelected}
							onAction={this.onAction}
						/>
					</Col>
					{this.state.visibleModalDetail &&
						<Col {...right}>
							<TabFileFolderRolesLog
								desc={this.state.desc}
								fileRolesSelected={this.fileRolesSelected}
								folderRolesSelected={this.folderRolesSelected}
								onSaveDesc={(value) => this.onUpdateDesc(value)}
								onCancel={() => this.setState({ visibleModalDetail: false })}
							/>
						</Col>
					}
				</Row>
				<Modal
					width={"30vw"}
					visible={this.state.visibleModalRename}
					title={(this.folderRolesSelected.fo_id !== undefined || this.fileRolesSelected.fi_us_id !== undefined) ? L("ChangeName") : L("CreateFolder")}
					okText={L("Confirm")}
					cancelText={L("Cancel")}
					onCancel={() => this.setState({ visibleModalRename: false })}
					onOk={() => this.onCreateUpdate(this.state.actionUpload)}
					destroyOnClose={true}
				>
					<CreateOrUpdateNameRoles name={this.state.name} onChangeName={(value) => this.setState({ name: value })} />
				</Modal>
				<Modal
					width={"40vw"}
					visible={this.state.visibleShareFolderAndFile}
					closable={false}
					footer={false}
				>
					<ShareFolderAndFileRoles
						onRefeshModal={this.onRefeshModal}
						folderRolesSelected={this.folderRolesSelected}
						fileRolesSelected={this.fileRolesSelected}
						onCancel={async () => await this.setState({ visibleShareFolderAndFile: false })}
					/>
				</Modal>
				<ViewFileOfUserContent
					visible={this.state.visibleFile}
					onCancel={() => this.setState({ visibleFile: false })}
					urlView={this.state.urlFileView}
					ext={this.state.extFileView}
				/>
			</Card>
		)
	}
}