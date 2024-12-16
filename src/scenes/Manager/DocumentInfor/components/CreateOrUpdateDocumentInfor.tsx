import * as React from 'react';
import { Col, Row, Button, Table, Card, Modal, Form, Input, Checkbox, DatePicker, Select, InputNumber } from 'antd';
import { L } from '@lib/abpUtility';
import { DocumentInforDto, CreateDocumentInforInput, UpdateDocumentInforInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import TextArea from 'antd/lib/input/TextArea';
import SelectedDocument from '@src/components/Manager/SelectedDocument';
import rules from '@src/scenes/Validation';


const { Option } = Select;
export interface IProps {
	onCreateUpdateSuccess?: (documentInforDto: DocumentInforDto) => void;
	onCancel: () => void;
	documentInforSelected: DocumentInforDto;
	do_id?: number;
}

export default class CreateOrUpdateDocumentInfor extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		documentInfor_id: -1,
	}
	documentInforSelected: DocumentInforDto;

	async componentDidMount() {
		this.initData(this.props.documentInforSelected);

	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.documentInforSelected.do_in_id !== prevState.documentInfor_id) {
			return ({ documentInfor_id: nextProps.documentInforSelected.do_in_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.documentInfor_id !== prevState.documentInfor_id || this.props.documentInforSelected != prevProps.documentInforSelected) {
			this.initData(this.props.documentInforSelected);
		}
	}


	initData = async (inputDocumentInfor: DocumentInforDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputDocumentInfor !== undefined) {
			this.documentInforSelected = inputDocumentInfor;
		} else {
			this.documentInforSelected = new DocumentInforDto();
		}
		if (this.documentInforSelected.do_in_id !== undefined || this.documentInforSelected.do_id !== undefined) {
			this.formRef.current!.setFieldsValue({
				... this.documentInforSelected,
			});
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { documentInforSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (documentInforSelected.do_in_id === undefined) {
				let unitData = new CreateDocumentInforInput(values);
				unitData.do_id = documentInforSelected.do_id;
				await stores.documentInforStore.createDocumentInfor(unitData);
				this.formRef.current.resetFields();
			} else {
				let unitData = new UpdateDocumentInforInput({ do_in_id: documentInforSelected.do_in_id, ...values });
				await stores.documentInforStore.updateDocumentInfor(unitData);
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
			this.props.onCreateUpdateSuccess(this.documentInforSelected);
		}

	}
	render() {
		const { documentInforSelected, do_id } = this.props;
		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.documentInfor_id === undefined ? L('Add') + " " + L("DocumentInformation") : L('Edit') + " " + L("DocumentInformation") + ": " + documentInforSelected.do_in_id}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Form ref={this.formRef} style={{ marginTop: '10px' }}>
					{(do_id == undefined) ?
						<Form.Item label={L('DocumentName')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'do_id'}  >
							<SelectedDocument documentID={documentInforSelected.do_id} onChangeDocument={(value) => { this.formRef.current!.setFieldsValue({ do_id: value.id }) }} />
						</Form.Item>
						: ""}
					<Form.Item label={L('CodeIsbn')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'do_in_isbn'}>
						<Input />
					</Form.Item>
					<Form.Item label={L('Note')} {...AppConsts.formItemLayout} name={'do_in_note'}>
						<TextArea rows={3} />
					</Form.Item>
				</Form>
			</Card >
		)
	}
}