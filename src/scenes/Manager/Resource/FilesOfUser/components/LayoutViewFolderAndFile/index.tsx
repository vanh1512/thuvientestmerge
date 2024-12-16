import * as React from 'react';
import {  FilesOfUserDto, FolderDto, GetCurrentLoginInformationsOutput } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import TableFolderAndFile from './TableFolderAndFile';
import ListFolderAndFile from './ListFolderAndFile';


export const ViewLayout = {
	List: 1,
	Grid: 2,
};
export interface Iprops {
	foldersInside: FolderDto[];
	filesInside: FilesOfUserDto[];
	folderSelected: FolderDto;
	fileSelected: FilesOfUserDto;
	onAction: (action: number, item?) => void;
	viewLayout: number ;
	isLoadFile: boolean;
	currentLogin: GetCurrentLoginInformationsOutput;
}
export default class LayoutViewFolderAndFile extends AppComponentBase<Iprops> {
	
	render() {
		const {viewLayout, foldersInside, filesInside,folderSelected,fileSelected,onAction, currentLogin}= this.props;
		if( viewLayout == ViewLayout.List)
			return <TableFolderAndFile
						currentLogin={currentLogin}
						foldersInside={foldersInside}
						filesInside={filesInside}
						folderSelected={folderSelected}
						fileSelected={fileSelected}
						onAction={onAction}
					/>
		return	<ListFolderAndFile
				isLoadFile={this.props.isLoadFile}
					foldersInside={foldersInside}
					filesInside={filesInside}
					folderSelected={folderSelected}
					fileSelected={fileSelected}
					onAction={onAction}
				/>
		
	}
}