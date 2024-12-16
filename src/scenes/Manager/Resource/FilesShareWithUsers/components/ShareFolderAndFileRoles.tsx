import * as React from 'react';
import { Card, Row, Col, Button, Typography, List, Avatar, message, Modal } from 'antd';
import { ChangeTypeFileOfUserInput, ChangeTypeFolderInput, CreateFilesOfUserRolesInput, CreateFolderRolesInput, FilesOfUserRolesDto, FolderDto, FolderRolesDto, ItemUser, UpdateFilesOfUserRolesInput, UpdateFolderRolesInput, UserDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import SelectUser from '@src/components/Manager/SelectUser';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eResourceRoleStatus, eResourceRoleType } from '@src/lib/enumconst';
import AppConsts, { RouterPath, cssCol } from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { BackwardOutlined, CloseOutlined, GlobalOutlined, LinkOutlined, LockOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import SelectEnumRoles from '@src/components/Manager/SelectEnumRoles';
import SelectUserFolder from '../../FilesOfUser/components/SelectUserFolder';

const { Paragraph } = Typography;
const { confirm } = Modal;
export interface Iprops {
	folderRolesSelected: FolderRolesDto;
	fileRolesSelected: FilesOfUserRolesDto;
	onCancel: () => void;
	onRefeshModal: () => void;
}
export default class ShareFolderAndFileRoles extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,
		visibleModal: false,
		roleStatus: eResourceRoleStatus.VIEW.num,
		roleType: undefined,
	};
	listUserSelect: ItemUser[] = [];
	listDataFolder: FolderRolesDto[] = [];
	listDataFile: FilesOfUserRolesDto[] = [];
	isFile: boolean = this.props.fileRolesSelected.fi_us_id != undefined;

	async componentDidMount() {
		if (this.isFile) {
			this.listDataFile = await stores.resourseRolesStore.getAllUserRolesByIdFile(this.props.fileRolesSelected.fi_us_id);
		} else {
			this.listDataFolder = await stores.resourseRolesStore.getAllUserRolesByIdFolder(this.props.folderRolesSelected.fo_id);
		}
		await this.initData();
	}

	initData = async () => {
		let type: number = eResourceRoleType.PRIVATE.num;
		let id: number = -1;
		if (this.isFile) {
			type = this.props.fileRolesSelected.itemFileOfUser.fi_ro_type;
			id = this.props.fileRolesSelected.fi_us_id;
		} else {
			type = this.props.folderRolesSelected.itemFolder.fo_ro_type;
			id = this.props.fileRolesSelected.fi_ro_id;
		}
		await stores.folderRolesStore.getAll(undefined, id, undefined, undefined, undefined, undefined);
		this.setState({ roleType: type });

	}
	onCancel = async () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}

	//Chua test lai
	onChangeUser = (value) => {
		this.setState({ visibleModal: value.length > 0 });
		this.listUserSelect = value;

	}

	onCreateRoleFileOrFolder = async () => {
		if (this.props.fileRolesSelected.fi_us_id != undefined) {
			let itemData = new CreateFilesOfUserRolesInput();
			itemData.us_id = this.listUserSelect.map(item => item.id);
			itemData.fi_us_id = this.props.fileRolesSelected.fi_us_id;
			itemData.fi_ro_role = this.state.roleStatus;
			await stores.filesOfUserRolesStore.createFilesOfUserRoles(itemData);
		} else {
			let itemData = new CreateFolderRolesInput();
			itemData.us_id = this.listUserSelect.map(item => item.id);
			itemData.fo_id = this.props.folderRolesSelected.fo_id;
			itemData.fo_ro_role = this.state.roleStatus;
			await stores.folderRolesStore.createListFolderRoles(itemData);
		}
		this.onCancel();

	}
	// thay đổi kiểu cho file, folder
	onChangeTypeFileOrFolder = async (value: number) => {
		this.setState({ roleType: value });
		if (this.props.fileRolesSelected.fi_us_id != undefined) {
			let inputData = new ChangeTypeFileOfUserInput();
			inputData.fi_us_id = this.props.fileRolesSelected.fi_us_id;
			inputData.fi_ro_type = value;
			await stores.resourseStore.changeTypeFileOfUser(inputData);
		} else {
			let inputData = new ChangeTypeFolderInput();
			inputData.fo_id = this.props.folderRolesSelected.fo_id;
			inputData.fo_ro_type = value;
			await stores.resourseStore.changeTypeFolder(inputData);
		}
	}

	OnUpdateRoleFileOrFolder = async (item, value: number) => {
		if (this.props.fileRolesSelected.fi_us_id != undefined) {
			if (stores.sessionStore.getUserLogin().id == item.us_id) {
				if (value == eResourceRoleStatus.VIEW.num) {
					let self = this;
					confirm({
						title: L("hanh_dong_se_thay_doi_quyen_cua_ban_ban_ban_se_khong_the_chia_se"),
						okText: L('Confirm'),
						cancelText: L('Cancel'),
						async onOk() {
							self.setState({ isLoadDone: false });
							let inputData = new UpdateFilesOfUserRolesInput({ ...item });
							inputData.fi_us_id = item.fi_us_id;
							inputData.fi_ro_role = value;
							item.fi_ro_role = value;
							await stores.filesOfUserRolesStore.updateFilesOfUserRoles(inputData);
							self.props.onRefeshModal();
							self.setState({ isLoadDone: true });
							message.success(L("thao_tac_thanh_cong"));
						},
						onCancel() {
							self.setState({ isLoadDone: true });
						},
					});
				}
			}
			else {
				let inputData = new UpdateFilesOfUserRolesInput({ ...item });
				inputData.fi_us_id = item.fi_us_id;
				inputData.fi_ro_role = value;
				await stores.filesOfUserRolesStore.updateFilesOfUserRoles(inputData);
				message.success(L("thao_tac_thanh_cong"));
			}
		} else
			if (stores.sessionStore.getUserLogin().id == item.us_id) {
				if (value == eResourceRoleStatus.VIEW.num) {
					let self = this;
					confirm({
						title: L("hanh_dong_se_thay_doi_quyen_cua_ban_ban_ban_se_khong_the_chia_se"),
						okText: L('Confirm'),
						cancelText: L('Cancel'),
						async onOk() {
							self.setState({ isLoadDone: false });
							let inputData = new UpdateFolderRolesInput({ ...item });
							inputData.fo_ro_id = item.fo_ro_id;;
							inputData.fo_ro_role = value;
							await stores.folderRolesStore.updateFolderRoles(inputData);
							message.success(L("thao_tac_thanh_cong"));
							self.props.onRefeshModal();
							self.setState({ isLoadDone: true });
						},
						onCancel() {
							self.setState({ isLoadDone: true });
						},
					});
				}
			}
			else {
				let inputData = new UpdateFolderRolesInput({ ...item });
				inputData.fo_ro_id = item.fo_ro_id;;
				inputData.fo_ro_role = value;
				await stores.folderRolesStore.updateFolderRoles(inputData);
				message.success(L("thao_tac_thanh_cong"));
			}
	}


	render() {
		const left = this.state.visibleModal ? cssCol(0) : cssCol(24);
		const right = this.state.visibleModal ? cssCol(24) : cssCol(0);

		const { fileRolesSelected, folderRolesSelected } = this.props;
		const isFile: boolean = fileRolesSelected.fi_us_id != undefined;
		const name = isFile ? fileRolesSelected.itemFileOfUser.fi_us_name : folderRolesSelected.itemFolder.fo_name;
		const prefixManager = RouterPath.admin_subscriber;
		const link = isFile ? this.getFileOfUser(fileRolesSelected.itemFileOfUser) : AppConsts.appBaseUrl + prefixManager + '/filesOfUser' + '?link=' + folderRolesSelected.itemFolder.fo_link!;
		const sessionStore = stores.sessionStore;
		const { currentLogin } = stores.sessionStore;

		return (
			<Card>
				<Row style={{ justifyContent: 'space-between', }}>
					{this.state.visibleModal &&
						<Button onClick={() => this.setState({ visibleModal: false })} icon={<BackwardOutlined />}></Button>
					}
					<h2>{L("Share") + name + `"`}</h2>
					<Button onClick={this.onCancel}><CloseOutlined /></Button>
				</Row>
				<Row>
					<Col span={this.state.visibleModal ? 14 : 24}>
						<Row >
							<SelectUserFolder id_ower={folderRolesSelected.fo_id != undefined ? folderRolesSelected.itemFolder.us_id_owner : fileRolesSelected.itemFileOfUser.us_id} listUs_id={folderRolesSelected.fo_id != undefined ? this.listDataFolder : this.listDataFile} onChangeUser={(value: ItemUser[]) => this.onChangeUser(value)} />
						</Row>
					</Col>
					{this.state.visibleModal &&
						<Col span={10}>
							<SelectEnum eNum={eResourceRoleStatus} enum_value={this.state.roleStatus} onChangeEnum={async (value: number) => this.setState({ roleStatus: value })} />
						</Col>
					}
				</Row>
				<Col {...left}>
					<h3>{L("PeopleAccess")}</h3>
					{folderRolesSelected.fo_id != undefined ?
						<List
							split={false}
							size="small"
							locale={{ "emptyText": true }}
							dataSource={[folderRolesSelected]}
							renderItem={(item: FolderRolesDto) => (
								<List.Item
								>
									<List.Item.Meta
										avatar={<Avatar src={stores.sessionStore.getUserAvatarByUserId(item.itemFolder.us_id_owner) != undefined ? this.getFile(item.itemFolder.us_id_owner) : ""} />}
										title={sessionStore.getUserNameById(item.itemFolder.us_id_owner)}
									/>
									<h4 style={{ opacity: 0.4, marginTop: 8, marginRight: '10px' }}>{L('Owner')}</h4>
								</List.Item>
							)}
						/>
						:
						<List
							split={false}
							size="small"
							dataSource={[fileRolesSelected]}
							renderItem={(item: FilesOfUserRolesDto) => (
								<List.Item
								>
									<List.Item.Meta
										avatar={<Avatar src={stores.sessionStore.getUserAvatarByUserId(item.itemFileOfUser.us_id) != undefined ? this.getFile(item.itemFileOfUser.us_id) : ""} />}
										title={sessionStore.getUserNameById(item.itemFileOfUser.us_id)}
									/>
									<h4 style={{ opacity: 0.4, marginTop: 8, marginRight: '10px' }}>{L('Owner')}</h4>
								</List.Item>
							)}
						/>}
					{folderRolesSelected.fo_id != undefined ?
						<List
							split={false}
							size="small"
							dataSource={this.listDataFolder}
							locale={{ "emptyText": true }}
							style={{ overflowY: 'auto' }}
							renderItem={(item: FolderRolesDto) => (
								<List.Item
									actions={[<SelectEnumRoles allowCheck={true} eNum={eResourceRoleStatus} enum_value={item.fo_ro_role} onChangeEnum={async (value: number) => this.OnUpdateRoleFileOrFolder(item, value)} />]}
								>
									<List.Item.Meta
										//avatar={<Avatar src={this.getFile(item.us_id)} />}
										title={sessionStore.getUserNameById(item.us_id)}
									/>
								</List.Item>
							)}
						/>
						:
						<List
							split={false}
							size="small"
							dataSource={this.listDataFile}
							style={{ overflowY: 'auto' }}
							locale={{ "emptyText": true }}
							renderItem={(item: FilesOfUserRolesDto) => (
								<List.Item
									actions={[<SelectEnumRoles allowCheck={true} eNum={eResourceRoleStatus} enum_value={item.fi_ro_role} onChangeEnum={async (value: number) => this.OnUpdateRoleFileOrFolder(item, value)} />]}
								>
									<List.Item.Meta
										//avatar={<Avatar src={this.getFile(item.us_id)} />}
										title={sessionStore.getUserNameById(item.us_id)}
									/>
								</List.Item>
							)}
						/>}
					<h3>{L("GeneralAccess")}</h3>
					<Row gutter={16}>
						<Row>
							<Col span={2} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', }}>
								{this.state.roleType == eResourceRoleType.PRIVATE.num && <LockOutlined style={{ padding: '10px', fontSize: '20px', background: '#ccc', borderRadius: '50%' }} />}
								{this.state.roleType == eResourceRoleType.PUBLIC_ALL.num && <GlobalOutlined style={{ padding: '10px', fontSize: '20px', background: '#c4eed0', borderRadius: '50%' }} />}
							</Col>
							<Col span={22} style={{ paddingLeft: '10px' }}>
								<SelectEnum allowCheck={true} eNum={eResourceRoleType} enum_value={this.state.roleType} onChangeEnum={async (value: number) => this.onChangeTypeFileOrFolder(value)} />
								{this.state.roleType == eResourceRoleType.PRIVATE.num && <span>{L("OnlyLink")}</span>}
								{this.state.roleType == eResourceRoleType.PUBLIC_ALL.num && <span>{L("AnyoneLink")}</span>}
							</Col>
						</Row>
					</Row>
				</Col>

				<Row style={{ justifyContent: 'space-between', marginTop: '30px' }}>
					<Paragraph
						style={{ padding: '4px 0', margin: '-4px', }}
						copyable={{
							text: link,
							icon: [<div style={{ color: 'black' }}><Button style={{ borderRadius: '35px' }} icon={<LinkOutlined />}>{L("CopyLink")}</Button></div>],
							tooltips: false,
						}}
					/>
					{this.state.visibleModal ?
						<Button type='primary' style={{ borderRadius: '35px' }} onClick={this.onCreateRoleFileOrFolder}>{L("Send")}</Button>
						:
						<Button onClick={this.onCancel} type='primary' style={{ borderRadius: '35px' }}>{L("Finished")}</Button>
					}
				</Row>

			</Card >
		)
	}
}