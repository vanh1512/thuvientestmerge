import { action, observable } from 'mobx';
import http from '@services/httpService';
import { BorrowMethod, BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, BorrowReturningDtoPagedResultDto, BorrowReturningIDetailDto, BorrowReturningProcess, BorrowReturningService, CancelBorrowReturningInput, CreateBorrowReturningAtDeskInput, CreateBorrowReturningInput, DeliveryDocumentInput, DocumentBorrowDto, DocumentDto, ExtendtBorrowReturningInput, GetDocumentInforByDKCBDto, FindMemberBorrowDto, MemberCreateBorrowReturningInput, MemberSearchBorrowReturningInput, MemberSearchDocumentToBorrowInput, ReturnDocumentInput, UpdateBorrowReturningInput, SORT, BorrowReturningDetailStatus } from '@services/services_autogen';

class BorrowReturningStore {
	private borrowReturningService: BorrowReturningService;

	@observable totalBorrowReturning: number = 0;
	@observable borrowReturningDtoListResult: BorrowReturningDto[] = [];
	@observable totalDocument: number = 0;
	@observable borrowReturningDetailDtoPageResult: BorrowReturningIDetailDto[] = [];
	@observable documentListResult: DocumentBorrowDto[] = [];
	@observable documentBorrowListResult: DocumentBorrowDto[] = [];

	constructor() {
		this.borrowReturningService = new BorrowReturningService("", http);
	}

