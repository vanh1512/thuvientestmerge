import * as React from 'react';
import { FilesOfUserRolesDto, FolderRolesDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import TableFolderAndFileRoles from './TableFolderAndFileRoles';
import ListFolderAndFileRoles from './ListFolderAndFileRoles';


export const ViewLayout = {
	List: 1,
	Grid: 2,
};
export interface Iprops {
	foldersRolesInside: FolderRolesDto[];
	filesRolesInside: FilesOfUserRolesDto[];
	folderRolesSelected: FolderRolesDto;
	fileRolesSelected: FilesOfUserRolesDto;
	onAction: (action: number, item?) => void;
	viewLayout: number;
	isLoadFile: boolean;
}
export default class LayoutViewFolderAndFileRoles extends AppComponentBase<Iprops> {

	render() {
		const { viewLayout, foldersRolesInside, filesRolesInside, folderRolesSelected, fileRolesSelected, onAction } = this.props;
		if (viewLayout == ViewLayout.List)
			return <TableFolderAndFileRoles
				foldersRolesInside={foldersRolesInside}
				filesRolesInside={filesRolesInside}
				folderRolesSelected={folderRolesSelected}
				fileRolesSelected={fileRolesSelected}
				onAction={onAction}
			/>
		return <ListFolderAndFileRoles
			isLoadFile={this.props.isLoadFile}
			foldersRolesInside={foldersRolesInside}
			filesRolesInside={filesRolesInside}
			folderRolesSelected={folderRolesSelected}
			fileRolesSelected={fileRolesSelected}
			onAction={onAction}
		/>

	}
}