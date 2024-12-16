import * as React from 'react';
import { Row, Card, Modal, Col, Button, } from 'antd';
import { MemberCardDto, MemberDto } from '@services/services_autogen';
import { valueOfeGENDER, valueOfeMCardType } from '@src/lib/enumconst';
import moment from 'moment';
import { L } from '@src/lib/abpUtility';
import ActionExport from '@src/components/ActionExport';

export interface IProps {
	memberCardSelected: MemberCardDto | undefined;
	memberSelected: MemberDto | undefined;
	visible: boolean;
	onCancel: () => void;
}

export default class ModalPrintRegistrationForm extends React.Component<IProps>{
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}

	render() {
		const memberCardSelected = this.props.memberCardSelected != undefined ? this.props.memberCardSelected : new MemberCardDto();
		const memberSelected = this.props.memberSelected != undefined ? this.props.memberSelected : new MemberDto();
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row justify='space-between'>
						<Col>{L('RegisterForm')}</Col>
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

				onCancel={this.props.onCancel}
				footer={null}
				width='45vw'
				maskClosable={false}
				closable={false}
			>
				<div id="RegisterFormMemberCard" ref={this.setComponentRef} className="noneBorder">
					<Row justify='center'> <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b></Row>
					<Row justify='center'><b>Độc lập - Tự do - Hạnh phúc</b> </Row>
					<Row justify='center'> PHIẾU ĐĂNG KÝ LÀM THẺ THƯ VIỆN</Row>
					<Row justify='center'> TỈNH TUYÊN QUANG</Row>
					<Row justify='center' gutter={16}>
						<Col span={12}>
							<b>Mã thẻ: </b><span >{memberCardSelected.me_ca_code}</span><br />
							<b>Họ và tên độc giả: </b><span >{memberSelected.me_name}</span><br />
							<b>Ngày tháng năm sinh: </b><span >{memberSelected.me_birthday}</span><br />
							<b>Loại thẻ:</b><span style={{ paddingLeft: '10px' }}>{valueOfeMCardType(memberCardSelected.me_ca_type)}</span>
						</Col>
						<Col style={{textAlign:"center"}} span={12}>
							<b>Giới tính: </b><span >{valueOfeGENDER(memberSelected.me_sex)}</span><br />
							<b>Thời gian nhận thẻ: </b><span >{moment(memberCardSelected.me_ca_time_receive).format("DD/MM/YYYY")}</span><br />
							<b>Số CMND: </b><span >{memberSelected.me_identify}</span><br />
							<b>Tiền làm thẻ:</b><span style={{ paddingLeft: '10px' }}>50.000 VNĐ</span>
						</Col>
					</Row>
					<Row style={{marginTop:"25px"}}>
						<Col span={12}></Col>
						<Col span={12} style={{textAlign:"center"}}>
							Ngày.....tháng.....năm.....
						</Col>
					</Row>
					
					<Row justify='space-around' >
						<Col>
							Cơ quan cấp giấy
						</Col>
						<Col>Người làm đơn</Col>
					</Row>
				</div>
			</Modal>
		)
	}
}