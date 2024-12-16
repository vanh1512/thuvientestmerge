import * as React from 'react';
import { Col, Row, Avatar, Modal, Button, Form, Input, Checkbox, DatePicker, Card } from 'antd';
import { MemberCardDto, MemberDto } from '@services/services_autogen';
import { valueOfeGENDER } from '@src/lib/enumconst';
import Barcode from 'react-barcode';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppLongLogo from '@images/logoego_long256.png';
import ActionExport from '@src/components/ActionExport'
import { L } from '@src/lib/abpUtility';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import moment from 'moment';
import Stores from '@src/stores/storeIdentifier';
import { stores } from '@src/stores/storeInitializer';

export interface IProps {

	memberListResult: MemberDto[] | undefined;
	listMemberCard: MemberCardDto[];
	onCancel?: () => void;
	visible: boolean;
}

export default class ModalPrintCardMember extends AppComponentBase<IProps>{
	componentRef: any | null = null;
	async componentDidMount() {
		await stores.memberStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined);
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}


	render() {
		//  const {memberListResult} = stores.memberStore;
		const { listMemberCard, memberListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				onCancel={this.props.onCancel}
				footer={null}
				width='90vw'
				maskClosable={false}
				closable={false}
				title={
					<Row justify='space-between'>
						<Col>{L('PrintedCardForm')}</Col>
						<Col>
							<ActionExport
								nameFileExport='RegisterFormMemberCard'
								idPrint="RegisterFormMemberCard"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}

							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("Cancel")}</Button>
						</Col>
					</Row>
				}
			>
				<h2 style={{ textAlign: "center" }}>{L("danh_sach_the_thu_vien_can_in")} </h2>
				<Row id='RegisterFormMemberCard' className='page-break' ref={this.setComponentRef} style={{ display: "flex" }} >
					{
						listMemberCard != undefined && listMemberCard.map((item, index) => {
							const member = memberListResult!.find(itemMember => itemMember.me_id == item.me_id);
							return (
								// <Col {...cssColResponsiveSpan(24, 22, 17, 14, 10, 10)} className='page-break' style={{ paddingLeft: '2%', margin: 15, boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}>
								<Card className='page-break' style={{ width: "50%", border: "1px solid black", borderRadius: "4px" }}>
									<Row style={{ height: "40px" }} key={"key_" + index}>
										<Col span={6}>
											<Col span={20} offset={2} style={{ margin: "5px 0", }}>
												<Avatar style={{ width: "100%", height: "100%" }} shape='square' src={AppLongLogo} alt='LOGO' />
											</Col>
										</Col>
										<Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
											<Row>
												<h4 style={{ textTransform: 'uppercase', width: '100%', textAlign: 'center', color: 'cornflowerblue', alignItems: 'center' }}>
													{L('TuyenQuangLibrary')}
												</h4>
												<br />
												<h4 style={{ textTransform: 'uppercase', width: '100%', textAlign: 'center', color: 'red', alignItems: 'center' }}>
													{L('Thẻ thư viện')}
												</h4>
											</Row>
										</Col>
									</Row>
									<Row style={{ height: "160px" }}>
										<Col span={10} style={{ width: '100%', paddingTop: '3%' }}>
											<Avatar style={{ width: "90%", height: "160px" }} shape="square" src={member!.fi_id.key != null ? this.getFile(member!.fi_id.id) : process.env.PUBLIC_URL + '/profile.png'} />
										</Col>
										<Col span={14}>
											<Row style={{ margin: "5px 0", fontSize: 'small' }}>
												<span><strong>{L("FullName")}:</strong> {member != undefined && member!.me_name} </span>
											</Row>
											<Row style={{ margin: "5px 0", fontSize: 'small' }}>
												<span><strong>{L("Gender")}:</strong> {valueOfeGENDER(member!.me_sex)}</span>
											</Row>
											<Row style={{ margin: "5px 0", fontSize: 'small' }}>
												<span><strong>{L("ngay_sinh")}:</strong> {moment(member!.me_birthday, "DD/MM/YYYY").format("DD/MM/YYYY")}</span>
											</Row>
											<Row>
												<span><strong>{L("co_gia_tri_den")}:</strong> {moment(item.me_ca_use_to, "DD/MM/YYYY").format("DD/MM/YYYY")}</span>
											</Row>
											<Row style={{ margin: "5px 0", fontSize: 'small' }}>
												<span><strong>{L("CardCode")}:</strong> {item.me_ca_code}</span>
											</Row>
											<Row style={{ marginLeft: "-10px", width: '90%' }}>
												<Barcode width={1.5} height={30} displayValue={false} value={item.me_ca_code + ""} />
											</Row>
										</Col>
									</Row>
								</Card>
								// </Col>

							)
						})
					}

				</Row>
			</Modal >
		)
	}
}