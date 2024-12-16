import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message, } from 'antd';
import { L } from '@lib/abpUtility';
import { AttachmentItem, CreateMarc21Input, Marc21Dto, UpdateMarc21Input, } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (marc21Dto: Marc21Dto) => void;
	onCancel: () => void;
	marc21Selected: Marc21Dto;
}

export default class CreateOrUpdateMarc21 extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		mar_id: -1,
		mar_desc: "",
	};
	fileAttachmentItem: AttachmentItem = new AttachmentItem();

	async componentDidMount() {
		await this.initData(this.props.marc21Selected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.marc21Selected.mar_id !== prevState.mar_id) {
			return { mar_id: nextProps.marc21Selected.mar_id };
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.mar_id !== prevState.mar_id) {
			await this.initData(this.props.marc21Selected);
		}
	}

	initData = async (mar: Marc21Dto | undefined) => {
		this.setState({ isLoadDone: false, });
		if (mar == undefined) {
			mar = new Marc21Dto();
		}
		if (mar.mar_desc == null) {
			mar.mar_desc = "";
		}
		await this.formRef.current!.setFieldsValue({ ...mar });
		await this.setState({ isLoadDone: true, });
	};

	onCreateUpdate = () => {
		const { marc21Selected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (marc21Selected.mar_id === undefined) {
				let unitData = new CreateMarc21Input({ ...values });
				let result = await stores.marc21Store.createMarc21(unitData);
				await this.onCreateUpdateSuccess(result);
				message.success(L("them_moi_thanh_cong"))
			} else {
				let unitData = new UpdateMarc21Input({ mar_id: marc21Selected.mar_id, ...values });
				let result = await stores.marc21Store.updateMarc21(unitData);
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
	onCreateUpdateSuccess = (mar: Marc21Dto) => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(mar);
		}
	};
	render() {
		const self = this;
		const { marc21Selected } = this.props;

		return (
			<Card>
				<Row>
					<Col span={12}>
						<h3>
							{this.state.mar_id === undefined
								? (L('them_moi'))
								: (L('ma_marc21')) + ": " + marc21Selected.mar_code}
						</h3>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button
							title={L("huy")}
							danger
							onClick={() => this.onCancel()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
						>
							{L("huy")}
						</Button>
						<Button
							title={L("luu")}
							type="primary"
							onClick={() => this.onCreateUpdate()}
							style={{ marginLeft: '5px', marginTop: '5px' }}
						>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: "10px" }}>
					<Form ref={this.formRef} style={{ width: '100%' }}>
						<Form.Item label={(L('ma'))} rules={[rules.required, rules.numberOnly]} {...AppConsts.formItemLayout} name={'mar_code'}	>
							<Input maxLength={AppConsts.maxLength.mar21} placeholder={L('ma_marc21')} />
						</Form.Item>
						<Form.Item label={L('mo_ta')} rules={[rules.description]} {...AppConsts.formItemLayout} name={'mar_desc'} valuePropName='data'
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
