import { AppstoreOutlined, ContainerOutlined, HomeOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';

const prefixManager = RouterPath.admin_buy;
export const appBuyRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.Buy_Plan,
	AppConsts.Permission.Buy_Buying,
	AppConsts.Permission.Buy_Receipt,
	AppConsts.Permission.Buy_Receipt_Cataloging,],
	title: L('quan_ly_mua_sam'),
	name: 'Quản lý mua sắm',
	icon: ContainerOutlined,
	showInMenu: true,
	component: [

		{
			path: prefixManager + '/plan',
			permission: AppConsts.Permission.Buy_Plan,
			title: L('ke_hoach_mua_sam'),
			name: 'Kế hoạch mua sắm',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Buy/Plan'))
		},
		{
			path: prefixManager + '/buying',
			permission: AppConsts.Permission.Buy_Buying,
			title: L('ho_so_mua_ban'),
			name: 'Hồ sơ mua bán',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Buy/Contract'))
		},
		{
			path: prefixManager + '/importing-receipt',
			permission: AppConsts.Permission.Buy_Receipt,
			title: L('phieu_nhap_sach'),
			name: 'Phiếu nhập sách',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Buy/Receipt'))
		},
		{
			path: prefixManager + '/cataloging-record',
			permission: AppConsts.Permission.Buy_Receipt,
			title: L('Nhập sách'),
			name: 'Nhập sách',
			icon: AppstoreOutlined,
			showInMenu: false,
			component: LoadableComponent(() => import('@scenes/Manager/Buy/CatalogingRecord'))
		},
		{
			path: prefixManager + '/cataloging-records',
			permission: AppConsts.Permission.Buy_Receipt_Cataloging,
			title: L('bien_muc_tai_lieu'),
			name: 'Biên mục tài liệu',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Cataloging'))
		},


	]
};


