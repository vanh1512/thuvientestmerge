import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoThongKeMuonTraTaiLieu extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{ month_br_re_statistic: 1},
			{ month_br_re_statistic: 2},
			{ month_br_re_statistic: 3},
			{ month_br_re_statistic: 4},
			{ month_br_re_statistic: 5},
			{ month_br_re_statistic: 6},
			{ month_br_re_statistic: 7},
			{ month_br_re_statistic: 8},
			{ month_br_re_statistic: 9},
			{ month_br_re_statistic: 10},
			{ month_br_re_statistic: 11},
			{ month_br_re_statistic: 12},
			{ month_br_re_statistic: "Tổng"},

		]

		const columns = [
			{
				key: 'STT_br_re_statistic', className: "center", title: <b>Số lượng</b>, children: [
					{ key: 'month_br_re_statistic', title: <b>Tháng</b>, dataIndex: 'month_br_re_statistic', className: "center",render: (text: string, index: number) => <div><b>{text}</b></div>
				},
				]
			},
			{ key: 'subscript_br_re_statistic', title: <b>Mượn</b>, dataIndex: 'subscript_br_re_statistic', className: "center", },
			{ key: 'borrow_br_re_statistic', title: <b>Trả</b>, className: "center", dataIndex: 'borrow_br_re_statistic', },
			{ key: 'subscript_card_br_re_statistic', title: <b>Còn tại thư viện</b>, dataIndex: 'subscript_card_br_re_statistic', },
			{ key: 'out_of_date__br_re_statistic', title: <b>Quá hạn</b>, dataIndex: 'out_of_date__br_re_statistic', className: "center", },
		];
		return (
			<Card>
				<Row>
					<Col span={24} style={{ textAlign: "right" }}>
						<ActionExport
							isWord={true}
							isExcel={true}
							idPrint={"1"}
							nameFileExport={"Báo cáo độc giả và thẻ độc giả"}
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
						<h1 style={{fontSize: "25px"}}>Báo cáo độc giả và thẻ độc giả</h1>
					</Col>
				</Row>
				<Col span={24}>
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