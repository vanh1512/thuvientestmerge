import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { Marc21Dto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TableMarc21 from './component/TableMarc21';
import CreateOrUpdateMarc21 from './component/CreateOrUpdateMarc21';
import ModalExportMarc21 from './component/ModalExportMarc21';
import ModalImportMarc21 from './component/ModalImportMarc21';

const { confirm } = Modal;
export default class Marc21 extends AppComponentBase {
	state = {
		isLoadDone: true,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		marc_search: "",
		visibleModalCreateUpdate: false,
		visibleImportExcel: false,
		visibleModalExport: false,
		numberSelected: 0,
		clicked: false,
		select: false,
		isButtonMultiExportClick: false,
	};
	marc21Selected: Marc21Dto = new Marc21Dto();
	keySelected: number[] = [];
	listItemSelected: Marc21Dto[] = [];

	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.marc21Store.getAll(this.state.marc_search, this.state.skipCount, undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleModalExport: false, visibleImportExcel: false });
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: Marc21Dto) => {
		if (input !== undefined && input !== null) {
			this.marc21Selected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}

	actionTable = (mar: Marc21Dto, event: EventTable) => {
		if (mar == undefined || mar.mar_id == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		let self = this;
		if (event == EventTable.Edit || event == EventTable.RowDoubleClick) {
			this.createOrUpdateModalOpen(mar);
		}
		else if (event == EventTable.Delete) {
			const { totalMarc21 } = stores.marc21Store
			confirm({
				title: L('ban_co_chac_muon_xoa') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalMarc21 - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.marc21Store.deleteMarc21(mar);
					await self.getAll();
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
	};
	onChangePage = async (page: number, pagesize?: number) => {
		const { totalMarc21 } = stores.marc21Store;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalMarc21;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	deleteMulti = async (listId: number[]) => {
		if (listId.length < 1) {
			await message.warning(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			let self = this;
			const { totalMarc21 } = stores.marc21Store
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalMarc21 - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.marc21Store.deleteMulti(listId);
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
				await stores.marc21Store.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });
	}

	onRefreshData = () => {
		this.setState({ visibleImportExcel: false });
		this.getAll();
	}
	onChange = (listItemMarc21: Marc21Dto[], listIdMarc21: number[]) => {
		this.setState({ isLoadDone: false, })

		this.listItemSelected = listItemMarc21;
		this.keySelected = listIdMarc21;
		this.setState({ isLoadDone: true, numberSelected: listItemMarc21.length });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	handleVisibleChange = (visible) => {
		this.setState({ clicked: visible });
	}
	render() {

		const self = this;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 12, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 12, 12, 12, 12) : cssCol(0);

		const { totalMarc21, marc21ListResult } = stores.marc21Store;
		return (
			<Card>
				<Row gutter={[16, 16]}>
					<Col {...cssColResponsiveSpan(24, 8, 8, 5, 5, 4)} >
						<h2>{L('kho_mau_marc_21')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 16, 10, 10, 10)} >
						<Input maxLength={AppConsts.maxLength.description} style={{ width: "60%", marginRight: '5px' }} allowClear
							onChange={(e) => this.setState({ marc_search: e.target.value.trim() })} placeholder={L('ma_marc21') + ', ' + L('mo_ta') + '...'}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('tim_kiem')} onClick={() => this.handleSubmitSearch()} >{L('tim_kiem')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 9, 9, 10)} className='textAlign-col-992'>
						{/* { this.isGranted(AppConsts.Permission.General_Author_Create) &&  */}

						<Button style={{ margin: '0 0.5rem 0.5em 0' }} title={L('them_moi')} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new Marc21Dto())}>{L('them_moi')}</Button>
						{/* } */}
						{/* {this.isGranted(AppConsts.Permission.General_Author_Export) && */}

						<Button style={{ margin: '0 0.5rem 0.5em 0' }} title={L('xuat_du_lieu')} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleModalExport: true, isButtonMultiExportClick: false })}>{L('xuat_du_lieu')}</Button>
						{/* } */}
						{/* {this.isGranted(AppConsts.Permission.General_Fields_Import) && */}
						<Button type="primary" icon={<ImportOutlined />} title={L('nhap_du_lieu')} onClick={() => this.setState({ visibleImportExcel: true })}>{L('nhap_du_lieu')}</Button>
						{/* } */}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24} >
						{/* {this.isGranted(AppConsts.Permission.General_Fields_Delete) && */}
						<Badge count={this.state.numberSelected}>
							<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
								<>
									<Row style={{ alignItems: "center" }}>
										<Button
											danger icon={<DeleteFilled />} title={L("xoa_tat_ca")}
											style={{ marginLeft: '10px' }}
											size='small'
											type='primary'
											onClick={() => { this.deleteAll(); this.hide() }}
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
											onClick={() => !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleModalExport: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}

										></Button>
										<a style={{ paddingLeft: "10px" }} 
										onClick={() => !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleModalExport: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}
										>{L('ExportData')}</a>

									</Row>
								</>
							} trigger={['hover']} >
								<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
							</Popover >
						</Badge>
						{/* } */}
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMarc21
							actionTable={this.actionTable}
							onChange={this.onChange}
							marc21ListResult={marc21ListResult}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalMarc21,
								current: this.state.currentPage,
								showTotal: (tot) => (L("Total")) + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => {
									self.onChangePage(page, pagesize)
								}
							}}
						/>
					</Col>
					<Col {...right}>
						{this.state.visibleModalCreateUpdate &&
							<CreateOrUpdateMarc21
								onCreateUpdateSuccess={async () => { await this.getAll(); }}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								marc21Selected={this.marc21Selected}
							/>}
					</Col>
				</Row>

				<ModalExportMarc21
					marc21ListResult={this.state.isButtonMultiExportClick ? this.listItemSelected : marc21ListResult}
					visible={this.state.visibleModalExport}
					onCancel={() => this.setState({ visibleModalExport: false, select: false })}
				/>
				<ModalImportMarc21
					onRefreshData={this.onRefreshData}
					visible={this.state.visibleImportExcel}
					onCancel={() => this.setState({ visibleImportExcel: false })}
				/>
			</Card>
		)
	}
}