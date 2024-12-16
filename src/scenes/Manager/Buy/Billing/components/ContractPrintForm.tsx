import * as React from 'react';
import { Col, Row, Table, } from 'antd';
import { BillingDto, BillingItemDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { stores } from '@src/stores/storeInitializer';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';

export interface IProps {
	billingItemListResult: BillingItemDto[],
	billingResult?: BillingDto,
	pagination: TablePaginationConfig | false;
}
export default class ContractPrintForm extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleModalFile: false,
	};
	billingSelected: BillingDto = new BillingDto();

	async componentDidMount() {
		await this.getSupplier();
	}
	getSupplier = async () => {
		this.setState({ isLoadDone: false });
		await stores.supplierStore.getAll(undefined, undefined, undefined);
		this.setState({ isLoadDone: false });
	}

	render() {
		const { billingItemListResult, billingResult, pagination } = this.props;
		const { supplierListResult } = stores.supplierStore;
		let resultSupplier = supplierListResult != undefined && supplierListResult.find(item => item.su_id == billingResult?.su_id.id);
		let resultTotal = 0;
		if (billingItemListResult != undefined) {
			billingItemListResult.forEach(item => {
				let price = item.bi_it_cost * item.bi_it_amount;
				resultTotal = resultTotal + price;
			});
		}

		const columns: ColumnsType<BillingItemDto> = [
			{ title: L('N.O'), width: 50, dataIndex: '', key: 'no_contract_print_form', render: (text: string, item: BillingItemDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div>, },
			{ title: L('DocumentName'), dataIndex: 'bi_export', key: 'bi_item_unit_contract_print_form', render: (text: string, item: BillingItemDto) => <div>{item.bi_it_name}</div> },
			{ title: L('Unit'), dataIndex: 'bi_export', key: 'bi_item_unit_contract_print_form', render: (text: string, item: BillingItemDto) => <div>{item.bi_it_unit}</div> },
			{ title: L('Quantity'), dataIndex: 'bi_export', key: 'bi_item_quantity_contract_print_form', render: (text: string, item: BillingItemDto) => <div>{item.bi_it_amount}</div> },
			{ title: L('Price'), dataIndex: 'bi_note', key: 'bi_item_price_contract_print_form', render: (text: string, item: BillingItemDto) => <div>{item.bi_it_cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div> },
			{ title: L('Total'), dataIndex: 'bi_note', key: 'bi_total_contract_print_form', render: (text: string, item: BillingItemDto) => <div>{(item.bi_it_amount * item.bi_it_cost).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div> },
		];

		return (
			<div>
				<HeaderReport />
				{resultSupplier != undefined && resultSupplier != false &&

					<div >
						<div style={{ paddingLeft: '10%' }}>
							<b style={{ fontWeight: 500, fontSize: "20px" }}>{billingResult?.su_id != undefined ? billingResult.su_id.name : ""}</b>
							<p><b style={{ fontWeight: 500 }}>Mã thuế: </b>{resultSupplier.su_tax_code}</p>
							<p><b style={{ fontWeight: 500 }}>Mã fax: </b> {resultSupplier.su_contact_fax}</p>
							<p><b style={{ fontWeight: 500 }}>Địa chỉ: </b>  {resultSupplier.su_contact_address}</p>
							<p><b style={{ fontWeight: 500 }}>Số điện thoại: </b> {resultSupplier.su_contact_phone}</p>
							<p><b style={{ fontWeight: 500 }}>Địa chỉ email: </b> {resultSupplier.su_contact_email}</p>
						</div>
						<hr />
					</div>
				}
				<Row>
					<Col span={24} style={{ textAlign: "center" }}>
						<h1 style={{ margin: 0, lineHeight: 1.25 }}>Hoá đơn</h1>
						<h2 style={{ margin: 0 }}>Giá trị gia tăng</h2>
						<i style={{ fontWeight: 500 }}>Ngày........tháng........năm 20.....</i>
					</Col>
				</Row>


				<div style={{ paddingLeft: 15, paddingTop: 15 }}>
					<p><b style={{ fontWeight: 500 }}>Họ tên người mua hàng</b>:.............................................................................</p>
					<p><b style={{ fontWeight: 500 }}>Đơn vị</b>:.................................................................................................................</p>
					<p><b style={{ fontWeight: 500 }}>Địa chỉ người mua</b>:........................................................................................ <b style={{ fontWeight: 500 }}> Mã số thuế</b>:..............................................................................</p>
				</div>
				<Row style={{ marginTop: "15px" }}>
					<Col span={24}>
						<Table
							rowClassName={(record, index) => (this.billingSelected.bi_id == record.bi_id) ? "bg-click" : "bg-white"}
							rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
							size={'middle'}
							bordered={true}
							locale={{ "emptyText": L('NoData') }}
							columns={columns}
							dataSource={billingItemListResult.length > 0 ? billingItemListResult : []}
							pagination={false}

						/>
					</Col>
				</Row>
				{/* Footer */}

				<p style={{ paddingLeft: 15 }}><b style={{ fontWeight: 500 }}>Tổng tiền: </b>{resultTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
				<hr />
				<Row style={{ paddingLeft: 15, paddingTop: '10px' }}>
					<Col span={8}>
						<p style={{ fontWeight: 500 }}>Thuế suất GTGT:.......................%</p>
					</Col>
					<Col span={16}>
						<p style={{ fontWeight: 500 }}>Tiền thuế GTGT:...........................................................................................................</p>
					</Col>
				</Row>
				<hr />
				<p style={{ fontWeight: 500, paddingLeft: 15 }}>Tổng cộng tiền thanh toán:....................................................................</p>
				<hr />
				<p style={{ fontWeight: 500, paddingLeft: 15 }}>Số tiền viết bằng chữ:...............................................................................</p>
				<hr />

				<Row justify='center'>
					<Col style={{ textAlign: 'center' }} span={8}>
						<b style={{ fontWeight: 500 }}>Người mua hàng</b>
						<p style={{ fontStyle: 'italic' }}>(Ký, ghi rõ họ, tên)</p>
					</Col>
					<Col style={{ textAlign: 'center' }} span={8}>
						<b style={{ fontWeight: 500 }}>Người bán hàng </b>
						<p style={{ fontStyle: 'italic' }}>(Ký, ghi rõ họ, tên)</p>
					</Col>
					<Col style={{ textAlign: 'center' }} span={8}>
						<b style={{ fontWeight: 500 }}>Thủ trưởng đơn vị</b>
						<p style={{ fontStyle: 'italic' }}>(Ký, ghi rõ họ, tên)</p>
					</Col>
				</Row>
				<br /><br />
				<p style={{ fontStyle: 'italic', textAlign: 'center' }}>(Cần kiểm tra, đối chiếu khi lập, nhận hóa đơn)</p>
			</div>
		)
	}
}