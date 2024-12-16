import * as React from 'react';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SearchStatisticBorrowMostInput, StatisticPlanWithMonthDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Button, Card, Col, DatePicker, Modal, Row, Table, message } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import TableSupplier from '../../General/Supplier/components/TableSupplier';
import TablePlanRP from './DetailReport/TablePlanRP';
import LineChartPlan from './DetailReport/LineChartPlan';
import moment, { Moment } from 'moment';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export default class BaoCaoKeHoachMuaSam extends AppComponentBase {
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
		visibleModalDetail: false,
		isLineChart: false,
		titleList: '',
		titleColumn: '',
		titleTable: '',
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		year: Number(moment().format("YYYY")),
		isHeaderReport: false,
	};
	listStatisticMostPlan: StatisticPlanWithMonthDto[] = [];
	listIdSlected: number[] = [];
	year = new Date().getFullYear();

	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false })
		this.listStatisticMostPlan = await stores.statisticStorageLibraryStore.statisticPlanWithMonth(this.state.year);
		this.setState({ isLoadDone: true })
	}

	handleOnSelectedCell(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected == undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ visibleModalDetail: true, titleColumn: titleColumn, titleList: titleList });
	}
	handleOnSelectedCellCard(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected == undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ visibleModalDetail: true, titleColumn: titleColumn, titleList: titleList });
	}
	handleLineChart(listStatisticMostPlan: StatisticPlanWithMonthDto[], titleTable: string) {
		this.listStatisticMostPlan = listStatisticMostPlan;
		this.setState({ isLineChart: true, titleTable: titleTable });
	}
	onCancelChart = async () => {
		await this.setState({ isLineChart: false })
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = this.listStatisticMostPlan.length;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	render() {
		const self = this;
		const columns = [
			{
				key: "nameDisplay", className: "start", title: <b>Tháng</b>,
				render: (text: string, item: StatisticPlanWithMonthDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.nameDisplay}</div>
					}
					else return <div><b>{item.nameDisplay}</b></div>
				}
			},
			{
				key: "plan", className: "center", title: <b>Kế hoạch mua sắm</b>,
				onCell: (record: StatisticPlanWithMonthDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCellCard(record.plans, record.nameDisplay! + " năm " + this.state.year, "Danh sách kế hoạch mua sắm "),
					};
				},
				render: (text: string, item: StatisticPlanWithMonthDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.plans!.length}</div>
					}
					else return <div><b>{item.plans!.length}</b></div>
				}
			},
			{
				key: "totalPriceplans", className: "start", title: <b>Tổng giá</b>,
				render: (text: string, item: StatisticPlanWithMonthDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return ({
							children: <div>{item.totalPriceplans.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
						})
					} else return ({
						children: <div><b>{item.totalPriceplans.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
					})
				}
			},

		]
		return (
			<Card>
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
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 20, 20, 21, 22)} className='textAlign-col-576'>
						<Button style={{ marginRight: "10px" }} type="primary" icon={<LineChartOutlined />} title={L('Biểu đồ')} onClick={() => this.handleLineChart(this.listStatisticMostPlan, "Biểu đồ các kế hoạch mua sắm " + this.state.year)} >{L('Biểu đồ')}</Button>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={"baocaokehoachmuasam"}
							nameFileExport={"Bao_cao_ke_hoach_mua_sam_nam_" + this.state.year}
							componentRef={this.componentRef}
						/>
					</Col>
				</Row>
				<div id='baocaokehoachmuasam' ref={this.setComponentRef}>
					<h1 style={{ fontSize: '24px', textAlign: 'center' }}>{"BÁO CÁO KẾ HOẠCH MUA SẮM " + this.state.year}</h1>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Table
						className="centerTable"
						loading={!this.state.isLoadDone}
						size={'small'}
						bordered={true}
						dataSource={this.listStatisticMostPlan}
						columns={columns}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}
				</div>
				<Modal
					visible={this.state.visibleModalDetail}
					onCancel={() => { this.setState({ visibleModalDetail: false }) }}
					footer={null}
					width='70vw'
					closable={false}
					maskClosable={false}
				>
					<TablePlanRP
						su_id_arr={this.listIdSlected}
						title={this.state.titleColumn}
						titleTable={this.state.titleList}
						onCancel={() => this.setState({ visibleModalDetail: false })}
					/>
				</Modal>
				<Modal
					visible={this.state.isLineChart}
					onCancel={() => { this.setState({ isLineChart: false }) }}
					footer={null}
					width='85vw'
					closable={false}
					maskClosable={true}
				>
					<LineChartPlan
						listStatisticMostPlan={this.listStatisticMostPlan}
						titleTable={this.state.titleTable}
						onCancelChart={this.onCancelChart} />
				</Modal>

			</Card>
		)
	}
}