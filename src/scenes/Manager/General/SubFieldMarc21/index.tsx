import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { SubFieldMarc21Dto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TableSubFieldMarc21 from './component/TableSubFieldMarc21';
import CreateUpdateSubFieldMarc21 from './component/CreateUpdateSubFieldMarc21';
import ModalExportSubFieldMarc21 from './component/ModalExportSubFieldMarc21';
import SelectedMARC21 from '@src/components/Manager/SelectedMARC21';
import ModalImportSubfieldMarc21 from './component/ModalImportSubfieldMarc21';


const { confirm } = Modal;
export default class SubFieldMarc21 extends AppComponentBase {
	state = {
		isLoadDone: true,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		sub_search: undefined,
		mar_id: undefined,
		visibleModalCreateUpdate: false,
		visibleModalExport: false,
		visibleImportExcel: false,
		numberSelected: 0,
		clicked: false,
		isButtonMultiExportClick: false,
	};
	subFieldMarc21Selected: SubFieldMarc21Dto = new SubFieldMarc21Dto();
	keySelected: number[] = [];
	listItemSelected: SubFieldMarc21Dto[] = [];

	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.subFieldMarc21Store.getAll(this.state.mar_id, this.state.sub_search, this.state.skipCount, this.state.pageSize);
		await stores.marc21Store.getAll(undefined, undefined, undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleModalExport: false });
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: SubFieldMarc21Dto) => {
		if (input !== undefined && input !== null) {
			this.subFieldMarc21Selected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}

	actionTable = (sub: SubFieldMarc21Dto, event: EventTable) => {
		if (sub === undefined || sub.mar_id === undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		let self = this;
		if (event === EventTable.Edit || event === EventTable.RowDoubleClick) {
			this.createOrUpdateModalOpen(sub);
		}
		else if (event === EventTable.Delete) {
			const { totalSubFieldMarc21 } = stores.subFieldMarc21Store
			confirm({
				title: L('ban_co_chac_muon_xoa') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalSubFieldMarc21 - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.subFieldMarc21Store.deleteSubFieldMarc21(sub.sub_id);
					await self.getAll();
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
	};
	onChangePage = async (page: number, pagesize?: number) => {
		const { totalSubFieldMarc21 } = stores.subFieldMarc21Store;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalSubFieldMarc21;
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
			const { totalSubFieldMarc21 } = stores.subFieldMarc21Store
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalSubFieldMarc21 - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.subFieldMarc21Store.deleteMulti(listId);
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
				await stores.subFieldMarc21Store.deleteAll();
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
	clearSearch = async () => {
		await this.setState({
			sub_search: undefined,
			mar_id: undefined,
		});
		this.getAll();
	}
	onChange = (listItemSubField: SubFieldMarc21Dto[], listIdSubField: number[]) => {
		this.setState({ isLoadDone: false, })
		this.listItemSelected = listItemSubField;
		this.keySelected = listIdSubField;
		this.setState({ isLoadDone: true, numberSelected: listItemSubField.length });
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

		const { totalSubFieldMarc21, subFieldMarc21ListResult } = stores.subFieldMarc21Store;
		return (
			<Card>
				<Row gutter={[8, 8]} >
					<Col {...cssCol(7)} >
						<h2>{L('truong_con_kho_mau_marc21')}</h2>
					</Col>
					<Col {...cssCol(17)} style={{ textAlign: 'right' }}>

						{/* { this.isGranted(AppConsts.Permission.General_Author_Create) &&  */}
						<Button title={L("them_moi")} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new SubFieldMarc21Dto())}>{L('them_moi')}</Button>
						{/* } */}

						{/* {this.isGranted(AppConsts.Permission.General_Author_Export) && */}

						<Button title={L("xuat_du_lieu")} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleModalExport: true, isButtonMultiExportClick: false })}>{L('xuat_du_lieu')}</Button>
						{/* } */}
						<Button title={L("nhap_du_lieu")} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportExcel: true })}>{L('nhap_du_lieu')}</Button>

					</Col>
				</Row>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)} >
						<strong>{L('ma_truong_con')} , {L('mo_ta')}</strong>&nbsp;&nbsp;
						<Input allowClear
							value={this.state.sub_search}
							onChange={(e) => this.setState({ sub_search: e.target.value.trim() })} placeholder={L('nhap_tim_kiem')}
							onPressEnter={this.handleSubmitSearch}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)} >
						<strong>{L('ma_marc21')}</strong>&nbsp;&nbsp;
						<SelectedMARC21 selected_marc21={this.state.mar_id} onChangeMARC21={(value: number) => this.setState({ mar_id: value })} />
					</Col>
					<Col style={{ textAlign: "center" }} {...cssColResponsiveSpan(24, 12, 12, 2, 2, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('tim_kiem')} onClick={() => this.handleSubmitSearch()} >{L('tim_kiem')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)} >
						{(this.state.sub_search != undefined || this.state.mar_id != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
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
											type='primary'
											danger icon={<DeleteFilled />} title={L("xoa_tat_ca")}
											style={{ marginLeft: '10px' }}
											size='small'
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
										>
											{L('ExportData')}
										</a>

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
						<TableSubFieldMarc21
							noscroll={false}
							onChange={this.onChange}
							actionTable={this.actionTable}
							subFieldMarc21ListResult={subFieldMarc21ListResult}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalSubFieldMarc21,
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
							<CreateUpdateSubFieldMarc21
								onCreateUpdateSuccess={async () => { await this.getAll(); }}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								subFieldMarc21Selected={this.subFieldMarc21Selected}
							/>}
					</Col>
				</Row>

				<ModalExportSubFieldMarc21
					subFieldMarc21ListResult={this.state.isButtonMultiExportClick ? this.listItemSelected : subFieldMarc21ListResult}
					visible={this.state.visibleModalExport}
					onCancel={() => this.setState({ visibleModalExport: false, select: false })}
				/>

				<ModalImportSubfieldMarc21
					onRefreshData={this.onRefreshData}
					visible={this.state.visibleImportExcel}
					onCancel={() => this.setState({ visibleImportExcel: false })}
				/>
			</Card>
		)
	}
}