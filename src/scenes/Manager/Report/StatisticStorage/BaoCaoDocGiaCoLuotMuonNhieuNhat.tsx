import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Modal, Row, Table, message } from "antd";
import { SearchStatisticBorrowMostInput, StatisticBorrowMostMemberDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import TableBorrowDocument from './DetailReport/TableBorrowDocument';
import InputSearch from './DetailReport/InputSearch';
import { valueOfeGENDER } from '@src/lib/enumconst';
import { L } from '@lib/abpUtility';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export default class BaoCaoDocGiaCoLuotMuonNhieuNhat extends AppComponentBase {
	componentRef: any | null = null;

	state = {
		isLoadDone: true,
		isVisibleModelDetailMemberList: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		titleList: '',
		titleColumn: '',
		isHeaderReport: false,
	};
	listStatisticBorrowMostMembersDto: StatisticBorrowMostMemberDto[] = [];
	pagination: false;
	listIdSlected: number[] = [];
	inputSearch: SearchStatisticBorrowMostInput = new SearchStatisticBorrowMostInput();
	lastitem: number;
	dateTitle: string = "";
	today: Date = new Date();
	async componentDidMount() {
		await this.getAll();
	}
	getAll = async () => {
		if (this.inputSearch.year == undefined) {
			this.inputSearch.day = this.today.getDate();
			this.inputSearch.month = this.today.getMonth() + 1;
			this.inputSearch.year = this.today.getFullYear();
			this.dateTitle = 'NGÀY ' + this.inputSearch.day + "/" + this.inputSearch.month + "/" + this.inputSearch.year;
		}
		this.setState({ isLoadDone: false });
		this.listStatisticBorrowMostMembersDto = await stores.statisticStorageLibraryStore.statisticBorrowMostMember(this.inputSearch);
		this.setState({ isLoadDone: true })
	};
	handleOnSelectedCell(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected == undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ isVisibleModelDetailMemberList: true, titleList: titleList, titleColumn: titleColumn });
	}
	handleDataChange = async (inputSearch: SearchStatisticBorrowMostInput) => {
		this.inputSearch = inputSearch;
		if (this.inputSearch.day == undefined && this.inputSearch.month == undefined && this.inputSearch.year == undefined) {
			this.dateTitle = "";
		}
		if (this.inputSearch.day != undefined) {
			this.dateTitle = "NGÀY " + this.inputSearch.day + "/" + this.inputSearch.month + "/" + this.inputSearch.year;
		}
		if (this.inputSearch.day == undefined && this.inputSearch.month != undefined) {
			this.dateTitle = "THÁNG " + this.inputSearch.month + "/" + this.inputSearch.year;
		}
		if (this.inputSearch.day == undefined && this.inputSearch.month == undefined && this.inputSearch.year != undefined) {
			this.dateTitle = "NĂM " + this.inputSearch.year;
		}
		await this.getAll();
	};
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = this.listStatisticBorrowMostMembersDto.length;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const self = this;
		const columns = [
			{
				key: "stt", className: "start", title: <b>STT</b>,
				render: (text: string, item: StatisticBorrowMostMemberDto, index: number) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{this.state.pageSize! * (this.state.currentPage! - 1) + (index + 1)}</div>,
							props: {
								colSpan: 1
							}
						})
					}
					else return ({
						children: <div><b>TỔNG</b></div>,
						props: {
							colSpan: 6
						}
					})
				}
			},
			{
				key: "nameDisplay", className: "start", title: <b>Tên độc giả</b>,
				render: (text: string, item: StatisticBorrowMostMemberDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.nameDisplay}</div>,
							props: {
								colSpan: 1
							}
						})
					}
					else return ({
						props: {
							colSpan: 0
						}
					})
				},
			},
			{
				key: "me_sex", className: "start", title: <b>Giới tính</b>,
				render: (text: string, item: StatisticBorrowMostMemberDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.me_id != 0 ? valueOfeGENDER(item.me_sex) : null}</div>,
							props: {
								colSpan: 1
							}
						})
					}
					else return ({
						props: {
							colSpan: 0
						}
					})
				},
			},
			{
				key: "adress", className: "start", title: <b>Địa chỉ</b>,
				render: (text: string, item: StatisticBorrowMostMemberDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.me_address}</div>,
							props: {
								colSpan: 1
							}
						})
					}
					else return ({
						props: {
							colSpan: 0
						}
					})
				},
			}, {
				key: "numberPhone", className: "start", title: <b>Số điện thoại</b>,
				render: (text: string, item: StatisticBorrowMostMemberDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.me_phone}</div>,
							props: {
								colSpan: 1
							}
						})
					}
					else return ({
						props: {
							colSpan: 0
						}
					})
				},
			}, {
				key: "birthday", className: "start", title: <b>Ngày sinh</b>,
				render: (text: string, item: StatisticBorrowMostMemberDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.me_birthday}</div>,
							props: {
								colSpan: 1
							}
						})
					}
					else return ({
						props: {
							colSpan: 0
						}
					})
				},
			},
			{
				key: "number", className: "center", title: <b>Số lượng</b>,
				onCell: (record: StatisticBorrowMostMemberDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.borrowDocuments, "Danh sách các tài liệu mượn của ", record.me_name != null ? record.me_name + " " + this.dateTitle : this.dateTitle),
					};
				},
				render: (text: string, item: StatisticBorrowMostMemberDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.borrowDocuments!.length}</div>
					}
					else return <div><b>{item.borrowDocuments!.length}</b></div>
				}
			},

		];

		return (
			<Card >
				<Row gutter={[16, 16]}>
					<Col {...cssColResponsiveSpan(24, 18, 18, 12, 12, 12)} style={{ textAlign: "left" }}>
						<InputSearch onDataChanged={this.handleDataChange} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)} className='textAlign-col-992'>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={"baocaodocgiacoluotmuonnhieunhat"}
							nameFileExport={"Bao_cao_doc_gia_co_luot_muon_nhieu_nhat " + this.dateTitle.toLowerCase()}
							componentRef={this.componentRef}
						/>
					</Col>
				</Row>
				<div id='baocaodocgiacoluotmuonnhieunhat' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<h2 style={{ textAlign: 'center', paddingTop: '10px' }}>{"BÁO CÁO ĐỘC GIẢ CÓ LƯỢT MƯỢN NHIỀU NHẤT " + this.dateTitle.toUpperCase()}</h2>
					<Table
						className="centerTable"
						loading={!this.state.isLoadDone}
						size={'small'}
						bordered={true}
						dataSource={this.listStatisticBorrowMostMembersDto}
						columns={columns}
						pagination={{
							className: "ant-table-pagination ant-table-pagination-right no-print noprintExcel ",
							pageSize: this.state.pageSize,
							total: this.listStatisticBorrowMostMembersDto.length - 1,
							current: this.state.currentPage,
							showTotal: (tot) => "Tổng: " + tot + "",
							showQuickJumper: true,
							showSizeChanger: true,
							pageSizeOptions: ['10', '20', '50', '100', L('All')],
							onShowSizeChange(current: number, size: number) {
								self.onChangePage(current, size)
							},
							onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
						}}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</div>

				<Modal
					visible={this.state.isVisibleModelDetailMemberList}
					onCancel={() => { this.setState({ isVisibleModelDetailMemberList: false }) }}
					footer={null}
					width='70vw'
					closable={false}
				>
					<TableBorrowDocument
						do_in_id_arr={this.listIdSlected}
						title={this.state.titleList}
						titleTable={this.state.titleColumn != null ? this.state.titleColumn : "" + " " + this.dateTitle}
						onCancel={() => this.setState({ isVisibleModelDetailMemberList: false })}
					/>
				</Modal>
			</Card>
		)
	}
}