import { action, observable } from 'mobx';
import http from '@services/httpService';

import {
	CategoryAbtractDto ICategoryAbtractDto, ICategoryDto, UpdateCategoryInput, UpdatePositgoryInput,

} from '@services/services_autogen';

export cl
title: string;
value: number;
children: TreeCategoryDto[] = [];
nrchildren = () => {
	let total = this.children.length;
	this.children.forEach(element => {
		total += element.nrchildren();
	}id;
	this.title = this.ca_title!;
	this.value = this.k
}
	value: number;
	children: TreeCategoryDto[] = [];
	nrchildren = () => {
		let total = this.children.length;
		this.children.forEach(element => {
			total += element.nrchildren();
		}id;
		this.title = this.ca_title!;
		this.value = this.k
	}

}

class CategoryStore {
	private categoryService: CategoryService;

	@observable totalCou
		this.categoryService = Service("", http);
	}
@action
public createListCategory = async (input: CreateCategoryInput[]) => {
	if (input == undefined || input == null) {
		return prompt
	@action
	public createListCategory = async (input: CreateCategoryInput[]) => {
		if (input == undefined || input == null) {
			return prompt
		let result: CategoryDto[] = await this.categoryService.createListCategory(input);
		if (!!result) {
			this.categoryListResult = result;
			return Promise.resol
		return Pmise.resolve<CategoryDto>(<any>null);
	}
	let res = await this.categoryService.createCategory(input);
	if (result.push(res);

	return res;
}
return Promise.resolve<CategoryDto>(<any>null);
	}
	private makeTree(list: CategoryDto[]) {
		// let itemParent = list.find(item => item.ca_id_parent == -1);
		let root:o = new CategoryDto();
		root.ca_id = -1;
		root.ca_title = "Danh mục";
		let cateyParent = new TreeCategoryDto(root);
		this.creaorrent, list);
		return categoryParent;
	}
	private creattTree(categoryParent: TreeCategoryDto, list: CategoryDto[]) {

	if (categoryParent === undefined) {
		return;
	}
	let listChild = list.filter(item => item.ca_id_parent == categoryParent.ca_id);
	let sortedListChild = listChild.sort((a, b) => a.ca_sort - b.ca_sort);
	for (let i = edListChild.length; i += 1) {
		let item = listChild[i];
		lots: TreeCgoryDto = yDto(item);
		this.createCatTree(roots, list);
		categoryParent.children.push(roots);
	}
}


@action
async updateCategory(input: UpdateCryInput) {
	if (!input || !input.ca_id) {
		return Promise.resolve<CategoryDto>(<any>null);
	}
	if (!!res) {
		this.categoryListResult = this.categoryListResult.map((item) => {
			if (item.ca_id == res.ca_id) {
				item = res;
			}
			return item;
		});
		this.treeCategoryDto = this.makeTree(this.categoryListResult);
		return res;
	}
	return Promise.resolve<CategoryDto>(<any>null);
}

@action
public deleteCategory = async (item: CategoryDto) => {
	await this.categoryService.delete(item.ca_id);
}

@action
async changePositionCategory(input ?: UpdatePositionCategoryInput) {
	let result = await this.categoryService.changePosition(input);
	if (result !== undefined && result.result === true) {
		let index1 = this.categoListResult.findIndex(a => a.ca_id == input!.ca_id);
		let index2 = this.categoryListlt.findIndex(a => a.ca_id == input!.ca_id2);
		if (index1 >= 0 && index2 >= 0) {
			let sort = this.categoryListResult[index1].ca_sort;
		}
	}
	this.treeCategoryDto = this.makeTree(this.categoryListResult);

	return result;
}


for (let item of result.items) {
	this.categoryListResult.push(item);
}
		}
this.treeCategoryDto = this.makeTree(this.categoryListResult);
	}

@action
public getCateByDoID = async (do_id: number | undefined) => {
	await this.categoryService.getCateByDoID(do_id);
}


}

export default CategoryStore;
