import * as React from 'react';
import { List} from 'antd';
import { FilesOfUserDto, FolderDto } from '@src/services/services_autogen';
import { DoubleRightOutlined, FileTextOutlined, FolderFilled } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@src/lib/abpUtility';

export interface Iprops {
	folderSelected: FolderDto;
	foldersInside: FolderDto[];
	filesInside: FilesOfUserDto[];
	onChangeFolder: (folder: FolderDto, isPushBR: boolean) => void
}
export default class ListItemMove extends AppComponentBase<Iprops> {
	state = {
		isLoadDone: false,
	};
	folderSelected: FolderDto = new FolderDto();

	onSelectFolder = (folder: FolderDto) => {
		this.setState({ isLoadDone: false });
		this.folderSelected = folder;
		this.setState({ isLoadDone: true });
	}
	onChangeFolder = (folder: FolderDto):boolean => {
		if(this.checkFolderDisable(folder)){
			return false;
		}
		if (this.props.onChangeFolder != undefined) {
			this.props.onChangeFolder(folder, true);
			return true;
		}
		return false;
	}
	checkFolderDisable = (item): boolean => {
		const { folderSelected } = this.props;
		if (item.fo_id == folderSelected.fo_id || item.fo_id == folderSelected.fo_id_parent) {
			return true
		}
		return false;
	}

	render() {
		const { foldersInside, filesInside } = this.props;
		return (
			<>
				<List
					style={{overflow:'auto', maxHeight:'400px'}}
					itemLayout="horizontal"
					dataSource={[...foldersInside]}
					locale={{ "emptyText": true }}
					renderItem={(item: FolderDto, index: number) => (
						<List.Item key={"list_folder_" + index} onClick={() => this.onSelectFolder(item)} onDoubleClick={() => this.onChangeFolder(item)} className={this.folderSelected.fo_id == item.fo_id ? "bg-folder" : "bg-white"} style={{ padding: '3px 10px', border: 'none', borderRadius: '15px', opacity: this.checkFolderDisable(item) ? 0.7 : 1 }}
							actions={this.checkFolderDisable(item) ? [] : [<DoubleRightOutlined style={{ color: 'black' }} onClick={() => this.onChangeFolder(item)} />]}
						>
							<List.Item.Meta
								avatar={<FolderFilled style={{ color: '#fad165' }} />}
								title={item.fo_name}
							/>
						</List.Item>
					)}
				/>
				<List
					itemLayout="horizontal"
					dataSource={[...filesInside]}
					locale={{ "emptyText": true }}
					renderItem={(item: FilesOfUserDto, index: number) => (
						<List.Item key={"list_file_user_" + index} style={{ padding: '3px 10px', border: 'none', borderRadius: '15px', opacity: 0.7 }} aria-label={L("UnableSelectFile")}>
							<List.Item.Meta
								avatar={<FileTextOutlined style={{ color: '#1a73e8' }} />}
								title={item.fi_us_name}
							/>
						</List.Item>
					)}
				/>
			</>
		)
	}
}