import * as React from 'react';
import { Button, Card, Col, Dropdown, Menu, Modal, Radio, Row, Upload, message, Breadcrumb, TreeSelect, Checkbox, Input } from 'antd';
import { AppstoreOutlined, BarsOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ChangeParentFileOfUserInput, ChangeParentFolderInput, ChangeTypeFileOfUserInput, ChangeTypeFolderInput, CreateFolderInput, FileParameter, FilesOfUserDto, FolderDto, TypeFileFolder, UpdateFilesOfUserInput, UpdateFolderInput } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import CreateOrUpdateName from './components/CreateOrUpdateName';
import Icon from '@ant-design/icons/lib/components/Icon';
import AppConsts, { RouterPath, cssColResponsiveSpan } from '@src/lib/appconst';
import HistoryHelper from '@src/lib/historyHelper';
import { actionTable } from './components/LayoutViewFolderAndFile/TableFolderAndFile';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import MoveItemFromFolder from './components/MoveItemFromFolder';
import ShareFolderAndFile from './components/ShareFolderAndFile';
import LayoutViewFolderAndFile, { ViewLayout } from './components/LayoutViewFolderAndFile';
import TabFileFolderLog from './components/TabFileFolderLog';
import { L } from '@src/lib/abpUtility';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eTypeFileFolder } from '@src/lib/enumconst';
import moment, { Moment } from 'moment';
import SelectedLastUpdated from '@src/components/Manager/SelectedLastUpdated';
import { TreeFolderDto } from '@src/stores/resourseStore';
import FileSaver from 'file-saver';
import ViewFileOfUserContent from '@src/components/ViewFile/viewFileOfUserContent';

const { confirm } = Modal;
const { currentLogin } = stores.sessionStore;
export const ActionUpload = {
	File: 1,
	Folder: 2,
};
export default class FilesOfUser extends AppComponentBase {
	private fileInput: any = React.createRef();

	state = {
		isLoadDone: false,
		visibleModalRename: false,
		visibleMoveLocation: false,
		visibleShareFolderAndFile: false,
		visibleModalDetail: false,
		actionUpload: ActionUpload.File,
		visibleFile: false,
		name: "",
		desc: "",
		name_search: undefined,
		marker: false,
		viewLayout: ViewLayout.List,
		type_file: undefined,
		link: undefined,
		last_updated: undefined,
		start_updated: undefined,
		linkFolder: undefined,
		isLoadFile: false,
		urlFileView: "",
		extFileView: "",
		isLoadChange: false,
		us_id_owner: undefined,
		last_updated_at_from: undefined,
		last_updated_at_to: undefined,
		optionFilter: undefined,

	};
	folderSelected: FolderDto = new FolderDto();
	fileSelected: FilesOfUserDto = new FilesOfUserDto();
	parentFolderId: number = -1;
	foldersInside: FolderDto[] = [];
	filesInside: FilesOfUserDto[] = [];
	listBreadcrumb: FolderDto[] = [];
	treeFolder: TreeFolderDto = new TreeFolderDto();
	type: TypeFileFolder;
	async componentDidMount() {
		this.setState({ isLoadDone: true });
		await this.initDataByLink();
		await stores.sessionStore.getCurrentLoginInformations();
		this.setState({ currentId: currentLogin.user!.id });
		await this.setState({ isLoadDone: false });
	}

	async componentDidUpdate(prevProps, prevState) {
		let params = new URLSearchParams(window.location.search);
		let link: string | null | undefined = params.get('link');
		if (link != prevState.linkFolder) {
			await this.initDataByLink();
		}
	}

