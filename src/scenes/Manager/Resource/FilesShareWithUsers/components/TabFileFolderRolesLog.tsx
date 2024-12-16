import * as React from 'react';
import { Avatar, Col, Image, List, Row, Tabs, } from 'antd';
import { FilesOfUserRolesDto, FolderRolesDto } from '@src/services/services_autogen';
import { CloseOutlined } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import FileOrFolderLog from '../../FileOrFolderLog';
import DetailItemRoles from './DetailItemRoles';
import { L } from '@src/lib/abpUtility';
import MineTypeConst from '@src/lib/minetypeConst';
import { stores } from '@src/stores/storeInitializer';

export interface Iprops {
	desc: string;
	onSaveDesc: (desc: string) => void;
	fileRolesSelected: FilesOfUserRolesDto;
	folderRolesSelected: FolderRolesDto;
	onCancel: () => void;
}
export const tabManager = {
	tab_1: L("FolderDetails"),
	tab_2: L("Work"),
}
export default class TabFileFolderRolesLog extends AppComponentBase<Iprops> {
	listDataFolder: FolderRolesDto[] = [];
	listDataFile: FilesOfUserRolesDto[] = [];
	isFile: boolean = this.props.fileRolesSelected.fi_us_id != undefined;
	state = {
		isLoadDone: false,
	};
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		if (this.isFile) {
			this.listDataFile = await stores.resourseRolesStore.getAllUserRolesByIdFile(this.props.fileRolesSelected.fi_us_id);
		} else {
			this.listDataFolder = await stores.resourseRolesStore.getAllUserRolesByIdFolder(this.props.folderRolesSelected.fo_id);
		}
		this.setState({ isLoadDone: true });
	}
	render() {
		const { fileRolesSelected, folderRolesSelected } = this.props;
		const isFile: boolean = fileRolesSelected.fi_us_id != undefined;
		const sessionStore = stores.sessionStore;

		return (
			<>
				<Row>
					<Col span={22} style={{ textAlign: 'center', fontSize: '16px' }}>
						<strong>{isFile ? fileRolesSelected.itemFileOfUser.fi_us_name : folderRolesSelected.itemFolder != undefined && folderRolesSelected.itemFolder.fo_name}</strong>
					</Col>
					<Col span={2} style={{ textAlign: 'end' }}>
						<CloseOutlined onClick={this.props.onCancel} />
					</Col>
				</Row>
				<Row>
					<Image
						width={"100%"}
						height={200}
						style={{
							border: '1px solid rgb(189,193,198)',
							borderRadius: '0.5rem',
							boxSizing: 'border-box',
							objectFit: 'cover',
						}}
						src={(isFile && fileRolesSelected.itemFileOfUser != undefined) ? MineTypeConst.getThumUrl(fileRolesSelected.itemFileOfUser.fi_us_extension!) : process.env.PUBLIC_URL + '/folder_icon.png'}
						preview={true}
					/>
				</Row>
				<Row style={{ marginTop: '20px' }}>
					<Col>
						<span>{L("PeopleAccess")}:</span>
						<br />
						{folderRolesSelected.fo_id != undefined ?
							<List
								split={false}
								size="small"
								dataSource={this.listDataFolder}
								locale={{ "emptyText": true }}
								style={{ overflowY: 'auto' }}
								renderItem={(item: FolderRolesDto, index: number) => (
									<List.Item
										style={{ flexDirection: "column", alignItems: "flex-start" }}
									>
										<List.Item.Meta
											avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.us_id))} />}
											title={sessionStore.getUserNameById(item.us_id)}
										/>
										<List.Item.Meta
											avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.itemFolder.us_id_owner))} />}
											title={sessionStore.getUserNameById(item.itemFolder.us_id_owner)}
										/>
									</List.Item>
								)}
							/>
							:
							<List
								split={false}
								size="small"
								dataSource={this.listDataFile}
								style={{ overflowY: 'auto', flexDirection: "column" }}
								locale={{ "emptyText": true }}
								renderItem={(item: FilesOfUserRolesDto, index: number) => (
									<List.Item
										style={{ flexDirection: "column", alignItems: "flex-start" }}
									>
										<List.Item.Meta
											avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.us_id))} />}
											title={sessionStore.getUserNameById(item.us_id)}
										/>
										<br />
										<List.Item.Meta
											avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.itemFileOfUser.us_id))} />}
											title={sessionStore.getUserNameById(item.itemFileOfUser.us_id)}
										/>
									</List.Item>
								)}
							/>}
					</Col>
				</Row>
				<Tabs defaultActiveKey={tabManager.tab_1} >
					<Tabs.TabPane tab={tabManager.tab_1} key={tabManager.tab_1}>
						<DetailItemRoles
							desc={this.props.desc}
							fileRolesSelected={this.props.fileRolesSelected}
							folderRolesSelected={this.props.folderRolesSelected}
							onSaveDesc={this.props.onSaveDesc}
							onCancel={this.props.onCancel}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_2} key={tabManager.tab_2} >
						<FileOrFolderLog
							fi_fo_id={this.props.fileRolesSelected.fi_us_id != undefined ? this.props.fileRolesSelected.fi_us_id : this.props.folderRolesSelected.fo_id}
							isFile={isFile}
						/>
					</Tabs.TabPane>
				</Tabs>
			</>
		)
	}
}