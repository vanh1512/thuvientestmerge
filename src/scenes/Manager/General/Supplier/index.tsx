import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { SupplierDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateSupplier from './components/CreateOrUpdateSupplier';
import TableSupplier from './components/TableSupplier';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import ModalExportSupplier from './components/ModalExportSupplier';
import ImportSampleExcelDataSupplier from './components/ImportSampleExcelDataSupplier';
const { confirm } = Modal;

export default class Supplier extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelSupplier: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		su_search: "",
		visibleImportExcelSupplier: false,
		numberSelected: 0,
		clicked: false,
		select: false,
		checkDeleteMulti: false,
		isButtonMultiExportClick: false,
	};
	supplierSelected: SupplierDto = new SupplierDto();
	keySelected: number[] = [];
	listItemSupplier: SupplierDto[] = [];

	async getAll(tess?) {
		this.setState({ isLoadDone: false });
		await stores.supplierStore.getAll(
			this.state.su_search,
			this.state.skipCount,
			undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, });
	}

	async componentDidMount() {
		await this.getAll(this.setState({ visibleExportExcelSupplier: false }));

	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: SupplierDto) => {
		if (input === undefined) {
			message.error(L('NotFound'));
			return;
		}
		this.supplierSelected.init(input);
		await this.setState({ visibleModalCreateUpdate: true, });

	}

	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalSupplier } = stores.supplierStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalSupplier;
			page = 1;
		}
		await this.setState({ pageSize: pagesize });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			await this.getAll();
		});
	}

	actionTableSupplier = (supplier: SupplierDto, event: EventTable) => {
		let self = this;
		const { totalSupplier } = stores.supplierStore
		if (event === EventTable.Edit || event === EventTable.RowDoubleClick) {
			if (!this.isGranted(AppConsts.Permission.General_Supplier_Edit)) {
				message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
				return;
			}
			this.createOrUpdateModalOpen(supplier);
		} else if (event === EventTable.Delete) {
			confirm({
				title: L('WantDelete') + " " + L("Supplier") + ": " + supplier.su_name + "?",
				okText: L('Confirm'),
				cancelText: L('Cancel'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalSupplier - 1) % 10 === 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.supplierStore.deleteSupplier(supplier);
					await self.getAll();
					message.success(L("SuccessfullyDeleted"))
				},
				onCancel() {

				},
			});
		}
	}

	onRefreshData = () => {
		this.setState({ visibleImportExcelSupplier: false });
		this.getAll();
	}

	deleteMulti = async (listIdSupplier: number[]) => {
		if (this.state.numberSelected < 1) {
			await message.warning(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			let self = this;
			const { totalSupplier } = stores.supplierStore
			confirm({
				title: (L('ban_co_muon_xoa_hang_loat')) + "?",
				okText: (L('xac_nhan')),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalSupplier - self.keySelected.length) % 10 === 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.supplierStore.deleteMulti(listIdSupplier);
					await self.getAll();
					self.setState({ isLoadDone: true, numberSelected: 0 });
					message.success(L("xoa_thanh_cong" + "!"))
				},
				onCancel() {
				},
			});
		}
	}
	deleteAll() {
		let self = this;
		this.setState({ isLoadDone: false });
		confirm({
			title: L("ban_co_chac_muon_xoa_tat_ca"),
			okText: L("Delete"),
			cancelText: L("huy"),
			async onOk() {
				await stores.supplierStore.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });
	}
	onChangeSelect = (listItemSupplier: SupplierDto[], listIdSupplier: number[]) => {
		this.setState({ isLoadDone: false });
		this.listItemSupplier = listItemSupplier;
		this.keySelected = listIdSupplier;
		listItemSupplier.length == 0 ? this.setState({ checkDeleteMulti: false }) : this.setState({ checkDeleteMulti: true })
		this.setState({ isLoadDone: true, numberSelected: listItemSupplier.length });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	handleVisibleChange = (visible) => {
		this.setState({ clicked: visible });
	}
	render() {
		const self = this;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);
		const { supplierListResult, totalSupplier } = stores.supplierStore;

		return (
			<Card>
				<Row gutter={[8, 4]}>
					<Col {...cssColResponsiveSpan(24, 8, 8, 5, 4, 4)} >
						<h2>{L('Supplier')}</h2>

					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 16, 12, 8, 8)} >
						<Input
							style={{ width: '60%', marginRight: '5px' }} allowClear={true}
							onChange={(e) => this.setState({ su_search: e.target.value.trim() })} placeholder={L("TaxCode") + ", " + L("SupplierName")}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 12, 12)} className='textAlign-col-1200'>

						&nbsp;&nbsp;&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.General_Supplier_Edit) &&
							<Button title={L('them_moi')} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new SupplierDto())}	>{L('them_moi')}</Button>
						}

						{this.isGranted(AppConsts.Permission.General_Supplier_Export) &&
							<Button title={L('ExportData')} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelSupplier: true, isButtonMultiExportClick: false })}>{L('ExportData')}</Button>
						}

						{this.isGranted(AppConsts.Permission.General_Supplier_Import) &&
							<Button title={L('nhap_du_lieu')} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportExcelSupplier: true })}>{L('nhap_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24} >
						{this.isGranted(AppConsts.Permission.General_Fields_Delete) &&
							<Badge count={this.state.numberSelected}>
								<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
									<>
										<Row style={{ alignItems: "center" }}>
											<Button
												danger icon={<DeleteOutlined />} title={L("xoa_tat_ca")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => { this.deleteAll(); this.hide() }}
												type='primary'
											></Button>
											<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteAll(); this.hide() }}>{L('xoa_tat_ca')}</a>
										</Row>
										<Row style={{ alignItems: "center", marginTop: "10px" }}>
											<Button
												danger icon={<DeleteFilled />} title={L("Delete")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => { this.deleteMulti(this.keySelected); this.hide() }}
											></Button>
											<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteMulti(this.keySelected); this.hide() }}>{L('xoa_hang_loat')}</a>
										</Row>
										<Row style={{ alignItems: "center", marginTop: "10px" }}>
											<Button
												type='primary'
												icon={<ExportOutlined />} title={L("ExportData")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => !!this.listItemSupplier.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelSupplier: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}
											></Button>
											<a style={{ paddingLeft: "10px" }}
												onClick={() => !!this.listItemSupplier.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelSupplier: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}
											>
												{L('ExportData')}</a>

										</Row>
									</>
								} trigger={['hover']} >
									<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
								</Popover >
							</Badge>
						}
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableSupplier
							onChangeSelect={this.onChangeSelect}
							noscroll={false}
							actionTable={this.actionTableSupplier}
							supplierListResult={supplierListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalSupplier,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
					<Col {...right}>
						<CreateOrUpdateSupplier
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							supplierSelected={this.supplierSelected}
						/>
					</Col>
				</Row>

				<ModalExportSupplier
					supplierListResult={this.state.isButtonMultiExportClick ? this.listItemSupplier : supplierListResult}
					visible={this.state.visibleExportExcelSupplier}
					onCancel={() => this.setState({ visibleExportExcelSupplier: false, select: false })}
				/>
				<Modal
					visible={this.state.visibleImportExcelSupplier}
					closable={false}
					maskClosable={false}
					onCancel={() => { this.setState({ visibleImportExcelSupplier: false }); }}
					footer={null}
					width={"60vw"}
					title="NHẬP DỮ LIỆU NHÀ CUNG CẤP"
				>
					<ImportSampleExcelDataSupplier
						onRefreshData={this.onRefreshData}
						onCancel={() => this.setState({ visibleImportExcelSupplier: false })}
					/>
				</Modal>
			</Card >
		)
	}
}