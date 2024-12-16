import { action, observable } from 'mobx';
import http from '@services/httpService';

import { PlanDetailDto, CreatePlanDetailInput, UpdatePlanDetailInput, PlanDetailService} from '@services/services_autogen';
	
class PlanDetailStore {
	private planDetailService :PlanDetailService;

	@observable planDetailListResult:PlanDetailDto[]=[];

	constructor() {
		this.planDetailService = new PlanDetailService("",http);
    }

	@action
	public createPlanDetail = async ( input: CreatePlanDetailInput)=>{
		if(input == undefined || input == null){
			return Promise.resolve<PlanDetailDto>(<any>null);
		}
		let result: PlanDetailDto =  await this.planDetailService.createPlanDetail(input); 
		if(!!result){
			this.planDetailListResult.unshift(result);
			return Promise.resolve<PlanDetailDto>(<any> result);
		}
		return Promise.resolve<PlanDetailDto>(<any>null);
	}
	@action
	public deletePlanDeTail = async (item: PlanDetailDto) => {
		if (!item || !item.pl_de_id) {
			return false;
		}
		let result = await this.planDetailService.delete(item.pl_de_id);
		if(!!result){
			let indexDelete= this.planDetailListResult.findIndex(a=>a.pl_de_id==item.pl_de_id);
			if(indexDelete>=0){
				this.planDetailListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}
	@action
	async updatePlanDetail(input: UpdatePlanDetailInput) {
		let result:PlanDetailDto = await this.planDetailService.updatePlanDetail(input);
		if(!!result){
			this.planDetailListResult = this.planDetailListResult.map((x: PlanDetailDto) => {
				if (x.pl_de_id === input.pl_de_id) x=result;
				return x;
			});
			return Promise.resolve<PlanDetailDto>(<any> result);
		}
		return Promise.resolve<PlanDetailDto>(<any>null);
	}
	@action
	public getAll = async (pl_id: number | undefined)=>{
		this.planDetailListResult=[];
		let result = await this.planDetailService.getAll(pl_id); 
		if(result != undefined && result.items != undefined && result.items != null){
			this.planDetailListResult=[];
			for(let item of result.items){
				this.planDetailListResult.push(item);
			} 
		} 
	} 
	@action
	public getByContractId = async (co_id: number | undefined ,)=>{
		let result = await this.planDetailService.getByContractId(co_id); 
		if(result != undefined && result.items != undefined && result.items != null ){
			return result.items;
		} 
		return [];
	} 
	
	@action
	public getByListPlanDetail = async (input:number[])=>{
		let result = await this.planDetailService.getByListPlanDetail(input); 
		if(result != undefined && result.items != undefined && result.items != null ){
			return result.items;
		} 
		return [];
	} 
	@action
	public createListPlanDetail = async (listPlanDetail : CreatePlanDetailInput[])=>{
		if(listPlanDetail.length >0 )
	{
		let result = await this.planDetailService.createListPlanDetail(listPlanDetail); 
	}
	} 
}

export default PlanDetailStore;
