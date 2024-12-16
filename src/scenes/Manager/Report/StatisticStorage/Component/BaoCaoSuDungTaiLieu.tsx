import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoSuDungTaiLieu extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{chu_de:"Sách thiên văn", tong_so: 9999, da_cho_muon: 9900, bi_mat: 0, bi_hong: 0},
			{chu_de:"Báo", tong_so: 5555, da_cho_muon: 55, bi_mat: 55, bi_hong: 55},
			{chu_de:"Truyện", tong_so: 6666, da_cho_muon: 66, bi_mat: 66, bi_hong: 66},
			
		]

        
        const columns1=[
			{ key: 'name_book', title: <b>Chủ đề</b>, className: "center", dataIndex:"chu_de" },
			{ key: 'author', title: <b>Tổng số</b>,className: "center", dataIndex:"tong_so"},
			{ key: 'id-book', title: <b>Đã cho mượn</b>, className:"center", dataIndex:"da_cho_muon"},
			{ key: 'id-book', title: <b>Bị mất</b>, className:"center", dataIndex:"bi_mat"},
			{ key: 'id-book', title: <b>Bị hỏng</b>, className:"center", dataIndex:"bi_hong" },
			
        ]

		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo sử dụng tài liệu"}
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
						<h3 style={{marginRight:45}}> …, ngày… tháng… năm…</h3>
					</Col>
				</Row>
				<Row style={{marginTop: "10px", marginBottom: "15px"}}>
					<Col span={24} style={{textAlign: "center"}}>
						<h1 style={{fontSize: "25px"}}>Báo cáo sử dụng tài liệu</h1>
					</Col>
				</Row>
				<Col span={24}>
					<h3 style={{fontSize:"16px" , marginBottom:"1px"}}>Tình hình sử dụng tài liệu từ ngày…tháng…năm… đến ngày…tháng…năm…</h3>
                 
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