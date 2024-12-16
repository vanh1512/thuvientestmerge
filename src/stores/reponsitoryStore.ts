import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	ReponsitoryDto, UpdateReponsitoryInput, CreateReponsitoryInput, ReponsitoryService, UpdatePositionReponsitoryInput
} from '@services/services_autogen';

export class TreeReponsitoryDto extends ReponsitoryDto {
	key: number;
	title: string;
	value: number;
	children: TreeReponsitoryDto[] = [];
	nrchildren = () => {
		let total = this.children.length;
		this.children.forEach(element => {
			total += element.nrchildren();
		});
		return total;
	}
	constructor(data?: ReponsitoryDto) {
		super(data);
		this.key = this.re_id;
		this.title = this.re_name!;
		this.value = this.key!;
	}

}

export class ReponsitoryStore {
	private reponsitoryService: ReponsitoryService;

	@observable totalReponsitory: number = 0;
	@observable reponsitoryListResult: ReponsitoryDto[] = [];
	@observable treeReponsitoryDto: TreeReponsitoryDto = new TreeReponsitoryDto(new ReponsitoryDto());

	constructor() {
		this.reponsitoryService = new ReponsitoryService("", http);
	}
	@action
	public createListReponsitory = async (input: CreateReponsitoryInput[]) => {
		if (input == undefined || input == null) {
			return Promise.resolve<ReponsitoryDto>(<any>null);
		}
		let result: ReponsitoryDto[] = await this.reponsitoryService.createListReponsitory(input);
		if (!!result) {
			this.reponsitoryListResult = result;
			return Promise.resolve<ReponsitoryDto>(<any>result);
		}
		return Promise.resolve<ReponsitoryDto>(<any>null);
	}
	@action
	public createReponsitory = async (input: CreateReponsitoryInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<ReponsitoryDto>(<any>null);
		}
		let result: ReponsitoryDto = await this.reponsitoryService.createReponsitory(input);
		if (result && result.re_id_parent) {
			this.reponsitoryListResult.push(result);

			return result;
		}
		return Promise.resolve<ReponsitoryDto>(<any>null);
	}

	private makeTree(list: ReponsitoryDto[]) {
		let root: ReponsitoryDto = new ReponsitoryDto();
		root.re_id = -1;
		root.re_name = "Kho vật lý";
		let reponsitoryParent = new TreeReponsitoryDto(root);
		this.createResTree(reponsitoryParent, list);
		return reponsitoryParent;
	}

	//Tạo cây, các nút con cùng cấp và cùng cha được sắp xếp theo trường sort
	private createResTree(reponsitoryParent: TreeReponsitoryDto, list: ReponsitoryDto[]) {

		if (reponsitoryParent === undefined) {
			return;
		}
		let listChild = list.filter(item => item.re_id_parent == reponsitoryParent.re_id);
		let sortedListChild = listChild.sort((a, b) => a.re_sort - b.re_sort);
		for (let i = 0; i < sortedListChild.length; i += 1) {
			let item = listChild[i];
			let roots: TreeReponsitoryDto = new TreeReponsitoryDto(item);
			this.createResTree(roots, list);
			reponsitoryParent.children.push(roots);
		}
	}

	@action
	async updateReponsitory(input: UpdateReponsitoryInput) {
		if (!input || !input.re_id) {
			return Promise.resolve<ReponsitoryDto>(<any>null);
		}
		let res = await this.reponsitoryService.updateReponsitory(input);
		if (!!res) {
			this.reponsitoryListResult = this.reponsitoryListResult.map((item) => {
				if (item.re_id == res.re_id) {
					item = res;
				}
				return item;
			});
			this.treeReponsitoryDto = this.makeTree(this.reponsitoryListResult);
			return res;
		}
		return Promise.resolve<ReponsitoryDto>(<any>null);
	}

	@action
	public delete = async (item: ReponsitoryDto) => {
		if (!item || !item.re_id) {
			return false;
		}
		let result = await this.reponsitoryService.delete(item.re_id);
		if (!!result) {
			let indexDelete = this.reponsitoryListResult.findIndex(a => a.re_id == item.re_id);
			if (indexDelete >= 0) {
				this.reponsitoryListResult.splice(indexDelete, 1);
			}
			return true;
		}
		return false;
	}

	@action
	async changePositionReponsitory(input: UpdatePositionReponsitoryInput) {
		let result = await this.reponsitoryService.changePosition(input);
		if (result !== undefined && result.result === true) {
			let index1 = this.reponsitoryListResult.findIndex(a => a.re_id == input.re_id);
			let index2 = this.reponsitoryListResult.findIndex(a => a.re_id == input.re_id2);
			if (index1 >= 0 && index2 >= 0) {
				let sort = this.reponsitoryListResult[index1].re_sort;
				this.reponsitoryListResult[index1].re_sort = this.reponsitoryListResult[index2].re_sort;
				this.reponsitoryListResult[index2].re_sort = sort;
				this.reponsitoryListResult = this.reponsitoryListResult.sort((a, b) => a.re_sort - b.re_sort);
			}
		}
		this.treeReponsitoryDto = this.makeTree(this.reponsitoryListResult);

		return result;
	}

	@action
	public getAll = async (re_search: string | undefined, re_type: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.reponsitoryListResult = [];
		let result = await this.reponsitoryService.getAll(re_search, re_type, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.reponsitoryListResult = [];
			this.totalReponsitory = result.totalCount;
			for (let item of result.items) {
				this.reponsitoryListResult.push(item);
			}
			this.treeReponsitoryDto = this.makeTree(this.reponsitoryListResult);
		}
	}

}


export default ReponsitoryStore;