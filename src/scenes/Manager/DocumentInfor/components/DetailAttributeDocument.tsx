import * as React from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Popconfirm, Row, Table, Typography } from 'antd';
import { DocumentBorrowDto, DocumentInforDto, } from '@services/services_autogen';
import moment from 'moment';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';

export interface IProps {
	document_info: DocumentBorrowDto;
}
export default class DetailAttributeDocument extends React.Component<IProps> {
	dateFormat = "DD/MM/YYYY";
	state = {
		isLoadDone: false,
		visibleModalCreateUpdate: false,
		editingKey: -1,
	};
	documentInforSelected: DocumentInforDto = new DocumentInforDto();

	async componentDidMount() {
		this.setState({ isLoadDone: true });
	}

	render() {
		const { document_info } = this.props;
		return (
			<Card>
				<Row><h2>{L("DocumentInformation") + document_info.do_title}</h2></Row>
				<Row gutter={16} style={{ marginTop: "20px" }}>
					<Col span={4}><strong>{L("Field")}: </strong></Col>
					<Col span={8}>{stores.sessionStore.getNameField(document_info.fields_arr) || L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("ngay_cho_khai_thac")} : </strong></Col>
					<Col span={8}>{moment(document_info.do_date_available).format(this.dateFormat) || L("chua_co")}</Col>
					<Col span={4}><strong>{L("tac_gia")}: </strong></Col>
					<Col span={8}>{stores.sessionStore.getNameAuthor(document_info.authors_arr) || L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("nam_xuat_ban")}: </strong></Col>
					<Col span={8}>{document_info.do_date_publish || L("chua_co")}</Col>
					<Col span={4}><strong>{L("nha_phat_hanh")} : </strong></Col>
					<Col span={8}>{document_info.publisher !== undefined ? document_info.publisher.name : L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("tai_ban_lan")}: </strong></Col>
					<Col span={8}>{document_info.do_republish || L("chua_co")}</Col>
					<Col span={4}><strong>{L("Topic")}: </strong></Col>
					<Col span={8}>{document_info.topic !== undefined ? document_info.topic.to_name : L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("Identifier")}: </strong></Col>
					<Col span={8}>{document_info.do_identifier || L("chua_co")}</Col>
					<Col span={4}><strong>{L("Category")}: </strong></Col>
					<Col span={8}>{document_info.category !== undefined ? document_info.category.ca_title : L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("Quote")}: </strong></Col>
					<Col span={8}>{document_info.do_identifier_citation || L("chua_co")}</Col>
					<Col span={4}><strong>{L("gia_thanh_nhap_sach")}: </strong></Col>
					<Col span={8}>{document_info.do_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("Description")}: </strong></Col>
					<Col span={8}>{document_info.do_abstract || L("chua_co")}</Col>
					<Col span={4}><strong>{L("ma_xep_gia")}: </strong></Col>
					<Col span={8}>{document_info.re_id || L("chua_co")}</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4}><strong>{L("Languages")}: </strong></Col>
					<Col span={8}>{stores.sessionStore.getNameLanguage(document_info.languages) || L("chua_co")}</Col>
					<Col span={4}><strong>{L("NumberOfPage")}: </strong></Col>
					<Col span={8}>{document_info.do_nr_pages || L("chua_co")}</Col>
				</Row>
			</Card>
		)
	}
}
