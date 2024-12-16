import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Button, Card, Col, Modal, Row, Table, message } from "antd";
import { StatisticBorrowReturningWithCategoryDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import TableBorrowDocument from './DetailReport/TableBorrowDocument';
import { LineChartOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import LineChartDocument from './DetailReport/LineChartDocument';
import moment from 'moment';
import BarChartItemDocument, { DataChart } from './DetailReport/BarChartItemDocument';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';

export default class BaoCaoMuonTraTaiLieuTheoDanhMuc extends AppComponentBase {
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
		isVisibleModelDetailList: false,
		isLineChart: false,
		isItemChart: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		titleList: '',
		titleColumn: '',
		titleTable: '',
		titleItemTable: '',
		isHeaderReport: false,
	};
	listStatisticBorrowReturningWithCategoryDto: StatisticBorrowReturningWithCategoryDto[] = [];
	listIdSlected: number[] = [];
	itemSlected: StatisticBorrowReturningWithCategoryDto;
	listDisplay: DataChart[] = [
		{ name: "Tài liệu mượn", key: 'borrows.length', color: '#009999' },
		{ name: "Tài liệu quá hạn", key: 'overdues.length', color: '#FF9900' },
		{ name: "Tài liệu cần gia hạn", key: 'needToRecover.length', color: '#6666FF' },
		{ name: "Tài liệu mất", key: 'losts.length', color: '#00EE00' },
		{ name: "Tài liệu yêu cầu gia hạn", key: 'requestExtensions.length', color: '#FF6A6A' },
		{ name: "Tài liệu được trả", key: 'returnings.length', color: '#00E5EE' },
	];

	async componentDidMount() {
		await this.getAll();

	}
	async getAll() {
		this.setState({ isLoadDone: false })
		this.listStatisticBorrowReturningWithCategoryDto = await stores.statisticStorageLibraryStore.statisticBorrowReturningWithCategory();

		this.setState({ isLoadDone: true })
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	handleOnSelectedCell(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected == undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ isVisibleModelDetailList: true, titleColumn: titleColumn, titleList: titleList });
	}
	handleLineChart(listStatisticBorrowReturningWithCategoryDto: StatisticBorrowReturningWithCategoryDto[], titleTable: string) {
		this.listStatisticBorrowReturningWithCategoryDto = listStatisticBorrowReturningWithCategoryDto;
		this.setState({ isLineChart: true, titleTable: titleTable });
	}
	handleClick(item: StatisticBorrowReturningWithCategoryDto | undefined, titleItemTable: string) {
		if (item?.key != undefined) {
			this.itemSlected = item;
		}
		this.setState({ isItemChart: true, titleItemTable: titleItemTable });

	}
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = this.listStatisticBorrowReturningWithCategoryDto.length;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	onCancelChart = async () => {
		await this.setState({ isLineChart: false })
	}
	onCancel = async () => {
		await this.setState({ isItemChart: false })
	}
	render() {
		const self = this;
		const columns = [
			{
				key: "stt", className: "start", title: <b>STT</b>,
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto, index: number) => {
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
							colSpan: 2
						}
					})
				}
			},
			{
				key: "nameDisplay", className: "start", title: <b>Danh mục tài liệu</b>,
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto) => {
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
				onCell: (record: StatisticBorrowReturningWithCategoryDto) => {
					return {
						onClick: (e) => this.handleClick(record, record.nameDisplay!),
					};
				},
			},
			{
				key: "borrows", className: "center", title: <b>Số tài liệu mượn</b>,
				onCell: (record: StatisticBorrowReturningWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.borrows, record.nameDisplay!, "Danh sách tài liệu mượn của "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.borrows!.length}</div>
					}
					else return <div><b>{item.borrows!.length}</b></div>
				}
			},
			{
				key: "overdues", className: "center", title: <b>Số lượng tài liệu quá hạn</b>,
				onCell: (record: StatisticBorrowReturningWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.overdues, record.nameDisplay!, "Danh sách tài liệu quá hạn của "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.overdues!.length}</div>
					}
					else return <div><b>{item.overdues!.length}</b></div>
				}

			},
			{
				key: "needToRecover", className: "center", title: <b>Số lượng tài liệu cần gia hạn</b>,
				onCell: (record: StatisticBorrowReturningWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.needToRecover, record.nameDisplay!, "Danh sách tài liệu cần gia hạn của "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.needToRecover!.length}</div>
					}
					else return <div><b>{item.needToRecover!.length}</b></div>
				}
			},
			{
				key: "losts", className: "center", title: <b>Số tài liệu bị mất</b>,
				onCell: (record: StatisticBorrowReturningWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.losts, record.nameDisplay!, "Danh sách tài liệu bị mất của "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.losts!.length}</div>
					}
					else return <div><b>{item.losts!.length}</b></div>
				}
			},
			{
				key: "requestExtensions", className: "center", title: <b>Số tài liệu có yêu cầu gia hạn</b>,
				onCell: (record: StatisticBorrowReturningWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.requestExtensions, record.nameDisplay!, "Danh sách tài liệu có yêu cầu gia hạn của "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.requestExtensions!.length}</div>
					}
					else return <div><b>{item.requestExtensions!.length}</b></div>
				}
			},
			{
				key: "returnings", className: "center", title: <b>Số lượng tài liệu được trả</b>,
				onCell: (record: StatisticBorrowReturningWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.returnings, record.nameDisplay!, "Danh sách tài liệu được trả của "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.returnings!.length}</div>
					}
					else return <div><b>{item.returnings!.length}</b></div>
				}
			},
		];

		return (
			<Card >
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<Button style={{ marginRight: "10px" }} type="primary" icon={<LineChartOutlined />} title={L('Biểu đồ')} onClick={() => this.handleLineChart(this.listStatisticBorrowReturningWithCategoryDto, "Biểu đồ mượn trả tài liệu theo danh mục " + moment().format('YYYY'))} >{L('Biểu đồ')}</Button>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={"baocaotailieumuontratheodanhmuc"}
							nameFileExport={"Bao_cao_muon_tra_tai_lieu_theo_danh_mua_nam" + moment().format('YYYY')}
							componentRef={this.componentRef}
						/>
					</Col>
				</Row>
				<div id='baocaotailieumuontratheodanhmuc' ref={this.setComponentRef}>
					<h1 style={{ fontSize: '24px', textAlign: 'center' }}>BÁO CÁO MƯỢN TRẢ TÀI LIỆU THEO DANH MỤC</h1>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Table
						className="centerTable"
						loading={!this.state.isLoadDone}
						size={'small'}
						bordered={true}
						dataSource={this.listStatisticBorrowReturningWithCategoryDto}
						columns={columns}
						pagination={{
							className: "ant-table-pagination ant-table-pagination-right no-print ",
							pageSize: this.state.pageSize,
							total: this.listStatisticBorrowReturningWithCategoryDto.length,
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
					visible={this.state.isVisibleModelDetailList}
					onCancel={() => { this.setState({ isVisibleModelDetailList: false }) }}
					footer={null}
					width='70vw'
					closable={false}
				>
					<TableBorrowDocument
						do_in_id_arr={this.listIdSlected}
						title={this.state.titleColumn}
						titleTable={this.state.titleList}
						onCancel={() => { this.setState({ isVisibleModelDetailList: false }) }}
					/>
				</Modal>
				<Modal
					visible={this.state.isLineChart}
					onCancel={() => { this.setState({ isLineChart: false }) }}
					footer={null}
					width='90vw'
					closable={false}
					maskClosable={true}
				>
					<LineChartDocument
						onCancelChart={this.onCancelChart}
						titleTable={this.state.titleTable}
						listSlected={this.listStatisticBorrowReturningWithCategoryDto}
						listLineChart={this.listDisplay} />,
				</Modal>
				<Modal
					visible={this.state.isItemChart}
					onCancel={() => { this.setState({ isItemChart: false }) }}
					footer={null}
					width='65vw'
					closable={false}
					maskClosable={true}
				>
					<BarChartItemDocument
						onCancelChart={this.onCancel}
						titleChart={"biểu đồ mượn trả tài liệu của " + this.state.titleItemTable}
						itemSlected={[this.itemSlected]}
						listDisplay={this.listDisplay} />,
				</Modal>
			</Card>
		)
	}
}