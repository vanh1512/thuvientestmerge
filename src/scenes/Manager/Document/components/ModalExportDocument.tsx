import * as React from 'react';
import { Col, Row, Button, Modal, } from 'antd';
import ActionExport from '@src/components/ActionExport';
import { DocumentDto } from '@services/services_autogen';
import TableMainDocument from './TableMainDocument';
import { L } from '@src/lib/abpUtility';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	doccumentListResult: DocumentDto[],
	listColumnDisplay: ColumnsDisplayType<any>;
	visible: boolean;
	onCancel: () => void;
}
export default class ModalExportDocument extends React.Component<IProps> {
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
		const { doccumentListResult, listColumnDisplay } = this.props;
		return (
			<>
				<Modal
					visible={this.props.visible}
					title={
						<Row style={{ width: "100%" }}>
							<Col span={12}>
								<h2>{L('ExportListOf') + " " + L('document')}</h2>
							</Col>
							<Col span={12} style={{ textAlign: 'end' }}>
								<ActionExport
									isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
									isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
									nameFileExport={'Danh_sach_tai_lieu_ngay_' + moment().format('DD_MM_YYYY')}
									idPrint="Doccument_print_id"
									isExcel={true}
									isWord={true}
									componentRef={this.componentRef}
								/>
								<Button danger style={{ margin: '0 0 0 10px' }} onClick={this.props.onCancel} >{L('Cancel')}</Button>
							</Col>
						</Row>
					}
					closable={false}
					footer={null}
					width='90vw'
					onCancel={this.props.onCancel}
					maskClosable={false}
				>
					<Row ref={this.setComponentRef} id='Doccument_print_id'>
						<Col span={24} >
							{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

							<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("Danh_sach_tai_lieu")}</h1></Col>
							<TableMainDocument
								doccumentListResult={doccumentListResult}
								listColumnDisplay={listColumnDisplay}
								pagination={false}
								isLoadDone={true}
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