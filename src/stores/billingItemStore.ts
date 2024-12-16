import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	BillingItemDto, BillingItemService, CreateBillingItemInput, UpdateBillingItemInput,

} from '@services/services_autogen';

class BillingItemStore {
	private billingItemService: BillingItemService;

	@observable totalBillItem: number = 0;
	@observable billingItemListResult: BillingItemDto[] = [];

	constructor() {
		this.billingItemService = new BillingItemService("", http);
	}

	@action
	public createBillingItem = async (input: CreateBillingItemInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<BillingItemDto>(<any>null);
		}
		let result: BillingItemDto = await this.billingItemService.createBillingItem(input);
		if (!!result) {
			this.billingItemListResult.push(result);
			return Promise.resolve<BillingItemDto>(<any>result);
		}
		return Promise.resolve<BillingItemDto>(<any>null);
	}

	@action
	async updateBillingItem(input: UpdateBillingItemInput) {
		let result: BillingItemDto = await this.billingItemService.updateBillingItem(input);
		if (!!result) {
			this.billingItemListResult = this.billingItemListResult.map((x: BillingItemDto) => {
				if (x.bi_it_id === input.bi_it_id) x = result;
				return x;
			});
			return Promise.resolve<BillingItemDto>(<any>result);
		}
		return Promise.resolve<BillingItemDto>(<any>null);
	}
	@action
	public deleteBillingItem = async (id: number | undefined,) => {

		let result = await this.billingItemService.delete(id);
		if (!!result) {
			let indexDelete = this.billingItemListResult.findIndex(a => a.bi_it_id == id);
			if (indexDelete >= 0) {
				this.billingItemListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	@action
	public getAll = async (bi_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.billingItemListResult = [];
		this.totalBillItem = 0;
		let result = await this.billingItemService.getAll(bi_id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalBillItem = result.totalCount;
			for (let item of result.items) {
				this.billingItemListResult.push(item);
			}
		}
		return this.billingItemListResult;
	}
	@action
	public getByListId = async (input: number[] | undefined) => {
		let result = await this.billingItemService.getByListId(input);
		if (result != undefined && result.items != undefined && result.items != null) {
			return result.items
		}
		return [];
	}
	@action
	public checkPlanDetailHasBilling = async (pl_de_id: number | undefined, bi_id: number | undefined,) => {
		let result = await this.billingItemService.checkPlanDetailHasBilling(pl_de_id, bi_id);
		if (!!result && result.bi_it_id > 0) {
			return Promise.resolve<BillingItemDto>(<any>result);
		}
		return Promise.resolve<BillingItemDto>(<any>new BillingItemDto());
	}

}

export default BillingItemStore;
