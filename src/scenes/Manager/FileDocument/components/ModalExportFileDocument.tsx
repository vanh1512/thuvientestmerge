import * as React from 'react';
import { Col, Row, Modal, Button, } from 'antd';
import { FileDocumentDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainFileDocument from './TableMainFileDocument';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	fileDocumentListResult: FileDocumentDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportFileDocument extends React.Component<IProps> {
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
		const { fileDocumentListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h3>{L('xuat_danh_sach') + " " + L('FileDocument')}</h3>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Tap_tin_tai_lieu_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="fileDocument_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button danger onClick={() => { this.props.onCancel!() }} style={{ margin: '0 0 0 10px' }} >{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Col span={24} style={{ marginTop: '10px' }} ref={this.setComponentRef} id='fileDocument_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<TableMainFileDocument
						fileDocumentListResult={fileDocumentListResult}
						pagination={false}
						NoScroll={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}