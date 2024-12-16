import * as React from 'react';
import { Col, Row, Button, Input, Card, Select, Form, Switch, message, } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SaveOutlined } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import { L } from '@src/lib/abpUtility';
import { EmailSettingsEditDto, GeneralSettingsEditDto } from '@src/services/services_autogen';
import rules from '@src/scenes/Validation';

export interface IProps {
	onSaveEmailSetting?: (item: EmailSettingsEditDto, item2: GeneralSettingsEditDto) => void;
	email_setting: EmailSettingsEditDto;
	general_setting: GeneralSettingsEditDto;
}

export default class EmailSetting extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
	}

	async componentDidMount() {
		this.initData(this.props.email_setting);
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.props.email_setting != prevProps.email_setting) {
			this.initData(this.props.email_setting);
		}
	}

	initData = async (email_setting: EmailSettingsEditDto) => {
		this.setState({ isLoadDone: false });
		if (email_setting !== undefined) {
			await this.formRef.current!.setFieldsValue({ ...email_setting });
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });
	}

	onSaveEmailSetting = () => {
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			let email_setting = new EmailSettingsEditDto({ ...values });
			if (this.props.onSaveEmailSetting) {
				this.props.onSaveEmailSetting(email_setting, this.props.general_setting);
			}
			message.success(L("cap_nhat_thanh_cong"));
		})
	}


	render() {
		const Objects = [
			{ name: "defaultFromAddress", rules: [rules.required, rules.emailAddress], title: (L("smtp_dia_chi_email")), type: "email" },
			{ name: "defaultFromDisplayName", rules: [rules.required, rules.chucai_so_kytudacbiet], title: (L("smtp_ten_hien_thi")), type: "text" },
			{ name: "smtpDomain", rules: [rules.required, rules.chucai_so_kytudacbiet], title: (L("smtp_ten_mien")), type: "text" },
			{ name: "smtpEnableSsl", title: "SSl", type: "boolean" },
			{ name: "smtpHost", rules: [rules.required, rules.chucai_so_kytudacbiet], title: (L("smtp_may_chu")), type: "text" },
			{ name: "smtpPort", rules: [rules.required, rules.numberOnly], title: (L("smtp_cong")), type: "text" },
			{ name: "smtpUserName", rules: [rules.required, rules.userName], title: (L("smtp_ten_dang_nhap")), type: "text" },
			{ name: "smtpPassword", rules: [rules.required], title: (L("smtp_mat_khau")), type: "password" },
			{ name: "smtpUseDefaultCredentials", title: (L("smtp_thong_tin_dang_nhap_mac_dinh")), type: "boolean" },
		]
		return (
			<Card>
				<Row style={{ overflowY: "auto" }}>
					<Col span={20} >
						<Row>
							<Form ref={this.formRef} style={{ width: '75%', alignItems: 'left' }}>
								{Objects.map((object, index) => (
									object.type == "boolean" ?
										<Form.Item key={"key_" + index} label={L(object.title)} {...AppConsts.formItemLayout} name={object.name} valuePropName="checked" hasFeedback >
											<Switch />
										</Form.Item>
										: <Form.Item key={"key_" + index} label={L(object.title)} {...AppConsts.formItemLayout} name={object.name} hasFeedback >
											{object.type === 'password' ? (
												<Input.Password minLength={AppConsts.maxLength.password} />
											) : (
												<Input maxLength={AppConsts.maxLength.name} type={object.type} />
											)}
										</Form.Item>
								))}
							</Form>
						</Row>
					</Col>
				</Row>
				<hr style={{ marginTop: "20px" }}></hr>
				<Button title={L('luu_cai_dat')} icon={<SaveOutlined />} type='primary' onClick={this.onSaveEmailSetting}> {L("luu_cai_dat")} </Button>
			</Card >
		);
	}
}