import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	PublishSettingDto, UpdatePublishSettingInput, CreatePublishSettingInput, PublishSettingService
} from '@services/services_autogen';
export class PublishSettingStore {
	private publishSettingService: PublishSettingService;

	@observable totalPublishSetting: number = 0;
	@observable publishSettingListResult: PublishSettingDto[] = [];

	constructor() {
		this.publishSettingService = new PublishSettingService("", http);
	}

	@action
	public createPublishSetting = async (input: CreatePublishSettingInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<PublishSettingDto>(<any>null);
		}
		let result: PublishSettingDto = await this.publishSettingService.createPublishSetting(input);
		if (!!result) {
			this.publishSettingListResult.unshift(result);
			return Promise.resolve<PublishSettingDto>(<any>result);
		}
		return Promise.resolve<PublishSettingDto>(<any>null);
	}

	@action
	async updatePublishSetting(input: UpdatePublishSettingInput) {
		let result: PublishSettingDto = await this.publishSettingService.updatePublishSetting(input);
		if (!!result) {
			this.publishSettingListResult = this.publishSettingListResult.map((x: PublishSettingDto) => {
				if (x.pu_se_Id === input.pu_se_Id) x = result;
				return x;
			});
			return Promise.resolve<PublishSettingDto>(<any>result);
		}
		return Promise.resolve<PublishSettingDto>(<any>null);
	}

	@action
	public deletePublisher = async (item: PublishSettingDto) => {
		if (!item || !item.pu_se_Id) {
			return false;
		}
		let result = await this.publishSettingService.delete(item.pu_se_Id);
		if(!!result){
			let indexDelete= this.publishSettingListResult.findIndex(a=>a.pu_se_Id==item.pu_se_Id);
			if(indexDelete>=0){
				this.publishSettingListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async ( ca_id: number | undefined, pu_se_type: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.publishSettingListResult = [];
		let result = await this.publishSettingService.getAll(ca_id, pu_se_type, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.publishSettingListResult = [];
			this.totalPublishSetting = result.totalCount;
			for (let item of result.items) {
				this.publishSettingListResult.push(item);
			}
		}
	}

}


export default PublishSettingStore;