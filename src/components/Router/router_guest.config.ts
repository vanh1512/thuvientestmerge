import { AppstoreOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import { L } from '@src/lib/abpUtility';
import { RouterPath } from '@src/lib/appconst';

export const guestRouter: any = [

	{
		path: RouterPath.g_opacpage,
		name: 'opacpage',
		title: L('Opac Page'),
		component: LoadableComponent(() => import('@scenes/OpacPage')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_rules,
		name: 'opacpage-rules',
		title: L('Opac Page Rules'),
		component: LoadableComponent(() => import('@scenes/OpacPage/DetailPage/Rules')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_timeOpen,
		name: 'opacpage-timeOpen',
		title: L('Opac Page Time Open'),
		component: LoadableComponent(() => import('@scenes/OpacPage/DetailPage/TimeOpenPage')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_extend,
		name: 'opacpage-timeOpen',
		title: L('Opac Page gia hạn tài liệu'),
		component: LoadableComponent(() => import('@src/scenes/OpacPage/DetailPage/PageExtend')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_instruction_extend,
		name: 'opacpage-instruction-extend',
		title: L('Opac Page hướng dẫn gia hạn tài liệu'),
		component: LoadableComponent(() => import('@src/scenes/OpacPage/DetailPage/InstructionExtend')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_mostviewdocument,
		name: 'mostviewDocument',
		title: L('Tài liệu có nhiều lượt xem nhất'),
		component: LoadableComponent(() => import('@src/scenes/OpacPage/DetailDocument/MostViewDocument')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_mostborrowdocument,
		name: 'mostborrowDocument',
		title: L('Tài liệu có nhiều lượt mượn nhất'),
		component: LoadableComponent(() => import('@src/scenes/OpacPage/DetailDocument/MostBorrowDocument')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_documentnewest,
		name: 'mostviewDocument',
		title: L('Tài liệu mới nhất'),
		component: LoadableComponent(() => import('@src/scenes/OpacPage/DetailDocument/DocumentNewest')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_opacpage_search,
		permission: "",
		title: L('Kết quả tìm kiếm'),
		name: 'Kết quả tìm kiếm',
		icon: AppstoreOutlined,
		showInMenu: true,
		component: LoadableComponent(() => import('@scenes/OpacPage/DetailPage/SearchResultPage'))
	},
	{
		path: RouterPath.g_opacpage_detail_document,
		permission: "",
		title: L('Thông tin chi tiết sách'),
		name: 'Thông tin chi tiết sách',
		icon: AppstoreOutlined,
		showInMenu: true,
		component: LoadableComponent(() => import('@scenes/OpacPage/DetailPage/DetailDocumentPage'))
	},
	{
		path: RouterPath.g_opacpage_borrowreturning,
		permission: "",
		title: L('borrowreturningDocument'),
		name: 'Dịch vụ mượn trả tài liệu',
		icon: AppstoreOutlined,
		showInMenu: true,
		component: LoadableComponent(() => import('@scenes/OpacPage/DetailPage/BorrowReturningPage'))
	},
	{

		path: RouterPath.g_login,
		name: 'login',
		title: L('LogIn'),
		component: LoadableComponent(() => import('@scenes/Login')),
		showInMenu: true,
	},
	{
		path: RouterPath.g_exception,
		title: 'exception',
		name: 'exception',
		showInMenu: false,
		component: LoadableComponent(() => import('@scenes/Exception')),
	},
	{
		path: RouterPath.g_forgot,
		name: 'Forgot password',
		title: L('quen_mat_khau'),
		component: LoadableComponent(() => import('@scenes/Login/Forgot')),
		showInMenu: true,
	},
	{
		path: '/g/test',
		name: 'login',
		title: L('Login'),
		component: LoadableComponent(() => import('@scenes/Guest')),
		showInMenu: true,
	},
];
