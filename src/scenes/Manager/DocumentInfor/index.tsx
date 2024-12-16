import * as React from 'react';
import { Col, Row, Button, Table, Card, Modal, message, Input, Select, Badge, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { CreateDocumentInforInput, DocumentBorrowDto, DocumentInforDto, UpdateDocumentInforInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import TableMainDocumentInfor from './components/TableMainDocumentInfor';
import { eDocumentItemStatus } from '@src/lib/enumconst';
import DetailAttributeDocument from './components/DetailAttributeDocument';
import ModalExportDocumentInfor from './components/ModalExportDocumentInfor';
import PrintLabel, { ItemLabel } from '../Buy/CatalogingRecord/components/PrintLabel';
import PrintLabelDocumentInfor from './components/PrintLabelDocumentInfor';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import SelectEnum from '@src/components/Manager/SelectEnum';


const { confirm } = Modal;
const { Option } = Select;

export interface IProps {
	do_id?: number;
	onCancel?: () => void;
	isCancel?: boolean;
}

export default class DocumentInfor extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelDocumentInfor: false,
		visibleModalDetailDocument: false,
		visibleModalPrintLabel: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		do_title: undefined,
		do_in_isbn: undefined,
		do_in_status: undefined,
		dkcb_code: undefined,
		totalItem: 0,
	};
	documentInforSelected: DocumentInforDto = new DocumentInforDto();
	document_selected: DocumentBorrowDto = new DocumentBorrowDto();
	itemLabelList: ItemLabel[] = [];
	keySelected: number[] = [];
	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.documentInforStore.getAll(this.props.do_id, this.state.do_title, this.state.do_in_isbn, this.state.dkcb_code, this.state.do_in_status, this.state.skipCount, undefined);
		this.setState({ isLoadDone: true });
	}
	clearSearch = async () => {
		await this.setState({
			do_title: undefined,
			do_in_isbn: undefined,
			do_in_status: undefined,
			dkcb_code: undefined,
		});
		this.getAll();
	}
	componentDidUpdate = (prevProps) => {
		if (this.props.do_id != prevProps.do_id) {
			this.setState({ do_id: this.props.do_id })
			this.getAll();
		}
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}
	onChangePage = async (page: number, pagesize?: number) => {
		const { totalDocumentInfor } = stores.documentInforStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalDocumentInfor;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}

	onCreateDocumentInfor = async (unitData: CreateDocumentInforInput): Promise<DocumentInforDto> => {
		this.setState({ isLoadDone: false });
		unitData.do_id = this.props.do_id!;
		let result = await stores.documentInforStore.createDocumentInfor(unitData);
		this.setState({ isLoadDone: true });
		return result
	}

	onEditDocumentInfor = async (unitData: UpdateDocumentInforInput) => {
		this.setState({ isLoadDone: false });
		await stores.documentInforStore.updateDocumentInfor(unitData);
		message.success(L('SuccessfullyEdited'));
		this.setState({ isLoadDone: true });
	}
	onDeleteDocumentInfor = async (item: DocumentInforDto) => {
		const { totalDocumentInfor } = stores.documentInforStore;
		this.setState({ isLoadDone: false });
		if (this.state.currentPage > 1 && (totalDocumentInfor - 1) % 10 == 0) this.onChangePage(this.state.currentPage - 1, this.state.pageSize)
		await stores.documentInforStore.deleteDocumentInfor(item);
		await this.getAll();
		message.success(L('SuccessfullyDeleted'));
		this.setState({ isLoadDone: true });
	}

	//api chua co, dang dung cua phan muon tra
	getDocumentAttribute = async (do_id) => {
		// this.document_selected = await stores.borrowReturningStore.memberGetDocumentBorrowById(do_id);
		this.setState({ visibleModalDetailDocument: true });
	}

	handleInputEnter = (e) => {
		if (e.keyCode === 13) {
			this.handleSubmitSearch();
		}
	}
	onCancelPrintLabel = async () => {
		await this.setState({ visibleModalPrintLabel: false });
	}
	createLabel = async () => {
		await this.setState({ visibleModalPrintLabel: true })
	}
	onChange = (listIdDocumentInfor: number[]) => {
		if (listIdDocumentInfor != undefined) {
			this.keySelected = listIdDocumentInfor;
			this.setState({ totalItem: this.keySelected.length })
		}
	}

	render() {
		const self = this;
		const left = this.state.visibleModalCreateUpdate ? AppConsts.cssRightMain.left : AppConsts.cssPanelMain.left;
		const right = this.state.visibleModalCreateUpdate ? AppConsts.cssPanelMain.right : AppConsts.cssRightMain.right;
		const { documentInforListResult, totalDocumentInfor } = stores.documentInforStore;
		return (
			<Card>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L('DocumentInformation')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>

						{this.isGranted(AppConsts.Permission.Document_DocumentInfor_PrintLabel) &&
							<Badge count={this.state.totalItem}>
								<Button type="primary" icon={<ExportOutlined />} onClick={() => this.createLabel()}>{L('PrintLabel')}</Button>
							</Badge>
						}
						&nbsp;&nbsp;&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.Document_DocumentInfor_Export) &&
							<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelDocumentInfor: true })}>{L('ExportData')}</Button>
						}
						&nbsp;
						{this.props.isCancel ?
							<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L('Cancel')}
							</Button>
							: ""
						}
					</Col>
				</Row>
				<Row align='bottom' gutter={[8, 8]}>
					<Col {...cssColResponsiveSpan(24, 24, 12, 4, 4, 4)} style={{ fontSize: '15px' }}>
						<strong>{L('DocumentName')}:</strong> &nbsp;&nbsp;
						<Input
							value={this.state.do_title}
							onKeyUp={(e) => this.handleInputEnter(e)}
							onChange={(e) => this.setState({ do_title: e.target.value.trim() })}
							allowClear
							placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 12, 3, 4, 5)} style={{ fontSize: '15px' }}>
						<strong>{L('CodeIsbn')}:</strong>&nbsp;&nbsp;
						<Input
							value={this.state.do_in_isbn}
							onPressEnter={(e) => this.handleInputEnter(e)}
							onChange={(e) => this.setState({ do_in_isbn: e.target.value.trim() })}
							allowClear
							placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 12, 4, 4, 4)} style={{ fontSize: '15px' }}>
						<strong >{L('CodeDkcb')}:</strong>&nbsp;&nbsp;
						<Input
							value={this.state.dkcb_code}
							onPressEnter={(e) => this.handleInputEnter(e)}
							onChange={(e) => this.setState({ dkcb_code: e.target.value.trim() })}
							allowClear
							placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 12, 4, 4, 5)} style={{ fontSize: '15px' }}>
						<strong>{L('DocumentStatus')}:</strong>&nbsp;&nbsp;
						{/* <Select
							style={{ width: "100%" }}
							onChange={(e) => this.setState({ do_in_status: e })}
							value={this.state.do_in_status}
							allowClear
							placeholder={L("nhap_tim_kiem")}
						>
							{Object.values(eDocumentItemStatus).map(item =>
								<Option key={"key_" + item.num} value={item.num}>{item.name}</Option>
							)}
						</Select> */}
						<SelectEnum
							eNum={eDocumentItemStatus}
							enum_value={this.state.do_in_status}
							onChangeEnum={async (value: number) => {
								await this.setState({ do_in_status: value })
							}}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 12, 3, 3, 2)} style={{textAlign:"center"}}>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 12, 3, 3, 3)}>
						{(this.state.do_title != undefined || this.state.do_in_isbn != undefined || this.state.do_in_status != undefined || this.state.dkcb_code != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
				</Row>

				<Row gutter={16}>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainDocumentInfor
							onChange={this.onChange}
							noscroll={false}
							onCreateDocumentInfor={this.onCreateDocumentInfor}
							onEditDocumentInfor={this.onEditDocumentInfor}
							onDeleteDocumentInfor={this.onDeleteDocumentInfor}
							isEditable={true}
							onClickDocument={(do_id: number) => this.getDocumentAttribute(do_id)}
							documentInforListResult={documentInforListResult}
							do_id={this.props.do_id!}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalDocumentInfor,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L("All")],
								onShowSizeChange(current: number, pagesize?: number) {
									self.onChangePage(current, pagesize)
								},
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
				</Row>
				{this.state.visibleModalPrintLabel &&
					<PrintLabelDocumentInfor visible={this.state.visibleModalPrintLabel} onCancel={this.onCancelPrintLabel} do_in_id_arr={this.keySelected} />
				}

				<ModalExportDocumentInfor
					documentInforListResult={documentInforListResult}
					visible={this.state.visibleExportExcelDocumentInfor}
					onCancel={() => this.setState({ visibleExportExcelDocumentInfor: false })}
				/>
				<Modal
					visible={this.state.visibleModalDetailDocument}
					title={L('DocumentInformation')}
					onCancel={() => { this.setState({ visibleModalDetailDocument: false }) }}
					footer={null}
					width='70vw'
					maskClosable={false}
					closable={false}
				>
					<DetailAttributeDocument
						document_info={this.document_selected}
					/>
				</Modal>
			</Card>
		)
	}
}