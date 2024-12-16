import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoDocGiaDangKyMoi extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{STT: 1, ma_doc_gia:"Ab1", ten_doc_gia:"Dvhie", CCCD: "0000000", gioi_tinh:"nam"}
		]

        
        const columns1=[
			{ key: 'name_book', title: <b>STT</b>, dataIndex: 'STT', className: "center", },
			{ key: 'author', title: <b>Mã độc giả</b>, dataIndex: 'ma_doc_gia', className: "center", },
			{ key: 'id-book', title: <b>Tên độc giả</b>, dataIndex: 'ten_doc_gia', className:"center", },
			{ key: 'id-book', title: <b>CCCD</b>, dataIndex: 'CCCD', className:"center", },
			{ key: 'id-book', title: <b>Giới tính</b>, dataIndex: 'gioi_tinh', className:"center", },
			
        ]
        // const columns2=[
		// 	{ key: 'name_book', title: <b>Tên sách</b>, dataIndex: 'name_book', className: "center", },
		// 	{ key: 'author', title: <b>Mã số sách</b>, dataIndex: 'author', className: "center", },
		// 	{ key: 'id-book', title: <b>Loại hư hỏng</b>, dataIndex: 'id-book', className:"center", },
		// 	{ key: 'id-book', title: <b>Ngày phát hiện</b>, dataIndex: 'id-book', className:"center", },
		// 	{ key: 'id-book', title: <b>Ngày sửa chữa</b>, dataIndex: 'id-book', className:"center", },
		// 	{ key: 'id-book', title: <b>Người sửa chữa</b>, dataIndex: 'id-book', className:"center", },
		// 	{ key: 'id-book', title: <b>Hoạt động xử lý</b>, dataIndex: 'id-book', className:"center", },
		// 	{ key: 'id-book', title: <b>Trạng thái sau khi xử lý</b>, dataIndex: 'id-book', className:"center", },
		// 	{ key: 'id-book', title: <b>Chi phí sửa chữa</b>, dataIndex: 'id-book', className:"center", },
			
        // ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo độc giả đăng ký mới"}
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
						<h3 style ={{marginRight:45}}>…, ngày… tháng… năm…</h3>
					</Col>
				</Row>
				<Row style={{marginTop: "10px", marginBottom: "15px"}}>
					<Col span={24} style={{textAlign: "center"}}>
						<h1 style={{fontSize: "25px"}}>Báo cáo độc giả đăng ký mới</h1>
					</Col>
				</Row>
				<Col span={24}>
					<h3 style={{fontSize:"16px" }}>Tình hình độc giả đăng kí mới từ ngày…tháng…năm… đến ngày…tháng…năm…</h3>
                    <h3 style={{ margin:"15px 0 0 0 ",fontSize:"16px" }}>Số lượng độc giả đăng kí mới:</h3>
					<h3 style={{ margin:"15px 0 0 0",fontSize:"16px" }}>Thông tin độc giả mới:</h3>
			
					<Table
						loading={!this.state.isLoadDone}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns1}
						dataSource={dataspace}
						pagination={false}
					/>
                  
				</Col>
			</Card>
		)
	}
}