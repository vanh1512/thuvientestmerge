import './index.less';

import * as React from 'react';

import { Avatar, Badge, Button, Col, Dropdown, Menu, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, UserOutlined, SecurityScanOutlined } from '@ant-design/icons';

import { L } from '@lib/abpUtility';
import LanguageSelect from '@components/LanguageSelect';
import { Link } from 'react-router-dom';

import profilePicture from '@images/user.png';
import Modal from 'antd/lib/modal/Modal';
import PasswordChanging from '@components/PasswordChanging';
import AppConsts, { RouterPath } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';

export interface IHeaderProps {
	collapsed?: any;
	toggle?: any;

}

export class Header extends React.Component<IHeaderProps> {
	state = {
		visibleModal: false,
	}

	render() {
		const userDropdownMenu = (
			<Menu>
				<Menu.Item key="0">
					<Link to={RouterPath.admin_information}>
						<UserOutlined />
						<span> {L('UserDetails')}</span>
					</Link>

				</Menu.Item>
				<Menu.Item key="1" >
					<SecurityScanOutlined />
					<span onClick={() => this.setState({ visibleModal: true })}>{L('ChangePassword')}</span>

				</Menu.Item>
				<Menu.Item key="2">
					<Link to={RouterPath.admin_logout}>
						<LogoutOutlined />
						<span> {L('Logout')}</span>
					</Link>
				</Menu.Item>
			</Menu>
		);
		return (
			<Row className={'header-container'}>
				<Col style={{ textAlign: 'left' }} xs={6} md={12} lg={12} xl={12}>
					{this.props.collapsed ? (
						<MenuUnfoldOutlined className="trigger" onClick={this.props.toggle} />
					) : (
						<MenuFoldOutlined className="trigger" onClick={this.props.toggle} />
					)}
				</Col>
				<Col style={{ padding: '0px 15px 0px 15px', textAlign: 'right' }} xs={18} md={12} lg={12} xl={12}>
					<Button type="primary" target='_blank' href={AppConsts.webInformation}>{L("trang_thong_tin_thu_vien")}</Button> &nbsp;&nbsp;
					{stores.sessionStore.isUserLogin() === true &&
						<LanguageSelect />
					}
					&nbsp;&nbsp;
					<Dropdown overlay={userDropdownMenu} trigger={['hover']}>
						<Badge style={{}} count={3}>
							<Avatar style={{ height: 24, width: 24 }} shape="circle" alt={'profile'} src={profilePicture} />
						</Badge>
					</Dropdown>
				</Col>
				<Modal
					width={'50vw'}
					destroyOnClose={true}
					visible={this.state.visibleModal}
					footer={null}
					onCancel={() => this.setState({ visibleModal: false })}
					cancelText={L("huy")}
					title={L("doi_mat_khau")}
					closable={false}
					maskClosable={false}
				>
					<PasswordChanging
						onClose={() => this.setState({ visibleModal: false })}
					/>
				</Modal>
			</Row>
		);
	}
}

export default Header;
