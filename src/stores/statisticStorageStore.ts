import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	StatisticStorageDto, UpdateStatisticStorageInput, CreateStatisticStorageInput, StatisticStorageService, StatisticStorageStatus
} from '@services/services_autogen';
export class StatisticStorageStore {
	private statisticStorageService: StatisticStorageService;

	@observable totalStatisticStorage: number = 0;
	@observable statisticStorageListResult: StatisticStorageDto[] = [];

	constructor() {
		this.statisticStorageService = new StatisticStorageService("", http);
	}

	@action
	public createStatisticStorage = async (input: CreateStatisticStorageInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<StatisticStorageDto>(<any>null);
		}
		let result: StatisticStorageDto = await this.statisticStorageService.createStatisticStorage(input);
		if (!!result) {
			this.statisticStorageListResult.unshift(result);
			return Promise.resolve<StatisticStorageDto>(<any>result);
		}
		return Promise.resolve<StatisticStorageDto>(<any>null);
	}

	@action
	async updateStatisticStorage(input: UpdateStatisticStorageInput) {
		let result: StatisticStorageDto = await this.statisticStorageService.updateStatisticStorage(input);
		if (!!result) {
			this.statisticStorageListResult = this.statisticStorageListResult.map((x: StatisticStorageDto) => {
				if (x.sta_id === input.sta_id) x = result;
				return x;
			});
			return Promise.resolve<StatisticStorageDto>(<any>result);
		}
		return Promise.resolve<StatisticStorageDto>(<any>null);
	}

	@action
	public deleteStatisticStorage = async (item: StatisticStorageDto) => {
		if (!item || !item.sta_id) {
			return false;
		}
		let result = await this.statisticStorageService.delete(item.sta_id);
		if(!!result){
			let indexDelete= this.statisticStorageListResult.findIndex(a=>a.sta_id==item.sta_id);
			if(indexDelete>=0){
				this.statisticStorageListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async ( sta_name: string | undefined, sta_status: StatisticStorageStatus | undefined, pr_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.statisticStorageListResult = [];
		let result = await this.statisticStorageService.getAll(sta_name, sta_status, pr_id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.statisticStorageListResult = [];
			this.totalStatisticStorage = result.totalCount;
			for (let item of result.items) {
				this.statisticStorageListResult.push(item);
			}
		}
	}

}


export default StatisticStorageStore;