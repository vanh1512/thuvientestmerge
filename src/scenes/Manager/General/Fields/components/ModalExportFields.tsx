import * as React from 'react';
import { Col, Row, Button, Modal } from 'antd';
import { FieldsDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainFields from './TableMainFields';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	fieldsListResult: FieldsDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportFields extends React.Component<IProps> {
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
		const { fieldsListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>{L('ExportDocumentFieldList')}</Col>
						<Col style={{ textAlign: 'end' }} span={12}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh_sach_linh_vuc_tai_lieu_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="fields_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L("Huy")} style={{ margin: '0 26px 0 9px' }} danger onClick={this.props.onCancel} >{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Col span={24} style={{ marginTop: '10px' }} ref={this.setComponentRef} id='fields_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
						<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_linh_vuc_tai_lieu")}</h1></Col>
						<TableMainFields
							fieldsListResult={fieldsListResult}
							pagination={false}
						/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}