import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message } from 'antd';
import { L } from '@lib/abpUtility';
import { CheckItemDto, CreateCheckItemInput, UpdateCheckItemInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import TextArea from 'antd/lib/input/TextArea';
import rules from '@src/scenes/Validation';
import SelectedDocument from '@src/components/Manager/SelectedDocument';

export interface IProps {
	onCreateUpdateSuccess?: (checkItem: CheckItemDto) => void;
	onCancel: () => void;
	checkItemSelected: CheckItemDto;
	ck_id: number;
}

export default class CreateOrUpdateCheckItem extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		idSelected: -1,
		ck_it_status: undefined,
	}
	checkItemSelected: CheckItemDto;

	async componentDidMount() {
		this.initData(this.props.checkItemSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.checkItemSelected.ck_it_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.checkItemSelected.ck_it_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData(this.props.checkItemSelected);
		}
	}
	initData = async (inputCheckItem: CheckItemDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputCheckItem != undefined) {
			this.checkItemSelected = inputCheckItem;
		} else {
			this.checkItemSelected = new CheckItemDto();
		}
		if (this.checkItemSelected.ck_id !== undefined) {
			this.formRef.current!.setFieldsValue({
				... this.checkItemSelected,
			});
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { checkItemSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (checkItemSelected.ck_id === undefined || checkItemSelected.ck_id < 0) {
				let unitData = new CreateCheckItemInput(values);
				unitData.ck_id = this.props.ck_id;
				await stores.checkItemStore.createCheckItem(unitData);
				this.formRef.current!.resetFields();
				message.success(L('SuccessfullyAdded'));
			} else {
				let unitData = new UpdateCheckItemInput({ ck_it_id: checkItemSelected.ck_it_id, ...values });
				unitData.ck_id = this.props.ck_id;
				await stores.checkItemStore.updateCheckItem(unitData);
				message.success(L("chinh_sua_thanh_cong"));

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
			this.props.onCreateUpdateSuccess(this.checkItemSelected);
		}

	}
	render() {
		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.idSelected === undefined ? L("them_chi_tiet_ke_hoach") : L('chinh_sua_chi_tiet_ke_hoach') + ": "}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L('huy')} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L('luu')} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef}>
						{/* <Form.Item label={L("dau_sach")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'do_id'}>
							<SelectedDocument documentID={checkItemSelected.do_id.id} onChangeDocument={(value) => { this.formRef.current!.setFieldsValue({ do_id: value.do_id }) }} />
						</Form.Item> */}
						<Form.Item label={L('Note')} {...AppConsts.formItemLayout} name={'ck_it_note'}  >
							<TextArea />
						</Form.Item>
					</Form>
				</Row>
			</Card >
		)
	}
}