import { StatisticBorrowReturningWithCategoryDto, StatisticBorrowReturningWithCategoryDtoListResultDto, StatisticBorrowReturningWithMonthDto, StatisticBorrowReturningWithMonthDtoListResultDto, StatisticStatusOfDocumentsWithCategoryDto, StatisticStatusOfDocumentsWithCategoryDtoListResultDto, StatisticStatusOfMembersDto, StatisticStatusOfMembersDtoListResultDto, StatisticStorageLibraryService,StatisticBorrowMostMemberDto, SearchStatisticBorrowMostInput, StatisticBorrowMostMemberDtoListResultDto, StatisticBorrowMostDocumentDtoListResultDto, StatisticBorrowMostDocumentDto, StatisticBorrowMostLibrarianDtoListResultDto, StatisticBorrowMostLibrarianDto, StatisticPlanMostMoneyDto, StatisticPlanMostMoneyDtoListResultDto, StatisticPlanWithMonthDtoListResultDto, StatisticPlanWithMonthDto } from './../services/services_autogen';
import { action, observable } from 'mobx';
import http from '@services/httpService';
export class statisticStorageLibraryStore {
	private statisticStorageLibraryService: StatisticStorageLibraryService;


	constructor() {
		this.statisticStorageLibraryService = new StatisticStorageLibraryService("", http);
	}

	@action
	public statisticStatusOfDocuments = async () => {
		let result:StatisticStatusOfDocumentsWithCategoryDtoListResultDto = await this.statisticStorageLibraryService.statisticStatusOfDocumentsWithCategory();
		if (!!result) {
			return Promise.resolve<StatisticStatusOfDocumentsWithCategoryDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticStatusOfDocumentsWithCategoryDto[]>(<any>null);
	}

	@action
	public statisticStatusOfMembers = async (year: number | undefined) => {
		let result:StatisticStatusOfMembersDtoListResultDto = await this.statisticStorageLibraryService.statisticStatusOfMembers(year);
		if (!!result) {
			return Promise.resolve<StatisticStatusOfMembersDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticStatusOfMembersDto[]>(<any>null);
	}
	@action
	public statisticBorrowReturningWithCategory = async () => {
		let result:StatisticBorrowReturningWithCategoryDtoListResultDto = await this.statisticStorageLibraryService.statisticBorrowReturningWithCategory();
		if (!!result) {
			return Promise.resolve<StatisticBorrowReturningWithCategoryDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticBorrowReturningWithCategoryDto[]>(<any>null);
	}
	@action
	public statisticBorrowReturningWithMonth = async (year: number | undefined) => {
		let result:StatisticBorrowReturningWithMonthDtoListResultDto = await this.statisticStorageLibraryService.statisticBorrowReturningWithMonth(year);
		if (!!result) {
			return Promise.resolve<StatisticBorrowReturningWithMonthDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticBorrowReturningWithMonthDto[]>(<any>null);
	}
	@action
	public statisticBorrowMostMember = async (input: SearchStatisticBorrowMostInput | undefined ) => {
		let result:StatisticBorrowMostMemberDtoListResultDto = await this.statisticStorageLibraryService.statisticBorrowMostMember(input);
		if (!!result) {
			return Promise.resolve<StatisticBorrowMostMemberDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticBorrowMostMemberDto[]>(<any>null);
	}
	@action
	public statisticBorrowMostDocument = async (input: SearchStatisticBorrowMostInput | undefined ) => {
		let result:StatisticBorrowMostDocumentDtoListResultDto = await this.statisticStorageLibraryService.statisticBorrowMostDocument(input);
		if (!!result) {
			return Promise.resolve<StatisticBorrowMostDocumentDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticBorrowMostDocumentDto[]>(<any>null);
	}
	@action
	public statisticBorrowMostLibrarian = async (input: SearchStatisticBorrowMostInput | undefined ) => {
		let result:StatisticBorrowMostLibrarianDtoListResultDto = await this.statisticStorageLibraryService.statisticBorrowMostLibrarian(input);
		if (!!result) {
			return Promise.resolve<StatisticBorrowMostLibrarianDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticBorrowMostLibrarianDto[]>(<any>null);
	}
	@action
		public statisticPlanMostMoney = async () => {
			let result:StatisticPlanMostMoneyDtoListResultDto = await this.statisticStorageLibraryService.statisticPlanMostMoney();
			if (!!result) {
				return Promise.resolve<StatisticPlanMostMoneyDto[]>(<any>result.items);
			}
			return Promise.resolve<StatisticPlanMostMoneyDto[]>(<any>null);
		}
	@action
	public statisticPlanWithMonth = async (year: number | undefined) => {
		let result:StatisticPlanWithMonthDtoListResultDto = await this.statisticStorageLibraryService.statisticPlanWithMonth(year);
		if (!!result) {
			return Promise.resolve<StatisticPlanWithMonthDto[]>(<any>result.items);
		}
		return Promise.resolve<StatisticPlanWithMonthDto[]>(<any>null);
	}
}



export default statisticStorageLibraryStore;