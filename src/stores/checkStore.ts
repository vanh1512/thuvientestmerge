import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	ChangeProcessCheckInput, CheckDto, CheckProcess, CheckService, CreateCheckInput, DocumentDto, DocumentDtoPagedResultDto, GetDocumentInforByDKCBCheckDto, GetDocumentInforByDKCBDto, UpdateCheckInput,

} from '@services/services_autogen';

class CheckStore {
	private checkService: CheckService;

	@observable totalCheck: number = 0;
	@observable checkListResult: CheckDto[] = [];


	constructor() {
		this.checkService = new CheckService("", http);
	}

	@action
	public createCheck = async (input: CreateCheckInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<CheckDto>(<any>null);
		}
		let result: CheckDto = await this.checkService.createCheck(input);
		if (!!result) {
			this.checkListResult.unshift(result);
			return Promise.resolve<CheckDto>(<any>result);
		}
		return Promise.resolve<CheckDto>(<any>null);
	}

	@action
	async updateCheck(input: UpdateCheckInput) {
		let result: CheckDto = await this.checkService.updateCheck(input);
		if (!!result) {
			this.checkListResult = this.checkListResult.map((x: CheckDto) => {
				if (x.ck_id === input.ck_id) x = result; return x;
			});
			return Promise.resolve<CheckDto>(<any>result);
		}
		return Promise.resolve<CheckDto>(<any>null);
	}

	@action
	public deleteCheck = async (item: CheckDto) => {
		await this.checkService.delete(item.ck_id);
	}
	@action
	public changeProcessOfCheckRoom = async (input: ChangeProcessCheckInput) => {
		if (!input || !input.ck_id) {
			return false;
		}
		if (!!result) {
			this.checkListResult = this.checkListResult.map((x: CheckDto) => {
				if (x.ck_id === input.ck_id) x = result;
				return x;
			});
			return Promise.resolve<CheckDto>(<any>result);
		}
		return Promise.resolve<CheckDto>(<any>null);
	}
	@action
	public waitApprove = async (input: ChangeProcessCheckInput) => {
		if (!input || !input.ck_id) {
			return false;
		}
		let result = await this.checkService.waitApprove(input);
		if (!!result) {
			this.checkListResult = this.checkListResult.map((x: CheckDto) => {
				if (x.ck_id === input.ck_id) x = result;
				return x;
			});
			return Promise.resolve<CheckDto>(<any>result);
		}
		return Promise.resolve<CheckDto>(<any>null);
	}
	@action
	public changeProcessOfManager = async (input: ChangeProcessCheckInput) => {
		if (!input || !input.ck_id) {
			return false;
		}
		let result = await this.checkService.changeProcessOfManager(input);
		if (!!result) {
			this.checkListResult = this.checkListResult.map((x: CheckDto) => {
				if (x.ck_id === input.ck_id) x = result;
				return x;
			});
			return Promise.resolve<CheckDto>(<any>result);
		}
		return Promise.resolve<CheckDto>(<any>null);
	}
	@action
	public changeStatusChecking = async (ck_id: number | undefined) => {
		if (!ck_id) {
			return false;
		}
		let result = await this.checkService.changeStatusChecking(ck_id);
		if (!!result) {
			this.checkListResult = this.checkListResult.map((x: CheckDto) => {
				if (x.ck_id === ck_id) x = result;
				return x;
			});
			return Promise.resolve<CheckDto>(<any>result);
		}
		return Promise.resolve<CheckDto>(<any>null);
	}
	@action
	public changeStatusDone = async (ck_id: number | undefined) => {
		if (!ck_id) {
			return false;
		}
		let result = await this.checkService.changeStatusDone(ck_id);
		if (!!result) {
			this.checkListResult = this.checkListResult.map((x: CheckDto) => {
				if (x.ck_id === ck_id) x = result;
				return x;
			});
			return Promise.resolve<CheckDto>(<any>result);
		}
		return Promise.resolve<CheckDto>(<any>null);
	}

	@action
	public getDocumentWarningAll = async (day: number | undefined, do_total_book_valid: number | undefined, ignore_do_inside_check_plan: boolean | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {

		let result = await this.checkService.getDocumentWarningAll(day, do_total_book_valid, ignore_do_inside_check_plan, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.documentWarningListResult = [];
			this.totalDocumentWarningListResult = result.totalCount;
			for (let item of result.items) {
				this.documentWarningListResult.push(item);
			}
		}
	}

	@action
	public getAll = async (ck_code: string | undefined, ck_start_at: Date | undefined, ck_process: CheckProcess | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.checkListResult = [];
		let result = await this.checkService.getAll(ck_code, ck_start_at, ck_process, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.checkListResult = result.items;
			this.totalCheck = result.totalCount;
		}
	}

	@action
	public getDocumentInforByDKCBInCheck = async (ck_id: number | undefined, dkcb: string | undefined) => {
		const result = await this.checkService.getDocumentInforByDKCBInCheck(ck_id, dkcb);
		if (!!result) {
			return result;
		}
		return Promise.resolve<GetDocumentInforByDKCBCheckDto>(<any>null);
	}

}

export default CheckStore;
