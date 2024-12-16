import * as React from 'react';
import { Col, Row, Button, Modal, } from 'antd';
import ActionExport from '@src/components/ActionExport';
import { BorrowReturningDto } from '@services/services_autogen';
import { L } from '@src/lib/abpUtility';
import TableManagerAllDocumentBorrowReturning from './TableManagerAllDocumentBorrowReturning';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	doccumentListResult: BorrowReturningDto[],
	visible: boolean;
	onCancel: () => void;
}
export default class ModalExportManagerAllDocumentBorrowReturning extends React.Component<IProps> {
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
		const { doccumentListResult } = this.props;
		return (
			<>
				<Modal
					visible={this.props.visible}
					title={
						<Row style={{ width: "100%" }}>
							<Col span={12}>
								<h2>{L("danh_sach_quan_ly_muon_tra_tai_lieu")}</h2>
							</Col>
							<Col span={12} style={{ textAlign: 'end' }}>
								<ActionExport
									isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
									isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
									nameFileExport={'Danh_sach_quan_ly_muon_tra_tai_lieu_ngay' + moment().format('DD_MM_YYYY')}
									idPrint="Manager_Borrow_Returning"
									isExcel={true}
									isWord={true}
									componentRef={this.componentRef}
								/>
								<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel} >{L('Cancel')}</Button>
							</Col>
						</Row>
					}
					closable={false}
					footer={null}
					width='90vw'
					onCancel={this.props.onCancel}
					maskClosable={false}
				>
					<Row ref={this.setComponentRef} id='Manager_Borrow_Returning'>
						<Col span={24} >
							{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

							<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("ListBorrowReturningDocument")}</h1></Col>
							<TableManagerAllDocumentBorrowReturning
								borrowReturningListResult={doccumentListResult}
								is_printed={true}
								pagination={false}
								noscroll={true}
							/>
							{this.state.isHeaderReport && <FooterReport />}

						</Col>

					</Row>
				</Modal>
			</>
		)
	}
}