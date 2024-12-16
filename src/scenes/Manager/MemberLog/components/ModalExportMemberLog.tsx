import * as React from 'react';
import { Col, Card, Modal, Row, Button, } from 'antd';
import { MemberLogDto } from '@services/services_autogen';
import TableMainMemberLog from './TableMainMemberLog';
import { L } from '@src/lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	memberLogListResult: MemberLogDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportMemberLog extends React.Component<IProps> {
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
		const { memberLogListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportListOf') + " " + L('MemberLog')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='MemberLog'
								idPrint="memberlog_print_id"
								isExcel={false}
								isWord={false}
								componentRef={this.componentRef}
							/>
							<Button danger onClick={this.props.onCancel}>{L('Cancel')}</Button>
						</Col>
					</Row>

				}
				closable={false}
				footer={null}
				width='70vw'
				onCancel={this.props.onCancel}
			>

				<Col span={24} style={{ marginTop: '10px' }} id='memberlog_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<TableMainMemberLog
						memberLogListResult={memberLogListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}