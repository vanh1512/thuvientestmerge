import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	FolderService, FolderDto, UpdateFolderInput, CreateFolderInput, FilesOfUserService, ResourceDto, FileParameter, FilesOfUserDto, UpdateFilesOfUserInput, ChangeParentFolderInput, ChangeParentFileOfUserInput, ChangeTypeFolderInput, ChangeTypeFileOfUserInput, TypeFileFolder, IFolderDto
} from '@services/services_autogen';

export class TreeFolderDto extends FolderDto {
	key: number;
	title: string;
	value: number;
	link: string;
	children: TreeFolderDto[] = [];
	nrchildren = () => {
		let total = this.children.length;
		this.children.forEach(element => {
			total += element.nrchildren();
		});
		return total;
	}
	constructor(data?: IFolderDto) {
		super(data);
		this.key = this.fo_id;
		this.title = this.fo_name!;
		this.value = this.key!;
		this.link = this.fo_link!;
	}

}


export class ResourseStore {
	private folderService: FolderService;
	private filesOfUserService: FilesOfUserService;

	@observable totalFolder: number = 0;
	@observable resourseSelect: ResourceDto = new ResourceDto();
	@observable treeFolderDto: TreeFolderDto = new TreeFolderDto(new FolderDto());

	constructor() {
		this.folderService = new FolderService("", http);
		this.filesOfUserService = new FilesOfUserService("", http);
	}
	@action
	public getAll = async (name: string | undefined, type: TypeFileFolder | undefined, marker: boolean | undefined, us_id_owner: number | undefined, link: string | undefined, last_updated_at_from: Date | undefined, last_updated_at_to: Date | undefined) => {
		let result = await this.folderService.getAll(name, type, marker, us_id_owner, link, last_updated_at_from, last_updated_at_to);
		this.resourseSelect = result;
		return this.resourseSelect
	}
	@action
	public getParentBreadcrumb = async (link: string | undefined) => {
		if (link == undefined) {
			return [];
		}
		let result = await this.folderService.getParentBreadcrumb(link);
		return result.items;
	}
	@action
	public getResoundByLink = async (link: string | undefined) => {
		let result = await this.folderService.getResoundByLink(link);
		await this.getAllFolder();
		this.resourseSelect = result;
		return this.resourseSelect
	}
	@action
	public getAllFolder = async () => {
		let result = await this.folderService.getAllFolder();
		if (result !== undefined) {
			this.treeFolderDto = await this.makeTree(result.items!);
		}
		return this.resourseSelect
	}
	@action
	public getFolderById = async (fo_id: number) => {
		if (fo_id == undefined) {
			return Promise.resolve<FolderDto>(<any>null);
		}
		let result = await this.folderService.getFolderById(fo_id);
		return Promise.resolve<FolderDto>(<any>result);
	}

