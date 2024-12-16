import './index.less';
import * as React from 'react';
import { Avatar, Col, Layout, Menu, message } from 'antd';
import { L, isGranted } from '@lib/abpUtility';
import AppLogo from '@images/logoego256.png';
import AppLongLogo from '@images/logoego_long256.png';
import { appRouters } from '@components/Router/router.config';
import { stores } from '@src/stores/storeInitializer';
import HistoryHelper from '@src/lib/historyHelper';
import { RouterPath } from '@src/lib/appconst';
import { eUserType } from '@src/lib/enumconst';

const { SubMenu } = Menu;
const { Sider } = Layout;

export interface ISiderMenuProps {
	path?: any;
	collapsed?: boolean;
	onCollapse?: any;
	history?: any;
	onChangeMenuPath?: () => void;
}

const SiderMenu = (props: any) => {
	const { collapsed, history, onCollapse, onChangeMenuPath } = props;
	const changeMenuPath = (path: string, index?: string) => {
		if (stores.sessionStore.getUserLogin().us_type != eUserType.Member.num && path == RouterPath.admin_borrow + '/memberBorrow') {
			message.error(L("ban_khong_phai_tai_khoan_doc_gia"))
			setTimeout(() => { HistoryHelper.redirect(RouterPath.admin_drashboard); window.location.reload(); }, 500);
		}
		if (!!onChangeMenuPath) {
			onChangeMenuPath();
		}
		history.push(path, index);

	}
	const renderMenu = (route, index) => {
		if (route.permission && !isGranted(route.permission)) return null;
		const user = stores.sessionStore;

		if (route.userType !== undefined && user.getUserLogin().us_type !== route.userType) { return <></>; }

		// let menuIndex = route.path.replace("/", "_") + "_" + Math.floor(Math.random() * 1000) + "_" + index;
		let title = L(route.title);
		if (Array.isArray(route.component)) {
			let arrr = route.component;

			return (<SubMenu key={index + "group"} title={
				<span className="submenu-title-wrapper" style={{ color: "#fff" }} title={title} >
					<route.icon />
					<span >{title}</span>
				</span>
			}>

				{arrr
					.filter((itemChild: any) => !itemChild.isLayout && itemChild.showInMenu)
					.map((routeChild: any, indexChild: number) => {
						return renderMenu(routeChild, index + "group");
					})}
			</SubMenu>);
		}
		return (

			<Menu.Item key={route.path} onClick={() => changeMenuPath(route.path, index)}>
				<a style={{ color: "#fff" }} title={title}>
					<route.icon />
					<span>{title}</span>
				</a>
			</Menu.Item>

		);

	}
	const clickManagerField = () => {
		HistoryHelper.redirect(RouterPath.admin_drashboard);
	};
	// const currentRoute = utils.getRoute(history.location.pathname);
	return (
		<Sider trigger={null} className={'sidebar'} breakpoint="md" style={{ height: "100vh", }} width={256} collapsible collapsed={collapsed} onCollapse={onCollapse}>
			{collapsed ? (
				<Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }} onClick={clickManagerField}>
					<Avatar shape="circle" style={{ height: 48, width: 48 }} src={AppLogo} />
				</Col>
			) : (
				<Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }} onClick={clickManagerField}>
					<Avatar shape="square" size={'default'} style={{ height: 50, width: 133 }} src={AppLongLogo} />
				</Col>
			)}

			<Menu defaultOpenKeys={[history.location.state]} defaultSelectedKeys={[history.location.pathname]} style={{ height: "85vh", overflow: "auto" }} theme="dark" mode="inline" className='menuVerticalSiderbarClass' >
				{appRouters
					.filter((item: any) => !item.isLayout && item.showInMenu)
					.map((route: any, index: number) => {
						return renderMenu(route, index + "_");
					})}
			</Menu>
			<div className='end-header'>
				<div className='mig-viet'>
					{!collapsed && <a href='https://migviet.com'>{L('ve_migvet')}</a>}
					<p>{L('Hotline')}: 0246.329.1989</p>
				</div>
			</div>
		</Sider>
	);
};

export default SiderMenu;
