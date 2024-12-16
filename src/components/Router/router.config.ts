import { HomeOutlined, } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import AppConsts, { RouterPath } from '@src/lib/appconst';
import { appBorrowRouters } from './router_borrow.config';
import { appBuyRouters } from './router_buy.config';
import { appCheckRouters } from './router_check.config';
import { appDocumentRouters } from './router_document.config';
import { appGeneralRouters } from './router_general.config';
import { guestRouter } from './router_guest.config';

import { appReportRouters } from './router_report.config';
import { appResourceRouters } from './router_resource.config';
import { appSubscriberRouters } from './router_subscriber.config';
import { appSystemRouters } from './router_system.config';

export const appRouters: any = [

	{
		path: RouterPath.admin_drashboard,
		name: 'dashboard',
		permission: '',
		title: 'HomePage',
		icon: HomeOutlined,
		showInMenu: true,
		component: LoadableComponent(() => import('@src/scenes/Dashboard/NewHome')),
	},
	appResourceRouters,
	appBorrowRouters,
	appDocumentRouters,
	appSubscriberRouters,
	appBuyRouters,
	appCheckRouters,
	appReportRouters,
	appGeneralRouters,
	appSystemRouters,
	{
		path: RouterPath.admin_information,
		permission: '',
		title: 'UserInformation',
		name: 'UserInformation',
		icon: 'info-circle',
		showInMenu: false,
		component: LoadableComponent(() => import('@scenes/UserInformation'))
	},
	{
		path: RouterPath.admin_logout,
		permission: '',
		title: 'Logout',
		name: 'logout',
		icon: 'info-circle',
		showInMenu: false,
		component: LoadableComponent(() => import('@components/Logout'))
	},
];


export const routers = [...guestRouter, ...appRouters];
