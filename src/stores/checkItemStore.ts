import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	CheckItemDto, CheckItemService, CheckItemStatus, CreateCheckItemInput, DocumentInforDto, UpdateCheckItemInput,

} from '@services/services_autogen';
import { eDocumentItemStatus } from '@src/lib/enumconst';

class CheckItemStore {
	private checkItemService: CheckItemService;

	@observable totalCheckItem: number = 0;
	@observable checkItemListResult: CheckItemDto[] = [];

	constructor() {
		this.checkItemService = new CheckItemService("", http);
	}

	@action
	public createCheckItem = async (input: CreateCheckItemInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<CheckItemDto>(<any>null);
		}
		let result: CheckItemDto = await this.checkItemService.createCheckItem(input);
		if (!!result) {
			this.checkItemListResult.push(result);
			return Promise.resolve<CheckItemDto>(<any>result);
		}

		return Promise.resolve<CheckItemDto>(<any>null);
	}

	@action
	async updateCheckItem(input: UpdateCheckItemInput) {
		let result: CheckItemDto = await this.checkItemService.updateCheckItem(input);
		if (!!result) {
			this.checkItemListResult = this.checkItemListResult.map((x: CheckItemDto) => {
				if (x.ck_it_id === input.ck_it_id) x = result;
				return x;
			});
			return Promise.resolve<CheckItemDto>(<any>result);
		}
		return Promise.resolve<CheckItemDto>(<any>null);
	}

	@action
	async updateListCheckItem(ck_it_id: number, documentInfor: DocumentInforDto) {
		if (!!ck_it_id) {
			this.checkItemListResult = this.checkItemListResult.map((x: CheckItemDto) => {
				if (x.ck_it_id === ck_it_id) {
					documentInfor.do_in_status == eDocumentItemStatus.Valid.num && x.do_in_id_valid!.push(documentInfor.do_in_id);
					documentInfor.do_in_status == eDocumentItemStatus.Borrow.num && x.do_in_id_borrow!.push(documentInfor.do_in_id);
					documentInfor.do_in_status == eDocumentItemStatus.Broken.num && x.do_in_id_invalid!.push(documentInfor.do_in_id);
					documentInfor.do_in_status == eDocumentItemStatus.Lost.num && x.do_in_id_lost!.push(documentInfor.do_in_id);
				};
				return x;
			});
			return true;
		}
		return false;
	}

	@action
	public createListCheckItem = async (input: CreateCheckItemInput[] | undefined) => {
		if (input == undefined || input == null) {
			return Promise.resolve<CheckItemDto>(<any>null);
		}
		let result: CheckItemDto[] = await this.checkItemService.createListCheckItem(input);
		if (!!result) {
			return Promise.resolve<CheckItemDto>(<any>result);
		}

		return Promise.resolve<CheckItemDto>(<any>null);
	}

	@action
	public getAll = async (ck_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.checkItemListResult = [];
		let result = await this.checkItemService.getAll(ck_id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalCheckItem = result.totalCount;
			this.checkItemListResult = result.items;
		}
	}
	@action
	public deleteCheckItem = async (item: CheckItemDto) => {
		if (!item || !item.ck_it_id) {
			return false;
		}
		let result = await this.checkItemService.delete(item.ck_it_id);
		if (!!result) {
			let indexDelete = this.checkItemListResult.findIndex(a => a.ck_it_id == item.ck_it_id);
			if (indexDelete >= 0) {
				this.checkItemListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

}

export default CheckItemStore;
