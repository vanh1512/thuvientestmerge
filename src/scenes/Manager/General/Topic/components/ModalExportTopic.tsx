import * as React from 'react';
import { Col, Modal, Row, Button, } from 'antd';
import { TopicDto, } from '@services/services_autogen';
import TableMainTopic from './TableMainTopic';
import ActionExport from '@src/components/ActionExport';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	topicListResult: TopicDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportTopic extends React.Component<IProps> {
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
		const { topicListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportListTopic')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh_sach_chu_de_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="Topic_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L('huy')} danger style={{ margin: '0 26px 0 9px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
						</Col>
					</Row>}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Col span={24} style={{ marginTop: '10px' }} ref={this.setComponentRef} id='Topic_print_id'>
				{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_chu_de")} </h1></Col>
					<TableMainTopic
						topicListResult={topicListResult}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}