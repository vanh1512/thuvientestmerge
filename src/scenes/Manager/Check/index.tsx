import * as React from 'react';
import { Col, Row, Button, Card, Input, message, DatePicker, Select, Modal, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ChangeProcessCheckInput, CheckDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { RouterPath, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateCheck from './components/CreateOrUpdateCheck';
import TableMainCheck from './components/TableMainCheck';
import confirm from 'antd/lib/modal/confirm';
import moment, { Moment } from 'moment';
import { eCheckProcess } from '@src/lib/enumconst';
import SelectEnum from '@src/components/Manager/SelectEnum';
import HistoryHelper from '@src/lib/historyHelper';
import ReportCheck from './components/ReportCheck';
import ModalExportCheck from './components/ModalExportCheck';
import ReportStatus from './components/ReportStatus';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import ModalViewCheck from './components/ModalViewCheck';


const dateFormat = 'DD-MM-YYYY';
const { Option } = Select;
export const ActionCheck = {
	DoubleClickRow: 0,
	CreateOrUpdate: 1,
	Delete: 2,
	ChangeStatus: 3,
	ReportCheck: 4,
	StatusDocumentInfoReport: 5,
	ViewCheck: 6,
}
export default class Check extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelCheck: false,
		visibleReport: false,
		visibleReportStatus: false,
		visibleViewCheck: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		ck_code: undefined,
		ck_start_from: undefined,
		ck_start_to: undefined,
		ck_process: undefined,
	};
	checkSelected: CheckDto = new CheckDto();

	async componentDidMount() {
		await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);

		await this.getAll();
	}
	clearSearch = async () => {
		await this.setState({
			ck_start_from: undefined,
			ck_start_to: undefined,
			ck_process: undefined,
			ck_code: undefined,
		});
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.checkStore.getAll(this.state.ck_code, this.state.ck_start_from, this.state.ck_process, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelCheck: false, visibleReport: false, visibleReportStatus: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: CheckDto) => {
		this.checkSelected.init(input);
		await this.setState({ visibleModalCreateUpdate: true, visibleReport: false, visibleExportExcelCheck: false, visibleReportStatus: false });
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = async (value: CheckDto) => {
		if (value == undefined || value.ck_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.Check_Check_Edit)) {
			message.error(L("ban_khong_the_thuc_hien_thao_tac_nay"));
			return;
		}
		if (value.ck_process == eCheckProcess.Give_Back.num || value.ck_process == eCheckProcess.Creating.num) {
			this.createOrUpdateModalOpen(value)
		}
		else {
			this.checkSelected.init(value);
			this.setState({ visibleReport: true })
		}
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalCheck } = stores.checkStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalCheck;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	onActionCheck = async (item: CheckDto, action: number, status?: number) => {
		const self = this;
		const { totalCheck } = stores.checkStore;
		if (item !== undefined && item !== null) {
			this.checkSelected.init(item);
			action == ActionCheck.CreateOrUpdate && this.createOrUpdateModalOpen(item);
			action == ActionCheck.ReportCheck && await this.setState({ visibleModalCreateUpdate: false, visibleExportExcelCheck: false, visibleReport: true, visibleReportStatus: false, visibleViewCheck: false });
			action == ActionCheck.StatusDocumentInfoReport && await this.setState({ visibleModalCreateUpdate: false, visibleExportExcelCheck: false, visibleReport: false, visibleReportStatus: true, visibleViewCheck: false });
			action == ActionCheck.ViewCheck && await this.setState({ visibleModalCreateUpdate: false, visibleExportExcelCheck: false, visibleReport: false, visibleReportStatus: false, visibleViewCheck: true });
		}
		action == ActionCheck.DoubleClickRow && this.onDoubleClickRow(item);

		action == ActionCheck.Delete && confirm({
			title: L('WantDelete'),
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalCheck - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.checkStore.deleteCheck(item);
				self.setState({ isLoadDone: false });
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});
		let statusChange = eCheckProcess.Creating.num
		if (status != undefined) {
			statusChange = status;
		}
		action == ActionCheck.ChangeStatus && this.onChangeProcessCheck(item, statusChange);
	}
	onChangeProcessCheck = async (item: CheckDto, process: number) => {
		await this.setState({ isLoadDone: false });
		let input = new ChangeProcessCheckInput();
		input.ck_id = item.ck_id;
		input.ck_process = process;

		item.ck_process == eCheckProcess.Creating.num && await stores.checkStore.waitApprove(input);
		item.ck_process == eCheckProcess.Wait_Approve.num && await stores.checkStore.changeProcessOfCheckRoom(input);
		item.ck_process == eCheckProcess.Approved.num && await stores.checkStore.changeProcessOfManager(input);

		message.success(L("Success"));
		await this.setState({ isLoadDone: true });
	}
	gotoCataloging = async (item: CheckDto) => {
		await this.setState({ isLoadDone: false });
		if (item.ck_process == eCheckProcess.Sign.num) {
			await stores.checkStore.changeStatusChecking(item.ck_id);
		}
		const prefixManager = RouterPath.admin_check;
		HistoryHelper.redirect(prefixManager + "/cataloging-checkitems?ck_id=" + item.ck_id);
		await this.setState({ isLoadDone: true });
	}
	searchDateStartFrom(date: Moment | null | undefined) {
		if (date == null) {
			date = undefined;
		}
		this.setState({ ck_start_from: date });
	}

	render() {

		const self = this;
		const left = this.state.visibleModalCreateUpdate || this.state.visibleReport || this.state.visibleReportStatus ? cssColResponsiveSpan(0, 0, 0, 0, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate || this.state.visibleReport || this.state.visibleReportStatus ? cssColResponsiveSpan(24, 24, 24, 24, 12, 12) : cssCol(0);

		const { checkListResult, totalCheck } = stores.checkStore;
		return (
			<Card>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 8, 3, 2, 2, 2)} >
						<h2>{L("Check")}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 3, 3, 3)} style={{ fontSize: '16px' }}>
						<strong>{L('CheckCode')}:</strong>&nbsp;&nbsp;<Input value={this.state.ck_code} onPressEnter={() => this.handleSubmitSearch()} allowClear style={{ width: "100%" }} onChange={(e) => this.setState({ ck_code: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 3, 3, 3)} style={{ fontSize: '16px' }}>
						<strong>{L('StartDate')}:</strong>&nbsp;&nbsp;
						<DatePicker
							format={"DD/MM/YYYY"}
							onChange={(date: Moment | null) => this.searchDateStartFrom(date)}
							style={{ width: "100%" }}
							placeholder={L("nhap_tim_kiem")}
							value={this.state.ck_start_from}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 3, 3, 3)} style={{ fontSize: '16px' }}>
						<strong>{L('Status')}:</strong>&nbsp;&nbsp;
						<SelectEnum eNum={eCheckProcess} enum_value={this.state.ck_process} onChangeEnum={async (value: number) => { await this.setState({ ck_process: value }) }} />
					</Col>
					<Col style={{textAlign:"center"}} {...cssColResponsiveSpan(12, 5, 4, 3, 3, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col >
					<Col  {...cssColResponsiveSpan(24, 12, 3, 3, 3, 4)} >
						{(this.state.ck_start_from != undefined || this.state.ck_start_from != undefined || this.state.ck_process != undefined || this.state.ck_code != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col style={{ justifyContent: 'end'}} {...cssColResponsiveSpan(24, 16, 24, 7, 7, 7)} className='textAlign-col-576'>
						{this.isGranted(AppConsts.Permission.Check_Check_Create) &&
							<Button title={L('Planning')} style={{ margin: '0 10px 0 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new CheckDto())}>{L("Planning")}</Button>
						}
						{this.isGranted(AppConsts.Permission.Check_Check_Export) &&
							<Button type="primary" icon={<ExportOutlined />} title={L('ExportData')} onClick={() => this.setState({ visibleExportExcelCheck: true })}>{L('ExportData')}</Button>
						}
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainCheck
							noscroll={false}
							actionCheck={this.onActionCheck}
							checkListResult={checkListResult}
							gotoCataloging={this.gotoCataloging}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalCheck,
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
						{this.state.visibleModalCreateUpdate &&
							<CreateOrUpdateCheck
								onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								checkSelected={this.checkSelected}
							/>}
						{this.state.visibleReport &&
							<ReportCheck onCancel={() => this.setState({ visibleReport: false })} checkSelected={this.checkSelected} />
						}
						{this.state.visibleReportStatus &&
							<ReportStatus onCancel={() => this.setState({ visibleReportStatus: false })} checkSelected={this.checkSelected} />
						}
					</Col>
				</Row>
				<ModalExportCheck
					checkListResult={checkListResult}
					visible={this.state.visibleExportExcelCheck}
					onCancel={() => this.setState({ visibleExportExcelCheck: false })}
				/>
				<Modal
					visible={this.state.visibleViewCheck}
					closable={true}
					maskClosable={true}
					onCancel={() => { this.setState({ visibleViewCheck: false }); }}
					footer={null}
					width={"60vw"}
				>
					<ModalViewCheck
						checkSelected={this.checkSelected}
						checkListResult={checkListResult}
						visible={this.state.visibleViewCheck}
						onCancel={() => this.setState({ visibleViewCheck: false })}
					/>
				</Modal>

			</Card>
		)
	}
}