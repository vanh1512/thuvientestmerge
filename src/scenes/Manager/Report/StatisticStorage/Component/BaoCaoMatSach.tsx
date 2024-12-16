import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoMatSach extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{ amout_of_loss: "Số lượng mất"},

		]
        
        const data1=[
            {book_lost_rate: "Tỉ lệ mất sách (%)"}
        ]

		const columns1 = [
			{ key: 'amout_of_loss', className: "center", title: <b>Loại sách</b>, dataIndex: "amout_of_loss",render: (text: string) => <div><b>{text}</b></div>},
			{ key: 'printed_book', title: <b>Sách in</b>, dataIndex: 'printed_book', className: "center", },
			{ key: 'electronic_documents', title: <b>Tài liệu điện tử</b>, className: "center", dataIndex: 'electronic_documents', },
			{ key: 'newspaper', title: <b>Báo</b>, dataIndex: 'newspaper', },
			// { key: 'return_document_statistic_member', title: <b>Tài liệu trả</b>, dataIndex: 'return_document_statistic_member', className: "center", },

		];
                
        const columns2=[
			{ key: 'name_book', title: <b>Tên sách</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Tác giả</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Mã DKCB</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'amout_of_lost_book', title: <b>Số lượng mất</b>, dataIndex: 'amout_of_lost_book', className: "center", },
			{ key: 'infor', title: <b>Thông tin thêm</b>, dataIndex: 'infor', className: "center", },
        ]
         
        const columns3=[
            { key: 'book_lost_rate', className: "center", title: <b>Tháng</b>, dataIndex: "book_lost_rate",render: (text: string) => <div><b>{text}</b></div>},
			{ key: 'month', title: <b>1</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>2</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>3</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>4</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>5</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>6</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>7</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>8</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>9</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>10</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>11</b>, dataIndex: 'month', },
			{ key: 'month', title: <b>12</b>, dataIndex: 'month', },

        ]

		return (
			<Card >
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"baocaomatsach"}
							nameFileExport={"Báo cáo mất sách"}
						/>
					</Col>
				</Row>
				<div id='baocaomatsach'>
				<Row style={{fontSize:'16px'}}>
					<Col span={12}>
						<h3>Thư viện tỉnh Tuyên Quang</h3>
					</Col>
					<Col span={12} style={{textAlign:'right'}}>
						<h3>Cộng hòa xã hội chủ nghĩa Việt Nam</h3>
						<h3 style={{marginRight:32}}>Độc lập - Tự do – Hạnh phúc</h3>
					</Col>
				</Row>
				
					<h1 style={{fontSize:'24px', textAlign:'center'}}>Báo cáo mất sách</h1>
				
				<Col span={24}>
                    <h3>I. Tổng quan</h3>
                    <p style={{ fontSize:"16px",marginLeft:'20px' }}>1. Tổng số sách bị mất:</p>
                    <p style={{ fontSize:"16px",marginLeft:'20px' }}>2. Thống kê mất sách theo loại</p>
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
                    <h3>II. Thông tin sách bị mất</h3>
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
                    <h3>III. Thống kê sách mất theo từng tháng</h3>
					<Table
						loading={!this.state.isLoadDone}
						// rowClassName={(record, index) => this.selectRowItem(record)}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns3}
						dataSource={data1}
						pagination={false}
					/>
				</Col>
				</div>
			</Card>
		)
	}
}