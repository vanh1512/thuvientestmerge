import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message, InputNumber } from 'antd';
import { L } from '@lib/abpUtility';
import { AttachmentItem, BorrowReturningIDetailDto, PunishDto, } from '@services/services_autogen';
import AppConsts, { FileUploadType } from '@src/lib/appconst';
import TextArea from 'antd/lib/input/TextArea';
import { ePunishError, valueOfePunishError } from '@src/lib/enumconst';
import FileAttachments from '@src/components/FileAttachments';
import rules from '@src/scenes/Validation';

export interface IProps {
	punishSelected?: BorrowReturningIDetailDto;
	lostSelected?: BorrowReturningIDetailDto;
	us_is_borrow: number;
	onCancel: () => void;
	onChangeStatus: (item: BorrowReturningIDetailDto) => void;
	change: (item: PunishDto) => void;
	isLost:boolean;
}

export default class CreatePunish extends React.Component<IProps>{
	private formRef: any = React.createRef();
	listAttachmentItem: AttachmentItem[] = [];
	state = {
		isLoadDone: false,
	}
	punishSelected: PunishDto = new PunishDto();
	async componentDidMount() {
		this.setState({ isLoadDone: true });
		this.initData(this.punishSelected);
		this.setState({ isLoadDone: false });
	}
	initData = async (input: PunishDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (input !== undefined && input.pun_id !== undefined) {
			this.listAttachmentItem = (input.fi_id_arr === undefined) ? [] : input.fi_id_arr;

			this.formRef.current!.setFieldsValue({
				...input,
			});
		}
		else {
			this.listAttachmentItem = [];
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { punishSelected, lostSelected } = this.props;
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (this.punishSelected.pun_id === undefined || this.punishSelected.pun_id < 0) {
				let unitData = new PunishDto(values);
				unitData.us_id_borrow = this.props.us_is_borrow;
				unitData.fi_id_arr = this.listAttachmentItem;
				if (punishSelected != undefined) {
					unitData.br_re_de_id = punishSelected.br_re_de_id;
					unitData.pun_error = ePunishError.HU_HONG.num;
				}
				if (lostSelected != undefined) {
					unitData.br_re_de_id = lostSelected.br_re_de_id
					unitData.pun_error = ePunishError.MAT_TAI_LIEU.num;
					this.props.onChangeStatus(lostSelected);
				}
				if (!!this.props.change) {
					this.props.change(unitData);
				}
				this.formRef.current!.resetFields();
				message.success(L('Success'));
			}
			this.setState({ isLoadDone: true });
			this.onCancel();
		})
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}
	render() {
		const self = this;
		return (
			<Card>
				<Row>
					<Col span={12}>
						<strong>{L("File")}</strong>
						<FileAttachments
							files={self.listAttachmentItem}
							isMultiple={true}
							componentUpload={FileUploadType.Avatar}
							onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
								self.listAttachmentItem = itemFile;
							}}
						/>
					</Col>
					<Col style={{alignItems:"center"}} span={6}>
						<h3>{this.props.isLost ? valueOfePunishError(ePunishError.MAT_TAI_LIEU.num) : valueOfePunishError(ePunishError.HU_HONG.num)}</h3>
					</Col>
					<Col span={6} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Cancel')}
						</Button>
						<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Add')}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block" }}>
					<Form ref={this.formRef}>
						<Form.Item label={L('PunishmentReason')} {...AppConsts.formItemLayout} name={'pun_reason'}  >
							<TextArea />
						</Form.Item>
						<Form.Item label={L('PunishmentMoney')} {...AppConsts.formItemLayout} rules={[rules.required, rules.numberOnly]} name={'pun_money'}  >
							<InputNumber style={{ width: '100%' }}
								formatter={a => AppConsts.numberWithCommas(a)}
								parser={a => a!.replace(/\$s?|(,*)/g, '')} />
						</Form.Item>
					</Form>
				</Row>
			</Card >
		)
	}
}