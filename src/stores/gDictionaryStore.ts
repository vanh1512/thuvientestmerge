import { action, observable } from 'mobx';
import http from '@services/httpService';

import { DictionariesDto, GDictionariesService,	} from '@services/services_autogen';
	
class GDictionaryStore {
	private gDictionariesService :GDictionariesService;

	@observable totalDictionaryItem: number=0;
	@observable dictionaryItemListResult: DictionariesDto[]=[];

	constructor() {
		this.gDictionariesService = new GDictionariesService("",http);
    }

	@action
	public getAll = async (dic_search: string | undefined, dic_ty_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined)=>{
		this.dictionaryItemListResult=[];
		let result = await this.gDictionariesService.getAll(dic_search, dic_ty_id, skipCount, maxResultCount); 
		if(result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null){
			this.dictionaryItemListResult=[];
			this.totalDictionaryItem = result.totalCount;
			for(let item of result.items){
				this.dictionaryItemListResult.push(item);
			} 
		} 
	} 
	
}

export default GDictionaryStore;
