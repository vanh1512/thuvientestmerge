import * as React from 'react';
import { Col, Row, Button, Modal, } from 'antd';
import { PublishLogDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainPublishLog from './TableMainPublishLog';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	publishLogListResult: PublishLogDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportPublishLog extends React.Component<IProps> {
	state = {
		isHeaderReport: false,

	}
	render() {
		const { publishLogListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					< Row >
						<Col span={12}>
							<h2>{L('xuat_danh_sach') + " " + L('PublishLog')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='publishLog'
								idPrint="PublishLog_print_id"
								isExcel={true}
								isWord={true}
							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
						</Col>
					</ Row>}
				onCancel={this.props.onCancel}
				footer={null}
				width='90vw'
				maskClosable={false}
			>

				<Col span={24} style={{ marginTop: '10px' }} id='PublishLog_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<TableMainPublishLog
						publishLogListResult={publishLogListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport	 />}

				</Col>
			</Modal>
		)
	}
}