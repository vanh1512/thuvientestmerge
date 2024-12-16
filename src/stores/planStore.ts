import { action, observable } from 'mobx';
import http from '@services/httpService';
import {
	PlanDto, UpdatePlanInput, CreatePlanInput, PlanService, PlanProcess, ChangeProcessPlanInput, ConfirmPlanDoneInput
} from '@services/services_autogen';
export class PlanStore {
	private planService: PlanService;

	@observable totalPlan: number = 0;
	@observable planListResult: PlanDto[] = [];


	constructor() {
		this.planService = new PlanService("", http);
	}

	@action
	public createPlan = async (input: CreatePlanInput) => {
		if (input == undefined || input == null) {
			return Promise.resolve<PlanDto>(<any>null);
		}
		let result: PlanDto = await this.planService.createPlan(input);
		if (!!result) {
			this.planListResult.unshift(result);
			return Promise.resolve<PlanDto>(<any>result);
		}
		return Promise.resolve<PlanDto>(<any>null);
	}

	@action
	async updatePlan(input: UpdatePlanInput) {
		let result: PlanDto = await this.planService.updatePlan(input);
		if (!!result) {
			this.planListResult = this.planListResult.map((x: PlanDto) => {
				if (x.pl_id === input.pl_id) x = result;
				return x;
			});
			return Promise.resolve<PlanDto>(<any>result);
		}
		return Promise.resolve<PlanDto>(<any>null);
	}

	@action
	public deletePlan = async (item: PlanDto) => {
		if (!item || !item.pl_id) {
			return false;
		}
		let result = await this.planService.delete(item.pl_id);
		if(!!result){
			let indexDelete= this.planListResult.findIndex(a=>a.pl_id==item.pl_id);
			if(indexDelete>=0){
				this.planListResult.splice(indexDelete,1);
			}
			return true;
		}
		return false;
	}

	//dang lam
	@action
	public acceptPlan = async (item: PlanDto) => {
		if (!item || !item.pl_id) {
			return false;
		}
		
		return false;
	}

	@action
	public changeProcessOfPlanRoom = async ( input: ChangeProcessPlanInput)=>{
		if(!input|| !input.pl_id){
			return false;
		}
		let result= await this.planService.changeProcessOfPlanRoom(input); 
		if(!!result){
			this.planListResult = this.planListResult.map((x: PlanDto) => {
				if (x.pl_id === input.pl_id) x=result;
				return x;
			});
			return Promise.resolve<PlanDto>(<any> result);
		}
		return Promise.resolve<PlanDto>(<any> null);
	}

	@action
	public changeProcessOfManager = async ( input: ChangeProcessPlanInput)=>{
		if(!input|| !input.pl_id){
			return false;
		}
		let result= await this.planService.changeProcessOfManager(input); 
		if(!!result){
			this.planListResult = this.planListResult.map((x: PlanDto) => {
				if (x.pl_id === input.pl_id) x=result;
				return x;
			});
			return Promise.resolve<PlanDto>(<any> result);
		}
		return Promise.resolve<PlanDto>(<any> null);
	}

	@action
	public waitApprove = async ( input: ChangeProcessPlanInput)=>{
		if(!input|| !input.pl_id){
			return false;
		}
		let result= await this.planService.waitApprove(input); 
		if(!!result){
			this.planListResult = this.planListResult.map((x: PlanDto) => {
				if (x.pl_id === input.pl_id) x=result;
				return x;
			});
			return Promise.resolve<PlanDto>(<any> result);
		}
		return Promise.resolve<PlanDto>(<any> null);
	}


	@action
	public getAll = async (pl_title: string | undefined, pl_process: PlanProcess | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
		this.planListResult = [];
		let result = await this.planService.getAll(pl_title, pl_process, skipCount, maxResultCount);
		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.planListResult = [];
			this.totalPlan = result.totalCount;
			for (let item of result.items) {
				this.planListResult.push(item);
			}
		}
	}
	@action
	public comfirmDone =async(input: ConfirmPlanDoneInput) =>{
		let result = await this.planService.confirmDone(input);
		if(result != undefined )
		{
			return result;
		}
		else return false;
	}
	@action
	public getPlanByContractId = async (co_id: number | undefined ) => {
		this.planListResult = [];
		let result = await this.planService.getPlanByContractId(co_id);
		if (result != undefined ) {
			return Promise.resolve<PlanDto>(<any> result);
		}
		return Promise.resolve<PlanDto>(<any> null);
	}
	@action
	public getByListPlan = async (input:number[])=>{
		let result = await this.planService.getByListPlan(input); 
		if(result != undefined && result.items != undefined && result.items != null ){
			return result.items;
		} 
		return [];
	} 
}


export default PlanStore;