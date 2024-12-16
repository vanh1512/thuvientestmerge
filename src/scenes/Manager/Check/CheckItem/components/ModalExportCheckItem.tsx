import * as React from 'react';
import { Col, Row, Card, Modal, Button, } from 'antd';
import { CheckItemDto, DocumentDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainCheckItem from './TableMainCheckItem';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	checkItemListResult: CheckItemDto[],
	documentListResult: DocumentDto[],
	visible: boolean;
	onCancel: () => void;
}
export default class ModalExportCheckItem extends React.Component<IProps> {
	state = {
		isHeaderReport: false,
	}
	componentRef: any | null = null;
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {

		const { checkItemListResult, documentListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				onCancel={this.props.onCancel}
				closable={false}
				footer={null}
				width='90vw'
				maskClosable={false}
				title={
					<Row>
						<Col span={12}>
							<h3>{L('ExportListCheckitem')}</h3>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='CheckItem'
								idPrint="checkItem_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L('huy')} danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
						</Col>
					</Row>
				}
			>

				<Col span={24} style={{ marginTop: '10px' }} id='checkItem_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<TableMainCheckItem
						checkItemListResult={checkItemListResult}
						pagination={false}
						documentListResult={documentListResult}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}