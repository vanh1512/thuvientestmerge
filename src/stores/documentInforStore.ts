import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	DocumentInforDto, CreateDocumentInforInput, DocumentInforService, UpdateDocumentInforInput, DocumentItemStatus, ChangeStatusDocumentInforCheckInput,

} from '@services/services_autogen';

class DocumentInforStore {
	private documentInforService: DocumentInforService;

	@observable totalDocumentInfor: number = 0;
	@observable documentInforListResult: DocumentInforDto[] = [];

	constructor() {
		this.documentInforService = new DocumentInforService("", http);
	}

	@action
	public createDocumentInfor = async (input: CreateDocumentInforInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<DocumentInforDto>(<any>null);
		}
		let result: DocumentInforDto = await this.documentInforService.createDocumentInfor(input);
		if (!!result) {
			this.documentInforListResult.push(result);
			return Promise.resolve<DocumentInforDto>(<any>result);
		}
		return Promise.resolve<DocumentInforDto>(<any>null);
	}

	@action
	async updateDocumentInfor(input: UpdateDocumentInforInput) {
		let result: DocumentInforDto = await this.documentInforService.updateDocumentInfor(input);
		if (!!result) {
			this.documentInforListResult = this.documentInforListResult.map((x: DocumentInforDto) => {
				if (x.do_in_id === input.do_in_id) x = result;
				return x;
			});
			return Promise.resolve<DocumentInforDto>(<any>result);
		}
		return Promise.resolve<DocumentInforDto>(<any>null);
	}

	@action
	public deleteDocumentInfor = async (item: DocumentInforDto) => {
		if (!item || !item.do_in_id) {
			return false;
		}
		let result = await this.documentInforService.delete(item.do_in_id);
		if (!!result) {
			let indexDelete = this.documentInforListResult.findIndex(a => a.do_in_id == item.do_in_id);
			if (indexDelete >= 0) {
				this.documentInforListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async (do_id: number | undefined, do_title: string | undefined, do_in_isbn: string | undefined, dkcb_code: string | undefined, do_in_status: DocumentItemStatus | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.documentInforListResult = [];
		this.totalDocumentInfor = 0;

		let result = await this.documentInforService.getAll(do_id, do_title, do_in_isbn, dkcb_code, do_in_status, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalDocumentInfor = result.totalCount;
			this.documentInforListResult = result.items!;
		}

		return this.documentInforListResult;
	}
	@action
	public getAllByIdArr = async (do_in_id: number[] | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		let result = await this.documentInforService.getAllByIdArr(do_in_id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			return result.items!;
		}
		return [];
	}
	@action
	public createListDocumentInfor = async (input: CreateDocumentInforInput[] | undefined) => {
		if (input == undefined || input == null) {
			return Promise.resolve<DocumentInforDto>(<any>[]);
		}
		let result: DocumentInforDto[] = await this.documentInforService.createListDocumentInfor(input);
		if (!!result) {
			return Promise.resolve<DocumentInforDto[]>(<any>result);
		}
		return Promise.resolve<DocumentInforDto>(<any>[]);
	}
	@action
	public changeStatusDocumentInforCheck = async (input: ChangeStatusDocumentInforCheckInput | undefined) => {
		if (input == undefined || input == null) {
			return Promise.resolve<DocumentInforDto>(<any>null);
		}
		let result: DocumentInforDto = await this.documentInforService.changeStatusDocumentInforCheck(input);
		if (!!result) {
			return Promise.resolve<DocumentInforDto>(<any>result);
		}
		return Promise.resolve<DocumentInforDto>(<any>null);
	}
	@action
	public getDocumentInforForISBN = async (do_in_isbn: string | undefined,) => {
		if (do_in_isbn == undefined || do_in_isbn == null) {
			return Promise.resolve<DocumentInforDto>(<any>null);
		}
		let result: DocumentInforDto = await this.documentInforService.getDocumentInforForISBN(do_in_isbn);
		if (!!result) {
			return Promise.resolve<DocumentInforDto>(<any>result);
		}
		return Promise.resolve<DocumentInforDto>(<any>null);
	}
}

export default DocumentInforStore;
