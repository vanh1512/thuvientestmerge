import * as React from 'react';
import { Col, Row, Modal, Button, } from 'antd';
import { PlanDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import TableMainPlan from './TablePlan';
import moment from 'moment';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';

export interface IProps {
	planListResult: PlanDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportPlan extends React.Component<IProps> {
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
		const { planListResult } = this.props;

		return (
			<Modal
				visible={this.props.visible}
				title={<Row>
					<Col span={12}>
						<h3>{L('xuat_danh_sach') + " " + L('Plan')}</h3>
					</Col>
					<Col span={12} style={{ textAlign: 'end' }}>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							nameFileExport={L('danh_sach_ke_hoach_mua_sam') + " " + moment().format("DD-MM-YYYY")}
							idPrint="plan_print_id"
							isExcel={true}
							isWord={true}
							componentRef={this.componentRef}
						/>
						<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
					</Col>
				</Row>}
				onCancel={this.props.onCancel}
				closable={false}
				footer={null}
				width='90vw'
				maskClosable={true}
			>
				<Col span={24} id='plan_print_id' className='page-break' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{L("DANH_SACH_KE_HOACH_MUA_SAM")}</h2></Col>
					<TableMainPlan
						is_printed={true}
						isTitle={true}
						planListResult={planListResult}
						pagination={false}
					/>
				{this.state.isHeaderReport && <FooterReport />}
				</Col>
			</Modal>
		)
	}
}