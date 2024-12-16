import { AppstoreOutlined, CheckSquareOutlined, HomeOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';

const prefixManager = RouterPath.admin_check;
export const appCheckRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.Check_Check,
	AppConsts.Permission.Check_WarningCheck,
	AppConsts.Permission.Check_Check_CatalogingCheck,],
	title: L('kiem_ke'),
	name: 'Kiểm kê',
	icon: CheckSquareOutlined,
	showInMenu: true,
	component: [

		{
			path: prefixManager + '/check',
			permission: AppConsts.Permission.Check_Check,
			title: L('kiem_ke'),
			name: 'Checking',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Check'))
		},
		{
			path: prefixManager + '/warning-check',
			permission: AppConsts.Permission.Check_WarningCheck,
			title: L('canh_bao_tai_lieu_den_dot_kiem_ke'),
			name: 'Checking',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/WarningCheck'))
		},
		{
			path: prefixManager + '/cataloging-checkitems',
			permission: AppConsts.Permission.Check_Check_CatalogingCheck,
			title: L('bien_muc_ho_so_kiem_ke'),
			name: 'Biên mục hồ sơ',
			icon: AppstoreOutlined,
			showInMenu: false,
			component: LoadableComponent(() => import('@scenes/Manager/Check/CatalogingCheckItem'))
		},
	]
};


