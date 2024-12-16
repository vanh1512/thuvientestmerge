import { action, observable } from 'mobx';
import http from '@services/httpService';

import { DocumentLogDto, CreateDocumentLogInput, DocumentLogService, DocumentLogAction,
	
	} from '@services/services_autogen';
	
class DocumentLogStore {
	private documentLogService :DocumentLogService;

	@observable totalDocumentLog: number=0;
	@observable documentLogListResult:DocumentLogDto[]=[];

	constructor() {
		this.documentLogService = new DocumentLogService("",http);
    }

	@action
	public createDocumentLog = async ( input: CreateDocumentLogInput)=>{
		if(input == undefined || input == null){
			return Promise.resolve<DocumentLogDto>(<any>null);
		}
		let result: DocumentLogDto =  await this.documentLogService.createDocumentLog(input); 
		if(!!result){
			this.documentLogListResult.unshift(result);
			return Promise.resolve<DocumentLogDto>(<any> result);
		}
		return Promise.resolve<DocumentLogDto>(<any>null);
	}

	@action
	public deleteDocumentLog = async (item: DocumentLogDto) => {
		if (!item || !item.do_lo_id) {
			return false;
		}
		let result = await this.documentLogService.delete(item.do_lo_id);
		if(!!result){
			let indexDelete= this.documentLogListResult.findIndex(a=>a.do_lo_id==item.do_lo_id);
			if(indexDelete>=0){
				this.documentLogListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}

	@action
	public getAll = async (do_id: number | undefined, do_lo_action: DocumentLogAction | undefined, us_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined)=>{
		this.documentLogListResult=[];
		let result = await this.documentLogService.getAll(do_id, do_lo_action,us_id, skipCount, maxResultCount); 
		if(result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null){
			this.documentLogListResult=[];
			this.totalDocumentLog = result.totalCount;
			for(let item of result.items){
				this.documentLogListResult.push(item);
			} 
		} 
	} 
	
}

export default DocumentLogStore;
