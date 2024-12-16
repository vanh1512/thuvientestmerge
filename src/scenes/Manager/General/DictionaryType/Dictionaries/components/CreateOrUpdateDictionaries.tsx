import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message } from 'antd';
import { DictionariesDto, CreateDictionariesInput, UpdateDictionariesInput, AttachmentItem } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { L } from '@src/lib/abpUtility';
import FileAttachments from '@src/components/FileAttachments';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (borrowReDto: DictionariesDto) => void;
	onCancel: () => void;
	dictionaries: DictionariesDto;
}

export default class CreateOrUpdateDictionaries extends AppComponentBase<IProps>{
	private formRef: any = React.createRef();
	fileAttachmentItem: AttachmentItem
	state = {
		isLoadDone: false,
		dic_id_selected: -1,
		isLoadFile: false,
	}

	async componentDidMount() {
		await this.initData(this.props.dictionaries);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.dictionaries !== undefined && nextProps.dictionaries.dic_id !== prevState.dic_id_selected) {
			return ({ dic_id_selected: nextProps.dictionaries.dic_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.dic_id_selected !== prevState.dic_id_selected) {
			await this.initData(this.props.dictionaries);
			window.scrollTo({ top: 0 });
		}
	}
	initData = async (dic: DictionariesDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (dic !== undefined) {
			if (dic.fi_id_symbol != null && dic.fi_id_symbol.isdelete === false) {
				this.fileAttachmentItem = dic.fi_id_symbol;
			}
			if (dic.dic_desc === undefined && dic.dic_short_des === undefined) { dic.dic_desc = ''; dic.dic_short_des = '' }
			else {
				this.fileAttachmentItem = new AttachmentItem();
			}

			await this.formRef.current!.setFieldsValue({ ...dic, });
		}
		this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
	}

	onCreateUpdate = () => {
		const { dictionaries } = this.props;
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (dictionaries.dic_id === undefined || dictionaries.dic_id < 0) {
				let input = new CreateDictionariesInput({ dic_ty_id: dictionaries.dic_ty_id, ...values });
				input.fi_id_symbol = this.fileAttachmentItem;
				let result = await stores.dictionariesStore.create(input);
				await this.onCreateUpdateSuccess(result);
				message.success(L("them_moi_thanh_cong"));
				this.formRef.current.resetFields();
			} else {
				let input = new UpdateDictionariesInput({ dic_id: dictionaries.dic_id, dic_ty_id: dictionaries.dic_ty_id, ...values });
				input.fi_id_symbol = this.fileAttachmentItem;
				let result = await stores.dictionariesStore.update(input);
				await this.onCreateUpdateSuccess(result);
				message.success(L("chinh_sua_thanh_cong"));
			}
			this.setState({ isLoadDone: true });
		})
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = (dic: DictionariesDto) => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(dic);
		}

	}
	render() {
		const self = this;
		const { dictionaries } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.dic_id_selected === undefined ? (L("them_dinh_nghia")) + ": " : (L("chinh_sua_dinh_nghia")) + ": " + dictionaries.dic_name}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger title={L("huy")} onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button type="primary" title={L("luu")} onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row >

					<Form ref={this.formRef} style={{ width: "100%" }}>
						<Form.Item label={L("Ảnh file")} {...AppConsts.formItemLayout} name={'fi_id_symbol'}>
							<FileAttachments
								files={[this.fileAttachmentItem]}
								isLoadFile={this.state.isLoadFile}
								allowRemove={true}
								isMultiple={false}
								componentUpload={FileUploadType.Avatar}
								onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
									self.fileAttachmentItem = itemFile[0];
								}}
							/>
						</Form.Item>

						<Form.Item style={{ marginTop: "10px" }} label={L("ten")} {...AppConsts.formItemLayout} rules={[rules.required, rules.chucai_so]} name={'dic_name'} >
							<Input maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={L("mo_ta_ngan")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'dic_short_des'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>
						<Form.Item label={L("chi_tiet")} {...AppConsts.formItemLayout} name={'dic_desc'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>
						<Form.Item label={L("tham_khao")} {...AppConsts.formItemLayout} name={'dic_ref'}>
							<Input></Input>
						</Form.Item>

					</Form>
				</Row>
			</Card >
		)
	}
}