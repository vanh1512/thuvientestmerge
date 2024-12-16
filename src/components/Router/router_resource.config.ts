import { AppstoreOutlined, FileOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';

const prefixManager = RouterPath.admin_resource;


export const appResourceRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.Resources_FilesOfUser,
	AppConsts.Permission.Resources_FilesSharedWithUser,],
	title: L("Resources"),
	name: 'Tài nguyên',
	icon: FileOutlined,
	showInMenu: true,
	component: [

		{
			path: prefixManager + '/fileDocument',
			permission: '',
			title: L('FileDocument'),
			name: L('FileDocument'),
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/FileDocument'))
		},
		{
			path: prefixManager + '/filesOfUser',
			permission: AppConsts.Permission.Resources_FilesOfUser,
			title: L('MyData'),
			name: 'Dữ liệu của tôi',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Resource/FilesOfUser'))
		},
		{
			path: prefixManager + '/filesSharedWithUser',
			permission: AppConsts.Permission.Resources_FilesSharedWithUser,
			title: L('DataShareWithMe'),
			name: 'Dữ liệu được chia sẻ với tôi',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@scenes/Manager/Resource/FilesShareWithUsers'))
		},
	]
};


