import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { PlanDto } from "@src/services/services_autogen";
import { Button, Col, Modal, Row } from "antd";
import React from "react";
import { stores } from '@stores/storeInitializer';
import TablePlanDetail from "../PlanDetail/components/TablePlanDetail";
import { L } from "@src/lib/abpUtility";
import ActionExport from "@src/components/ActionExport";
import moment from "moment";
import HeaderReport from "@src/components/LayoutReport/HeaderReport";
import FooterPlanReport from "@src/components/LayoutReport/FooterPlanReport";

interface IProps {
	planSelected: PlanDto;
	onCancel?: () => void;
	visible: boolean;
}

export default class DetailPlan extends AppComponentBase<IProps>{
	componentRef: any | null = null;

	state = {
		isLoadDone: true,
		isHeaderReport: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,

	}
	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.planDetailStore.getAll(this.props.planSelected!.pl_id);
		this.setState({ isLoadDone: true });
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { planSelected } = this.props;
		const { planDetailListResult } = stores.planDetailStore;
		return (
			<Modal
				visible={this.props.visible}
				title={<Row>
					<Col span={12}>
						<h2>{L('ExportListOf') + " " + L('PlanDetail')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							nameFileExport={L('chi_tiet_ke_hoach_mua_sam') + " " + planSelected.pl_title + " " + moment().format("DD-MM-YYYY")}
							idPrint="plan_detail_print_id"
							isExcel={true}
							isWord={true}
							componentRef={this.componentRef}
						/>
						<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L('Cancel')}</Button>
					</Col>
				</Row>}
				onCancel={this.props.onCancel}
				footer={null}
				closable={false}
				width='80vw'
				maskClosable={true}
			>
				<Row id="plan_detail_print_id" ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col span={24}>
						<Row style={{ justifyContent: 'center', }}>
							<h1 style={{ textTransform: 'uppercase' }}>{L('PurchasePlan') + ": " + planSelected.pl_title}</h1>
						</Row>
						<Col span={24}>
							<TablePlanDetail
								isLoadDone={this.state.isLoadDone}
								planDetailListResult={planDetailListResult}
								hasAction={false}
								pagination={false}
								isPrint={true}
							/>
						</Col>
						{this.state.isHeaderReport && <FooterPlanReport footer="plan" />}

					</Col>

				</Row>
			</Modal>
		)
	}
}