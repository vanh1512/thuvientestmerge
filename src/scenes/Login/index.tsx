import './index.less';
import * as React from 'react';
import { Button, Carousel, Col, Drawer, Form, Input, Modal, Row, Space, Tabs } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import AccountStore from '@stores/accountStore';
import AuthenticationStore from '@stores/authenticationStore';
import { FormInstance } from 'antd/lib/form';
import { L } from '@lib/abpUtility';
import { Link, Redirect } from 'react-router-dom';
import SessionStore from '@stores/sessionStore';
import Stores from '@stores/storeIdentifier';
import TenantAvailabilityState from '@services/account/dto/tenantAvailabilityState';
import AppConsts, { RouterPath } from '@src/lib/appconst';
import FormCreateAdultMember from '@src/components/Register/components/FormCreateAdultMember';
import rules from '@src/scenes/Validation';
import AppLongLogo from '@images/logoego_long256.png';
import ResetPassword from './Forgot';

const FormItem = Form.Item;
declare var abp: any;
export const tabManager = {
	tab_1: L('Đăng ký'),
	tab_2: L('Đăng ký độc giả'),
}
export interface ILoginProps {
	authenticationStore?: AuthenticationStore;
	sessionStore?: SessionStore;
	accountStore?: AccountStore;
	history: any;
	location: any;
}

@inject(Stores.AuthenticationStore, Stores.SessionStore, Stores.AccountStore)
@observer
class Login extends React.Component<ILoginProps> {
	formRef = React.createRef<FormInstance>();
	state = {
		visibleRegister: false,
		visibleResetPass: false,
	};
	changeTenant = async () => {
		let tenancyName = this.formRef.current?.getFieldValue('tenancyName');
		const { loginModel } = this.props.authenticationStore!;

		if (!tenancyName) {
			abp.multiTenancy.setTenantIdCookie(undefined);
			window.location.href = '/';
			return;
		} else {
			await this.props.accountStore!.isTenantAvailable(tenancyName);
			const { tenant } = this.props.accountStore!;
			let state: number = tenant.state!;

			switch (state) {
				case TenantAvailabilityState.Available:
					abp.multiTenancy.setTenantIdCookie(tenant.tenantId);
					loginModel.tenancyName = tenancyName;
					loginModel.toggleShowModal();
					window.location.href = '/';
					return;
				case TenantAvailabilityState.InActive:
					Modal.error({ title: L('Error'), content: L('TenantIsNotActive') });
					break;
				case TenantAvailabilityState.NotFound:
					Modal.error({ title: L('Error'), content: L('ThereIsNoTenantDefinedWithName{0}', tenancyName) });
					break;
			}
		}
	};

	handleSubmit = async (values: any) => {
		const { loginModel } = this.props.authenticationStore!;
		await this.props.authenticationStore!.login(values);
		sessionStorage.setItem('rememberMe', loginModel.rememberMe ? '1' : '0');
		const { state } = this.props.location;
		window.location = state ? state.from.pathname : '/';
	};

