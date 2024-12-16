import { action, observable } from 'mobx';
import http from '@services/httpService';

import { DictionariesDto, CreateDictionariesInput, UpdateDictionariesInput, DictionariesService,
	
	} from '@services/services_autogen';
	
class DictionariesStore {
	private dictionariesService :DictionariesService;

	@observable totalDictionaries: number=0;
	@observable dictionariesListResult:DictionariesDto[]=[];

	constructor() {
		this.dictionariesService = new DictionariesService("",http);
    }

	@action
	public create = async ( input: CreateDictionariesInput)=>{
		if(input == undefined || input == null){
			return Promise.resolve<DictionariesDto>(<any>null);
		}
		let result: DictionariesDto =  await this.dictionariesService.create(input); 
		if(!!result){
			this.dictionariesListResult.unshift(result);
			return Promise.resolve<DictionariesDto>(<any> result);
		}
		return Promise.resolve<DictionariesDto>(<any>null);
	}

	@action
	async update(input: UpdateDictionariesInput) {
		let result:DictionariesDto = await this.dictionariesService.update(input);
		if(!!result){
			this.dictionariesListResult = this.dictionariesListResult.map((x: DictionariesDto) => {
				if (x.dic_id === input.dic_id) x=result;
				return x;
			});
			return Promise.resolve<DictionariesDto>(<any> result);
		}
		return Promise.resolve<DictionariesDto>(<any>null);
	}

	@action
	public deleteDictionaries = async ( item:DictionariesDto)=>{
		if(!item|| !item.dic_id){
			return false;
		}
		let result= await this.dictionariesService.delete(item.dic_id); 
		if(!!result){
			let indexDelete= this.dictionariesListResult.findIndex(a=>a.dic_id==item.dic_id);
			if(indexDelete>=0){
				this.dictionariesListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}
	@action
	async deleteMulti(number : number[]) {
		let result = await this.dictionariesService.deleteMulti(number);
		if(result.result == true)
		{
			return true;
		}
		return false;
	}
	@action
	async deleteAll() {
		await this.dictionariesService.deleteAll();
	}
	@action
	 public createListDictionaries = async(input:CreateDictionariesInput [] ) =>{
		if(input != undefined && input.length > 0)
		{
			await this.dictionariesService.createListDictionaries(input); 
		}
		return  null;
		
	}
	
	@action
	public getAll = async (dic_search: string | undefined, dic_ty_id: number | undefined,  skipCount: number | undefined, maxResultCount: number | undefined)=>{
		this.dictionariesListResult=[];
		let result = await this.dictionariesService.getAll(dic_search,dic_ty_id, skipCount, maxResultCount); 
		if(result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null){
			this.dictionariesListResult=[];
			this.totalDictionaries = result.totalCount;
			for(let item of result.items){
				this.dictionariesListResult.push(item);
			} 
		} 
	} 
	
}

export default DictionariesStore;
