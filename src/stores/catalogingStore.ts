import { action, observable } from 'mobx';
import http from '@services/httpService';
import { CreateCatalogingInput, CatalogingDto, CatalogingService, UpdateCatalogingInput } from '@services/services_autogen';

class CatalogingStore {
	private catalogingService: CatalogingService;

	@observable totalCataloging: number = 0;
	@observable catalogingListResult: CatalogingDto[] = [];

	constructor() {
		this.catalogingService = new CatalogingService("", http);
	}

	// @action
	// public createCataloging = async (input: CreateCatalogingInput) => {
	// 	if (input == undefined || input == null) {
	// 		return Promise.resolve<CatalogingDto>(<any>null);
	// 	}
	// 	let result: CatalogingDto = await this.catalogingService.createCataloging(input);
	// 	if (!!result) {
	// 		return Promise.resolve<CatalogingDto>(<any>result);
	// 	}
	// 	return Promise.resolve<CatalogingDto>(<any>null);
	// }
	// @action
	// public createListCataloging = async (input: CreateCatalogingInput[]) => {
	// 	if (input == undefined || input == null) {
	// 		return Promise.resolve<CatalogingDto>(<any>null);
	// 	}
	// 	let result: CatalogingDto[] = await this.catalogingService.createListCataloging(input);
	// 	if (!!result) {
	// 		this.catalogingListResult = result;
	// 		return Promise.resolve<CatalogingDto>(<any>result);
	// 	}
	// 	return Promise.resolve<CatalogingDto>(<any>null);
	// }

	@action
	async updateCataloging(input: UpdateCatalogingInput) {
		let result: CatalogingDto = await this.catalogingService.updateCataloging(input);
		if (!!result) {
			this.catalogingListResult = this.catalogingListResult.map((x: CatalogingDto) => {
				if (x.cata_id === input.cata_id) x = result;
				return x;
			});
			return Promise.resolve<CatalogingDto>(<any>result);
		}
		return Promise.resolve<CatalogingDto>(<any>null);
	}

	@action
	public deleteCataloging = async (item: CatalogingDto) => {
		if (!item || !item.cata_id) {
			return false;
		}
		let result = await this.catalogingService.delete(item.cata_id);
		if (!!result) {
			let indexDelete = this.catalogingListResult.findIndex(a => a.cata_id == item.cata_id);
			if (indexDelete >= 0) {
				this.catalogingListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}


	@action
	public getAll = async (do_in_search: string | undefined, cata_resultDDC: string | undefined, cata_resultTitle: string | undefined, cata_resultColor: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.catalogingListResult = [];
		this.totalCataloging = 0;
		let result = await this.catalogingService.getAll(do_in_search, cata_resultDDC, cata_resultTitle, cata_resultColor, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.catalogingListResult = result.items!;
			this.totalCataloging = result.totalCount;
		}
		return this.catalogingListResult;
	}
	@action
	public getAlltest = async (do_in_search: string | undefined, cata_resultDDC: string | undefined, cata_resultTitle: string | undefined, cata_resultColor: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.catalogingListResult = [];
		this.totalCataloging = 0;
		let result = await this.catalogingService.getAll(do_in_search, cata_resultDDC, cata_resultTitle, cata_resultColor, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.catalogingListResult = result.items!;
			this.totalCataloging = result.totalCount;
		}
		return this.catalogingListResult;
	}

	@action
	public getDocumentInforByDkcbCode = async (do_in_isbn: string | undefined,) => {
		if (do_in_isbn == undefined || do_in_isbn == null) {
			return Promise.resolve<CatalogingDto>(<any>null);
		}
		let result: CatalogingDto = await this.catalogingService.getCatalogingFromDKCB(do_in_isbn);
		if (!!result) {
			return Promise.resolve<CatalogingDto>(<any>result);
		}
		return Promise.resolve<CatalogingDto>(<any>null);
	}

}

export default CatalogingStore;
