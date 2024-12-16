import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ReceiptDto, CreateReceiptInput, ContractDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { RouterPath, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TableMainReceipt from './components/TableMainReceipt';
import CreateOrUpdateReceipt from './components/CreateOrUpdateReceipt';
import confirm from 'antd/lib/modal/confirm';
import ModalExportReceipt from './components/ModalExportReceipt';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eReceiptStatus } from '@src/lib/enumconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import CatalogingRecord from '../CatalogingRecord';
import HistoryHelper from '@src/lib/historyHelper';

export interface IProps {
	contractSelected?: ContractDto
	allow_editted?: boolean;
}

export default class Receipt extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelReceipt: false,
		visibleModelImportDocument: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		rec_code: "",
		co_id: undefined,
		us_id_browser: undefined,
		rec_status: undefined,
	};
	receiptSelected: ReceiptDto = new ReceiptDto();

	async componentDidMount() {
		if (this.props.contractSelected !== undefined) {
			this.setState({ co_id: this.props.contractSelected.co_id });
		}
		await this.getAll();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.contractSelected !== prevState.contractSelected) {
			return ({ co_id: nextProps.contractSelected.co_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.co_id != prevState.co_id) {
			await this.getAll();
		}
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.receiptStore.getAll(this.state.rec_code, this.state.co_id, this.state.us_id_browser, this.state.rec_status, this.state.skipCount, this.state.pageSize);
		await stores.billingStore.getAll(undefined, undefined, this.state.co_id, undefined, undefined, undefined, undefined, undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelReceipt: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: CreateReceiptInput) => {
		if (input !== undefined && input !== null) {
			this.receiptSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	gotoCataloging = async (item: ReceiptDto) => {
		this.setState({ isLoadDone: false });
		this.receiptSelected.init(item);
		const prefixManager = RouterPath.admin_buy;
		HistoryHelper.redirect(prefixManager + "/cataloging-record?rec_id=" + item.rec_id);
		this.setState({ isLoadDone: true, visibleModelImportDocument: true })
	}
	deleteReceipt = async (item: ReceiptDto) => {
		let self = this;
		const { totalReceipt } = stores.receiptStore;
		confirm({
			title: L('YouWantToDelete'),
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalReceipt - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				self.setState({ isLoadDone: false });
				await stores.receiptStore.deleteReceipt(item);
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = (value: ReceiptDto) => {
		if (value.rec_status == eReceiptStatus.Da_nhap_tai_lieu.num) {
			return;
		}
		if (value == undefined || value.rec_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.Buy_Receipt_Edit)) {
			message.error(L("ban_khong_the_thuc_hien_thao_tac_nay"));
			return;
		}
		this.receiptSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalReceipt } = stores.receiptStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalReceipt;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	printForm = () => {
		this.setState({ visibleReceiptForm: true });
	}


	render() {

		const self = this;
		const left = this.state.visibleModalCreateUpdate ? cssCol(5) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssCol(19) : cssCol(0);
		const { receiptListResult, totalReceipt } = stores.receiptStore;
		const { allow_editted } = this.props;

		return (
			<Card>
				<Row gutter={[8, 8]}>
					<Col {...cssColResponsiveSpan(24, 24, 5, 5, 5, 5)} >
						<h2>{L('ListReceipt')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 7, 7, 7, 7)}>
						{/* <strong>{L("ReceitptCode")}</strong>&nbsp; */}
						<Input allowClear placeholder={L('TypeCodeReceipt')} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ rec_code: e.target.value.trim() })} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 4)}>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 8, 8, 8, 8)} style={{ textAlign: "right" }}>
						{(this.isGranted(AppConsts.Permission.Buy_Receipt_Create) && !allow_editted) &&
							<Button style={{ margin: '0 10px 0 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new ReceiptDto())}>{L('Create')}</Button>
						}
						{(this.isGranted(AppConsts.Permission.Buy_Receipt_Export) && !allow_editted) &&
							<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelReceipt: true })}>{L('ExportData')}</Button>
						}
					</Col>
				</Row>
				{/* <Row gutter={[16, 16]} align='bottom'>

					<Col {...cssColResponsiveSpan(24, 12, 12, 8, 8, 8)}>
						<strong>{L("Status")}</strong>&nbsp;
						<SelectEnum
							eNum={eReceiptStatus}
							enum_value={this.state.rec_status}
							onChangeEnum={(e) => this.setState({ rec_status: e })}
						></SelectEnum>
					</Col>
				</Row> */}

				<Row>
					<Col span={24} style={{ overflowY: "auto" }}>
						<TableMainReceipt
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							gotoCataloging={this.gotoCataloging}
							deleteItem={this.deleteReceipt}
							printForm={this.printForm}
							receiptListResult={receiptListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalReceipt,
								current: this.state.currentPage,
								showTotal: (tot) => L("tong") + ": " + tot + "",
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
				</Row>

				<ModalExportReceipt
					receiptListResult={receiptListResult}
					visible={this.state.visibleExportExcelReceipt}
					onCancel={() => this.setState({ visibleExportExcelReceipt: false })}
				/>

				<Modal
					visible={this.state.visibleModalCreateUpdate}
					onCancel={() => { this.setState({ visibleModalCreateUpdate: false }) }}
					footer={null}
					width='70vw'
					maskClosable={false}
					closable={false}
				>
					<CreateOrUpdateReceipt
						contractSelected={this.props.contractSelected}
						onCreateUpdateSuccess={this.onCreateUpdateSuccess}
						onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
						receiptSelected={this.receiptSelected}
					/>
				</Modal>
				{
					this.state.visibleModelImportDocument == true &&
					<CatalogingRecord receiptSelected={this.receiptSelected} onSuccess={async () => await this.getAll()} />
				}

			</Card>
		)
	}
}