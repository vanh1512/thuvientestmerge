import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	AuthorDto, AuthorService, CreateAuthorInput, UpdateAuthorInput,

} from '@services/services_autogen';

class AuthorStore {
	private authorService: AuthorService;

	@observable totalAuthor: number = 0;
	@observable authorListResult: AuthorDto[] = [];

	constructor() {
		this.authorService = new AuthorService("", http);
	}

	@action
	public createAuthor = async (input: CreateAuthorInput) => {
		let result: AuthorDto = await this.authorService.createAuthor(input);
		if (!!result) {
			this.authorListResult.unshift(result);
			return Promise.resolve<AuthorDto>(<any>result);
		}
		return Promise.resolve<AuthorDto>(<any>null);
	}
	@action
	public createListAuthor = async (input: CreateAuthorInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<AuthorDto>(<any>null);
		}
		let result: AuthorDto[] = await this.authorService.createListAuthor(input);
		if (!!result) {
			this.authorListResult = result;
			return Promise.resolve<AuthorDto>(<any>result);
		}
		return Promise.resolve<AuthorDto>(<any>null);
	}

	@action
	async updateAuthor(input: UpdateAuthorInput) {
		let result: AuthorDto = await this.authorService.updateAuthor(input);
		if (!!result) {
			this.authorListResult = this.authorListResult.map((x: AuthorDto) => {
				if (x.au_id === input.au_id) x = result;
				return x;
			});
			return Promise.resolve<AuthorDto>(<any>result);
		}
		return Promise.resolve<AuthorDto>(<any>null);
	}

	@action
	public deleteAuthor = async (item: AuthorDto) => {
		if (!item || !item.au_id) {
			return false;
		}
		let result = await this.authorService.delete(item.au_id);
		if (!!result) {
			let indexDelete = this.authorListResult.findIndex(a => a.au_id == item.au_id);
			if (indexDelete >= 0) {
				this.authorListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}
	@action
	async deleteMulti(number: number[]) {
		let result = await this.authorService.deleteMulti(number);
		if (result.result == true) {
			return true;
		}
		return false;
	}
	@action
	public deleteAllAuthor = async () => {
		await this.authorService.deleteAll();
	}
	@action
	public getAll = async (au_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.authorListResult = [];
		this.totalAuthor = 0;
		let result = await this.authorService.getAll(au_search, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.authorListResult = result.items!;
			this.totalAuthor = result.totalCount;
		}
	}
}

export default AuthorStore;
