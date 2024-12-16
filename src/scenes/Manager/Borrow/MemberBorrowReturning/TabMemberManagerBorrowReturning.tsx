import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, DatePicker, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, ExtendtBorrowReturningInput, MemberSearchBorrowReturningInput, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import { eBorrowMethod, eBorrowReturningStatus } from '@src/lib/enumconst';
import TableMemberManagerBorrowReturning from './components/TableMemberManagerBorrowReturning';
import CancelMemberBorrowReturn from './components/MemberCancelBorrowReturn';
import SelectEnum from '@src/components/Manager/SelectEnum';
import DetailMemberManagerBorrowReturning from './components/DetailMemberManagerBorrowReturning';
import ExtendMemberBorrowReturning from './components/ExtendMemberBorrowReturning';
import moment, { Moment } from 'moment';
import ModalExportManagementBorrow from './components/ModalExportManagementBorrow';
import { cssColResponsiveSpan } from '@src/lib/appconst';


export default class MemberBorrowReturning extends React.Component {
	state = {
		isLoadDone: true,
		visibleExportExcelBorrowReturning: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		visibleModalCancel: false,
		visibleModalDetailManager: false,
		visibleModalExtendDate: false,
		br_re_code: undefined,
		br_re_start_at: undefined,
		br_re_end_at: undefined,
		br_re_status: undefined,
		br_re_method: undefined,
	};
	detail_borrow: BorrowReturningDetailsWithListDocumentDto = new BorrowReturningDetailsWithListDocumentDto();
	borrow_returning_selected: BorrowReturningDto = new BorrowReturningDto();

	async componentDidMount() {
		await this.getAll();

	}

