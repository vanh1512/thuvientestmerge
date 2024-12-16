import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, InputNumber, message, Select } from 'antd';
import { L } from '@lib/abpUtility';
import { DocumentDto, CreateDocumentInput, UpdateDocumentInput, AttachmentItem, ItemLanguages, ItemField, ItemAuthor, ItemPublisher, TopicAbtractDto, FileDocumentDto, FileParameter } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import { Moment } from 'moment';
import moment from 'moment';
import SelectTreeCategory from '@components/Manager/SelectTreeCategory';
import SelectedPublisher from '@src/components/Manager/SelectedPublisher';
import { eDocumentBorrowType, eDocumentPeriod, eDocumentStatus, } from '@src/lib/enumconst';
import SelectedTopic from '@src/components/Manager/SelectedTopic';
import TreeSelectRepository from '@components/Manager/SelectTreeResponsitory';
import MultiSelectedAuthor from '@src/components/Manager/MultiSelectedAuthor';
import MultiSelectedField from '@src/components/Manager/MultiSelectedField';
import SelectedLanguages from '@src/components/Manager/SelectedLanguages';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import FileAttachments from '@src/components/FileAttachments';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import rules from '@src/scenes/Validation';
import FileAttachmentDocument from './FileAttachmentDocument';
import SelectEnum from '@src/components/Manager/SelectEnum';

export interface IProps {
	onCreateUpdateSuccess?: () => void;
	onCancel: () => void;
	documentSelected: DocumentDto;
}

