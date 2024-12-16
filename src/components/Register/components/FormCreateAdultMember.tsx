import * as React from "react";
import { Form, Button, Input, message, Row, Col, DatePicker } from "antd";
import { L } from "@lib/abpUtility";
import { AppConsts, cssCol } from "@lib/appconst";
import FormItem from "antd/lib/form/FormItem";
import { stores } from "@stores/storeInitializer";
import { RegisterOutput, RegisterMemberInput } from "@services/services_autogen";
import { FormInstance } from "antd/lib/form";
import SelectEnum from "@src/components/Manager/SelectEnum";
import { eGENDER } from "@src/lib/enumconst";
import moment, { Moment } from "moment";
import rules from "@src/scenes/Validation";


export interface IRegisterProps {
	onSuccessRegister: () => void;
	onCancel?: () => void;
}

export default class FormCreateAdultMember extends React.Component<IRegisterProps> {
	private formRef = React.createRef<FormInstance>();
	state = {
		confirmDirty: false,
		rePassword: undefined,
		birthday: moment() || null,
	};
	async componentDidMount() {
		await this.setState({ birthday: undefined });
	}
	// luu
	onSave = async () => {
		const form = this.formRef;
		const self = this;
		form.current!.validateFields().then(async (values: any) => {
			if (values.password !== this.state.rePassword) {
				message.error(L("PasswordsDoNotMatch"));
				return;
			}
			if (!AppConsts.testEmail(values.emailAddress)) {
				message.error(L("InvalidEmailAddress"));
				return;
			}
			let input = new RegisterMemberInput({ ...values });
			let flag = await self.registerRequest(input);
			if (flag === undefined || !flag) {
				message.error(L("RegisterErrors"));
			} else {
				message.success(L("RegisterSuccessfully"));
				if (self.props.onSuccessRegister !== undefined) {
					self.props.onSuccessRegister();
				}
			}
		});
	};
	async registerRequest(input: RegisterMemberInput) {
		if (input !== undefined) {
			let res: RegisterOutput = await stores.accountStore.registerMember(input);
			return res.canLogin;
		}
		return false;
	}

	compareToFirstPassword = (rule: any, value: any, callback: any) => {
		const form = this.formRef.current;
		if (value && value !== form!.getFieldValue("password")) {
			return Promise.reject(L("PasswordsDoNotMatch"));
		}
		return Promise.resolve();
	};
	validateToNextPassword = (rule: any, value: any, callback: any) => {
		const { validateFields, getFieldValue } = this.formRef.current!;
		this.setState({
			confirmDirty: true,
		});

		if (value && this.state.confirmDirty && getFieldValue("confirm")) {
			validateFields(["confirm"]);
		}
		return Promise.resolve();
	};
	onChange = (e) => {
		this.setState({ value: e.target.value });
	};
	render() {
		const { onCancel } = this.props;
		const formItemLayout = {
			labelCol: cssCol(8),
			wrapperCol: cssCol(16),
		};
		return (
			<Row style={{width:"100%"}}>
				<Form ref={this.formRef} style={{ width: "100%" }}>
					<Row>
						<strong>{L("PersonalInformation")} </strong>
					</Row>

					<FormItem label={L("FullName")} {...formItemLayout} rules={[rules.required, rules.maxName, rules.onlyLetter]} name={"me_name"} >
						<Input style={{ borderRadius: '7px', }} maxLength={AppConsts.maxLength.name} />
					</FormItem>
					<Form.Item label={L("Gender")} {...formItemLayout} rules={[rules.required]} name={"me_sex"} hasFeedback >
						<SelectEnum
							className="ant-select-borderRadius-7px"
							eNum={eGENDER}
							enum_value={undefined}
							onChangeEnum={async (value: number) => {
								await this.formRef.current!.setFieldsValue({ me_sex: value });
							}}
						/>
					</Form.Item>
					<Form.Item label={L("Birthday")} {...formItemLayout} rules={[rules.required]} name={"me_birthday"} hasFeedback valuePropName="me_birthday" >
						<DatePicker
							style={{ borderRadius: '7px', width: '100%' }}
							onChange={(date: Moment | null, dateString: string) => {
								this.setState({ birthday: date });
								this.formRef.current!.setFieldsValue({
									me_birthday: dateString,
								});
							}}
							format={"DD/MM/YYYY"}
							value={this.state.birthday}
							disabledDate={(current) => current ? current >= moment().endOf('day') : false}
						/>
					</Form.Item>
					<FormItem label={L("Identification")} {...formItemLayout} rules={[rules.required, rules.cccd]} name={"me_identify"}>
						<Input style={{ borderRadius: '7px', }} maxLength={AppConsts.maxLength.cccd} />
					</FormItem>
					<Row>
						<strong>{L("ContactInformation")} </strong>
					</Row>
					<FormItem label={L("Email")} {...formItemLayout} rules={[rules.required, rules.emailAddress]} name={"emailAddress"} hasFeedback>
						<Input style={{ borderRadius: '7px', }} maxLength={AppConsts.maxLength.email} />
					</FormItem>
					<FormItem label={L("so_dien_thoai")} {...formItemLayout} rules={[rules.required, rules.phone]} name={"me_phone"}>
						<Input style={{ borderRadius: '7px', }} maxLength={AppConsts.maxLength.phone} />
					</FormItem>
					<FormItem label={L("Address")} {...formItemLayout} rules={[rules.required, rules.noAllSpaces]} name={"me_address"}>
						<Input style={{ borderRadius: '7px', }} maxLength={AppConsts.maxLength.address} />
					</FormItem>
					<Row>
						<strong>{L("LoginInformation")} </strong>
					</Row>
					<FormItem label={L("UserName")} {...formItemLayout} rules={[rules.required, rules.userName]} name={"userName"}>
						<Input style={{ borderRadius: '7px', }} maxLength={AppConsts.maxLength.code} />
					</FormItem>
					<FormItem label={L("Password")} {...formItemLayout} name={"password"} rules={[rules.required, rules.password]}>
						<Input.Password style={{ borderRadius: '7px', }} />
					</FormItem>
					<FormItem label={L("ConfirmPassword")} {...formItemLayout} rules={[rules.required, rules.password]}>
						<Input.Password
							onChange={(e) => this.setState({ rePassword: e.target.value })}
							style={{ borderRadius: '7px', }}
						/>
					</FormItem>
				</Form>
				<Col style={{ textAlign: "right", width: "100%", marginTop: "10px" }}>
					{onCancel !== undefined && (
						<Button danger type="default" onClick={() => onCancel()}>
							{L("Cancel")}
						</Button>
					)}
					&nbsp;&nbsp;&nbsp;
					<Button type="primary" onClick={() => this.onSave()}>
						{L("OK")}
					</Button>
				</Col>
			</Row>
		);
	}
}