	@action
	public createBorrowReturning = async (input: CreateBorrowReturningInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<BorrowReturningDto>(<any>null);
		}
		let result = await this.borrowReturningService.create(input);
		return Promise.resolve<boolean>(result);
	}

	@action
	async updateBorrowReturning(input: UpdateBorrowReturningInput) {
		let result: BorrowReturningDto = await this.borrowReturningService.update(input);
		if (!!result) {
			this.borrowReturningDtoListResult = this.borrowReturningDtoListResult.map((x: BorrowReturningDto) => {
				if (x.br_re_id === input.br_re_id) x = result;
				return x;
			});
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public deleteBorrowReturning = async (item: BorrowReturningDto) => {
		if (!item || !item.br_re_id) {
			return false;
		}
		let result = await this.borrowReturningService.delete(item.br_re_id);
		if (!!result) {

			let indexDelete = this.borrowReturningDtoListResult.findIndex(a => a.br_re_id == item.br_re_id);
			if (indexDelete >= 0) {
				this.borrowReturningDtoListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	public deleteBorrowReturningItem = async (item: BorrowReturningIDetailDto) => {
		if (!item || !item.br_re_id) {
			return [];
		}
		let result = await this.borrowReturningService.deleteBorrowItem(item.br_re_de_id);
		if (!!result) {
			let detailBorrow = await this.getBorrowReturnDetail(item.br_re_id);
			return detailBorrow.list_borrow;
		}
		return [];
	}

	@action
	public getAll = async (br_re_code: string | undefined, dkcb_code: string | undefined, us_id_borrow: number | undefined, br_re_start_at: Date | undefined, br_re_end_at: Date | undefined, br_re_status: BorrowReturningProcess[] | undefined, br_re_method: BorrowMethod | undefined, br_re_de_status: BorrowReturningDetailStatus | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.borrowReturningDtoListResult = [];
		this.totalBorrowReturning = 0;
		let result = await this.borrowReturningService.getAll(br_re_code, us_id_borrow, br_re_start_at, br_re_end_at, dkcb_code, br_re_status, br_re_method, br_re_de_status, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.borrowReturningDtoListResult = [];
			this.totalBorrowReturning = result.totalCount;
			this.borrowReturningDtoListResult = result.items;
		}
	}

	@action
	public managerGetAllDocumentToBorrow = async (do_search: string | undefined, author: string | undefined, fieldSort: string | undefined, sort: SORT | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.documentListResult = [];
		this.totalDocument = 0;
		let result = await this.borrowReturningService.getAllDocumentToBorrow(do_search, author, fieldSort, sort, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalDocument = result.totalCount;
			this.documentListResult = result.items;
		}
	}

	@action
	public findMemberById = async (us_id: number | undefined) => {
		const result = await this.borrowReturningService.findMemberById(us_id);
		if (!!result) {
			return result;
		}
		return Promise.resolve<FindMemberBorrowDto>(<any>null);
	}

	@action
	public getDocumentInforByDKCB = async (dkcb: string | undefined) => {
		const result = await this.borrowReturningService.getDocumentInforByDKCB(dkcb);
		if (!!result) {
			return result;
		}
		return Promise.resolve<GetDocumentInforByDKCBDto>(<any>null);
	}


	@action
	public memberGetDocumentBorrowById = async (do_id: number | undefined): Promise<DocumentBorrowDto> => {
		if (!!do_id && do_id > 0) {
			return Promise.resolve<DocumentBorrowDto>(<any>null);
		}
		const result = await this.borrowReturningService.memberGetDocumentBorrowById(do_id);
		if (!!result) {
			return result;
		}
		return Promise.resolve<DocumentBorrowDto>(null as any);
	}

	@action
	public getBorrowReturnDetail = async (br_re_id: number | undefined) => {
		if (br_re_id === undefined) {
			return Promise.resolve<BorrowReturningDetailsWithListDocumentDto>(<any>null);
		}
		const result = await this.borrowReturningService.getDetailBorrowReturn(br_re_id);
		if (!!result) {
			return Promise.resolve<BorrowReturningDetailsWithListDocumentDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDetailsWithListDocumentDto>(<any>null);
	}

	@action
	public checkDocumentInfoValidForBorrow = async (do_id: number | undefined, dkcb: string | undefined) => {
		if (do_id === undefined) {
			return Promise.resolve<BorrowReturningDto>(<any>null);
		}
		const result = await this.borrowReturningService.checkDocumentInforValidForBorrow(do_id, dkcb);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public createAtDesk = async (input: CreateBorrowReturningAtDeskInput | undefined) => {
		const result = await this.borrowReturningService.createAtDesk(input);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public deliveryDocument = async (input: DeliveryDocumentInput | undefined) => {
		const result = await this.borrowReturningService.deliveryDocument(input);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public extendDocument = async (input: ExtendtBorrowReturningInput | undefined) => {
		const result = await this.borrowReturningService.extend(input);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public returnDocument = async (input: ReturnDocumentInput | undefined) => {
		const result = await this.borrowReturningService.returnDocument(input);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public approveBorrowReturning = async (br_re_id: number | undefined, br_re_desc: string | undefined) => {
		const result = await this.borrowReturningService.approve(br_re_id, br_re_desc);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public cancelBorrowReturning = async (input: CancelBorrowReturningInput | undefined) => {
		const result = await this.borrowReturningService.cancel(input);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public memberGetAllDocumentToBorrow = async (input: MemberSearchDocumentToBorrowInput | undefined) => {
		this.documentListResult = [];
		this.totalDocument = 0;
		let result = await this.borrowReturningService.memberGetAllDocumentToBorrow(input);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.documentListResult = [];
			this.totalDocument = result.totalCount;
			this.documentListResult = result.items;
		}
	}

	@action
	public memberCreateBorrowReturning = async (input: MemberCreateBorrowReturningInput | undefined) => {
		if (input == undefined || input == null) {
			return Promise.resolve<BorrowReturningDto>(<any>null);
		}
		let result = await this.borrowReturningService.memberCreate(input);
		return Promise.resolve<boolean>(result);
	}

	@action
	public memeberCancel = async (input: CancelBorrowReturningInput | undefined) => {
		const result = await this.borrowReturningService.memeberCancel(input);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}

	@action
	public memberGetBorrowReturnDetail = async (br_re_id: number | undefined) => {
		if (br_re_id === undefined) {
			return Promise.resolve<BorrowReturningDetailsWithListDocumentDto>(<any>null);
		}
		const result = await this.borrowReturningService.memberGetDetailBorrowReturn(br_re_id);
		if (!!result) {
			return Promise.resolve<BorrowReturningDetailsWithListDocumentDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDetailsWithListDocumentDto>(<any>null);
	}

	@action
	public extendMemberDocument = async (input: ExtendtBorrowReturningInput | undefined) => {
		const result = await this.borrowReturningService.memberExtend(input);
		if (!!result) {
			return Promise.resolve<BorrowReturningDto>(<any>result);
		}
		return Promise.resolve<BorrowReturningDto>(<any>null);
	}


	@action
	async memberGetAll(input: MemberSearchBorrowReturningInput | undefined) {
		this.borrowReturningDtoListResult = [];
		this.totalBorrowReturning = 0;
		let result = await this.borrowReturningService.memberGetAll(input);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.borrowReturningDtoListResult = [];
			this.totalBorrowReturning = result.totalCount;
			this.borrowReturningDtoListResult = result.items;
		}
	}
	@action
	public getByIdArr = async (id: number[] | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.borrowReturningDetailDtoPageResult = [];
		let result = await this.borrowReturningService.getByIdArr(id, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.totalCount != undefined && result.totalCount != null) {
			this.borrowReturningDetailDtoPageResult = result.items;
		}

	}

}

export default BorrowReturningStore;
