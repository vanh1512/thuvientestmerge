import RoleStore from '@stores/roleStore';
import TenantStore from '@stores/tenantStore';
import UserStore from '@stores/userStore';
import SessionStore from '@stores/sessionStore';
import AuthenticationStore from '@stores/authenticationStore';
import AccountStore from '@stores/accountStore';
import FileStore from '@stores/fileStore';
import AuthorStore from '@stores/authorStore';
import AuditLogStore from '@stores/auditLogStore';
import BillingItemStore from '@stores/billingItemStore';
import BorrowReturningStore from '@stores/borrowReturningStore';
import BorrowReturningLogStore from '@stores/borrowReturningLogStore';
import CategoryStore from '@stores/categoryStore';
import CheckStore from '@stores/checkStore';
import CheckItemStore from '@stores/checkItemStore';
import ContractStore from '@stores/contractStore';
import DictionariesStore from '@stores/dictionariesStore';
import BillingStore from '@stores/billingStore';
import DictionaryTypeStore from './dictionaryTypeStore';
import DocumentStore from './documentStore';
import DocumentInforStore from './documentInforStore';
import DocumentLogStore from './documentLogStore';
import FieldsStore from './fieldsStore';
import FileDocumentStore from './fileDocumentStore';
import FilesOfUserStore from './filesUserStore';
import FilesOfUserRolesStore from './filesOfUserRolesStore';
import ResourseStore from './resourseStore';
import FolderLogStore, { FileOrFolderLogStore } from './fileOrFolderLogStore';
import FolderRolesStore from './folderRolesStore';
import MemberStore from './memberStore';
import MemberCardStore from './memberCardStore';
import MemberLogStore from './memberLogStore';
import PlanStore from './planStore';
import PlanDetailStore from './planDetailStore';
import PublisherStore from './publisherStore';
import PublishLogStore from './publishLogStore';
import PublishRegisterStore from './publishRegisterStore';
import PublishSettingStore from './publishSettingStore';
import ReponsitoryStore from './reponsitoryStore';
import StatisticStorageStore from './statisticStorageStore';
import SupplierStore from './supplierStore';
import TopicStore from './topicStore';
import LanguagesStore from './languageStore';
import ReceiptStore from './receiptStore';
import OrganizationStore from './organizationStore';
import GDictionaryStore from './gDictionaryStore';
import PunishStore from './punishStore';
import StatisticStorageLibraryStore from './statisticStorageLibraryStore';
import WebHookSubcription from './hookSubscriptionStore';
import HookSendAttempt from './hookSendAttempt'
import { ApplicationExtDto } from '@src/services/services_autogen';
import ApplicationStore from './appicationStore';
import settingStore from './settingStore';
import SettingStore from './settingStore';
import ResourseRolesStore from './resourseRolesStore';
import DashboardStore from './dashboardStore';
import GDocument from './gDocument';
import Marc21Store from './marc21Store';
import SubFieldMarc21Store from './subFieldMarc21Store';
import Cataloging from '@src/scenes/Manager/Cataloging/components/CreateCataloging';
import CatalogingStore from './catalogingStore';
import CitationDocument from './citaion';


function initializeStores() {

	return {
		authenticationStore: new AuthenticationStore(),
		roleStore: new RoleStore(),
		tenantStore: new TenantStore(),
		userStore: new UserStore(),
		sessionStore: new SessionStore(),
		accountStore: new AccountStore(),
		fileStore: new FileStore(),
		auditLogStore: new AuditLogStore(),
		authorStore: new AuthorStore(),
		billingItemStore: new BillingItemStore(),
		billingStore: new BillingStore(),
		borrowReturningStore: new BorrowReturningStore(),
		borrowReturningLogStore: new BorrowReturningLogStore(),
		categoryStore: new CategoryStore(),
		checkItemStore: new CheckItemStore(),
		checkStore: new CheckStore(),
		contractStore: new ContractStore(),
		dictionariesStore: new DictionariesStore(),
		dictionaryTypeStore: new DictionaryTypeStore(),
		documentStore: new DocumentStore(),
		documentInforStore: new DocumentInforStore(),
		documentLogStore: new DocumentLogStore(),
		fieldsStore: new FieldsStore(),
		fileDocumentStore: new FileDocumentStore(),
		filesOfUserStore: new FilesOfUserStore(),
		filesOfUserRolesStore: new FilesOfUserRolesStore(),
		resourseStore: new ResourseStore(),
		fileOrFolderLogStore: new FileOrFolderLogStore(),
		folderRolesStore: new FolderRolesStore(),
		memberStore: new MemberStore(),
		memberCardStore: new MemberCardStore(),
		memberLogStore: new MemberLogStore(),
		planStore: new PlanStore(),
		planDetailStore: new PlanDetailStore(),
		publisherStore: new PublisherStore(),
		publishLogStore: new PublishLogStore(),
		publishRegisterStore: new PublishRegisterStore(),
		publishSettingStore: new PublishSettingStore(),
		reponsitoryStore: new ReponsitoryStore(),
		statisticStorageStore: new StatisticStorageStore(),
		supplierStore: new SupplierStore(),
		topicStore: new TopicStore(),
		languagesStore: new LanguagesStore(),
		receiptStore: new ReceiptStore(),
		organizationStore: new OrganizationStore(),
		gDictionaryStore: new GDictionaryStore(),
		punishStore: new PunishStore(),
		statisticStorageLibraryStore: new StatisticStorageLibraryStore(),
		webHookSubcriptionStore: new WebHookSubcription(),
		hookSendAttemptStore: new HookSendAttempt(),
		applicationStore: new ApplicationStore(),
		settingStore: new SettingStore(),
		resourseRolesStore: new ResourseRolesStore(),
		dashboardStore: new DashboardStore(),
		gDocument: new GDocument(),
		marc21Store: new Marc21Store(),
		subFieldMarc21Store: new SubFieldMarc21Store(),
		catalogingStore: new CatalogingStore(),
		citationStore: new CitationDocument(),
	};
}
export const stores = initializeStores();
