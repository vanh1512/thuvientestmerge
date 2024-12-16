import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoXuLySachBiHongHoacHuHong extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			
		]

        
        const columns1=[
			{ key: 'name_book', title: <b>Tên sách</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Tác giả</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Mã số sách</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Loại hư hỏng</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Ghi chú</b>, dataIndex: 'id-book', className:"center", },
			
        ]
        const columns2=[
			{ key: 'name_book', title: <b>Tên sách</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Mã số sách</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Loại hư hỏng</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Ngày phát hiện</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Ngày sửa chữa</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Người sửa chữa</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Hoạt động xử lý</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Trạng thái sau khi xử lý</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Chi phí sửa chữa</b>, dataIndex: 'id-book', className:"center", },
			
        ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Bao_cao_Xu_ly_sach_bi_hong_hoac_hu_hong"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo xử lý sách bị hỏng hoặc hư hỏng</h1>
					</Col>
				</Row>
				<Col span={24}>
                    <h3>I. Tổng quan</h3>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>1. Tổng số sách bị hỏng hoặc hư hỏng:</p>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>2. Thông tin sách</p>
					<Table
						loading={!this.state.isLoadDone}
						// rowClassName={(record, index) => this.selectRowItem(record)}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns1}
						dataSource={dataspace}
						pagination={false}
					/>
                    <h3>II. Quá trình xử lý</h3>
                    <Table
						loading={!this.state.isLoadDone}
						// rowClassName={(record, index) => this.selectRowItem(record)}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns2}
						dataSource={dataspace}
						pagination={false}
					/>
				</Col>
			</Card>
		)
	}
}