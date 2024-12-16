import { action, observable } from 'mobx';
import http from '@services/httpService';

import { BorrowReturnLogType, BorrowReturningLogDto, BorrowReturningLogService, MemberSearchBorrowReturningLogInput } from '@services/services_autogen';

class BorrowReturningLogStore {
	private borrowReturningLogService: BorrowReturningLogService;

	@observable totalBorrowReturningLog: number = 0;
	@observable borrowReturningLogListResult: BorrowReturningLogDto[] = [];

	constructor() {
		this.borrowReturningLogService = new BorrowReturningLogService("", http);
	}

	@action
	public getAll = async (us_id_borrow: number | undefined, start_date: Date | undefined, br_re_lo_type: BorrowReturnLogType | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.borrowReturningLogListResult = [];
		let result = await this.borrowReturningLogService.getAll(us_id_borrow, br_re_lo_type, start_date, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.borrowReturningLogListResult = [];
			this.totalBorrowReturningLog = result.totalCount;
			for (let item of result.items) {
				this.borrowReturningLogListResult.push(item);
			}
		}
	}

	@action
	public getAllLogForUser = async (input: MemberSearchBorrowReturningLogInput | undefined) => {
		this.borrowReturningLogListResult = [];
		let result = await this.borrowReturningLogService.memberGetAll(input);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.borrowReturningLogListResult = [];
			this.totalBorrowReturningLog = result.totalCount;
			for (let item of result.items) {
				this.borrowReturningLogListResult.push(item);
			}
		}
	}



}

export default BorrowReturningLogStore;
