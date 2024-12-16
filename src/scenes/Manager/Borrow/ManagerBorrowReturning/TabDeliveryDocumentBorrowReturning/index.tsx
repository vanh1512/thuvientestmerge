import * as React from 'react';
import { Button, Card, Col, Input, Modal, Row } from 'antd';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, FindMemberBorrowDto, ItemUser, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, IdcardOutlined, SearchOutlined, ShoppingCartOutlined, StopOutlined } from '@ant-design/icons';
import DeliveryDocument from './components/DeliveryDocument';
import { ColumnGroupType } from 'antd/lib/table';
import { eBorrowReturningProcess, eUserType } from '@src/lib/enumconst';
import PrintFormBorrowing from './components/PrintFormBorrowing';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import SelectUser from '@src/components/Manager/SelectUser';
import TableDeliveryDocumentBorrowReturning from './components/TableDeliveryDocumentBorrowReturning';
import DeliveryDirectedDocument from './components/DeliveryDirectedDocument';
import ModalExportTableDeliverBorrowReturning from './components/ModalExportTableDeliverBorrowReturning';
import CancelBorrowReturn from '../TabApproveBorrowReturning/components/CancelBorrowReturn';

export interface IProps {
	titleHeader: string,
}
export default class TabDeliveryDocumentBorrowReturning extends AppComponentBase<IProps> {
	state = {
		isLoadDone: false,
		visibleModalDelivery: false,
		visibleExportExcelBorrowReturning: false,
		visibleModalPrintForm: false,
		visibleDeliveryDocumentDirectedBorrowReturning: false,
		visibleModalCancel: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		br_re_code: undefined,
		br_re_de_status: undefined,
		dkcb_code: undefined,
		us_id_borrow: undefined,
		br_re_start_at: undefined,
		br_re_end_at: undefined,
		br_re_method: undefined,
	};


