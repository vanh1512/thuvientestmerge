import * as React from 'react';
import { Col, Row, Button, message, Modal } from 'antd';
import { stores } from '@stores/storeInitializer';
import { PlanDetailDto, ChangeProcessPlanInput, PlanDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CarryOutOutlined, ExportOutlined, PlusOutlined, } from '@ant-design/icons';
import { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TablePlanDetail from './components/TablePlanDetail';
import ModalExportPlanDetail from './components/ModalExportPlanDetail';
import { eProcess } from '@src/lib/enumconst';
import CreateOrUpdatePlanDetail from './components/CreateOrUpdatePlanDetail';

export interface IProps {
	onCreateUpdateSuccessPlan?: (plan: PlanDto) => void;
	onCancel: () => void;
	plan_selected: PlanDto;
}
const confirm = Modal.confirm
export default class PlanDetail extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelPlanDetail: false,
		pl_id: undefined,
		pageSize: 10,
		currentPage: 1,
	};
	planDetailSelected: PlanDetailDto = new PlanDetailDto();

	async componentDidMount() {
		await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
		await this.getAll();
	}

	componentDidUpdate(prevState, prevProps) {
		if (this.state.pl_id != this.props.plan_selected.pl_id) {
			this.setState({ pl_id: this.props.plan_selected.pl_id });
			this.getAll();
		}
	}

	onCreateOrUpdate = async (input: PlanDetailDto) => {
		this.planDetailSelected.init(input);
		this.setState({ visibleModalCreateUpdate: true })
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.planDetailStore.getAll(this.props.plan_selected.pl_id);
		this.setState({ isLoadDone: true, visibleExportExcelPlanDetail: false });
	}

	handleSubmitSearch = async () => {
		await this.getAll();
	}

	actionTable = (planDetail: PlanDetailDto, event: EventTable) => {
		if (planDetail == undefined || planDetail.pl_de_id == undefined) {
			message.error(L("CanNotFound"));
			return;
		}

		if (event == EventTable.Delete) {
			let self = this;
			confirm({

				title: L('ban_co_chac_muon_xoa') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					await stores.planDetailStore.deletePlanDeTail(planDetail);
					message.success(L("SuccessfullyDeleted"));
					await self.getAll();
					self.setState({ isLoadDone: true, visibleModalCreateUpdate: false });
				},
				onCancel() {
				},
			});
		}
		if (event == EventTable.Edit) {
			this.onCreateOrUpdate(planDetail);
		}

	};


	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onChangePage = async (page: number, pagesize?: number) => {
		const { planDetailListResult } = stores.planDetailStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = planDetailListResult.length;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	onApprovePlan = async () => {
		await this.setState({ isLoadDone: false });
		let input = new ChangeProcessPlanInput();
		input.pl_id = this.props.plan_selected.pl_id;
		input.pl_process = eProcess.Wait_Approve.num;
		await stores.planStore.waitApprove(input);
		message.success(L("Success"));
		await this.onCancel();
		await this.setState({ isLoadDone: false });
	}

	render() {
		const self = this;
		const { planDetailListResult } = stores.planDetailStore;
		const { plan_selected } = this.props;
		const left = this.state.visibleModalCreateUpdate ? { ...cssColResponsiveSpan(24, 24, 24, 12, 12, 12) } : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? { ...cssColResponsiveSpan(24, 24, 24, 12, 12, 12) } : cssCol(0);
		return (
			<Row>

				{plan_selected.pl_process != eProcess.Complete.num &&
					<Row gutter={12} style={{ width: "100%", marginBottom: '5px' }}>
						<Col span={24} style={{ textAlign: "end" }}>
							{(plan_selected.pl_process == eProcess.Creating.num || plan_selected.pl_process == eProcess.Give_Back.num) &&
								<>
									{planDetailListResult.length > 0 && <Button type="primary" icon={<CarryOutOutlined />} title={L('SubmitPlan')} onClick={() => this.onApprovePlan()}>{L('SubmitPlan')}</Button>
									}
									&nbsp;
									<Button type="primary" icon={<PlusOutlined />} onClick={() => this.onCreateOrUpdate(new PlanDetailDto())}>{L('CreatePlanDetail')}</Button>
								</>
							}
							&nbsp;
							<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelPlanDetail: true })}>{L('ExportData')}</Button>
						</Col>
					</Row>}
				<Row style={{ width: "100%" }}>
					<Col {...left} >
						<TablePlanDetail
							actionTable={this.actionTable}
							isLoadDone={this.state.isLoadDone}
							planDetailListResult={planDetailListResult}
							onCreateOrSucces={this.handleSubmitSearch}
							planId={plan_selected.pl_id}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							hasAction={plan_selected.pl_process == eProcess.Creating.num || plan_selected.pl_process == eProcess.Give_Back.num ? true : false}
							pagination={{
								pageSize: this.state.pageSize,
								total: planDetailListResult.length,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L("All")],
								onShowSizeChange(current: number, size: number) {
									self.onChangePage(current, size)
								},
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
					{this.state.visibleModalCreateUpdate &&
						<Col {...right}>
							<CreateOrUpdatePlanDetail pl_id={plan_selected.pl_id} planDetailSelected={this.planDetailSelected} onCreateUpdateSuccess={this.handleSubmitSearch} onCancel={() => this.setState({ visibleModalCreateUpdate: false })} />
						</Col>
					}
				</Row>

				<ModalExportPlanDetail
					planDetailListResult={planDetailListResult}
					title={plan_selected.pl_title!}
					visible={this.state.visibleExportExcelPlanDetail}
					onCancel={() => this.setState({ visibleExportExcelPlanDetail: false })}
				/>
			</Row>
		)
	}
}