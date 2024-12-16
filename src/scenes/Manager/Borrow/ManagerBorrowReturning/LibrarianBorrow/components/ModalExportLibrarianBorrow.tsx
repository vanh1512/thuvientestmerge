import * as React from 'react';
import { Col, Card, Modal, Row, Button } from 'antd';
import { DocumentBorrowDto, DocumentDto } from '@services/services_autogen';
import TableBorrowDocument from './TableBorrowDocument';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import ActionExport from '@src/components/ActionExport';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import { cssColResponsiveSpan } from '@src/lib/appconst';


export interface IProps {
	doccumentListResult: DocumentBorrowDto[],
	listColumnDisplay: ColumnsDisplayType<DocumentBorrowDto>,
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportLibrianBorrow extends React.Component<IProps> {
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
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)}>
							<h2>{L('danh_sach_thu_thu_dang_ky_muon_tai_lieu')}</h2>
						</Col>
						<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)} style={{ textAlign: "end" }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh_sach_thu_thu_dang_ky_muon_tai_lieu_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="borrowLibrianReturn_print_id"
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

				<Col ref={this.setComponentRef} span={24} style={{ marginTop: '10px' }} id='borrowLibrianReturn_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<TableBorrowDocument
						listColumnDisplay={this.props.listColumnDisplay}
						doccumentListResult={doccumentListResult}
						pagination={false}
						is_printed={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}