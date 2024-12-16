import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { BorrowReturningLogDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainBorrowReturningLog from './TableMainBorrowReturningLog';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	borrowReturningLogListResult: BorrowReturningLogDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportBorrowReturningLog extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isLoadDone: false,
		isHeaderReport: false,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { borrowReturningLogListResult } = this.props;
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
							nameFileExport={"Danh_sach_lich_su_muon_tra_" + moment().format('DD_MM_YYYY')}
							idPrint="borrowReturningLog_print_id"
							isExcel={true}
							isWord={true}
							componentRef={this.componentRef}
						/>
						<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
					</Col>
				</Row>}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={true}
			>

				<Col span={24} ref={this.setComponentRef} style={{ marginTop: '10px' }} id='borrowReturningLog_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<TableMainBorrowReturningLog
						borrowReturningLogListResult={borrowReturningLogListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}