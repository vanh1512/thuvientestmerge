import LoadableComponent from '../Loadable/index';
import { UserOutlined, TagsOutlined, AppstoreOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import AppConsts, { RouterPath } from '@src/lib/appconst';

const prefixSystem = RouterPath.admin_system;
export const appSystemRouters: any = {
        path: prefixSystem + '',
        permission: [AppConsts.Permission.System_SystemApplications,
        AppConsts.Permission.System_Users,
        AppConsts.Permission.System_Organization,
        AppConsts.Permission.System_Roles,
        AppConsts.Permission.System_Tenants,
        AppConsts.Permission.System_AuditLog,
        AppConsts.Permission.System_Setting,
        AppConsts.Permission.System_WebHookSubcription,],
        title: L("he_thong"),
        name: "System",
        icon: SettingOutlined,
        showInMenu: true,
        component: [
                {
                        path: prefixSystem + "/applications",
                        permission: AppConsts.Permission.System_SystemApplications,
                        title: (L('ung_dung')),
                        name: "Applications",
                        icon: AppstoreOutlined,
                        showInMenu: true,
                        component: LoadableComponent(() => import('@src/scenes/SystemManager/SystemApplications'))
                },

                {
                        path: prefixSystem + '/users',
                        permission: AppConsts.Permission.System_Users,
                        title: (L('nguoi_dung')),
                        name: 'user',
                        icon: UserOutlined,
                        showInMenu: true,
                        component: LoadableComponent(() => import('@scenes/SystemManager/Users')),
                },
                {
                        path: prefixSystem + '/organization',
                        permission: AppConsts.Permission.System_Organization,
                        title: (L('co_cau_to_chuc')),
                        name: 'organization',
                        icon: AppstoreOutlined,
                        showInMenu: true,
                        component: LoadableComponent(() => import('@src/scenes/SystemManager/Organization')),
                },
                {
                        path: prefixSystem + '/roles',
                        permission: AppConsts.Permission.System_Roles,
                        title: (L('vai_tro')),
                        name: 'role',
                        icon: TagsOutlined,
                        showInMenu: true,
                        component: LoadableComponent(() => import('@scenes/SystemManager/Roles')),
                },
                
                {
                        path: prefixSystem + '/auditlogs',
                        permission: AppConsts.Permission.System_AuditLog,
                        title: (L('nhat_ky_dang_nhap')),
                        name: 'Audit Log',
                        icon: AppstoreOutlined,
                        showInMenu: true,
                        component: LoadableComponent(() => import('@scenes/SystemManager/AuditLog')),
                },
                {
                        path: prefixSystem + '/setting',
                        permission: AppConsts.Permission.System_Setting,
                        title: (L('cai_dat')),
                        name: 'Setting',
                        icon: ToolOutlined,
                        showInMenu: true,
                        component: LoadableComponent(() => import('@scenes/SystemManager/Setting')),
                },
                {
                        path: prefixSystem + '/websubcription',
                        permission: AppConsts.Permission.System_WebHookSubcription,
                        title: 'Web Subcription',
                        name: 'Web Subcription',
                        icon: AppstoreOutlined,
                        showInMenu: true,
                        component: LoadableComponent(() => import('@scenes/SystemManager/WebHookSubcription'))
                },


        ]
};

