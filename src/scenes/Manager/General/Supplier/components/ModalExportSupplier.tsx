import * as React from 'react';
import { Col, Modal, Row, Button, } from 'antd';
import { SupplierDto, } from '@services/services_autogen';
import TableSupplier from './TableSupplier';
import { L } from '@src/lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	supplierListResult: SupplierDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportSupplier extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isHeaderReport: false,
		isLoadDone: false,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { supplierListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportList') + " " + L('Supplier')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'DS_nha_cung_cap_' + moment().format('DD_MM_YYYY')}
								idPrint="Supplier_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L('Cancel')} danger style={{ margin: '0 26px 0 9px' }} onClick={this.props.onCancel}>{L('Cancel')}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>

				<Col span={24} style={{ marginTop: '10px' }} ref={this.setComponentRef} id='Supplier_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_nha_cung_cap")}</h1></Col>
					<TableSupplier
						noscroll={true}
						supplierListResult={supplierListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}