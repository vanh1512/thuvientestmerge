import { CheckCircleFilled, CheckOutlined, ExclamationOutlined } from "@ant-design/icons";
import { L } from "@src/lib/abpUtility";
import { colorEBorrowReturningStatus, iconEBorrowReturningStatus, valueOfeBorrowReturningStatus } from "@src/lib/enumconst";
import InformationMember from "@src/scenes/Manager/Member/components/InformationMember";
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningIDetailDto, FindMemberBorrowDto } from "@src/services/services_autogen";
import { Col, Row, Tag } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import moment from "moment";
import React from "react";
export interface IProps {
	memberBorrow: FindMemberBorrowDto;
	detailBorrow?: BorrowReturningDetailsWithListDocumentDto;
}
export default class InformationBorrowReturning extends React.Component<IProps>{
	render() {

		const columns: ColumnsType<BorrowReturningIDetailDto> = [
			{
				title: L('N.O'), key: 'no_borrowReturning', width: 50,
				render: (text: string, item: BorrowReturningIDetailDto, index: number) => <div>{index + 1}</div>
			},

			{
				title: L('Title'), key: 'name_book',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.do_title}</div>
			},
			{
				title: L('CodeDkcb'), key: 'code_borrowReturning',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.documentInfor !== undefined ? <span>{item.documentInfor.dkcb_code}</span> : L('Null')}</div>
			},
			{
				title: L('Price'), key: 'code_borrowReturning',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.do_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
			},
			{
				title: L('BorrowingDate'), key: 'create_borrowReturning',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{moment(item.br_re_start_at).format("DD/MM/YYYY")}</div>
			},

			{
				title: L('ngay_hen_tra'), key: 'end_borrowReturning',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{moment(item.br_re_end_at).format("DD/MM/YYYY")}</div>
			},
			{
				title: L('Status'), key: 'status_borrowReturning',
				render: (text: string, item: BorrowReturningIDetailDto) => {
					const ElementIcon = iconEBorrowReturningStatus(item.br_re_status);

					return (
						<div>
							<Tag color={colorEBorrowReturningStatus(item.br_re_status)} key={item.br_re_status}>
								{valueOfeBorrowReturningStatus(item.br_re_status)}
							</Tag>
						</div>
					)
				}

			},


		]
		const { detailBorrow } = this.props;
		return (
			<>
				<InformationMember memberSelected={this.props.memberBorrow}></InformationMember>

				<br />
				<hr />
				<br />
				<h3 style={{ textAlign: 'center' }}>{L('BorrowedDocuments')}</h3>
				<Row>
					<Col span={24}>

						{detailBorrow != undefined && detailBorrow.list_borrow != undefined &&
							<Table className='centerTable'
								rowKey={record => Math.random() + "_" + record.br_re_id}
								size={'middle'}
								scroll={{ x: 500 }}
								bordered={true}
								locale={{ "emptyText": L('NoData') }}
								columns={columns}
								dataSource={detailBorrow.list_borrow}
							/>
						}
					</Col>
				</Row>
			</>
		)
	}
}