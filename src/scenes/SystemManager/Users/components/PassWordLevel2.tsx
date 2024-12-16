import * as React from 'react';
import { Row, Input, Button, Col, Card, message, Form } from 'antd';
import { L } from '@lib/abpUtility';
import { ChangePassword2Dto, UpdatePassword2Input } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import HistoryHelper from '@lib/historyHelper';
import { AppConsts, RouterPath } from '@lib/appconst';
import rules from '@src/scenes/Validation';
import { FormInstance } from 'antd/lib/form';

export interface IPassWordLevel2Props {
	oncancel: () => void;
	onsave: (isCorrectPass: boolean) => void;
	isCheckPassword2: boolean;
	isExistPassword2: boolean;
}

export default class PassWordLevel2 extends React.Component<IPassWordLevel2Props> {
	private formRef = React.createRef<FormInstance>();
	state = {
		password: "",
		oldPassword: "",
		isPasswordNull: false,
		confirm_password: "",
		isConfirmPasswordNull: false,
		ischeckequalconfirmpass: false,
	};

	onSubmit = async () => {
		if (this.props.isCheckPassword2 != undefined && this.props.isCheckPassword2 == true) {
			let re = await this.checkPassword2();
			if (!!this.props.onsave) {
				this.props.onsave((!!re && re.isCorrect != undefined) ? re.isCorrect : false);
			}
			this.onCancel();
		} else {
			await this.changePassword2();
		}
	}

	changePassword2 = async () => {
		if (this.state.confirm_password == "" || this.state.password == "") {
			message.error(L("2FieldsAreRequired"));
			return;
		}
		if (!this.state.ischeckequalconfirmpass) {
			message.error(L("mat_khau_khong_giong_nhau"));
			return;
		}
		let input: ChangePassword2Dto = new ChangePassword2Dto();
		input.user_id = stores.sessionStore!.currentLogin.user!.id!;
		input.currentPassword = this.state.oldPassword;
		input.newPassword = this.state.password;
		let result = await stores.userStore.changePassword2(input);
		message.success(L("SuccessfullyEdited"));
		this.onCancel();
		return result;
	}

	checkPassword2 = () => {
		let input: UpdatePassword2Input = new UpdatePassword2Input();
		input.id = stores.sessionStore!.currentLogin.user!.id!;
		input.password = this.state.password;
		let result = stores.userStore.checkPassword2(input);
		if (!!result) {
			return result;
		}
		return null;
	}

	onCancel = () => {
		if (this.props.oncancel != undefined) {
			this.props.oncancel();
		}
	}
	onRedirect = () => {
		if (this.props.isCheckPassword2 != undefined) {
			if (this.props.isCheckPassword2 == true || this.props.isExistPassword2 == false) {
				HistoryHelper.redirect(RouterPath.admin_home);
			}
		}
	}

	onchangeInputPass = (e) => {
		if (e != undefined && e != null) {
			this.setState({ password: e, isPasswordNull: false });
		}
		else {
			this.setState({ isPasswordNull: false });
		}
	}
	onchangeInputOldPass = (e) => {
		if (e != undefined && e != null) {
			this.setState({ oldPassword: e, isPasswordNull: false });
		}
		else {
			this.setState({ isPasswordNull: false });
		}
	}

	onchangeConfirmInputPass = async (e) => {
		if (e != undefined && e != null) {
			await this.setState({ confirm_password: e });
			if (this.state.password == this.state.confirm_password) {
				await this.setState({ ischeckequalconfirmpass: true });
			}
			else {
				await this.setState({ ischeckequalconfirmpass: false });

			}
		}
	}

