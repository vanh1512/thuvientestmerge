import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoBaoCaoQuanLyMuonTraTheoTheLoaiSach extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{date_statistic_member: "Sách ngôn tình"},
		]

		const columns = [
			{ key: 'date_statistic_member', className: "center", title: <b>Thể loại sách</b>, dataIndex: "date_statistic_member",render: (text: string) => <div><b>{text}</b></div>},
			{ key: 'librarian_statistic_member', title: <b>Tổng sách</b>, dataIndex: 'librarian_statistic_member', className: "center", },
			{ key: 'username_statistic_member', title: <b>Số lượng sách mượn</b>, className: "center", dataIndex: 'username_statistic_member', },
			{ key: 'borrow_documnet_statistic_member', title: <b>Số lượng sách trả</b>, dataIndex: 'borrow_documnet_statistic_member', },
			{ key: 'return_document_statistic_member', title: <b>Tỉ lệ mượn trả</b>, dataIndex: 'return_document_statistic_member', className: "center", },
			{ key: 'return_document_statistic_member', title: <b>Thời gian trung bình</b>, dataIndex: 'return_document_statistic_member', className: "center", },

		];
		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo quản lí mượn trả theo thể loại sách"}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={12}>
						<h3>Thư viện tỉnh Tuyên Quang</h3>
					</Col>
					<Col span={12} style={{textAlign:'right'}}>
						<h3>Cộng hòa xã hội chủ nghĩa Việt Nam</h3>
						<h3 style={{marginRight:32}}>Độc lập - Tự do – Hạnh phúc</h3>
					</Col>
				</Row>
				<Row style={{marginTop: "10px", marginBottom: "15px"}}>
					<Col span={24} style={{textAlign: "center"}}>
						<h1 style={{fontSize: "25px"}}>Báo cáo quản lí mượn trả theo thể loại sách</h1>
						<h3>Ngày nhận báo cáo: ..., ngày... tháng... năm...</h3>
					</Col>
				</Row>
				<Row>
					<h3>1. Bảng báo cáo</h3>
				</Row>
				<Col span={24}>
					<Table
						loading={!this.state.isLoadDone}
						// rowClassName={(record, index) => this.selectRowItem(record)}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns}
						dataSource={dataspace}
						pagination={false}
					/>
				</Col>
			</Card>
		)
	}
}