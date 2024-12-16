import { action, observable } from 'mobx';
import http from '@services/httpService';
import { CreateMarc21Input, Marc21Dto, Marc21Service, UpdateMarc21Input } from '@services/services_autogen';

class Marc21Store {
	private marc21Service: Marc21Service;

	@observable totalMarc21: number = 0;
	@observable marc21ListResult: Marc21Dto[] = [];

	constructor() {
		this.marc21Service = new Marc21Service("", http);
	}

	@action
	public createMarc21 = async (input: CreateMarc21Input) => {
		if (input == undefined || input == null) {
			return Promise.resolve<Marc21Dto>(<any>null);
		}
		let result: Marc21Dto = await this.marc21Service.createMarc21(input);
		if (!!result) {
			this.marc21ListResult.unshift(result);
			return Promise.resolve<Marc21Dto>(<any>result);
		}
		return Promise.resolve<Marc21Dto>(<any>null);
	}
	@action
	public createListMarc21 = async (input: CreateMarc21Input[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<Marc21Dto>(<any>null);
		}
		let result: Marc21Dto[] = await this.marc21Service.createListMarc21(input);
		if (!!result) {
			this.marc21ListResult = result;
			return Promise.resolve<Marc21Dto>(<any>result);
		}
		return Promise.resolve<Marc21Dto>(<any>null);
	}

	@action
	async updateMarc21(input: UpdateMarc21Input) {
		let result: Marc21Dto = await this.marc21Service.updateMarc21(input);
		if (!!result) {
			this.marc21ListResult = this.marc21ListResult.map((x: Marc21Dto) => {
				if (x.mar_id === input.mar_id) x = result;
				return x;
			});
			return Promise.resolve<Marc21Dto>(<any>result);
		}
		return Promise.resolve<Marc21Dto>(<any>null);
	}

	@action
	public deleteMarc21 = async (item: Marc21Dto) => {
		if (!item || !item.mar_id) {
			return false;
		}
		let result = await this.marc21Service.delete(item.mar_id);
		if (!!result) {
			let indexDelete = this.marc21ListResult.findIndex(a => a.mar_id == item.mar_id);
			if (indexDelete >= 0) {
				this.marc21ListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	@action
	async deleteMulti(number: number[]) {
		let result = await this.marc21Service.deleteMulti(number);
		if (result.result == true) {
			return true;
		}
		return false;
	}
	@action
	public deleteAll = async () => {
		await this.marc21Service.deleteAll();
	}

	@action
	public getAll = async (mar_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.marc21ListResult = [];
		this.totalMarc21 = 0;
		let result = await this.marc21Service.getAll(mar_search, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.marc21ListResult = result.items!;
			this.totalMarc21 = result.totalCount;
		}
		return this.marc21ListResult;
	}



}

export default Marc21Store;
