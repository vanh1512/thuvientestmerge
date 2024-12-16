import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	PublishRegisterDto, UpdatePublishRegisterInput, CreatePublishRegisterInput, PublishRegisterService, TypePublishRegister
} from '@services/services_autogen';
export class PublishRegisterStore {
	private publishRegisterService: PublishRegisterService;

	@observable totalPublishRegister: number = 0;
	@observable publishRegisterListResult: PublishRegisterDto[] = [];

	constructor() {
		this.publishRegisterService = new PublishRegisterService("", http);
	}

	@action
	public createPublishRegister = async (input: CreatePublishRegisterInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<PublishRegisterDto>(<any>null);
		}
		let result: PublishRegisterDto = await this.publishRegisterService.createPublishRegister(input);
		if (!!result) {
			this.publishRegisterListResult.unshift(result);
			return Promise.resolve<PublishRegisterDto>(<any>result);
		}
		return Promise.resolve<PublishRegisterDto>(<any>null);
	}

	@action
	async updatePublishRegister(input: UpdatePublishRegisterInput) {
		let result: PublishRegisterDto = await this.publishRegisterService.updatePublishRegister(input);
		if (!!result) {
			this.publishRegisterListResult = this.publishRegisterListResult.map((x: PublishRegisterDto) => {
				if (x.pu_re_id === input.pu_re_id) x = result;
				return x;
			});
			return Promise.resolve<PublishRegisterDto>(<any>result);
		}
		return Promise.resolve<PublishRegisterDto>(<any>null);
	}


	@action
	public getAll = async (pu_re_name: string | undefined, ca_id: number | undefined, pu_re_receive_type: TypePublishRegister | undefined, me_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.publishRegisterListResult = [];
		let result = await this.publishRegisterService.getAll(pu_re_name, ca_id, pu_re_receive_type, me_id,skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.publishRegisterListResult = [];
			this.totalPublishRegister = result.totalCount;
			for (let item of result.items) {
				this.publishRegisterListResult.push(item);
			}
		}
	}

}


export default PublishRegisterStore;