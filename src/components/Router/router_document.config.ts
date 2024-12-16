import { AppstoreOutlined, BookOutlined, HomeOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';

const prefixManager = RouterPath.admin_document;
export const appDocumentRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.Document_Document,
	AppConsts.Permission.Document_DocumentInfor,],
	title: L('quan_ly_sach_bao_tai_lieu'),
	name: 'Quản lý sách, báo,...,tài liệu',
	icon: BookOutlined,
	showInMenu: true,
	component: [

		{
			path: prefixManager + '/document',
			permission: AppConsts.Permission.Document_Document,
			title: L('tai_lieu'),
			name: 'Doccument',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Document'))
		},
		{
			path: prefixManager + '/documentInfor',
			permission: AppConsts.Permission.Document_DocumentInfor,
			title: L('thong_tin_tai_lieu'),
			name: 'DocumentInfor',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/DocumentInfor'))
		},
		{
			path: prefixManager + '/quote',
			permission: AppConsts.Permission.Document_DocumentInfor,
			title: L('trich_dan'),
			name: 'Quote',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Citation'))
		},
	]
};


