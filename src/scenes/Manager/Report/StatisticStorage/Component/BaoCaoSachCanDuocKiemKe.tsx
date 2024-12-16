import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoSachCanDuocKiemKe extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			
		]

        
        const columns=[
			{ key: 'name_book', title: <b>Tên sách</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Tác giả</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Mã DKCB</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'inventory_date', title: <b>Ngày kiểm kê</b>, dataIndex: 'inventory_date', className: "center", },
			{ key: 'inventory_cycle', title: <b>Chu kì kiểm kê</b>, dataIndex: 'inventory_cycle', className: "center", },
			{ key: 'next_inventory_date', title: <b>Ngày kiểm kê tiếp theo</b>, dataIndex: 'next_inventory_date', className: "center", },
			{ key: 'infor', title: <b>Thông tin thêm</b>, dataIndex: 'infor', className: "center", },
        ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo sách cần được kiểm kê"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo sách cần được kiểm kê</h1>
					</Col>
				</Row>
				<Col span={24}>
                    <h3>I. Tổng quan</h3>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>1. Thời gian và phạm vi kiểm kê</p>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>2. Phương pháp kiểm kê</p>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>3. Thành phần ban kiểm kê</p>
                    <h3>II. Thống kê</h3>
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