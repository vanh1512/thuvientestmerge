import * as React from 'react';
import { Col, Row, Modal, Button, } from 'antd';
import { ContractDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainContract from './TableMainContract';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	contractListResult: ContractDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportContract extends React.Component<IProps> {
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
		const { contractListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h3>{L('ExportListOf') + " " + L('Contract')}</h3>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={L('danh_sach_hop_dong') + " " + moment().format("DD-MM-YYYY")}
								idPrint="contract_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}

							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={() => { this.props.onCancel!() }}> {L('Cancel')}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				maskClosable={false}
				onCancel={this.props.onCancel}
				cancelButtonProps={{ style: { display: "none" } }}
			>
				<Row id='contract_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{L("DANH_SACH_HOP_DONG")}</h2></Col>
					<Col span={24}>
						<TableMainContract
							contractListResult={contractListResult}
							pagination={false}
							hasAction={false}
							isPrint={true}
						/>
					</Col>
					{this.state.isHeaderReport && <FooterReport />}
					
				</Row>
			</Modal>
		)
	}
}