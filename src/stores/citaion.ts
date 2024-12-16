import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	Citation,
	CitationDto,
	CitationService,
	CitationStructure,
	CitationType,
	CreateListCitationInput,
	CreateOrUpdateCitationInput
} from '@services/services_autogen';

class CitationDocument {
	private citationService: CitationService;

	@observable listCitation: CitationDto[] = [];
	@observable totalCitation: number = 0;
	constructor() {
		this.citationService = new CitationService("", http);
	}
	@action
	public getAll = async (ci_year_publish: string | undefined, ci_date_access: Date | undefined, ci_type: CitationType | undefined, ci_structure: CitationStructure | undefined, skipCount: number | undefined, maxResultCount: number | undefined,) => {
		this.listCitation = [];
		let res = await this.citationService.getAll(ci_year_publish, ci_date_access, ci_type, ci_structure, skipCount, maxResultCount);
		if (res != undefined && res.items != undefined && res.totalCount != undefined) {
			this.listCitation = res.items;
			this.totalCitation = res.totalCount;
		}
		return this.listCitation;
	};
	@action
	public createOrUpdateCitation = async (input: CreateOrUpdateCitationInput) => {
		let res = await this.citationService.createOrUpdateCitation(input);
		if (!!res) {
			return Promise.resolve<CitationDto>(<any>res);
		}
		return Promise.resolve<CitationDto>(<any>null);
	};
	@action
	public createOrUpdateMultiCitation = async (input: CreateListCitationInput) => {
		let res = await this.citationService.createListCitation(input);
		if (!!res) {
			return Promise.resolve<CitationDto>(<any>res);
		}
		return Promise.resolve<CitationDto>(<any>null);
	};
	@action
	public onMapDocumet = async (input: Citation | undefined) => {
		if (input != undefined) {
			let res = await this.citationService.onMapDocument(input);
			if (res != undefined) {
				return res;
			}
		}
		return null
	};
	@action
	public onResultCitation = async (input: Citation | undefined) => {
		if (input != undefined) {
			let res = await this.citationService.onResultCitation(input);
			if (res != undefined) {
				return res;
			}
		}
		return null
	};

	@action
	public deleteMulti = async (ca_id: number[] | undefined) => {
		if (ca_id != undefined) {
			await this.citationService.deleteMulti(ca_id);
		}
		return null;
	}
	@action
	public delete = async (number: number | undefined) => {
		return await this.citationService.delete(number);
	};


}

export default CitationDocument;
