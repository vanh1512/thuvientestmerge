import ActionExport from '@src/components/ActionExport';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { Card, Col, Row, Table } from "antd";
import * as React from 'react'
export default class BaoCaoMatSachTheoCategory extends AppComponentBase {
	render() {
		const data = [
			{
				key_data: 'Số lượng mất',
				book: 8888,
				document:888888,
				newspaper: 88888888
			}
		];
		const dataColumn = [
			{key: 'key_data', title: <b>Loại sách</b>, dataIndex: "key_data"},
			{ key: 'book_print', title: <b>Sách in</b>, dataIndex: 'book'},
			{ key: 'document', title: <b>Tài liệu điện tử</b>, dataIndex: 'document', },
			{ key: 'newspaper', title: <b>Báo</b>, dataIndex: 'newspaper', },
		]

		const columnInforBookLoss = [
			{key: 'title', title: <b>Tên sách</b>, dataIndex: "title"},
			{ key: 'author', title: <b>Tác giả</b>, dataIndex: 'author'},
			{ key: 'dkcb', title: <b>Mã DKCB</b>, dataIndex: 'dkcb', },
			{ key: 'quantity_lose', title: <b>Số lượng mất</b>, dataIndex: 'quantity_lose', },
			{ key: 'more_info', title: <b>Thêm thông tin </b>, dataIndex: 'more_info', }
		]

		const dataInforLossMonth = [
			{
				title:'Tỉ lệ mất sách(%)',
				mon1:'1',
				mon2:'2',
			}
		]

		const columnInforLossMonth =[
			{key: 'title', title: <b>Tháng</b>, dataIndex: "title"},
			{ key: 'mon1', title: <b>1</b>, dataIndex: 'mon1'},
			{ key: 'mon2', title: <b>2</b>, dataIndex: 'mon2'},
			{ key: 'mon3', title: <b>3</b>, dataIndex: 'mon3'},
			{ key: 'mon4', title: <b>4</b>, dataIndex: 'mon4'},
			{ key: 'mon5', title: <b>5</b>, dataIndex: 'mon5'},
			{ key: 'mon6', title: <b>6</b>, dataIndex: 'mon6'},
			{ key: 'mon7', title: <b>7</b>, dataIndex: 'mon7'},
			{ key: 'mon8', title: <b>8</b>, dataIndex: 'mon8'},
			{ key: 'mon9', title: <b>9</b>, dataIndex: 'mon9'},
			{ key: 'mon10', title: <b>10</b>, dataIndex: 'mon10'},
			{ key: 'mon11', title: <b>11</b>, dataIndex: 'mon11'},
			{ key: 'mon12', title: <b>12</b>, dataIndex: 'mon12'},
			
		]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo mất sách theo Category"}
						/>
					</Col>
				</Row>
				<Row style={{fontSize:'16px'}}>
					<Col span={12}>
						<h3>Thư viện tỉnh Tuyên Quang</h3>
					</Col>
					<Col span={12} style={{textAlign:'right'}}>
						<h3>Cộng hòa xã hội chủ nghĩa Việt Nam</h3>
						<h3 style={{marginRight:32}}>Độc lập - Tự do – Hạnh phúc</h3>
					</Col>
				</Row>
				<h1 style={{textAlign:'center', fontSize:24}}>Báo cáo mất sách từ theo Category</h1>
				<Row style={{ display: 'block' }}>
					<h3>I.Tổng quan</h3>
					<p style={{fontSize:'16px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Tổng số sách bị mất:</p>
					<p style={{fontSize:'16px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Thống kê sách mất theo loại</p><br />
					<Table columns={dataColumn} dataSource={data} pagination={false} bordered />
				</Row>

				<Row style={{ display: 'block', marginTop:'30px' }}>
					<h3>II. Thông tin sách bị mất </h3><br />
					<Table columns={columnInforBookLoss} bordered/>
				</Row>

				<Row style={{ display: 'block', marginTop:'30px' }}>
					<h3>III. Thống kê sách mất theo tháng </h3><br />
					<Table columns={columnInforLossMonth} dataSource={dataInforLossMonth} bordered pagination={false}/>
				</Row>
			</Card>
		)
	}
}