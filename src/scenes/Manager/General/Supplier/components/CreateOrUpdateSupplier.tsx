import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message } from 'antd';
import { L } from '@lib/abpUtility';
import { SupplierDto, CreateSupplierInput, UpdateSupplierInput, AttachmentItem } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';
import FileAttachments from '@src/components/FileAttachments';

export interface IProps {
	onCreateUpdateSuccess?: (borrowReDto: SupplierDto) => void;
	onCancel: () => void;
	supplierSelected: SupplierDto;
}

export default class CreateOrUpdateSupplier extends React.Component<IProps>{
	private formRef: any = React.createRef();
	listAttachmentItem: AttachmentItem[] = [];
	state = {
		isLoadDone: false,
		isLoadFile: false,
		su_id_selected: -1,
	}


	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.supplierSelected.su_id !== prevState.su_id_selected) {
			return ({ su_id_selected: nextProps.supplierSelected.su_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.su_id_selected !== prevState.su_id_selected) {
			this.initData(this.props.supplierSelected);
		}
	}


	initData = async (inputSupplier: SupplierDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputSupplier === undefined) {
			inputSupplier = new SupplierDto();
		}
		if (inputSupplier !== undefined && inputSupplier.su_id !== undefined) {
			this.listAttachmentItem = (inputSupplier.fi_id_arr === undefined) ? [] : inputSupplier.fi_id_arr.filter(item => item.isdelete === false);


		} else {
			this.listAttachmentItem = [];
		}
		if (inputSupplier.su_contact_note == null) {
			inputSupplier.su_contact_note = "";
		}
		await this.formRef.current!.setFieldsValue({ ...inputSupplier });
		await this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });

	}

	onCreateUpdate = () => {
		const { supplierSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			this.setState({ isLoadDone: false });
			if (supplierSelected.su_id === undefined || supplierSelected.su_id < 0) {
				let unitData = new CreateSupplierInput(values);
				unitData.fi_id_arr = this.listAttachmentItem;
				await stores.supplierStore.createSupplier(unitData);
				message.success(L("SuccessfullyAdded"));
			} else {
				let unitData = new UpdateSupplierInput({ su_id: supplierSelected.su_id, ...values });
				unitData.fi_id_arr = this.listAttachmentItem;
				await stores.supplierStore.updateSupplier(unitData);
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
			this.props.onCreateUpdateSuccess(this.props.supplierSelected);
		}

	}


	render() {
		const self = this;
		return (
			<Card >
				<Row style={{ marginTop: 10 }}>
					<Col span={12}><h3>{this.state.su_id_selected === undefined ? L('AddNewSupplier') : L('EditSupplier') + ": "}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L('Cancel')} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Cancel')}
						</Button>
						<Button title={L('Save')} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Save')}
						</Button>
					</Col>
				</Row>
				<h4>{L("FileAttachment")}</h4>
				<Row style={{ justifyContent: "center" }}>
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
				</Row>
				<Row style={{ marginTop: 10 }}>
					<Form ref={this.formRef} style={{ width: "100%" }}>
						<Form.Item label={L("TaxCode")} {...AppConsts.formItemLayout} rules={[rules.required, rules.so_kytudacbiet, rules.noSpaces]} name={'su_tax_code'}  >
							<Input maxLength={AppConsts.maxLength.mst} placeholder={L('TaxCode')} />
						</Form.Item>
						<Form.Item label={L("ShortName")} {...AppConsts.formItemLayout} rules={[ rules.noAllSpaces]} name={'su_short_name'}  >
							<Input maxLength={AppConsts.maxLength.name} placeholder={L('ShortName')}/>
						</Form.Item>
						<Form.Item label={L("SupplierName")} {...AppConsts.formItemLayout} rules={[rules.onlyLetter, rules.required]} name={'su_name'}>
							<Input maxLength={AppConsts.maxLength.name} placeholder={L('SupplierName')}/>
						</Form.Item>
						<Form.Item label={L("Contact")} {...AppConsts.formItemLayout} rules={[rules.required, rules.chucai_so]} name={'su_contact_name'}  >
							<Input maxLength={AppConsts.maxLength.name} placeholder={L('Contact')} />
						</Form.Item>
						<Form.Item label={L("Address")} {...AppConsts.formItemLayout} rules={[rules.required, rules.noAllSpaces, rules.no_kytudacbiet, rules.no_number]} name={'su_contact_address'}>
							<Input  placeholder={L('Address')}/>
						</Form.Item>
						<Form.Item label={L('so_dien_thoai')} {...AppConsts.formItemLayout} rules={[rules.required, rules.phone]} name={'su_contact_phone'}  >
							<Input maxLength={AppConsts.maxLength.phone} placeholder={L('so_dien_thoai')} />
						</Form.Item>
						<Form.Item label={L("Email")} {...AppConsts.formItemLayout} rules={[rules.required, rules.emailAddress]} name={'su_contact_email'}>
							<Input maxLength={AppConsts.maxLength.email} placeholder={L('Email')}/>
						</Form.Item>
						<Form.Item label={L("Fax")} {...AppConsts.formItemLayout} name={'su_contact_fax'}>
							<Input placeholder={L('Fax')}/>
						</Form.Item>
						<Form.Item label={L("Note")} {...AppConsts.formItemLayout} rules={[rules.description]} name={'su_contact_note'}
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>

					</Form>
				</Row>
			</Card >
		)
	}
}