import * as React from 'react';
import { Col, Modal, Row, Button, } from 'antd';
import { CitationDto} from '@services/services_autogen';
import { L } from '@src/lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import TableCitation from './TableCittation';

export interface IProps {
	citationList: CitationDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportCitation extends React.Component<IProps> {
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
		const { citationList } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportList') + " " + L('Citation')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'danh_sach_trich_dan_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="citation_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button danger style={{ margin: '0 26px 0 9px' }} onClick={this.props.onCancel}>{L('Cancel')}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>

				<Col span={24} style={{ marginTop: '10px' }} ref={this.setComponentRef} id='citation_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_trich_dan")}</h1></Col>
					<TableCitation
						noscroll={true}
						listCitation={citationList}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}