import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	LanguagesService, CreateLanguagesInput, UpdateLanguagesInput, LanguagesDto,

} from '@services/services_autogen';

class LanguagesStore {
	private languagesService: LanguagesService;
	
	@observable totalLanguages: number = 0;
	@observable languagesListResult: LanguagesDto[] = [];
	constructor() {
		this.languagesService = new LanguagesService("", http);
	}

	@action
	public createLanguages = async (input: CreateLanguagesInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<LanguagesDto>(<any>null);
		}
		let result: LanguagesDto = await this.languagesService.create(input);
		if (!!result) {
			this.languagesListResult.unshift(result);
			return Promise.resolve<LanguagesDto>(<any>result);
		}
		return Promise.resolve<LanguagesDto>(<any>null);
	}
	@action
	public createListLanguages = async (input: CreateLanguagesInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<LanguagesDto>(<any>null);
		}
		let result: LanguagesDto[] = await this.languagesService.createListLanguages(input);
		if (!!result) {
			this.languagesListResult = result;
			return Promise.resolve<LanguagesDto>(<any>result);
		}
		return Promise.resolve<LanguagesDto>(<any>null);
	}

	@action
	async updateLanguages(input: UpdateLanguagesInput) {
		let result: LanguagesDto = await this.languagesService.update(input);
		if (!!result) {
			this.languagesListResult = this.languagesListResult.map((x: LanguagesDto) => {
				if (x.la_id === input.la_id) x = result;
				return x;
			});
			return Promise.resolve<LanguagesDto>(<any>result);
		}
		return Promise.resolve<LanguagesDto>(<any>null);
	}


	@action
	public getAll = async (la_title: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined ) => {
		this.languagesListResult = [];
		this.totalLanguages = 0;
		let result = await this.languagesService.getAll(la_title,skipCount,maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null) {
			this.languagesListResult = result.items!;
			this.totalLanguages = this.languagesListResult.length;
		}
	}
	@action
	public deleteLanguages = async (item: LanguagesDto) => {
		if (!item || !item.la_id) {
			return false;
		}
		let result = await this.languagesService.delete(item.la_id);
		if (!!result) {
			let indexDelete = this.languagesListResult.findIndex(a => a.la_id == item.la_id);
			if (indexDelete >= 0) {
				this.languagesListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	public deleteAll = async ()=>{
		await this.languagesService.deleteAll(); 
	}
	@action
	async deleteMulti(number: number[]) {
		let result = await this.languagesService.deleteMulti(number);
		if (result.result == true) {
			return true;
		}
		return false;
	}

}

export default LanguagesStore;
