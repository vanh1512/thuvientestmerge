import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Button, Card, Col, DatePicker, Modal, Row, Table, message } from "antd";
import { StatisticStatusOfMembersDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import TableMember from './DetailReport/TableMember';
import TableMemberCard from './DetailReport/TableMemberCard';
import LineChartMember from './DetailReport/LineChartMember';
import { LineChartOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import moment, { Moment } from 'moment';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export default class BaoCaoTrangThaiNguoiDungTheoThang extends AppComponentBase {
	componentRef: any | null = null;

	state = {
		isLoadDone: true,
		isVisibleModelDetailMemberList: false,
		isVisibleModelDetailMemberCardList: false,
		isLineChart: false,
		titleList: '',
		titleColumn: '',
		titleTable: '',
		year: Number(moment().format("YYYY")),
		isHeaderReport: false,
	};
	listStatisticStatusOfMembersDto: StatisticStatusOfMembersDto[] = [];
	listIdSlected: number[] = [];


	async componentDidMount() {
		await this.getAll()
	}
	getAll = async () => {
		this.setState({ isLoadDone: false })
		this.listStatisticStatusOfMembersDto = await stores.statisticStorageLibraryStore.statisticStatusOfMembers(this.state.year);
		this.setState({ isLoadDone: true })
	}
	handleOnSelectedCell(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected == undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ isVisibleModelDetailMemberList: true, titleColumn: titleColumn, titleList: titleList });
	}
	handleOnSelectedCellCard(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
		if (listIdSlected == undefined || listIdSlected.length < 1) {
			message.error('Danh sách trống');
			return;
		}
		this.listIdSlected = listIdSlected;
		this.setState({ isVisibleModelDetailMemberCardList: true, titleColumn: titleColumn, titleList: titleList });
	}
	handleLineChart(listStatisticStatusOfMembersDto: StatisticStatusOfMembersDto[], titleTable: string) {
		this.listStatisticStatusOfMembersDto = listStatisticStatusOfMembersDto;
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
	render() {
		const columns = [
			{
				key: "nameDisplay", className: "start", title: <b>Tháng</b>,
				render: (text: string, item: StatisticStatusOfMembersDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.nameDisplay}</div>
					}
					else return <div><b>{item.nameDisplay}</b></div>
				}
			},
			{
				key: "newMember", className: "center", title: <b>Người dùng mới</b>,
				onCell: (record: StatisticStatusOfMembersDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCell(record.newMember, record.nameDisplay != "TỔNG" ? "của " + record.nameDisplay + " năm " + this.state.year : record.nameDisplay, "Danh sách người dùng mới "),
					};
				},
				render: (text: string, item: StatisticStatusOfMembersDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.newMember!.length}</div>
					}
					else return <div><b>{item.newMember!.length}</b></div>
				}
			},
			{
				key: "newMemberCard", className: "center", title: <b>Thẻ người dùng mới</b>,
				onCell: (record: StatisticStatusOfMembersDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCellCard(record.newMemberCard, record.nameDisplay != "TỔNG" ? "của " + record.nameDisplay + " năm " + this.state.year : record.nameDisplay, "Danh sách thẻ người dùng mới "),
					};
				},
				render: (text: string, item: StatisticStatusOfMembersDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.newMemberCard!.length}</div>
					}
					else return <div><b>{item.newMemberCard!.length}</b></div>
				}
			},
			{
				key: "memberCardExtend", className: "center", title: <b>Thẻ được gia hạn</b>,
				onCell: (record: StatisticStatusOfMembersDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCellCard(record.memberCardExtend, record.nameDisplay != "TỔNG" ? "của " + record.nameDisplay + " năm " + this.state.year : record.nameDisplay, "Danh sách thẻ được gia hạn "),
					};
				},
				render: (text: string, item: StatisticStatusOfMembersDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.memberCardExtend!.length}</div>
					}
					else return <div><b>{item.memberCardExtend!.length}</b></div>
				}
			},
			{
				key: "memberCardBlock", className: "center", title: <b>Thẻ bị khóa</b>,
				onCell: (record: StatisticStatusOfMembersDto) => {
					return {
						onClick: (e) => this.handleOnSelectedCellCard(record.memberCardBlock, record.nameDisplay != "TỔNG" ? "của " + record.nameDisplay + " năm " + this.state.year : record.nameDisplay, "Danh sách thẻ bị khóa "),
					};
				},
				render: (text: string, item: StatisticStatusOfMembersDto) => {
					if (item.nameDisplay != 'TỔNG') {
						return <div>{item.memberCardBlock!.length}</div>
					}
					else return <div><b>{item.memberCardBlock!.length}</b></div>
				}
			},

		];

		return (
			<Card >
				<Row>
					<Col {...cssColResponsiveSpan(8, 8, 4, 4, 3, 2)} style={{ display: 'flex', alignItems: 'center' }}>
						<b style={{ marginRight: '10px' }}>Năm</b>
						<DatePicker
							style={{ width: "100%", }}
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
						<Button style={{ marginRight: "10px" }} type="primary" icon={<LineChartOutlined />} title={L('Biểu đồ')} onClick={() => this.handleLineChart(this.listStatisticStatusOfMembersDto, "biểu đồ trạng thái người dùng năm " + this.state.year)} >{L('Biểu đồ')}</Button>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={"baocaotrangthainguoidung"}
							nameFileExport={"Bao_cao_trang_thai_nguoi_dung_nam_" + this.state.year}
							componentRef={this.componentRef}
						/>
					</Col>
				</Row>
				<div id='baocaotrangthainguoidung' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<h1 style={{ fontSize: '24px', textAlign: 'center' }}>{"BÁO CÁO TRẠNG THÁI NGƯỜI DÙNG NĂM " + this.state.year}</h1>
					<Table
						className="centerTable"
						loading={!this.state.isLoadDone}
						size={'small'}
						bordered={true}
						dataSource={this.listStatisticStatusOfMembersDto}
						columns={columns}
						pagination={false}
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
					<TableMember
						me_id_arr={this.listIdSlected}
						title={this.state.titleColumn}
						titleTable={this.state.titleList}
						onCancel={() => this.setState({ isVisibleModelDetailMemberList: false })}
					/>
				</Modal>
				<Modal
					visible={this.state.isVisibleModelDetailMemberCardList}
					onCancel={() => { this.setState({ isVisibleModelDetailMemberCardList: false }) }}
					footer={null}
					width='70vw'
					closable={false}
				>
					<TableMemberCard
						me_card_id_arr={this.listIdSlected}
						title={this.state.titleColumn}
						titleTable={this.state.titleList}
						onCancel={() => this.setState({ isVisibleModelDetailMemberCardList: false })}
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
					<LineChartMember
						listStatisticStatusOfMembersDto={this.listStatisticStatusOfMembersDto}
						titleTable={this.state.titleTable}
						onCancelChart={this.onCancelChart} />
				</Modal>
			</Card>
		)
	}
}