	getAll = async () => {
		this.setState({ isLoadDone: false });
		let input = new MemberSearchBorrowReturningInput();
		input.br_re_code = this.state.br_re_code;
		input.br_re_start_at = this.state.br_re_start_at;
		input.br_re_end_at = this.state.br_re_end_at;
		input.br_re_status = this.state.br_re_status!;
		input.br_re_method = this.state.br_re_method!;
		input.skipCount = this.state.skipCount;
		input.maxResultCount = this.state.pageSize;
		await stores.borrowReturningStore.memberGetAll(input);
		this.setState({ isLoadDone: true, visibleExportExcelBorrowReturning: false, });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
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


	onMemberCancel = async (item: BorrowReturningDto) => {
		this.detail_borrow = await stores.borrowReturningStore.memberGetBorrowReturnDetail(item.br_re_id);
		this.setState({ visibleModalCancel: true });
	}
	onDetailManager = async (item: BorrowReturningDto) => {
		this.detail_borrow = await stores.borrowReturningStore.memberGetBorrowReturnDetail(item.br_re_id);
		this.setState({ visibleModalDetailManager: true });
	}

	onExtendMemberDocument = async (input: ExtendtBorrowReturningInput) => {
		this.setState({ isLoadDone: false });
		await stores.borrowReturningStore.extendMemberDocument(input);
		this.setState({ isLoadDone: true });
	}

	onOpenExtendModal = async (item: BorrowReturningDto) => {
		this.detail_borrow = await stores.borrowReturningStore.memberGetBorrowReturnDetail(item.br_re_id);
		this.borrow_returning_selected = item;
		this.setState({ visibleModalExtendDate: true });
	}

	onChangeDatePickerStart(date: Moment | null | undefined) {
		if (!date) {
			this.setState({ br_re_start_at: undefined });
		} else {
			// let start_from = new Date(date);
			this.setState({ br_re_start_at: date });
		}
	}

	onChangeDatePickerEnd(date: Moment | null | undefined) {
		if (!date) {
			this.setState({ br_re_end_at: undefined });
		} else {
			// let end_at = new Date(date);
			this.setState({ br_re_end_at: date });
		}
	}

	onCancel() {
		this.setState({ visibleExportExcelBorrowReturning: false });
	}
	onSuccessAction = async () => {
		this.setState({ isLoadDone: false });
		await this.getAll();
		await this.setState({ isLoadDone: true, visibleModalApprove: false, visibleModalCancel: false, visibleModalExtendDate: false });
	}
	clearSearch = async () => {
		await this.setState({
			br_re_code: undefined,
			br_re_start_at: undefined,
			br_re_status: undefined,
			br_re_method: undefined,
			br_re_end_at: undefined,
		});
	}
	render() {
		const self = this;
		const { borrowReturningDtoListResult, totalBorrowReturning } = stores.borrowReturningStore;
		const dateFormat = 'DD/MM/YYYY';

		return (
			<>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L('PersonalBorrowingAndReturningManagement')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>
						<Button
							type="primary"
							icon={<ExportOutlined />}
							onClick={() => this.setState({ visibleExportExcelBorrowReturning: true })}
						>
							{L('ExportData')}
						</Button>
					</Col>
				</Row>
				<Row gutter={[8, 8]} style={{ marginBottom: '10px' }} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 12, 8, 5, 4, 4)} >
						<strong style={{ width: "30%" }}>{L('DocumentBorrowingCode')}:</strong><br />
						<Input allowClear={true} onPressEnter={this.handleSubmitSearch} value={this.state.br_re_code} onChange={(e) => this.setState({ br_re_code: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 8, 5, 4, 4)} >
						<strong style={{ width: "30%" }}>{L('Status')}:</strong><br />
						<SelectEnum eNum={eBorrowReturningStatus} enum_value={this.state.br_re_status} onChangeEnum={(value: number | undefined) => this.setState({ br_re_status: value })} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 8, 5, 4, 4)} >
						<strong style={{ width: "30%" }}>{L('BorrowingMethod')}:</strong><br />
						<SelectEnum eNum={eBorrowMethod} enum_value={this.state.br_re_method} onChangeEnum={(value: number | undefined) => this.setState({ br_re_method: value })} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 8, 5, 3, 3)} >
						<strong style={{ width: "30%" }}>{L('BorrowingDate')}:</strong><br />
						<DatePicker
							allowClear={true}
							placeholder={L("Select")}
							style={{ width: "100%" }}
							format={dateFormat}
							onChange={(date: moment.Moment | null, dateString: string) => this.onChangeDatePickerStart(date)}
							disabledDate={(current) => current ? current >= moment().endOf('day') : false}
							value={this.state.br_re_start_at}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 8, 5, 3, 3)} >
						<strong style={{ width: "30%" }}>{L('ReturningDate')}:</strong><br />
						<DatePicker
							allowClear
							style={{ width: "100%" }}
							onChange={(date: moment.Moment | null, dateString: string) => this.onChangeDatePickerEnd(date)}
							format={dateFormat}
							placeholder={L("Select")}
							disabledDate={(current) => current ? current <= moment().startOf('day') : false}
							value={this.state.br_re_end_at}
						/>
					</Col>
					<Col style={{ textAlign: "center" }} {...cssColResponsiveSpan(24, 12, 8, 3, 3, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} style={{ margin: ' 20px 0 0 5px' }} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 5, 5, 3, 3, 3)} >
						{(this.state.br_re_code != undefined || this.state.br_re_start_at != undefined || this.state.br_re_status != undefined || this.state.br_re_method != undefined || this.state.br_re_end_at != undefined) &&
							<Button title={L('ClearSearch')} danger icon={<DeleteOutlined />} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
				</Row>
				<TableMemberManagerBorrowReturning
					onCancel={() => this.setState({ visibleModalDetailManager: true })}
					onExtendMemberDocument={(item: BorrowReturningDto) => this.onOpenExtendModal(item)}
					onMemberCancel={(item: BorrowReturningDto) => this.onMemberCancel(item)}
					onMemberDetailManager={(item: BorrowReturningDto) => this.onDetailManager(item)}
					borrowReturningListResult={borrowReturningDtoListResult}
					hasAction={true}
					is_printed={false}
					pagination={{
						pageSize: this.state.pageSize,
						total: totalBorrowReturning,
						current: this.state.currentPage,
						showTotal: (tot) => L("Total") + tot + "",
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
					visible={this.state.visibleModalCancel}
					title={L('CancelBorrowingRequest')}
					footer={null}
					width='60vw'
					closable={false}
					onCancel={() => this.setState({ visibleModalCancel: false })}
				>
					<CancelMemberBorrowReturn
						detail_borrow={this.detail_borrow}
						onCancel={() => this.setState({ visibleModalCancel: false })}
						onSuccessAction={this.onSuccessAction}
					/>
				</Modal>

				<Modal
					visible={this.state.visibleModalDetailManager}
					footer={null}
					width='60vw'
					closable={false}
					onCancel={() => this.setState({ visibleModalDetailManager: false })}>
					<DetailMemberManagerBorrowReturning
						detail_borrow={this.detail_borrow}
						onCancel={() => this.setState({ visibleModalDetailManager: false })}
						pagination={false}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalExtendDate}
					title={L('ExtendBorrowedDocuments')}
					footer={null}
					width='60vw'
					closable={true}
					onCancel={() => this.setState({ visibleModalExtendDate: false })}
				>
					<ExtendMemberBorrowReturning
						onSuccessAction={this.getAll}
						detailBorrow={this.detail_borrow}
						borrowReturing={this.borrow_returning_selected}
						isLoadDone={this.state.isLoadDone}
						onExtendRequest={this.onExtendMemberDocument}
						onCancel={() => this.setState({ visibleModalExtendDate: false })}
					/>
				</Modal>

				<ModalExportManagementBorrow
					visible={this.state.visibleExportExcelBorrowReturning}
					borrowReturningListResult={borrowReturningDtoListResult}
					onCancel={() => this.onCancel()}

				/>
			</>
		)
	}
}