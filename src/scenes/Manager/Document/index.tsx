 import * as React from 'react';
import { Col, Row, Button, Card, Modal, message, Popover, Tag, Badge, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { DocumentDto, DocumentInforDto, ItemDocument, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CaretDownOutlined, DeleteFilled, DeleteOutlined, EditOutlined, ExportOutlined, EyeOutlined, ImportOutlined, PlusOutlined, SnippetsOutlined, SubnodeOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import TableMainDocument from './components/TableMainDocument';
import ModalExportDoccument from './components/ModalExportDocument';
import SearchDoccument, { SearchDocumentOutput } from './components/SearchDocument';
import DocumentInfor from '../DocumentInfor';
import moment from 'moment';
import { eDocumentBorrowType, eDocumentSort, eDocumentStatus, valueOfeDocumentBorrowType, valueOfeDocumentStatus } from '@src/lib/enumconst';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import DetailDocument from './components/DetailDocument';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SorterResult, TableRowSelection } from 'antd/lib/table/interface';
import TabCreateUpdateDocumentDocumentInfor from './TabDocumentInfor';
import ModalImportDocument from './components/ModalImportDocument';
import ModalCreateOrUpdateMultiCitation from './components/ModalCreateMultiCitation';


const TableDocumentColumns: ColumnsDisplayType<any> = [

	{ title: L('DocumentName'), sorter: true, displayDefault: true, dataIndex: 'do_title', key: 'do_title', className: 'no-print', fixed: "left", render: (text: string, item: DocumentDto) => <div>{item.do_title}</div> },
	{ title: L('Author'), displayDefault: true, key: 'do_author', render: (text: string, item: DocumentDto) => <div>{stores.sessionStore.getNameAuthor(item.au_id_arr)}</div> },
	{ title: L('AvailableDate'), sorter: true, displayDefault: true, dataIndex: 'do_date_available', key: 'do_date_available', render: (text: string, item: DocumentDto) => <div>{moment(item.do_date_available).format("DD/MM/YYYY")}</div> },
	{ title: L('so_luong'), sorter: true, displayDefault: true, dataIndex: 'do_total_book_valid', key: 'do_total_book_valid', render: (text: string, item: DocumentDto) => <div>{item.do_total_book_valid}</div> },
	{ title: L('YearOfPublication'), sorter: true, displayDefault: true, dataIndex: 'do_date_publish', key: 'do_date_publish', render: (text: string, item: DocumentDto) => <div>{moment(item.do_date_publish).format("YYYY")}</div> },
	{ title: L('RepublishedTimes'), sorter: true, displayDefault: false, dataIndex: 'do_republish', className: 'no-print', key: 'do_republish', render: (text: string, item: DocumentDto) => <div>{item.do_republish}</div> },
	{ title: L('Identifier'), displayDefault: true, key: 'do_identifier', className: 'no-print', render: (text: string, item: DocumentDto) => <div>{item.do_identifier}</div> },
	{ title: L('Translator'), displayDefault: true, key: 'do_translator', render: (text: string, item: DocumentDto) => <div>{item.do_translator}</div> },
	{ title: L('Description'), displayDefault: false, key: 'do_abstract', render: (text: string, item: DocumentDto) => <div dangerouslySetInnerHTML={{ __html: item.do_abstract! }}></div> },
	{ title: L('Publisher'), displayDefault: true, key: 'pu_id', render: (text: string, item: DocumentDto) => <div>{item.pu_id.name}</div> },
	{ title: L('Language'), displayDefault: true, key: 'language', render: (text: string, item: DocumentDto) => <div>{stores.sessionStore.getNameLanguage(item.do_language_iso)}</div> },
	{ title: L('Topic'), displayDefault: true, key: 'to_id', className: 'no-print', render: (text: string, item: DocumentDto) => <div>{stores.sessionStore.getNameTopic(item.to_id)}</div> },
	{ title: L('Category'), displayDefault: true, key: 'ca_id', className: 'no-print', render: (text: string, item: DocumentDto) => <div>{stores.sessionStore.getNameCategory(item.ca_id)}</div> },
	{ title: L('Status'), displayDefault: false, key: 'do_status', className: 'no-print', render: (text: string, item: DocumentDto) => <div>{valueOfeDocumentStatus(item.do_status)}</div> },
	{
		title: L('BorrowStatus'), displayDefault: false,
		key: 'do_in_status',
		render: (text: string, item: DocumentDto) => {
			return <div>
				{item.do_borrow_status == eDocumentBorrowType.Deny.num && <Tag color='red'>{valueOfeDocumentBorrowType(item.do_borrow_status)}</Tag>}
				{item.do_borrow_status == eDocumentBorrowType.OfflineAndOnline.num && <Tag color='green'>{valueOfeDocumentBorrowType(item.do_borrow_status)}</Tag>}
				{item.do_borrow_status == eDocumentBorrowType.Online.num && <Tag color='blue'>{valueOfeDocumentBorrowType(item.do_borrow_status)}</Tag>}
			</div>

		}
	},
	{ title: L('Price'), displayDefault: false, key: 'do_price', render: (text: string, item: DocumentDto) => <div>{item.do_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div> },
];



export interface IProps {
	is_create?: boolean;
	is_Selected?: boolean;
	onChooseDocument?: (listItemDocument: ItemDocument[]) => void;
}
const { confirm } = Modal;
export default class Document extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalReadDocument: false,
		visibleModalCreateUpdate: false,
		visibleExportExcelDoccument: false,
		visibleExportExcelDoccumentMulti: false,
		visibleImportExcel: false,
		visibleDocumentInfo: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		sort: undefined,
		do_id: undefined,
		clicked: false,
		checkTab: false,
		visibleModalCreateOrUpdateMultiCitation: false,
	};
	doSelectedIdNumber: number[] = [];
	doSelectedList: DocumentDto[] = [];
	action: any = {
		title: "", displayDefault: true, key: 'action_Doccument', className: "no-print center", fixed: "right", children: [], width: 50,
		render: (text: string, item: DocumentDto) => (
			<Popover visible={this.state.clicked && this.state.do_id == item.do_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
				{this.state.clicked && this.state.do_id == item.do_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
			</Popover >
		)
	}
	documentSelected: DocumentDto = new DocumentDto();
	listColumnDisplay: ColumnsDisplayType<any> = [];
	listColumnDisplaySelected: ColumnsDisplayType<any> = [];
	selectedField: string;
	listDocumentInfo: DocumentInforDto[];
	searchOuput: SearchDocumentOutput = new SearchDocumentOutput();
	componentRef: any | null = null;
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		if (this.props.is_create == false) {
			this.searchOuput.do_status = eDocumentStatus.In.num;
		}
		await this.getAll();
		this.listColumnDisplay = TableDocumentColumns;
		this.listColumnDisplay.unshift({
			title: L('N.O'), allowSort: true, displayDefault: true, key: 'do_created_at', width: 50, fixed: "left", render: (text: string, item: DocumentDto, index: number) => <div>{this.state.pageSize! * (this.state.currentPage! - 1) + (index + 1)}</div>,
		});
		{
			this.isGranted(AppConsts.Permission.Document_Document_Detail ||
				AppConsts.Permission.Document_Document_Edit ||
				AppConsts.Permission.Document_Document_Delete) &&

				this.addAction()
		}
		this.setState({ isLoadDone: true });
	}
	handleVisibleChange = (visible, item: DocumentDto) => {
		this.setState({ clicked: visible, do_id: item.do_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}

	content = (item: DocumentDto) => (
		<div >
			{this.isGranted(AppConsts.Permission.Document_Document_Detail) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EyeOutlined />} title={L('SeeDetails')}
						style={{ marginLeft: '10px', marginTop: "5px", textAlign: 'center' }}
						size='small'
						onClick={() => this.viewModelDocument(item!)}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.viewModelDocument(item!); this.hide() }}>{L("SeeDetails")}</a>
				</Row>)
			}
			{this.isGranted(AppConsts.Permission.Document_Document_Edit) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EditOutlined />} title={L('Edit')}
						style={{ marginLeft: '10px', marginTop: "5px", textAlign: 'center' }}
						size='small'
						onClick={() => this.createOrUpdateModalOpen(item!)}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.createOrUpdateModalOpen(item!); this.hide() }}>{L("Edit")}</a>
				</Row>)
			}
			<Row style={{ alignItems: "center" }}>
				<Button
					type="primary"
					icon={<SubnodeOutlined />} title={L('trich_dan')}
					style={{ marginLeft: '10px', marginTop: "5px", textAlign: 'center' }}
					size='small'
					onClick={() => this.openModalCitation(item!)}
				></Button>
				<a style={{ paddingLeft: "10px", color: "" }} onClick={() => { this.openModalCitation(item!); this.hide() }}>{L("trich_dan")}</a>
			</Row>

			{this.isGranted(AppConsts.Permission.Document_Document_Detail) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<SnippetsOutlined />} title={L('ViewTheDocument')}
						style={{ marginLeft: '10px', marginTop: "5px", textAlign: 'center' }}
						size='small'
						onClick={() => this.getDocumentInfo(item!)}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.getDocumentInfo(item!); this.hide() }}>{L("ViewTheDocument")}</a>
				</Row>)
			}
			{this.isGranted(AppConsts.Permission.Document_Document_Delete) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')}
						style={{ marginLeft: '10px', marginTop: "5px", textAlign: 'center' }}
						size='small'
						onClick={() => this.deleteDoccument(item)}
					></Button>
					<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteDoccument(item!); this.hide() }}>{L("Delete")}</a>
				</Row>)
			}


		</div>
	)
	addAction = () => {

		if (this.listColumnDisplay.find(item => item.key == "action_Doccument") == undefined) {
			this.listColumnDisplay.push(this.action);
		}
		else {
			this.listColumnDisplaySelected.push(this.action);
		}
	}
	componentWillUnmount() {
		this.listColumnDisplay.pop();
		this.listColumnDisplay.shift();
	}
	changeColumnsDisplay = async (values) => {
		this.setState({ isLoadDone: false });
		let a: any = [
			{
				title: L('DocumentName'), sorter: true, displayDefault: true, dataIndex: 'do_title',
				key: 'do_title', className: 'no-print', fixed: "left", render: (text: string, item: DocumentDto) => <div>{item.do_title}</div>
			},
			{ title: L('N.O'), displayDefault: true, fixed: 'left', key: 'do_created_at', width: 50, render: (text: string, item: DocumentDto, index: number) => <div>{this.state.pageSize! * (this.state.currentPage! - 1) + (index + 1)}</div>, },
		];
		this.listColumnDisplaySelected = values;
		a.map(item => this.listColumnDisplaySelected.unshift(item));
		this.listColumnDisplaySelected.push(this.action);
		await this.getAll();
		this.setState({ isLoadDone: true });
	}
	changeColumnSort = async (sort: SorterResult<DocumentDto> | SorterResult<DocumentDto>[]) => {
		this.setState({ isLoadDone: false });
		this.selectedField = sort['field'];
		let order = eDocumentSort.ASC.num;
		if (sort['order'] == "descend") order = eDocumentSort.DES.num
		await this.setState({ sort: order })
		await this.getAll();
		this.setState({ isLoadDone: true });

	}
	onChooseDocument = (listItemDocument: ItemDocument[]) => {
		if (!!this.props.onChooseDocument) {
			this.props.onChooseDocument(listItemDocument);
		}
	}

	onSubmitDataSearchDoccument = async (input: SearchDocumentOutput, isReloadPage: boolean) => {
		if (isReloadPage == true) {
			await this.setState({ skipCount: 0 });
			this.onChangePage(1, this.state.pageSize);
		}
		this.searchOuput = input;
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.documentStore.getAll(
			this.searchOuput.do_title,
			this.searchOuput.do_date_publish,
			this.searchOuput.do_identifier,
			this.searchOuput.to_id,
			this.searchOuput.ca_id,
			this.searchOuput.author,
			this.searchOuput.do_status,
			this.searchOuput.do_borrow_status,
			this.searchOuput.do_date_available,
			this.selectedField,
			this.state.sort,
			this.state.skipCount,
			undefined
		);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelDocumentInfor: false });
	}

	viewModelDocument = (item: DocumentDto) => {
		this.setState({ isLoadDone: false, });
		this.documentSelected = item;
		this.setState({ isLoadDone: true, visibleModalReadDocument: true });
	}

	createOrUpdateModalOpen = async (input: DocumentDto) => {
		this.documentSelected = input;
		await this.setState({ visibleModalCreateUpdate: true, checkTab: false });
	}

	openModalCitation = async (input: DocumentDto) => {
		this.documentSelected = input;
		await this.setState({ visibleModalCreateUpdate: true, checkTab: true });
	}
	onCreateUpdateSuccess = async () => {
		this.setState({});
		await this.setState({ visibleModalCreateUpdate: false, visibleModalCreateOrUpdateMultiCitation: false });
		await this.getAll();
		this.doSelectedIdNumber = [];
		this.rowSelection.selectedRowKeys = [];
		this.setState({ isLoadDone: true, });
	}

	onDoubleClickRow = (value: DocumentDto) => {
		if (value == undefined || value.do_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.Document_Document_Edit)) {
			message.error(L("ban_khong_the_thuc_hien_thao_tac_nay"));
			return;
		}
		this.documentSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	deleteDoccument = async (doccument: DocumentDto) => {
		let self = this;
		confirm({
			title: L('WantDelete') + " " + L('document') + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				await stores.documentStore.deleteDocument(doccument);
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() {
			},
		});
	}

	onChangePage = async (page: number, pagesize?: number) => {
		const { totaldocument } = stores.documentStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totaldocument;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	getDocumentInfo = async (item: DocumentDto) => {
		this.documentSelected = item;
		await this.setState({ visibleDocumentInfo: true });
	}

	onOpenModalExport = () => {
		this.listColumnDisplaySelected.pop();

		this.setState({ visibleExportExcelDoccument: true });
	}
	onOpenModalExportMulti = () => {
		this.listColumnDisplaySelected.pop();
		if (this.doSelectedList.length > 0) {
			this.setState({ visibleExportExcelDoccumentMulti: true });
		}
		else { message.warning(L("hay_chon_1_hang_truoc_khi_xuat")) }
	}
	onRefreshData = () => {
		this.setState({ visibleImportExcel: false });
		this.getAll();
	}
	deleteMulti = async (list_num: number[]) => {
		let self = this;
		if (list_num.length > 0) {
			confirm({
				title: L('WantDelete') + " " + L("All") + " " + L('document') + "?",
				okText: L('Confirm'),
				cancelText: L('Cancel'),
				async onOk() {

					self.setState({ isLoadDone: false });
					await stores.documentStore.deleteMulti(list_num);
					await self.getAll();

					self.doSelectedList = [];
					self.setState({ isLoadDone: true, });
				},
				onCancel() {
				},
			});
		}
		else await message.warning(L("hay_chon_1_hang_truoc_khi_xoa"));

	}
	onCancelModal = () => {
		this.setState({ isLoadDone: false });
		this.addAction();
		// this.rowSelection.selectedRowKeys = []
		// this.doSelectedIdNumber = [];
		this.setState({ isLoadDone: true, visibleExportExcelDoccumentMulti: false })

	}
	rowSelection: TableRowSelection<DocumentDto> = {
		onChange: (listIdDocument: React.Key[], listItem: DocumentDto[]) => {
			this.setState({ isLoadDone: false });
			this.doSelectedIdNumber = listItem.map(item => item.do_id);
			this.doSelectedList = listItem;
			this.setState({ isLoadDone: true })
		}
	}

	render() {
		const self = this;
		const { documentListResult, totaldocument } = stores.documentStore;
		return (
			<Card>
				{this.state.visibleModalCreateUpdate == true ?
					<>
						<Row gutter={16}>
							<Col span={24}>
								<TabCreateUpdateDocumentDocumentInfor
									checkTab={this.state.checkTab}
									onCreateUpdateSuccess={this.onCreateUpdateSuccess}
									onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
									documentSelected={this.documentSelected}
									findCitation={this.openModalCitation}
								/>
							</Col>
						</Row>
					</>
					:
					<>
						<Row style={this.props.is_create == false ? { display: "none" } : {}} gutter={16}>
							<Col span={12} >
								<h2>{L('Document')}</h2>
							</Col>
							<Col span={12} style={{ textAlign: "right" }}>

								{
									this.isGranted(AppConsts.Permission.Document_Document_Create) &&
									<Button style={{ margin: '0 0.5rem 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new DocumentDto())}>{L('CreateNew')}</Button>
								}
								{
									this.isGranted(AppConsts.Permission.Document_Document_Export) &&
									<Button style={{ margin: '0 0.5rem 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={this.onOpenModalExport}>{L('ExportData')}</Button>
								}
								<Button type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportExcel: true })}>{L('nhap_du_lieu')}</Button>
								{this.state.visibleExportExcelDoccument &&
									<ModalExportDoccument onCancel={() => { this.setState({ visibleExportExcelDoccument: false }); }} visible={this.state.visibleExportExcelDoccument} doccumentListResult={documentListResult} listColumnDisplay={this.listColumnDisplaySelected} />
								}
							</Col>
						</Row>

						<SearchDoccument
							isCheck={this.props.is_create}
							listColumn={this.listColumnDisplay}
							doListNum={this.doSelectedIdNumber}
							onChangeColumn={this.changeColumnsDisplay}
							onSubmitDataSearchDoccument={(value, isReloadPage) => this.onSubmitDataSearchDoccument(value, isReloadPage)}

						/>
						<Row>
							<Col span={12} style={this.props.is_create == false ? { display: "none" } : {}}>
								<Popover
									placement='rightBottom'
									content={(<>
										<Row style={{ alignItems: "center" }}>
											<Button
												icon={<ExportOutlined />} title={L("xuat_du_lieu")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => { this.onOpenModalExportMulti() }}
												type='primary'
											></Button>
											<a style={{ paddingLeft: "10px" }} onClick={() => { this.onOpenModalExportMulti() }}>{L('xuat_du_lieu')}</a>
										</Row>
										<Row style={{ alignItems: "center", marginTop: "10px" }}>
											<Button
												icon={<SubnodeOutlined />} title={L("trich_dan")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => this.setState({ visibleModalCreateOrUpdateMultiCitation: true })}
												type='primary'
											></Button>
											<a style={{ paddingLeft: "10px" }} onClick={() => this.setState({ visibleModalCreateOrUpdateMultiCitation: true })}>{L('trich_dan')}</a>
										</Row>
										<Row style={{ alignItems: "center", marginTop: "10px" }}>
											<Button
												danger icon={<DeleteOutlined />} title={L("Delete")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => this.deleteMulti(this.doSelectedIdNumber)}
												type='primary'
											></Button>
											<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => this.deleteMulti(this.doSelectedIdNumber)}>{L('Delete')}</a>
										</Row>
									</>)}
									trigger="hover">
									<Badge count={this.doSelectedIdNumber.length} >
										<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
									</Badge>
								</Popover>
							</Col>
						</Row>
						<Row style={{ marginTop: '10px' }}>
							<Col span={24}>
								<TableMainDocument
									noscroll={this.listColumnDisplaySelected.length == 3}
									ref={this.setComponentRef}
									rowSelect={this.rowSelection}
									onDoubleClickRow={this.onDoubleClickRow}
									changeColumnSort={this.changeColumnSort}
									doccumentListResult={documentListResult}
									listColumnDisplay={this.listColumnDisplaySelected}
									onChooseDocument={this.props.is_Selected ? this.onChooseDocument : undefined}
									isLoadDone={this.state.isLoadDone}
									doIdSelected={this.documentSelected.do_id}
									pagination={{
										pageSize: this.state.pageSize,
										total: totaldocument,
										current: this.state.currentPage,
										showTotal: (tot) => L("Total") + ": " + tot + "",
										showQuickJumper: true,
										showSizeChanger: true,
										pageSizeOptions: ['10', '20', '50', '100', '500', L("All")],
										onShowSizeChange(current: number, size: number) {
											self.onChangePage(current, size)
										},
										onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
									}}
								/>
							</Col>
							<Modal
								visible={this.state.visibleDocumentInfo}
								onCancel={() => { this.setState({ visibleDocumentInfo: false }) }}
								footer={null}
								width='70vw'
								closable={false}
								maskClosable={false}
							>

								<DocumentInfor isCancel={true} do_id={this.documentSelected.do_id} onCancel={() => this.setState({ visibleDocumentInfo: false })} />
							</Modal>
						</Row>
					</>
				}
				{this.state.visibleExportExcelDoccumentMulti &&
					<ModalExportDoccument onCancel={this.onCancelModal} visible={this.state.visibleExportExcelDoccumentMulti} doccumentListResult={this.doSelectedList} listColumnDisplay={this.listColumnDisplaySelected} />

				}
				<Modal
					visible={this.state.visibleModalReadDocument}
					title={L('DocumentInformation')}
					onCancel={() => { this.setState({ visibleModalReadDocument: false }) }}
					footer={null}
					width='70vw'
					maskClosable={false}
				>
					<DetailDocument
						documentSelected={this.documentSelected}
					/>
				</Modal>
				<ModalImportDocument
					onRefreshData={this.onRefreshData}
					visible={this.state.visibleImportExcel}
					onCancel={() => this.setState({ visibleImportExcel: false })}
				/>
				{
					this.state.visibleModalCreateOrUpdateMultiCitation &&
					<ModalCreateOrUpdateMultiCitation visible={this.state.visibleModalCreateOrUpdateMultiCitation} onCreateUpdateSuccess={() => { this.onCreateUpdateSuccess() }} onCancel={() => this.setState({ visibleModalCreateOrUpdateMultiCitation: false })} documentListSelected={this.doSelectedList} />
				}
			</Card>
		)
	}
}