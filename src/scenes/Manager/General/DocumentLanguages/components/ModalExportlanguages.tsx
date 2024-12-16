import * as React from 'react';
import { Col, Button, Modal, Row, } from 'antd';
import { LanguagesDto } from '@services/services_autogen';
import Tablelanguages from './Tablelanguages';
import ActionExport from '@src/components/ActionExport';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	languagesListResult: LanguagesDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportlanguages extends React.Component<IProps> {
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
		const { languagesListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L("ExportListLanguage")}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh_sach_quan_ly_ngon_ngu_tai_lieu_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="lang_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button danger title={L("huy")} style={{ margin: '0 26px 0 9px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
						</Col>
					</Row>}
				onCancel={this.props.onCancel}
				footer={null}
				width='90vw'
				maskClosable={false}
				closable={false}
			>

				<Col span={24} style={{ marginTop: '10px' }} ref={this.setComponentRef} id="lang_print_id">
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_ngon_ngu_tai_lieu")}</h1></Col>
					<Tablelanguages
						languagesListResult={languagesListResult}
						pagination={false}
						isLoadDone={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}