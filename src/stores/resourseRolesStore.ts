import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	FolderRolesService, FolderRolesDto, UpdateFolderRolesInput, CreateFolderRolesInput, FilesOfUserRolesService, ResourceRolesDto, FilesOfUserRolesDto, UpdateFilesOfUserRolesInput, CreateFilesOfUserRolesInput, UpdateFolderWithRolesInput, UpdateFilesOfUserWithRolesInput
} from '@services/services_autogen';
export class ResourseRolesStore {
	private folderRolesService: FolderRolesService;
	private filesOfUserRolesService: FilesOfUserRolesService;

	@observable totalFolderRoles: number = 0;
	@observable resourseRolesSelect: ResourceRolesDto = new ResourceRolesDto();

	constructor() {
		this.folderRolesService = new FolderRolesService("", http);
		this.filesOfUserRolesService = new FilesOfUserRolesService("", http);
	}
	@action
	public getResoundRolesByLink = async (link: string | undefined, marker: boolean | undefined) => {
		let result = await this.folderRolesService.getResoundRolesByLink(link, marker);
		this.resourseRolesSelect = result;
		return this.resourseRolesSelect
	}
	
	@action
	public getAllUserRolesByIdFile = async (fi_us_id: number | undefined) => {
		let result = await this.filesOfUserRolesService.getAllUserRolesById(fi_us_id);

		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			return result.items
		}
		return [];
	}

	@action
	public getAllUserRolesByIdFolder = async (fo_id: number | undefined) => {
		let result = await this.folderRolesService.getAllUserRolesById(fo_id);

		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			return result.items
		}
		return [];
	}

	@action
	public createFolderRoles = async (fo_id_parent: number, input: CreateFolderRolesInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<FolderRolesDto>(<any>null);
		}
		let result: boolean = await this.folderRolesService.createFolderRoles(fo_id_parent, input);
		if (!!result) {
			return true;
		}
		return Promise.resolve<FolderRolesDto>(<any>null);
	}

	@action
	async updateFolderRoles(input: UpdateFolderRolesInput) {
		let result: FolderRolesDto = await this.folderRolesService.updateFolderRoles(input);
		if (!!result) {
			if (this.resourseRolesSelect != undefined) {
				this.resourseRolesSelect.foldersRolesInside = this.resourseRolesSelect.foldersRolesInside!.map((x: FolderRolesDto) => {
					if (x.fo_ro_id === input.fo_ro_id) x = result;
					return x;
				});
			}
			return Promise.resolve<FolderRolesDto>(<any>result);
		}
		return Promise.resolve<FolderRolesDto>(<any>null);
	}
	@action
	async updateFolderWithRoles(input: UpdateFolderWithRolesInput) {
		let result: FolderRolesDto = await this.folderRolesService.updateFolderWithRoles(input);
		if (!!result) {
			this.resourseRolesSelect.foldersRolesInside = this.resourseRolesSelect.foldersRolesInside!.map((x: FolderRolesDto) => {
				if (x.fo_ro_id === input.fo_ro_id) x = result;
				return x;
			});
			return Promise.resolve<FolderRolesDto>(<any>result);
		}
		return Promise.resolve<FolderRolesDto>(<any>null);
	}
	@action
	async markerFolderRoles(item: FolderRolesDto) {
		if (!item || !item.fo_ro_id) {
			return false;
		}
		let result: FolderRolesDto = await this.folderRolesService.markerFolderRoles(item.fo_ro_id);
		if (!!result) {
			this.resourseRolesSelect.foldersRolesInside = this.resourseRolesSelect.foldersRolesInside!.map((x: FolderRolesDto) => {
				if (x.fo_ro_id === item.fo_ro_id) x = result;
				return x;
			});
			return Promise.resolve<FolderRolesDto>(<any>result);
		}
		return Promise.resolve<FolderRolesDto>(<any>null);
	}

	@action
	public deleteFolderRoles = async (item: FolderRolesDto) => {
		if (!item || !item.fo_ro_id) {
			return false;
		}
		let result = await this.folderRolesService.delete(item.fo_ro_id);
		if (!!result) {
			// let indexDelete = this.resourseRolesSelect.foldersRolesInside!.findIndex(a => a.fo_ro_id == item.fo_ro_id);
			// if (indexDelete >= 0) {
			// 	this.resourseRolesSelect.foldersRolesInside!.splice(indexDelete, 1);
			// }
			return true;
		}
		return false;
	}

	@action
	public createFilesOfUserRoles = async (input: CreateFilesOfUserRolesInput) => {
		if (input == undefined || input == null) {
			return false;
		}
		let result: boolean = await this.filesOfUserRolesService.createFilesOfUserRoles(input);
		if (!!result) {
			return true;
		}
		return false;
	}

	@action
	async updateFilesOfUserRoles(input: UpdateFilesOfUserRolesInput) {
		let result: FilesOfUserRolesDto = await this.filesOfUserRolesService.updateFilesOfUserRoles(input);
		if (!!result) {
			this.resourseRolesSelect.filesRolesInside = this.resourseRolesSelect.filesRolesInside!.map((x: FilesOfUserRolesDto) => {
				if (x.fi_ro_id === input.fi_ro_id) x = result;
				return x;
			});
			return Promise.resolve<FilesOfUserRolesDto>(<any>result);
		}
		return Promise.resolve<FilesOfUserRolesDto>(<any>null);
	}
	@action
	async updateFilesOfUserWithRoles(input: UpdateFilesOfUserWithRolesInput) {
		let result: FilesOfUserRolesDto = await this.filesOfUserRolesService.updateFilesOfUserWithRoles(input);
		if (!!result) {
			this.resourseRolesSelect.filesRolesInside = this.resourseRolesSelect.filesRolesInside!.map((x: FilesOfUserRolesDto) => {
				if (x.fi_ro_id === input.fi_ro_id) x = result;
				return x;
			});
			return Promise.resolve<FilesOfUserRolesDto>(<any>result);
		}
		return Promise.resolve<FolderRolesDto>(<any>null);
	}
	@action
	markerFileRoles = async (item: FilesOfUserRolesDto) => {
		if (!item || !item.fi_ro_id) {
			return false;
		}
		let result: FilesOfUserRolesDto = await this.filesOfUserRolesService.markerFileRoles(item.fi_ro_id);
		if (!!result) {
			this.resourseRolesSelect.filesRolesInside = this.resourseRolesSelect.filesRolesInside!.map((x: FilesOfUserRolesDto) => {
				if (x.fi_ro_id === item.fi_ro_id) x = result;
				return x;
			});
			return Promise.resolve<FilesOfUserRolesDto>(<any>result);
		}
		return Promise.resolve<FilesOfUserRolesDto>(<any>null);
	}

	@action
	public deleteFilesOfUserRoles = async (item: FilesOfUserRolesDto) => {
		if (!item || !item.fi_ro_id) {
			return false;
		}
		let result = await this.filesOfUserRolesService.delete(item.fi_ro_id);
		if (!!result) {
			return true;
		}
		return false;
	}

}


export default ResourseRolesStore;