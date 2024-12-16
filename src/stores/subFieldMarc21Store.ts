import { action, observable } from 'mobx';
import http from '@services/httpService';

import { CreateSubFieldMarc21Input, CreateSubFieldWithCodeMarc21Input, SubFieldMarc21Dto, SubFieldMarc21Service, UpdateSubFieldMarc21Input } from '@services/services_autogen';

class SubFieldMarc21Store {
	private subFieldMarc21Service: SubFieldMarc21Service;

	@observable totalSubFieldMarc21: number = 0;
	@observable subFieldMarc21ListResult: SubFieldMarc21Dto[] = [];

	constructor() {
		this.subFieldMarc21Service = new SubFieldMarc21Service("", http);
	}

	@action
	public createSubFieldMarc21 = async (input: CreateSubFieldMarc21Input) => {
		if (input == undefined || input == null) {
			return Promise.resolve<SubFieldMarc21Dto>(<any>null);
		}
		let result: SubFieldMarc21Dto = await this.subFieldMarc21Service.createSubFieldMarc21(input);
		if (!!result) {
			this.subFieldMarc21ListResult.unshift(result);
			return Promise.resolve<SubFieldMarc21Dto>(<any>result);
		}
		return Promise.resolve<SubFieldMarc21Dto>(<any>null);
	}
	@action
	public createListSubFieldMarc21 = async (input: CreateSubFieldWithCodeMarc21Input[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<SubFieldMarc21Dto>(<any>null);
		}
		let result: SubFieldMarc21Dto[] = await this.subFieldMarc21Service.createListSubFieldMarc21(input);
		if (!!result) {
			this.subFieldMarc21ListResult = result;
			return Promise.resolve<SubFieldMarc21Dto>(<any>result);
		}
		return Promise.resolve<SubFieldMarc21Dto>(<any>null);
	}

	@action
	async updateSubFieldMarc21(input: UpdateSubFieldMarc21Input) {
		let result: SubFieldMarc21Dto = await this.subFieldMarc21Service.updateSubFieldMarc21(input);
		if (!!result) {
			this.subFieldMarc21ListResult = this.subFieldMarc21ListResult.map((x: SubFieldMarc21Dto) => {
				if (x.sub_id === input.sub_id) x = result;
				return x;
			});
			return Promise.resolve<SubFieldMarc21Dto>(<any>result);
		}
		return Promise.resolve<SubFieldMarc21Dto>(<any>null);
	}

	@action
	public deleteSubFieldMarc21 = async (id: number) => {
		if (!id) {
			return false;
		}
		let result = await this.subFieldMarc21Service.delete(id);
		if (!!result) {
			let indexDelete = this.subFieldMarc21ListResult.findIndex(a => a.sub_id == id);
			if (indexDelete >= 0) {
				this.subFieldMarc21ListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	@action
	async deleteMulti(number: number[]) {
		let result = await this.subFieldMarc21Service.deleteMulti(number);
		if (result.result == true) {
			return true;
		}
		return false;
	}
	@action
	public deleteAll = async () => {
		await this.subFieldMarc21Service.deleteAll();
	}

	@action
	public getAll = async (mar_id: number | undefined, sub_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.subFieldMarc21ListResult = [];
		this.totalSubFieldMarc21 = 0;
		let result = await this.subFieldMarc21Service.getAll(mar_id, sub_search, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.subFieldMarc21ListResult = result.items!;
			this.totalSubFieldMarc21 = result.totalCount;
		}
	}

}

export default SubFieldMarc21Store;
