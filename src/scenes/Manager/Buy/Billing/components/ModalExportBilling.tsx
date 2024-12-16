import * as React from 'react';
import { Col, Row, Button, Modal, } from 'antd';
import { BillingDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainBilling from './TableMainBilling';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	billingListResult: BillingDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportBilling extends React.Component<IProps> {
	state = {
		isHeaderReport: false,
	};
	render() {
		const { billingListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportListOf') + L('Bill')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='billing'
								idPrint="Billing_print_id"
								isExcel={true}
								isWord={true}
							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("huy")} </Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				maskClosable={false}
			>
				<Col span={24} style={{ marginTop: '10px' }} id='Billing_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<TableMainBilling
						billingListResult={billingListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}