import { action, observable } from 'mobx';
import http from '@services/httpService';

import { FilesOfUserRolesDto, CreateFilesOfUserRolesInput, UpdateFilesOfUserRolesInput, FilesOfUserRolesService,
	
	} from '@services/services_autogen';
	
class FilesOfUserRolesStore {
	private filesOfUserRolesService :FilesOfUserRolesService;

	@observable totalFilesOfUserRoles: number=0;
	@observable filesOfUserRolesListResult:FilesOfUserRolesDto[]=[];
	@observable filesOfUserRolesItemListResult:FilesOfUserRolesDto[]=[];

	constructor() {
		this.filesOfUserRolesService = new FilesOfUserRolesService("",http);
    }

	@action
	public createFilesOfUserRoles = async ( input: CreateFilesOfUserRolesInput)=>{
		if(input == undefined || input == null){
			return false;
		}
		let result: boolean =  await this.filesOfUserRolesService.createFilesOfUserRoles(input); 
		if(!!result){
			return result;
		}
		return false;
	}

	@action
	async updateFilesOfUserRoles(input: UpdateFilesOfUserRolesInput) {
		let result:FilesOfUserRolesDto = await this.filesOfUserRolesService.updateFilesOfUserRoles(input);
		if(!!result){
			this.filesOfUserRolesListResult = this.filesOfUserRolesListResult.map((x: FilesOfUserRolesDto) => {
				if (x.fi_us_id === input.fi_us_id) x=result;
				return x;
			});
			return Promise.resolve<FilesOfUserRolesDto>(<any> result);
		}
		return Promise.resolve<FilesOfUserRolesDto>(<any>null);
	}

	@action
	public getAll = async (us_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined)=>{
		this.filesOfUserRolesListResult=[];
		let result = await this.filesOfUserRolesService.getAll(us_id, skipCount, maxResultCount); 
		if(result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null){
			this.filesOfUserRolesListResult=[];
			this.totalFilesOfUserRoles = result.totalCount;
			for(let item of result.items){
				this.filesOfUserRolesListResult.push(item);
			} 
		} 
	} 
	@action 
	public getAllUserRolesById =async (item : number|undefined) => {
		this.filesOfUserRolesItemListResult = [];
		// this.totalFilesOfUserRoles = 0;
		let result = await this.filesOfUserRolesService.getAllUserRolesById(item);

		if (result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null) {
			this.totalFilesOfUserRoles = result.totalCount
			this.filesOfUserRolesItemListResult = result.items!;
		}
		return this.filesOfUserRolesItemListResult;
	}
		
	
	
	
}

export default FilesOfUserRolesStore;