	getParentBreadcrumb = async () => {
		this.setState({ isLoadDone: false });
		this.listBreadcrumb = [];
		let itemRoot: FolderDto = new FolderDto();
		itemRoot.fo_id = -1;
		itemRoot.fo_name = L("Tai_nguyen");
		let result = await stores.resourseStore.getParentBreadcrumb(this.state.linkFolder);
		if (result != undefined) {
			this.listBreadcrumb = result;
			this.listBreadcrumb.unshift(itemRoot);
		}
		this.setState({ isLoadDone: true });
	}
	onChangeParentBreadcrumb = async (folder: FolderDto) => {
		this.setState({ isLoadDone: true });
		await this.setState({ actionUpload: ActionUpload.Folder })
		this.folderSelected = await folder;
		await this.onDoubleClickRow();
		this.setState({ isLoadDone: false });
	}
	getAllByLink = async () => {
		this.setState({ isLoadDone: false });
		let result = await stores.resourseStore.getResoundByLink(this.state.linkFolder);
		if (result.fo_id < 1) {
			const prefixManager = RouterPath.admin_resource;
			HistoryHelper.redirect(prefixManager + '/filesOfUser');
		}
		await this.getParentBreadcrumb();
		await this.initDataWithStore();
		this.setState({ isLoadDone: true });
	}
	getAll = async () => {
		this.setState({ isLoadDone: false });
		await stores.resourseStore.getAll(this.state.name_search, this.state.type_file, this.state.marker, this.state.us_id_owner, this.state.link, this.state.last_updated_at_from, this.state.last_updated_at_to);
		await stores.sessionStore.getCurrentLoginInformations();
		await stores.settingStore.getAll();
		this.setState({ isLoadDone: true });
	}

	initDataByLink = async () => {
		this.setState({ isLoadDone: false });
		let params = new URLSearchParams(window.location.search);
		let link: string | null | undefined = params.get('link');
		if (link == null) {
			link = undefined;
		}
		await this.setState({ linkFolder: link });
		await this.getAllByLink();
		const { treeFolderDto } = stores.resourseStore;
		this.treeFolder = treeFolderDto;
		await this.initDataWithStore();
		await this.setState({ isLoadDone: true });
	}
	initDataWithStore = () => {
		const { resourseSelect, treeFolderDto } = stores.resourseStore;
		this.treeFolder = treeFolderDto;
		this.foldersInside = resourseSelect.foldersInside != undefined ? resourseSelect.foldersInside : [];
		this.filesInside = resourseSelect.filesInside != undefined ? resourseSelect.filesInside : [];
	}

	searchData = async () => {
		this.setState({ isLoadDone: false });
		await this.getAll();
		await this.initDataWithStore();
		await this.setState({ isLoadDone: true });
	}
	selectGetAll = async () => {
		if (this.state.name_search == undefined && this.state.type_file == undefined &&
			this.state.marker != true && this.state.link == undefined && this.state.start_updated == undefined) {
			await this.getAllByLink();
		} else {
			await this.searchData();
		}
	}

