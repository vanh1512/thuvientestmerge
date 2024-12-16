import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';
import { BorrowReturningLogDto, DocumentBorrowDto } from '@services/services_autogen';
import ActionExport from '@src/components/ActionExport';
import TableBorrowDocument from './TableBorrowDocument';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import { L } from '@src/lib/abpUtility';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	ListResult: DocumentBorrowDto[],
	listColumnDisplaySelected: ColumnsDisplayType<DocumentBorrowDto>,
	onCancel?: () => void,
	visible: boolean
}
export default class ModalExportMemberRegisterBorrow extends React.Component<IProps> {
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
		return (
			<Modal
				visible={this.props.visible}
				title={<Row>
					<Col span={12}>
						<h2>{L('ListOfDocumentsBorrowedBy') + " " + L('member')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							nameFileExport='DANH_SACH_CAC_TAI_LIEU_MUON_BOI_DOC_GIA'
							idPrint="listMemberRegisterBorrow_print_id"
							isExcel={true}
							isWord={true}
							componentRef={this.componentRef}
						/>
						<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L('Cancel')}</Button>
					</Col>	
				</Row>}
				closable={false}
				footer={null}
				width='100vw'
				onCancel={this.props.onCancel}
				maskClosable={true}
			>

				<Col ref={this.setComponentRef} span={24} style={{ marginTop: '10px' }} id='listMemberRegisterBorrow_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{L("DANH_SACH_CAC_TAI_LIEU_MUON_BOI_DOC_GIA")}</h2></Col>
					<TableBorrowDocument
						doccumentListResult={this.props.ListResult}
						listColumnDisplay={this.props.listColumnDisplaySelected}
						pagination={false}
						is_printed={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}