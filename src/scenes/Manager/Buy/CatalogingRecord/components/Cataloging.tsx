import * as React from 'react';
import { Col, Row, Button, Input, Form } from 'antd';
import { ReceiptDto, CreateDocumentInforInput, BillingItemDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import rules from '@src/scenes/Validation';
import { StepBackwardOutlined } from '@ant-design/icons';


export interface IProps {
	receiptDtoSelect: ReceiptDto | undefined;
	planDetailList: BillingItemDto[];
	listCreateDocumentInfor: CreateDocumentInforInput[];
	onCreateListDocumentInfor: (createList: CreateDocumentInforInput[]) => void;
	onSuccess?: () => void;
	onChangeStep: () => void;
}

export default class Cataloging extends React.Component<IProps> {
	private formRef: any = React.createRef();
	private inputRef: any = React.createRef();
	state = {
		isLoadDone: true,
		currentInput: 1,
	};
	async componentDidMount() {
		this.initData();
	}

	initData = () => {
		if (this.formRef.current != null) {
			this.formRef.current!.setFieldsValue({ listItemCreate: this.props.listCreateDocumentInfor });
		}
	}
	onCreateListDocumentInfor = async () => {
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (this.props.onCreateListDocumentInfor != undefined) {
				this.props.onCreateListDocumentInfor(values.listItemCreate);
				await this.onSuccess();
			}
		})
	}
	onPressEnter = async () => {
		this.onFocusNextInput();
	}

	onFocusNextInput = () => {
		if (this.state.currentInput <= this.props.listCreateDocumentInfor.length) {
			this.inputRef.current.focus();
		}
	}
	onChangeStep = () => {
		if (!!this.props.onChangeStep) {
			this.props.onChangeStep();
		}
	}
	onSuccess = () => {
		if (!!this.props.onSuccess) {
			this.props.onSuccess();
		}
	}
	render() {
		return (
			<div style={{ maxHeight: "500px", overflowY: "auto"}} >
				<Form ref={this.formRef} >
					<Row gutter={16} style={{ marginBottom: "10px", background: "#1DA57A", color: "white", margin: "0 0 10px 10px ", }}>
						<Col span={2} style={{ borderRight: "1px white solid", textAlign: 'center' }}>{L('STT')}</Col>
						<Col span={7} style={{ borderRight: "1px white solid", textAlign: 'center' }}>{L('DocumentName')}</Col>
						<Col span={5} style={{ borderRight: "1px white solid", textAlign: 'center' }}>{L('CodeDkcb')}</Col>
						<Col span={5} style={{ borderRight: "1px white solid", textAlign: 'center' }}>{L('CodeIsbn')}</Col>
						<Col span={5} style={{ textAlign: 'center' }}>{L('Note')}</Col>
					</Row>
					<Form.List name="listItemCreate"  >
						{(arrayDisplay) => (
							<div>
								{arrayDisplay.map(({ key, name, ...restField }) => {
									return (
										<Row key={key} gutter={16} >
											<Col span={2} style={{ textAlign: 'center' }}><div>{key + 1}</div></Col>
											<Col span={7} style={{ textAlign: 'center' }} ><div>{this.props.planDetailList.find(item => item.do_id.id == this.props.listCreateDocumentInfor[key].do_id)?.bi_it_name}</div></Col>
											<Col span={5} style={{ textAlign: 'center' }}><div>{this.props.listCreateDocumentInfor[key].dkcb_code}</div></Col>
											<Col span={5} >
												<Form.Item
													{...restField}
													name={[name, 'do_in_isbn']}
													rules={[{ required: true, message: L("khong_duoc_bo_trong") }, rules.isbn]}
												>
													<Input maxLength={18} ref={key + 1 == this.state.currentInput && this.inputRef} onFocus={() => { this.setState({ currentInput: key + 2 }) }} placeholder={L('CodeIsbn')} onPressEnter={this.onPressEnter} />
												</Form.Item>
											</Col>
											<Col span={5}>
												<Form.Item
													{...restField}
													name={[name, 'do_in_note']}
												>
													<Input placeholder={L("Note")} />
												</Form.Item>
											</Col>
										</Row>
									)
								})}
							</div>
						)}
					</Form.List>

					<Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }} gutter={16}>
						<Button icon={<StepBackwardOutlined />} type='primary' onClick={() => this.onChangeStep()}>{L("Back")}</Button> &nbsp;&nbsp;&nbsp;
						<Button type='primary' onClick={this.onCreateListDocumentInfor}> {L("SaveAndNext")}
						</Button>
					</Row>
				</Form>
			</div>
		)
	}
}