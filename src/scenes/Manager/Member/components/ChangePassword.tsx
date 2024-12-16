import * as React from 'react';
import { Button, Card, Col, Form, Input, Row, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';
import { ChangePassWordMemberInput, ChangePasswordDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import HistoryHelper from '@src/lib/historyHelper';
import rules from '@src/scenes/Validation';
import { FormInstance } from 'antd/lib/form';


export interface IChangePasswordProps {
	onClose: () => void;
	member_id?: number;
}

export class ChangePassword extends React.Component<IChangePasswordProps> {
	private formRef = React.createRef<FormInstance>();
	state = {
		password1: "",
		password2: "",
		passwordMatchError:"",
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
		const { password1 } = this.state;
		const password2 = e.target.value;

		this.setState({
			password2,
			passwordMatchError: password1 !== password2 ? L("mat_khau_khong_khop") : '',
		});
	}

	onSubmit = async () => {
		const { password1, password2 } = this.state;
		let member_id_change = (this.props.member_id === undefined || this.props.member_id < 1) ? -1 : this.props.member_id;

		if (password1 === undefined || password1.length < 8) {
			message.error(L("PasswordsMustBeAtLeast8Characters,ContainALowercase,Uppercase,AndNumber"));
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
		let input = new ChangePassWordMemberInput();
		input.me_id = member_id_change;
		input.newPassword = password1;
		try {
			await stores.memberStore.changePassWordMember(input);
			message.success(L("PasswordChanged"));
			if (member_id_change == -1) {
				HistoryHelper.redirect("/subscriber/member");
			}
		} catch (error) {
		}
		this.props.onClose();
	}

	render() {
		const { password1, password2 } = this.state;
		return (
			<Card className="wrapper">
				<Form {...AppConsts.formItemLayoutResponsive([24, 24], [24, 24], [8, 16], [8, 16], [8, 16], [8, 16])} ref={this.formRef} style={{ width: "100%" }}>
					<Form.Item
						label={L("NewPassword")}

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
						{this.state.passwordMatchError && <span style={{ color: 'red' }}>{this.state.passwordMatchError}</span>}
					</Form.Item>
				</Form>
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={24} style={{ textAlign: 'right' }}>
						<Button danger onClick={this.onClose}>{L("Cancel")}</Button>
						&nbsp;&nbsp;
						<Button type="primary" onClick={this.onSubmit}>{L("xac_nhan")}</Button>
					</Col>
				</Row>
			</Card>
		);
	}
}

export default ChangePassword;
