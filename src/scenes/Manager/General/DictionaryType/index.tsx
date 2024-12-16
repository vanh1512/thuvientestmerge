import * as React from 'react';
import { Col, Row, Button, Card, Input, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { DictionaryTypeDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan, } from '@src/lib/appconst';
import CreateOrUpdateDictionaryType from './components/CreateOrUpdateDictionaryType';
import TableDictionaryType from './components/TableDictionaryType';
import confirm from 'antd/lib/modal/confirm';
import ModalExportDictionaryType from './components/ModalExportDictionaryType';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { Bar } from 'recharts';
import ModalImportExcelDictionaryType from './components/ModalImportExcelDictionaryType';

export default class DictionaryType extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleModalExport: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		dic_ty_name: "",
		numberSelected: 0,
		clicked: false,
		select: false,
		checkDeleteMulti: false,
		visibleModalImport: false,
	};
	dictionaryTypeSelected: DictionaryTypeDto = new DictionaryTypeDto();
	keySelected: number[] = [];
	listItemSelected: DictionaryTypeDto[] = [];
	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		await this.setState({ isLoadDone: false });
		await stores.dictionaryTypeStore.getAll(this.state.dic_ty_name, this.state.skipCount, this.state.pageSize);
		await this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleModalExport: false });

	}

	handleSearch = async () => {
		this.getAll();
	}


	createOrUpdateModalOpen = (item: DictionaryTypeDto) => {
		if (item == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.General_DictionaryType_Edit)) {
			message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
			return;
		}
		this.dictionaryTypeSelected.init(item);
		this.setState({ visibleModalCreateUpdate: true, });
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalDictionaryType } = stores.dictionaryTypeStore;

		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalDictionaryType;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	deleteDictionaryType = async (item: DictionaryTypeDto) => {
		const self = this;
		const { totalDictionaryType } = stores.dictionaryTypeStore;
		confirm({
			title: L('ban_co_muon_xoa_bo_tu_dien_nay') + ", " + item.dic_ty_id + "." + item.dic_ty_name + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalDictionaryType - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.dictionaryTypeStore.delete(item);
				await self.getAll();
				message.success(L("SuccessfullyDeleted"))
			},
			onCancel() {

			},
		});
	}
	changeStatusDictionaryType = async (item: DictionaryTypeDto, isActive: boolean) => {
		const self = this;
		confirm({
			title: L('ban_co_muon_thay_doi_trang_thai') + " - " + item.dic_ty_name + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				await self.setState({ isLoadDone: false });
				await stores.dictionaryTypeStore.changeStatus(item.dic_ty_id, isActive);
				await self.getAll();
				message.success(L("chinh_sua_trang_thai_thanh_cong"))
				await self.setState({ isLoadDone: true });

			},
			onCancel() {

			},
		});
	}
	deleteMulti = async (listIdDictionaryType: number[]) => {
		if (listIdDictionaryType.length < 1) {
			await message.warning(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			const self = this;
			const { totalDictionaryType } = stores.dictionaryTypeStore;
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalDictionaryType - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.dictionaryTypeStore.deleteMulti(listIdDictionaryType);
					await self.getAll();

					self.setState({ isLoadDone: true, numberSelected: 0 });
					message.success(L("xoa_thanh_cong") + "!")
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
				await stores.dictionaryTypeStore.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });
	}
	onChange = (listItemDictionaryType: DictionaryTypeDto[], listIdDictionaryType: number[]) => {
		this.setState({ isLoadDone: false, })
		this.listItemSelected = listItemDictionaryType;
		this.keySelected = listIdDictionaryType;
		this.setState({ isLoadDone: true, numberSelected: listIdDictionaryType.length });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	handleVisibleChange = (visible) => {
		this.setState({ clicked: visible });
	}
	onRefreshData = () => {
		this.setState({ visibleModalImport: false });
		this.getAll();
	}
	render() {

		const self = this;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 0, 0, 6) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 24, 24, 18) : cssCol(0);
		const { dictionaryTypeListResult, totalDictionaryType } = stores.dictionaryTypeStore;

		return (
			<Card>
				<Row gutter={[8, 4]}>
					<Col {...cssColResponsiveSpan(24, 5, 5, 3, 3, 3)} >
						<h2>{L("bo_tu_dien")}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(12, 10, 7, 7, 7, 7)} >
						<Input allowClear onChange={(e) => this.setState({ dic_ty_name: e.target.value.trim() })} placeholder={L("ten_tu_dien") + ", " + L("mo_ta")} onPressEnter={this.handleSearch} />
					</Col>
					<Col {...cssColResponsiveSpan(12, 8, 3, 3, 3, 3)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('tim_kiem')} onClick={() => this.handleSearch()} >{L('tim_kiem')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 11, 11)} className='textAlign-col-1200'>


						{this.isGranted(AppConsts.Permission.General_DictionaryType_Create) &&
							<Button title={L('them_moi')} style={{ margin: '0 0.5em 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new DictionaryTypeDto())}>{L('them_moi')}</Button>
						}

						{this.isGranted(AppConsts.Permission.General_DictionaryType_Export) &&
							<Button style={{ margin: '0 0.5em 0.5em 0' }} title={L('xuat_du_lieu')} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleModalExport: true })}>{L('xuat_du_lieu')}</Button>
						}
						{/* {this.isGranted(AppConsts.Permission.General_Fields_Import) && */}
						<Button title={L("nhap_du_lieu")} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleModalImport: true })}>{L('nhap_du_lieu')}</Button>
						{/* } */}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24} >
						{/* {this.isGranted(AppConsts.Permission.General_Fields_Delete) && */}
						<Badge count={this.state.numberSelected}>
							<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
								<>
									{this.isGranted(AppConsts.Permission.General_DictionaryType_Delete) &&
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
									}
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
											onClick={async () => {
												if (this.keySelected.length < 1) {
													await message.warning(L("hay_chon_hang_muon_xuat_du_lieu"));
												}
												else {
													this.setState({ visibleModalExport: true, select: true })
												}; this.hide()
											}}
										></Button>
										<a style={{ paddingLeft: "10px" }} onClick={async () => {
											if (this.keySelected.length < 1) {
												await message.warning(L("hay_chon_hang_muon_xuat_du_lieu"));
											}
											else {
												this.setState({ visibleModalExport: true, select: true })
											}; this.hide()
										}}>{L('ExportData')}</a>

									</Row>
								</>
							} trigger={['hover']} >
								<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
							</Popover >
						</Badge>
						{/* } */}
					</Col>
				</Row>
				<Row>
					<Col {...left} >
						<TableDictionaryType
							onChange={this.onChange}
							noscroll={false}
							onDoubleClickRow={this.createOrUpdateModalOpen}
							actionUpdate={this.createOrUpdateModalOpen}
							actionDelete={this.deleteDictionaryType}
							actionChangeStatus={this.changeStatusDictionaryType}
							dictionaryTypeListResult={dictionaryTypeListResult}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalDictionaryType,
								current: this.state.currentPage,
								showTotal: (tot) => (L("tong")) + " " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['4', '10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
					<Col {...right}>
						<CreateOrUpdateDictionaryType
							onCreateUpdateSuccess={this.handleSearch}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false, })}
							dictionaryTypeSelected={this.dictionaryTypeSelected}
						/>
					</Col>
				</Row>
				<ModalExportDictionaryType
					dictionaryTypeListResult={this.state.select == false ? dictionaryTypeListResult : this.listItemSelected}
					visible={this.state.visibleModalExport}
					onCancel={() => this.setState({ visibleModalExport: false, select: false })}
				/>
				<ModalImportExcelDictionaryType
					onRefreshData={this.onRefreshData}
					visible={this.state.visibleModalImport}
					onCancel={() => this.setState({ visibleModalImport: false })}
				/>
			</Card>
		)
	}
}