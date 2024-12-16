import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { PublishSettingDto, ICreatePublishSettingInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainPublishSetting from './TableMainPublishSetting';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	publishSettingListResult: PublishSettingDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportPublishSetting extends React.Component<IProps> {
	state = {
		isHeaderReport: false,
	}
	render() {
		const { publishSettingListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					< Row >
						<Col span={12}>
							<h2>{L('xuat_danh_sach') + " " + L('PublishSetting')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'right' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='PublishSetting'
								idPrint="PublishSetting_print_id"
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
				<Col span={24} style={{ marginTop: '10px' }} id='PublishSetting_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<TableMainPublishSetting
						publishSettingListResult={publishSettingListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}