import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Tag, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { AuthorAbtractDto, DocumentBorrowDto, FindMemberBorrowDto, ItemUser, MemberDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CheckCircleOutlined, DeleteOutlined, ExportOutlined, MinusOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan, } from '@src/lib/appconst';
import TableBorrowDocument from './components/TableBorrowDocument';
import TableRisterBorrowDocument from './components/TableRisterBorrowDocument';
import InformationMember from '@src/scenes/Manager/Member/components/InformationMember';
import DetailAttributeDocument from '@src/scenes/Manager/DocumentInfor/components/DetailAttributeDocument';
import { eDocumentBorrowType, eDocumentSort, eMCardStatus, eUserType, valueOfeDocumentStatus } from '@src/lib/enumconst';
import moment from 'moment';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import SelectedColumnDisplay from '@src/components/Manager/SelectedColumnDisplay';
import SelectUser from '@src/components/Manager/SelectUser';
import ModalExportLibrianBorrow from './components/ModalExportLibrarianBorrow';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import SelectedAuthor from '@src/components/Manager/SelectedAuthor';
import { SorterResult } from 'antd/lib/table/interface';

const TableDocumentBorrowColumns: ColumnsDisplayType<any> = [
	{ title: L('N.O'), displayDefault: true, key: 'do_created_at', fixed: 'left', width: "5%", render: (text: string, item: DocumentBorrowDto, index: number) => <div>{index + 1}</div> },
	{ title: L('Title'), sorter: true, displayDefault: true, dataIndex: 'do_title', key: 'do_title', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_title}</div> },
	{ title: L('Identifier'), sorter: true, displayDefault: true, dataIndex: 'do_identifier', key: 'do_identifier', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_identifier}</div> },
	{ title: L('tac_gia'), displayDefault: true, key: 'authors_arr', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameAuthor(item.authors_arr)}</div> },
	{ title: L('AvailableDate'), sorter: true, displayDefault: true, dataIndex: 'do_date_available', key: 'do_date_available', width: 100, render: (text: string, item: DocumentBorrowDto) => <div>{moment(item.do_date_available).format("DD/MM/YYYY")}</div> },
	{ title: L('YearOfPublication'), width: "10%", sorter: true, displayDefault: true, dataIndex: 'do_date_publish', key: 'do_date_publish', render: (text: string, item: DocumentBorrowDto) => <div>{!!item.do_date_publish && moment(item.do_date_publish).format("YYYY")}</div> },
	{ title: L('RepublishedTimes'), width: "10%", displayDefault: true, key: 'do_republish', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_republish}</div> },
	{ title: L('Description'), displayDefault: false, key: 'do_abstract', render: (text: string, item: DocumentBorrowDto) => <div>{<div dangerouslySetInnerHTML={{ __html: item.do_abstract! }}></div>}</div> },
	{ title: L('Publisher'), displayDefault: false, key: 'pu_id', render: (text: string, item: DocumentBorrowDto) => <div>{item.publisher.name}</div> },
	{ title: L('Topic'), displayDefault: false, key: 'to_id', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameTopic(item.to_id)}</div> },
	{ title: L('Category'), displayDefault: false, key: 'ca_id', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameCategory(item.ca_id)}</div> },
	{ title: L('Repository'), displayDefault: false, key: 're_id', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameRepository(item.re_id)}</div> },
	{ title: L('ValidDocuments'), displayDefault: true, key: 'do_total_book_valid', render: (text: string, item: DocumentBorrowDto) => <div> {item.do_remaining_book - item.do_total_user_register}</div> },
	{ title: L('DocumentPrice'), displayDefault: true, key: 'do_price', render: (text: string, item: DocumentBorrowDto) => <div> {AppConsts.formatNumber(item.do_price)} VNĐ</div> },

];
export default class LibrarianBorrow extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalDetailDocument: false,
		visibleExportExcelDocument: false,
		visibleModalBorrowDocument: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		me_id_borrow: undefined,
		do_search: undefined,
		author: undefined,
		actionColumnDeleted: false,
		sort: undefined,
		isPrintTag: true,
		me_ca_level: undefined,
	};
	action: any = {
		title: "", displayDefault: true, key: 'action_Doccument', width: 100, className: "no-print center", fixed: "right", children: [],
		render: (text: string, item: DocumentBorrowDto) => (
			<Row style={{ display: 'flex', fontSize: '15px', alignItems: 'center', justifyContent: 'center' }}>

				{
					(item.do_remaining_book - item.do_total_user_register) < 1 ?
						<><div style={{ color: "red" }}>{L("khong_du_tai_lieu")}</div></>
						:
						this.checkDocIsAdded2ListBorrow(item) ? (
							<>
								{<MinusOutlined onClick={() => this.onRemoveDocIntoRegisterBorrow(item)} style={{ color: 'red' }} />}
								&nbsp;&nbsp;
								<label >{this.listDocumentBorrowDisplay![Number(item.do_id)]}</label>
								&nbsp;&nbsp;
								{<PlusOutlined onClick={() => this.onAddDoc2RegisterBorrow(item)} style={{ color: 'green' }} />}
							</>

						) : (
							<Button
								type="primary" icon={<PlusCircleOutlined />} title={L('AddToBorrowedList')} size='small'
								style={{ marginLeft: '10px' }}
								onClick={() => this.onAddDoc2RegisterBorrow(item)}
							></Button>
						)}
			</Row>
		)
	}
	documentSelected: DocumentBorrowDto = new DocumentBorrowDto();
	listDocumentBorrowDisplay: { [key: number]: number } = {};
	memberSelected?: FindMemberBorrowDto = new FindMemberBorrowDto();
	selectedField: string;
	itemUser: ItemUser[];
	listColumnDisplay: ColumnsDisplayType<DocumentBorrowDto> = [];
	listColumnDisplaySelected: ColumnsDisplayType<DocumentBorrowDto> = [];
	async componentDidMount() {
		this.setState({ isLoadDone: false })
		await this.getAllDocument();
		this.listColumnDisplay = TableDocumentBorrowColumns;
		this.addStatus();
		this.addActionColumn();
		this.setState({ isLoadDone: true })
	}
	addStatus = () => {
		let action: any = {
			title: L('Status'), displayDefault: true, width: '10%', key: 'do_status', render: (text: string, item: DocumentBorrowDto) =>
			(
				!this.state.isPrintTag ?
					<div>
						{valueOfeDocumentStatus(item.do_status)}
					</div>
					:
					!!item.do_status ?
						<Tag icon={<CheckCircleOutlined />} color="success">
							{valueOfeDocumentStatus(item.do_status)}
						</Tag>
						:
						<Tag icon={<SyncOutlined spin />} color="processing">
							{valueOfeDocumentStatus(item.do_status)}
						</Tag>
			)

		}
		this.listColumnDisplay.push(action);
		this.listColumnDisplaySelected.push(action);
	}
	clearSearch = async () => {
		await this.setState({
			me_id_borrow: undefined,
			do_search: undefined,
			author: undefined,
		});
	}
	addActionColumn = () => {
		if (this.listColumnDisplay.find(item => item.key == "action_Doccument") == undefined) {
			this.listColumnDisplay.push(this.action);
		}
		else {
			this.listColumnDisplaySelected.push(this.action);
		}
	}
	getAllDocument = async () => {
		this.setState({ isLoadDone: false });
		await stores.borrowReturningStore.managerGetAllDocumentToBorrow(this.state.do_search, this.state.author, this.selectedField, this.state.sort, this.state.skipCount, this.state.pageSize);
		this.setState({ currentPage: 1 })
		this.setState({ isLoadDone: true });
	}
	componentWillUnmount() {
		this.listColumnDisplay.splice(-2);
	}
	onDoubleClickRow = (value: DocumentBorrowDto) => {
		if (value == undefined || value.do_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.setState({ isLoadDone: false, });
		this.documentSelected.init(value);
		this.setState({ isLoadDone: true, visibleModalDetailDocument: true });
	};

	onAddDoc2RegisterBorrow = async (input: DocumentBorrowDto) => {
		this.setState({ isLoadDone: false });
		const { listDocumentBorrowDisplay } = this;
		if (this.memberSelected != undefined && this.memberSelected.me_id != undefined) {
			if (this.memberSelected.memberCard != undefined || this.memberSelected.me_birthday != undefined) {
				if (this.state.author == "" || this.state.me_ca_level! >= input.do_price || this.state.me_ca_level! > 0) {
					let total = Object.values(this.listDocumentBorrowDisplay as number[]).reduce((acc: number, curr: number) => acc + curr, 1);
					if (total <= 5 && total + 1 == undefined) {
						if (listDocumentBorrowDisplay[input.do_id] == undefined && (input.do_remaining_book - input.do_total_user_register) > 0) {
							listDocumentBorrowDisplay[input.do_id] = 1;
							await this.setState({ me_ca_level: this.state.me_ca_level! - input.do_price - 1 });
						}
						else if (listDocumentBorrowDisplay[input.do_id] != undefined && listDocumentBorrowDisplay[input.do_id] != (input.do_remaining_book - input.do_total_user_register - input.do_price)) {
							listDocumentBorrowDisplay[input.do_id] = (listDocumentBorrowDisplay[input.do_id]) + 1;
							await this.setState({ me_ca_level: this.state.me_ca_level! - input.do_price });
						}
						else {
							message.error(L('LAM EO GI CO TAI LIEU MA MUON'));
						}
					}
					else {
						message.error(L('MaximumIs5'));
					}
				}
				else {
					message.warning(L("han_muc_tien_khong_du_de_thuc_hien_thao_tac_nay") + "!")
				}
			}
			else {
				message.warning(L("doc_gia_chua_co_the") + "!")
			}
		}
		else {
			message.warning(L("chon_doc_gia"))
		}
		this.setState({ isLoadDone: true });
	}

	onRemoveDocIntoRegisterBorrow = async (input: DocumentBorrowDto) => {
		this.setState({ isLoadDone: false });
		const { listDocumentBorrowDisplay } = this;
		listDocumentBorrowDisplay[input.do_id] = (listDocumentBorrowDisplay[input.do_id]) - 1;
		if (listDocumentBorrowDisplay[input.do_id] == 0 && input != undefined) {
			delete listDocumentBorrowDisplay[input.do_id];
		}
		await this.setState({ isLoadDone: true, me_ca_level: this.state.me_ca_level! + input.do_price });

	}
	checkDocIsAdded2ListBorrow = (item: DocumentBorrowDto) => {
		if (!!this.listDocumentBorrowDisplay && Object.keys(this.listDocumentBorrowDisplay).length > 0) {
			const findItem = Object.keys(this.listDocumentBorrowDisplay).find(doc => Number(doc) == item.do_id);
			if (!!findItem && this.listDocumentBorrowDisplay[Number(findItem)] != 0) {
				return true;
			}
		}
		return false;
	}
	onChangePage = async (page, pagesize) => {
		const { totalDocument } = stores.borrowReturningStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalDocument;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAllDocument();
		});
	}

	onSelectUser = async (item_arr: ItemUser[]) => {
		if (!!item_arr && !isNaN(Number(item_arr[0].id))) {
			await this.setState({ me_id_borrow: item_arr[0].id });
			this.itemUser = item_arr;
		}
		this.setState({ isLoadDone: false });
		this.memberSelected = await stores.borrowReturningStore.findMemberById(this.state.me_id_borrow);
		await this.setState({ isLoadDone: true, me_ca_level: !!this.memberSelected.memberCard ? this.memberSelected.memberCard.me_ca_level : undefined });

	}
	onClearListDocumentBorrow = async () => {
		this.setState({ isLoadDone: false });
		this.listDocumentBorrowDisplay = {};
		this.memberSelected = new FindMemberBorrowDto();
		await this.setState({ isLoadDone: true, me_ca_level: undefined });
	}
	onOpenRegisterForm = () => {
		this.setState({ isLoadDone: false });

		if (this.memberSelected == undefined || this.memberSelected.me_is_locked == true) {
			message.warning(L("MemberisLocked"));
			return;
		}
		if (this.memberSelected == undefined || this.memberSelected.me_id == undefined) {
			message.warning(L("ChooseMember"));
			return;
		}
		if (!!this.memberSelected && !!this.memberSelected.memberCard && this.memberSelected.memberCard.me_ca_status == eMCardStatus.Register.num) {
			message.warning(L("the_doc_gia_chua_duoc_duyet"));
			return;
		}
		if (this.memberSelected != undefined && this.memberSelected.me_has_card == false) {
			message.warning(L("MemberDoNotHaveCard"));
			return;
		}
		if (!!this.memberSelected && !!this.memberSelected.memberCard && this.memberSelected.memberCard.me_ca_is_locked == true) {
			message.warning(L("the_doc_gia_bi_khoa"));
			return;
		}
		if (this.memberSelected != undefined && this.memberSelected.memberCard.me_ca_status == eMCardStatus.Timeup.num) {
			message.warning(L("the_doc_gia_het_han"));
			return;
		}
		if (Object.keys(this.listDocumentBorrowDisplay).length <= 0) {
			message.warning(L('PleaseChooseDocumentToBorrow'));
			return;
		}
		this.setState({ visibleModalBorrowDocument: true });
	}
	changeColumnsDisplay = async (values) => {
		this.setState({ isLoadDone: false });
		let twoFirstColumns: any = [
			{ title: L('Title'), sorter: true, displayDefault: true, dataIndex: 'do_title', key: 'do_title', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_title}</div> },
			{ title: L('N.O'), displayDefault: true, key: 'do_created_at', fixed: 'left', width: 50, render: (text: string, item: DocumentBorrowDto, index: number) => <div>{index + 1}</div> },
		];
		this.listColumnDisplaySelected = values;
		twoFirstColumns.map(item => this.listColumnDisplaySelected.unshift(item));
		this.listColumnDisplaySelected.push(this.action);
		this.listColumnDisplaySelected = values;
		await this.getAllDocument();
		this.setState({ isLoadDone: true });
	}
	changeColumnSort = async (sort: SorterResult<DocumentBorrowDto> | SorterResult<DocumentBorrowDto>[]) => {
		this.setState({ isLoadDone: false });
		this.selectedField = sort['field'];
		let order = eDocumentSort.ASC.num;
		if (sort['order'] == "descend") order = eDocumentSort.DES.num
		await this.setState({ sort: order })
		await this.getAllDocument();
		this.setState({ isLoadDone: true });

	}
	onClear = () => {
		this.setState({ isLoadDone: false });
		this.memberSelected = undefined;
		this.setState({ isLoadDone: true });
	}
	onOpenModalExport = () => {
		this.listColumnDisplaySelected.pop();
		this.setState({ visibleExportExcelDocument: true, isPrintTag: false, });
	}
	render() {
		const self = this;
		const left = this.memberSelected != undefined && this.memberSelected.me_id ? cssColResponsiveSpan(24, 24, 8, 8, 8, 8) : cssCol(0);
		const right = this.memberSelected != undefined && this.memberSelected.me_id ? cssColResponsiveSpan(24, 24, 16, 16, 16, 16) : cssCol(24);

		const { documentListResult, totalDocument } = stores.borrowReturningStore;
		return (
			<>
				<Row gutter={[8, 8]} align='bottom'>
					{/* <Col
						xs={{ span: 24 }}
						sm={{ span: 24 }}
						md={{ span: 12 }}
						lg={{ offset: 0, span: 12 }}
						xl={{ offset: 0, span: 12 }}
						xxl={{ offset: 0, span: 12 }}>
						<h2>{L('Librian') + " " + L('registertoborrow')}</h2>
					</Col> */}
					<Col {...cssColResponsiveSpan(24, 24, 8, 5, 3, 4)}>
						<strong style={{ width: "30%" }}>{L('Member')}:</strong>&nbsp;&nbsp;
						<SelectUser userItem={(this.memberSelected == undefined) ? undefined : this.itemUser} onClear={() => this.onClear()} role_user={eUserType.Member.num} onChangeUser={async (item_arr: ItemUser[]) => await this.onSelectUser(item_arr)} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 8, 5, 3, 4)}>
						<strong>{L('DocumentInformation')}:</strong><br />
						<Input value={this.state.do_search} placeholder={L("nhap_tim_kiem")} onPressEnter={() => this.getAllDocument()} allowClear onChange={(e) => this.setState({ do_search: e.target.value })} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 8, 5, 3, 4)}>
						<strong>{L('Author')}:</strong><br />
						<SelectedAuthor selected_au_id={this.state.author} onClear={() => this.setState({ author: undefined })} onChangeAuthor={(item: AuthorAbtractDto) => { this.setState({ author: item.au_name }) }} />
					</Col>
					<Col className='textAlignCenter-col-992px' {...cssColResponsiveSpan(12, 7, 5, 3, 3, 2)} >
						<Button type='primary' icon={<SearchOutlined />} placeholder={L("nhap_tim_kiem")} onClick={() => this.getAllDocument()}>{L('tim_kiem')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 5, 5, 4, 4, 3)} >
						{(this.state.author != undefined || this.state.me_id_borrow != undefined || this.state.do_search != undefined) &&
							<Button title={L('ClearSearch')} danger icon={<DeleteOutlined />} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 8, 7)} className='textAlign-col-992'>
						{this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Register) &&
							<Badge count={Object.values(this.listDocumentBorrowDisplay as number[]).reduce((acc: number, curr: number) => acc + curr, 0)} >
								<Button type="primary" icon={<PlusOutlined />} onClick={this.onOpenRegisterForm}>{L('RegisterToBorrow')}</Button>
							</Badge>
						}
						&nbsp;
						{this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Export) &&
							<Button type="primary" icon={<ExportOutlined />} onClick={this.onOpenModalExport}>{L('ExportData')}</Button>
						}	</Col>
				</Row>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 24, 12, 12, 10, 8)}>
						<SelectedColumnDisplay listColumn={this.listColumnDisplay} onChangeColumn={this.changeColumnsDisplay} />
					</Col>
				</Row>
				{/* <Row>
					<Col xs={24} sm={24} md={{ span: 12, offset: 12 }} lg={{ span: 12, offset: 12 }} xl={{ span: 12, offset: 12 }} xxl={{ span: 12, offset: 12 }}>
						<Row justify='end'>
						</Row>
					</Col>
				</Row> */}
				<Row>
					<Col {...left} style={{ marginTop: '10px' }}>
						{this.memberSelected != undefined && this.memberSelected.me_id != undefined &&
							<InformationMember memberSelected={this.memberSelected} isRow={false} />
						}
					</Col>
					<Col {...right} style={{ marginTop: '10px' }}>
						<TableBorrowDocument
							doccumentListResult={documentListResult}
							listColumnDisplay={this.listColumnDisplaySelected}
							is_printed={false}
							changeColumnSort={this.changeColumnSort}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalDocument,
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
				</Row>
				<Modal
					visible={this.state.visibleModalBorrowDocument}
					title={L('ListOfDocumentsBorrowedBy') + " " + L('librian')}
					onCancel={() => { this.setState({ visibleModalBorrowDocument: false, isPrintTag: true, }) }}
					okText="Regiter"
					width='90vw'
					maskClosable={false}
					footer={false}
				>
					<TableRisterBorrowDocument
						us_id={this.state.me_id_borrow!}
						documentListResult={documentListResult}
						listDocumentBorrowDisplay={this.listDocumentBorrowDisplay}
						onCancel={() => this.setState({ visibleModalBorrowDocument: false })}
						memberSelected={this.memberSelected}
						onRemoveDocIntoRegisterBorrow={this.onRemoveDocIntoRegisterBorrow}
						onAddDoc2RegisterBorrow={this.onAddDoc2RegisterBorrow}
						onClearListDocumentBorrow={this.onClearListDocumentBorrow}
						onClear={this.onClear}
					/>
				</Modal>

				<ModalExportLibrianBorrow
					doccumentListResult={documentListResult}
					listColumnDisplay={this.listColumnDisplaySelected}
					visible={this.state.visibleExportExcelDocument}
					onCancel={() => { this.setState({ visibleExportExcelDocument: false, isPrintTag: true, }); this.addActionColumn() }}
				/>
				<Modal
					visible={this.state.visibleModalDetailDocument}
					title={L('DocumentInformation')}
					onCancel={() => { this.setState({ visibleModalDetailDocument: false }) }}
					footer={null}
					width='70vw'
					maskClosable={false}
				>
					<DetailAttributeDocument
						document_info={this.documentSelected}
					/>
				</Modal>
			</ >
		)
	}
}