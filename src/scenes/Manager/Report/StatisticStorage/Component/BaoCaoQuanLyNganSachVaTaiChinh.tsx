import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoQuanLyNganSachVaTaiChinh extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			
		]

        
        const columns1=[
			{ key: 'name_book', title: <b>Ngân sách được cấp</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Thu nhập từ phí dịch vụ</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Thu nhập từ tài trợ</b>, dataIndex: 'id-book', className:"center", },
			
        ]
        const columns2=[
			{ key: 'name_book', title: <b>Mua sắm sách và tài liệu</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Chi phí vận hành và duy trì</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Chi phí tiếp nhận và xử lý tài liệu mới</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Chi phí đào tạo nhân viên</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Chi phí quảng cáo</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Chi phí khác</b>, dataIndex: 'id-book', className:"center", },
			
        ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo quản lý ngân sách và tài chính"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo quản lý ngân sách và tài chính</h1>
					</Col>
				</Row>
				<Col span={24}>
                    <h3>I. Tổng quan</h3>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>1. Tổng số ngân sách được cấp:</p>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>2. Phân bố ngân sách cho các hoạt động trong thư viện</p>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>3. Tổng thu nhập từ các nguồn tài chính</p>
                    <h3>II. Bảng tổng hợp thu chi</h3>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>1. Bảng tổng hợp thu</p>
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
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>2. Bảng tổng hợp chi</p>
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