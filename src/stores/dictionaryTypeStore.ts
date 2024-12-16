import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	DictionaryTypeDto, CreateDictionaryTypeInput, UpdateDictionaryTypeInput, DictionaryTypeService,

} from '@services/services_autogen';

class DictionaryTypeStore {
	private dictionaryTypeService: DictionaryTypeService;

	@observable totalDictionaryType: number = 0;
	@observable dictionaryTypeListResult: DictionaryTypeDto[] = [];

	constructor() {
		this.dictionaryTypeService = new DictionaryTypeService("", http);
	}

	@action
	public create = async (input: CreateDictionaryTypeInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<DictionaryTypeDto>(<any>null);
		}
		let result: DictionaryTypeDto = await this.dictionaryTypeService.create(input);
		if (!!result) {
			this.dictionaryTypeListResult.unshift(result);
			return Promise.resolve<DictionaryTypeDto>(<any>result);
		}
		return Promise.resolve<DictionaryTypeDto>(<any>null);
	}
	@action
	public createList = async (input: CreateDictionaryTypeInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<DictionaryTypeDto>(<any>null);
		}
		let result: DictionaryTypeDto[] = await this.dictionaryTypeService.createList(input);
		if (!!result) {
			this.dictionaryTypeListResult = result;
			return Promise.resolve<DictionaryTypeDto>(<any>result);
		}
		return Promise.resolve<DictionaryTypeDto>(<any>null);
	}
	@action
	async update(input: UpdateDictionaryTypeInput) {
		let result: DictionaryTypeDto = await this.dictionaryTypeService.update(input);
		if (!!result) {
			this.dictionaryTypeListResult = this.dictionaryTypeListResult.map((x: DictionaryTypeDto) => {
				if (x.dic_ty_id === input.dic_ty_id) x = result;
				return x;
			});
			return Promise.resolve<DictionaryTypeDto>(<any>result);
		}
		return Promise.resolve<DictionaryTypeDto>(<any>null);
	}

	@action
	public changeStatus = async (dic_ty_id: number | undefined, is_active: boolean | undefined) => {
		if (dic_ty_id === undefined || dic_ty_id <= 0 || is_active === undefined) {
			return false;
		}
		let resultCheck = await this.dictionaryTypeService.changeStatus(dic_ty_id, is_active);
		if (resultCheck != undefined && resultCheck.result != undefined) {
			return resultCheck.result;
		}
	}
	@action
	public delete = async (item: DictionaryTypeDto) => {
		if (!item || !item.dic_ty_id) {
			return false;
		}
		let result = await this.dictionaryTypeService.delete(item.dic_ty_id);
		if (!!result) {
			let indexDelete = this.dictionaryTypeListResult.findIndex(a => a.dic_ty_id == item.dic_ty_id);
			if (indexDelete >= 0) {
				this.dictionaryTypeListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	@action
	async deleteMulti(number: number[]) {
		let result = await this.dictionaryTypeService.deleteMulti(number);
		if (result.result == true) {
			return true;
		}
		return false;
	}
	async deleteAll() {
		await this.dictionaryTypeService.deleteAll();
	}
	@action
	public getAll = async (dic_ty_name: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.dictionaryTypeListResult = [];
		let result = await this.dictionaryTypeService.getAll(dic_ty_name, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.dictionaryTypeListResult = [];
			this.totalDictionaryType = result.totalCount;
			for (let item of result.items) {
				this.dictionaryTypeListResult.push(item);
			}
		}
	}

}

export default DictionaryTypeStore;
