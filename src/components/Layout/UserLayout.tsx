import './UserLayout.less';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Col } from 'antd';
import DocumentTitle from 'react-document-title';
import LanguageSelect from '../LanguageSelect';
import { guestRouter } from '../Router/router_guest.config';
import utils from '@utils/utils';
import { RouterPath } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';

class UserLayout extends React.Component<any> {
	render() {
		const {
			location: { pathname },
		} = this.props;

		return (
			<DocumentTitle title={utils.getPageTitle(pathname)}>
				<Col className="container">
					<div style={{ height: 'calc(100vh - 55px)' }}>
						<div className={'lang'}>
							{stores.sessionStore.isUserLogin() &&
								<LanguageSelect />
							}
						</div>
						<Switch>
							{guestRouter
								.filter((item: any) => !item.isLayout)
								.map((item: any, index: number) => (
									<Route key={index} path={item.path} component={item.component} exact={item.exact} />
								))}

							<Redirect from={RouterPath.g_} to={RouterPath.g_opacpage} />
						</Switch>
					</div>
					{/* <Footer /> */}
				</Col>
			</DocumentTitle>
		);
	}
}

export default UserLayout;
