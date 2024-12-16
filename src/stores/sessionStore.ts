import { action, observable } from 'mobx';
import { AuthorAbtractDto, CategoryAbtractDto, CreateUpdateMemberCardSesionInput, DictionaryTypeAbtractDto, FieldsAbtractDto, GetCurrentLoginInformationsOutput, GetInforToManagerOutput, ICategoryAbtractDto, IResponsitoryAbtractDto, ItemAuthor, ItemField, ItemLanguages, ItemUser, LangAbtractDto, MemberCardDto, PublisherAbtractDto, ResponsitoryAbtractDto, SessionService, SupplierAbtractDto, TopicAbtractDto, UpdateMemberAvatarSesionInput, UpdateMemberSesionInput, UserDto, UserLoginInfoDto } from '@services/services_autogen';
import http from '@services/httpService';

export class TreeAbtractCategoryDto extends CategoryAbtractDto {
	key: number;
	title: string;

	value: number;
	children: TreeAbtractCategoryDto[] = [];
	nrchildren = () => {
		let total = this.children.length;
		this.children.forEach(element => {
			total += element.nrchildren();
		});
		return total;
	}
	constructor(data?: ICategoryAbtractDto) {
		super(data);
		this.key = this.ca_id;
		this.title = this.ca_title!;
		this.value = this.key!;
	}

}
export class TreeAbtractRepositoryDto extends ResponsitoryAbtractDto {
	key: number;
	title: string;

	value: number;
	children: TreeAbtractRepositoryDto[] = [];
	nrchildren = () => {
		let total = this.children.length;
		this.children.forEach(element => {
			total += element.nrchildren();
		});
		return total;
	}
	constructor(data?: IResponsitoryAbtractDto) {
		super(data);
		this.key = this.re_id;
		this.title = this.re_name!;
		this.value = this.key!;
	}

}
class SessionStore {
	private sessionService: SessionService;
	@observable currentLogin: GetCurrentLoginInformationsOutput = new GetCurrentLoginInformationsOutput();
	private inforManager: GetInforToManagerOutput | undefined = undefined;
	private users: UserDto[] = [];
	private treeCategoryAbtractDto: TreeAbtractCategoryDto | undefined = undefined;
	private treeAbtractRepositoryDto: TreeAbtractRepositoryDto | undefined = undefined;
	constructor() {
		this.sessionService = new SessionService("", http);
	}
	@action
	async getCurrentLoginInformations() {
		let result = await this.sessionService.getCurrentLoginInformations();
		this.currentLogin = result;
		if (result != undefined && result.users != undefined) {
			this.users = result.users.filter(item => item.isActive == true);
		}
	}

	@action
	async updateMemberAvatar(item: UpdateMemberAvatarSesionInput) {
		let result = await this.sessionService.updateMemberAvatar(item);
		if (result != undefined) {
			return result;
		}
	}
	@action
	getUserAvatarByUserId(us_id: number) {
		if (this.currentLogin != undefined && this.currentLogin.users != undefined && this.currentLogin.users.length > 0) {
			let user = this.currentLogin.users.find(item => us_id == item.id);
			if (user != undefined) {
				return user.us_avatar;
			}
		}
	}

