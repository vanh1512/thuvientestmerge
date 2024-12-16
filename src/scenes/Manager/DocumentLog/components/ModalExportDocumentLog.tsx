import * as React from 'react';
import { Col, Row, Card, Button, } from 'antd';
import { DocumentLogDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainDocumentLog from './TableMainDocumentLog';
import ActionExport from '@src/components/ActionExport';
import Modal from 'antd/lib/modal/Modal';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';

export interface IProps {
	documentLogListResult: DocumentLogDto[],

	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportDocumentLog extends React.Component<IProps> {
	state = {
		isHeaderReport: false,
	}
	render() {
		const { documentLogListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('xuat_danh_sach') + L('DocumentLog')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='DocumentLog'
								idPrint="DocumentLog_print_id"
								isExcel={true}
								isWord={true}
							/>
							<Button danger onClick={() => { this.props.onCancel!() }} style={{ margin: '0 26px 0 10px' }} >{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Col span={24} style={{ marginTop: '10px' }} id='documentLog_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<TableMainDocumentLog
						documentLogListResult={documentLogListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}