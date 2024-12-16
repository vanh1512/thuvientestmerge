import FileAttachments from "@src/components/FileAttachments";
import SelectEnum from "@src/components/Manager/SelectEnum";
import { L } from "@src/lib/abpUtility";
import AppConsts, { FileUploadType, cssColResponsiveSpan } from "@src/lib/appconst";
import { eGENDER } from "@src/lib/enumconst";
import rules from "@src/scenes/Validation";
import { AttachmentItem, FindMemberBorrowDto, GetCurrentLoginInformationsOutput, UpdateMemberAvatarSesionInput, UpdateMemberSesionInput } from "@src/services/services_autogen";
import { stores } from "@src/stores/storeInitializer";
import { Button, Col, DatePicker, Form, Input, Row, message } from "antd";
import moment from "moment";
import { Moment } from "moment";

import * as React from "react";
export interface IProps {
	memberInfo?: FindMemberBorrowDto;
	updateSuccess?: () => void;
	userLogin?: GetCurrentLoginInformationsOutput;
}

export default class FormEditInforMember extends React.Component<IProps>
{
	state = {
		isLoadDone: true,
		idMember: -1,
		birthday: moment() || null,
		me_sex: undefined,
	}
	fileAttachmentItem: AttachmentItem = new AttachmentItem();

	private formRef: any = React.createRef();
	async componentDidMount() {
		this.initData(this.props.memberInfo);
	}

	updateSuccess = () => {
		if (!!this.props.updateSuccess) {
			this.props.updateSuccess();
		}
	}


	initData = async (inputmember: FindMemberBorrowDto | undefined) => {
		this.setState({ isLoadDone: false, birthday: undefined });
		if (inputmember !== undefined && inputmember.me_id !== undefined) {
			this.fileAttachmentItem = inputmember.fi_id!;
			if (inputmember.me_birthday != undefined && inputmember.me_birthday != "") {
				this.setState({ birthday: moment(inputmember.me_birthday, "DD/MM/YYYY") });
			}
			await this.formRef.current!.setFieldsValue({ ...inputmember });
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });
	}

	onUpdate = async () => {
		const form = this.formRef.current;
		const { memberInfo } = this.props;
		form!.validateFields().then(async (values: any) => {
			if (memberInfo != undefined && memberInfo.me_id != undefined) {
				let unitData = new UpdateMemberSesionInput({ me_id: memberInfo.me_id, ...values });
				await stores.sessionStore.updateMemberInformation(unitData);
				message.success(L("SuccessfullyEdited"));
				await this.updateSuccess();
			}
		})
	}
	onAddAndRemoveFile = (file: AttachmentItem) => {
		this.setState({ isLoadDone: false });
		this.fileAttachmentItem = file;
		this.formRef.current.setFieldsValue({ fi_id: this.fileAttachmentItem });
		this.setState({ isLoadDone: true });
	};
	render() {
		const self = this;
		return (
			<>
				<Row style={{ justifyContent: 'end' }}><Button type="primary" onClick={() => this.onUpdate()}>{L("Save")}</Button></Row>
				<h2 style={{ textAlign: 'center', marginBottom: 20 }}>{L("EditUserInformation")}</h2>
				<Form ref={this.formRef}>
					<Row gutter={[16, 16]}>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('NameUser') + ": "} rules={[rules.required, rules.onlyLetter]}  {...AppConsts.formItemLayout} name={'me_name'} hasFeedback>
								<Input placeholder={L('NameUser')} allowClear maxLength={AppConsts.maxLength.name} />
							</Form.Item>
						</Col>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('Birthday') + ": "} rules={[rules.required]}  {...AppConsts.formItemLayout} name={'me_birthday'} hasFeedback valuePropName='me_birthday'>
								<DatePicker
									style={{ width: '100%' }}
									onChange={(date: Moment | null, dateString: string) => { this.setState({ birthday: date }); this.formRef.current.setFieldsValue({ me_birthday: dateString }); }}
									format={"DD/MM/YYYY"}
									value={this.state.birthday}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={[16, 16]}>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('Identification') + ':'} rules={[rules.required, rules.numberOnly]}  {...AppConsts.formItemLayout} name={'me_identify'} hasFeedback >
								<Input placeholder={L('Identification')} allowClear maxLength={AppConsts.maxLength.cccd} />
							</Form.Item>
						</Col>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('so_dien_thoai') + ": "} rules={[rules.required, rules.numberOnly]}  {...AppConsts.formItemLayout} name={'me_phone'} hasFeedback >
								<Input placeholder={L('so_dien_thoai')} allowClear maxLength={AppConsts.maxLength.phone} />
							</Form.Item>
						</Col>

					</Row>
					<Row gutter={[16, 16]}>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('Gender') + ": "} rules={[rules.required]}  {...AppConsts.formItemLayout} name={'me_sex'} hasFeedback>
								<SelectEnum eNum={eGENDER} enum_value={this.props.memberInfo!.me_sex} onChangeEnum={async (value: number) => { await this.setState({ me_sex: value }); await this.formRef.current.setFieldsValue({ me_sex: value }); }} />
							</Form.Item></Col>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('Address') + ": "} rules={[rules.required]}  {...AppConsts.formItemLayout} name={'me_address'} hasFeedback>
								<Input placeholder={L('Address')} allowClear />
							</Form.Item></Col>
					</Row>
					<Row gutter={[16, 16]}>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('Infomation')} {...AppConsts.formItemLayout} name={'me_more_infor'} >
								<Input.TextArea allowClear rows={4} placeholder={L('Infomation')}/>
							</Form.Item>
						</Col>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<Form.Item label={L('Note') + ": "} {...AppConsts.formItemLayout} name={'me_note'} hasFeedback >
								<Input.TextArea allowClear rows={2} placeholder={L('Note')}/>
							</Form.Item>
						</Col>
					</Row>
				</Form>

			</>
		)
	}
}