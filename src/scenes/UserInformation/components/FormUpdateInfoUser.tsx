import SelectEnum from "@src/components/Manager/SelectEnum";
import rules from "@src/scenes/Validation";
import { L } from "@src/lib/abpUtility";
import AppConsts from "@src/lib/appconst";
import { eGENDER } from "@src/lib/enumconst";
import { UpdateAvataInput } from "@src/services/services_autogen";
import { GetCurrentLoginInformationsOutput, UpdateUserInput } from "@src/services/services_autogen";
import { stores } from "@src/stores/storeInitializer";
import { Button, DatePicker, Form, Input, Row, message } from "antd";
import moment from "moment";
import { Moment } from "moment";
import * as React from "react";
export interface IProps {

	currentLogin: GetCurrentLoginInformationsOutput;
	updateSuccess?: () => void;
}

export default class FormUpdateInfoUser extends React.Component<IProps>
{

	state = {
		isLoadDone: false,
		idMember: -1,
		birthday: moment() || undefined,
		us_gender: undefined,
	}
	private formRef: any = React.createRef();

	async componentDidMount() {
		await this.initData(this.props.currentLogin);
	}

	initData = async (inputmember: GetCurrentLoginInformationsOutput | undefined) => {
		this.setState({ isLoadDone: false, birthday: undefined });
		if (inputmember != undefined) {
			if (inputmember.user.us_dob != undefined) {
				this.setState({ birthday: moment(inputmember.user.us_dob, "DD/MM/YYYY") })
			}
			await this.formRef.current!.setFieldsValue({ ...inputmember.user });
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });
	}

	onUpdate = async () => {
		const form = this.formRef.current;
		const { currentLogin } = this.props;
		form!.validateFields().then(async (values: any) => {
			if (currentLogin != undefined && currentLogin.user.id != undefined) {
				let unitData = new UpdateUserInput({ id: currentLogin.user.id, ...values });
				unitData.isActive = this.props.currentLogin.user.isActive;
				if (currentLogin.user.us_avatar != undefined) {
					const fileAvatar = new UpdateAvataInput();
					fileAvatar.id = currentLogin.user.id;
					fileAvatar.us_avatar = currentLogin.user.us_avatar;
					await stores.userStore.updateAvataUser(fileAvatar)
				}
				await stores.userStore.updateUser(unitData);
				message.success(L("SuccessfullyEdited"));
				await this.updateSuccess();
			}
		})
	}

	updateSuccess = () => {
		if (!!this.props.updateSuccess) {
			this.props.updateSuccess();
		}
	}

	render() {
		const userInfo = this.props.currentLogin.user;
		return (
			<>
				<Row style={{ justifyContent: 'end' }}>
					<Button title={L('huy')} style={{ marginRight: '10px' }} type="primary" danger onClick={this.updateSuccess} >{L("huy")}</Button>
					<Button title={L('luu')} type="primary" onClick={() => this.onUpdate()}>{L("luu")}</Button>
				</Row>
				<h2 style={{ textAlign: 'center' }}>{L("EditUserInformation")}</h2>
				<Form ref={this.formRef}>
					<Form.Item label={L('UserName')}{...AppConsts.formItemLayout} rules={[rules.required, rules.noSpaces, rules.userName]} name={'userName'} hasFeedback>
						<Input placeholder={L('UserName')} maxLength={AppConsts.maxLength.name} />
					</Form.Item>
					<Form.Item label={L('Name')} {...AppConsts.formItemLayout} rules={[rules.required, rules.maxName, rules.onlyLetter]} name={'name'} hasFeedback>
						<Input placeholder={L('Name')} maxLength={AppConsts.maxLength.name} />
					</Form.Item>
					<Form.Item label={L('Surname')} {...AppConsts.formItemLayout} rules={[rules.required, rules.onlyLetter]} name={'surname'} hasFeedback >
						<Input placeholder={L('Surname')} maxLength={AppConsts.maxLength.code} />
					</Form.Item>
					<Form.Item label={L('Email')} {...AppConsts.formItemLayout} rules={[rules.required, rules.emailAddress]} name={'emailAddress'} hasFeedback >
						<Input placeholder={L('Email')} type="email" maxLength={AppConsts.maxLength.email} />
					</Form.Item>
					<Form.Item label={L('Birthday')} {...AppConsts.formItemLayout} name={'us_dob'} hasFeedback valuePropName="us_dob">
						<DatePicker
							style={{ width: '100%' }}
							onChange={(date: Moment | null, dateString: string) => { this.setState({ birthday: date }); this.formRef.current.setFieldsValue({ us_dob: date }); }}
							format={"DD/MM/YYYY"}
							value={this.state.birthday}
							disabledDate={(current) => current > moment().endOf('day')}
						/>
					</Form.Item>
					<Form.Item label={L('Gender')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'us_gender'} hasFeedback>
						<SelectEnum eNum={eGENDER} enum_value={userInfo.us_gender} onChangeEnum={async (value: number) => { await this.setState({ us_gender: value }); await this.formRef.current.setFieldsValue({ us_gender: value }); }} />
					</Form.Item>
					<Form.Item label={L('Address')} {...AppConsts.formItemLayout} rules={[rules.required, rules.noAllSpaces]} name={'us_address'} hasFeedback>
						<Input placeholder={L('Address')} maxLength={AppConsts.maxLength.address} />
					</Form.Item>

				</Form>

			</>
		)
	}
}