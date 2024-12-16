import * as React from 'react';
import { Col, Row, Button, Card, Modal, message, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { L } from '@lib/abpUtility';
import TableApplications from './Component/TableApplications';
import { ApplicationExtDto, CreateApplicationExtInput } from '@src/services/services_autogen';
import AppConsts, { EventTable, cssCol } from '@src/lib/appconst';
import CreateOrUpdateApplication from './Component/CreateUpdateApplication';
import { ExportOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ModalExportApplication from './Component/ModalExportApplication';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
const { confirm } = Modal;
export default class Applications extends AppComponentBase {
	state = {
		isLoadDone: true,
		app_search: undefined,
		visibleModalCreateUpdate: false,
		currentPage: 1,
		pageSize: 10,
		visibleExportApplication: false,
		skipCount: 0,
	};
	applicationSelected: ApplicationExtDto = new ApplicationExtDto();

	async componentDidMount() {
		await this.getAll()
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.applicationStore.getAll(undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportApplication: false });
	}
	createOrUpdateModalOpen = async (input: CreateApplicationExtInput) => {
		if (input !== undefined && input !== null) {
			this.applicationSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, isLoadDone: true, });
		}
	}


	actionTable = (application: ApplicationExtDto, event: EventTable) => {
		if (application === undefined || application.ap_id === undefined) {
			message.error(L("Khong_tim_thay"));
			return;
		}
		let self = this;
		const { totalApplication } = stores.applicationStore;
		if (event === EventTable.Edit || event === EventTable.RowDoubleClick) {
			if (!this.isGranted(AppConsts.Permission.System_SystemApplications_Edit)) {
				message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
				return;
			}
			this.createOrUpdateModalOpen(application);
		}
		else if (event === EventTable.Delete) {
			confirm({
				title: L("xoa_ung_dung") + " ?",
				okText: L("xac_nhan"),
				cancelText: L("huy"),
				async onOk() {
					if (self.state.currentPage > 1 && (totalApplication - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.applicationStore.deleteApplication(application);
					await self.getAll();
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
	};
	onChangePage = async (page: number, pagesize?: number) => {
		const { totalApplication } = stores.applicationStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalApplication;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	render() {
		const self = this;
		const { applicationListResult, totalApplication } = stores.applicationStore;
		const left = this.state.visibleModalCreateUpdate ? cssCol(14) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssCol(10) : cssCol(0);
		return (
			<Card>
				<Row>
					<Col span={12}>
						<h2>{L("ung_dung")}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "end" }}>
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.System_SystemApplications_Create) &&
							<Button title={L('them_moi')} type="primary" onClick={() => this.createOrUpdateModalOpen(new ApplicationExtDto())}><PlusCircleOutlined />{L('them_moi')}</Button>
						}
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.System_SystemApplications_Export) &&
							<Button title={L('xuat_du_lieu')} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportApplication: true })}>{L('xuat_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableApplications
							actionTable={this.actionTable}
							applicationListResult={applicationListResult}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalApplication,
								current: this.state.currentPage,
								showTotal: (tot) => (L("tong")) + " " + tot + "",
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
						<CreateOrUpdateApplication
							applicationSelected={this.applicationSelected}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							onCreateUpdateSuccess={async () => { await this.getAll(); }}
						/>
					</Col>
				</Row>
				<ModalExportApplication
					applicationListResult={applicationListResult}
					visible={this.state.visibleExportApplication}
					onCancel={() => this.setState({ visibleExportApplication: false })}
				/>
			</Card>
		)
	}
}