	@action
	public createFolder = async (input: CreateFolderInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<FolderDto>(<any>null);
		}
		let result: FolderDto = await this.folderService.createFolder(input);
		if (!!result) {
			this.resourseSelect.foldersInside!.push(result);
			return Promise.resolve<FolderDto>(<any>result);
		}
		return Promise.resolve<FolderDto>(<any>null);
	}

	@action
	async updateFolder(input: UpdateFolderInput) {
		let result: FolderDto = await this.folderService.updateFolder(input);
		if (!!result) {
			this.resourseSelect.foldersInside = this.resourseSelect.foldersInside!.map((x: FolderDto) => {
				if (x.fo_id === input.fo_id) x = result;
				return x;
			});
			return Promise.resolve<FolderDto>(<any>result);
		}
		return Promise.resolve<FolderDto>(<any>null);
	}
	@action
	async markerFolder(item: FolderDto) {
		if (!item || !item.fo_id) {
			return false;
		}
		let result: FolderDto = await this.folderService.markerFolder(item.fo_id);
		if (!!result) {
			this.resourseSelect.foldersInside = this.resourseSelect.foldersInside!.map((x: FolderDto) => {
				if (x.fo_id === item.fo_id) x = result;
				return x;
			});
			return Promise.resolve<FolderDto>(<any>result);
		}
		return Promise.resolve<FolderDto>(<any>null);
	}

	@action
	async changeParentFolder(input: ChangeParentFolderInput) {
		let result: FolderDto = await this.folderService.changeParentFolder(input);
		if (!!result) {
			if (this.resourseSelect.fo_id != result.fo_id_parent) {
				let indexDelete = this.resourseSelect.foldersInside!.findIndex(a => a.fo_id == result.fo_id);
				if (indexDelete >= 0) {
					this.resourseSelect.foldersInside!.splice(indexDelete, 1);
				}
			}
			return Promise.resolve<FolderDto>(<any>result);
		}
		return Promise.resolve<FolderDto>(<any>null);
	}
	@action
	async changeTypeFolder(input: ChangeTypeFolderInput) {
		let result: FolderDto = await this.folderService.changeTypeFolder(input);
		if (!!result) {
			this.resourseSelect.foldersInside = this.resourseSelect.foldersInside!.map((x: FolderDto) => {
				if (x.fo_id === input.fo_id) x = result;
				return x;
			});
			return Promise.resolve<FolderDto>(<any>result);
		}
		return Promise.resolve<FolderDto>(<any>null);
	}

	@action
	public deleteFolder = async (item: FolderDto) => {
		if (!item || !item.fo_id) {
			return false;
		}
		let result = await this.folderService.delete(item.fo_id);
		if (!!result) {
			let indexDelete = this.resourseSelect.foldersInside!.findIndex(a => a.fo_id == item.fo_id);
			if (indexDelete >= 0) {
				this.resourseSelect.foldersInside!.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	@action
	public createFilesOfUser = async (fo_id: number | undefined, filePayload: FileParameter | undefined) => {
		if (filePayload == undefined || filePayload == null) {
			return Promise.resolve<FilesOfUserDto>(<any>null);
		}
		let result: FilesOfUserDto = await this.filesOfUserService.createFilesOfUser(fo_id, filePayload);
		if (!!result) {
			this.resourseSelect.filesInside!.push(result);
			return Promise.resolve<FilesOfUserDto>(<any>result);
		}
		return Promise.resolve<FilesOfUserDto>(<any>null);
	}
	@action
	updateFilesOfUser = async (input: UpdateFilesOfUserInput) => {
		let result: FilesOfUserDto = await this.filesOfUserService.updateFilesOfUser(input);
		if (!!result) {
			this.resourseSelect.filesInside = this.resourseSelect.filesInside!.map((x: FilesOfUserDto) => {
				if (x.fi_us_id === input.fi_us_id) x = result;
				return x;
			});
			return Promise.resolve<FilesOfUserDto>(<any>result);
		}
		return Promise.resolve<FilesOfUserDto>(<any>null);
	}

	@action
	markerFile = async (item: FilesOfUserDto) => {
		if (!item || !item.fi_us_id) {
			return false;
		}
		let result: FilesOfUserDto = await this.filesOfUserService.markerFile(item.fi_us_id);
		if (!!result) {
			this.resourseSelect.filesInside = this.resourseSelect.filesInside!.map((x: FilesOfUserDto) => {
				if (x.fi_us_id === item.fi_us_id) x = result;
				return x;
			});
			return Promise.resolve<FilesOfUserDto>(<any>result);
		}
		return Promise.resolve<FilesOfUserDto>(<any>null);
	}

	@action
	changeParentFileOfUser = async (input: ChangeParentFileOfUserInput) => {
		if (input == undefined || input.fi_us_id == undefined) {
			return Promise.resolve<FilesOfUserDto>(<any>null);
		}
		let result: FilesOfUserDto = await this.filesOfUserService.changeParentFileOfUser(input);
		if (!!result) {
			if (this.resourseSelect.fo_id != result.fo_id) {
				let indexDelete = this.resourseSelect.filesInside!.findIndex(a => a.fi_us_id == result.fi_us_id);
				if (indexDelete >= 0) {
					this.resourseSelect.filesInside!.splice(indexDelete, 1);
				}
			}
			return Promise.resolve<FilesOfUserDto>(<any>result);
		}
		return Promise.resolve<FilesOfUserDto>(<any>null);
	}
	@action
	changeTypeFileOfUser = async (input: ChangeTypeFileOfUserInput) => {
		if (input == undefined || input.fi_us_id == undefined) {
			return Promise.resolve<FilesOfUserDto>(<any>null);
		}
		let result: FilesOfUserDto = await this.filesOfUserService.changeTypeFileOfUser(input);
		if (!!result) {
			this.resourseSelect.filesInside = this.resourseSelect.filesInside!.map((x: FilesOfUserDto) => {
				if (x.fi_us_id === input.fi_us_id) x = result;
				return x;
			});
			return Promise.resolve<FilesOfUserDto>(<any>result);
		}
		return Promise.resolve<FilesOfUserDto>(<any>null);
	}

	@action
	public deleteFilesOfUser = async (item: FilesOfUserDto) => {
		if (!item || !item.fi_us_id) {
			return false;
		}
		let result = await this.filesOfUserService.delete(item.fi_us_id);
		if (!!result) {
			let indexDelete = this.resourseSelect.filesInside!.findIndex(a => a.fi_us_id == item.fi_us_id);
			if (indexDelete >= 0) {
				this.resourseSelect.filesInside!.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	private async makeTree(list: FolderDto[]) {
		let parent_degree1 = list.find(item => item.fo_id == -1);
		if (parent_degree1 == undefined) {
			parent_degree1 = new FolderDto();
			parent_degree1.fo_id = -1;
			parent_degree1.fo_name = "Thư mục gốc"
		}
		let folderParent: TreeFolderDto = new TreeFolderDto(parent_degree1);
		await this.createFolderTree(folderParent, list);
		return folderParent;
	}
	private createFolderTree(folderParent: TreeFolderDto, list: FolderDto[]) {
		if (folderParent === undefined) {
			return;
		}
		let listChild = list.filter(item => item.fo_id_parent == folderParent.fo_id);
		for (let i = 0; i < listChild.length; i += 1) {
			let item = listChild[i];
			let roots: TreeFolderDto = new TreeFolderDto(item);
			this.createFolderTree(roots, list);
			folderParent.children.push(roots);
		}
	}
}

export default ResourseStore;