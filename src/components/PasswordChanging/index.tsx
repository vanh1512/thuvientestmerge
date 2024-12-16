import * as React from 'react';
import { Input, Button, message, Card, Col, Row, Form } from 'antd';
import { L } from '@lib/abpUtility';
import { stores } from '@stores/storeInitializer';
import { ChangePasswordDto } from '@services/services_autogen';
import { AppConsts } from '@lib/appconst';
import { LockOutlined } from '@ant-design/icons';
import HistoryHelper from '@lib/historyHelper';
import { FormInstance } from 'antd/lib/form';
import rules from '@src/components/Validation';


export interface IChangePasswordProps {
	onClose: () => void;
	user_id?: number;
}

export interface IChangePasswordState {
	oldPassword: string,
	password1: string;
	password2: string;
}

export default class PasswordChanging extends React.Component<IChangePasswordProps, IChangePasswordState> {
	private formRef = React.createRef<FormInstance>();

	state = {
		oldPassword: "",
		password1: "",
		password2: "",
	};

	onClose = () => {
		if (this.props.onClose != undefined) {
			this.props.onClose();
		}
	}

	handleChange = (e: any) => {
		this.setState({
			oldPassword: e.target.value,
		});
	}

	setPassword1 = (e: any) => {
		this.setState({
			password1: e.target.value,
		});
	}

	setPassword2 = (e: any) => {
		this.setState({
			password2: e.target.value,
		});
	}

	onSubmit = async () => {
		const { oldPassword, password1, password2 } = this.state;
		let user_id_change = (this.props.user_id === undefined || this.props.user_id < 1) ? -1 : this.props.user_id;
		if (user_id_change == -1 && (oldPassword === undefined || oldPassword.length === 0)) {
			message.error(L("ReEnterOldPassword"));
			return;
		}
		if (password1 === undefined || password1.length < 8) {
			message.error(L("PasswordLongerThan8Characters"));
			return;
		}
		if (password1 !== password2) {
			message.error(L("PasswordDoNotMatch"));
			return;
		}
		if (!AppConsts.formatPassword(password1)) {
			message.error(L("PasswordsMustBeAtLeast8Characters,ContainALowercase,Uppercase,AndNumber"));
			return;
		}
		let input = new ChangePasswordDto();
		input.currentPassword = user_id_change == -1 ? oldPassword : password1;
		input.newPassword = password1;
		input.user_id = user_id_change;
		try {
			await stores.userStore.changePassword(input);
			message.success(L("PasswordChanged"));
			if (user_id_change == -1) {
				HistoryHelper.redirect("/logout");
			}
		} catch (error) {
			console.log("error₫===", error);
		}
		this.props.onClose();
	}

	render() {
		const { user_id } = this.props;
		const { oldPassword, password1, password2 } = this.state;

		return (
			<Card className="wrapper">
				{(user_id != undefined) &&
					<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
						<Col span={12}><h3>{L('thay_doi_mat_khau_nguoi_dung') + ": " + stores.sessionStore.getUserNameById(user_id)}</h3></Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<Button danger onClick={this.onClose}>{L("Cancel")}</Button>
							&nbsp;&nbsp;
							<Button type="primary" onClick={this.onSubmit}>{L("xac_nhan")}</Button>
						</Col>
					</Row>
				}
				<Form ref={this.formRef} style={{ width: "100%" }}>
					{(user_id === undefined || user_id <= 0) &&
						<Form.Item
							label={L("OldPassword")}
							{...AppConsts.formItemLayout}
							rules={[rules.password, rules.required]}
							name={"OldPassword"}
						>
							<Input.Password
								minLength={AppConsts.maxLength.password}
								placeholder={L("OldPassword")}
								value={oldPassword}
								prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								size="large"
								onChange={this.handleChange}
							/>
						</Form.Item>
					}
					<Form.Item
						label={L("NewPassword")}
						{...AppConsts.formItemLayout}
						rules={[rules.password, rules.required]}
						name={"NewPassword"}
					>
						<Input.Password
							minLength={AppConsts.maxLength.password}
							placeholder={L("NewPassword")}
							value={password1}
							prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							onChange={this.setPassword1}
						/>
					</Form.Item>
					<Form.Item
						label={L("RePassword")}
						{...AppConsts.formItemLayout}
						rules={[rules.password, rules.required]}
						name={"RePassword"}
					>
						<Input.Password
							minLength={AppConsts.maxLength.password}
							placeholder={L("RePassword")}
							value={password2}
							prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							onChange={this.setPassword2}
						/>
					</Form.Item>
				</Form>
				{(user_id === undefined || user_id <= 0) &&
					<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
						<Col span={24} style={{ textAlign: 'right' }}>
							<Button danger onClick={this.onClose}>{L("Cancel")}</Button>
							&nbsp;&nbsp;
							<Button type="primary" onClick={this.onSubmit}>{L("xac_nhan")}</Button>
						</Col>
					</Row>}
			</Card>
		);
	}
}