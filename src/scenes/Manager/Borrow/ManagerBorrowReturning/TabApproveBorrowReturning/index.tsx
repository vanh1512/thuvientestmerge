import * as React from 'react';
import { Badge, Button, Card, Col, Input, Modal, Popover, Row } from 'antd';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, FindMemberBorrowDto, ItemUser, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CaretDownOutlined, CheckCircleOutlined, DeleteOutlined, ExportOutlined, EyeOutlined, SearchOutlined, ShoppingCartOutlined, StopOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ApproveBorrowReturning from './components/ApproveBorrowReturning';
import CancelBorrowReturn from './components/CancelBorrowReturn';
import { ColumnGroupType } from 'antd/lib/table';
import { eBorrowReturningProcess, eUserType } from '@src/lib/enumconst';
import InformationBorrowReturning from '../components/InformationBorrowReturning';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import TableApproveBorrowReturning from './components/TableApproveBorrowReturning';
import SelectUser from '@src/components/Manager/SelectUser';
import ModalExportTableApproveBorrowReturning from './components/ModalExportTableApproveBorrowReturning';

const { confirm } = Modal;
export interface IProps {
	titleHeader: string,
}
export default class TabApproveBorrowReturning extends AppComponentBase<IProps> {
	state = {
		isLoadDone: false,
		visibleModalApprove: false,
		visibleModalCancel: false,
		visibleModalInforBorrowReturning: false,
		visibleExportExcelBorrowReturning: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		br_re_code: undefined,
		dkcb_code: "",
		us_id_borrow: undefined,
		br_re_start_at: undefined,
		br_re_end_at: undefined,
		br_re_method: undefined,
		br_re_de_status: undefined,
		br_re_id: undefined,
		clicked: false,
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
		this.borrowReSelected.init(item);
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
			[eBorrowReturningProcess.CHO_DUYET.num],
			this.state.br_re_method,
			this.state.br_re_de_status,
			this.state.skipCount,
			this.state.pageSize);
		this.setState({ isLoadDone: true, visibleExportExcelBorrowReturning: false, visibleModalCancel: false, visibleModalApprove: false });
	}
	onChangePage = async (page?: number, pagesize?: number) => {
		const { totalBorrowReturning } = stores.borrowReturningStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalBorrowReturning;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page! - 1) * this.state.pageSize, currentPage: page }, async () => {
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
	handleVisibleChange = (visible, item: BorrowReturningDto) => {
		this.setState({ clicked: visible, br_re_id: item.br_re_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	clearSearch = async () => {
		await this.setState({
			us_id_borrow: undefined,
			br_re_code: undefined,
		});
		await this.getAll();
	}
	content = (item: BorrowReturningDto) => (
		<div >
			{
				this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Detail) &&
				(<Row style={{ alignItems: "center" }}>
					<Button title={L('SeeDetails')} size="small" type='primary' icon={<EyeOutlined />}
						style={{ marginLeft: '10px', marginTop: "5px" }} onClick={() => { this.openModalInformation(item); this.hide() }}>
					</Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.openModalInformation(item); this.hide() }}>{L('SeeDetails')}</a>
				</Row>)
			}
			{
				this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Approve) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<CheckCircleOutlined />} title={L('ApproveBorrowingRequest')} size="small"
						style={{ marginLeft: '10px', marginTop: "5px" }}
						onClick={() => { this.onOpenModalApprove(item); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onOpenModalApprove(item); this.hide() }}>{L('ApproveBorrowingRequest')}</a>
				</Row>)
			}
			{
				(item.br_re_status == eBorrowReturningProcess.CHO_DUYET.num || item.br_re_status == eBorrowReturningProcess.CHO_DUYET.num) &&
				(
					this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Approve) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							danger type="primary" icon={<StopOutlined />} title={L('CancelBorrowingRequest')} size="small"
							style={{ marginLeft: '10px', marginTop: "5px" }}
							onClick={() => { this.onOpenModalCancel(item); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onOpenModalCancel(item); this.hide() }}>{L('CancelBorrowingRequest')}</a>
					</Row>)
				)
			}
		</div>
	)
	render() {
		const { borrowReturningDtoListResult, totalBorrowReturning } = stores.borrowReturningStore;
		let self = this;
		let action: ColumnGroupType<BorrowReturningDto> = {
			title: "", children: [], key: 'action_author_index', fixed: 'right', className: "no-print center", width: 50,
			render: (text: string, item: BorrowReturningDto) => (
				<Popover style={{ width: "200px" }} visible={this.state.clicked && this.state.br_re_id == item.br_re_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="leftTop" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.br_re_id == item.br_re_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};

		const detailBorrow = this.detailBorrow != undefined ? this.detailBorrow : new BorrowReturningDetailsWithListDocumentDto();
		const member_borrow_selected = this.member_borrow_selected != undefined ? this.member_borrow_selected : new FindMemberBorrowDto();
		return (
			<>
				<Row gutter={[16, 16]} align='bottom'>
					{/* <Col {...cssColResponsiveSpan(24, 24, 7, 7, 6, 7)}>
						<h2>{this.props.titleHeader}</h2>
					</Col> */}
					<Col {...cssColResponsiveSpan(24, 12, 7, 5, 4, 4)}>
						<strong style={{ width: "30%" }}>{L('ma_muon_tai_lieu')}:</strong><br />
						<Input allowClear={true} value={this.state.br_re_code} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ br_re_code: e.target.value.trim() })} placeholder={L("ma_muon_tai_lieu") + "..."} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 7, 5, 4, 4)}>
						<strong style={{ width: "30%" }}>{L('Member')}:</strong><br />
						<SelectUser update={this.state.isLoadDone} userItem={!!this.state.us_id_borrow ? [ItemUser.fromJS({ id: this.state.us_id_borrow })] : undefined} onClear={() => this.onClear()} role_user={eUserType.Member.num} onChangeUser={async (value: ItemUser[]) => await this.setState({ us_id_borrow: value[0].id })} />
					</Col>
					<Col className='textAlignCenter-col-768px' {...cssColResponsiveSpan(8, 6, 4, 4, 3, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 8, 4, 3, 3, 3)} >
						{(this.state.br_re_code != undefined || this.state.us_id_borrow != undefined) &&
							<Button title={L('ClearSearch')} danger icon={<DeleteOutlined />} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					{/* <Col {...cssColResponsiveSpan(24, 5, 8, 4, 4, 4)} style={{ textAlign: "right" }}> */}
					<Col {...cssColResponsiveSpan(24, 24, 24, 7, 10, 11)} style={{ textAlign: "right" }} >
						<Button
							type="primary"
							icon={<ExportOutlined />}
							onClick={() => this.setState({ visibleExportExcelBorrowReturning: true })}
						>
							{L('ExportData')}
						</Button>
					</Col>
				</Row>
				<Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
				</Row>
				<TableApproveBorrowReturning
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
					visible={this.state.visibleModalApprove}
					title={L('ApproveBorrowingRequest')}
					footer={null}
					width='70vw'
					closable={false}
				>
					<ApproveBorrowReturning
						detailBorrow={detailBorrow}
						onSuccessAction={this.getAll}
						onSuccessActionItem={this.onSuccessActionItem}
						memberBorrow={member_borrow_selected}
						onCancel={() => this.setState({ visibleModalApprove: false })}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalCancel}
					title={L('CancelBorrowingRequest')}
					footer={null}
					width='60vw'
					closable={false}
				>
					<CancelBorrowReturn
						detailBorrow={detailBorrow}
						memberBorrow={member_borrow_selected}
						onSuccessAction={this.getAll}
						onCancel={() => this.setState({ visibleModalCancel: false })}
						onChangePage={this.onChangePageAfterRemove}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalInforBorrowReturning}
					title={L('SeeDetails')}
					footer={null}
					width='60vw'
					closable={true}
					onCancel={() => this.setState({ visibleModalInforBorrowReturning: false })}
				>
					<InformationBorrowReturning
						memberBorrow={this.member_borrow_selected}
						detailBorrow={this.detailBorrow} />

				</Modal>
				<ModalExportTableApproveBorrowReturning
					borrowReturningListResult={borrowReturningDtoListResult}
					onCancel={() => this.setState({ visibleExportExcelBorrowReturning: false })}
					visible={this.state.visibleExportExcelBorrowReturning}
				/>
			</>
		)
	}
}