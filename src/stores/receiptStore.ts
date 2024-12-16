import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	ReceiptDto, ReceiptService, CreateReceiptInput, UpdateReceiptInput, ReceiptStatus,

} from '@services/services_autogen';

class ReceiptStore {
	private receiptService: ReceiptService;

	@observable totalReceipt: number = 0;
	@observable receiptListResult: ReceiptDto[] = [];

	constructor() {
		this.receiptService = new ReceiptService("", http);
	}

	@action
	public createReceipt = async (input: CreateReceiptInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<ReceiptDto>(<any>null);
		}
		let result: ReceiptDto = await this.receiptService.createReceipt(input);
		if (!!result) {
			this.receiptListResult.unshift(result);
			return Promise.resolve<ReceiptDto>(<any>result);
		}
		return Promise.resolve<ReceiptDto>(<any>null);
	}

	@action
	async updateReceipt(input: UpdateReceiptInput) {
		let result: ReceiptDto = await this.receiptService.updateReceipt(input);
		if (!!result) {
			this.receiptListResult = this.receiptListResult.map((x: ReceiptDto) => {
				if (x.rec_id === input.rec_id) x = result;
				return x;
			});
			return Promise.resolve<ReceiptDto>(<any>result);
		}
		return Promise.resolve<ReceiptDto>(<any>null);
	}

	@action
	async catalogingReceipt(rec_id: number) {
		if (rec_id == undefined) {
			return false;
		}
		let result = await this.receiptService.catalogingReceipt(rec_id);
		if (!!result) {
			return true;
		}
		return false;
	}

	@action
	public deleteReceipt = async (item: ReceiptDto) => {
		if (!item || !item.rec_id) {
			return false;
		}
		let result = await this.receiptService.delete(item.rec_id);
		if (!!result) {
			let indexDelete = this.receiptListResult.findIndex(a => a.rec_id == item.rec_id);
			if (indexDelete >= 0) {
				this.receiptListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async (rec_code: string | undefined, co_id: number | undefined, us_id_browser: number | undefined, rec_status: ReceiptStatus | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.receiptListResult = [];
		let result = await this.receiptService.getAll(rec_code, co_id, us_id_browser, rec_status, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.receiptListResult = [];
			this.totalReceipt = result.totalCount;
			for (let item of result.items) {
				this.receiptListResult.push(item);
			}
		}
	}

}

export default ReceiptStore;
