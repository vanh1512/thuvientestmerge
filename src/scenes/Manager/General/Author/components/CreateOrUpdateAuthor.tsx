import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, message, } from 'antd';
import { L } from '@lib/abpUtility';
import { AttachmentItem, AuthorDto, CreateAuthorInput, UpdateAuthorInput, } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import FileAttachments from '@src/components/FileAttachments';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import moment, { Moment } from 'moment';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (authorDto: AuthorDto) => void;
	onCancel: () => void;
	authorSelected: AuthorDto;
}

export default class CreateOrUpdateAuthor extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		birthday: moment() || null,
		au_id: -1,
		isLoadFile: false,
	};
	fileAttachmentItem: AttachmentItem = new AttachmentItem();

	async componentDidMount() {
		this.initData(this.props.authorSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.authorSelected.au_id !== prevState.au_id) {
			return { au_id: nextProps.authorSelected.au_id };
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.au_id !== prevState.au_id) {
			this.initData(this.props.authorSelected);
		}
	}

	initData = async (author: AuthorDto | undefined) => {
		this.setState({ isLoadDone: false, birthday: undefined });
		if (author == undefined) {
			author = new AuthorDto();
		}
		if (author !== undefined) {
			if (author.fi_id != null && author.fi_id.isdelete == false && author.fi_id.key != null) {
				this.fileAttachmentItem = author.fi_id;
			}
			else {
				this.fileAttachmentItem = new AttachmentItem();

			}
			if (author.au_dob != undefined && author.au_dob != '') {
				this.setState({ birthday: moment(author.au_dob, 'DD/MM/YYYY') });
			}
		}
		if (author.au_decs == null) {
			author.au_decs = "";
		}
		if (author.au_infor == null) {
			author.au_infor = "";
		}
		await this.formRef.current!.setFieldsValue({ ...author });
		await this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
	};

	onCreateUpdate = () => {
		const { authorSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (authorSelected.au_id === undefined) {
				let unitData = new CreateAuthorInput({ ...values });
				unitData.fi_id = this.fileAttachmentItem;
				let result = await stores.authorStore.createAuthor(unitData);
				await this.onCreateUpdateSuccess(result);
				message.success(L("them_moi_thanh_cong"))
			} else {
				let unitData = new UpdateAuthorInput({ au_id: authorSelected.au_id, ...values });
				unitData.fi_id = this.fileAttachmentItem;
				let result = await stores.authorStore.updateAuthor(unitData);
				await this.onCreateUpdateSuccess(result);
				message.success(L("chinh_sua_thanh_cong"))
			}
			this.setState({ isLoadDone: true });
		});
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	};
	onCreateUpdateSuccess = (author: AuthorDto) => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(author);
		}
	};
	render() {
		const self = this;
		const { authorSelected } = this.props;

		return (
			<Card>
				<Row>
					<Col span={12}>
						<h3>
							{this.state.au_id === undefined
								? (L('them_moi_tac_gia'))
								: (L('tac_gia')) + ": " + authorSelected.au_name}
						</h3>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button
							title={L('huy')}
							danger
							onClick={() => this.onCancel()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
						>
							{L("huy")}
						</Button>
						<Button
							title={L('luu')}
							type="primary"
							onClick={() => this.onCreateUpdate()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
						>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row>
					<Form ref={this.formRef} style={{ width: '100%' }}>
						<Form.Item label={L("anh_dai_dien")} {...AppConsts.formItemLayout} name={'fi_id'}>
							<FileAttachments
								files={
									[this.fileAttachmentItem]

								}
								isLoadFile={this.state.isLoadFile}
								allowRemove={true}
								isMultiple={false}
								isViewFile={true}
								componentUpload={FileUploadType.Avatar}
								onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
									self.fileAttachmentItem = itemFile[0];
								}}
							/>
						</Form.Item>
						<Form.Item label={(L('ho_ten'))} {...AppConsts.formItemLayout} rules={[rules.required, rules.onlyLetter]} name={'au_name'}>
							<Input placeholder={L('ho_ten')} maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={L('but_danh')} {...AppConsts.formItemLayout} name={'au_pen_name'}>
							<Input placeholder={L('but_danh')} maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={(L('dia_chi'))} {...AppConsts.formItemLayout} name={'au_address'}>
							<Input placeholder={L('dia_chi')} />
						</Form.Item>
						<Form.Item label={(L('ngay_sinh'))} {...AppConsts.formItemLayout} name={'au_dob'} valuePropName="au_dob">
							<DatePicker
								placeholder={L('ngay_sinh')}
								onChange={(date: Moment | null, dateString: string) => {
									this.setState({ birthday: date });
									this.formRef.current.setFieldsValue({ au_dob: dateString });
								}}
								format={'DD/MM/YYYY'}
								value={this.state.birthday}
							/>
						</Form.Item>

						<Form.Item label={L('hoc_ham')} {...AppConsts.formItemLayout} name={'au_academic_rank'}>
							<Input placeholder={L('hoc_ham')} maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={L('hoc_vi')} {...AppConsts.formItemLayout} name={'au_degree'}>
							<Input placeholder={L('hoc_vi')} maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={L('mo_ta')} rules={[rules.description]} {...AppConsts.formItemLayout} name={'au_decs'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}
						>
							<CKEditor editor={ClassicEditor} config={{ placeholder: L('mo_ta') }} />
						</Form.Item>
						<Form.Item label={L('thong_tin_them')} {...AppConsts.formItemLayout} name={'au_infor'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} config={{ placeholder: L('thong_tin_them') }} />
						</Form.Item>
					</Form>
				</Row>
			</Card>
		);
	}
}
