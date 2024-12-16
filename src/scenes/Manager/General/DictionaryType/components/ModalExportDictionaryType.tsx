import * as React from 'react';
import { Row, Button, Modal, Col, } from 'antd';
import { DictionaryTypeDto, } from '@services/services_autogen';
import TableDictionaryType from './TableDictionaryType';
import ActionExport from '@src/components/ActionExport';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	dictionaryTypeListResult: DictionaryTypeDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportDictionaryType extends React.Component<IProps> {
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
		const { dictionaryTypeListResult } = this.props;

		return (

			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>{L('xuat_danh_sach_tu_dien')}</Col>
						<Col style={{ textAlign: 'end' }} span={12}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh_sach_tu_dien_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="dictionaryType_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/><Button danger style={{ margin: '0 26px 0 9px' }} title={L("huy")} onClick={this.props.onCancel}>{L("huy")}</Button></Col>

					</Row>
				}
				closable={false}
				onCancel={this.props.onCancel}
				footer={null}
				width='90vw'
				maskClosable={false}
			>
				<Col span={24} ref={this.setComponentRef} id='dictionaryType_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_tu_dien")} </h1></Col>
					<TableDictionaryType
						dictionaryTypeListResult={dictionaryTypeListResult}
						pagination={false}
						isLoadDone={true}
						noscroll={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}