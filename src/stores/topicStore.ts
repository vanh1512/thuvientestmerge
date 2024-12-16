import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	TopicDto, UpdateTopicInput, CreateTopicInput, TopicService
} from '@services/services_autogen';
export class TopicStore {
	private topicService: TopicService;

	@observable totalTopic: number = 0;
	@observable topicListResult: TopicDto[] = [];

	constructor() {
		this.topicService = new TopicService("", http);
	}

	@action
	public createTopic = async (input: CreateTopicInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<TopicDto>(<any>null);
		}
		let result: TopicDto = await this.topicService.createTopic(input);
		if (!!result) {
			this.topicListResult.unshift(result);
			return Promise.resolve<TopicDto>(<any>result);
		}
		return Promise.resolve<TopicDto>(<any>null);
	}
	@action
	public createListTopic = async (input: CreateTopicInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<TopicDto>(<any>null);
		}
		let result: TopicDto[] = await this.topicService.createListTopic(input);
		if (!!result) {
			this.topicListResult = result;
			return Promise.resolve<TopicDto>(<any>result);
		}
		return Promise.resolve<TopicDto>(<any>null);
	}

	@action
	async updateTopic(input: UpdateTopicInput) {
		let result: TopicDto = await this.topicService.updateTopic(input);
		if (!!result) {
			this.topicListResult = this.topicListResult.map((x: TopicDto) => {
				if (x.to_id === input.to_id) x = result;
				return x;
			});
			return Promise.resolve<TopicDto>(<any>result);
		}
		return Promise.resolve<TopicDto>(<any>null);
	}

	//Can xem lai
	@action
	public deleteTopic = async (item: TopicDto) => {
		if (!item || !item.to_id) {
			return false;
		}
		let result = await this.topicService.delete(item.to_id);
		return true;
	}
	@action
	async deleteMulti(number: number[]) {
		let result = await this.topicService.deleteMulti(number);
		if (result.result == true) {
			return true;
		}
		return false;
	}
	@action
	deleteAll = async () => {
		await this.topicService.deleteAll();
	}
	@action
	public getAll = async (to_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.topicListResult = [];
		let result = await this.topicService.getAll(to_search, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.topicListResult = [];
			this.totalTopic = result.totalCount;
			for (let item of result.items) {
				this.topicListResult.push(item);
			}
		}
	}

}


export default TopicStore;