import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	FileDocumentDto, FileDocumentService, FileParameter,

} from '@services/services_autogen';

class FileDocumentStore {
	private fileDocumentService: FileDocumentService;

	@observable totalFileDocument: number = 0;
	@observable fileDocumentListResult: FileDocumentDto[] = [];

	constructor() {
		this.fileDocumentService = new FileDocumentService("", http);
	}

	@action
	public createFileDocument = async (do_id: number | undefined, fi_do_desc: string | undefined, isDownload: boolean | undefined, filePayload: FileParameter | undefined) => {
		if (filePayload == undefined || filePayload == null) {
			return Promise.resolve<FileDocumentDto>(<any>null);
		}
		let result: FileDocumentDto = await this.fileDocumentService.createFileDocument(do_id, fi_do_desc, isDownload, filePayload);
		if (!!result) {
			this.fileDocumentListResult.unshift(result);
			return Promise.resolve<FileDocumentDto>(<any>result);
		}
		return Promise.resolve<FileDocumentDto>(<any>null);
	}

	@action
	async updateFileDocument(fi_do_id: number | undefined, do_id: number | undefined, fi_do_desc: string | undefined, isDownload: boolean | undefined, filePayload: FileParameter | undefined) {
		if (filePayload == undefined || filePayload == null) {
			return Promise.resolve<FileDocumentDto>(<any>null);
		}
		let result: FileDocumentDto = await this.fileDocumentService.updateFileDocument(fi_do_id, do_id, fi_do_desc, isDownload, filePayload);
		if (!!result) {
			this.fileDocumentListResult = this.fileDocumentListResult.map((x: FileDocumentDto) => {
				if (x.fi_do_id === fi_do_id) x = result;
				return x;
			});
			return Promise.resolve<FileDocumentDto>(<any>result);
		}
		return Promise.resolve<FileDocumentDto>(<any>null);
	}

	@action
	public deleteFileDocument = async (fi_do_id: number | undefined) => {
		if (!fi_do_id) {
			return false;
		}
		let result = await this.fileDocumentService.delete(fi_do_id);
		if (!!result) {
			let indexDelete = this.fileDocumentListResult.findIndex(a => a.fi_do_id == fi_do_id);
			if (indexDelete >= 0) {
				this.fileDocumentListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async (fi_do_name: string | undefined, do_title: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.fileDocumentListResult = [];
		let result = await this.fileDocumentService.getAll(fi_do_name, do_title, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.fileDocumentListResult = [];
			this.totalFileDocument = result.totalCount;
			for (let item of result.items) {
				this.fileDocumentListResult.push(item);
			}
		}
	}

}

export default FileDocumentStore;
