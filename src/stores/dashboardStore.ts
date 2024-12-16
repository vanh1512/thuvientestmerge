import { action } from 'mobx';
import http from '@services/httpService';
import { DashboardDto, DashboardService } from '@services/services_autogen';
export class DashboardStore {
	
	private dashboardService: DashboardService;

	constructor() {
		this.dashboardService = new DashboardService("", http);
	}

	@action
	public getAll = async () => {
		let result:DashboardDto = await this.dashboardService.getDashboard();
		if (result != undefined) {
			return Promise.resolve<DashboardDto>(<any>result);
		}
		return Promise.resolve<DashboardDto>(<any>null);
	}

}

export default DashboardStore;