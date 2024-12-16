import { action, observable } from 'mobx';
import http from '@services/httpService';

import { FolderRolesDto, FolderRolesService, CreateFolderRolesInput, UpdateFolderRolesInput, ResourceRoleStatus, ResourceRolesDto, } from '@services/services_autogen';

class FolderRolesStore {
	private folderRolesService: FolderRolesService;

	@observable totalFolderRoles: number = 0;
	@observable folderRolesListResult: FolderRolesDto[] = [];
	@observable resoundRolesByLink: ResourceRolesDto = new ResourceRolesDto();

	constructor() {
		this.folderRolesService = new FolderRolesService("", http);
	}

	@action
	public createListFolderRoles = async (input: CreateFolderRolesInput) => {
		if (input == undefined || input == null) {
			return false;
		}
		let result: boolean = await this.folderRolesService.createListFolderRoles(input);
		if (!!result) {
			return result;
		}
		return false;
	}
	@action
	public getResoundRolesByLink = async (link: string | undefined, marker: boolean | undefined) => {
		let result = await this.folderRolesService.getResoundRolesByLink(link, marker);
		this.resoundRolesByLink = result;
		return this.resoundRolesByLink
	}
	@action
	async updateFolderRoles(input: UpdateFolderRolesInput) {
		let result: FolderRolesDto = await this.folderRolesService.updateFolderRoles(input);
		if (!!result) {
			this.folderRolesListResult = this.folderRolesListResult.map((x: FolderRolesDto) => {
				if (x.fo_ro_id === input.fo_ro_id) x = result;
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
			let indexDelete = this.folderRolesListResult.findIndex(a => a.fo_ro_id == item.fo_ro_id);
			if (indexDelete >= 0) {
				this.folderRolesListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async (us_id: number | undefined, fo_id: number | undefined, marker: boolean | undefined, fo_ro_role: ResourceRoleStatus | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.folderRolesListResult = [];
		let result = await this.folderRolesService.getAll(us_id, fo_id, marker, fo_ro_role, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.folderRolesListResult = [];
			this.totalFolderRoles = result.totalCount;
			for (let item of result.items) {
				this.folderRolesListResult.push(item);
			}
		}
	}
	@action
	public getParentBreadcrumb = async (link: string | undefined) => {
		if (link == undefined) {
			return [];
		}
		let result = await this.folderRolesService.getAllParentBreadcrumb(link);
		return result.items;
	}
	

}

export default FolderRolesStore;
