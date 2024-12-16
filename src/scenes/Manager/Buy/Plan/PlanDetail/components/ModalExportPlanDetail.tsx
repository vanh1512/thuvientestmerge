import * as React from 'react';
import { Col, Row, Modal, Button, } from 'antd';
import { PlanDetailDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainPlanDetail from './TablePlanDetail';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	planDetailListResult: PlanDetailDto[],
	title: string;
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportPlanDetail extends React.Component<IProps> {
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
		const { title, planDetailListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h3>{L('Export') + " " + L('PlanDetail') + " " + title}</h3>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport='PlanDetail'
								idPrint="planDetail_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}> {L("huy")} </Button>
						</Col>
					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Row style={{ width: "100%" }} id='planDetail_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<TableMainPlanDetail
						planDetailListResult={planDetailListResult}
						pagination={false}
						isLoadDone={true}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Row>
			</Modal>
		)
	}
}