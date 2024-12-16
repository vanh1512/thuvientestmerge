import * as React from 'react';
import { Avatar, Col, Image, List, Row, Tabs, Tag, } from 'antd';
import { FilesOfUserDto, FilesOfUserRolesDto, FolderDto, FolderRolesDto } from '@src/services/services_autogen';
import { CloseOutlined } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import DetailItem from './DetailItem';
import FileOrFolderLog from '../../FileOrFolderLog';
import { L } from '@src/lib/abpUtility';
import MineTypeConst from '@src/lib/minetypeConst';
import { stores } from '@src/stores/storeInitializer';

export interface Iprops {
	desc: string;
	isLoadChange: boolean;
	onSaveDesc: (desc: string) => void;
	fileSelected: FilesOfUserDto;
	folderSelected: FolderDto;
	onCancel: () => void;
}

export const tabManager = {
	tab_1: L("FolderDetails"),
	tab_2: L("Work"),
}
export default class TabFileFolderLog extends AppComponentBase<Iprops> {
	listFileRoles: FilesOfUserRolesDto[] = [];
	listFolderRoles: FolderRolesDto[] = [];

	state = {
		isLoadDone: false,
	};

	async componentDidUpdate(prevProps) {
		if (this.props.isLoadChange != prevProps.isLoadChange) {
			await this.initData();
		}
	}
	initData = async () => {
		this.setState({ isLoadDone: false });
		let isFile: boolean = this.props.fileSelected.fi_us_id != undefined;
		this.listFileRoles = [];
		this.listFolderRoles = [];
		if (isFile) {
			this.listFileRoles = await stores.resourseRolesStore.getAllUserRolesByIdFile(this.props.fileSelected.fi_us_id);
		} else {
			this.listFolderRoles = await stores.resourseRolesStore.getAllUserRolesByIdFolder(this.props.folderSelected.fo_id);
		}
		this.setState({ isLoadDone: true });
	}
	render() {
		const { fileSelected, folderSelected } = this.props;
		const isFile: boolean = fileSelected.fi_us_id != undefined;
		const sessionStore = stores.sessionStore;
		return (
			<>
				<Row>
					<Col span={16}>
						{isFile ? fileSelected.fi_us_name : folderSelected.fo_name}
					</Col>
					<Col span={8} style={{ textAlign: 'end' }}>
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
						src={isFile ? MineTypeConst.getThumUrl(fileSelected.fi_us_extension!) : process.env.PUBLIC_URL + '/folder_icon.png'}
						preview={true}
					/>
				</Row>
				<span>{L("PeopleAccess")}:</span>
				<br />
				{isFile ?
					<List
						split={false}
						size="small"
						dataSource={this.listFileRoles}
						style={{ overflowY: 'auto' }}
						locale={{ "emptyText": true }}
					>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(fileSelected.us_id))} />}
								title={<div style={{ display: 'flex', justifyContent: 'space-between' }}><div>{sessionStore.getUserNameById(fileSelected.us_id)}</div><Tag color="default">{L('chu_so_huu')}</Tag></div>}
							/>
						</List.Item>
						{this.listFileRoles.map(item =>
							<List.Item>
								<List.Item.Meta
									avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.us_id))} />}
									title={sessionStore.getUserNameById(item.us_id)}
								/>
							</List.Item>
						)}
					</List>
					:
					<List
						split={false}
						size="small"
						dataSource={this.listFolderRoles}
						locale={{ "emptyText": true }}
						style={{ overflowY: 'auto' }}
					>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(folderSelected.us_id_owner))} />}
								title={<div style={{ display: 'flex', justifyContent: 'space-between' }}><div>{sessionStore.getUserNameById(folderSelected.us_id_owner)}</div><Tag color="default">{L('chu_so_huu')}</Tag></div>}
							/>
						</List.Item>
						{this.listFolderRoles.map(item =>
							<List.Item>
								<List.Item.Meta
									avatar={<Avatar src={this.getFile(sessionStore.getUserAvatarByUserId(item.us_id))} />}
									title={sessionStore.getUserNameById(item.us_id)}
								/>
							</List.Item>
						)}
					</List>
				}
				<Tabs defaultActiveKey={tabManager.tab_1} >
					<Tabs.TabPane tab={tabManager.tab_1} key={tabManager.tab_1}>
						<DetailItem
							desc={this.props.desc}
							fileSelected={this.props.fileSelected}
							folderSelected={this.props.folderSelected}
							onSaveDesc={this.props.onSaveDesc}
							onCancel={this.props.onCancel}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane tab={tabManager.tab_2} key={tabManager.tab_2} >
						<FileOrFolderLog
							fi_fo_id={this.props.fileSelected.fi_us_id != undefined ? this.props.fileSelected.fi_us_id : this.props.folderSelected.fo_id}
							isFile={isFile}
							fi_fo_name={this.props.fileSelected.fi_us_name != undefined ? this.props.fileSelected.fi_us_name : this.props.folderSelected.fo_name!}
						/>
					</Tabs.TabPane>
				</Tabs>
			</>
		)
	}
}