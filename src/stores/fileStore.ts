import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	FilesService, FileParameter, FilesDto
} from '@services/services_autogen';
import { FileUploadType } from '@src/lib/appconst';
export class FileStore {
	private fileService: FilesService;
	filesListResult: FilesDto[] = [];
	totalFile: number = 0;
	constructor() {
		this.fileService = new FilesService("", http);
	}


	@action
	public createFile = async (fileType: number | undefined, filePayload: FileParameter | undefined) => {
		if (filePayload == undefined || filePayload == null) {
			return Promise.resolve<FilesDto>(<any>null);
		}
		let result: FilesDto = await this.fileService.createFiles(fileType, filePayload);
		if (!!result) {
			this.filesListResult.unshift(result);
			return Promise.resolve<FilesDto>(<any>result);
		}
		return Promise.resolve<FilesDto>(<any>null);
	}

	@action
	public deleteFile = async (fi_id: number | undefined) => {
		await this.fileService.delete(fi_id);
	}

	@action
	public getAll = async (fi_do_name: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.filesListResult = [];
		let result = await this.fileService.getAll(fi_do_name, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.filesListResult = [];
			this.totalFile = result.totalCount;
			for (let item of result.items) {
				this.filesListResult.push(item);
			}
		}
	}


}


export default FileStore;