	render() {
		let { from } = this.props.location.state || { from: { pathname: '/' } };
		if (this.props.authenticationStore!.isAuthenticated) return <Redirect to={from} />;
		return (
			<>
				<Row>
					<Drawer
						title={L('ForgotPassword?')}
						width={window.innerHeight * 1 / 2}
						maskClosable={false}
						closable={true}
						visible={this.state.visibleResetPass}
						bodyStyle={{ padding: "0 24px 0" }}
						headerStyle={{ justifyContent: 'center', display: 'flex' }}
						placement='top'
						onClose={() => this.setState({ visibleResetPass: false })}
					>
						<ResetPassword />
					</Drawer>
					<Col span={17}>
						<div style={{ position: 'absolute', zIndex: 100, top: 10, left: 10 }}>
							<img src={AppLongLogo} ></img>
						</div>
						<Carousel autoplay autoplaySpeed={5000}>
							<div>
								<img src={process.env.PUBLIC_URL + "/bg_login_1.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img>
							</div>
							<div>
								<img src={process.env.PUBLIC_URL + "/bg_login_2.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img>
							</div>
							<div>
								<img src={process.env.PUBLIC_URL + "/bg_login_3.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img>
							</div>
							<div>
								<img src={process.env.PUBLIC_URL + "/bg_login_4.jpg"} style={{ height: '100vh', width: '100%', objectFit: 'cover' }}></img>
							</div>
						</Carousel>
					</Col>
					<Drawer
						title={
							<p style={{ textTransform: 'uppercase' }}>{L('dang_ky_doc_gia')}</p>
						}
						width={window.innerWidth * 29.167777 / 100}
						maskClosable={false}
						closable={true}
						onClose={()=>this.setState({visibleRegister:false})}
						visible={this.state.visibleRegister}
						bodyStyle={{ padding: "0 24px 0" }}
						headerStyle={{ justifyContent: 'center', display: 'flex' }}
					>
						<FormCreateAdultMember onSuccessRegister={() => this.setState({ visibleRegister: false })} onCancel={() => this.setState({ visibleRegister: false })} />
					</Drawer>

					<Col span={7} style={{ backgroundColor: '#ffff' }}>
						<h1 style={{ fontWeight: 'bold', marginTop: '9vh', color: 'rgb(29, 165, 122)' }}>{L("TuyenQuangLibrary")}</h1>
						<h2 style={{ fontWeight: 'bold' }}>{L('LogIn')}</h2>
						<Row className='col-right-form'>
							<img src={process.env.PUBLIC_URL + "/user_icon.png"}
								style={{ width: '70px', height: "70px", margin: "10px 0 20px 0" }} />
							<Col offset={3} span={18}>
								<Form onFinish={this.handleSubmit} ref={this.formRef}>
									<p style={{
										textAlign: "start",
										fontSize: "10px",
										fontWeight: 600,
										letterSpacing: "1px",
										color: 'rgb(29, 165, 122)',
										textTransform: 'uppercase',
										transition: 'all, 0.4s',
										lineHeight: 0,
									}}
									>
										{L('username')}
									</p>
									<FormItem name={'userNameOrEmailAddress'} rules={[rules.required, rules.maxName, rules.noSpaces] || [rules.required, rules.emailAddress, rules.noSpaces]}>
										<Input
											maxLength={AppConsts.maxLength.name}
											placeholder={L('UserNameOrEmail')}
											prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight: '5px' }} />}
											size="large"
											style={{ width: '100%', height: '44px', borderRadius: '7px' }}
										/>
									</FormItem>
									<p style={{
										textAlign: "start",
										fontSize: "10px",
										fontWeight: 600,
										letterSpacing: "1px",
										color: 'rgb(29, 165, 122)',
										textTransform: 'uppercase',
										transition: 'all, 0.4s',
										lineHeight: 0,
									}}
									>
										{L('password')}
									</p>
									<FormItem name={'password'} rules={[rules.required, rules.password]}>
										<Input.Password
											placeholder={L('Password')}
											prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)', paddingRight: '5px' }} />}
											type="password"
											size="large"
											onPressEnter={this.handleSubmit}
											style={{ width: '100%', height: '44px', borderRadius: '7px' }}
										/>
									</FormItem>
									<Row style={{ marginTop: '-10px' }}>
										<FormItem>
											<a style={{ color: "#1da57a" }} onClick={() => this.setState({ visibleResetPass: true })}><LogoutOutlined /> <u>{L('ForgotPassword?')}</u></a>
										</FormItem>
									</Row>
									<Col style={{ fontSize: '15px', justifyItems: 'center' }}>
										<Button
											htmlType={'submit'}
											type={"primary"}
											style={{ width: '100%', height: '40px', borderRadius: "20px", fontWeight: 700 }}
										>
											{L('LogIn')}
										</Button>
										<div style={{ margin: '7px 0 7px 0' }}>or</div>
										<Button
											type="default"
											onClick={() => this.setState({ visibleRegister: true })}
											style={{ width: '100%', height: '40px', borderRadius: "20px", fontWeight: 700 }}
										>
											{L('Register')}
										</Button>
									</Col>
								</Form>
							</Col>
						</Row>
					</Col>
				</Row >
			</>
		);
	}
}

export default Login;
