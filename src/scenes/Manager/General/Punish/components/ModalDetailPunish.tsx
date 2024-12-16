import * as React from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Table, Typography } from 'antd';
import { DocumentBorrowDto, DocumentInforDto, PunishDto, } from '@services/services_autogen';
import moment from 'moment';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import { valueOfePunishError } from '@src/lib/enumconst';
import FileAttachments from '@src/components/FileAttachments';
import { FileUnknownOutlined } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';

export interface IProps {
	punishSelected: PunishDto,
	onCancel?: () => void;
	visible: boolean;
	isLoadFile: boolean;
}
export default class ModalDetailPunish extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isHeaderReport: false,
		isLoadDone: true,
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}

	render() {
		const { punishSelected } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('chi_tiet_phat')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh sách thông tin tài liệu ngày ' + moment().format('DD_MM_YYYY')}
								idPrint="DocumentInfor_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L("luu")} onClick={this.props.onCancel} danger style={{ margin: '0 26px 0 10px' }}>{L("luu")}</Button>
						</Col>
					</Row>

				}
				closable={false}
				footer={null}
				width='60vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				{/* <Row justify='center'><h2>{L("doc_gia") + " " + punishSelected.br_re_de_id}</h2></Row> */}
				<Row gutter={16} style={{ marginTop: "20px" }}>
					<Col span={4}><strong>{L("ma_muon_tai_lieu")}: </strong></Col>
					<Col span={8}>{(!!punishSelected && !!punishSelected.borrowReturning) ? punishSelected.borrowReturning.br_re_code : L("chua_co")}</Col>
					<Col span={4}><strong>{L("DocumentName")}: </strong></Col>
					<Col span={8}>{(!!punishSelected.borrowReturningDetail && !!punishSelected.borrowReturningDetail.document) ? punishSelected.borrowReturningDetail.document.do_title : L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("Member")}: </strong></Col>
					<Col span={8}>{!!punishSelected ? stores.sessionStore.getUserNameById(punishSelected.us_id_borrow) : L("chua_co")}</Col>
					<Col span={4}><strong>{L("nguoi_phat")} : </strong></Col>
					<Col span={8}>{!!punishSelected ? stores.sessionStore.getUserNameById(punishSelected.us_id_create) : L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("ngay_phat")} : </strong></Col>
					<Col span={8}>{moment(punishSelected.pun_created_at).format("DD/MM/YYYY") || L("chua_co")}</Col>
					<Col span={4}><strong>{L("PunishmentMoney")}: </strong></Col>
					<Col span={8}>{!!punishSelected ? AppConsts.formatNumber(punishSelected.pun_money) + " VNĐ" : L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("loi")}: </strong></Col>
					<Col span={8}>{!!punishSelected ? valueOfePunishError(punishSelected.pun_error) : L("chua_co")}</Col>
					<Col span={4}><strong>{L("ly_do_phat")} : </strong></Col>
					<Col span={8}>{!!punishSelected ? punishSelected.pun_reason : L("chua_co")}</Col>
				</Row>
				<Row>
					<span><strong>{L("File")}: &nbsp;</strong></span>
					{(!!punishSelected && !!punishSelected.fi_id_arr && punishSelected.fi_id_arr.length > 0) ?
						<FileAttachments
							files={punishSelected.fi_id_arr}
							allowRemove={false}
							isMultiple={false}
							isLoadFile={this.props.isLoadFile}
						></FileAttachments>
						:
						<><FileUnknownOutlined style={{ fontSize: 16 }} /> &nbsp;{L("NoData")}</>
					}
				</Row>
			</Modal>
		)
	}
}