export default class CreateOrUpdateDoccument extends AppComponentBase<IProps>{
	private formRef: any = React.createRef();
	listAttachmentItem_cover: AttachmentItem[] = [];
	listAttachmentItem_file: AttachmentItem[] = [];
	listFileParameter: FileParameter[] = [];
	listFileDocumentId: number[] = [];
	state = {
		isLoadDone: false,
		idSelected: -1,
		available_date: moment() || null,
		status: undefined,
		do_date_publish: undefined,
		lastest_check_date: moment() || null,
		price: 0,
		fi_id: undefined,
		isLoadFile: false,
		isLoadButton: false,
		do_borrow_status: undefined,
	}
	documentSelected: DocumentDto = new DocumentDto();
	fileAttachmentItem: AttachmentItem | undefined = new AttachmentItem();
	async componentDidMount() {
		this.initData(this.props.documentSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.documentSelected.do_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.documentSelected.do_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.documentSelected);
		}

	}

	initData = async (inputdoccument: DocumentDto | undefined) => {

		this.setState({ isLoadDone: false, accessioned_date: undefined, available_date: undefined });
		if (inputdoccument == undefined) {
			inputdoccument = new DocumentDto();
		}
		if (inputdoccument !== undefined && inputdoccument.do_id !== undefined) {
			this.documentSelected = inputdoccument;
			this.listAttachmentItem_cover = (inputdoccument.fi_id_arr_cover === undefined) ? [] : inputdoccument.fi_id_arr_cover.filter(item => item.isdelete == false);


			if (inputdoccument.do_date_available != undefined && inputdoccument.do_date_publish !== undefined && inputdoccument.do_lastest_check != undefined) {
				this.setState({
					available_date: moment(inputdoccument.do_date_available, "DD/MM/YYYY"),
					do_date_publish: moment(inputdoccument.do_date_publish, "YYYY"),
					lastest_check_date: moment(inputdoccument.do_lastest_check, "DD/MM/YYYY"),
				})
			}
		}
		if (inputdoccument.do_abstract == null) {
			inputdoccument.do_abstract = "";
		}
		await this.formRef.current!.setFieldsValue({ ...inputdoccument, });
		await this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });

	}
	onCreateUpdate = () => {
		const { documentSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (documentSelected.do_id === undefined || documentSelected.do_id < 0) {
				let unitData = new CreateDocumentInput(values);
				unitData.fi_id_arr_cover = this.listAttachmentItem_cover;
				await stores.documentStore.createdocument(unitData);
				message.success(L('SuccessfullyAdded'));
				this.formRef.current.resetFields();
				this.setState({ isLoadButton: true });
			} else {
				let unitData = new UpdateDocumentInput({ do_id: documentSelected.do_id, ...values });
				unitData.fi_id_arr_cover = this.listAttachmentItem_cover;
				await stores.documentStore.updatedocument(unitData);
				this.setState({ isLoadButton: false });
				this.onCreateFileDocument(this.listFileParameter);
				this.onRemoveFileDocument(this.listFileDocumentId);
				message.success(L("SuccessfullyEdited"));
				this.setState({ isLoadButton: true });
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
			this.props.onCreateUpdateSuccess();
		}

	}

	onChangeDatePublish(date: string) {
		this.setState({ do_date_publish: moment(date, "YYYY") });
		this.formRef.current.setFieldsValue({ do_date_publish: date });
	}
	onCreateFileDocument = async (fileToUpload: FileParameter[]) => {
		this.setState({ isLoadDone: false });
		if (fileToUpload != undefined && fileToUpload.length > 0) {
			fileToUpload.map(async item => await stores.fileDocumentStore.createFileDocument(this.props.documentSelected.do_id, "", true, item));
		}
		await this.setState({ isLoadDone: true });
	}
	onRemoveFileDocument = async (listFileDocumentId: number[]) => {
		this.setState({ isLoadDone: false });
		if (listFileDocumentId != undefined && listFileDocumentId.length > 0) {
			listFileDocumentId.map(async item => stores.fileDocumentStore.deleteFileDocument(item));
		}
		await this.setState({ isLoadDone: true });
	}
	render() {
		const { documentSelected } = this.props;

		const self = this;
		const formItemLayout = { labelCol: cssCol(10), wrapperCol: cssCol(14) };
		return (
			<>
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={11}><h2>{this.state.idSelected === undefined ? L("AddDocument") : L('EditDocument') + ": "}</h2></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button loading={this.state.isLoadButton} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Save')}
						</Button>
					</Col>
				</Row>

				<Row>
					<Col {...cssCol(24)}>
						<Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
							<Form className='flex-form' style={{ width: "95%" }} ref={this.formRef}>
								<Col {...cssColResponsiveSpan(24, 24, 12, 12, 12, 12)} >
									<Form.Item label={L('DocumentName')} {...formItemLayout} name={'do_title'} rules={[rules.required, rules.noAllSpaces]}  >
										<Input maxLength={AppConsts.maxLength.address} placeholder={L("DocumentName") + "..."} />
									</Form.Item>
									<Form.Item label={L('BorrowStatus')} {...formItemLayout} name={'do_borrow_status'} rules={[rules.required]}>
										<SelectEnum eNum={eDocumentBorrowType} enum_value={documentSelected.do_borrow_status} onChangeEnum={async (value: number) => { await this.setState({ do_borrow_status: value }); await this.formRef.current.setFieldsValue({ do_borrow_status: value }); }} />
									</Form.Item>
									<Form.Item label={L('NumberOfPage')} {...formItemLayout} name={'do_nr_pages'} rules={[rules.required, rules.numberOnly]} >
										<InputNumber placeholder={L("NumberOfPage") + "..."} style={{ width: '100%' }} min={0} formatter={a => AppConsts.numberWithCommas(a)}
											parser={a => a!.replace(/\$s?|(,*)/g, '')} />
									</Form.Item>
									<Form.Item label={L('Price') + L('(VNĐ)')} rules={[rules.required, rules.numberOnly]} {...formItemLayout} name={'do_price'} >
										<InputNumber
											placeholder={L("Price") + "..."}
											style={{ width: '100%' }}
											formatter={a => AppConsts.numberWithCommas(a)}
											parser={a => a!.replace(/\$s?|(,*)/g, '')}
										/>
									</Form.Item>

									<Form.Item label={L('RepublishedTimes')} {...formItemLayout} name={'do_republish'} rules={[rules.required, rules.numberOnly]}>
										<InputNumber
											placeholder={L("RepublishedTimes") + "..."}
											min={0} style={{ width: '100%' }}
											formatter={a => AppConsts.numberWithCommas(a)}
											parser={a => a!.replace(/\$s?|(,*)/g, '')}
										/>
									</Form.Item>
									<Form.Item label={L('Translator')} {...formItemLayout} name={'do_translator'}>
										<Input placeholder={L("Translator")}></Input>
									</Form.Item>
									<Form.Item label={L('Identifier')} {...formItemLayout} rules={[rules.required, rules.noAllSpaces]} name={'do_identifier'} >
										<Input placeholder={L("Identifier") + "..."} />
									</Form.Item>
									<Form.Item label={L('Description')} {...formItemLayout} name={'do_abstract'} valuePropName='data'
										getValueFromEvent={(event, editor) => {
											const data = editor.getData();
											return data;
										}}
									>
										<CKEditor editor={ClassicEditor} />
									</Form.Item>
									<strong>{L('CoverImage')} </strong>
									<FileAttachments
										files={self.listAttachmentItem_cover}
										isLoadFile={this.state.isLoadFile}
										allowRemove={true}
										isMultiple={true}
										componentUpload={FileUploadType.Avatar}
										onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
											self.listAttachmentItem_cover = itemFile;
										}}
									/>
								</Col>
								<Col {...cssColResponsiveSpan(24, 24, 12, 12, 12, 12)} >
									<Form.Item label={L('AvailableDate')} {...formItemLayout} name={'do_date_available'} valuePropName='do_date_available' rules={[rules.required]} >
										<DatePicker
											style={{ width: '100%' }}
											onChange={(date: Moment | null, dateString: string) => { this.setState({ available_date: date }); this.formRef.current.setFieldsValue({ do_date_available: date }); }}
											format={"DD/MM/YYYY"}
											placeholder={L("Select") + "..."}
											value={this.state.available_date}
										/>
									</Form.Item>
									<Form.Item label={L('Language')} {...formItemLayout} name={'do_language_iso'} rules={[rules.required]} >
										<SelectedLanguages mode='multiple' lang={documentSelected.do_language_iso} onChangeLanguages={(value: ItemLanguages | ItemLanguages[]) => this.formRef.current!.setFieldsValue({ do_language_iso: value })} />
									</Form.Item>
									<Form.Item label={L('Field')} {...formItemLayout} name={'fie_id_arr'} >
										<MultiSelectedField mode='multiple' fields={documentSelected.fie_id_arr} onChangeField={(value: ItemField[] | undefined) => { this.formRef.current!.setFieldsValue({ fie_id_arr: value }) }} />
									</Form.Item>
									<Form.Item label={L('Author')} {...formItemLayout} name={'au_id_arr'} >
										<MultiSelectedAuthor mode='multiple' selectType='only_active' authors={documentSelected.au_id_arr} onChangeAuthor={(value: ItemAuthor[] | undefined) => { this.formRef.current!.setFieldsValue({ au_id_arr: value }) }} />
									</Form.Item>

									<Form.Item label={L('Publisher')} {...formItemLayout} name={'pu_id'} rules={[rules.required]} >
										<SelectedPublisher publisher={documentSelected.pu_id} onChangePublisher={(item: ItemPublisher | undefined) => this.formRef.current!.setFieldsValue({ pu_id: item })} />
									</Form.Item>
									<Form.Item label={L('Topic')} {...formItemLayout} name={'to_id'} rules={[rules.required]} >
										<SelectedTopic selected_to_id={documentSelected.to_id!} onChangeTopic={(item: number) => this.formRef.current!.setFieldsValue({ to_id: item })} />
									</Form.Item>
									<Form.Item label={L('Category')} {...formItemLayout} name={'ca_id'} rules={[rules.required]} >
										{documentSelected.do_id != undefined ?
											<label htmlFor="">{stores.sessionStore.getNameCategory(documentSelected.ca_id)}</label>
											:
											<SelectTreeCategory ca_id_select={documentSelected.ca_id!} onSelectCategory={(ca_id) => this.formRef.current!.setFieldsValue({ ca_id: ca_id })} disable={documentSelected.ca_id != undefined ? true : false} />
										}
									</Form.Item>
									<Form.Item label={L('YearOfPublication')} {...formItemLayout} name={'do_date_publish'} valuePropName='do_date_publish' rules={[rules.required]} >
										<DatePicker
											format='YYYY'
											allowClear={false}
											onChange={(date: Moment | null, dateString: string) => this.onChangeDatePublish(dateString)}
											placeholder={L("Select") + "..."}
											picker='year'
											style={{ width: '100%' }}
											value={this.state.do_date_publish}
										/>
									</Form.Item>
									<Form.Item label={L('CheckPeriod')} {...formItemLayout} name={'do_period_check'} rules={[rules.required]}>
										<Select
											style={{ width: '100%' }}
										>
											{Object.values(eDocumentPeriod).map((item, index: number) =>
												<Select.Option key={"period_" + item.num} value={item.num}> {item.name}</Select.Option>
											)}

										</Select>
									</Form.Item>
									{this.props.documentSelected.do_id != undefined &&
										<div style={{ marginLeft: '70px' }}>
											<strong >{L('FileAttachment')}</strong>
											<FileAttachmentDocument
												files={this.documentSelected.fileDocuments != undefined ? this.documentSelected.fileDocuments : []}
												allowEditting={true}
												isLoadFile={this.state.isLoadFile}
												allowRemove={true}
												isMultiple={true}
												componentUpload={FileUploadType.Contracts}
												onCreateFileDocument={async (itemFile: FileParameter[]) => {
													self.listFileParameter = itemFile;
												}}
												onRemoveFileDocument={async (itemFile: number[]) => {
													self.listFileDocumentId = itemFile;
												}}
											/>
										</div>
									}
								</Col>
							</Form>
						</Row>
					</Col>
				</Row>
			</>
		)
	}
}