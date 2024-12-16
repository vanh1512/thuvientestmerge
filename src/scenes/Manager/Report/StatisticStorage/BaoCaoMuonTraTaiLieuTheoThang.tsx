import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Button, Card, Col, DatePicker, Modal, Row, Table, message } from "antd";
import { StatisticBorrowReturningWithMonthDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import moment, { Moment } from 'moment';
import TableBorrowDocument from './DetailReport/TableBorrowDocument';
import { LineChartOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import BarChartDocument from './DetailReport/BarChartDocument';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';


export default class BaoCaoMuonTraTaiLieuTheoThang extends AppComponentBase {
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
		isVisibleModelDetailList: false,
		isBarChart: false,
		titleList: '',
		titleColumn: '',
		titleChart: '',
		year: Number(moment().format("YYYY")),
		isHeaderReport: false,
	};
	listStatisticBorrowReturningWithMonthDto: StatisticBorrowReturningWithMonthDto[] = [];
	listIdSlected: number[] = [];

	async componentDidMount() {
		await this.getAll();
	}

	getAll = async () => {
		this.setState({ isLoadDone: false })
		this.listStatisticBorrowReturningWithMonthDto = await stores.statisticStorageLibraryStore.statisticBorrowReturningWithMonth(this.state.year);
		this.setState({ isLoadDone: true })
	}

	handleOnSelectedCell(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected === undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ isVisibleModelDetailList: true, titleColumn: titleColumn, titleList: titleList });
	}
	handleBarChart(listStatisticBorrowReturningWithMonthDto: StatisticBorrowReturningWithMonthDto[], titleChart: string) {
		this.listStatisticBorrowReturningWithMonthDto = listStatisticBorrowReturningWithMonthDto;
		this.setState({ isBarChart: true, titleChart: titleChart });
	}
	onCancelChart = async () => {
		await this.setState({ isBarChart: false })
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const columns = [
			{
				key: "nameDisplay", className: "start", title: <b>Tháng</b>,
				render: (text: string, item: StatisticBorrowReturningWithMonthDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.nameDisplay}</div>
					}
					else return <div><b>{item.nameDisplay}</b></div>
				}
			},
			{
				key: "borrows", className: "center", title: <b>Số lượng tài liệu mượn</b>,
				onCell: (record: StatisticBorrowReturningWithMonthDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.borrows, record.nameDisplay! + " năm " + this.state.year, "Danh sách tài liệu mượn "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithMonthDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.borrows!.length}</div>
					}
					else return <div><b>{item.borrows!.length}</b></div>
				}
			},
			{
				key: "returnings", className: "center", title: <b>Số lượng tài liệu trả</b>,
				onCell: (record: StatisticBorrowReturningWithMonthDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.returnings, record.nameDisplay! + " năm " + this.state.year, "Danh sách tài liệu trả "),
					};
				},
				render: (text: string, item: StatisticBorrowReturningWithMonthDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.returnings!.length}</div>
					}
					else return <div><b>{item.returnings!.length}</b></div>
				}
			},
			{
				key: "returnings", className: "center", title: <b>Tỉ lệ mượn trả</b>,
				render: (text: string, item: StatisticBorrowReturningWithMonthDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.borrows!.length === 0 ? 0 + "%" : ((item.returnings!.length != 0 && item.borrows != undefined && item.returnings != undefined) && ((Math.round((item.returnings!.length / item.borrows!.length) * 100) / 100) * 100).toFixed(2) + "%")}</div>
					}
					else return <div><b>{item.borrows!.length === 0 ? 0 + "%" : ((item.returnings!.length != 0 && item.borrows != undefined && item.returnings != undefined) && ((Math.round((item.returnings!.length / item.borrows!.length) * 100) / 100) * 100).toFixed(2) + "%")}</b></div>
				}
			},
		];

		return (
			<Card >
				<Row>
					<Col {...cssColResponsiveSpan(8, 8, 4, 4, 3, 2)} style={{ display: 'flex', alignItems: 'center' }}>
						<b style={{ marginRight: '10px' }}>Năm</b>
						<DatePicker style={{ width: "100%", }}
							allowClear={false}
							onChange={(date: Moment | null, dateString: string) => this.setState({ year: Number(dateString) }, this.getAll)}
							format={"YYYY"}
							placeholder={L("Chọn năm") + "..."}
							picker='year'
							value={this.state.year != undefined ? moment(this.state.year, "YYYY") : undefined}
							disabledDate={(current) => current ? current >= moment().endOf('year') : false}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 20, 20, 21, 22)} className='textAlign-col-576'>
						<Button style={{ marginRight: "10px" }} type="primary" icon={<LineChartOutlined />} title={L('Biểu đồ')} onClick={() => this.handleBarChart(this.listStatisticBorrowReturningWithMonthDto, "BIỂU ĐỒ MƯỢN TRẢ TÀI LIỆU NĂM " + this.state.year)} >{L('Biểu đồ')}</Button>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={"baocaomuontratailieutheothang"}
							nameFileExport={"Báo cáo mượn trả tài liệu năm " + this.state.year}
							componentRef={this.componentRef}
						/>
					</Col>
				</Row>
				<div id='baocaomuontratailieutheothang' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<h1 style={{ fontSize: '24px', textAlign: 'center' }}>BÁO CÁO MƯỢN TRẢ TÀI LIỆU NĂM {this.state.year}</h1>
					<Table
						className="centerTable"
						loading={!this.state.isLoadDone}
						size={'small'}
						bordered={true}
						dataSource={this.listStatisticBorrowReturningWithMonthDto}
						columns={columns}
						pagination={false}
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
						onCancel={() => this.setState({ isVisibleModelDetailList: false })}
					/>
				</Modal>
				<Modal
					visible={this.state.isBarChart}
					onCancel={() => { this.setState({ isBarChart: false }) }}
					footer={null}
					width='70vw'
					closable={false}
					maskClosable={true}
				>
					<BarChartDocument
						listStatisticBorrowReturningWithMonthDto={this.listStatisticBorrowReturningWithMonthDto}
						onCancelChart={this.onCancelChart}
						titleChart={this.state.titleChart} />
				</Modal>
			</Card>
		)
	}
}