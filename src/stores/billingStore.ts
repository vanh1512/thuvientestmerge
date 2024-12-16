import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	BillingDto, BillingService, BillStatus, CreateBillingInput, CreatePlanDetailArrInput, UpdateBillingInput,

} from '@services/services_autogen';

class BillingStore {
	private billingService: BillingService;

	@observable totalBill: number = 0;
	@observable billingListResult: BillingDto[] = [];

	constructor() {
		this.billingService = new BillingService("", http);
	}

	@action
	public createBilling = async (input: CreateBillingInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<BillingDto>(<any>null);
		}
		let result: BillingDto = await this.billingService.createBilling(input);
		if (!!result) {
			this.billingListResult.unshift(result);
			return Promise.resolve<BillingDto>(<any>result);
		}
		return Promise.resolve<BillingDto>(<any>null);
	}

	@action
	async updateBilling(input: UpdateBillingInput) {
		let result: BillingDto = await this.billingService.updateBilling(input);
		if (!!result) {
			this.billingListResult = this.billingListResult.map((x: BillingDto) => {
				if (x.bi_id === input.bi_id) x = result;
				return x;
			});
			return Promise.resolve<BillingDto>(<any>result);
		}
		return Promise.resolve<BillingDto>(<any>null);
	}
	@action
	public deleteBilling = async (bi_id: number) => {
		if (!bi_id) {
			return false;
		}
		let result = await this.billingService.delete(bi_id);
		if (!!result) {
			let indexDelete = this.billingListResult.findIndex(a => a.bi_id == bi_id);
			if (indexDelete >= 0) {
				this.billingListResult.splice(indexDelete, 1);
			}

			return true;
		}
	}

	@action
	public getAll = async (bi_code: string | undefined, su_id: number | undefined, co_id: number | undefined, bi_export_from: Date | undefined, bi_export_to: Date | undefined, bi_status: BillStatus | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.billingListResult = [];
		let result = await this.billingService.getAll(bi_code, su_id, co_id, bi_export_from, bi_export_to, bi_status, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.billingListResult = [];
			this.totalBill = result.totalCount;
			for (let item of result.items) {
				this.billingListResult.push(item);
			}
		}
	}
	@action
	public createPlanDetailArrInput = async (body: CreatePlanDetailArrInput | undefined) => {
		let result = await this.billingService.createPlanDetailArrInput(body);
		if (!!result) {
			return Promise.resolve<BillingDto>(<any>result);
		}
		return Promise.resolve<BillingDto>(<any>null);
	}
}

export default BillingStore;