	//create file or folder
	handleChange = async (info) => {
		const { hostSetting } = stores.settingStore;
		if (info.file.status === 'done') {
			let item = info.file;
			const { resourseSelect } = stores.resourseStore;
			if (item != undefined) {
				this.setState({ isLoadDone: false });
				let file = { "data": item.originFileObj, "fileName": item.name };
				let fileToUpload: FileParameter = file;
				let fo_id = resourseSelect.fo_id;
				if (item.originFileObj.size >= hostSetting.general.maxUploadedData) {
					message.error(L('khong_the_up_file_tren') + hostSetting.general.maxUploadedData / 1024 / 1024 + "mb")
					return;
				}
				if (fo_id == undefined) {
					fo_id = -1;
				}
				await stores.resourseStore.createFilesOfUser(fo_id, fileToUpload);
				await this.initDataWithStore();
				this.setState({ isLoadDone: true });
				message.success(L("CreateSuccessfully"))
			}
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name}` + L("FileUploadFailed") + ".");
		}
	}
	//focus upload
	onFocusInput = async (action: number) => {
		await this.setState({ actionUpload: action });
		this.fileInput.click();
	}
	// delete file or folder

	onDelete = async () => {
		this.setState({ isLoadDone: false });
		let self = this
		confirm({
			title: L('ban_co_chac_muon_xoa') + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				if (self.state.actionUpload == ActionUpload.File) {
					await stores.resourseStore.deleteFilesOfUser(self.fileSelected);
				}
				if (self.state.actionUpload == ActionUpload.Folder) {
					await stores.resourseStore.deleteFolder(self.folderSelected);
				}
				await self.getAllByLink();
				self.setState({ isLoadDone: true, isLoadFile: !self.state.isLoadFile });
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {
			},
		});
	}

	onUpdateDesc = async (desc: string) => {
		await this.setState({ desc: desc });
		if (this.state.actionUpload == ActionUpload.File) {
			let unitData = new UpdateFilesOfUserInput();
			unitData.init(this.fileSelected);
			unitData.fi_us_decs = this.state.desc;
			await stores.resourseStore.updateFilesOfUser(unitData);
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			let unitData = new UpdateFolderInput();
			unitData.init(this.folderSelected);
			unitData.fo_decs = this.state.desc;
			await stores.resourseStore.updateFolder(unitData);
		}
		await this.initDataWithStore();
		message.success(L("thao_tac_thanh_cong"))
		this.setState({ isLoadDone: true });
	}

	// gắn dấu sao cho file, folder
	onStarred = async () => {

		this.setState({ isLoadDone: false });
		if (this.state.actionUpload == ActionUpload.File) {
			await stores.resourseStore.markerFile(this.fileSelected);
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			await stores.resourseStore.markerFolder(this.folderSelected);
		}
		await this.initDataWithStore();
		message.success(L("thao_tac_thanh_cong"))
		await this.setState({ isLoadDone: true });
	}

	// thay đổi kiểu cho file, folder
	onChangeTypeFileOrFolder = async (value: number) => {
		if (this.state.actionUpload == ActionUpload.File) {
			let inputData = new ChangeTypeFileOfUserInput();
			inputData.fi_us_id = this.fileSelected.fi_us_id;
			inputData.fi_ro_type = value;
			await stores.resourseStore.changeTypeFileOfUser(inputData);
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			let inputData = new ChangeTypeFolderInput();
			inputData.fo_id = this.folderSelected.fo_id;
			inputData.fo_ro_type = value;
			await stores.resourseStore.changeTypeFolder(inputData);
		}
		await this.initDataWithStore();
		message.success(L("thao_tac_thanh_cong"))
		this.setState({ isLoadDone: true });
	}

	onCreateUpdate = async (action: number) => {
		if (action == ActionUpload.File) {
			await this.onUpdateFile();
		}
		if (action == ActionUpload.Folder) {
			await this.onCreateUpdateFolder();
		}
	}
	onCreateUpdateFolder = async () => {
		if (this.state.name != undefined && this.state.name.trim() != '') {
			if (this.folderSelected.fo_id != undefined) {
				let unitData = new UpdateFolderInput();
				unitData.init(this.folderSelected);
				unitData.fo_name = this.state.name.trim();
				await stores.resourseStore.updateFolder(unitData);
			} else {
				let unitData = new CreateFolderInput();
				unitData.init(this.folderSelected);
				unitData.fo_name = this.state.name.trim();
				unitData.fo_id_parent = stores.resourseStore.resourseSelect.fo_id;
				await stores.resourseStore.createFolder(unitData);
			}
			await this.initDataWithStore();
			this.setState({ visibleModalRename: false, name: "" })
			message.success(L("thao_tac_thanh_cong"))
		}
		else {
			message.warning(L('yeu_cau_nhap_ten_thu_muc'))
		}
	}
	onUpdateFile = async () => {
		if (this.state.name != undefined && this.state.name.trim() !== '') {
			let unitData = new UpdateFilesOfUserInput();
			unitData.init(this.fileSelected);
			unitData.fi_us_name = this.state.name.trim();
			await stores.resourseStore.updateFilesOfUser(unitData);
			await this.initDataWithStore();
			this.setState({ visibleModalRename: false, name: "" });
			message.success(L("thao_tac_thanh_cong"))
		}
		else {
			message.warning(L('yeu_cau_nhap_ten_tai_lieu'))
		}
	}
	onDoubleClickRow = async () => {
		this.setState({ isLoadDone: false });
		if (this.state.actionUpload == ActionUpload.Folder) {
			const prefixManager = RouterPath.admin_resource;
			await this.setState({ linkFolder: this.folderSelected.fo_link });
			if (this.folderSelected.fo_id < 1) {
				HistoryHelper.redirect(prefixManager + '/filesOfUser');
			} else {
				HistoryHelper.redirect(prefixManager + '/filesOfUser' + '?link=' + this.state.linkFolder);
			}
			await this.initDataByLink();
		}
		if (this.state.actionUpload == ActionUpload.File) {
			let urlItem = await this.getFileOfUser(this.fileSelected);
			await this.setState({ urlFileView: urlItem, extFileView: this.fileSelected.fi_us_extension });
			await this.setState({ visibleFile: true });
		}
		this.setState({ isLoadDone: true });
	}

	onDetailModal = async (record: FolderDto) => {
		this.setState({ visibleModalDetail: true });
	}

	onCreateUpdateModal = async () => {
		if (this.state.actionUpload == ActionUpload.Folder) {
			await this.setState({ name: this.folderSelected.fo_name, });
		}
		if (this.state.actionUpload == ActionUpload.File) {
			await this.setState({ name: this.fileSelected.fi_us_name });
		}
		this.setState({ visibleModalRename: true })
	}

	onMoveLocation = async (item: FolderDto) => {
		await this.fileSelected.init(item);
		await this.setState({ visibleMoveLocation: true })
	}
	onShareItem = async (item: FolderDto) => {
		this.setState({ visibleShareFolderAndFile: false });
		await this.fileSelected.init(item);
		await this.setState({ visibleShareFolderAndFile: true });
	}

	onUpdateParent = async (parentFolderId: number) => {
		this.setState({ isLoadDone: false });
		if (this.state.actionUpload == ActionUpload.File) {
			let unitData = new ChangeParentFileOfUserInput();
			unitData.fi_us_id = this.fileSelected.fi_us_id;
			unitData.fo_id = parentFolderId;
			await stores.resourseStore.changeParentFileOfUser(unitData);
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			let unitData = new ChangeParentFolderInput();
			unitData.fo_id = this.folderSelected.fo_id;
			unitData.fo_id_parent = parentFolderId;
			await stores.resourseStore.changeParentFolder(unitData);
		}
		await this.getAllByLink();
		message.success(L("thao_tac_thanh_cong"));
		this.setState({ isLoadDone: true, visibleMoveLocation: false });
	}
	onDownload = async (item) => {
		this.setState({ isLoadDone: false });
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Accept', 'application/json');
		headers.append('Origin', AppConsts.appBaseUrl + "");
		if (this.state.actionUpload == ActionUpload.File) {
			fetch(this.getFileOfUser(this.fileSelected), {
				mode: 'cors',
				credentials: 'include',
				method: 'POST',
				headers: headers,
			})
				.then(response => {
					response.blob().then((blob) => {
						blob = new Blob([blob], { type: blob.type });
						FileSaver.saveAs(blob, this.fileSelected.fi_us_name);
					});
				})
				.then(json => console.log(json))
				.catch(error => console.log('Authorization failed: ' + error.message));
		}
		if (this.state.actionUpload == ActionUpload.Folder) {
			fetch(this.getFolder(this.folderSelected), {
				mode: 'cors',
				credentials: 'include',
				method: 'POST',
				headers: headers,
			})
				.then(response => {
					response.blob().then((blob) => {
						blob = new Blob([blob], { type: blob.type });
						FileSaver.saveAs(blob, this.folderSelected.fo_name);
					});
				})
				.then(json => console.log(json))
				.catch(error => console.log('Authorization failed: ' + error.message));
		}
		message.success(L("thao_tac_thanh_cong"))
		await this.setState({ isLoadDone: true });
	}
	initDataFolder = async (item: FolderDto) => {
		this.setState({ isLoadDone: false })
		this.fileSelected = new FilesOfUserDto();
		await this.folderSelected.init(item);
		await this.setState({ desc: this.folderSelected.fo_decs, actionUpload: ActionUpload.Folder, isLoadDone: false, isLoadChange: !this.state.isLoadChange });
	}
	initDataFile = async (item: FilesOfUserDto) => {
		this.setState({ isLoadDone: false })
		this.folderSelected = new FolderDto();
		await this.fileSelected.init(item);
		await this.setState({ desc: this.fileSelected.fi_us_decs, actionUpload: ActionUpload.File, isLoadDone: false, isLoadChange: !this.state.isLoadChange });
	}
	onAction = async (action: number, item?) => {
		action == actionTable.initDataFolder && this.initDataFolder(item);
		action == actionTable.initDataFile && this.initDataFile(item);
		action == actionTable.onStarred && this.onStarred();
		action == actionTable.onCreateUpdateModal && this.onCreateUpdateModal();
		action == actionTable.onDelete && this.onDelete();
		action == actionTable.onDoubleClickRow && this.onDoubleClickRow();
		action == actionTable.onDetailModal && this.onDetailModal(item);
		action == actionTable.onMoveLocation && this.onMoveLocation(item);
		action == actionTable.onShareItem && this.onShareItem(item);
		action == actionTable.onChangeTypeFileOrFolder && this.onChangeTypeFileOrFolder(item);
		action == actionTable.onDownload && this.onDownload(item);
	}

	onChangeDate = async (start_updated: Moment | undefined, last_updated: Moment | undefined, optionFilter: number | undefined) => {
		this.setState({ isLoadDone: true });
		await this.setState({ last_updated: last_updated, start_updated: start_updated, optionFilter: optionFilter });
		await this.selectGetAll();
		this.setState({ isLoadDone: false });
	}

	onChangeType = async (value: number) => {
		await this.setState({ type_file: value });
		await this.selectGetAll();
	}
	clearSearch = async () => {
		await this.setState({
			name_search: undefined,
			type_file: undefined,
			start_updated: undefined,
			last_updated: undefined,
			link: undefined,
			marker: false,
			optionFilter: undefined,
		});
		await this.selectGetAll();
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {

		const menu = (
			<Menu>
				<Menu.Item key="1" onClick={async () => { await this.initDataFolder(new FolderDto); await this.onCreateUpdateModal() }}>{L("NewFolder")}</Menu.Item>
				<Menu.Item key="2" onClick={() => this.onFocusInput(ActionUpload.File)}>{L("UploadFiles")}</Menu.Item>
			</Menu>
		);
		const props = {
			action: AppConsts.remoteServiceBaseUrl,
			onChange: this.handleChange,
			multiple: true,
			defaultFileList: [],
			showUploadList: false,
			directory: this.state.actionUpload == ActionUpload.Folder,
		};
		const self = this;
		const left = this.state.visibleModalDetail ? cssColResponsiveSpan(24, 24, 18, 18, 18, 18) : AppConsts.cssPanel(24);
		const right = this.state.visibleModalDetail ? cssColResponsiveSpan(24, 24, 6, 6, 6, 6) : AppConsts.cssPanel(0);

		return (
			<Card>
				<Row gutter={[8, 8]} align='bottom'>
					<h2>{L("MyData")}</h2>
				</Row>
				<Row align='middle'>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)}>
						<Dropdown overlay={menu} trigger={['click']}>
							<Button type='primary' style={{ borderRadius: '5px', border: 'none', backgroundColor: '#edf2fc', color: 'black', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }} size='large' icon={<PlusOutlined />} onClick={e => e.preventDefault()}>{L("New")}</Button>
						</Dropdown>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 17, 17, 17, 17)}>
						<Row style={{ alignItems: 'center', fontSize: 'large' }}>
							<div style={{ width: '3px', height: '20px', backgroundColor: 'antiquewhite' }}></div>
							&nbsp;
							<Breadcrumb separator=">" style={{ fontSize: 'large' }}>
								{this.listBreadcrumb.map(item =>
									<Breadcrumb.Item key={item.fo_id} onClick={() => this.onChangeParentBreadcrumb(item)} >{item.fo_name}</Breadcrumb.Item>
								)}
							</Breadcrumb>
						</Row>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 3, 3, 3, 3)} style={{ textAlign: 'end' }}>
						<Radio.Group onChange={(e) => this.setState({ viewLayout: e.target.value })} defaultValue={ViewLayout.List}>
							<Radio.Button value={ViewLayout.List}><BarsOutlined title={L("hien_thi_theo_bang")} /></Radio.Button>
							<Radio.Button value={ViewLayout.Grid}><AppstoreOutlined title={L("hien_thi_theo_tung_muc")} /></Radio.Button>
						</Radio.Group>
					</Col>
				</Row>
				<Row gutter={[8, 8]} align='middle' style={{ marginTop: '10px' }}>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)}>
						<Input
							allowClear
							placeholder={L("nhap_tim_kiem")}
							onChange={async (e) => { await this.setState({ name_search: e.target.value }); this.selectGetAll(); }}
							value={this.state.name_search}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)}>
						<SelectEnum placeholder={L('loai')} eNum={eTypeFileFolder} enum_value={this.state.type_file} onChangeEnum={async (value: number) => { this.onChangeType(value);console.log("aaaaaa",value);
						 }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)}>
						<SelectedLastUpdated optionFilter={this.state.optionFilter} placeholder={L('lan_sua_doi_gan_nhat')} last_updated={this.state.last_updated} start_updated={this.state.start_updated} onChangeDateSelect={async (start_updated, last_updated, optionFilter) => await this.onChangeDate(start_updated, last_updated, optionFilter)} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)}>
						<TreeSelect
							placeholder={L("dia_diem")}
							allowClear
							value={this.state.link}
							style={{ width: '100%' }}
							dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
							treeData={self.treeFolder.children}
							treeDefaultExpandAll
							onChange={(value, label) => {
								if (value == undefined || value == self.treeFolder.value) {
									this.initDataByLink();
									this.setState({ link: undefined });
								}
							}}
							onSelect={async (value, node) => { await self.setState({ link: node.link }); await this.selectGetAll(); }}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)}>
						{(this.state.name_search != undefined || this.state.type_file != undefined || this.state.start_updated != undefined || this.state.last_updated != undefined || this.state.link != undefined || this.state.marker != false || this.state.optionFilter != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)} >
						<Checkbox
							checked={this.state.marker}
							onChange={async (e) => {
								await this.setState({ isLoadDone: false, marker: e.target.checked });
								await this.selectGetAll();
							}}
						>
							<span>
								{L("Starred")}
							</span>
						</Checkbox>
					</Col>
				</Row>
				<Upload {...props} >
					<Button style={{ display: 'none' }} >
						<Icon type="upload" ref={fileInput => this.fileInput = fileInput} />
					</Button>
				</Upload>
				<Row gutter={16}>
					<Col {...left}>
						<LayoutViewFolderAndFile
							currentLogin={currentLogin}
							viewLayout={this.state.viewLayout}
							foldersInside={self.foldersInside}
							filesInside={self.filesInside}
							folderSelected={this.folderSelected}
							fileSelected={this.fileSelected}
							onAction={this.onAction}
							isLoadFile={this.state.isLoadFile}
						/>
					</Col>
					{this.state.visibleModalDetail &&
						<Col {...right}>
							<TabFileFolderLog
								isLoadChange={this.state.isLoadChange}
								desc={this.state.desc}
								fileSelected={this.fileSelected}
								folderSelected={this.folderSelected}
								onSaveDesc={(value) => this.onUpdateDesc(value)}
								onCancel={() => this.setState({ visibleModalDetail: false })}
							/>
						</Col>
					}
				</Row>
				<Modal
					width={"30vw"}
					visible={this.state.visibleModalRename}
					title={(this.folderSelected.fo_id != undefined || this.fileSelected.fi_us_id != undefined) ? L("ChangeName") : L("NewFolder")}
					okText={L("Confirm")}
					cancelText={L("Cancel")}
					onCancel={() => this.setState({ visibleModalRename: false })}
					onOk={() => this.onCreateUpdate(this.state.actionUpload)}
					destroyOnClose={true}
					closable={false}
					maskClosable={false}
				>
					<CreateOrUpdateName name={this.state.name} onChangeName={(value) => this.setState({ name: value })}
						onChangeNameFile={(value) => {
							this.setState({ name: value });
							this.onCreateUpdate(this.state.actionUpload)
						}}
					/>
				</Modal>
				<Modal
					width={"53vw"}
					visible={this.state.visibleMoveLocation}
					okText={L("Move")}
					cancelText={L("Cancel")}
					onCancel={() => this.setState({ visibleMoveLocation: false })}
					onOk={() => this.onUpdateParent(this.parentFolderId)}
					closable={false}
				>
					<MoveItemFromFolder
						folderSelected={this.folderSelected}
						fileSelected={this.fileSelected}
						onUpdateParent={(output: number) => this.parentFolderId = output}
					/>
				</Modal>
				<Modal
					width={"53vw"}
					visible={this.state.visibleShareFolderAndFile}
					closable={false}
					footer={false}
				>
					<ShareFolderAndFile
						folderSelected={this.folderSelected}
						fileSelected={this.fileSelected}
						onCancel={async () => await this.setState({ visibleShareFolderAndFile: false })}
					/>
				</Modal>

				<ViewFileOfUserContent
					visible={this.state.visibleFile}
					onCancel={() => this.setState({ visibleFile: false })}
					urlView={this.state.urlFileView!}
					ext={this.state.extFileView}
				/>
			</Card>
		)
	}
}