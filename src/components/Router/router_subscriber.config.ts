import { AppstoreOutlined, HomeOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';

const prefixManager = RouterPath.admin_subscriber;
export const appSubscriberRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.Subscriber_Member,
	AppConsts.Permission.Subscriber_MemberCard,
	AppConsts.Permission.Subscriber_MemberLog,],
	title: L('quan_ly_doc_gia'),
	name: 'Quản lý độc giả',
	icon: UserOutlined,
	showInMenu: true,
	component: [

		{
			path: prefixManager + '/member',
			permission: AppConsts.Permission.Subscriber_Member,
			title: L('Member'),
			name: 'Member',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Member'))
		},
		{
			path: prefixManager + '/memberCard',
			permission: AppConsts.Permission.Subscriber_MemberCard,
			title: L('MemberCard'),
			name: 'MemberCard',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/MemberCard'))
		},
		{
			path: prefixManager + '/memberlog',
			permission: AppConsts.Permission.Subscriber_MemberLog,
			title: L('MemberLog'),
			name: 'MemberLog',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/MemberLog'))
		},
	]
};


