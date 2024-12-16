import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	MemberCardDto, CreateMemberCardInput, MemberCardService, MCardStatus, ExtendTimeMemberCardInput, MCardType, RechargeCardInput, ApproveMemberCardInput,

} from '@services/services_autogen';

class MemberCardStore {
	private memberCardService: MemberCardService;

	@observable totalMemberCard: number = 0;
	@observable memberCardListResult: MemberCardDto[] = [];

	constructor() {
		this.memberCardService = new MemberCardService("", http);
	}

	@action
	public createMemberCard = async (input: CreateMemberCardInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<MemberCardDto>(<any>null);
		}
		let result: MemberCardDto = await this.memberCardService.createMemberCard(input);
		if (!!result) {
			this.memberCardListResult.unshift(result);
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}

	@action
	public deleteMemberCard = async (item: MemberCardDto) => {
		if (!item || !item.me_ca_id) {
			return false;
		}
		let result = await this.memberCardService.delete(item.me_ca_id);
		if (!!result) {
			let indexDelete = this.memberCardListResult.findIndex(a => a.me_ca_id == item.me_ca_id);
			if (indexDelete >= 0) {
				this.memberCardListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	public lockMemberCard = async (me_ca_id: number | undefined) => {
		if (me_ca_id == undefined) {
			return Promise.resolve<MemberCardDto>(<any>null);
		}
		let result = await this.memberCardService.lockCard(me_ca_id);
		if (!!result) {
			this.memberCardListResult = this.memberCardListResult.map((x: MemberCardDto) => {
				if (x.me_ca_id === me_ca_id) x = result;
				return x;
			});
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}

	@action
	public extendMemberCard = async (input: ExtendTimeMemberCardInput | undefined) => {
		if (input == undefined) {
			return Promise.resolve<MemberCardDto>(<any>null);
		}
		let result = await this.memberCardService.extendTimeCard(input);
		if (!!result) {
			this.memberCardListResult = this.memberCardListResult.map((x: MemberCardDto) => {
				if (x.me_ca_id === input.me_ca_id) x = result;
				return x;
			});
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}
	@action
	public rechargeCard = async (input: RechargeCardInput | undefined) => {
		if (input == undefined) {
			return Promise.resolve<MemberCardDto>(<any>null);
		}
		let result = await this.memberCardService.rechargeCard(input);
		if (!!result) {
			this.memberCardListResult = this.memberCardListResult.map((x: MemberCardDto) => {
				if (x.me_ca_id === input.me_ca_id) x = result;
				return x;
			});
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}
	@action
	public approveMemberCard = async (input: ApproveMemberCardInput | undefined) => {
		if (input == undefined) {
			return Promise.resolve<MemberCardDto>(<any>null);
		}
		let result = await this.memberCardService.approveMemberCard(input);
		if (!!result) {
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}

	@action
	public changeMoneyCard = async (input: RechargeCardInput | undefined) => {
		if (input == undefined) {
			return Promise.resolve<MemberCardDto>(<any>null);
		}
		let result = await this.memberCardService.changeMoneyCard(input);
		if (!!result) {
			this.memberCardListResult = this.memberCardListResult.map((x: MemberCardDto) => {
				if (x.me_ca_id === input.me_ca_id) x = result;
				return x;
			});
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}

	@action
	public getAll = async (me_id: number | undefined, me_ca_number: string | undefined, me_ca_code: string | undefined, me_ca_status: MCardStatus | undefined, me_ca_use_from: Date | undefined, me_ca_use_to: Date | undefined, me_ca_type: MCardType | undefined, me_ca_is_locked: boolean | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.memberCardListResult = [];
		let result = await this.memberCardService.getAll(me_id, me_ca_number, me_ca_code, me_ca_status, me_ca_use_from, me_ca_use_to, me_ca_type, me_ca_is_locked, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.memberCardListResult = [];
			this.totalMemberCard = result.totalCount;
			for (let item of result.items) {
				this.memberCardListResult.push(item);
			}
		}
	}
	public getAllByIdArr = async (do_in_id: number[] | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.memberCardListResult = [];
		this.totalMemberCard = 0;

		let result = await this.memberCardService.getAllByIdArr(do_in_id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalMemberCard = result.totalCount;
			this.memberCardListResult = result.items!;
		}
		return this.memberCardListResult;
	}

}

export default MemberCardStore;
