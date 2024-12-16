import './AppLayout.less';
import * as React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import Footer from '../Manager/Footer';
import Header from '../Manager/Header';
import { Layout } from 'antd';
import ProtectedRoute from '@src/components/Router/ProtectedRoute';
import SiderMenu from '../SiderMenu';
import { appRouters } from '../Router/router.config';
import utils from '@utils/utils';
import NotFoundRoute from '../Router/NotFoundRoute';
import { RouterPath } from '@src/lib/appconst';
import HistoryHelper from '@src/lib/historyHelper';
import DictionaryHelp from '../DictionaryHelp';

const { Content } = Layout;

class AppLayout extends React.Component<any> {
	private buttonAddOrDeleteRef: any = React.createRef();
	state = {
		collapsed: false,
	};
	isMobile: boolean = false;

	async componentDidMount() {
		window.addEventListener("resize", this.resize.bind(this));
		this.resize();
	}
	resize() {
		this.isMobile = window.innerWidth <= 1200;
		this.setState({ collapsed: this.isMobile });
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.resize.bind(this));
	}
	toggle = () => {
		this.aaaaaaa();
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};

	onCollapse = (collapsed: any) => {
		this.setState({ collapsed });
	};
	renderMenu = (route: any, index: number) => {

		if (Array.isArray(route.component)) {
			let arrr = route.component;
			return arrr
				.filter((itemChild: any) => !itemChild.isLayout)
				.map((routeChild: any, indexChild: number) => {
					return this.renderMenu(routeChild, indexChild);
				});
		}
		return (
			// <Route
			// 	exact
			// 	key={index}
			// 	path={route.path}
			// 	render={(props) => <ProtectedRoute component={route.component} permission={route.permission} />}
			// />
			<ProtectedRoute key={index} path={route.path} userType={route.userType} component={route.component} permission={route.permission} />
		);

	}
	aaaaaaa = () => {
		console.log("22222222", this.buttonAddOrDeleteRef);

	}
	render() {
		const {
			history,
			location: { pathname },
		} = this.props;

		const { path } = this.props.match;
		const { collapsed } = this.state;
		HistoryHelper.changeHistory(history);

		const layout = (
			<Layout style={{ height: "100vh", maxHeight: '100vh' }}>
				<SiderMenu path={path} onCollapse={this.onCollapse} history={history} collapsed={collapsed} onChangeMenuPath={() => { if (this.isMobile) { this.setState({ collapsed: true }) } }} />
				<Layout style={{ height: "100vh", maxHeight: "100vh", overflowY: "auto" }}>
					<Layout.Header style={{ background: '#fff', minHeight: 52, padding: 0 }}>
						<Header collapsed={this.state.collapsed} toggle={this.toggle} />
					</Layout.Header>
					<Content style={{ margin: 16 }}>
						<Switch>
							{pathname === RouterPath.admin && <Redirect from={RouterPath.admin} to={RouterPath.admin_drashboard} />}

							{appRouters
								.filter((item: any) => !item.isLayout)
								.map((route: any, index: any) => (
									this.renderMenu(route, index)

								))}
							{pathname !== RouterPath.admin && <NotFoundRoute />}
						</Switch>
					</Content>
					<Footer />
					<DictionaryHelp />
				</Layout>
			</Layout>
		);

		return <DocumentTitle title={utils.getPageTitle(pathname)}>{layout}</DocumentTitle>;
	}
}

export default AppLayout;
