import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Button, Card, Col, Modal, Row, Table, message } from "antd";
import { DocumentInforDto, StatisticStatusOfDocumentsWithCategoryDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import TableDocumentInfor from './DetailReport/TableDocumentInfor';
import BarChartItemDocument, { DataChart } from './DetailReport/BarChartItemDocument';
import { LineChartOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import LineChartDocument from './DetailReport/LineChartDocument';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export default class BaoCaoTrangThaiTaiLieuTheoDanhMuc extends AppComponentBase {
	componentRef: any | null = null;

	state = {
		isLoadDone: true,
		isVisibleModelDetailList: false,
		isChart: false,
		isLineChart: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		titleList: '',
		titleColumn: '',
		titleChart: '',
		titleTable: '',
		isHeaderReport: false,
	};
	listStatisticStatusOfDocumentsWithCategoryDto: StatisticStatusOfDocumentsWithCategoryDto[] = [];
	listIdSlected: number[] = [];
	//Khai báo datakey để vẽ biểu đồ

	listDisplay: DataChart[] = [
		{ name: "Tài liệu mất", key: 'lostOfDocument.length', color: '#009999' },
		{ name: "Tài liệu hỏng", key: 'borrowOfDocument.length', color: '#FF9900' },
		{ name: "Tài liệu đang cho mượn", key: 'brokenOfDocument.length', color: '#6666FF' },
		{ name: "Tài liệu đang được sử dụng", key: 'validOfDocument.length', color: '#1DA57A' },
	];

	itemSlected: StatisticStatusOfDocumentsWithCategoryDto;
	async componentDidMount() {
		await this.getAll();

	}
	async getAll() {
		this.setState({ isLoadDone: false })
		this.listStatisticStatusOfDocumentsWithCategoryDto = await stores.statisticStorageLibraryStore.statisticStatusOfDocuments();
		this.setState({ isLoadDone: true })
	}

	handleOnSelectedCell(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected == undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ isVisibleModelDetailList: true, titleColumn: titleColumn, titleList: titleList });
	}
	handleClick(item: StatisticStatusOfDocumentsWithCategoryDto | undefined, titleChart: string) {
		if (item?.key != undefined) {
			this.itemSlected = item;
		}
		this.setState({ isChart: true, titleChart: titleChart });

	}
	handleLineChart(listStatisticStatusOfDocumentsWithCategoryDto: StatisticStatusOfDocumentsWithCategoryDto[], titleTable: string) {
		this.listStatisticStatusOfDocumentsWithCategoryDto = listStatisticStatusOfDocumentsWithCategoryDto;
		this.setState({ isLineChart: true, titleTable: titleTable });
	}
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = this.listStatisticStatusOfDocumentsWithCategoryDto.length;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	onCancel = async () => {
		await this.setState({ isVisibleModelDetailList: false })
	}
	onCancelChart = async () => {
		await this.setState({ isChart: false })
	}
	onCancelLineChart = async () => {
		await this.setState({ isLineChart: false })
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
				render: (text: string, item: StatisticStatusOfDocumentsWithCategoryDto, index: number) => {
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
				render: (text: string, item: StatisticStatusOfDocumentsWithCategoryDto, index: number) => {
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
				onCell: (record: StatisticStatusOfDocumentsWithCategoryDto) => {
					return {
						onClick: (e) => this.handleClick(record, record.nameDisplay!)
					};
				},
			},
			{
				key: "lostOfDocument", className: "center", title: <b>Số lượng tài liệu mất</b>,
				onCell: (record: StatisticStatusOfDocumentsWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.lostOfDocument, record.nameDisplay!, "Danh sách tài liệu mất của "),
					};
				},
				render: (text: string, item: StatisticStatusOfDocumentsWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.lostOfDocument!.length}</div>
					}
					else return <div><b>{item.lostOfDocument!.length}</b></div>
				}
			},
			{
				key: "brokenOfDocument", className: "center", title: <b>Số lượng tài liệu hỏng</b>,
				onCell: (record: StatisticStatusOfDocumentsWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.brokenOfDocument, record.nameDisplay!, "Danh sách tài liệu hỏng của "),
					};
				},
				render: (text: string, item: StatisticStatusOfDocumentsWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.brokenOfDocument!.length}</div>
					}
					else return <div><b>{item.brokenOfDocument!.length}</b></div>
				}
			},
			{
				key: "borrowOfDocument", className: "center", title: <b>Số lượng tài liệu đang cho mượn</b>,
				onCell: (record: StatisticStatusOfDocumentsWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.borrowOfDocument, record.nameDisplay!, "Danh sách tài liệu đang được cho mượn của "),
					};
				},
				render: (text: string, item: StatisticStatusOfDocumentsWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.borrowOfDocument!.length}</div>
					}
					else return <div><b>{item.borrowOfDocument!.length}</b></div>
				}
			},
			{
				key: "validOfDocument", className: "center", title: <b>Số lượng tài liệu đang được sử dụng</b>,
				onCell: (record: StatisticStatusOfDocumentsWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.validOfDocument, record.nameDisplay!, "Danh sách tài liệu đang được sử dụng của "),
					};
				},
				render: (text: string, item: StatisticStatusOfDocumentsWithCategoryDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.validOfDocument!.length}</div>
					}
					else return <div><b>{item.validOfDocument!.length}</b></div>
				}
			},
			{
				key: "totalDocument", className: "center", title: <b>Tổng</b>,
				onCell: (record: StatisticStatusOfDocumentsWithCategoryDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.totalDocument, record.nameDisplay!, "Danh sách tổng số tài liệu của "),
					};
				},
				render: (text: string, item: StatisticStatusOfDocumentsWithCategoryDto) => <div><b>{item.totalDocument!.length}</b></div>
			},
		];

		return (
			<Card >
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<Button style={{ marginRight: "10px" }} type="primary" icon={<LineChartOutlined />} title={L('Biểu đồ')} onClick={() => this.handleLineChart(this.listStatisticStatusOfDocumentsWithCategoryDto, "Biểu đồ trạng thái  tài liệu theo danh mục " + moment().format('YYYY'))} >{L('Biểu đồ')}</Button>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={"baocaotrangthaitailieu"}
							nameFileExport={"Bao_cao_trang_thai_tai_lieu " + moment().format("DD/MM/YYYY)")}
							componentRef={this.componentRef}
						/>
					</Col>
				</Row>
				<div id='baocaotrangthaitailieu' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width:"100%" }}><HeaderReport /></div>}
					<h1 style={{ fontSize: '24px', textAlign: 'center' }}>BÁO CÁO TRẠNG THÁI TÀI LIỆU</h1>
					<Table
						className="centerTable"
						loading={!this.state.isLoadDone}
						size={'small'}
						bordered={true}
						dataSource={this.listStatisticStatusOfDocumentsWithCategoryDto}
						columns={columns}
						pagination={{
							pageSize: this.state.pageSize,
							total: this.listStatisticStatusOfDocumentsWithCategoryDto.length,
							current: this.state.currentPage,
							showTotal: (tot) => "Tổng: " + tot + "",
							className: "ant-table-pagination ant-table-pagination-right no-print ",
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
					width='90vw'
					closable={false}
				>
					<TableDocumentInfor
						do_in_id_arr={this.listIdSlected}
						title={this.state.titleColumn}
						titleTable={this.state.titleList}
						onCancel={this.onCancel}
						pagination={{
							pageSize: this.state.pageSize,
							total: this.listIdSlected.length,
							current: this.state.currentPage,
							showTotal: (tot) => "Tổng: " + tot + "",
							// className: "ant-table-pagination ant-table-pagination-right no-print ",
							showQuickJumper: true,
							showSizeChanger: true,
							pageSizeOptions: ['10', '20', '50', '100', L("All")],
							onShowSizeChange(current: number, size: number) {
								self.onChangePage(current, size)
							},
							onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
						}}
					/>
				</Modal>
				<Modal
					visible={this.state.isChart}
					onCancel={() => { this.setState({ isChart: false }) }}
					footer={null}
					width='60vw'
					closable={false}
					maskClosable={true}

				>
					<BarChartItemDocument
						itemSlected={[this.itemSlected]}
						listDisplay={this.listDisplay}
						titleChart={"biểu đồ trạng thái tài liệu của " + this.state.titleChart}
						onCancelChart={this.onCancelChart}
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
						onCancelChart={this.onCancelLineChart}
						titleTable={this.state.titleTable}
						listSlected={this.listStatisticStatusOfDocumentsWithCategoryDto}
						listLineChart={this.listDisplay} />
				</Modal>
			</Card>
		)
	}
}