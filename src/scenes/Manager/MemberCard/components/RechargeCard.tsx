import * as React from 'react';
import { Col, Row, Card, Form, InputNumber, } from 'antd';
import { MemberCardDto, MemberDto } from '@services/services_autogen';
import { valueOfeGENDER } from '@src/lib/enumconst';
import moment from 'moment';
import AppConsts from '@src/lib/appconst';
import { L } from '@src/lib/abpUtility';
import rules from '@src/scenes/Validation';

export interface IProps {
	changed: boolean;
	memberCardSelected: MemberCardDto | undefined;
	memberSelected: MemberDto | undefined;
	onChangeRechargeCard: (value: number) => void;
}

export default class RechargeCard extends React.Component<IProps>{
	private formRef: any = React.createRef();
	state = {
		isLoadDone: false,
		reChargeCard: 0,
	};
	onChangeRechargeCard = async (value: number | undefined | string) => {
		// if (value == undefined) {
		// 	value = 0;
		// }
		await this.setState({ reChargeCard: value })
		if (this.props.onChangeRechargeCard != undefined) {
			this.props.onChangeRechargeCard(Number(value));
		}
	}
	render() {
		const memberCardSelected = this.props.memberCardSelected != undefined ? this.props.memberCardSelected : new MemberCardDto();
		const memberSelected = this.props.memberSelected != undefined ? this.props.memberSelected : new MemberDto();
		const { changed } = this.props;
		return (
			<Card style={{ backgroundColor: 'aliceblue' }}>
				<Row style={{ justifyContent: 'center', }}>
					{changed ?
						<h2 style={{ textTransform: 'uppercase' }}>{L('thay_doi_tien_cho') + " " + L('member') + ": " + memberSelected.me_name}</h2>
						:
						<h2 style={{ textTransform: 'uppercase' }}>{L('RechargeFor') + " " + L('member') + ": " + memberSelected.me_name}</h2>
					}
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={4} offset={3}>{L('CardCode')}:</Col>
					<Col span={6}><strong>{memberCardSelected.me_ca_code}</strong></Col>
					<Col span={4}>{L('Gender')}:</Col>
					<Col span={5}><strong>{valueOfeGENDER(memberSelected.me_sex)}</strong></Col>
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={4} offset={3}>{L('Birthday')}:</Col>
					<Col span={6}><strong>{memberSelected.me_birthday}</strong></Col>
					<Col span={4}>{L('Identification')}:</Col>
					<Col span={5}><strong>{memberSelected.me_identify}</strong></Col>
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={4} offset={3}>{L('CreationDate')}:</Col>
					<Col span={6}><strong>{moment(memberCardSelected.me_ca_use_from).format("DD/MM/YYYY")}</strong></Col>
					<Col span={4}>{L('EndDate')}:</Col>
					<Col span={5}><strong>{moment(memberCardSelected.me_ca_use_to).format("DD/MM/YYYY")}</strong></Col>
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={4} offset={3}>{L('RemainedMoney')}:</Col>
					<Col span={6}><strong>{AppConsts.formatNumber(memberCardSelected.me_ca_money)} (VND)</strong></Col>
					<Col span={4}><span style={{ color: 'red' }}>*</span>{changed ? L('ChangeMoney') : L('RechargeMoney')}:</Col>
					<Col span={5}>
						<Form ref={this.formRef}>
							<Form.Item rules={[rules.required, rules.numberOnly]} name={'money'} >
								<InputNumber
									// value={this.state.reChargeCard}
									formatter={a => AppConsts.numberWithCommas(a)}
									parser={a => String(a).replace(/\$\s?|(,*)/g, '')}
									onChange={(value: number | undefined | string) => this.onChangeRechargeCard(value)}
									min={0}
									placeholder='0'
								/> (VNĐ)
							</Form.Item>
						</Form>
					</Col>
				</Row>
				<Row style={{ padding: '7px' }}>
					<Col span={10} offset={3}>{L('TotalMoney')}:</Col>
					<Col span={9}>
						<strong>{changed ? AppConsts.formatNumber(this.state.reChargeCard) : AppConsts.formatNumber(memberCardSelected.me_ca_money + this.state.reChargeCard)} (VNĐ)</strong>
					</Col>
				</Row>
			</Card>
		)
	}
}