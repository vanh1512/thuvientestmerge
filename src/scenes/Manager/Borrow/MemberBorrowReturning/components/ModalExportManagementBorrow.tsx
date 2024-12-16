import * as React from 'react';
import { Col, Row, Button, Modal, message, } from 'antd';
import { BorrowReturningDto, } from '@services/services_autogen';
import ActionExport from '@src/components/ActionExport';
import TableMemberManagerBorrowReturning from './TableMemberManagerBorrowReturning';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	borrowReturningListResult: BorrowReturningDto[],
	onCancel?: () => void,
	visible: boolean
}
export default class ModalExportManagementBorrow extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isLoadDone: false,
		isHeaderReport: false,
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {

		return (
			<Modal
				visible={this.props.visible}
				title={<Row>
					<Col span={12}>
						<h2>{L('ExportListOf') + " " + L('documentborrowingandreturningLog')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							nameFileExport={'Danh_sach_lich_su_muon_tra' + moment().format('DD_MM_YYYY')}
							idPrint="listManagementBorrow_print_id"
							isExcel={true}
							isWord={true}
							componentRef={this.componentRef}
						/>
						<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L('Cancel')}</Button>
					</Col>
				</Row>}
				closable={false}
				footer={null}
				width='100vw	'
				onCancel={this.props.onCancel}
				maskClosable={true}
			>

				<Col span={24} style={{ marginTop: '10px' }} id='listManagementBorrow_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: 'center', marginBottom: '10px' }} span={24}><h2> {L("DANH_SACH_LICH_SU_MUON_TRA")}</h2></Col>
					<TableMemberManagerBorrowReturning
						borrowReturningListResult={this.props.borrowReturningListResult}
						pagination={false}
						is_printed={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}