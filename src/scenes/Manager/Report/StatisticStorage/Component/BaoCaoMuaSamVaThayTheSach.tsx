import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoMuaSamVaThayTheSach extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			
		]

        
        const columns=[
			{ key: 'name_book', title: <b>Mã sách</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Sách</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Số lượng</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'amout_of_lost_book', title: <b>Ghi chú</b>, dataIndex: 'amout_of_lost_book', className: "center", },
        ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo kiểm kê sách theo thời gian"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo mua sắm và thay thế sách</h1>
						<h3>Ngày nhận báo: ...,ngày... tháng... năm...</h3>
					</Col>
				</Row>
				<Col span={24}>
                    <h3>1. Kế hoạch mua sắm sách</h3>
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