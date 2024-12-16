import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";
import { stores } from '@stores/storeInitializer';

export default class BaoCaoViecTaoVaQuanLyHoSoDocGia extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const {statisticStorageListResult , totalStatisticStorage} = stores.statisticStorageStore;
		const dataspace = [
			
			
		]

        
        const columns1=[
			{ key: 'name_book', title: <b>Tên độc giả</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Ngày sinh</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Email</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>SĐT</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>ID</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Cấp thẻ thành viên</b>, dataIndex: 'id-book', className:"center", },		
        ]
        const columns2=[
			{ key: 'name_book', title: <b>Tên độc giả</b>, dataIndex: 'name_book', className: "center", },
			{ key: 'author', title: <b>Ngày sinh</b>, dataIndex: 'author', className: "center", },
			{ key: 'id-book', title: <b>Email</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>SĐT</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>ID</b>, dataIndex: 'id-book', className:"center", },
			{ key: 'id-book', title: <b>Cập nhật</b>, dataIndex: 'id-book', className:"center", },
        ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo việc tạo và quản lí hồ sơ độc giả"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo việc tạo và quản lí hồ sơ độc giả</h1>
					</Col>
				</Row>
				<Col span={24}>
                    <h3>I. Tạo hồ sơ độc giả</h3>
					<Table
						loading={!this.state.isLoadDone}
						// rowClassName={(record, index) => this.selectRowItem(record)}
						rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ "emptyText": 'No Data' }}
						columns={columns1}
						dataSource={statisticStorageListResult.length > 0 ? statisticStorageListResult : []}
						pagination={false}
					/>
                    <h3>II. Quản lý hồ sơ độc giả</h3>
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