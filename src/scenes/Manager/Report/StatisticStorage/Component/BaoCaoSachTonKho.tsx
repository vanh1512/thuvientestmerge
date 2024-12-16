import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoSachTonKho extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{amount: "Số lượng"},
            {amount: "Số sách mới"},
            {amount: "Số sách đã qua sử dụng"},
            {amount: "Sô sách cần sửa chữa"},
            {amount: "Số sách hỏng"},
		]
        
        const dataspace1=[]

		const columns1 = [
			{ key: 'amount', className: "left", title: <b>Loại sách</b>, dataIndex: "amount",render: (text: string) => <div><b>{text}</b></div>},
			{ key: 'book', title: <b>Sách</b>, dataIndex: 'book', className: "center", },
			{ key: 'newspaper', title: <b>Báo</b>, className: "center", dataIndex: 'newspaper', },
			{ key: 'dissertation', title: <b>Luận văn</b>, dataIndex: 'dissertation', },
		];
        
        const columns2 = [
			{ key: 'amount', className: "left", title: <b>Danh mục</b>, dataIndex: "amount",render: (text: string) => <div><b>{text}</b></div>},
			{ key: 'love_language', title: <b>Ngôn tình</b>, dataIndex: 'love_language', className: "center", },
			{ key: 'animal_world', title: <b>Thế giới động vật</b>, className: "center", dataIndex: 'animal_world', },
			{ key: 'avenger', title: <b>Siêu anh hùng</b>, dataIndex: 'avenger', },
		];
        
        const columns3=[
			{ key: 'name_book', title: <b>Tên sách</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Tác giả</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Mã DKCB</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'number_of_book_in_stock', title: <b>Số sách còn trong kho</b>, dataIndex: 'number_of_book_in_stock', className: "center", },
			{ key: 'number_of_books_borrowed', title: <b>Số sách được mượn</b>, dataIndex: 'number_of_books_borrowed', className: "center", },
        ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo sách tồn kho"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo sách tồn kho</h1>
					</Col>
				</Row>
				<Col span={24}>
                    <h3>I. Tổng quan</h3>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>1. Số lượng sách trong kho:</p>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>2. Thống kê sách theo loại</p>
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
				</Col>
                <Col span={24}>
                    <p style={{ marginLeft:"20px",fontSize:"16px" }}>3. Thống kê sách theo danh mục</p>
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
                <Col span={24}>
                    <h3>II. Chi tiết sách</h3>
					<Table
						loading={!this.state.isLoadDone}
						// rowClassName={(record, index) => this.selectRowItem(record)}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns3}
						dataSource={dataspace1}
						pagination={false}
					/>
				</Col>
			</Card>
		)
	}
}