import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { PublisherDto, ICreatePublisherInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdatePublisher from './components/CreateOrUpdatePublisher';
import TableMainPublisher from './components/TableMainPublisher';
import ModalExportPublisher from './components/ModalExportPublisher';
import ImportExcelPublisher from './components/ImportExcelPublisher';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

const { confirm } = Modal;

export default class Publisher extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelPublisher: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		pu_search: "",
		pu_name: "",
		importPublisher: false,
		numberSelected: 0,
		checkDeleteMulti: false,
		clicked: false,
		select: false,
		isButtonMultiExportClick: false,
	};
	publisherSelected: PublisherDto = new PublisherDto();
	keySelected: number[] = [];
	listItemPublisher: PublisherDto[] = [];
	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.publisherStore.getAll(
			this.state.pu_search,
			this.state.skipCount,
			undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelPublisher: false, });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: ICreatePublisherInput) => {
		if (input !== undefined && input !== null) {
			this.publisherSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	onDoubleClickRow = (value: PublisherDto) => {
		if (value == undefined || value.pu_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.General_Publisher_Edit)) {
			message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
			return;
		}
		this.publisherSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalPublisher } = stores.publisherStore;

		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalPublisher;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	deletePublisher = (publisher: PublisherDto) => {
		let self = this;
		const { totalPublisher } = stores.publisherStore
		confirm({
			title: L('WantDelete') + " " + L("Publisher") + ": " + publisher.pu_name + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalPublisher - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.publisherStore.deletePublisher(publisher);
				await self.getAll();
				message.success(L("SuccessfullyDeleted"))
			},
			onCancel() {

			},
		});
	}
	deleteAll() {
		let self = this;
		this.setState({ isLoadDone: false });
		confirm({
			title: L("ban_co_chac_muon_xoa_tat_ca"),
			okText: L("Delete"),
			cancelText: L("huy"),
			async onOk() {
				await stores.publisherStore.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });
	}
	onRefreshData = async () => {
		this.setState({ importPublisher: false, });
		this.getAll();
	}
	deleteMulti = async (listIdPublisher: number[]) => {
		if (this.state.numberSelected < 1) {
			await message.warning(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			let self = this;
			const { totalPublisher } = stores.publisherStore
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalPublisher - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.publisherStore.deleteMulti(listIdPublisher);
					await self.getAll();
					self.setState({ isLoadDone: true, numberSelected: 0, checkDeleteMulti: false });
					message.success(L("xoa_thanh_cong" + "!"))
				},
				onCancel() {
				},
			});
		}
	}
	onChange = (listItemPublisher: PublisherDto[], listIdPublisher: number[]) => {
		this.setState({ isLoadDone: false });
		if (listItemPublisher.length > 0) {
			this.listItemPublisher = listItemPublisher;
			this.keySelected = listIdPublisher;
		}
		listItemPublisher.length == 0 ? this.setState({ checkDeleteMulti: false }) : this.setState({ checkDeleteMulti: true })
		this.setState({ isLoadDone: true, numberSelected: listItemPublisher.length });
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
		const { publisherListResult, totalPublisher } = stores.publisherStore;

		return (
			<Card>
				<Row gutter={[8, 4]}>
					<Col {...cssColResponsiveSpan(24, 10, 8, 5, 4, 4)} >
						<h2>{L('Publisher')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 16, 10, 8, 8)} >
						<Input
							style={{ width: '50%', marginRight: '5px' }} allowClear
							onChange={(e) => this.setState({ pu_search: e.target.value })} placeholder={L("PublisherName") + '...'}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>

					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 12, 12)} className='textAlign-col-1200'>
						{this.isGranted(AppConsts.Permission.General_Publisher_Create) &&
							<Button title={L("AddNew")} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new PublisherDto())}>{L('AddNew')}</Button>
						}
						{this.isGranted(AppConsts.Permission.General_Publisher_Export) &&
							<Button title={L("ExportData")} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelPublisher: true, isButtonMultiExportClick: false })}>{L('ExportData')}</Button>
						}

						{this.isGranted(AppConsts.Permission.General_Publisher_Import) &&
							<Button title={L("nhap_du_lieu")} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ importPublisher: true })}>{L('nhap_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24}>
						{this.isGranted(AppConsts.Permission.General_Publisher_Delete) &&
							<Badge count={this.state.numberSelected}>
								<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
									<>
										{this.isGranted(AppConsts.Permission.General_Publisher_Delete) &&
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
												onClick={() => !!this.listItemPublisher.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelPublisher: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}

											></Button>
											<a style={{ paddingLeft: "10px" }}
												onClick={() => !!this.listItemPublisher.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelPublisher: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}
											>
												{L('ExportData')}
											</a>

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
						<TableMainPublisher
							noscroll={false}
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							deletePublisher={this.deletePublisher}
							onChange={this.onChange}
							publisherListResult={publisherListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalPublisher,
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
							<CreateOrUpdatePublisher
								onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								publisherSelected={this.publisherSelected}
							/>}
					</Col>
				</Row>

				<ModalExportPublisher
					publisherListResult={this.state.isButtonMultiExportClick ? this.listItemPublisher : publisherListResult}
					visible={this.state.visibleExportExcelPublisher}
					onCancel={() => this.setState({ visibleExportExcelPublisher: false, select: false })}
				/>
				<Modal
					visible={this.state.importPublisher}
					closable={false}
					maskClosable={false}
					onCancel={() => { this.setState({ importPublisher: false }); }}
					footer={null}
					width={"60vw"}
				// title="NHẬP DỮ LIỆU NHÀ XUẤT BẢN"
				>
					<ImportExcelPublisher
						onRefreshData={this.onRefreshData}
						onCancel={() => this.setState({ importPublisher: false, })}
					/>
				</Modal>
			</Card>
		)
	}
}