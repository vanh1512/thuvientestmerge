import * as React from 'react';
import { Col, Row, Card, Button, Modal, } from 'antd';
import { PublishRegisterDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainPublishRegister from './TableMainPublishRegister';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	publishRegisterListResult: PublishRegisterDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportPublishRegister extends React.Component<IProps> {
	state = {
		isHeaderReport: false,
	}
	render() {
		const { publishRegisterListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					< Row >
						<Col span={12}>
							<h2>{L('xuat_danh_sach') + " " + L('PublishRegister')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='PublishRegister'
								idPrint="publishRegister_print_id"
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
				<Col span={24} style={{ marginTop: '10px' }} id='publishRegister_print_id'>
				{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<TableMainPublishRegister
						publishRegisterListResult={publishRegisterListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport	 />}
				</Col>
			</Modal>
		)
	}
}