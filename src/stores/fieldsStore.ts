import { action, observable } from 'mobx';
import http from '@services/httpService';
import { FieldsDto, CreateFieldsInput, FieldsService, UpdatePositionFieldInput, UpdateFieldsInput } from '@services/services_autogen';

class FieldsStore {
	private fieldsService: FieldsService;
	@observable totalFields: number = 0;
	@observable fieldsListResult: FieldsDto[] = [];

	constructor() {
		this.fieldsService = new FieldsService("", http);
	}

	// @action
	// public createFields = async (input: CreateFieldsInput) => {
	// 	if (input == undefined || input == null) {
	// 		return Promise.resolve<FieldsDto>(<any>null);
	// 	}
	// 	let result: FieldsDto = await this.fieldsService.createFields(input);
	// 	if (!!result) {
	// 		this.fieldsListResult.push(result);
	// 		return Promise.resolve<FieldsDto>(<any>result);
	// 	}
	// 	return Promise.resolve<FieldsDto>(<any>null);
	// }
	@action
	public createListField = async (input: CreateFieldsInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<FieldsDto>(<any>null);
		}
		let result: FieldsDto[] = await this.fieldsService.createListField(input);
		if (!!result) {
			this.fieldsListResult = result;
			return Promise.resolve<FieldsDto>(<any>result);
		}
		return Promise.resolve<FieldsDto>(<any>null);
	}

	@action
	public deleteFields = async (item: FieldsDto) => {
		if (!item || !item.fie_id) {
			return false;
		}
		let result = await this.fieldsService.delete(item.fie_id);
		if (!!result) {
			let indexDelete = this.fieldsListResult.findIndex(a => a.fie_id == item.fie_id);
			if (indexDelete >= 0) {
				this.fieldsListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	@action
	changePotistion = async (input: UpdatePositionFieldInput) => {
		let result = await this.fieldsService.changePosition(input);
		if (result) {
			return true;
		}
		return false;
	}
	@action
	changePotistiontesst = async (input: UpdatePositionFieldInput) => {
		let result = await this.fieldsService.changePosition(input);
		if (result) {
			return true;
		}
		return false;
	}
	@action
	async deleteMulti(number: number[]) {
		let result = await this.fieldsService.deleteMulti(number);
		if (result.result == true) {
			return true;
		}
		return false;
	}
	@action
	async deleteAll() {
		await this.fieldsService.deleteAll();
	}
	@action
	async deletetest() {
		await this.fieldsService.deleteAll();
	}
	@action
	public getAll = async (fie_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.fieldsListResult = [];
		let result = await this.fieldsService.getAll(fie_search, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.fieldsListResult = [];
			this.totalFields = result.totalCount;
			for (let item of result.items) {
				this.fieldsListResult.push(item);
			}
			this.fieldsListResult = this.fieldsListResult.slice().sort((a, b) => a.fie_sort - b.fie_sort);
		}
	}
	@action
	async updateFields(body: UpdateFieldsInput) {
		let result = await this.fieldsService.update(body);
		if (!!result) {
			this.fieldsListResult = this.fieldsListResult.map((x: FieldsDto) => {
				if (body != undefined)
					if (x.fie_id === body.fie_id) x = result;
				return x;
			});
			return Promise.resolve<FieldsDto>(<any>result);
		}
		return Promise.resolve<FieldsDto>(<any>null);

	}
}

export default FieldsStore;
