import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";
import { FontSizeOutlined } from '@ant-design/icons';


export default class BaoCaoQuanLyDocGiaTheoThoiGian extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [

		]

		const columns = [
			{ key: 'date_statistic_member', className: "center", title: <b>Mã</b>, },
			{ key: 'librarian_statistic_member', title: <b>Tên độc giả</b>, className: "center", },
			{ key: 'username_statistic_member', title: <b>Số lượng mượn</b>, className: "center", },
			{ key: 'borrow_documnet_statistic_member', title: <b>Số lượng trả</b>, },
			{ key: 'return_document_statistic_member', title: <b>Ghi chú</b>, className: "center", },
		];

		const columns1 = [
			{key: '', title: <b>Mã</b>},
			{key: '', title: <b>Tên độc giả</b>},
			{key: '', title: <b>Số lượng mượn</b>},
			{key: '', title: <b>Số lượng trả</b>},
			{key: '', title: <b>Ghi chú</b>},
		]
		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo quản lý độc giả"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo quản lý độc giả</h1>
						<h3>Ngày nhận báo cáo: ..., ngày... tháng... năm...</h3>
					</Col>
				</Row>
				<Row>
					<h3>1. Số độc giả mới trong tháng</h3>
				</Row>
				<Col span={24}>
					<Table
						loading={!this.state.isLoadDone}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns}
						dataSource={dataspace}
						pagination={false}
					/>
				</Col>
				<Row>
					<h3>2. Tình trạng mượn trả của độc giả cũ trong tháng</h3>
				</Row>
				<Col>
					<Table 
					columns={columns1}
					size='small'
					bordered={true}
					/>
				</Col>
			</Card>
		)
	}
}