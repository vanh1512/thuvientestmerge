	import * as React from 'react';
import { Card, Input, Button, message, Steps, Row, Result, Col } from 'antd';
import { AppConsts, RouterPath } from '@lib/appconst';
import { ArrowRightOutlined, RedoOutlined, SettingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import { Link } from 'react-router-dom';
import { L } from '@src/lib/abpUtility';


export interface IResetPasswordProps {
	onSuccessChangePass?: () => void;
	onCancel?: () => void;
}

export interface IState {
	isLoadDone: boolean;
	email: string,
	currentStep: 0 | 1 | 2 | undefined,
	statusStep: "process" | "error" | "wait" | "finish" | undefined,
	token: string,
	password1: string,
	password2: string,
}

export default class ResetPassword extends React.Component<IResetPasswordProps, IState> {
	state = {
		isLoadDone: true,
		email: "",
		currentStep: undefined,
		statusStep: undefined,
		token: "",
		password1: "",
		password2: "",

	};
	componentDidMount() {
		let params = new URLSearchParams(window.location.search);

		const tokenURL = params.get('token');
		const emailURL = params.get('email');
		if (emailURL !== undefined && emailURL !== null && tokenURL !== undefined && tokenURL !== null && AppConsts.testEmail(emailURL)) {
			this.setState({ currentStep: 1, email: emailURL, token: tokenURL });

		}
	}
	// luu
	onSubmitStep1 = async () => {
		this.setState({ statusStep: 'wait' });

		const { email } = this.state;
		if (email === undefined || email.length < 3) {
			this.setState({ statusStep: 'error' });
			return;
		}
		if (!AppConsts.testEmail(email)) {
			this.setState({ statusStep: 'error' });
			message.error(L("InvalidEmail!"));
			return;
		}
		let result = await stores.accountStore.forgotPasswordViaEmail(email);
		if (result.result == true) {
			this.setState({ currentStep: 1, statusStep: 'process' });
		}
	};


	onSubmitStep2 = async () => {
		this.setState({ statusStep: 'wait' });

		const { token, password1, password2, email } = this.state;
		if (token === undefined || token.length === 0) {
			message.error(L("EnterToken"));
			this.setState({ statusStep: 'error' });
			return;
		}
		if (password1 === undefined || password1.length < 8) {
			message.error(L("PasswordLongerThan8Characters"));
			this.setState({ statusStep: 'error' });
			return;
		}
		if (password1 !== password2) {
			message.error(L("PasswordDoNotMatch"));
			this.setState({ statusStep: 'error' });
			return;
		}
		let result = await stores.accountStore.resetPasswordViaEmail(token, email, password1);
		if (result.result == true) {
			this.setState({ currentStep: 2, statusStep: 'finish' });
		} else {
			message.error(L("InvalidEmail!"));
		}


		if (this.props.onSuccessChangePass !== undefined) {
			this.props.onSuccessChangePass();
		}
	}
	renderInputEmail = () => {
		const { email } = this.state;

		return <div style={{ marginTop: 10 }}>
			<Input
				placeholder={L("EnterEmail") + "..."}
				value={email}
				onChange={(e) => { this.setState({ email: e.target.value }) }}
				onPressEnter={this.onSubmitStep1}
				addonAfter={
					<>
						<ArrowRightOutlined onClick={() => this.onSubmitStep1()} />
					</>
				}
			/>
		</div>;
	}
	renderGotToken = () => {
		const self = this;
		const { email, token, password1, password2 } = this.state;
		return <div>
			<div style={{ textAlign: "center" }}>
				<span style={{ color: "green" }}>{L("MLibrary has been sent you code. Please enter code and password for")}</span><span style={{ color: "red", fontWeight: 'bold' }}>{email}</span>
			</div>
			<div style={{ marginTop: 10 }}>
				<Input
					placeholder={"Token..."}
					value={token}
					onChange={(e) => { this.setState({ token: e.target.value, }) }}
					addonAfter={<RedoOutlined onClick={() => self.onSubmitStep1()} title={L("ResendCode")} ><span>{L("ResendCode")}</span></RedoOutlined>}
				/>
			</div>
			<div style={{ marginTop: 10 }}>
				<Input
					placeholder={L("Password") + "..."}
					value={password1}
					type="password"
					onChange={(e) => { self.setState({ password1: e.target.value }) }}
				/>
			</div>
			<div style={{ marginTop: 10 }}>
				<Input
					placeholder={L("Password") + "..."}
					value={password2}
					type="password"
					onChange={(e) => { self.setState({ password2: e.target.value, }) }}
				/>
			</div>
			<div style={{ marginTop: 10, alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "row" }}>
				<div style={{ paddingRight: 5 }}>
					<Button type="default" onClick={() => { self.setState({ currentStep: 0, statusStep: "process" }) }} >{L("Back")}</Button>
				</div>
				<div style={{ paddingLeft: 5 }}>
					<Button type="primary" onClick={self.onSubmitStep2}>{L("xac_nhan")}</Button>
				</div>
			</div>
		</div>;
	}
	renderFinish = () => {
		return <Result
			status="success"
			title={L("SuccessfullyChangedPassword!")}
			extra={[
				<Button type="primary" key="console">
					<Link to={RouterPath.g_}>	<SettingOutlined />	<span>{L("GoManager")}?</span>	</Link>
				</Button>,
				<Button key="buy" onClick={() => { this.setState({ currentStep: 1, statusStep: "process" }) }} >{L("Back")}</Button>,

			]}
		/>
	}
	render() {
		const { currentStep, statusStep } = this.state;
		return (
			<Row style={{ height:"100%" }}>
				<Col span={8} offset={8}>
					<Card title={L("ForgotPassword?")} >
						<Row>
							<Steps current={currentStep} status={statusStep}>
								<Steps.Step title={L("EnterEmail")} icon={<UserOutlined />} />
								<Steps.Step title={L("Verification")} icon={<SolutionOutlined />} />
								<Steps.Step title={L("Finished")} icon={<SmileOutlined />} />
							</Steps>

						</Row>
						{(currentStep === undefined || currentStep == 0) && this.renderInputEmail()}
						{currentStep == 1 && this.renderGotToken()}
						{currentStep == 2 && this.renderFinish()}
					</Card>
				</Col>
			</Row>
		);
	}
}