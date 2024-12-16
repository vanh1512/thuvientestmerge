import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';

import { DocumentInforDto, ICreateDocumentInforInput } from '@services/services_autogen';
import TableMainDocumentInfor from './TableMainDocumentInfor';
import ActionExport from '@src/components/ActionExport';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	documentInforListResult: DocumentInforDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportDocumentInfor extends React.Component<IProps> {
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
		const { documentInforListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportListOf') + " " + L('documentinformation')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh sách thông tin tài liệu ngày ' + moment().format('DD_MM_YYYY')}
								idPrint="DocumentInfor_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button onClick={this.props.onCancel} danger style={{ margin: '0 26px 0 10px' }}>{L("Cancel")}</Button>
						</Col>
					</Row>

				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Col span={24} style={{ marginTop: '10px' }} id='DocumentInfor_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("thong_tin_tai_lieu")}</h1></Col>
					<TableMainDocumentInfor
						documentInforListResult={documentInforListResult}
						pagination={false}
						noscroll={true}
						is_printed={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}