import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	PunishDto, CreatePunishInput, PunishService, PunishError
} from '@services/services_autogen';

export class PunishStore {
	private punishService: PunishService;

	@observable totalPublishSetting: number = 0;
	@observable punishListResult: PunishDto[] = [];

	constructor() {
		this.punishService = new PunishService("", http);
	}

	@action
	public createPunish = async (input: CreatePunishInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<PunishDto>(<any>null);
		}
		let result: PunishDto[] = await this.punishService.createListPunish(input);
		if (!!result) {
			this.punishListResult = result;
			return Promise.resolve<PunishDto>(<any>result);
		}
		return Promise.resolve<PunishDto>(<any>null);
	}




	@action
	public getPunishWithBorrowReturning = async (br_re_id: number | undefined, dkcb_code: string | undefined, us_id_borrow: number | undefined, us_id_create: number | undefined, pun_error: PunishError | undefined, pun_created_at: Date | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.punishListResult = [];
		let result = await this.punishService.getAll(br_re_id, dkcb_code, us_id_borrow, us_id_create, pun_error, pun_created_at, skipCount, maxResultCount);
		if (result != undefined) {
			this.punishListResult = result.items!;
		}
	}

}


export default PunishStore;