import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, Select, AutoComplete, Table } from 'antd';
import { DocumentDto, ItemAuthor } from '@src/services/services_autogen';
import moment from 'moment';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';

const { Option } = Select || AutoComplete;

export interface IProps {
	// getAllDocument: (do_title: string | undefined, do_date_accessioned: Date | undefined, do_date_publish: string | undefined, do_identifier: string | undefined, to_id: number | undefined, ca_id: number | undefined,re_id: number | undefined, author: string | undefined, do_status: number | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => void;
	onSelectMember?: (me_id) => void;
	isLibrarian?: boolean;
}

export default class HandoverDocument extends React.Component<IProps>{

	state = {
		isLoadDone: true,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,

	};


	handleSubmitSearch = async () => {
	}


	render() {
		const columns = [
			{ title: L('stt'), key: 'no_br_index_handover', render: (text: string, item: DocumentDto, index: number) => <div>{(index + 1)}</div> },
			{ title: L('Title'), key: 'do_title_handover', render: (text: string, item: DocumentDto) => <div>{item.do_title}</div> },
			{ title: L('tac_gia'), key: 'do_authors_handover', width: 100, render: (text: string, item: DocumentDto) => <div>{stores.sessionStore.getNameAuthor(item.au_id_arr)}</div> },
			{ title: L('ma_nha_xuat_ban'), key: 'pu_id_handover', render: (text: string, item: DocumentDto) => <div>{item.pu_id.name}</div> },
			{ title: L('RepublishedTimes'), key: 'do_republish_handover', render: (text: string, item: DocumentDto) => <div>{item.do_republish}</div> },
			{ title: L('ma_danh_muc'), key: 'ca_id_handover', render: (text: string, item: DocumentDto) => <div></div> },
		];
		return (
			<Card>
				<Row>
				<Col span={4} style={{ fontSize: '16px' }}>
					<strong>{L('Title')}:</strong><br />
					<Input />
				</Col>
				{/* <Col span={4} style={{ fontSize: '16px' }}>
					<strong>{L('Tác giả')}:</strong><br />
					<MultiSelectedAuthor mode='multiple' selectType='only_active' onChangeAuthor={(e) => {this.setState({ author: e });	}}></MultiSelectedAuthor>
				</Col>
				<Col span={4} style={{ fontSize: '16px' }}>
					<strong>{L('Chủ đề')}:</strong><br />
					<SelectedTopic onChangeTopic={(item: TopicAbtractDto) => { this.setState({ to_id: item.to_id }) }} />
				</Col> */}
				</Row>
				<Row gutter={16} style={{ marginBottom: '5px', gap: "10px 0px", alignItems: "center" }}>
					<Col span={24}>

						<Table
							columns={columns}
						/>
					</Col>
				</Row>
			</Card>
		)
	}
}