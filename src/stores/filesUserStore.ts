import { action, observable } from 'mobx';
import http from '@services/httpService';

import { FilesOfUserDto,  UpdateFilesOfUserInput, FilesOfUserService, FileParameter,
	
	} from '@services/services_autogen';
	
class FilesOfUserStore {
	private filesOfUserService :FilesOfUserService;

	@observable totalFilesOfUser: number=0;
	@observable filesOfUserListResult:FilesOfUserDto[]=[];

	constructor() {
		this.filesOfUserService = new FilesOfUserService("",http);
    }
	@action
	public createFilesOfUser = async ( fo_id: number | undefined, filePayload: FileParameter | undefined )=>{
		if(filePayload == undefined || filePayload == null){
		}
		let result: FilesOfUserDto =  await this.filesOfUserService.createFilesOfUser(fo_id,filePayload); 
		}
		return Promise.resolve<FilesOfUserDto>(<any>null);
	}

	@action
	async updateFilesOfUser(input: UpdateFilesOfUserInput) {
		let result:FilesOfUserDto = await this.filesOfUserService.updateFilesOfUser(input);
		if(!!result){
			this.filesOfUserListResult = this.filesOfUserListResult.map((x: FilesOfUserDto) => {
				if (x.fi_us_id === input.fi_us_id) x=result;
				return x;
			});
			return Promise.resolve<FilesOfUserDto>(<any> result);
		}
		return Promise.resolve<FilesOfUserDto>(<any>null);
	}

	@action
	public deleteFilesOfUser = async ( item:FilesOfUserDto)=>{
		if(!item|| !item.fi_us_id){
			return false;
		}
		return false;
	}

	@action
	public getAll = async (us_id: number | undefined,fi_us_name: string | undefined, fo_id: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined)=>{
		this.filesOfUserListResult=[];
		let result = await this.filesOfUserService.getAll(us_id,fi_us_name, fo_id, skipCount, maxResultCount); 
		if(result != undefined && result.items != undefined && result.items != null && result.totalCount != undefined && result.totalCount != null){
			this.filesOfUserListResult=[];
			this.totalFilesOfUser = result.totalCount;
			for(let item of result.items){
				this.filesOfUserListResult.push(item);
			} 
		} 
	} 
	
}

export default FilesOfUserStore;