	@action
	async createMemberCard(item: CreateUpdateMemberCardSesionInput) {
		if (item == undefined || item == null) {
			return Promise.resolve<MemberCardDto>(<any>null);
		}
		let result = await this.sessionService.createMemberCard(item);
		if (!!result) {
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}
	@action
	async updateMemberCard(input: CreateUpdateMemberCardSesionInput) {
		let result: MemberCardDto = await this.sessionService.updateMemberCard(input);
		if (!!result) {
			return Promise.resolve<MemberCardDto>(<any>result);
		}
		return Promise.resolve<MemberCardDto>(<any>null);
	}
	isUserLogin(): boolean {
		if (this.currentLogin !== undefined && this.currentLogin.user !== undefined) {
			return true;
		}
		return false;
	}
	getUserLogin(): UserLoginInfoDto {
		if (this.isUserLogin()) {
			return this.currentLogin.user!;
		}
		return <any>undefined;
	}

	getAllUsers = (): UserDto[] => {
		if (this.currentLogin !== undefined && this.currentLogin.users !== undefined) {
			return this.currentLogin.users;
		}
		return [];
	}
	getUserNameById = (id: number): string => {
		let selected_item = this.users.find((item: UserDto) => item.id == id);
		if (selected_item !== undefined) {
			return selected_item.name;
		}
		return "";
	}
	getMemberNameById = (id: number): string => {
		let selected_item = this.users.find((item: UserDto) => item.me_id == id);
		if (selected_item !== undefined) {
			return selected_item.name;
		}
		return "";
	}
	getTopic = (): TopicAbtractDto[] => {
		if (this.isUserLogin()) {
			return this.currentLogin.topics!;
		}
		return [];
	}
	getDictionaryType = (): DictionaryTypeAbtractDto[] => {
		if (this.isUserLogin()) {
			return this.currentLogin.dictionaryType!.filter(item => item.dic_ty_is_delete == false);
		}
		return [];
	}
	private makeTree(list: CategoryAbtractDto[]) {
		// let itemParent = list.find(item => item.ca_id_parent == -1);
		let root: CategoryAbtractDto = new CategoryAbtractDto();
		root.ca_id = -1;
		root.ca_title = "Danh mục";
		let categoryParent = new TreeAbtractCategoryDto(root);
		this.createCatTree(categoryParent, list);
		return categoryParent;
	}
	private createCatTree(categoryParent: TreeAbtractCategoryDto, list: CategoryAbtractDto[]) {

		if (categoryParent === undefined) {
			return;
		}
		let listChild = list.filter(item => item.ca_id_parent == categoryParent.ca_id);
		for (let i = 0; i < listChild.length; i += 1) {
			let item = listChild[i];
			let roots: TreeAbtractCategoryDto = new TreeAbtractCategoryDto(item);
			this.createCatTree(roots, list);
			categoryParent.children.push(roots);
		}
	}
	getCategories = (): CategoryAbtractDto[] => {
		if (this.isUserLogin() == true && this.currentLogin.categories !== undefined) {
			if (this.treeCategoryAbtractDto === undefined) {
				this.treeCategoryAbtractDto = this.makeTree(this.currentLogin.categories.filter(item => item.ca_enable == true))
			}
			return this.currentLogin.categories!;
		}
		return [];
	}
	getTreeCategories = (): TreeAbtractCategoryDto => {
		if (this.treeCategoryAbtractDto === undefined) {
			this.getCategories();
		}
		if (this.treeCategoryAbtractDto == undefined) {
			return new TreeAbtractCategoryDto(new CategoryAbtractDto());
		}
		return this.treeCategoryAbtractDto;
	}
	getTreeResponsitoriesToManager = (): TreeAbtractRepositoryDto | undefined => {
		if (this.treeAbtractRepositoryDto === undefined || this.inforManager!.responsitories !== undefined) {
			this.getResponsitoriesToManager();
		}
		if (this.treeAbtractRepositoryDto == undefined) {
			return new TreeAbtractRepositoryDto(new ResponsitoryAbtractDto());
		}
		return this.treeAbtractRepositoryDto;

	}
	getFields = (): FieldsAbtractDto[] => {
		if (this.isUserLogin()) {
			return this.currentLogin.fields!;
		}
		return [];
	}


	getNameAuthor = (au_id_arr: ItemAuthor[] | undefined) => {
		let author_name = "";
		if (au_id_arr === undefined) {
			return "";
		} else {
			let author_selected = au_id_arr.map((item: ItemAuthor) => item.name);
			author_name = author_selected.join(', ');
		}
		return author_name;
	}
	getNameParticipant = (us_id_arr: ItemUser[] | undefined) => {
		let user_name = "";
		if (us_id_arr === undefined) {
			return "";
		} else {
			let user_selected = us_id_arr.map((item: ItemUser) => item.name);
			user_name = user_selected.join(', ') + '.';
		}
		return user_name;
	}
	getNameField = (field_arr: ItemField[] | undefined) => {
		let field_name = "";
		if (field_arr === undefined) {
			return "";
		} else {
			let field_selected = field_arr.map((item: ItemField) => item.name);
			field_name = field_selected.join(', ') + '.';
		}
		return field_name;
	}
	getNameLanguage = (lang_arr: ItemLanguages[] | undefined) => {
		let langs = "";
		if (lang_arr === undefined) {
			return "";
		} else {
			let lang_selected = lang_arr.map((item: ItemLanguages) => item.name);
			langs = lang_selected.join(', ');
		}
		return langs;
	}

	getNamePublisher = (id: number) => {
		const publisherListResult = this.getPublisherToManager();
		let selected_item = publisherListResult.find((item: PublisherAbtractDto) => item.pu_id == id);
		if (selected_item === undefined || selected_item.pu_name === undefined) {
			return "";
		}
		return selected_item.pu_name;

	}
	getNameRepository = (id: number) => {
		let selected_item = this.getResponsitoriesToManager().find((item: ResponsitoryAbtractDto) => item.re_id == id);
		if (selected_item === undefined || selected_item.re_name === undefined) {
			return "";
		}
		return selected_item.re_code + " . " + selected_item.re_name;

	}

	getNameSupplier = (id: number) => {
		const supplierListResult = this.getSupplierToManager();
		let selected_item = supplierListResult.find((item: SupplierAbtractDto) => item.su_id == id);
		if (selected_item == undefined || selected_item.su_name == undefined) {
			return "";
		} else {
			return selected_item.su_name;
		}
	}

	getNameCategory = (id: number) => {
		let selected_item = this.getCategories().find((item: CategoryAbtractDto) => item.ca_id == id);
		if (selected_item === undefined || selected_item.ca_title === undefined) {
			return "";
		} else {
			return selected_item.ca_title;
		}
	}


	getNameTopic = (id: number) => {
		const topicListResult = this.getTopic();
		let selected_item = topicListResult.find((item: TopicAbtractDto) => item.to_id == id);
		if (selected_item === undefined || selected_item.to_name === undefined) {
			return "";
		} else {
			return selected_item.to_name;
		}
	}

	//------------------------------------GetIMemberSesionDto--------------------------------------
	@action
	public getMemberInformations = async () => {
		let result = await this.sessionService.getMemberInformations();
		return result;
	}
	@action
	public updateMemberInformation = async (body: UpdateMemberSesionInput) => {
		let result = await this.sessionService.updateMemberInformation(body);
		return result;
	}
	//------------------------------------GetInforManager--------------------------------------
	async getInformationsToManager() {
		this.inforManager = await this.sessionService.getInformationsToManager();
		this.getTreeResponsitoriesToManager();
		this.getTreeCategories();
	}
	getAuthorToManager = (): AuthorAbtractDto[] => {
		if (this.inforManager === undefined || this.inforManager.authors === undefined) {
			return [];
		}
		else{
			return this.inforManager.authors.filter(item => item.au_is_deleted == false);
		}
	}
	getPublisherToManager = (): PublisherAbtractDto[] => {
		if (this.inforManager === undefined || this.inforManager.publisher === undefined) {
			return [];
		}
		return this.inforManager.publisher!;
	}
	getSuppliersToManager = (): SupplierAbtractDto[] => {
		if (this.inforManager === undefined || this.inforManager.suppliers === undefined) {
			return [];
		}
		return this.inforManager.suppliers!;
	}
	getResponsitoriesToManager = (): ResponsitoryAbtractDto[] => {
		if (this.inforManager != undefined && this.inforManager!.responsitories != undefined) {
			if (this.treeAbtractRepositoryDto == undefined) {
				this.treeAbtractRepositoryDto = this.makeTreeRepository(this.inforManager.responsitories.filter(item => item.re_is_delete == false));
			}
			return this.inforManager.responsitories.filter(item => item.re_is_delete == false);
		}
		return [];
	}

	getSupplierToManager = (): SupplierAbtractDto[] => {
		if (this.inforManager == undefined || this.inforManager.suppliers == undefined) {
			return [];
		}
		return this.inforManager.suppliers.filter(item => item.su_is_delete == false);
	}
	getLangsToManager = (): LangAbtractDto[] => {
		if (this.inforManager == undefined || this.inforManager.langs == undefined) {
			return [];
		}
		return this.inforManager.langs!;
	}



	private makeTreeRepository(list: ResponsitoryAbtractDto[]) {
		// let itemParent = list.find(item => item.re_id_parent == -1);
		let root: ResponsitoryAbtractDto = new ResponsitoryAbtractDto();
		root.re_id = -1;
		root.re_name = "Kho vật lý";
		let repositoryParent = new TreeAbtractRepositoryDto(root);
		this.createRepositoryTree(repositoryParent, list);
		return repositoryParent;
	}
	private createRepositoryTree(categoryParent: TreeAbtractRepositoryDto, list: ResponsitoryAbtractDto[]) {

		if (categoryParent === undefined) {
			return;
		}
		let listChild = list.filter(item => item.re_id_parent == categoryParent.re_id);
		for (let i = 0; i < listChild.length; i += 1) {
			let item = listChild[i];
			let roots: TreeAbtractRepositoryDto = new TreeAbtractRepositoryDto(item);
			this.createRepositoryTree(roots, list);
			categoryParent.children.push(roots);
		}
	}
}
//------------------------------------Member--------------------------------------\

export default SessionStore;
