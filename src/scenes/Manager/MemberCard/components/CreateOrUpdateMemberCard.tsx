import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, Select, DatePicker, InputNumber, message, Checkbox } from 'antd';
import { L } from '@lib/abpUtility';
import { MemberCardDto, CreateMemberCardInput, ItemUser, MemberDto } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import { eMCardType, eUserType } from '@src/lib/enumconst';
import moment, { Moment } from 'moment';
import SelectEnum from '@src/components/Manager/SelectEnum';
import SelectUser from '@src/components/Manager/SelectUser';
import rules from '@src/scenes/Validation';

const { Option } = Select;
export interface IProps {
	onCreateUpdateSuccess?: (memberCard: MemberCardDto) => void;
	onCancel: () => void;
	memberCardSelected: MemberCardDto;
	me_id?: number;
	me_name?: string;
}

export default class CreateOrUpdateMemberCard extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		me_ca_id: -1,
		me_ca_use_from: moment(),
		isActive: true,
		starting_date: moment() || null,
		ending_date: moment() || null,
		receiving_date: moment() || null,
	}
	memberSelected: MemberDto | undefined;

	async componentDidMount() {
		this.initData();
	}
	initData = async () => {
		await this.setState({ isLoadDone: false, starting_date: moment(), ending_date: moment(this.state.starting_date).add(30, 'days'), receiving_date: moment(this.state.starting_date).add(7, 'days') });
		this.formRef.current.setFieldsValue({ me_ca_use_from: this.state.starting_date, me_ca_use_to: this.state.ending_date, me_ca_time_receive: this.state.receiving_date });
		this.setState({ isLoadDone: true });
	}
	onCreateUpdate = () => {
		const { memberCardSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (memberCardSelected.me_ca_id === undefined || memberCardSelected.me_ca_id < 0) {
				let unitData = new CreateMemberCardInput(values);
				unitData.me_ca_use_from = this.state.starting_date.toDate();
				unitData.me_ca_use_to = this.state.ending_date.toDate();
				unitData.me_ca_time_receive = this.state.receiving_date.toDate();
				unitData.me_ca_level = unitData.me_ca_money;
				if (this.props.me_id != undefined) {
					unitData.me_id = this.props.me_id;
				}
				await stores.memberCardStore.createMemberCard(unitData);
				message.success(L('SuccessfullyAdded'));
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
			this.props.onCreateUpdateSuccess(this.props.memberCardSelected);
		}
	}

	handleStartDateChange = (date, dateString) => {
		const newEndDate = moment(date).add(30, 'days');
		const newReceivingDate = moment(date).add(7, 'days');
		this.setState({ starting_date: date });
		this.setState({ ending_date: newEndDate, receiving_date: newReceivingDate });
		this.formRef.current.setFieldsValue({ me_ca_use_to: newEndDate, me_ca_time_receive: newReceivingDate });
	};

	render() {
		const { memberCardSelected } = this.props;
		return (
			<Card>
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					{!!this.props.me_name ?
						<Col span={12}><h3>{L("Add") + " " + L("memberCard") + " " + this.props.me_name}</h3></Col>
						:
						<Col span={12}><h3>{L("Add") + " " + L("memberCard")}</h3></Col>
					}
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("Cancel")}
						</Button>
						{!memberCardSelected.me_ca_is_locked && <Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("Save")}
						</Button>}
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef} {...AppConsts.formItemLayoutResponsive([12, 12], [12, 12], [12, 12], [14, 10], [11, 13], [12, 12])}>
						{!!this.props.me_name ?
							<>
								<Form.Item label={L('MemberName')} name={'me_id'} >
									<label htmlFor="">{this.props.me_name}</label>
								</Form.Item>

							</>
							:
							<Form.Item label={L('MemberName')} rules={[rules.required]} name={'me_id'} >
								<SelectUser onClear={() => this.formRef.current!.setFieldsValue({ me_id: undefined })} role_user={eUserType.Member.num} onChangeUser={async (item_arr: ItemUser[]) => { this.formRef.current!.setFieldsValue({ me_id: item_arr[0].me_id }) }} />
							</Form.Item>
						}
						<Form.Item label={L('ValidityStartDate')} rules={[rules.required]} name={'me_ca_use_from'} valuePropName='me_ca_use_from'>
							<DatePicker
								onChange={this.handleStartDateChange}
								value={this.state.starting_date}
								format={"DD/MM/YYYY"}
								disabledDate={(current) => current ? current <= moment().startOf('day') : false}
							/>
						</Form.Item>
						<Form.Item
							label={L('ReceivingDate')}
							rules={[rules.required]}
							name={'me_ca_time_receive'}
							valuePropName='me_ca_time_receive'>
							<DatePicker
								value={this.state.receiving_date}
								format={"DD/MM/YYYY"}
								disabledDate={(current) => current ? current <= moment(this.state.starting_date).add(7, 'days').startOf('day') : false}
							/>
						</Form.Item>
						<Form.Item
							label={L('ExpirationDate')}
							rules={[rules.required]}
							name={'me_ca_use_to'}
							valuePropName='me_ca_use_to'
						>
							<DatePicker
								value={this.state.ending_date}
								format={"DD/MM/YYYY"}
								disabledDate={(current) => current ? current <= moment(this.state.starting_date).add(30, 'days').startOf('day') : false}
							/>
						</Form.Item>
						<Form.Item label={L('Money')} rules={[rules.required, rules.numberOnly]} name={'me_ca_money'} >
							<InputNumber min={0} style={{ width: '100%' }} formatter={a => AppConsts.numberWithCommas(a)}
								parser={a => a!.replace(/\$s?|(,*)/g, '')} />
						</Form.Item>
						<Form.Item label={L('CardType')} rules={[rules.required]} name={'me_ca_type'} >
							<SelectEnum disable={memberCardSelected.me_ca_is_locked} eNum={eMCardType} enum_value={this.props.memberCardSelected.me_ca_type} onChangeEnum={async (value: number) => { await this.formRef.current.setFieldsValue({ me_ca_type: value }); }} />
						</Form.Item>
						{/* <Form.Item label={L('ActiveCard')} name={'me_ca_is_active'} >
							<Checkbox checked={this.state.isActive} onChange={async (e) => this.setState({ isActive: e.target.checked })} />
						</Form.Item> */}
					</Form>
				</Row>
			</Card >
		)
	}
}