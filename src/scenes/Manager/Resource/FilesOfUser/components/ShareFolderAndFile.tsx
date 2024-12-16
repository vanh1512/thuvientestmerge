import * as React from 'react';
import { Card, Row, Col, Button, Typography, List, Avatar, message } from 'antd';
import { ChangeTypeFileOfUserInput, ChangeTypeFolderInput, CreateFilesOfUserRolesInput, CreateFolderRolesInput, FilesOfUserDto, FilesOfUserRolesDto, FolderDto, FolderRolesDto, ItemUser, UpdateFilesOfUserRolesInput, UpdateFolderRolesInput, UserDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eResourceRoleStatus, eResourceRoleType } from '@src/lib/enumconst';
import AppConsts, { RouterPath, cssCol } from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { BackwardOutlined, CloseOutlined, DeleteOutlined, GlobalOutlined, LinkOutlined, LockOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import SelectUserFolder from './SelectUserFolder';

const { Paragraph } = Typography;
export interface Iprops {
	folderSelected: FolderDto;
	fileSelected: FilesOfUserDto;
	onCancel: () => void;
}
export default class ShareFolderAndFile extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,
		visibleModal: false,
		roleStatus: eResourceRoleStatus.VIEW.num,
		roleType: undefined,
	};
	listUserSelect: ItemUser[] = [];
	listDataFolder: FolderRolesDto[] = [];
	listDataFile: FilesOfUserRolesDto[] = [];
	listUsid: number[] = [];
	isFile: boolean = this.props.fileSelected.fi_us_id != undefined;
	async componentDidMount() {
		if (this.isFile) {
			this.listDataFile = await stores.resourseRolesStore.getAllUserRolesByIdFile(this.props.fileSelected.fi_us_id);
		} else {
			this.listDataFolder = await stores.resourseRolesStore.getAllUserRolesByIdFolder(this.props.folderSelected.fo_id);
		}
		await this.initData();
	}

	initData = async () => {

		let type: number = eResourceRoleType.PRIVATE.num;
		let id: number = -1;
		if (this.isFile) {
			type = this.props.fileSelected.fi_ro_type;
			id = this.props.fileSelected.fi_us_id;
		} else {
			type = this.props.folderSelected.fo_ro_type;
			id = this.props.fileSelected.fo_id;
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
		if (this.props.fileSelected.fi_us_id != undefined) {
			let itemData = new CreateFilesOfUserRolesInput();
			itemData.us_id = this.listUserSelect.map(item => item.id);
			itemData.fi_us_id = this.props.fileSelected.fi_us_id;
			itemData.fi_ro_role = this.state.roleStatus;
			await stores.filesOfUserRolesStore.createFilesOfUserRoles(itemData);
		} else {
			let itemData = new CreateFolderRolesInput();
			itemData.us_id = this.listUserSelect.map(item => item.id);
			itemData.fo_id = this.props.folderSelected.fo_id;
			itemData.fo_ro_role = this.state.roleStatus;
			await stores.folderRolesStore.createListFolderRoles(itemData);
		}
		message.success("Chia sẻ thành công!")
		this.onCancel();

	}
	// thay đổi kiểu cho file, folder
	onChangeTypeFileOrFolder = async (value: number) => {
		this.setState({ roleType: value });
		if (this.props.fileSelected.fi_us_id != undefined) {
			let inputData = new ChangeTypeFileOfUserInput();
			inputData.fi_us_id = this.props.fileSelected.fi_us_id;
			inputData.fi_ro_type = value;
			await stores.resourseStore.changeTypeFileOfUser(inputData);
		} else {
			let inputData = new ChangeTypeFolderInput();
			inputData.fo_id = this.props.folderSelected.fo_id;
			inputData.fo_ro_type = value;
			await stores.resourseStore.changeTypeFolder(inputData);
		}
	}

	//doing chưa test ( xem lại fileofuser role input )
	OnUpdateRoleFileOrFolder = async (item, value: number) => {
		if (this.props.fileSelected.fi_us_id != undefined) {
			let inputData = new UpdateFilesOfUserRolesInput({ ...item });
			inputData.fi_us_id = item.fi_us_id;
			inputData.fi_ro_role = value;
			await stores.filesOfUserRolesStore.updateFilesOfUserRoles(inputData);
		} else {
			let inputData = new UpdateFolderRolesInput({ ...item });
			inputData.fo_ro_id = item.fo_ro_id;;
			inputData.fo_ro_role = value;
			await stores.folderRolesStore.updateFolderRoles(inputData);
		}
		message.success("Thao tác thành công");
	}
	OnDeleteRoleFileOrFolder = async (item, index: number) => {
		this.setState({ isLoadDone: true });
		if (this.props.fileSelected.fi_us_id != undefined) {
			let inputData = new FilesOfUserRolesDto({ ...item });
			inputData.fi_ro_id = item.fi_ro_id;
			await stores.resourseRolesStore.deleteFilesOfUserRoles(inputData);
			this.listDataFile.splice(index, 1);
		} else {
			let inputData = new FolderRolesDto;
			inputData.fo_ro_id = item.fo_ro_id;
			await stores.resourseRolesStore.deleteFolderRoles(inputData);
			this.listDataFolder.splice(index, 1);
		}
		message.success("Thao tác thành công");
		this.setState({ isLoadDone: false });


	}
	render() {
		const left = this.state.visibleModal ? cssCol(0) : cssCol(24);
		const right = this.state.visibleModal ? cssCol(24) : cssCol(0);
		const { fileSelected, folderSelected } = this.props;
		const isFile: boolean = fileSelected.fi_us_id != undefined;
		const name = isFile ? fileSelected.fi_us_name : folderSelected.fo_name;
		const prefixManager = RouterPath.admin_subscriber;
		const link = isFile ? this.getFileOfUser(fileSelected) : AppConsts.appBaseUrl + prefixManager + '/filesOfUser' + '?link=' + folderSelected.fo_link!;
		const { currentLogin } = stores.sessionStore;
		const sessionStore = stores.sessionStore;
		const folderSelecteds: FolderDto[] = [folderSelected];

		return (
			<Card>
				<Row style={{ justifyContent: 'space-between', }}>
					{this.state.visibleModal &&
						<Button onClick={() => this.setState({ visibleModal: false })} icon={<BackwardOutlined />}></Button>
					}
					<h2>{L("Share") + " " + `"` + name + `"`}</h2>
					<Button onClick={this.onCancel}><CloseOutlined /></Button>
				</Row>
				<Row>
					<Col span={this.state.visibleModal ? 14 : 24}>
						<Row >
							<SelectUserFolder id_ower={folderSelected.fo_id != undefined ? folderSelected.us_id_owner : fileSelected.us_id} listUs_id={folderSelected.fo_id != undefined ? this.listDataFolder : this.listDataFile} onChangeUser={(value: ItemUser[]) => this.onChangeUser(value)} />
						</Row>
					</Col>
					{this.state.visibleModal &&
						<Col span={10}>
							<SelectEnum eNum={eResourceRoleStatus} allowCheck={true} enum_value={this.state.roleStatus} onChangeEnum={async (value: number) => this.setState({ roleStatus: value })} />
						</Col>
					}
				</Row>
				<Col {...left}>
					<h3>{L("PeopleAccess")}</h3>
					{folderSelected.fo_id != undefined ?
						<List
							split={false}
							size="small"
							dataSource={this.listDataFolder}
							locale={{ "emptyText": true }}
							style={{ overflowY: 'auto' }}
							renderItem={(item: FolderRolesDto, index: number) => (
								<List.Item
									actions={[
										<SelectEnum eNum={eResourceRoleStatus} allowCheck={true} enum_value={item.fo_ro_role} onChangeEnum={async (value: number) => this.OnUpdateRoleFileOrFolder(item, value)} />,
										<DeleteOutlined style={{ color: 'red' }} onClick={() => this.OnDeleteRoleFileOrFolder(item, index)} />
									]}
								>
									<List.Item.Meta
										avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.us_id)!)} />}
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
							renderItem={(item: FilesOfUserRolesDto, index: number) => (
								<List.Item
									actions={[<SelectEnum eNum={eResourceRoleStatus} allowCheck={true} enum_value={item.fi_ro_role} onChangeEnum={async (value: number) => this.OnUpdateRoleFileOrFolder(item, value)} />,
									<DeleteOutlined style={{ color: 'red' }} onClick={() => this.OnDeleteRoleFileOrFolder(item, index)} />
									]}
								>
									<List.Item.Meta
										avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.us_id)!)} />}
										title={sessionStore.getUserNameById(item.us_id)}
									/>
								</List.Item>
							)}
						/>}
					<h3>{L("GeneralAccess")}</h3>
					<Row gutter={16} style={{ marginTop: 20 }}>
						<Row>
							<Col span={2} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', }}>
								{this.state.roleType == eResourceRoleType.PRIVATE.num && <LockOutlined style={{ padding: '10px', fontSize: '20px', background: '#ccc', borderRadius: '50%' }} />}
								{this.state.roleType == eResourceRoleType.PUBLIC_ALL.num && <GlobalOutlined style={{ padding: '10px', fontSize: '20px', background: '#c4eed0', borderRadius: '50%' }} />}
							</Col>
							<Col span={22} style={{ paddingLeft: '10px' }}>
								<SelectEnum eNum={eResourceRoleType} enum_value={this.state.roleType} onChangeEnum={async (value: number) => this.onChangeTypeFileOrFolder(value)} />
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
						<Button type='primary' style={{ borderRadius: '35px' }} onClick={this.onCreateRoleFileOrFolder}>{L('Send')}</Button>
						:
						<Button onClick={this.onCancel} type='primary' style={{ borderRadius: '35px' }}>{L("Finished")}</Button>
					}
				</Row>

			</Card >
		)
	}
}