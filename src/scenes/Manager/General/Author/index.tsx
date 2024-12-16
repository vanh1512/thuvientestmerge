import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { AuthorDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateOrUpdateAuthor from './components/CreateOrUpdateAuthor';
import AppConsts, { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TableAuthor from './components/TableAuthor';
import AuthorInfomation from './components/AuthorInformation';
import ModalExportAuthor from './components/ModalExportAuthor';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import ImportExcelAuthor from './components/ImportExcelAuthor';

const { confirm } = Modal;
export default class Author extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleModalExport: false,
		visibleInfoAuthor: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		au_search: "",
		visibleModalImport: false,
		isButtonMultiExportClick: false,
		numberSelect: 0,
		checkDeleteMulti: false,
		numberSelected: undefined,
		clicked: false,
		select: false,
	};
	authorSelected: AuthorDto = new AuthorDto();
	keySelected: number[] = [];
	listItemSelected: AuthorDto[] = [];
	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.authorStore.getAll(this.state.au_search, this.state.skipCount, undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleModalExport: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: AuthorDto) => {
		if (input !== undefined && input !== null) {
			this.authorSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}

	actionTable = (author: AuthorDto, event: EventTable) => {
		const { totalAuthor } = stores.authorStore
		if (author == undefined || author.au_id == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		let self = this;
		if (event == EventTable.Edit || event == EventTable.RowDoubleClick) {
			if (!this.isGranted(AppConsts.Permission.General_Author_Create)) {
				message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
				return;
			}
			this.createOrUpdateModalOpen(author);
		}
		if (event == EventTable.View) {
			this.authorSelected.init(author);
			this.setState({ visibleInfoAuthor: true });
		}
		else if (event == EventTable.Delete) {
			confirm({
				title: L('WantDelete') + " " + L("Author") + ": " + author.au_name + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalAuthor - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.authorStore.deleteAuthor(author);
					message.success(L("SuccessfullyDeleted"));
					await self.getAll();
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
	};
	deleteAll() {
		let self = this;
		this.setState({ isLoadDone: false });
		confirm({
			title: L("ban_co_chac_muon_xoa_tat_ca"),
			okText: L("Delete"),
			cancelText: L("huy"),
			async onOk() {
				await stores.authorStore.deleteAllAuthor();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });

	}
	onRefreshData = async () => {
		this.setState({ visibleModalImport: false, });
		this.getAll();
	}

	onChangePage = async (page: number, pagesize?: number) => {
		const { authorListResult, totalAuthor } = stores.authorStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalAuthor;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	deleteMulti = async (listIdAuthor: number[]) => {
		if (listIdAuthor.length < 1) {
			await message.error(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			let self = this;
			const { totalAuthor } = stores.authorStore
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalAuthor - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.authorStore.deleteMulti(listIdAuthor);
					await self.getAll();
					self.setState({ isLoadDone: true, numberSelected: 0 });
					message.success(L("xoa_thanh_cong" + "!"))
				},
				onCancel() {
				},
			});
		}
	}

	onChange = (listItemAuthor: AuthorDto[], listIdAuthor: number[]) => {
		this.setState({ isLoadDone: false, })
		this.listItemSelected = listItemAuthor;
		this.keySelected = listIdAuthor;
		this.setState({ isLoadDone: true, numberSelected: listItemAuthor.length });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	handleVisibleChange = (visible) => {
		this.setState({ clicked: visible });
	}
	onVisibleModalExport = () => {
		if (!!this.listItemSelected.length) {
			this.setState({ isButtonMultiExportClick: true, visibleModalExport: true })
		}
		else {
			message.warning(L("hay_chon_hang_muon_xuat_du_lieu"));
		}
	}
	render() {
		const self = this;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);
		const { authorListResult, totalAuthor } = stores.authorStore;

		return (
			<Card>
				<Row gutter={[8, 4]}>
					<Col {...cssColResponsiveSpan(24, 5, 4, 3, 3, 2)} >
						<h2>{L('tac_gia')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 19, 6, 6, 6, 6)} >
						<Input allowClear
							onChange={(e) => this.setState({ au_search: e.target.value.trim() })} placeholder={L('ma_tac_gia') + ", " + L('ho_ten')}
							onPressEnter={this.handleSubmitSearch}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 19, 2, 2, 2, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('tim_kiem')} onClick={() => this.handleSubmitSearch()} >{L('tim_kiem')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 13, 14)} className='textAlign-col-1200'>

						&nbsp;&nbsp;&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.General_Author_Create) &&
							<Button title={L('them_moi_tac_gia')} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new AuthorDto())}>{L('them_moi_tac_gia')}</Button>
						}
						{this.isGranted(AppConsts.Permission.General_Author_Export) &&

							<Button title={L('xuat_du_lieu')} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleModalExport: true, isButtonMultiExportClick: false })}>{L('xuat_du_lieu')}</Button>
						}
						{this.isGranted(AppConsts.Permission.General_Author_Import) &&

							<Button title={L('nhap_du_lieu')} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleModalImport: true })}>{L('nhap_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24} >
						{/* {this.isGranted(AppConsts.Permission.General_Fields_Delete) && */}
						<Badge count={this.state.numberSelected}>
							<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
								<>
									{this.isGranted(AppConsts.Permission.General_Author_Delete) &&
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
											onClick={this.onVisibleModalExport}
										></Button>
										<a style={{ paddingLeft: "10px" }}
											onClick={this.onVisibleModalExport}
										>
											{L('ExportData')}</a>

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
						<TableAuthor
							onChange={this.onChange}
							noscroll={false}
							actionTable={this.actionTable}
							authorListResult={authorListResult}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalAuthor,
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
						{this.state.visibleModalCreateUpdate &&
							<CreateOrUpdateAuthor
								onCreateUpdateSuccess={async () => { await this.getAll(); }}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								authorSelected={this.authorSelected}
							/>}
					</Col>
				</Row>

				<ModalExportAuthor
					authorListResult={this.state.isButtonMultiExportClick ? this.listItemSelected : authorListResult}
					visible={this.state.visibleModalExport}
					onCancel={() => this.setState({ visibleModalExport: false, select: false })}
				/>
				<Modal
					visible={this.state.visibleInfoAuthor}
					closable={false}
					maskClosable={true}
					onCancel={() => { this.setState({ visibleInfoAuthor: false }); }}
					footer={null}
					width={"60vw"}
				>
					<AuthorInfomation
						author_info={this.authorSelected}
						onCancel={() => this.setState({ visibleInfoAuthor: false })}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalImport}
					closable={false}
					maskClosable={true}
					title={L("NHAP_DU_LIEU_TAC_GIA")}
					onCancel={() => { this.setState({ visibleModalImport: false }); }}
					footer={null}
					width={"60vw"}
				>
					<ImportExcelAuthor
						onRefreshData={this.onRefreshData}
						onCancel={() => this.setState({ visibleModalImport: false })}
					/>
				</Modal>
			</Card>
		)
	}
}