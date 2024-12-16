import * as React from 'react';
import ActionExport from "@src/components/ActionExport";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { Card, Col, Row, Table } from "antd";


export default class BaoCaoDocGia extends AppComponentBase {

	state={
		isLoadDone: true,

	};

	async componentDidMount() {
	}

	render() {
		const dataspace = [
			{ month_report_member: 1},
			{ month_report_member: 2},
			{ month_report_member: 3},
			{ month_report_member: 4},
			{ month_report_member: 5},
			{ month_report_member: 6},
			{ month_report_member: 7},
			{ month_report_member: 8},
			{ month_report_member: 9},
			{ month_report_member: 10},
			{ month_report_member: 11},
			{ month_report_member: 12},
			{ month_report_member: "Tổng"},

		]

		const columns = [
			{
				key: 'STT__report_member', className: "center", title: <b>Số lượng</b>, children: [
					{ key: 'month_report_member', title: <b>Tháng</b>, dataIndex: 'month_report_member', className: "center",render: (text: string, index: number) => <div><b>{text}</b></div>
				},
				]
			},
			{ key: 'subscript_report_member', title: <b>Độc giả đăng ký</b>, dataIndex: 'subscript_report_member', className: "center", },
			{ key: 'borrow_report_member', title: <b>Độc giả mượn tài liệu</b>, className: "center", dataIndex: 'borrow_report_member', },
			{ key: 'subscript_card_report_member', title: <b>Thẻ đăng ký</b>, dataIndex: 'subscript_card_report_member', },
			{ key: 'out_of_date__report_member', title: <b>Thẻ hết hạn</b>, dataIndex: 'out_of_date__report_member', className: "center", },
			{ key: 'extend_report_member', title: <b>Gia hạn thẻ</b>, dataIndex: 'extend_report_member', className: "center", },
			{ key: 'recreate__report_member', title: <b>Làm lại thẻ</b>, dataIndex: 'recreate__report_member', className: "center", },
			{ key: 'is_locked_report_member', title: <b>Vi phạm</b>, dataIndex: 'is_locked_report_member', className: "center", },

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
				<h1 style={{fontSize: 24, textAlign: 'center'}}>Báo cáo độc giả và thẻ độc giả</h1>
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