	detailBorrow: BorrowReturningDetailsWithListDocumentDto = new BorrowReturningDetailsWithListDocumentDto();
	member_borrow_selected: FindMemberBorrowDto = new FindMemberBorrowDto();
	borrowReSelected: BorrowReturningDto = new BorrowReturningDto();
	async componentDidMount() {
		await this.getAll();
	}
	onOpenModalCancel = async (item: BorrowReturningDto) => {
		await this.onAction(item);
		this.setState({ visibleModalCancel: true });
	}
	onOpenModalApprove = async (item: BorrowReturningDto) => {
		await this.onAction(item);
		this.setState({ visibleModalApprove: true });
	}
	onAction = async (item: BorrowReturningDto) => {
		this.setState({ isLoadDone: false });
		this.member_borrow_selected = await stores.borrowReturningStore.findMemberById(item.us_id_borrow);
		this.detailBorrow = await stores.borrowReturningStore.getBorrowReturnDetail(item.br_re_id);
		this.setState({ isLoadDone: true });
	}
	getAll = async () => {
		this.setState({ isLoadDone: false });
		await stores.borrowReturningStore.getAll(
			this.state.br_re_code,
			this.state.dkcb_code,
			this.state.us_id_borrow,
			this.state.br_re_start_at,
			this.state.br_re_end_at,
			[eBorrowReturningProcess.DA_DUYET.num],
			this.state.br_re_method,
			this.state.br_re_de_status,
			this.state.skipCount,
			this.state.pageSize);
		this.setState({ isLoadDone: true, visibleExportExcelBorrowReturning: false, visibleModalCancel: false, visibleDeliveryDocumentDirectedBorrowReturning: false, visibleModalDelivery: false, visibleModalPrintForm: false });
	}
	onChangePage = async (page: number, pagesize?: number) => {
		const { totalBorrowReturning } = stores.borrowReturningStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalBorrowReturning;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	onChangePageAfterRemove = async () => {
		const { totalBorrowReturning } = stores.borrowReturningStore;
		if (this.state.currentPage > 1 && totalBorrowReturning % 10 == 0) this.onChangePage(this.state.currentPage - 1, this.state.pageSize)

	}
	handleSubmitSearch = async () => {
		this.setState({ isLoadDone: false });
		if (this.state.dkcb_code != undefined) {
			await this.getAll();
			const { borrowReturningDtoListResult } = stores.borrowReturningStore;
			if (borrowReturningDtoListResult.length > 0) {
				let result = borrowReturningDtoListResult[0];
			}
		}
		else {
			this.onChangePage(1, this.state.pageSize);
		}
		this.setState({ isLoadDone: true });
	}
	onClear() {
		this.setState({ isLoadDone: false });
		this.setState({ us_id_borrow: undefined });
		this.setState({ isLoadDone: true });
	}
	onSuccessActionItem = async () => {
		this.setState({ isLoadDone: false });
		await this.setState({ isLoadDone: true });
	}

	openModalInformation = async (item: BorrowReturningDto) => {
		await this.onAction(item)
		this.setState({ visibleModalInforBorrowReturning: true })
	}

	onExtend = async (item: BorrowReturningDto) => {
		this.borrowReSelected.init(item);
		await this.onAction(item);
		this.setState({ visibleModalDelivery: true });
	}
	clearSearch = async () => {
		await this.setState({
			br_re_code: undefined,
			us_id_borrow: undefined,
		});
		this.getAll();
	}

	render() {
		const detailBorrow = this.detailBorrow != undefined ? this.detailBorrow : new BorrowReturningDetailsWithListDocumentDto();
		const member_borrow_selected = this.member_borrow_selected != undefined ? this.member_borrow_selected : new FindMemberBorrowDto();
		const { borrowReturningDtoListResult, totalBorrowReturning } = stores.borrowReturningStore;
		let self = this;
		let action: ColumnGroupType<BorrowReturningDto> = {
			title: "", children: [], key: 'action_author_index', fixed: 'right', className: "no-print center",
			render: (text: string, item: BorrowReturningDto) => (
				<div >
					{
						this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Deliver) &&
						<>
							<Button
								type="primary" icon={<IdcardOutlined />} title={L('DeliverDocuments')} size="small"
								style={{ marginLeft: '10px' }}
								onClick={() => this.onExtend(item)}
							></Button>
							<Button
								danger type="primary" icon={<StopOutlined />} title={L('CancelBorrowingRequest')} size="small"
								style={{ marginLeft: '10px', marginTop: "5px" }}
								onClick={() => { this.onOpenModalCancel(item); }}
							></Button>
						</>
					}
				</div>
			)
		};

		return (
			<>
				<Row gutter={[8, 8]} align='bottom'>
					{/* <Col {...cssColResponsiveSpan(24, 24, 3, 3, 3, 3)}>
						<h2>{this.props.titleHeader}</h2>
					</Col> */}
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)}>
						<strong style={{ width: "30%" }}>{L('ma_muon_tai_lieu')}:</strong><br />
						<Input value={this.state.br_re_code} allowClear={true} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ br_re_code: e.target.value.trim() })} placeholder={L("ma_muon_tai_lieu") + "..."} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)} >
						<strong style={{ width: "30%" }}>{L('Member')}:</strong><br />
						<SelectUser role_user={eUserType.Member.num} onClear={() => this.setState({ us_id_borrow: undefined })} update={this.state.isLoadDone} userItem={!!this.state.us_id_borrow ? [ItemUser.fromJS({ id: this.state.us_id_borrow })] : undefined} mode={undefined} onChangeUser={(value) => this.setState({ us_id_borrow: value[0].id })}></SelectUser>
						{/* <SelectUser onClear={() => this.onClear()} role_user={eUserType.Member.num} onChangeUser={async (value: ItemUser[]) => await this.setState({ us_id_borrow: value.map(item => item.id) })} /> */}
					</Col>
					<Col {...cssColResponsiveSpan(12, 6, 4, 3, 3, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} style={{ margin: ' 22px 0 0 px' }} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 9, 5, 3, 3, 3)} >
						{(this.state.br_re_code != undefined || this.state.us_id_borrow != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 10, 10, 11)} className='textAlign-col-768'>
						{this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Deliver) &&
							<Button
								type="primary"
								icon={<ShoppingCartOutlined />}
								style={{ margin: '0 10px 0 0' }}
								onClick={() => this.setState({ visibleDeliveryDocumentDirectedBorrowReturning: true })}
							>
								{L('DeliverDocumentsAtTheCounter')}
							</Button>
						}
						<Button
							type="primary"
							icon={<ExportOutlined />}
							onClick={() => this.setState({ visibleExportExcelBorrowReturning: true })}
						>
							{L('ExportData')}
						</Button>
					</Col>
				</Row>
				<TableDeliveryDocumentBorrowReturning
					actionTable={action}
					onAction={this.onAction}
					borrowReSelected={this.borrowReSelected}
					borrowReturningListResult={borrowReturningDtoListResult}
					pagination={{
						pageSize: this.state.pageSize,
						total: totalBorrowReturning,
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
				<Modal
					visible={this.state.visibleModalDelivery}
					title={L('DeliverDocuments')}
					footer={null}
					width='60vw'
					closable={false}
					maskClosable={false}
				>
					<DeliveryDocument
						onPrintFormBorrow={() => this.setState({ visibleModalPrintForm: true })}
						detailBorrow={this.detailBorrow}
						onSuccessAction={this.getAll}
						onSuccessActionItem={this.onSuccessActionItem}
						memberBorrow={this.member_borrow_selected}
						onCancel={() => this.setState({ visibleModalDelivery: false })}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalPrintForm}
					title={L('SeeDetails')}
					footer={null}
					width='50vw'
					closable={true}
					maskClosable={false}
					onCancel={() => this.setState({ visibleModalPrintForm: false })}
				>
					<PrintFormBorrowing
						memberBorrow={this.member_borrow_selected}
						detailBorrow={this.detailBorrow} />
				</Modal>
				<Modal
					visible={this.state.visibleDeliveryDocumentDirectedBorrowReturning}
					title={
						<Row>
							<Col span={12}>
								<h2>{L('DeliverDocumentsAtTheCounter')}</h2>
							</Col>
							<Col span={12} style={{ textAlign: 'right' }}>
								<Button danger style={{ margin: '0 26px 0 10px' }} onClick={() => { this.setState({ visibleDeliveryDocumentDirectedBorrowReturning: false }) }}>{L('Cancel')}</Button>
							</Col>
						</Row>
					}
					closable={false}
					footer={null}
					width='90vw'
					maskClosable={false}
				>
					<DeliveryDirectedDocument
						onSuccessAction={() => this.getAll()}
						onCancel={() => this.setState({ visibleModalDelivery: false })}
					/>
				</Modal>
				<ModalExportTableDeliverBorrowReturning
					borrowReturningListResult={borrowReturningDtoListResult}
					onCancel={() => this.setState({ visibleExportExcelBorrowReturning: false })}
					visible={this.state.visibleExportExcelBorrowReturning}
				/>
				<Modal
					visible={this.state.visibleModalCancel}
					title={L('CancelBorrowingRequest')}
					footer={null}
					width='60vw'
					closable={false}
					onCancel={() => this.setState({ visibleModalCancel: false })}
				>
					<CancelBorrowReturn
						detailBorrow={detailBorrow}
						memberBorrow={member_borrow_selected}
						onSuccessAction={this.getAll}
						onCancel={() => this.setState({ visibleModalCancel: false })}
						onChangePage={this.onChangePageAfterRemove}
					/>
				</Modal>
			</>
		)
	}
}