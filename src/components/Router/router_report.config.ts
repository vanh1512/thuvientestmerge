import { AppstoreOutlined, BarChartOutlined, HomeOutlined, SettingOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons';
import LoadableComponent from '@components/Loadable/index';
import AppConsts, { RouterPath } from '@src/lib/appconst';
const prefixManager = RouterPath.admin_report;
export const appReportRouters: any =
{
	path: prefixManager,
	permission: [AppConsts.Permission.Report_Status_DocumentWithCategory,
	AppConsts.Permission.Report_Status_MemberWithMonth,
	AppConsts.Permission.Report_BorrowReturning_DocumentWithMonth,
	AppConsts.Permission.Report_BorrowReturning_DocumentWithCategory,
	AppConsts.Permission.Report_Borrow_MostMember,
	AppConsts.Permission.Report_Borrow_MostDocument,
	AppConsts.Permission.Report_Borrow_MostLibrarian,
	AppConsts.Permission.Report_Plan_PlanWithMonth,
	AppConsts.Permission.Report_Plan_MostMoney,
	AppConsts.Permission.Report_Plan_Supplier,],
	title: 'Báo cáo thống kê',
	name: 'Báo cáo thống kê',
	icon: BarChartOutlined,
	showInMenu: true,
	component: [
		{
			path: prefixManager + "/report-status-document-with-category",
			permission: AppConsts.Permission.Report_Status_DocumentWithCategory,
			title: 'Báo cáo trạng thái tài liệu theo danh mục',
			name: 'Báo cáo trạng thái tài liệu theo danh mục',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoTrangThaiTaiLieuTheoDanhMuc'))
		},
		{
			path: prefixManager + "/report-status-member-with-month",
			permission: AppConsts.Permission.Report_Status_MemberWithMonth,
			title: 'Báo cáo trạng thái người dùng theo Tháng',
			name: 'Báo cáo trạng thái người dùng theo Tháng',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoTrangThaiNguoiDungTheoThang'))
		},
		{
			path: prefixManager + "/report-borrow-returning-document-with-month",
			permission: AppConsts.Permission.Report_BorrowReturning_DocumentWithMonth,
			title: 'Báo cáo mượn trả tài liệu theo Tháng',
			name: 'Báo cáo mượn trả tài liệu theo Tháng',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoMuonTraTaiLieuTheoThang'))
		},
		{
			path: prefixManager + "/report-borrow-returning-document-with-category",
			permission: AppConsts.Permission.Report_BorrowReturning_DocumentWithCategory,
			title: 'Báo cáo mượn trả tài liệu theo danh mục',
			name: 'Báo cáo mượn trả tài liệu theo danh mục',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoMuonTraTaiLieuTheoDanhMuc'))
		},
		{
			path: prefixManager + "/report-borrow-static-most-member",
			permission: AppConsts.Permission.Report_Borrow_MostMember,
			title: 'Báo cáo độc giả có lượt mượn nhiều nhất',
			name: 'Báo cáo độc giả có lượt mượn nhiều nhất',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoDocGiaCoLuotMuonNhieuNhat'))
		},
		{
			path: prefixManager + "/report-borrow-static-most-document",
			permission: AppConsts.Permission.Report_Borrow_MostDocument,
			title: 'Báo cáo tài liệu có lượt mượn nhiều nhất',
			name: 'Báo cáo tài liệu có lượt mượn nhiều nhất',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoTaiLieuCoLuotMuonNhieuNhat'))
		},
		{
			path: prefixManager + "/report-borrow-librarian",
			permission: AppConsts.Permission.Report_Borrow_MostLibrarian,
			title: 'Báo cáo thủ thư cho mượn',
			name: 'Báo cáo thủ thư cho mượn',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoThuThuChoMuon'))
		},
		{
			path: prefixManager + "/report-plan",
			permission: AppConsts.Permission.Report_Plan_PlanWithMonth,
			title: 'Báo cáo kế hoạch mua sắm',
			name: 'Báo cáo kế hoạch mua sắm',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoKeHoachMuaSam'))
		},
		{
			path: prefixManager + "/report-detail-plan-most-money",
			permission: AppConsts.Permission.Report_Plan_MostMoney,
			title: 'Báo cáo chi tiết kế hoạch mua sắm',
			name: 'Báo cáo chi tiết kế hoạch mua sắm',
			icon: AppstoreOutlined,
			showInMenu: true,
			component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/BaoCaoGiaKeHoachMuaSamCaoNhat'))
		},


		// {
		// 	path: prefixManager+"/loss_book-report",
		// 	permission: '',
		// 	title: 'Báo cáo mất sách',
		// 	name: 'Báo cáo mất sách',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoMatSach'))
		// },
		// {
		// 	path: prefixManager+"/loss-report",
		// 	permission: '',
		// 	title: 'Báo cáo mất sách theo thời gian ',
		// 	name: 'Báo cáo mất sách theo thời gian ',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoMatSachTheoNgay'))
		// },
		// {
		// 	path: prefixManager+"/lossCategory-report",
		// 	permission: '',
		// 	title: 'Báo cáo mất sách theo Category ',
		// 	name: 'Báo cáo mất sách theo Category ',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoMatSachCategory'))
		// },
		// {
		// 	path: prefixManager+"/inventory-report",
		// 	permission: '',
		// 	title: 'Báo cáo sách tồn kho ',
		// 	name: 'Báo cáo sách tồn kho ',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoSachTonKho'))
		// },
		// {
		// 	path: prefixManager+"/book_inventory_in_1_plan-report",
		// 	permission: '',
		// 	title: 'Báo cáo quá trình kiểm kê sách trong 1 kế hoạch',
		// 	name: 'Báo cáo quá trình kiểm kê sách trong 1 kế hoạch',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoKiemKeSachTrong1KeHoach'))
		// },
		// {
		// 	path: prefixManager+"/book_inventory_by_day-report",
		// 	permission: '',
		// 	title: 'Báo cáo quá trình kiểm kê sách theo thời gian',
		// 	name: 'Báo cáo quá trình kiểm kê sách theo thời gian',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoKiemKeSachTheoThoiGian'))
		// },
		// {
		// 	path: prefixManager+"/book_to_be_inventory-report",
		// 	permission: '',
		// 	title: 'Báo cáo sách cần được kiểm kê',
		// 	name: 'Báo cáo sách cần được kiểm kê',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/Component/BaoCaoSachCanDuocKiemKe'))
		// },
		// {
		// 	path: prefixManager+"/budget-report",
		// 	permission: '',
		// 	title: 'Báo cáo quản lý ngân sách và tài chính',
		// 	name: 'Báo cáo quản lý ngân sách và tài chính',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoQuanLyNganSachVaTaiChinh'))
		// },
		// {
		// 	path: prefixManager+"/damaged_book-report",
		// 	permission: '',
		// 	title: 'Báo cáo xử lý sách bị hỏng hoặc hư hỏng',
		// 	name: 'Báo cáo xử lý sách bị hỏng hoặc hư hỏng',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoXuLySachBiHongHoacHuHong'))
		// },
		// {
		// 	path: prefixManager+"/statistical-report",
		// 	permission: '',
		// 	title: 'Báo cáo thống kê',
		// 	name: 'Báo cáo thống kê',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoThongKe'))
		// },
		// {
		// 	path: prefixManager+"/borrow_returning-report",
		// 	permission: '',
		// 	title: 'Báo cáo thống kê mượn trả tài liệu',
		// 	name: 'Báo cáo thống kê mượn trả tài liệu',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoThongKeMuonTraTaiLieu'))
		// },
		// {
		// 	path: prefixManager+"/records_management-report",
		// 	permission: '',
		// 	title: 'Báo cáo việc tạo và quản lý hồ sơ độc giả',
		// 	name: 'Báo cáo việc tạo và quản lý hồ sơ độc giả',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@src/scenes/Manager/Report/StatisticStorage/Component/BaoCaoViecTaoVaQuanLyHoSoDocGia'))
		// },
		// {
		// 	path: prefixManager+"/buy-report",
		// 	permission: '',
		// 	title: 'Báo cáo mua sắm và thay thế sách',
		// 	name: 'Báo cáo mua sắm và thay thế sách',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoMuaSamVaThayTheSach'))
		// },
		// {
		// 	path: prefixManager+"/reader_over_time-report",
		// 	permission: '',
		// 	title: 'Báo cáo quản lý độc giả theo thời gian',
		// 	name: 'Báo cáo quản lý độc giả theo thời gian',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoQuanLyDocGiaTheoThoiGian'))
		// },
		// {
		// 	path: prefixManager+"/brrowing_of_book-report",
		// 	permission: '',
		// 	title: 'Báo cáo quản lý mượn trả theo thể loại sách',
		// 	name: 'Báo cáo quản lý mượn trả theo thể loại sách',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoQuanLyMuonTraTheoTheLoaiSach'))
		// },
		// {
		// 	path: prefixManager+"/new_reader-report",
		// 	permission: '',
		// 	title: 'Báo cáo độc giả đăng ký mới',
		// 	name: 'Báo cáo độc giả đăng ký mới',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoDocGiaDangKyMoi'))
		// },
		// {
		// 	path: prefixManager+"/use_documents-report",
		// 	permission: '',
		// 	title: 'Báo cáo sử dụng tài liệu',
		// 	name: 'Báo cáo sử dụng tài liệu',
		// 	icon: AppstoreOutlined,
		// 	showInMenu: true,
		// 	component: LoadableComponent(() => import('@scenes/Manager/Report/StatisticStorage/Component/BaoCaoSuDungTaiLieu'))
		// },







	]

};


