import * as React from 'react';
import { Col, Row, Modal, Button, } from 'antd';
import { ReceiptDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainReceipt from './TableMainReceipt';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	receiptListResult: ReceiptDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportReceipt extends React.Component<IProps> {
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
		const { receiptListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h3>{L('ExportReceipt')}</h3>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={L('danh_sach_phieu_nhap') + " " + moment().format("DD-MM-YYYY")}
								idPrint="receipt_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L('Cancel')}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>

				<Row id='receipt_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{L("DANH_SACH_PHIEU_NHAP")}</h2></Col>
					<Col span={24}>
						<TableMainReceipt
							receiptListResult={receiptListResult}
							pagination={false}
							is_printed={true}
						/>
					</Col>
					{this.state.isHeaderReport && <FooterReport />}

				</Row>
			</Modal>
		)
	}
}