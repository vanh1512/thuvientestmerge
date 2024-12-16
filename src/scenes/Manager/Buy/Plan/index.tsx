import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message } from 'antd';
import { stores } from '@stores/storeInitializer';
import { PlanDto, ChangeProcessPlanInput, CreatePlanInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdatePlan from './components/CreateOrUpdatePlan';
import ModalExportPlan from './components/ModalExportPlan';
import TablePlan from './components/TablePlan';
import { eProcess } from '@src/lib/enumconst';
import SelectEnum from '@src/components/Manager/SelectEnum';
import DetailPlan from './components/DetailPlan';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

const { confirm } = Modal;

export const ActionPlan = {
	DoubleClickRow: 1,
	CreateOrUpdate: 2,
	Delete: 3,
	ChangeStatus: 4,
	ShowPlanDetail: 5,
}

export default class Plan extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleModalPlanDetail: false,
		visibleExportExcelPlan: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		pl_title: undefined,
		pl_process: undefined,
	};
	planSelected: PlanDto = new PlanDto();

	async componentDidMount() {
		await this.getAll();
	}
	clearSearch = async () => {
		await this.setState({
			pl_process: undefined,
			pl_title: undefined,
		});
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.planStore.getAll(this.state.pl_title, this.state.pl_process, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelPlan: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: CreatePlanInput) => {
		if (input !== undefined && input !== null) {
			this.planSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true });
		}
	}
	showDetailPlan = async (input: CreatePlanInput) => {
		if (input !== undefined && input !== null) {
			this.planSelected.init(input);
			await this.setState({ visibleModalPlanDetail: true });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}
	onChangePage = async (page: number, pagesize?: number) => {
		const { totalPlan } = stores.planStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalPlan;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	onActionPlan = (item: PlanDto, action: number, status?: number) => {
		const self = this;
		const { totalPlan } = stores.planStore
		if (action === ActionPlan.DoubleClickRow) {
			if (!this.isGranted(AppConsts.Permission.Buy_Plan_Edit)) {
				message.error(L("ban_khong_the_thuc_hien_thao_tac_nay"));
				return;
			}
			this.createOrUpdateModalOpen(item);
		}
		action === ActionPlan.CreateOrUpdate && this.createOrUpdateModalOpen(item);
		action === ActionPlan.ShowPlanDetail && this.showDetailPlan(item);
		action === ActionPlan.Delete && confirm({
			title: (<span> {L('ban_co_chac_muon_xoa')} {''} <strong>{L("Plan")}: {item.pl_title}</strong> {'?'}
			</span>
			),
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalPlan - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.planStore.deletePlan(item);
				message.success(L("SuccessfullyDeleted"));
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});
		let statusChange = eProcess.Creating.num
		if (status !== undefined) {
			statusChange = status;
		}
		action === ActionPlan.ChangeStatus && this.onChangeStatusPlan(item, statusChange);
	}

	onChangeStatusPlan = async (item: PlanDto, status: number) => {
		this.setState({ isLoadDone: false });
		let input = new ChangeProcessPlanInput();
		input.pl_id = item.pl_id;
		input.pl_process = status;
		item.pl_process === eProcess.Creating.num && await stores.planStore.waitApprove(input);
		item.pl_process === eProcess.Wait_Approve.num && await stores.planStore.changeProcessOfPlanRoom(input);
		item.pl_process === eProcess.Approved.num && await stores.planStore.changeProcessOfManager(input);
		message.success(L("ExecuteSuccessfully"));
		await this.setState({ isLoadDone: true });
	}
	getSuccessConfirm = async () => {
		await this.getAll();
	}

	onCancel() {
		this.setState({ visibleModalPlanDetail: false })
	}
	render() {

		const self = this;
		const left = this.state.visibleModalCreateUpdate ? { ...cssColResponsiveSpan(0, 0, 0, 0, 8, 8) } : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? { ...cssColResponsiveSpan(24, 24, 24, 24, 16, 16) } : cssCol(0);
		const { planListResult, totalPlan } = stores.planStore;

		return (
			<Card>
				<Row gutter={[8, 8]} align='bottom'>
					<Col  {...cssColResponsiveSpan(24, 6, 3, 3, 5, 4)} >
						<h2>{L('PurchasePlan')}</h2>
					</Col>
					<Col  {...cssColResponsiveSpan(24, 12, 3, 3, 3, 4)} >
						<strong>{L("Title")}</strong>
						<Input value={this.state.pl_title} allowClear={true} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ pl_title: e.target.value.trim() })} placeholder={L('Title') + "..."} />
					</Col>
					<Col  {...cssColResponsiveSpan(24, 12, 3, 3, 3, 4)} >
						<strong>{L("Status")} </strong>
						<SelectEnum placeholder={L('PlanStatus')} eNum={eProcess} enum_value={this.state.pl_process} onChangeEnum={async (value: number) => { await this.setState({ pl_process: value }) }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 3, 3, 3, 2)} style={{ textAlign: "center" }}>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 3, 2, 2, 2, 3)}>
						{(this.state.pl_process != undefined || this.state.pl_title != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col  {...cssColResponsiveSpan(24, 24, 10, 10, 8, 7)} style={{ textAlign: "end" }} className='textAlign-col-576'>
						{this.isGranted(AppConsts.Permission.Buy_Plan_Create) &&
							<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new PlanDto())}>{L('CreatePlan')}</Button>
						}
						&nbsp;
						{this.isGranted(AppConsts.Permission.Buy_Plan_Export) &&
							<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelPlan: true })}>{L('ExportData')}</Button>
						}
					</Col>
				</Row>

				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TablePlan
							isTitle={false}
							actionPlan={this.onActionPlan}
							planListResult={planListResult}
							hasAction={true}
							isLoadDone={this.state.isLoadDone}
							getSuccessConfirm={this.getSuccessConfirm}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalPlan,
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

					<Col {...right}>
						<CreateOrUpdatePlan
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							planSelected={this.planSelected}
						/>
					</Col>
				</Row>

				<ModalExportPlan
					planListResult={planListResult}
					visible={this.state.visibleExportExcelPlan}
					onCancel={() => this.setState({ visibleExportExcelPlan: false })}
				/>
				{this.state.visibleModalPlanDetail &&
					<DetailPlan
						planSelected={this.planSelected}
						visible={this.state.visibleModalPlanDetail}
						onCancel={() => this.onCancel()}
					></DetailPlan>
				}
			</Card>
		)
	}
}