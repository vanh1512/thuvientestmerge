import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message, DatePicker } from 'antd';
import { L } from '@lib/abpUtility';
import { MemberDto, CreateMemberInput, UpdateMemberInput, AttachmentItem } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import { eGENDER, eMemberRegisterStatus, } from '@src/lib/enumconst';
import moment, { Moment } from 'moment';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileAttachments from '@src/components/FileAttachments';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (member: MemberDto) => void;
	onCancel: () => void;
	memberSelected: MemberDto;
}

export default class CreateOrUpdateMember extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		birthday: moment() || null,
		idSelected: -1,
		me_sex: undefined,
		isLoadFile: false,
	}
	memberSelected: MemberDto;
	fileAttachmentItem: AttachmentItem = new AttachmentItem();
	async componentDidMount() {
		this.initData(this.props.memberSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.memberSelected.me_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.memberSelected.me_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.memberSelected);
		}
	}


	initData = async (inputmember: MemberDto | undefined) => {
		this.setState({ isLoadDone: false, birthday: undefined });
		if (inputmember == undefined) {
			inputmember = new MemberDto();
		}
		if (inputmember !== undefined) {
			if (inputmember.fi_id != null && inputmember.fi_id.isdelete == false && inputmember.fi_id.key != null) {
				this.fileAttachmentItem = inputmember.fi_id;
			}
			else {
				this.fileAttachmentItem = new AttachmentItem();
			}
			if (inputmember.me_birthday != undefined && inputmember.me_birthday != "") {
				this.setState({ birthday: moment(inputmember.me_birthday, "DD/MM/YYYY") })
			}

		}
		if (inputmember.me_more_infor == null) {
			inputmember.me_more_infor = "";
		}
		if (inputmember.me_note == null) {
			inputmember.me_note = "";
		}

		await this.formRef.current!.setFieldsValue({ ...inputmember, });
		await this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
	}

	onCreateUpdate = () => {
		const { memberSelected } = this.props;
		const form = this.formRef.current;
		console.log("aaaaa", this.fileAttachmentItem);

		form!.validateFields().then(async (values: any) => {
			if (memberSelected.me_id === undefined || memberSelected.me_id < 0) {
				let unitData = new CreateMemberInput(values);
				unitData.fi_id = this.fileAttachmentItem != undefined ? this.fileAttachmentItem : new AttachmentItem();
				await stores.memberStore.createMember(unitData);
				message.success(L('SuccessfullyAdded'));
			} else {
				let unitData = new UpdateMemberInput({ me_id: memberSelected.me_id, ...values });
				unitData.fi_id = this.fileAttachmentItem != undefined ? this.fileAttachmentItem : new AttachmentItem();
				await stores.memberStore.updateMember(unitData);
				message.success(L("SuccessfullyEdited"));
			}
			await this.onCreateUpdateSuccess();
			this.setState({ isLoadDone: true });
		})
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.memberSelected);
		}
	}

	render() {
		const { memberSelected } = this.props;
		let self = this;
		return (
			<Card >
				{memberSelected.me_is_locked ?
					<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
						<Col span={12}><h3>{L("MemberInformation") + ": " + memberSelected.me_code + "__" + memberSelected.me_name}</h3></Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("Cancel")}
							</Button>
						</Col>
					</Row>
					: <Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
						<Col span={12}><h3>{this.state.idSelected === undefined ? L("AddMember") : L('EditMember') + ": " + memberSelected.me_code + "__" + memberSelected.me_name}</h3></Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("Cancel")}
							</Button>
							<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("Save")}
							</Button>
						</Col>
					</Row>}
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef} style={{ width: '100%' }} >
						<Form.Item label={L("Avatar")} {...AppConsts.formItemLayout} name={'fi_id'}  >
							<FileAttachments
								files={[this.fileAttachmentItem]}
								isLoadFile={this.state.isLoadFile}
								allowRemove={true}
								isMultiple={false}
								componentUpload={FileUploadType.Avatar}
								onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
									self.fileAttachmentItem = itemFile[0]
								}}
							/>
						</Form.Item>
						{memberSelected.me_id === undefined &&
							<>
								<Form.Item label={L('UserName')} {...AppConsts.formItemLayout} rules={[rules.required, rules.noSpaces, rules.userName]} name={'userName'} hasFeedback>
									<Input placeholder={L("UserName") + "..."} maxLength={AppConsts.maxLength.name} />
								</Form.Item>
								<Form.Item label={L('Email')} {...AppConsts.formItemLayout} rules={[rules.required, rules.emailAddress]} name={'emailAddress'} hasFeedback>
									<Input placeholder={L("Email") + "..."} />
								</Form.Item>
								<Form.Item label={L('Password')} {...AppConsts.formItemLayout} rules={[rules.required, rules.password]} name={'password'} hasFeedback>
									<Input.Password visibilityToggle={true} />
								</Form.Item>
							</>}
						<Form.Item label={L('MemberName')} {...AppConsts.formItemLayout} rules={[rules.required, rules.onlyLetter]} name={'me_name'} hasFeedback>
							<Input placeholder={L("MemberName") + "..."} maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={L('Identification')} {...AppConsts.formItemLayout} rules={[rules.required, rules.cccd]} name={'me_identify'} hasFeedback>
							<Input placeholder={L("Identification") + "..."} maxLength={AppConsts.maxLength.cccd} />
						</Form.Item>
						<Form.Item label={L('Birthday')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'me_birthday'} hasFeedback valuePropName='me_birthday'>
							<DatePicker
								placeholder={L("Birthday") + "..."}
								onChange={(date: Moment | null, dateString: string) => { this.setState({ birthday: date }); this.formRef.current.setFieldsValue({ me_birthday: dateString }); }}
								format={"DD/MM/YYYY"} value={this.state.birthday}
							/>
						</Form.Item>
						<Form.Item label={L('Gender')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'me_sex'} hasFeedback>
							<SelectEnum eNum={eGENDER} enum_value={this.props.memberSelected.me_sex} onChangeEnum={async (value: number) => { await this.setState({ me_sex: value }); await this.formRef.current.setFieldsValue({ me_sex: value }); }} />
						</Form.Item>
						<Form.Item label={L('SĐT')} {...AppConsts.formItemLayout} rules={[rules.required, rules.phone]} name={'me_phone'} hasFeedback>
							<Input maxLength={AppConsts.maxLength.phone} />
						</Form.Item>
						<Form.Item label={L('Address')} {...AppConsts.formItemLayout} rules={[rules.required, rules.noAllSpaces]} name={'me_address'} hasFeedback>
							<Input placeholder={L("Address") + "..."} maxLength={AppConsts.maxLength.address} />
						</Form.Item>
						<Form.Item label={L('MoreInfor')} {...AppConsts.formItemLayout} rules={[rules.description]} name={'me_more_infor'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}
						>
							<CKEditor placeholder={L("MoreInfor") + "..."} editor={ClassicEditor} />
						</Form.Item>

						<Form.Item label={L('Note')} {...AppConsts.formItemLayout} rules={[rules.description]} name={'me_note'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}
						>
							<CKEditor placeholder={L("Note") + "..."} editor={ClassicEditor} />
						</Form.Item>
					</Form>
				</Row>
			</Card >
		)
	}
}