import * as React from 'react';

import { Form, Button, Input, message, Row, Col, DatePicker, InputNumber } from 'antd';
import { L } from '@lib/abpUtility';
import { AppConsts, cssCol } from '@lib/appconst'
import FormItem from 'antd/lib/form/FormItem';
import { stores } from '@stores/storeInitializer';
import { ApproveMemberCardInput, CreateUpdateMemberCardSesionInput, MemberCardDto, } from '@services/services_autogen';
import { FormInstance } from 'antd/lib/form';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eGENDER, eMCardType } from '@src/lib/enumconst';
import moment, { Moment } from 'moment';
import rules from '@src/scenes/Validation';

export interface IRegisterProps {
	onSuccessRegister?: () => void;
	onCancel?: () => void;
	memberCardSelected?: MemberCardDto;
	approveCard?: boolean;
}

export default class FormCreateMemberCardOnline extends React.Component<IRegisterProps> {
	private formRef = React.createRef<FormInstance>();
	state = {
		confirmDirty: false,
		me_re_sex: undefined,
		me_ca_id: -1,
		birthday: moment() || null,
		starting_date: moment() || null,
		ending_date: moment() || null,
		receiving_date: moment() || null,
	}
	async componentDidMount() {
		this.initData(this.props.memberCardSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.memberCardSelected.me_ca_id !== prevState.me_ca_id) {
			return ({ me_ca_id: nextProps.memberCardSelected.me_ca_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.me_ca_id !== prevState.me_ca_id) {
			this.initData(this.props.memberCardSelected);
		}
	}

	initData = async (inputmemberCard: MemberCardDto | undefined) => {
		await this.setState({ isLoadDone: false, starting_date: undefined, ending_date: undefined, receiving_date: undefined, birthday: undefined });
		if (inputmemberCard != undefined && inputmemberCard.me_ca_id != undefined) {
			await this.setState({ is_editted: true });
			if (inputmemberCard.me_ca_use_from != undefined) {
				await this.setState({ starting_date: moment(inputmemberCard.me_ca_use_from) })
			}
			if (inputmemberCard.me_ca_use_to != undefined) {
				await this.setState({ ending_date: moment(inputmemberCard.me_ca_use_to) })
			}
			if (inputmemberCard.me_ca_time_receive != undefined) {
				await this.setState({ receiving_date: moment(inputmemberCard.me_ca_time_receive) })
			}
			if (inputmemberCard.me_ca_is_active != undefined) {
				await this.setState({ isActive: inputmemberCard.me_ca_is_active });
			} else {
				await this.setState({ isActive: true });
			}
			this.formRef.current!.setFieldsValue({
				...inputmemberCard,
			});
		}
		this.setState({ isLoadDone: true });

	}
	onCreateUpdate = () => {
		const { memberCardSelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (memberCardSelected != undefined) {

				if (memberCardSelected.me_ca_id === undefined || memberCardSelected.me_ca_id < 0) {
					let unitData = new CreateUpdateMemberCardSesionInput({ ...values });
					unitData.me_ca_use_from = this.state.starting_date.toDate();
					unitData.me_ca_use_to = this.state.ending_date.toDate();
					unitData.me_ca_time_receive = this.state.receiving_date.toDate();
					await stores.sessionStore.createMemberCard(unitData);
					message.success(L('SuccessfullyAdded'));
				} else {
					let unitData = new CreateUpdateMemberCardSesionInput({ ...values });
					unitData.me_ca_use_from = this.state.starting_date.toDate();
					unitData.me_ca_use_to = this.state.ending_date.toDate();
					unitData.me_ca_time_receive = this.state.receiving_date.toDate();
					await stores.sessionStore.updateMemberCard(unitData);
					message.success(L("SuccessfullyEdited"));
				}
				if (!!this.props.onSuccessRegister) {
					this.props.onSuccessRegister();
				}
				this.setState({ isLoadDone: true });
			}
		})
	};
	onApproveCard = () => {
		this.setState({ isLoadDone: false });
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			let unitData = new ApproveMemberCardInput({ me_ca_id: this.props.memberCardSelected?.me_ca_id, ...values });
			await stores.memberCardStore.approveMemberCard(unitData);
			message.success(L('SuccessfullyApproved'));
			if (!!this.props.onSuccessRegister) {
				this.props.onSuccessRegister();
			}
		}
		)
		this.setState({ isLoadDone: true });
	}
	onChange = (e) => {
		this.setState({ value: e.target.value });
	};
	isReceivedDateDisabled = (current) => {
		if (!this.state.starting_date) {
			return true;
		}
		const sevenDaysAfterStartDate = this.state.starting_date.toDate();
		sevenDaysAfterStartDate.setDate(sevenDaysAfterStartDate.getDate() + 7);
		return current <= sevenDaysAfterStartDate;
	};
	isReceivedDateDisabled1 = async (date) => {
		const endingDate = moment(date).add(30, 'days');
		const receivingDate = moment(date).add(7, 'days');
		await this.setState({ starting_date: moment(date), ending_date: endingDate, receiving_date: receivingDate });
		this.formRef.current!.setFieldsValue({ me_ca_use_to: endingDate, me_ca_time_receive: receivingDate });
		this.setState({ isLoadDone: true, });
	};
	render() {
		const { onCancel } = this.props;
		const formItemLayout = {
			labelCol: cssCol(8),
			wrapperCol: cssCol(16),
		};

		return (

			<Row style={{ width: "100%" }}>
				<Form ref={this.formRef} style={{ width: "100%" }}>
					<Row><strong>{L('CardInformation')} </strong></Row>
					<Form.Item label={L('ValidityStartDate')} {...AppConsts.formItemLayout} name={'me_ca_use_from'} rules={[rules.required]} valuePropName='me_ca_use_from'>
						<DatePicker
							placeholder={L("ValidityStartDate")+"..."}
							style={{ width: '100%' }}
							onChange={async (date: Moment | null, dateString: string) => await this.isReceivedDateDisabled1(date)}
							format={"DD/MM/YYYY"}
							value={this.state.starting_date}
							disabledDate={(current) => current ? current <= moment().endOf("day").subtract(1, "day") : false}
						/>
					</Form.Item>
					<Form.Item label={L('ExpirationDate')} {...AppConsts.formItemLayout} name={'me_ca_use_to'} rules={[rules.required,]} valuePropName='me_ca_use_to'>
						<DatePicker
							placeholder={L("ExpirationDate")+"..."}
							style={{ width: '100%' }}
							onChange={(date: Moment | null, dateString: string) => { this.setState({ ending_date: date }); this.formRef.current!.setFieldsValue({ me_ca_use_to: date }); }}
							value={this.state.ending_date}
							format={"DD/MM/YYYY"}
							disabledDate={(current) => this.isReceivedDateDisabled(current)}
						/>
					</Form.Item>
					<FormItem label={L('phi_duy_tri_the')} {...formItemLayout} rules={[rules.required, rules.numberOnly]} name={'me_ca_level'} >
						<InputNumber min={0} style={{ width: '100%' }} formatter={a => AppConsts.numberWithCommas(a)}
							parser={a => a!.replace(/\$\s?|(,*)/g, '')} />
					</FormItem>
					<Form.Item label={L('CardType')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'me_ca_type'}>
						<SelectEnum eNum={eMCardType} enum_value={this.props.memberCardSelected?.me_ca_type} onChangeEnum={async (value: number) => { await this.setState({ me_ca_type: value }); await this.formRef.current!.setFieldsValue({ me_ca_type: value }); }} />
					</Form.Item>
					<Form.Item label={L('ReceivingDate')} {...AppConsts.formItemLayout} name={'me_ca_time_receive'} rules={[rules.required]} valuePropName='me_ca_time_receive'>
						<DatePicker
							placeholder={L("ReceivingDate")+"..."}
							style={{ width: '100%' }}
							onChange={(date: Moment | null, dateString: string) => { this.setState({ receiving_date: date }); this.formRef.current!.setFieldsValue({ me_ca_time_receive: date }); }}
							value={this.state.receiving_date}
							format={"DD/MM/YYYY"}
							disabledDate={(current) => this.isReceivedDateDisabled(current)}
						/>
					</Form.Item>
				</Form>
				{this.props.approveCard == true ?
					<Col style={{ textAlign: "right", width: "100%", marginTop: "10px" }}>
						{(onCancel !== undefined) && <Button danger onClick={() => onCancel()} >{L('Cancel')}</Button>}
						&nbsp;&nbsp;&nbsp;
						<Button type="primary" onClick={() => this.onApproveCard()} >{L('Approve')}</Button>
					</Col>
					:
					<Col style={{ textAlign: "right", width: "100%", marginTop: "10px" }}>
						{(onCancel !== undefined) && <Button danger onClick={() => onCancel()} >{L('Cancel')}</Button>}
						&nbsp;&nbsp;&nbsp;
						<Button type="primary" onClick={() => this.onCreateUpdate()} >{L('OK')}</Button>
					</Col>
				}
			</Row>
		);
	}
}
