import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message } from 'antd';
import { L } from '@lib/abpUtility';
import {  CreateSubFieldMarc21Input, SubFieldMarc21Dto, UpdateSubFieldMarc21Input, } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SelectedMARC21 from '@src/components/Manager/SelectedMARC21';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: () => void;
	onCancel: () => void;
	subFieldMarc21Selected: SubFieldMarc21Dto;
}

export default class CreateUpdateSubFieldMarc21 extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();
s
	state = {
		isLoadDone: false,
		mar_id: -1,
	};

	async componentDidMount() {
		await this.initData(this.props.subFieldMarc21Selected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.subFieldMarc21Selected.mar_id !== prevState.mar_id) {
			return { mar_id: nextProps.subFieldMarc21Selected.mar_id };
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.mar_id !== prevState.mar_id) {
			await this.initData(this.props.subFieldMarc21Selected);
		}
	}

	initData = async (mar: SubFieldMarc21Dto | undefined) => {
		this.setState({ isLoadDone: false, });
		if (mar === undefined) {
			mar = new SubFieldMarc21Dto();
		}
		if (mar.sub_desc == null) {
			mar.sub_desc = "";
		}
		await this.formRef.current!.setFieldsValue({ ...mar });
		await this.setState({ isLoadDone: true, });
	};

	onCreateUpdate = () => {
		const { subFieldMarc21Selected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (subFieldMarc21Selected.mar_id === undefined) {
				let unitData = new CreateSubFieldMarc21Input({ ...values });
				unitData.sub_code = values.sub_code.trim();
				await stores.subFieldMarc21Store.createSubFieldMarc21(unitData);
				await this.onCreateUpdateSuccess();
				message.success(L("them_moi_thanh_cong"))
			} else {
				let unitData = new UpdateSubFieldMarc21Input({ sub_id: subFieldMarc21Selected.sub_id, ...values });
				unitData.sub_code = values.sub_code.trim();
				await stores.subFieldMarc21Store.updateSubFieldMarc21(unitData);
				await this.onCreateUpdateSuccess();
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
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess();
		}
	};
	render() {
		const { subFieldMarc21Selected } = this.props;

		return (
			<Card>
				<Row>
					<Col span={12}>
						<h3>
							{this.state.mar_id === undefined
								? (L('them_moi'))
								: (L('ma_truong_con')) + ": " + subFieldMarc21Selected.sub_code}
						</h3>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button
							danger
							onClick={() => this.onCancel()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
							title={L("huy")}
						>
							{L("huy")}
						</Button>
						<Button
							type="primary"
							onClick={() => this.onCreateUpdate()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
							title={L("luu")}
						>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: "10px" }}>
					<Form ref={this.formRef} style={{ width: '100%' }}>
						<Form.Item label={(L('ma_truong_con'))} rules={[rules.required, rules.subfield_code]} {...AppConsts.formItemLayout} name={'sub_code'}	>
							<Input maxLength={2} placeholder={L('ma_truong_con')} />
						</Form.Item>
						<Form.Item label={(L('ma_marc21'))} {...AppConsts.formItemLayout} name={"mar_id"} rules={[rules.required]}>
							<SelectedMARC21 selected_marc21={this.props.subFieldMarc21Selected.mar_id} onChangeMARC21={(value: number) => this.formRef.current!.setFieldsValue({ mar_id: value })} />
						</Form.Item>
						<Form.Item label={L('mo_ta')} rules={[rules.description]} {...AppConsts.formItemLayout} name={'sub_desc'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}
						>
							<CKEditor editor={ClassicEditor} />
						</Form.Item>
					</Form>
				</Row>
			</Card>
		);
	}
}
