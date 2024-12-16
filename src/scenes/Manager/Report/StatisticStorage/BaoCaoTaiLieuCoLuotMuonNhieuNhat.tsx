import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Modal, Row, Table, message } from "antd";
import { SearchStatisticBorrowMostInput, StatisticBorrowMostDocumentDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import moment from 'moment';
import TableBorrowDocument from './DetailReport/TableBorrowDocument';
import InputSearch from './DetailReport/InputSearch';
import { L } from '@src/lib/abpUtility';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export default class BaoCaoTaiLieuCoLuotMuonNhieuNhat extends AppComponentBase {
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
		isVisibleModelDetailMemberList: false,
		titleList: '',
		titleColumn: '',
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		isHeaderReport: false,
	};
	listStatisticBorrowMostDocumentDto: StatisticBorrowMostDocumentDto[] = [];
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
		this.listStatisticBorrowMostDocumentDto = await stores.statisticStorageLibraryStore.statisticBorrowMostDocument(this.inputSearch);
		this.listStatisticBorrowMostDocumentDto.map(item => {
			this.listStatisticBorrowMostDocumentDto[this.listStatisticBorrowMostDocumentDto.length - 1].do_price += item.do_price;
		})
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
		this.onChangePage(1, this.state.pageSize);
	};
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = this.listStatisticBorrowMostDocumentDto.length;
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
				render: (text: string, item: StatisticBorrowMostDocumentDto, index: number) => {
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
							colSpan: 3
						}
					})
				}
			},
			{
				key: "nameDisplay", className: "start", title: <b>Tên tài liệu</b>,
				render: (text: string, item: StatisticBorrowMostDocumentDto) => {
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
				key: "do_date_available", className: "start", title: <b>Ngày có sẵn</b>,
				render: (text: string, item: StatisticBorrowMostDocumentDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.do_id != 0 ? moment(item.do_date_available).format("DD/MM/YYYY") : null}</div>,
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
				key: "do_price", className: "start", title: <b>Giá</b>,
				render: (text: string, item: StatisticBorrowMostDocumentDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.do_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
						})
					} else return ({
						children: <div><b>{item.do_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
					})
				}
			}, {
				key: "borrowDocuments", className: "start", title: <b>Số lượng</b>,
				render: (text: string, item: StatisticBorrowMostDocumentDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.borrowDocuments!.length}</div>
						})
					} else return ({
						children: <div><b>{item.borrowDocuments!.length}</b></div>
					})
				},
				onCell: (record: StatisticBorrowMostDocumentDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.borrowDocuments, "Danh sách ", record.nameDisplay!),
					};
				},
			},
		];

		return (
			<Card >
				<Row>
					<Col {...cssColResponsiveSpan(24, 18, 18, 12, 12, 12)} style={{ textAlign: "left" }}>
						<InputSearch onDataChanged={this.handleDataChange} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 12, 12, 12)} className='textAlign-col-992'>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={"baocaotailieucoluotmuonnhieunhat"}
							nameFileExport={"Bao_cao_tai_lieu_co_luot_muon_nhieu_nhat_" + this.dateTitle.toLowerCase()}
							componentRef={this.componentRef}
						/>
					</Col>
				</Row>
				<div id='baocaotailieucoluotmuonnhieunhat' ref={this.setComponentRef}>
					<h2 style={{ textAlign: 'center', paddingTop: '10px' }}>{"BÁO CÁO TÀI LIỆU CÓ LƯỢT MƯỢN NHIỀU NHẤT " + this.dateTitle.toUpperCase()}</h2>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Table
						className="centerTable"
						loading={!this.state.isLoadDone}
						size={'small'}
						dataSource={this.listStatisticBorrowMostDocumentDto}
						bordered={true}
						columns={columns}
						pagination={{
							className: "ant-table-pagination ant-table-pagination-right no-print ",
							pageSize: this.state.pageSize,
							total: this.listStatisticBorrowMostDocumentDto.length - 1,
							current: this.state.currentPage,
							showTotal: (tot) => "Tổng: " + tot + "",
							showQuickJumper: true,
							showSizeChanger: true,
							pageSizeOptions: ['10', '20', '50', '100', L("All")],
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
						titleTable={this.state.titleColumn}
						onCancel={() => this.setState({ isVisibleModelDetailMemberList: false })}
					/>
				</Modal>
			</Card>
		)
	}
}