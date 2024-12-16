import * as React from 'react';
import { Col, Row, Card, Table } from 'antd';
import { BillingItemDto, PlanDetailDto, ReceiptDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType } from 'antd/lib/table';
import { stores } from '@src/stores/storeInitializer';
import moment from 'moment';
import AppConsts from '@src/lib/appconst';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';

export interface IProps {
	receiptSelected: ReceiptDto;
}
export default class ReceiptFormExport extends React.Component<IProps> {
	state = {
		isLoadDone: true,
	};
	planDetailList: BillingItemDto[] = [];
	async componentDidMount() {
		this.setState({ isLoadDone: false })
		this.planDetailList = await stores.billingItemStore.getByListId(this.props.receiptSelected.bi_it_id_arr);
		const totalItem = new BillingItemDto();
		totalItem.bi_it_cost = 0;
		totalItem.bi_it_amount = 0;
		totalItem.bi_id = -1;
		this.planDetailList.map(item => {
			totalItem.bi_it_cost += item.bi_it_cost;
			totalItem.bi_it_amount += item.bi_it_amount;
			totalItem.bi_it_unit = item.bi_it_unit;
		}
		)
		this.planDetailList.push(totalItem);
		this.setState({ isLoadDone: true });
	}

	render() {

		const columns: ColumnsType<BillingItemDto> = [
			{
				title: L('N.O'), key: 'no_receipt_index', width: 50,
				render: (text: string, item: BillingItemDto, index: number) => {
					if (item.bi_id < 1) {
						return (
							{
								children: <div><b>TỔNG</b></div>,
								props: {
									colSpan: 2,
								}
							})

					} else
						return ({
							children: <div>{index + 1}</div>,
							props: {
								colSpan: 1,
							}
						})
				}
			},
			{
				title: L('NameBill'), key: 'bi_it_name',
				render: (text: string, item: BillingItemDto, index: number) => {
					if (item.bi_id == -1) {
						return (
							{
								children: <div><b>{item.bi_it_name}</b></div>,
								props: {
									colSpan: 0,
								}
							})

					} else
						return ({
							children: <div>{item.bi_it_name}</div>,
							props: {
								colSpan: 1,
							}
						})
				}
			},
			{
				title: L('Quantity'), key: 'bi_it_amount',
				render: (text: string, item: BillingItemDto) => <div>{item.bi_id == -1 ? <b>{AppConsts.formatNumber(item.bi_it_amount)}</b> : AppConsts.formatNumber(item.bi_it_amount)}</div>
			},
			{
				title: L('Unit'), key: 'bi_it_unit',
				render: (text: string, item: BillingItemDto) => <div>{item.bi_id == -1 ? "" : item.bi_it_unit}</div>
			},
			{
				title: L('Price'), key: 'bi_it_cost',
				render: (text: string, item: BillingItemDto) => <div>{item.bi_id == -1 ? "" : AppConsts.formatNumber(item.bi_it_cost) + " VND"}</div>
			},
			{
				title: L('Thành tiền'), key: 'bi_it_cost',
				render: (text: string, item: BillingItemDto) => <div>{item.bi_id == -1 ? <b>{AppConsts.formatNumber(item.bi_it_cost * item.bi_it_amount) + " VND"}</b> : AppConsts.formatNumber(item.bi_it_cost * item.bi_it_amount) + " VND"}</div>
			},
		];

		return (
			<>
				<HeaderReport></HeaderReport>
				<Row>
					<Col span={12}>
						<h2>{L('ExportReceipt')}</h2>
						<p><strong>Đơn vị:</strong>..........................................</p>
						<p><strong>Bộ phận:</strong>..........................................</p>
					</Col>
					<Col span={12}>
						<p style={{ textAlign: 'right', margin: '10px 50px 0 0' }}>Mẫu số 01 - VT</p>
						<p style={{ textAlign: 'end' }}>(Ban hành theo QĐ số: 15/2006/QĐ-BTS <br />
							ngày 20/3/2006 của Bộ trưởng BTC
							)
						</p>
					</Col>
				</Row>
				<Row justify='center'>
					<h1 style={{ fontSize: '50px', margin: 0 }}>Phiếu nhập kho</h1>
				</Row>
				<Row>
					<Col span={12}>
						<Row justify='end'>
							<p>Ngày: <b>
								{moment(this.props.receiptSelected!.rec_import_date).format("DD/MM/YYYY")}
							</b>
								<br />
								Số: <b>{this.props.receiptSelected!.rec_code} </b>
							</p>
						</Row>
					</Col>
					<Col span={12}>
						<Row justify='center'>
							<p>Nợ: <b>....................................................................</b>
								<br />
								Có: <b>..................................................................... </b>
							</p>
						</Row>
					</Col>
				</Row>

				<Row>
					<Col>
						<p>- Họ và tên người giao:......................................................................................</p>
						<p>- Nhập tại kho:.......................................................................................................</p>
						<p>- Địa điểm:...............................................................................................................</p>
						<p style={{ display: "flex" }}>- Lí do: <b dangerouslySetInnerHTML={{ __html: this.props.receiptSelected!.rec_reason != undefined ? this.props.receiptSelected!.rec_reason : "" }}></b></p>
					</Col>
				</Row>

				<Table
					className='centerTable'
					size={'small'}
					bordered={true}
					locale={{ "emptyText": L('NoData') }}
					columns={columns}
					dataSource={[...this.planDetailList]}
					pagination={false}
				/>


				<div className='container_total' style={{ margin: '10px 0 0 0' }}>
					<p><strong>Tổng số tiền(viết bằng chữ):</strong>.....................................................................</p>
					<p><strong>Số chứng từ gốc kèm theo</strong>: .......................................................................</p>
					<div>
						<p style={{ textAlign: 'end' }}>.......Ngày.......tháng.......năm 20........</p>
					</div>
				</div>

				<div className="footer noneBorder" style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div>
						<h4>Người lập phiếu</h4>
						<i>(Ký, họ tên)</i>
					</div>
					<div>
						<h4>Người giao hàng</h4>
						<i>(Ký, họ tên)</i>
					</div>
					<div>
						<h4>Thủ kho</h4>
						<i>(Ký, họ tên)</i>
					</div>
					<div>
						<h4>Kế toán trưởng </h4>
						<i>(Hoặc bộ phân có nhu cầu )</i>
					</div>
				</div>


			</>

		)
	}
}