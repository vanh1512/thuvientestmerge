import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Select, Badge, Tag, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { AuthorAbtractDto, DocumentBorrowDto, FindMemberBorrowDto, MemberDto, MemberSearchDocumentToBorrowInput, TopicAbtractDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CheckCircleOutlined, DeleteOutlined, ExportOutlined, MinusOutlined, PlusCircleOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import TableBorrowDocument from './components/TableBorrowDocument';
import TableCreateBorrowDocument from './components/TableMemberCreateBorrowDocument';
import SelectedTopic from '@src/components/Manager/SelectedTopic';
import SelectTreeCategory from '@src/components/Manager/SelectTreeCategory';
import DetailAttributeDocument from '@src/scenes/Manager/DocumentInfor/components/DetailAttributeDocument';
import moment from 'moment';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import { eDocumentSort, eMCardStatus, valueOfeDocumentStatus } from '@src/lib/enumconst';
import SelectedColumnDisplay from '@src/components/Manager/SelectedColumnDisplay';
import ModalExportMemberRegisterBorrow from './components/ModalExportMemberRegisterBorrow';
import SelectedAuthor from '@src/components/Manager/SelectedAuthor';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { SorterResult } from 'antd/lib/table/interface';

const TableDocumentBorrowColumns: ColumnsDisplayType<DocumentBorrowDto> = [
	{ title: L('N.O'), displayDefault: true, key: 'do_created_at', fixed: 'left', render: (text: string, item: DocumentBorrowDto, index: number) => <div>{index + 1}</div> },
	{ title: L('Title'), sorter: true, displayDefault: true, dataIndex: 'do_title', key: 'do_title', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_title}</div> },
	{ title: L('Identifier'),  sorter: true, displayDefault: true, dataIndex: 'do_identifier', key: 'do_identifier', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_identifier}</div> },
	{ title: L('Author'), displayDefault: true, key: 'do_date_accessioned', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameAuthor(item.authors_arr)}</div> },
	{ title: L('AvailableDate'),	sorter: true, displayDefault: true, dataIndex: 'do_date_available', key: 'do_date_available', render: (text: string, item: DocumentBorrowDto) => <div>{moment(item.do_date_available).format("DD/MM/YYYY")}</div> },
	{ title: L('YearOfPublication'),  sorter: true, displayDefault: true, dataIndex: 'do_date_publish', key: 'do_date_publish', render: (text: string, item: DocumentBorrowDto) => <div>{!!item.do_date_publish && moment(item.do_date_publish).format("YYYY")}</div> },
	{ title: L('RepublishedTimes'),  displayDefault: false, key: 'do_republish', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_republish}</div> },
	{ title: L('Quote'), displayDefault: false, key: 'do_identifier_citation', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_identifier_citation}</div> },
	{ title: L('Description'), displayDefault: false, key: 'do_abstract', render: (text: string, item: DocumentBorrowDto) => <div dangerouslySetInnerHTML={{ __html: item.do_abstract! }}></div> },
	{ title: L('Publisher'), displayDefault: false, key: 'pu_id', render: (text: string, item: DocumentBorrowDto) => <div>{item.publisher.name}</div> },
	{ title: L('Topic'), displayDefault: false, key: 'to_id', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameTopic(item.to_id)}</div> },
	{ title: L('Category'), displayDefault: false, key: 'ca_id', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameCategory(item.ca_id)}</div> },
	{ title: L('Repository'), displayDefault: false, key: 're_id', render: (text: string, item: DocumentBorrowDto) => <div>{stores.sessionStore.getNameRepository(item.re_id)}</div> },
	{ title: L('ValidDocuments'), displayDefault: true, key: 'do_total_book_valid', render: (text: string, item: DocumentBorrowDto) => <div> {item.do_remaining_book - item.do_total_user_register}</div> },
	{ title: L('DocumentPrice'), displayDefault: true, key: 'do_price', render: (text: string, item: DocumentBorrowDto) => <div> {AppConsts.formatNumber(item.do_price)} VNĐ</div> },
];
export default class TabMemberBorrow extends React.Component {
	state = {
		isLoadDone: true,
		visibleModalDetail: false,
		visibleModalBorrowDocument: false,
		visibleModalDetailDocument: false,
		visibleModalMemberRegisterBorrow: false,
		do_search: undefined,
		to_id: undefined,
		ca_id: undefined,
		author: undefined,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		me_id_borrow: undefined,
		actionColumnDeleted: false,
		sort: 1,
		isPrintTag: true,
		me_ca_level: undefined,
	};
	action: any = {
		title: "", displayDefault: true, key: 'action_Doccument', width: '10vw', className: "no-print center", fixed: "right", children: [],
		render: (text: string, item: DocumentBorrowDto) => (
			<Row style={{ display: 'flex', fontSize: '15px', alignItems: 'center', justifyContent: 'center' }}>

				{
					(item.do_remaining_book - item.do_total_user_register) < 1 ?
						<></>
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
	document_selected: DocumentBorrowDto = new DocumentBorrowDto();
	listDocumentBorrowDisplay: { [key: number]: number } = {};
	memberSelected: FindMemberBorrowDto = new FindMemberBorrowDto();
	selectedField: string;
	listColumnDisplay: ColumnsDisplayType<DocumentBorrowDto> = [];
	listColumnDisplaySelected: ColumnsDisplayType<DocumentBorrowDto> = [];
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		await this.getAllDocument();
		this.memberSelected = await stores.sessionStore.getMemberInformations();
		await this.setState({ me_ca_level: !!this.memberSelected.memberCard ? this.memberSelected.memberCard.me_ca_level : undefined })
		this.listColumnDisplay = TableDocumentBorrowColumns;
		this.addStatus();
		this.addActionColumn();
		this.setState({ isLoadDone: true });
	}
	addActionColumn = () => {
		if (this.listColumnDisplay.find(item => item.key == "action_Doccument") == undefined) {
			this.listColumnDisplay.push(this.action);
		}
		else {
			this.listColumnDisplaySelected.push(this.action);
		}
	}
	addStatus = () => {
		let action: any = {
			title: L('Status'), displayDefault: true, width: '10vw', key: 'do_status', render: (text: string, item: DocumentBorrowDto) =>
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
	componentWillUnmount() {
		this.listColumnDisplay.splice(-2);
	}
	getAllDocument = async () => {
		this.setState({ isLoadDone: false });
		let input = new MemberSearchDocumentToBorrowInput();
		input.skipCount = this.state.skipCount;
		input.maxResultCount = this.state.pageSize;
		input.do_search = this.state.do_search;
		input.fieldSort = this.selectedField;
		input.sort = this.state.sort;
		if (this.state.to_id !== undefined) {
			input.to_id = this.state.to_id!;
		}
		if (this.state.author !== undefined) {
			input.author = this.state.author!;
		}
		if (this.state.ca_id !== undefined) {
			input.ca_id = this.state.ca_id!;
		}
		await stores.borrowReturningStore.memberGetAllDocumentToBorrow(input);
		this.setState({ currentPage: 1 })
		this.setState({ isLoadDone: true });
	}

	onDoubleClickRow = (value: DocumentBorrowDto) => {
		if (value == undefined || value.do_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.setState({ isLoadDone: false, });
		this.document_selected.init(value);

		this.setState({ isLoadDone: true, visibleModalDetailDocument: true });
	};
	checkDocIsAdded2ListBorrow = (item: DocumentBorrowDto) => {
		if (!!this.listDocumentBorrowDisplay && Object.keys(this.listDocumentBorrowDisplay).length > 0) {
			const findItem = Object.keys(this.listDocumentBorrowDisplay).find(doc => Number(doc) == item.do_id);
			if (!!findItem && this.listDocumentBorrowDisplay[Number(findItem)] != 0) {
				return true;
			}
		}
		return false;
	}
	onAddDoc2RegisterBorrow = async (input: DocumentBorrowDto) => {
		this.setState({ isLoadDone: false });
		const { listDocumentBorrowDisplay } = this;
		if (this.state.me_ca_level! >= input.do_price) {
			let total = Object.values(this.listDocumentBorrowDisplay as number[]).reduce((acc: number, curr: number) => acc + curr, 1);
			if (total <= 5) {
				if (listDocumentBorrowDisplay[input.do_id] == undefined && (input.do_remaining_book - input.do_total_user_register) > 0) {
					listDocumentBorrowDisplay[input.do_id] = 1;
					await this.setState({ me_ca_level: this.state.me_ca_level! - input.do_price });
				} else if (listDocumentBorrowDisplay[input.do_id] != undefined && listDocumentBorrowDisplay[input.do_id] < (input.do_remaining_book - input.do_total_user_register)) {
					listDocumentBorrowDisplay[input.do_id] = (listDocumentBorrowDisplay[input.do_id]) + 1;
					await this.setState({ me_ca_level: this.state.me_ca_level! - input.do_price });
				}
				else {
					message.error(L('NotEnoughdocument'));

				}
			}
			else {
				message.error(L('MaximumIs5'));
			}
		} else {
			message.warning(L("han_muc_tien_khong_du_de_thuc_hien_thao_tac_nay") + "!")
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
		this.setState({ isLoadDone: true, me_ca_level: this.state.me_ca_level! + input.do_price });
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
	changeColumnsDisplay = async (values) => {
		this.setState({ isLoadDone: false });
		let twoFirstColumns: any = [
			{ title: L('Title'), width: '10%', sorter: true, displayDefault: true, dataIndex: 'do_title', key: 'do_title', render: (text: string, item: DocumentBorrowDto) => <div>{item.do_title}</div> },
			{ title: L('N.O'), displayDefault: true, key: 'do_created_at', fixed: 'left', width: '6%', render: (text: string, item: DocumentBorrowDto, index: number) => <div>{index + 1}</div> },
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
	onClearListDocumentBorrow = async () => {
		this.setState({ isLoadDone: false });
		this.listDocumentBorrowDisplay = [];
		this.memberSelected = new FindMemberBorrowDto();
		await this.setState({ isLoadDone: true, me_ca_level: undefined });
	}
	onOpenRegisterForm = () => {
		this.setState({ isLoadDone: false });
		if (this.memberSelected != undefined && this.memberSelected.me_has_card == false) {
			message.warning(L("MemberDoNotHaveCard"));
			return;
		}
		if (this.memberSelected != undefined && this.memberSelected.memberCard.me_ca_status == eMCardStatus.Timeup.num) {
			message.warning(L("the_doc_gia_het_han"));
			return;
		}
		if (this.memberSelected != undefined && !!this.memberSelected.memberCard && this.memberSelected.memberCard.me_ca_is_locked == true) {
			message.warning(L("the_doc_gia_bi_khoa"));
			return;
		}
		if (Object.keys(this.listDocumentBorrowDisplay).length <= 0) {
			message.warning(L('PleaseChooseDocumentToBorrow'));
			return;
		}
		this.setState({ visibleModalBorrowDocument: true, isLoadDone: true });
	}

	onClearTopic() {
		this.setState({ to_id: undefined });
	}

	onClearCategory() {
		this.setState({ ca_id: undefined });
	}

	onClearAuthor() {
		this.setState({ author: undefined });
	}

	onCancel() {
		this.setState({ visibleModalMemberRegisterBorrow: false })
	}
	onOpenModalExport = () => {
		this.listColumnDisplaySelected.pop();
		this.setState({ visibleModalMemberRegisterBorrow: true, isPrintTag: false, });
	}
	clearSearch = async () => {
		await this.setState({
			do_search: undefined,
			to_id: undefined,
			ca_id: undefined,
			author: undefined,
		});
	}
	render() {
		const self = this;
		const { documentListResult, totalDocument } = stores.borrowReturningStore;

		return (
			<>
				<Row gutter={[8, 8]}>
					<Col {...cssColResponsiveSpan(24, 24, 8, 12, 12, 12)} >
						<h2>{L('Member') + " " + L('registertoborrow')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 16, 12, 12, 12)} className='textAlign-col-768'>
						<Badge style={{ margin: '0 10px 0.5em 0' }} count={Object.values(this.listDocumentBorrowDisplay as number[]).reduce((acc: number, curr: number) => acc + curr, 0)} >
							<Button style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={this.onOpenRegisterForm}>{L('RegisterToBorrow')}</Button>
						</Badge>
						<Button type="primary" icon={<ExportOutlined />} onClick={this.onOpenModalExport}>{L('ExportData')}</Button>
					</Col>
				</Row>

				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 12, 8, 4, 4, 4)} >
						<strong>{L('DocumentInformation')}:</strong><br />
						<Input allowClear onPressEnter={this.getAllDocument} value={this.state.do_search} placeholder={L("nhap_tim_kiem")} onChange={(e) => this.setState({ do_search: e.target.value })} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 8, 4, 4, 4)} >
						<strong>{L('Author')}:</strong><br />
						{/* <Input allowClear onPressEnter={this.getAllDocument} placeholder={L("nhap_tim_kiem")} onChange={(e) => this.setState({ author: e.target.value.trim() })} /> */}
						<SelectedAuthor selected_au_id={this.state.author} onClear={() => this.onClearAuthor()} onChangeAuthor={(item: AuthorAbtractDto) => { this.setState({ author: item.au_name }) }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 8, 4, 4, 4)} >
						<strong>{L('Topic')}:</strong><br />
						<SelectedTopic selected_to_id={this.state.to_id} onClear={() => this.onClearTopic()} onChangeTopic={(item: number) => { this.setState({ to_id: item }) }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 8, 4, 4, 4)} >
						<strong>{L('Category')}:</strong><br />
						<SelectTreeCategory ca_id_select={this.state.ca_id} onClear={() => this.onClearCategory()} onSelectCategory={(item: number) => { this.setState({ ca_id: item }) }} />
					</Col>
					<Col style={{ textAlign: "center" }} {...cssColResponsiveSpan(24, 12, 8, 3, 3, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.getAllDocument()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 5, 5, 3, 3, 3)} >
						{(this.state.author != undefined || this.state.to_id != undefined || this.state.do_search != undefined || this.state.ca_id != undefined) &&
							<Button title={L('ClearSearch')} danger icon={<DeleteOutlined />} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
				</Row>
				<Row>
					<Col span={14} style={{ textAlign: "end" }}></Col>
					<Col {...cssColResponsiveSpan(24, 12, 10, 10, 10, 10)} >
						<SelectedColumnDisplay listColumn={this.listColumnDisplay} onChangeColumn={this.changeColumnsDisplay} />
					</Col>
				</Row>
				<Row>
					<Col span={24} style={{ marginTop: '10px' }}>
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
					title={L('ListOfDocumentsBorrowedBy') + " " + L('member')}
					onCancel={() => { this.setState({ visibleModalBorrowDocument: false }) }}
					width='90vw'
					maskClosable={false}
					footer={false}
				>
					<TableCreateBorrowDocument
						listDocumentBorrowDisplay={this.listDocumentBorrowDisplay}
						onCancel={() => this.setState({ visibleModalBorrowDocument: false })}
						memberSelected={this.memberSelected}
						documentListResult={documentListResult}
						onRemoveDocIntoRegisterBorrow={this.onRemoveDocIntoRegisterBorrow}
						onClearListDocumentBorrow={this.onClearListDocumentBorrow}
						onAddDoc2RegisterBorrow={this.onAddDoc2RegisterBorrow}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalDetailDocument}
					title={L('DocumentInformation')}
					onCancel={() => { this.setState({ visibleModalDetailDocument: false }) }}
					footer={null}
					width='70vw'
							maskClosable={false}
				>
					<DetailAttributeDocument
						document_info={this.document_selected}
					/>
				</Modal>


				<ModalExportMemberRegisterBorrow
					ListResult={documentListResult}
					listColumnDisplaySelected={this.listColumnDisplaySelected}
					visible={this.state.visibleModalMemberRegisterBorrow}
					onCancel={() => { this.onCancel(); this.addActionColumn(); this.setState({ isPrintTag: true, }) }}
				/>
			</ >
		)
	}
}