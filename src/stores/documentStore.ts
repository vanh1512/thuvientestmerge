import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	DocumentDto, CreateDocumentInput, DocumentService, UpdateDocumentInput, SORT, ImportDocumentInput,

} from '@services/services_autogen';

class DocumentStore {
	private documentService: DocumentService;

	@observable totaldocument: number = 0;
	@observable documentListResult: DocumentDto[] = [];

	constructor() {
		this.documentService = new DocumentService("", http);
	}

	@action
	public createdocument = async (input: CreateDocumentInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<DocumentDto>(<any>null);
		}
		let result: DocumentDto = await this.documentService.createDocument(input);
		if (!!result) {
			this.documentListResult.unshift(result);
			return Promise.resolve<DocumentDto>(<any>result);
		}
		return Promise.resolve<DocumentDto>(<any>null);
	}
	@action
	public importDocuments = async (input: ImportDocumentInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<DocumentDto>(<any>null);
		}
		await this.documentService.importDocuments(input);
	}
	@action
	async updatedocument(input: UpdateDocumentInput) {
		let result: DocumentDto = await this.documentService.updateDocument(input);
		if (!!result) {
			this.documentListResult = this.documentListResult.map((x: DocumentDto) => {
				if (x.do_id === input.do_id) x = result;
				return x;
			});
			return Promise.resolve<DocumentDto>(<any>result);
		}
		return Promise.resolve<DocumentDto>(<any>null);
	}

	@action
	public deleteDocument = async (item: DocumentDto) => {
		if (!item || !item.do_id) {
			return false;
		}
		let result = await this.documentService.delete(item.do_id);
		if (!!result) {
			let indexDelete = this.documentListResult.findIndex(a => a.do_id == item.do_id);
			if (indexDelete >= 0) {
				this.documentListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}



	@action
	public getAll = async (do_title: string | undefined, do_date_publish: string | undefined, do_identifier: string | undefined, to_id: number | undefined, ca_id: number | undefined, author: string | undefined, do_status: number | undefined, do_borrow_status: number | undefined, do_date_available: Date | undefined, fieldSort: string | undefined, sort: SORT | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.documentListResult = [];
		let result = await this.documentService.getAll(do_title, do_date_publish, do_identifier, to_id, ca_id, author, do_status, do_borrow_status, do_date_available, fieldSort, sort, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.documentListResult = [];
			this.totaldocument = result.totalCount;
			for (let item of result.items) {
				this.documentListResult.push(item);
			}
			return result.items;
		}
		return [];
	}
	@action
	public getNameDocument = async (do_id: number | undefined) => {
		if (do_id != undefined) {
			const res = this.documentListResult.find(item => item.do_id == do_id)
			if (res != undefined) {
				return res.do_title;
			}
			return "";
		}
		return null;
	}
	@action
	public deleteMulti = async (do_id: number[]| undefined) => {
		if(do_id != undefined)
		{
			await this.documentService.deleteMulti(do_id);
		}
		return null;
	}
}

export default DocumentStore;
