import * as React from 'react';
import { Col, Row, Modal, Button, } from 'antd';
import { DictionariesDto, DictionaryTypeDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import TableDictionaries from './TableDictionaries';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';

export interface IProps {
	dictionaryType: DictionaryTypeDto;
	dictionariesListResult: DictionariesDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportDictionaries extends React.Component<IProps> {
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
		const { dictionaryType, dictionariesListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}

				title={
					<Row>
						<Col span={12}>
							<h3>{L('xuat_danh_sach_tu_dien')}</h3>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='Danh_sach_tu_dien'
								idPrint="Dictionaries_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L("huy")} danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				onCancel={this.props.onCancel}
				footer={null}
				width='90vw'
				maskClosable={true}
			>

				<Col span={24} ref={this.setComponentRef} id='Dictionaries_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<div style={{ textAlign: "center" }}>
						<h2 style={{ margin: "0px", }}>{dictionaryType.dic_ty_name}</h2>
						<i style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: dictionaryType.dic_ty_desc! }}></i>
					</div>
					<TableDictionaries
						dictionariesListResult={dictionariesListResult}
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