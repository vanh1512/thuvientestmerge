import * as React from 'react';
import { Button, Card, Col, Input, Modal, Row } from 'antd';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, FindMemberBorrowDto, ItemUser, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import ExtendBorrowReturning from './components/ExtendBorrowReturning';
import { ColumnGroupType } from 'antd/lib/table';
import { eBorrowReturningProcess, eUserType } from '@src/lib/enumconst';
import InformationBorrowReturning from '../components/InformationBorrowReturning';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import SelectUser from '@src/components/Manager/SelectUser';
import TableExtendDocumentBorrowReturning from './components/TableExtendDocumentBorrowReturning';
import ModalExportTableExtendBorrowReturning from './components/ModalExportTableExtendBorrowReturning';

export interface IProps {
	titleHeader: string,
}
export default class TabExtendBorrowReturning extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalDueDate: false,
		visibleModalInforBorrowReturning: false,
		visibleExportExcelBorrowReturning: false,
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

	onExtend = async (item: BorrowReturningDto) => {
		await this.onAction(item);
		this.setState({ visibleModalDueDate: true });
	}
	async componentDidMount() {
		await this.getAll();
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
			[eBorrowReturningProcess.DA_GIAO_TAI_LIEU.num],
			this.state.br_re_method,
			this.state.br_re_de_status,
			this.state.skipCount,
			this.state.pageSize);
		this.setState({ isLoadDone: true, visibleExportExcelBorrowReturning: false, visibleModalDueDate: false });

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

	openModalInformation = async (item: BorrowReturningDto) => {
		await this.onAction(item)
		this.setState({ visibleModalInforBorrowReturning: true })
	}
	onClear() {
		this.setState({ isLoadDone: false });
		this.setState({ us_id_borrow: undefined });
		this.setState({ isLoadDone: true });
	}
	clearSearch = async () => {
		await this.setState({
			dkcb_code: undefined,
			us_id_borrow: undefined,
			br_re_code: undefined,
		});
		this.getAll();
	}
	render() {
		const { borrowReturningDtoListResult, totalBorrowReturning } = stores.borrowReturningStore;
		let self = this;
		let action: ColumnGroupType<BorrowReturningDto> = {
			title: "", children: [], key: 'action_author_index', fixed: 'right', className: "no-print center",
			render: (text: string, item: BorrowReturningDto) => (
				<div >
					{this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Extend) &&
						<Button
							type="primary" icon={<ExportOutlined />} title={L('ExtendDocuments')} size="small"
							style={{ marginLeft: '10px' }}
							onClick={() => this.onExtend(item)}
						></Button>}
					{
						this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Detail) &&
						<Button title={L('SeeDetails')} size="small" type='primary' icon={<EyeOutlined />}
							style={{ marginLeft: '10px' }} onClick={() => this.openModalInformation(item)}></Button>
					}
				</div>
			)
		};
		return (
			<>
				<Row gutter={[8, 8]} align='bottom'>
					{/* <Col {...cssColResponsiveSpan(24, 12, 4, 4, 4, 3)}>
						<h2>{this.props.titleHeader}</h2>
					</Col> */}
					<Col {...cssColResponsiveSpan(24, 24, 12, 4, 4, 4)}>
						<strong style={{ width: "30%" }}>{L('ma_muon_tai_lieu')}:</strong><br />
						<Input value={this.state.br_re_code} allowClear={true} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ br_re_code: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 12, 4, 4, 4)}>
						<strong style={{ width: "30%" }}>{L('CodeDkcb')}:</strong><br />
						<Input value={this.state.dkcb_code} allowClear={true} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ dkcb_code: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 12, 4, 4, 4)}>
						<strong style={{ width: "30%" }}>{L('Member')}:</strong><br />
						<SelectUser role_user={eUserType.Member.num} onClear={() => this.setState({ us_id_borrow: undefined })} update={this.state.isLoadDone} userItem={!!this.state.us_id_borrow ? [ItemUser.fromJS({ id: this.state.us_id_borrow })] : undefined} mode={undefined} onChangeUser={(value) => this.setState({ us_id_borrow: value[0].id })}></SelectUser>
						{/* <SelectUser onClear={() => this.onClear()} role_user={eUserType.Member.num} onChangeUser={async (value: ItemUser[]) => await this.setState({ us_id_borrow: value.map(item => item.id) })} /> */}
					</Col>
					<Col className='textAlignCenter-col-992px' {...cssColResponsiveSpan(24, 5, 4, 3, 3, 2)}>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 4, 4, 3, 3, 4)}>
						{(this.state.br_re_code != undefined || this.state.us_id_borrow != undefined || this.state.dkcb_code != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col className='textAlign-col-992' {...cssColResponsiveSpan(24, 24, 24, 6, 6, 6)}>
						<Button
							type="primary"
							icon={<ExportOutlined />}
							onClick={() => this.setState({ visibleExportExcelBorrowReturning: true })}
						>
							{L('ExportData')}
						</Button>
					</Col>
				</Row>
				<TableExtendDocumentBorrowReturning
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
					visible={this.state.visibleModalDueDate}
					title={L('ExtendBorrowedDocuments')}
					footer={null}
					width='60vw'
					closable={false}
				>
					<ExtendBorrowReturning
						isLoadDone={this.state.isLoadDone}
						detailBorrow={this.detailBorrow}
						memberBorrow={this.member_borrow_selected}
						onCancel={() => this.setState({ visibleModalDueDate: false })}
						onSuccessAction={this.getAll}
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
					<InformationBorrowReturning memberBorrow={this.member_borrow_selected} detailBorrow={this.detailBorrow} />

				</Modal>
				<ModalExportTableExtendBorrowReturning
					borrowReturningListResult={borrowReturningDtoListResult}
					onCancel={() => this.setState({ visibleExportExcelBorrowReturning: false })}
					visible={this.state.visibleExportExcelBorrowReturning}
				/>
			</>
		)
	}
}