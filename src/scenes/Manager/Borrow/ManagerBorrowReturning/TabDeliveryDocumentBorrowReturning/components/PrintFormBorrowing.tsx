import ActionExport from "@src/components/ActionExport";
import HeaderReport from "@src/components/LayoutReport/HeaderReport";
import { L } from "@src/lib/abpUtility";
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningIDetailDto, FindMemberBorrowDto } from "@src/services/services_autogen";
import { Card, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import React from "react";
export interface IProps {
	memberBorrow: FindMemberBorrowDto;
	detailBorrow?: BorrowReturningDetailsWithListDocumentDto;
}
export default class PrintFormBorrowing extends React.Component<IProps>{
	componentRef: any | null = null;
	state = {
		isLoadDone: false,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { detailBorrow, memberBorrow } = this.props;

		const columns: ColumnsType<BorrowReturningIDetailDto> = [
			{
				title: L('N.O'), key: 'no_borrow_form', width: 50,
				render: (text: string, item: BorrowReturningIDetailDto, index: number) => <div>{index + 1}</div>
			},
			{
				title: L('CodeDkcb'), key: 'dkcb_borrow_form',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.documentInfor.dkcb_code}</div>
			},
			{
				title: L('DocumentName'), key: 'title_borrow_form',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.do_title}</div>
			},
			{
				title: L('Price'), key: 'price_borrow_form',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.do_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
			},

		];
		return (
			<div id="print_form_borrow" ref={this.setComponentRef}>
				<Card>
					<HeaderReport />
					<Row>
						<Col span={24} style={{ textAlign: "center" }}>
							<h3>PHIẾU MƯỢN SÁCH</h3>
						</Col>
					</Row>
					<Row gutter={15}>
						<Col span={12} ><span style={{ fontWeight: 500 }}>Số phiếu</span>:..........................</Col>
						<Col span={12} ><span style={{ fontWeight: 500 }}>Ngày mượn</span>: <i>{moment(detailBorrow?.list_borrow![0].br_re_start_at).format("DD/MM/YYYY")}</i></Col>
					</Row>
					<Row gutter={15}>
						<Col span={12}>
							<span style={{ fontWeight: 500 }}>Họ tên người mượn</span>: <i>{memberBorrow.me_name}</i>
						</Col>
						<Col span={12}>
							<span style={{ fontWeight: 500 }}>Địa chỉ</span>: <i>{memberBorrow.me_address}</i>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							<Table
								className="centerTable"
								rowKey={record => Math.random() + "borrow_form_" + record.br_re_de_id}
								columns={columns}
								dataSource={detailBorrow?.list_borrow}
								size={'middle'}
								bordered={true}
								locale={{ "emptyText": L('No Data') }}
								pagination={false}
							/>
						</Col>
					</Row>
					<Row className="no-print center" style={{ marginTop: "15px" }} >
						<Col span={24} style={{ textAlign: 'center' }}>
							<ActionExport
								nameFileExport='BorrowingForm'
								idPrint="print_form_borrow"
								isExcel={false}
								isWord={false}
								componentRef={this.componentRef}
							/>
						</Col>
					</Row>
				</Card>
			</div>
		)
	}
}