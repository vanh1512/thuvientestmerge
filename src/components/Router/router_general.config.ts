import { AppstoreOutlined, HomeOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';

const prefixManager = RouterPath.admin_general;
export const appGeneralRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.General_Author,
	AppConsts.Permission.General_Category,
	AppConsts.Permission.General_Dictionary,
	AppConsts.Permission.General_Repository,
	AppConsts.Permission.General_Fields,
	AppConsts.Permission.General_Supplier,
	AppConsts.Permission.General_Topic,
	AppConsts.Permission.General_Publisher,
	AppConsts.Permission.General_DocumentLanguages],
	title: L('quan_ly_chung'),
	name: 'Quản lý chung',
	icon: AppstoreOutlined,
	showInMenu: true,
	component: [
		{
			path: prefixManager + '/author',
			permission: AppConsts.Permission.General_Author,
			title: (L('tac_gia')),
			name: 'Author',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Author'))
		},
		{
			path: prefixManager + '/category',
			permission: AppConsts.Permission.General_Category,
			title: (L('danh_muc')),
			name: (L('danh_muc')),
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Category'))
		},
		{
			path: prefixManager + '/dictionary',
			permission: AppConsts.Permission.General_Dictionary,
			title: (L('tu_dien')),
			name: (L('tu_dien')),
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/DictionaryType'))
		},
		{
			path: prefixManager + '/repository',
			permission: AppConsts.Permission.General_Repository,
			title: (L('kho_vat_ly')),
			name: (L('kho_vat_ly')),
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Repository'))
		},
		{
			path: prefixManager + '/fields',
			permission: AppConsts.Permission.General_Fields,
			title: L('DocumentField'),
			name: 'Fields',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Fields'))
		},
		{
			path: prefixManager + '/supplier',
			permission: AppConsts.Permission.General_Supplier,
			title: L('Supplier'),
			name: 'Supplier',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Supplier'))
		},
		{
			path: prefixManager + '/topic',
			permission: AppConsts.Permission.General_Topic,
			title: L('Topic'),
			name: 'Topic',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Topic'))
		},
		{
			path: prefixManager + '/publisher',
			permission: AppConsts.Permission.General_Publisher,
			title: L('Publisher'),
			name: 'Publisher',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Publisher'))
		},
		{
			path: RouterPath.admin_general_languages,
			permission: AppConsts.Permission.General_DocumentLanguages,
			title: L('DocumentLanguageManagement'),
			name: 'Author',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/DocumentLanguages'))
		},
		{
			path: RouterPath.admin_general_marc21,
			// permission: AppConsts.Permission.General_DocumentLanguages,
			title: L('kho_mau_marc_21'),
			name: 'Marc21',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Marc21'))
		},
		{
			path: RouterPath.admin_general_sup_field_marc21,
			// permission: AppConsts.Permission.General_DocumentLanguages,
			title: L('truong_con_kho_mau_marc21'),
			name: 'Marc21',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/SubFieldMarc21'))
		},
		{
			path: RouterPath.admin_general_punish,
			// permission: AppConsts.Permission.General_DocumentLanguages,
			title: L('Punish'),
			name: 'Punish',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/General/Punish'))
		},
	]
};


