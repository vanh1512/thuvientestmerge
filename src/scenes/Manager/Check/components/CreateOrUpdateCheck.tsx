import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, message } from 'antd';
import { L } from '@lib/abpUtility';
import { AttachmentItem, CheckDto, CreateCheckInput, ItemUser, UpdateCheckInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import { Moment } from 'moment';
import moment from 'moment';
import CheckItem from '../CheckItem';
import SelectUser from '@src/components/Manager/SelectUser';
import { eProcess, eUserType } from '@src/lib/enumconst';
import rules from '@src/scenes/Validation';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileAttachments from '@src/components/FileAttachments';

export interface IProps {
	onCreateUpdateSuccess?: (borrowReDto: CheckDto) => void;
	onCancel: () => void;
	checkSelected: CheckDto;
}

export default class CreateOrUpdateCheck extends React.Component<IProps>{
	private formRef: any = React.createRef();
	listAttachmentItem: AttachmentItem[] = [];
	state = {
		isLoadDone: false,
		update: false,
		idSelected: -1,
		ck_start_at: moment() || null,
		isLoadFile: false,
	}
	checkSelected: CheckDto;
	fileAttachmentItem: AttachmentItem = new AttachmentItem();
	async componentDidMount() {
		this.initData(this.props.checkSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.checkSelected.ck_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.checkSelected.ck_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.checkSelected);
		}
	}


	initData = async (inputcheck: CheckDto | undefined) => {
		this.setState({ isLoadDone: false, ck_start_at: undefined });
		if (inputcheck !== undefined && inputcheck.ck_id !== undefined) {
			this.listAttachmentItem = (inputcheck.fi_id_arr === undefined) ? [] : inputcheck.fi_id_arr;
			if (inputcheck.ck_start_at != undefined) {
				this.setState({
					ck_start_at: moment(inputcheck.ck_start_at, "DD/MM/YYYY"),

				})
			}
			if (this.props.checkSelected.ck_process != eProcess.Sign.num) {
				await this.formRef.current!.setFieldsValue({ ...inputcheck, });
			}
		} else {
			this.listAttachmentItem = [];
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true, update: !this.state.update, isLoadFile: !this.state.isLoadFile });

	}

	onCreateUpdate = () => {
		const { checkSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (checkSelected.ck_id === undefined || checkSelected.ck_id < 0) {
				let unitData = new CreateCheckInput(values);
				unitData.fi_id_arr = this.listAttachmentItem;
				await stores.checkStore.createCheck(unitData);
				this.formRef.current.resetFields();
				message.success(L("SuccessfullyAdded"));
			} else {
				let unitData = new UpdateCheckInput({ ck_id: checkSelected.ck_id, ...values });
				unitData.fi_id_arr = this.listAttachmentItem;
				await stores.checkStore.updateCheck(unitData);
				message.success(L("SuccessfullyEdited"));
			}
			await this.onCreateUpdateSuccess();
			this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
		})
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.checkSelected);
		}

	}
	renderCheck = (check: CheckDto) => {
		if (check.ck_id === undefined || check.ck_id < 1) {
			return <></>
		}
		return <CheckItem check_selected={check} onCancel={() => this.onCancel()} />;

	}

	disabledDate = (current) => {
		const today = moment().startOf('day');
		return current && current < today;
	}
	render() {
		const { checkSelected } = this.props;
		const self = this;
		const layout = {
			labelCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 8 }, lg: { span: 8 }, xl: { span: 10 }, xxl: { span: 10 } },
			wrapperCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 8 }, lg: { span: 8 }, xl: { span: 14 }, xxl: { span: 14 } },
		};
		return (
			<Card >
				<Row style={{ marginBottom: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{checkSelected.ck_process == eProcess.Sign.num ? L("CheckPlan") + checkSelected.ck_code : this.state.idSelected === undefined ? L("Add") + " " + L('CheckPlan') : L("Edit") + " " + L('CheckPlan') + ": " + checkSelected.ck_code}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L('huy')} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('huy')}
						</Button>
						{checkSelected.ck_process != eProcess.Sign.num &&
							<Button title={L('Save')} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L('Save')}
							</Button>}
					</Col>
				</Row>
				{checkSelected.ck_process != eProcess.Sign.num &&
					<Form {...layout} ref={this.formRef}>
						<Form.Item label={L('ten_kiem_ke')} name={'ck_name'} rules={[rules.required, rules.noAllSpaces]} hasFeedback>
							<Input placeholder={L("ten_kiem_ke") + "..."} maxLength={AppConsts.maxLength.name} />

						</Form.Item>
						<Form.Item label={L('CheckStartDate')} rules={[rules.required]} name={'ck_start_at'} hasFeedback valuePropName='ck_start_at'>
							<DatePicker
								onChange={(date: Moment | null, dateString: string) => { this.setState({ birthday: date }); this.formRef.current.setFieldsValue({ ck_start_at: date }); }}
								format={"DD/MM/YYYY"} value={this.state.ck_start_at}
								disabledDate={this.disabledDate}
								allowClear
								style={{ width: '100%' }}
								placeholder={L("CheckStartDate") + "..."}
							/>
						</Form.Item>
						<Form.Item label={L('ParticipantInTheCheck')} rules={[rules.required]} name={'us_id_participant'}>
							<SelectUser mode='multiple' role_user={eUserType.Manager.num} update={this.state.update} userItem={checkSelected.ck_id != undefined ? checkSelected.us_id_participant : []} onChangeUser={(value: ItemUser[]) => this.formRef.current!.setFieldsValue({ us_id_participant: value })} />
						</Form.Item>
						<Form.Item label={L('thong_tin_them')} {...AppConsts.formItemLayout} name={'ck_desc'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} config={{ placeholder: L('thong_tin_them') }} />
						</Form.Item>
						<strong>{L('bien_ban_kiem_ke')} </strong>
						<FileAttachments
							files={self.listAttachmentItem}
							isLoadFile={this.state.isLoadFile}
							allowRemove={true}
							isMultiple={true}
							componentUpload={FileUploadType.Contracts}
							onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
								self.listAttachmentItem = itemFile;
							}}
						/>
					</Form>
				}
				{this.renderCheck(checkSelected)}
			</Card >
		)
	}
}