import { ChangePassword } from './../scenes/Manager/Member/components/ChangePassword';
import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	MemberDto, CreateMemberInput, UpdateMemberInput, MemberService, MemberRegisterStatus, ChangeStatusMemberInput, ChangePassWordMemberInput, SORT,

} from '@services/services_autogen';

class MemberStore {
	private memberService: MemberService;

	@observable totalMember: number = 0;
	@observable memberListResult: MemberDto[] = [];

	constructor() {
		this.memberService = new MemberService("", http);
	}

	@action
	public createMember = async (input: CreateMemberInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<MemberDto>(<any>null);
		}
		let result: MemberDto = await this.memberService.createMember(input);
		if (!!result) {
			this.memberListResult.unshift(result);
			return Promise.resolve<MemberDto>(<any>result);
		}
		return Promise.resolve<MemberDto>(<any>null);
	}
	@action
	public createListMembers = async (input: CreateMemberInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<MemberDto>(<any>null);
		}
		let result: MemberDto[] = await this.memberService.createListMembers(input);
		if (!!result) {
			this.memberListResult = result;
			return Promise.resolve<MemberDto>(<any>result);
		}
		return Promise.resolve<MemberDto>(<any>null);
	}
	@action
	async updateMember(input: UpdateMemberInput) {
		let result: MemberDto = await this.memberService.updateMember(input);
		if (!!result) {
			this.memberListResult = this.memberListResult.map((x: MemberDto) => {
				if (x.me_id === input.me_id) x = result;
				return x;
			});
			return Promise.resolve<MemberDto>(<any>result);
		}
		return Promise.resolve<MemberDto>(<any>null);
	}

	@action
	public deleteMember = async (item: MemberDto) => {
		if (!item || !item.me_id) {
			return false;
		}
		let result = await this.memberService.delete(item.me_id);
		if (!!result) {
			let indexDelete = this.memberListResult.findIndex(a => a.me_id == item.me_id);
			if (indexDelete >= 0) {
				this.memberListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	public changePassWordMember = async (input: ChangePassWordMemberInput | undefined,) => {
		if (!input || !input.me_id) {
			return false;
		}
		let result = await this.memberService.changePassWordMember(input);
		if (!!result) {
			return true;
		}
		return false;
	}

	@action
	public changeStatusMember = async (input: ChangeStatusMemberInput) => {
		if (!input || !input.me_id) {
			return false;
		}
		let result = await this.memberService.changeStatusMember(input);
		if (!!result) {
			this.memberListResult = this.memberListResult.map((x: MemberDto) => {
				if (x.me_id === input.me_id) x = result;
				return x;
			});
			return Promise.resolve<MemberDto>(<any>result);
		}
		return Promise.resolve<MemberDto>(<any>null);
	}

	@action
	public lockMember = async (me_id: number | undefined) => {
		if (me_id == undefined) {
			return Promise.resolve<MemberDto>(<any>null);
		}
		let result = await this.memberService.lockMember(me_id);
		if (!!result) {
			this.memberListResult = this.memberListResult.map((x: MemberDto) => {
				if (x.me_id === me_id) x = result;
				return x;
			});
			return Promise.resolve<MemberDto>(<any>result);
		}
		return Promise.resolve<MemberDto>(<any>null);
	}

	@action
	public getAll = async (me_search: string | undefined, me_status: MemberRegisterStatus | undefined, fieldSort: string | undefined, sort: SORT | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.memberListResult = [];
		let result = await this.memberService.getAll(me_search, me_status, fieldSort, sort, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.memberListResult = [];
			this.totalMember = result.totalCount;
			for (let item of result.items) {
				this.memberListResult.push(item);
			}
			return result.items;
		}
		return [];
	}
	public getAllByIdArr = async (do_in_id: number[] | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.memberListResult = [];
		this.totalMember = 0;

		let result = await this.memberService.getAllByIdArr(do_in_id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalMember = result.totalCount;
			this.memberListResult = result.items!;
		}
		return this.memberListResult;
	}

}

export default MemberStore;
