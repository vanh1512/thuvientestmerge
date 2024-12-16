import * as React from 'react';
import { Col, Row, Button, Input, Modal } from 'antd';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, FindMemberBorrowDto, ItemUser, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ContainerOutlined, DeleteOutlined, ExportOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import ReturnDocument from './components/ReturnDocument';
import { ColumnGroupType } from 'antd/lib/table';
import { eBorrowReturningProcess, eUserType } from '@src/lib/enumconst';
import InformationBorrowReturning from '../components/InformationBorrowReturning';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import SelectUser from '@src/components/Manager/SelectUser';
import TableReturnDocumentBorrowReturning from './components/TableReturnDocumentBorrowReturning';
import ModalExportTableReturnBorrowReturning from './components/ModalExportTableReturnBorrowReturning';

export interface IProps {
	titleHeader: string,
}
export default class TabReturnDocumentBorrowReturning extends AppComponentBase<IProps> {
	state = {
		isLoadDone: false,
		visibleModalReturn: false,
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
	onReturnDocument = async (item: BorrowReturningDto) => {
		await this.onAction(item);
		this.setState({ visibleModalReturn: true });
	}
	async componentDidMount() {
		await this.getAll();
	}

	clearSearch = async () => {
		await this.setState({
			br_re_code: undefined,
			us_id_borrow: undefined,
			dkcb_code: undefined,
		});
		this.getAll();
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
			[eBorrowReturningProcess.DA_GIAO_TAI_LIEU.num, eBorrowReturningProcess.DA_TRA_1PHAN.num, eBorrowReturningProcess.DA_TRA_HET.num],
			this.state.br_re_method,
			this.state.br_re_de_status,
			this.state.skipCount,
			this.state.pageSize);
		this.setState({ isLoadDone: true, visibleExportExcelBorrowReturning: false, visibleModalReturn: false, visibleModalInforBorrowReturning: false });
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
				// this.onOpenModalExtend(result);
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
	render() {
		const { borrowReturningDtoListResult, totalBorrowReturning } = stores.borrowReturningStore;
		let self = this;
		let action: ColumnGroupType<BorrowReturningDto> = {
			title: "", children: [], key: 'action_author_index', fixed: 'right', className: "no-print center",
			render: (text: string, item: BorrowReturningDto) =>
			(<>
				{item.br_re_status != eBorrowReturningProcess.DA_TRA_HET.num ?
					<div >
						{
							this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Return) &&
							<Button
								type="primary" icon={<ContainerOutlined />} title={L('ReceiveDocuments')} size="small"
								style={{ marginLeft: '10px' }}
								onClick={() => this.onReturnDocument(item)}
							></Button>
						}
						{
							this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Detail) &&
							<Button title={L('SeeDetails')} size="small" type='primary' icon={<EyeOutlined />}
								style={{ marginLeft: '10px' }} onClick={() => this.openModalInformation(item)}></Button>

						}
					</div>
					:
					<div>
						{
							this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Detail) &&
							<Button title={L('SeeDetails')} size="small" type='primary' icon={<EyeOutlined />}
								style={{ marginLeft: '10px' }} onClick={() => this.openModalInformation(item)}></Button>
						}
					</div>
				}
			</>
			)
		};

		return (
			<>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 12, 6, 6, 4, 6)}>
						<strong>{L('ma_muon_tai_lieu')}:</strong><br />
						<Input value={this.state.br_re_code} allowClear={true} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ br_re_code: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 6, 6, 4, 6)}>
						<strong style={{ width: "30%" }}>{L('CodeDkcb')}:</strong><br />
						<Input value={this.state.dkcb_code} allowClear={true} onPressEnter={() => this.handleSubmitSearch()} onChange={(e) => this.setState({ dkcb_code: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 6, 6, 4, 6)}>
						<strong style={{ width: "30%" }}>{L('Member')}:</strong><br />
						<SelectUser role_user={eUserType.Member.num} onClear={() => this.setState({ us_id_borrow: undefined })} update={this.state.isLoadDone} userItem={!!this.state.us_id_borrow ? [ItemUser.fromJS({ id: this.state.us_id_borrow })] : undefined} mode={undefined} onChangeUser={(value) => this.setState({ us_id_borrow: value[0].id })}></SelectUser>
					</Col>
					<Col {...cssColResponsiveSpan(12, 12, 6, 6, 4, 2)}>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 12, 18, 18, 4, 2)} style={{ textAlign: "end" }}>
						{(this.state.br_re_code != undefined || this.state.us_id_borrow != undefined || this.state.dkcb_code != undefined) &&
							<Button style={{ textAlign: 'end' }} danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 6, 6, 4, 2)} style={{ textAlign: "end" }}>
						<Button
							type="primary"
							icon={<ExportOutlined />}
							onClick={() => this.setState({ visibleExportExcelBorrowReturning: true })}
						>
							{L('ExportData')}
						</Button>
					</Col>
				</Row>

				<TableReturnDocumentBorrowReturning
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
					visible={this.state.visibleModalReturn}
					title={
						<h2>{L('ReturnDocuments')}</h2>
					}
					footer={null}
					width='90vw'
					closable={false}
					maskClosable={true}
				>
					<ReturnDocument
						borrowReSelected={this.borrowReSelected}
						detailBorrow={this.detailBorrow}
						memberBorrow={this.member_borrow_selected}
						onCancel={() => this.setState({ visibleModalReturn: false })}
						onSuccessAction={this.getAll}
						onSuccessRecharge={this.onAction}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalInforBorrowReturning}
					title={L('SeeDetails')}
					footer={null}
					width='70vw'
					closable={true}
					onCancel={() => this.setState({ visibleModalInforBorrowReturning: false })}
				>
					<InformationBorrowReturning memberBorrow={this.member_borrow_selected} detailBorrow={this.detailBorrow} />

				</Modal>
				<ModalExportTableReturnBorrowReturning
					borrowReturningListResult={borrowReturningDtoListResult}
					onCancel={() => this.setState({ visibleExportExcelBorrowReturning: false })}
					visible={this.state.visibleExportExcelBorrowReturning}
				/>
			</>
		)
	}
}