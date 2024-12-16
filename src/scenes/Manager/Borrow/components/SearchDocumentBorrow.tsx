import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, Select, AutoComplete } from 'antd';
import { L } from '@lib/abpUtility';
import {  SearchOutlined } from '@ant-design/icons';

const { Option } = Select || AutoComplete;

export interface IProps {
	getAllDocument: (do_title: string | undefined) => void;
	onRefreshCurrentPage: () => void;
	onSelectMember?: (me_id) => void;
	isLibrarian?: boolean;
}

export default class SearchDocumentBorrow extends React.Component<IProps>{
	
	state = {
		isLoadDone: true,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		do_title: undefined,
		author: undefined,
		do_date_accessioned: undefined,
		do_date_publish: undefined,
		do_identifier: undefined,
		to_id: undefined,
		ca_id: undefined,
		shelf_code: undefined,
		do_status: undefined,
		re_id: undefined,
		resultMemberAutoComplete: []
	};
	
	async getAll() {
		if(!!this.props.getAllDocument){
			await this.props.getAllDocument(this.state.do_title)
		}
	}

	_refreshPage = async () => {
		if(!!this.props.onRefreshCurrentPage){
			this.props.onRefreshCurrentPage();
		}
		this.setState({skipCount:0 });
   };

	handleSubmitSearch = async () => {
		await this._refreshPage();
		await this.getAll();
	}


	onChangeDateAccessioned (date: any) {
		if (!date) {
			this.setState({ do_date_accessioned: undefined });
		} else {
			let time = new Date(date);
			this.setState({ do_date_accessioned: time });
		}
	}

	onChangeDatePublish(date: any) {
		if (!date) {
			this.setState({ do_date_publish: undefined });
		} else {
			let time = new Date(date);
			this.setState({ do_date_publish: time });
		}
	}
	

	/// librarian borrow
	onSelectMember =async (me_id: number) => {
		if(!!this.props.onSelectMember){
			await this.props.onSelectMember(me_id);
		}
	}

	render() {
		const dateFormat = 'DD/MM/YYYY';
	
		return (
			<Row gutter={16} style={{marginBottom: '5px', gap: "10px 0px", alignItems: "center"}}>
				<Col span={4} style={{ fontSize: '16px' }}>
					<strong>{L('Title')}:</strong><br/>
					<Input allowClear onChange={(e) => this.setState({ do_title: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
				</Col>
				<Button style={{marginTop:'24px'}} type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
			</Row>
			
		)
	}
}