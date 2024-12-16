import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';
import { BorrowReturningDto, ICreateBorrowReturningInput } from '@services/services_autogen';
import ActionExport from '@src/components/ActionExport';
import { L } from '@src/lib/abpUtility';
import TableReturnDocumentBorrowReturning from './TableReturnDocumentBorrowReturning';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	borrowReturningListResult: BorrowReturningDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportTableReturnBorrowReturning extends React.Component<IProps> {
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
		const { borrowReturningListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('danh_sach_tra_tai_lieu')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={"Danh_sach_tra_tai_lieu_ngay_" + moment().format('DD_MM_YYYY')}
								idPrint="BorrowReturning_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={() => { this.props.onCancel!() }}>{L('Cancel')}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Col span={24} ref={this.setComponentRef} id='BorrowReturning_print_id' style={{ marginTop: '10px' }}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<TableReturnDocumentBorrowReturning
						is_printed={true}
						borrowReturningListResult={borrowReturningListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}