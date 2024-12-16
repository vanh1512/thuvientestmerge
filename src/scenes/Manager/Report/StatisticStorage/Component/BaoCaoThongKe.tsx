import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoThongKe extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{ date_statistic_member: "12/11/2022"},
			{ date_statistic_member: "12/11/2023"},
			{ date_statistic_member: "12/11/2024"},
			{ date_statistic_member: "12/11/2025"},
			

		]

		const columns = [
			{ key: 'date_statistic_member', className: "center", title: <b>Ngày</b>, dataIndex: "date_statistic_member",render: (text: string) => <div><b>{text}</b></div>},
			{ key: 'librarian_statistic_member', title: <b>Tên thủ thư</b>, dataIndex: 'librarian_statistic_member', className: "center", },
			{ key: 'username_statistic_member', title: <b>Tên đăng nhập</b>, className: "center", dataIndex: 'username_statistic_member', },
			{ key: 'borrow_documnet_statistic_member', title: <b>Tài liệu mượn</b>, dataIndex: 'borrow_documnet_statistic_member', },
			{ key: 'return_document_statistic_member', title: <b>Tài liệu trả</b>, dataIndex: 'return_document_statistic_member', className: "center", },

		];
		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo độc giả và thẻ độc giả"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo độc giả và thẻ độc giả</h1>
					</Col>
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