import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	PublisherDto, UpdatePublisherInput, CreatePublisherInput, PublisherService
} from '@services/services_autogen';
export class PublisherStore {
	private publisherService: PublisherService;

	@observable totalPublisher: number = 0;
	@observable publisherListResult: PublisherDto[] = [];

	constructor() {
		this.publisherService = new PublisherService("", http);
	}

	@action
	public createPublisher = async (input: CreatePublisherInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<PublisherDto>(<any>null);
		}
		let result: PublisherDto = await this.publisherService.createPublisher(input);
		if (!!result) {
			this.publisherListResult.unshift(result);
			return Promise.resolve<PublisherDto>(<any>result);
		}
		return Promise.resolve<PublisherDto>(<any>null);
	}

	@action
	public createListPublisher = async (input: CreatePublisherInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<PublisherDto>(<any>null);
		}
		let result: PublisherDto[] = await this.publisherService.createListPublisher(input);
		if (!!result) {
			this.publisherListResult = result;
			return Promise.resolve<PublisherDto>(<any>result);
		}
		return Promise.resolve<PublisherDto>(<any>null);
	}

	@action
	async updatePublisher(input: UpdatePublisherInput) {
		let result: PublisherDto = await this.publisherService.updatePublisher(input);
		if (!!result) {
			this.publisherListResult = this.publisherListResult.map((x: PublisherDto) => {
				if (x.pu_id === input.pu_id) x = result;
				return x;
			});
			return Promise.resolve<PublisherDto>(<any>result);
		}
		return Promise.resolve<PublisherDto>(<any>null);
	}

	@action
	public deletePublisher = async (item: PublisherDto) => {
		if (!item || !item.pu_id) {
			return false;
		}
		let result = await this.publisherService.delete(item.pu_id);
		if (!!result) {
			let indexDelete = this.publisherListResult.findIndex(a => a.pu_id == item.pu_id);
			if (indexDelete >= 0) {
				this.publisherListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	async deleteMulti(input: number[] | undefined) {
        await this.publisherService.deleteMulti(input)
    }
	@action
	async deleteAll() {
        await this.publisherService.deleteAll()
    }
	@action
	public getAll = async (pu_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.publisherListResult = [];
		let result = await this.publisherService.getAll(pu_search, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.publisherListResult = [];
			this.totalPublisher = result.totalCount;
			for (let item of result.items) {
				this.publisherListResult.push(item);
			}
		}
	}

}


export default PublisherStore;