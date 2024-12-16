import * as React from 'react';
import { Col, Row, Card, Form, DatePicker, } from 'antd';
import { MemberCardDto, MemberDto } from '@services/services_autogen';
import { valueOfeGENDER } from '@src/lib/enumconst';
import moment, { Moment } from 'moment';
import { L } from '@src/lib/abpUtility';
import rules from '@src/scenes/Validation';

export interface IProps {
	memberCardSelected: MemberCardDto | undefined;
	memberSelected: MemberDto | undefined;
	onChangeExtendTime: (value: moment.Moment | null) => void;
}

export default class ExtendCardForm extends React.Component<IProps>{
	private formRef: any = React.createRef();
	onChangeExtendTime = (value: moment.Moment | null) => {
		if (this.props.onChangeExtendTime != undefined) {
			this.props.onChangeExtendTime(value);
		}
	};
	render() {
		const memberCardSelected = this.props.memberCardSelected != undefined ? this.props.memberCardSelected : new MemberCardDto();
		const memberSelected = this.props.memberSelected != undefined ? this.props.memberSelected : new MemberDto();


		return (
			<>
				<Row style={{ justifyContent: 'center', }}>
					<h2 style={{ textTransform: 'uppercase' }}>{L("Extend") + " " + L("memberCard") + ": " + memberSelected.me_name}</h2>
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={4} offset={3}>{L("CardCode")}:</Col>
					<Col span={6}><strong>{memberCardSelected.me_ca_code}</strong></Col>
					<Col span={4}>{L("Gender")}:</Col>
					<Col span={5}><strong>{valueOfeGENDER(memberSelected.me_sex)}</strong></Col>
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={4} offset={3}>{L("Birthday")}:</Col>
					<Col span={6}><strong>{memberSelected.me_birthday}</strong></Col>
					<Col span={4}>{L("Identification")}:</Col>
					<Col span={5}><strong>{memberSelected.me_identify}</strong></Col>
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={4} offset={3}>{L("CreationDate")}:</Col>
					<Col span={6}><strong>{moment(memberCardSelected.me_ca_use_from).format("DD/MM/YYYY")}</strong></Col>
					<Col span={4}>{L("EndDate")}:</Col>
					<Col span={5}><strong>{moment(memberCardSelected.me_ca_use_to).format("DD/MM/YYYY")}</strong></Col>
				</Row>
				<Form ref={this.formRef}>
					<Row style={{ padding: '7px' }}>
						<Col span={10} offset={3}><span style={{ color: 'red' }}>*</span>{L("RenewalDate")}:</Col>
						<Col span={9} style={{textAlign:"end"}}>
							<Form.Item rules={[rules.required]} name={'me_ca_use_to'} hasFeedback>
								<DatePicker disabledDate={(current) => current && current <= moment().subtract(1, "day")} placeholder={L("SelectRenewalTime")} format={"DD/MM/YYYY"} style={{ width: '100%' }} onChange={(date: Moment | null) => this.onChangeExtendTime(date)} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</>
		)
	}
}