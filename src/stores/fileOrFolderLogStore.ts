import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	FileOrFolderLogDto, FileOrFolderLogService
} from '@services/services_autogen';
export class FileOrFolderLogStore {
	private fileOrFolderLogDto: FileOrFolderLogService;

	@observable totalFolderLog: number = 0;
	@observable fileOrFolderLogListResult: FileOrFolderLogDto[] = [];

	constructor() {
		this.fileOrFolderLogDto = new FileOrFolderLogService("", http);
	}

	@action
	public async getAll(fi_fo_id: number | undefined, fi_fo_is_file: boolean | undefined, skipCount: number | undefined, maxResultCount: number | undefined) {
		this.fileOrFolderLogListResult = [];
		let result = await this.fileOrFolderLogDto.getAll(fi_fo_id, fi_fo_is_file, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.fileOrFolderLogListResult = [];
			this.totalFolderLog = result.totalCount;
			for (let item of result.items) {
				this.fileOrFolderLogListResult.push(item);
			}
		}
	}

}


export default FileOrFolderLogStore;