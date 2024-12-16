import { stores } from '@src/stores/storeInitializer';
import { BillingDto, DocumentDto, DocumentInforDto, Marc21Dto, PlanDto } from '@src/services/services_autogen';


export default class GetNameItem {
	state = {
		isLoading: false,
	};

	static getNameDocument = (id: number) => {
		const { documentListResult } = stores.documentStore;
		let selected_item = documentListResult.find((item: DocumentDto) => item.do_id == id);
		if (selected_item === undefined || selected_item.do_title === undefined) {
			return "";
		} else {
			return selected_item.do_title;
		}
	}
	static getNamePlan = (id: number) => {
		const { planListResult } = stores.planStore;
		let selected_item = planListResult.find((item: PlanDto) => item.pl_id == id);
		if (selected_item === undefined || selected_item.pl_title === undefined) {
			return "";
		} else {
			return selected_item.pl_title;
		}
	}
	static getNamePlaMARC21 = (id: number) => {
		const { marc21ListResult } = stores.marc21Store;
		let selected_item = marc21ListResult.find((item: Marc21Dto) => item.mar_id == id);
		if (selected_item === undefined || selected_item.mar_code === undefined) {
			return "";
		} else {
			return selected_item.mar_code;
		}
	}
	static getNameDKCB = (id: number) => {
		const { documentInforListResult } = stores.documentInforStore;
		let selected_item = documentInforListResult.find((item: DocumentInforDto) => item.do_in_id == id);
		if (selected_item === undefined || selected_item.dkcb_code === undefined) {
			return "";
		} else {
			return selected_item.dkcb_code;
		}
	}
	static getCodeBilling = (id: number) => {
		const { billingListResult } = stores.billingStore;
		let selected_item = billingListResult.find((item: BillingDto) => item.bi_id == id);
		if (selected_item === undefined || selected_item.bi_code === undefined) {
			return "";
		} else {
			return selected_item.bi_code;
		}
	}
}





