import { AppstoreOutlined, FileAddOutlined, HomeOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';
import { eUserType } from '@src/lib/enumconst';

const prefixManager = RouterPath.admin_borrow;
export const appBorrowRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.Borrow_MemberBorror,
	AppConsts.Permission.Borrow_BorrowReturing],
	title: L('quan_ly_muon_tra'),
	name: 'Quản lý mượn trả',
	icon: FileAddOutlined,
	showInMenu: true,
	component: [

		{
			path: prefixManager + '/memberBorrow',
			permission: AppConsts.Permission.Borrow_MemberBorror,
			title: L('doc_gia_muon'),
			name: 'Độc giả mượn',
			icon: AppstoreOutlined,
			showInMenu: true,
			//userType: eUserType.Manager.num,

			component: LoadableComponent(() => import('@scenes/Manager/Borrow/MemberBorrowReturning'))
		},
		{
			path: prefixManager + '/borrowreturing',
			permission: AppConsts.Permission.Borrow_BorrowReturing,
			title: L('quan_ly_muon_tra'),
			name: 'Quản lý mượn trả',
			icon: AppstoreOutlined,
			showInMenu: true,
			//userType: eUserType.Manager.num,

			component: LoadableComponent(() => import('@src/scenes/Manager/Borrow/ManagerBorrowReturning/ManagerBorrowReturning'))
		},

	]
};


