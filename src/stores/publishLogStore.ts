import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	PublishLogDto, CreatePublishLogInput, PublishLogService
} from '@services/services_autogen';
export class PublishLogStore {
	private publishLogService: PublishLogService;

	@observable totalPublishLog: number = 0;
	@observable publishLogListResult: PublishLogDto[] = [];

	constructor() {
		this.publishLogService = new PublishLogService("", http);
	}

	@action
	public createPublishLog = async (input: CreatePublishLogInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<PublishLogDto>(<any>null);
		}
		let result: PublishLogDto = await this.publishLogService.createPublishLog(input);
		if (!!result) {
			this.publishLogListResult.unshift(result);
			return Promise.resolve<PublishLogDto>(<any>result);
		}
		return Promise.resolve<PublishLogDto>(<any>null);
	}

	@action
	public deletePublishLog = async (item: PublishLogDto) => {
		if (!item || !item.pu_lo_id) {
			return false;
		}
		let result = await this.publishLogService.delete(item.pu_lo_id);
		if(!!result){
			let indexDelete= this.publishLogListResult.findIndex(a=>a.pu_lo_id==item.pu_lo_id);
			if(indexDelete>=0){
				this.publishLogListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async (pu_re_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.publishLogListResult = [];
		let result = await this.publishLogService.getAll(pu_re_id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.publishLogListResult = [];
			this.totalPublishLog = result.totalCount;
			for (let item of result.items) {
				this.publishLogListResult.push(item);
			}
		}
	}

}


export default PublishLogStore;