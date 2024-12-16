import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { FieldsDto, ICreateFieldsInput, UpdatePositionFieldInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateFields from './components/CreateOrUpdateFields';
import TableMainFields from './components/TableMainFields';
import ModalExportFields from './components/ModalExportFields';
import ModalImportField from './components/ModalImportField';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
const { confirm } = Modal;

export default class Fields extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelFields: false,
		visibleImportExcelFields: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		fie_search: "",
		numberSelected: 0,
		checkDeleteMulti: false,
		isLoadTable: false,
		clicked: false,
		select: false,
		isButtonMultiExportClick: false,
	};
	fieldsSelected: FieldsDto = new FieldsDto();
	keySelected: number[] = [];
	listItemSelected: FieldsDto[] = [];
	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.fieldsStore.getAll(this.state.fie_search, this.state.skipCount, undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelFields: false, isLoadTable: !this.state.isLoadTable });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: ICreateFieldsInput) => {
		if (input !== undefined && input !== null) {
			this.fieldsSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}

	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	onDoubleClickRow = (value: FieldsDto) => {
		if (!this.isGranted(AppConsts.Permission.General_Fields_Edit)) {
			message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
			return;
		}
		if (value == undefined || value.fie_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.fieldsSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalFields } = stores.fieldsStore;

		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalFields;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	actionTable = (fields: FieldsDto, event: EventTable) => {
		if (fields == undefined || fields.fie_id == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		if (event == EventTable.Edit || event == EventTable.RowDoubleClick) {
			this.createOrUpdateModalOpen(fields);
		}
	}

	deleteFields = (fields: FieldsDto) => {
		let self = this;
		const { totalFields } = stores.fieldsStore
		confirm({
			title: L('WantDelete') + " " + L("Fields") + ": " + fields.fie_name + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalFields - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.fieldsStore.deleteFields(fields);
				message.success(L("xoa_thanh_cong" + "!"))
				await self.getAll();
			},
			onCancel() {

			},
		});
	}

	onRefreshData = () => {
		this.setState({ visibleImportExcelFields: false });
		this.getAll();
	}

	deleteMulti = async (listIdField: number[]) => {
		if (this.state.numberSelected < 1) {
			await message.error(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			let self = this;
			const { totalFields } = stores.fieldsStore
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalFields - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.fieldsStore.deleteMulti(listIdField);
					await self.getAll();
					self.setState({ isLoadDone: true, numberSelected: 0, checkDeleteMulti: false });
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
				await stores.fieldsStore.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });
	}
	onChangeSelect = (listItemField: FieldsDto[], listIdField: number[]) => {
		this.setState({ isLoadDone: false });
		this.listItemSelected = listItemField;
		this.keySelected = listIdField;
		listItemField.length == 0 ? this.setState({ checkDeleteMulti: false }) : this.setState({ checkDeleteMulti: true })
		this.setState({ isLoadDone: true, numberSelected: listItemField.length });
	}

	onChangePosition = async (listItem: FieldsDto[]) => {
		if (listItem != undefined && listItem.length > 0) {
			this.setState({ isLoadDone: false });
			let updateInput = new UpdatePositionFieldInput();
			updateInput.fieldIDChangedList = listItem.map(item => item.fie_id);
			await stores.fieldsStore.changePotistion(updateInput);
			this.setState({ isLoadDone: true });
		}
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
		const { fieldsListResult, totalFields } = stores.fieldsStore;

		return (
			<Card>
				<Row gutter={[8, 4]}>
					<Col {...cssColResponsiveSpan(24, 8, 8, 5, 4, 4)} >
						<h2>{L('DocumentField')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 16, 10, 8, 8)} >
						<Input
							style={{ width: '60%', marginRight: '5px' }} allowClear
							onChange={(e) => this.setState({ fie_search: e.target.value.trim() })} placeholder={L("FieldName") + ", " + L("ma")}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 12, 12)} className='textAlign-col-1200'>
						{this.isGranted(AppConsts.Permission.General_Fields_Create) &&
							<Button title={L("AddNew")} style={{ margin: '0 10px 0 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new FieldsDto())}>{L('AddNew')}</Button>
						}
						{this.isGranted(AppConsts.Permission.General_Fields_Export) &&
							<Button title={L("ExportData")} style={{ margin: '0 10px 0 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelFields: true, isButtonMultiExportClick: false })}>{L('ExportData')}</Button>
						}
						{this.isGranted(AppConsts.Permission.General_Fields_Import) &&
							<Button title={L("nhap_du_lieu")} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportExcelFields: true })}>{L('nhap_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24} >
						{this.isGranted(AppConsts.Permission.General_Fields_Delete) &&
							<Badge count={this.state.numberSelected}>
								<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
									<>
										{this.isGranted(AppConsts.Permission.General_Fields_Delete) &&
											<Row style={{ alignItems: "center" }}>
												<Button
													danger icon={<DeleteOutlined />} title={L("xoa_tat_ca")}
													style={{ marginLeft: '10px' }}
													size='small'
													type='primary'
													onClick={() => { this.deleteAll(); this.hide() }}
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
												onClick={() => { !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelFields: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu")) }}
											></Button>
											<a style={{ paddingLeft: "10px" }}
												onClick={() => !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelFields: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}
											>{L('ExportData')}</a>
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
						<TableMainFields
							onChangeSelect={this.onChangeSelect}
							actionTable={this.actionTable}
							onDoubleClickRow={this.onDoubleClickRow}
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							deleteFields={this.deleteFields}
							onChangePosition={(listItem: FieldsDto[]) => this.onChangePosition(listItem)}
							fieldsListResult={fieldsListResult}
							hasAction={true}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalFields,
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
						{this.state.visibleModalCreateUpdate &&
							<CreateOrUpdateFields
								// onCreateUpdateSuccess={async () => { await this.getAll(); }}
								onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								fieldsSelected={this.fieldsSelected}
							/>}
					</Col>
				</Row>
				<ModalExportFields
					fieldsListResult={this.state.isButtonMultiExportClick ? this.listItemSelected : fieldsListResult}
					visible={this.state.visibleExportExcelFields}
					onCancel={() => this.setState({ visibleExportExcelFields: false, select: false })}
				/>
				<ModalImportField
					onRefreshData={this.onRefreshData}
					visible={this.state.visibleImportExcelFields}
					onCancel={() => this.setState({ visibleImportExcelFields: false })}
				/>
			</Card>
		)
	}
}