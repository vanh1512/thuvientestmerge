import { action, observable } from 'mobx';
import http from '@services/httpService';

import { BillingItemDto, ContractDto, ContractService, ContractStatus, CreateContractInput, UpdateContractInput,
	
	} from '@services/services_autogen';
	
class ContractStore {
	private contractService :ContractService;

	@observable totalContract: number=0;
	@observable contractListResult:ContractDto[]=[];

	constructor() {
		this.contractService = new ContractService("",http);
    }

	@action
	public createContract = async ( input: CreateContractInput)=>{
		if(input == undefined || input == null){
			return Promise.resolve<ContractDto>(<any>null);
		}
		let result: ContractDto =  await this.contractService.createContract(input); 
		if(!!result){
			this.contractListResult.unshift(result);
			return Promise.resolve<ContractDto>(<any> result);
		}
		return Promise.resolve<ContractDto>(<any>null);
	}

	@action
	async updateContract(input: UpdateContractInput) {
		let result:ContractDto = await this.contractService.updateContract(input);
		if(!!result){
			this.contractListResult = this.contractListResult.map((x: ContractDto) => {
				if (x.co_id === input.co_id) x=result;
				return x;
			});
			return Promise.resolve<ContractDto>(<any> result);
		}
		return Promise.resolve<ContractDto>(<any>null);
	}

	@action
	public getAll = async (pl_id: number | undefined,co_status: ContractStatus | undefined,co_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined)=>{
		this.contractListResult=[];
		let result = await this.contractService.getAll(pl_id,co_search,co_status,skipCount, maxResultCount); 
		if(result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null){
			this.contractListResult=[];
			this.totalContract = result.totalCount;
			for(let item of result.items){
				this.contractListResult.push(item);
			} 
		} 
	} 
	@action
	public getAllBillingItem = async (co_id: number | undefined)=>{
		let listItem:BillingItemDto[] = []; 
		let result = await this.contractService.getAllBillingItem(co_id); 
		if(result != undefined && result.items != undefined ){
			listItem  = result.items ;
		} 
		return listItem;
	} 

	@action
	async confimDone(input: ContractDto){
		let result:ContractDto = await this.contractService.confirmDone(input.co_id);
		if(result != undefined){ return result;}
	}
	@action
	async delete(co_id: number|undefined){
		if(co_id != undefined){
			await this.contractService.delete(co_id); 
		}
	}
	
	
}

export default ContractStore;