	render() {

		return (
			<>
				<Row style={{ marginTop: '10px' }}>
					<Col
						xs={{ span: 24, offset: 0 }}
						sm={{ span: 24, offset: 0 }}
						md={{ span: 24, offset: 0 }}
						lg={{ span: 24, offset: 0 }}
						xl={{ span: 24, offset: 0 }}
						xxl={{ span: 24, offset: 0 }}
					>
						{/* <Row>
							<Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 5 }}>{L('mat_khau_cap_2')}: </Col>
							<Col xs={{ span: 18 }} sm={{ span: 18 }} md={{ span: 19 }}>
								<Input.Password
									allowClear={true}
									placeholder={L('nhap_mat_khau_cap_2')}
									style={{ width: '100%' }}
									onChange={(e) => this.onchangeInputPass(e.target.value)}
									onPressEnter={this.onSubmit}
								/>
							</Col>
						</Row> */}
						<Form {...AppConsts.formItemLayoutResponsive([24, 24], [24, 24], [8, 12], [8, 12], [8, 12], [8, 12])} ref={this.formRef} style={{ width: "100%" }}>
							{(this.props.isCheckPassword2 != undefined && this.props.isCheckPassword2 == true) ? null : (
								<Form.Item
									name={L("mat_khau_tai_khoan")}
									label={L("mat_khau_tai_khoan")}
									rules={[rules.password, rules.required]}
								>
									<Input.Password
										allowClear={true}
										placeholder={L('mat_khau_tai_khoan')}
										style={{ width: '100%' }}
										onChange={(e) => this.onchangeInputOldPass(e.target.value)}
									/>
								</Form.Item>
							)}
							<Form.Item
								name={L("mat_khau_cap_2")}
								label={L("mat_khau_cap_2")}
								rules={[rules.password, rules.required]}
							>
								<Input.Password
									allowClear={true}
									placeholder={L('nhap_mat_khau_cap_2')}
									style={{ width: '100%' }}
									onChange={(e) => this.onchangeInputPass(e.target.value)}
									onPressEnter={this.onSubmit}

								/>
							</Form.Item>
							{(this.props.isCheckPassword2 != undefined && this.props.isCheckPassword2 == true) ? null : (
								<Form.Item
									name={L("xac_nhan_mat_khau_cap_2")}
									label={L("xac_nhan_mat_khau_cap_2")}
								>
									<Input.Password
										allowClear={true}
										placeholder={L('input_xac_nhan_mat_khau_cap_2')}
										style={{ width: '100%' }}
										onChange={(e) => this.onchangeConfirmInputPass(e.target.value)}
									/>
								</Form.Item>
							)}
						</Form>
					</Col>
					{/* {(this.props.isCheckPassword2 != undefined && this.props.isCheckPassword2 == true) ? null : (

						<Col
							xs={{ span: 24, offset: 0 }}
							sm={{ span: 24, offset: 0 }}
							md={{ span: 24, offset: 0 }}
							lg={{ span: 24, offset: 0 }}
							xl={{ span: 24, offset: 0 }}
							xxl={{ span: 24, offset: 0 }}
							style={{ marginTop: '15px' }}
						>
							<Row>
								<Col xs={{ span: 6 }} sm={{ span: 6 }} md={{ span: 5 }}>{L('xac_nhan_mat_khau_cap_2')} </Col>
								{(!this.state.ischeckequalconfirmpass) ? (<span style={{ color: "red" }}>{L("mat_khau_khong_giong_nhau")}</span>) : null}
								<Form ref={this.formRef} style={{ width: "100%" }}>
									<Col xs={{ span: 18 }} sm={{ span: 18 }} md={{ span: 19 }}>
										<Form.Item
											label={L("xac_nhan_mat_khau_cap_2")}
											{...AppConsts.formItemLayout}
											rules={[rules.password, rules.required]}
										>
											<Input.Password
												allowClear={true}
												placeholder={L('input_xac_nhan_mat_khau_cap_2')}
												style={{ width: '100%' }}
												onChange={(e) => this.onchangeConfirmInputPass(e.target.value)}
											/>
										</Form.Item>
									</Col>
								</Form>
							</Row>
						</Col>
					)} */}

				</Row>
				<Row style={{ marginTop: '20px' }}>
					<Col span={24}>
						<Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button title={L('huy')} danger onClick={() => { this.onCancel(); this.onRedirect(); }} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L('huy')}
							</Button>
							<Button title={L('xac_nhan')} type="primary" onClick={() => this.onSubmit()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L('xac_nhan')}
							</Button>
						</Row>
					</Col>
				</Row>
			</>
		);
	}
}

