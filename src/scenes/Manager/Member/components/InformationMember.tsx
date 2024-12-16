import * as React from 'react';
import { Col, Row, Image, Table, } from 'antd';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningIDetailDto, FindMemberBorrowDto, MemberCardDto, MemberDto } from '@services/services_autogen';
import moment from 'moment';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { stores } from '@src/stores/storeInitializer';
import { eBorrowReturningStatus, valueOfeGENDER, valueOfeMCardType } from '@src/lib/enumconst';
import { L } from '@src/lib/abpUtility';
import { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';

export interface IProps {
	memberSelected: FindMemberBorrowDto;
	isRow?: boolean;
	detailBorrow?: BorrowReturningDetailsWithListDocumentDto;
}

export default class InformationMember extends AppComponentBase<IProps>{
	render() {

		const memberSelected = this.props.memberSelected != undefined ? this.props.memberSelected : new MemberDto();
		const memberCardSelected = this.props.memberSelected != undefined ? this.props.memberSelected.memberCard : new MemberCardDto();
		const isRow = (this.props.isRow != undefined && this.props.isRow) ? true : false;
		const { detailBorrow } = this.props;
		const columns = [
			{
				title: L('DocumentName'), key: 'code_borrowReturning',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.do_title}</div>
			},
			{
				title: L('CodeDkcb'), key: 'us_borrowReturning',
				render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.documentInfor.dkcb_code}</div>
			},
		];
		return (
			<div style={{ textAlign: isRow ? 'center' : 'left', }}>
				<Row style={{ justifyContent: 'center', }}>
					<h2>{L('Information') + " " + L('Member') + " " + memberSelected.me_name}</h2>
				</Row>
				<Row gutter={16}>
					<Col {...(isRow ? cssCol(24) : cssColResponsiveSpan(24, 24, 24, 24, 8, 8))} style={{ height: "150px", objectFit: 'contain' }}>
						<Image
							style={{ width: '80%', margin: '0 auto' }}
							height={150}
							src={(memberSelected.fi_id != undefined && memberSelected.fi_id.key != null) ? this.getFile(memberSelected.fi_id.id!) : process.env.PUBLIC_URL + '/icon_file_sample/no_image.png'}
						/>
					</Col>
					{
						memberCardSelected != undefined && memberSelected.me_has_card == true ?
							<>
								{
									memberCardSelected.me_ca_is_locked == false ?
										<>
											<Col {...(isRow ? cssCol(24) : cssColResponsiveSpan(24, 12, 12, 12, 8, 8))} >
												<p>{L('FullName')}:<b> {memberSelected.me_name} </b></p>
												<p>{L('Gender')}:<b> {valueOfeGENDER(memberSelected.me_sex)} </b></p>
												<p>{L('Birthday')}:<b> {memberSelected.me_birthday} </b></p>
												<p>{L('CardType')}:<b> {valueOfeMCardType(memberCardSelected.me_ca_type)} </b></p>
											</Col>
											<Col {...(isRow ? cssCol(24) : cssColResponsiveSpan(24, 12, 12, 12, 8, 8))} >
												<p>{L('RemainedMoney')}:<b> {memberCardSelected.me_ca_money != undefined && memberCardSelected.me_ca_money.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></p>
												<p>{L('so_dien_thoai')}:<b> {memberSelected.me_phone} </b></p>
												<p>{L('ValidityPeriod')}:<b> {moment(memberCardSelected.me_ca_use_from).format("DD/MM/YYYY")} đến {moment(memberCardSelected.me_ca_use_to).format("DD/MM/YYYY")} </b></p>
												<p>{L('CardLimit')}:<b> {memberCardSelected.me_ca_level != undefined && memberCardSelected.me_ca_level.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></p>
											</Col>
										</>
										:
										<Col {...(isRow ? cssCol(24) : cssColResponsiveSpan(24, 24, 24, 8, 8, 8))} >
											<p>{L('FullName')}:<b> {memberSelected.me_name} </b></p>
											<p>{L('Gender')}:<b> {valueOfeGENDER(memberSelected.me_sex)} </b></p>
											<p>{L('Birthday')}:<b> {memberSelected.me_birthday} </b></p>
											<p>{L('CardStatus')}:<b> {L("da_khoa")}</b></p>
										</Col>
								}
							</>
							:
							<Col {...(isRow ? cssCol(24) : cssColResponsiveSpan(24, 24, 24, 16, 16, 16))} >
								<p>{L('FullName')}:<b> {memberSelected.me_name} </b></p>
								<p>{L('Gender')}:<b> {valueOfeGENDER(memberSelected.me_sex)} </b></p>
								<p>{L('Birthday')}:<b> {memberSelected.me_birthday} </b></p>
								<p>{L('CardStatus')}:<b> {L("chua_co_the")}</b></p>
							</Col>
					}
					{(detailBorrow != undefined && detailBorrow.list_borrow != undefined) &&
						<Col>
							<h3>Số sách đang mượn</h3>
							<Table

								className="centerTable"
								// scroll={this.props.noScroll ? { y: undefined } : { x: 1000, y: 1000 }}
								rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
								size={'middle'}
								bordered={true}
								locale={{ "emptyText": L('NoData') }}
								columns={columns}
								dataSource={detailBorrow.list_borrow.length > 0 ? detailBorrow.list_borrow : []}
							/>
						</Col>
					}
				</Row>
			</div>
		)
	}
}