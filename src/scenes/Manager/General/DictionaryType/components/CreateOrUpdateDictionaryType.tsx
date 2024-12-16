import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message } from 'antd';
import { L } from '@lib/abpUtility';
import { DictionaryTypeDto, CreateDictionaryTypeInput, UpdateDictionaryTypeInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import Dictionaries from '../Dictionaries';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (borrowReDto: DictionaryTypeDto) => void;
	onCancel: () => void;
	dictionaryTypeSelected: DictionaryTypeDto;
}

export default class CreateOrUpdateDictionaryType extends React.Component<IProps>{
	private formRef: any = React.createRef();
	state = {
		isLoadDone: false,
		dic_ty_id: -1,
	}

	async componentDidMount() {

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.dictionaryTypeSelected !== undefined && nextProps.dictionaryTypeSelected.dic_ty_id !== prevState.dic_ty_id) {
			return ({ dic_ty_id: nextProps.dictionaryTypeSelected.dic_ty_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.dic_ty_id !== prevState.dic_ty_id) {
			this.initData(this.props.dictionaryTypeSelected);
		}
	}


	initData = async (dicType: DictionaryTypeDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (dicType == undefined) {
			dicType = new DictionaryTypeDto();
		}
		if (dicType !== undefined && dicType.dic_ty_id !== undefined) {
			this.formRef.current!.setFieldsValue({ ...dicType, });
		}
		else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { dictionaryTypeSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (dictionaryTypeSelected.dic_ty_id === undefined || dictionaryTypeSelected.dic_ty_id < 0) {
				let unitData = new CreateDictionaryTypeInput(values);
				let result = await stores.dictionaryTypeStore.create(unitData);
				await this.onCreateUpdateSuccess(result);
				message.success(L("them_moi_thanh_cong"));
			} else {
				let unitData = new UpdateDictionaryTypeInput({ dic_ty_id: dictionaryTypeSelected.dic_ty_id, ...values });
				// unitData.dic_ty_id = borrowReDto.dic_ty_id;
				let result = await stores.dictionaryTypeStore.update(unitData);
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
	onCreateUpdateSuccess = (dicType: DictionaryTypeDto) => {
		this.formRef.current?.resetFields?.();
			this.props.onCreateUpdateSuccess?.(dicType);
	};
	
	renderDictionary = (dicType: DictionaryTypeDto) => {
		if (dicType === undefined || dicType.dic_ty_id === undefined || dicType.dic_ty_id < 1) {
			return <></>
		}
		return <Dictionaries dictionaryType={dicType} />
	}
	render() {
		const { dictionaryTypeSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginBottom: '5px' }}>
					<Col span={12}><h3>{this.state.dic_ty_id === undefined ? (L("them_tu_dien")) : (L("chinh_sua_tu_dien")) + ": " + dictionaryTypeSelected.dic_ty_name}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L("huy")} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L("luu")} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row>
					<Form ref={this.formRef} style={{ width: "100%" }}>
						<Form.Item label={L('ten')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'dic_ty_name'}  >
							<Input maxLength={AppConsts.maxLength.code} placeholder={L('ten_tu_dien')}/>
						</Form.Item>
						<Form.Item label={L('mo_ta')} {...AppConsts.formItemLayout} rules={[rules.description]} name={'dic_ty_desc'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>

					</Form>
				</Row>
				{this.renderDictionary(dictionaryTypeSelected)}


			</Card >
		)
	}
}