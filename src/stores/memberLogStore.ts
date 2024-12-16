import { action, observable } from 'mobx';
import http from '@services/httpService';

import { MemberLogDto, CreateMemberLogInput, MemberLogService,
	
	} from '@services/services_autogen';
	
class MemberLogStore {
	private memberLogService :MemberLogService;

	@observable totalMemberLog: number=0;
	@observable memberLogListResult:MemberLogDto[]=[];

	constructor() {
		this.memberLogService = new MemberLogService("",http);
    }

	@action
	public createMemberLog = async ( input: CreateMemberLogInput)=>{
		if(input == undefined || input == null){
			return Promise.resolve<MemberLogDto>(<any>null);
		}
		let result: MemberLogDto =  await this.memberLogService.createMemberLog(input); 
		if(!!result){
			this.memberLogListResult.unshift(result);
			return Promise.resolve<MemberLogDto>(<any> result);
		}
		return Promise.resolve<MemberLogDto>(<any>null);
	}

	@action
	public deleteMemberLog = async ( item: MemberLogDto)=>{
		if(!item|| !item.me_lo_id){
			return false;
		}
		let result= await this.memberLogService.delete(item.me_lo_id); 
		if(!!result){
			let indexDelete= this.memberLogListResult.findIndex(a=>a.me_lo_id==item.me_lo_id);
			if(indexDelete>=0){
				this.memberLogListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}


	@action
	public getAll = async (me_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined)=>{
		this.memberLogListResult=[];
		let result = await this.memberLogService.getAll(me_id,skipCount, maxResultCount); 
		if(result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null){
			this.totalMemberLog = result.totalCount;
			for(let item of result.items){
				this.memberLogListResult.push(item);
			} 
		} 
	} 
	
}

export default MemberLogStore;
