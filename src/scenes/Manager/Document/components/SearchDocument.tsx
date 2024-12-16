import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, Select, AutoComplete, Popover } from 'antd';
import { L } from '@lib/abpUtility';
import { AuthorAbtractDto, TopicAbtractDto } from '@services/services_autogen';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { eDocumentBorrowType, eDocumentStatus } from '@src/lib/enumconst';
import MultiSelectedAuthor from '@src/components/Manager/MultiSelectedAuthor';
import SelectEnum from '@src/components/Manager/SelectEnum';
import SelectedTopic from '@src/components/Manager/SelectedTopic';
import SelectTreeCategory from '@components/Manager/SelectTreeCategory';
import SelectTreeResponsitory from '@components/Manager/SelectTreeResponsitory';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import SelectedAuthor from '@src/components/Manager/SelectedAuthor';
import SelectedColumnDisplay from '@src/components/Manager/SelectedColumnDisplay';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';

export class SearchDocumentOutput {
	do_title: string | undefined;
	do_date_available: Date | undefined;
	do_date_publish: string | undefined;
	do_identifier: string | undefined;
	to_id: number | undefined;
	ca_id: number | undefined;
	re_id: number | undefined;
	author: string | undefined;
	do_status: number | undefined;
	do_borrow_status: number | undefined;

}
export interface IProps {
	onSubmitDataSearchDoccument: (output: SearchDocumentOutput, isReloadPage: boolean) => void;
	onSelectMember?: (me_id) => void;
	changeCurrentPage?: () => void;
	onChangeColumn: (listColumn: ColumnsDisplayType<any>) => void;
	isCheck?: boolean;
	listColumn: ColumnsDisplayType<any>;
	doListNum?: number[];
}

export default class SearchDoccument extends React.Component<IProps>{

	state = {
		isLoadDone: true,
		do_title: undefined,
		author: undefined,
		do_date_available: undefined,
		do_date_publish: undefined,
		do_identifier: undefined,
		to_id: undefined,
		ca_id: undefined,
		re_id: undefined,
		do_status: undefined,
		do_borrow_status: undefined,
	};
	searchOuput: SearchDocumentOutput = new SearchDocumentOutput();

	async componentDidMount() {
	}


	clearSearch = async () => {
		await this.setState({
			do_title: undefined,
			author: undefined,
			do_date_available: undefined,
			do_date_publish: undefined,
			do_identifier: undefined,
			to_id: undefined,
			ca_id: undefined,
			re_id: undefined,
			do_status: undefined,
			do_borrow_status: undefined
		});
		this.handleSubmitSearch(true);
	}
	handleSubmitSearch = async (isReloadPage: boolean) => {
		this.searchOuput.do_title = this.state.do_title;
		this.searchOuput.do_date_available = this.state.do_date_available;
		this.searchOuput.do_date_publish = this.state.do_date_publish;
		this.searchOuput.do_identifier = this.state.do_identifier;
		this.searchOuput.to_id = this.state.to_id;
		this.searchOuput.ca_id = this.state.ca_id;
		this.searchOuput.re_id = this.state.re_id;
		this.searchOuput.author = this.state.author;
		this.searchOuput.do_borrow_status = this.state.do_borrow_status;
		if (this.props.isCheck == false) {
			this.searchOuput.do_status = eDocumentStatus.In.num;
		}
		else {
			this.searchOuput.do_status = this.state.do_status;
		}
		if (this.props.onSubmitDataSearchDoccument !== undefined) {
			await this.props.onSubmitDataSearchDoccument(this.searchOuput, isReloadPage);
		}
	}

	onChangeDateAvailable(date: moment.Moment | null) {
		this.setState({ do_date_available: date ?? undefined });
	}

	onChangeDatePublish = async (date: string) => {
		const parsedDate = moment(date, "YYYY-MM-DD");
		if (parsedDate.isValid()) {
			await this.setState({ do_date_publish: parsedDate.format("YYYY") });
		} else {
			await this.setState({ do_date_publish: undefined });
		}
	}
	changeCurrentPage = () => {
		if (!!this.props.changeCurrentPage) {
			this.props.changeCurrentPage();
		}
	}
	formatTextAutoComplate = (id: number, name: string, code: string) => {
		name = name.replace(".", " ");
		code = code.replace(".", " ");
		return id + ". " + name + "(" + code + ")";
	}
	onChangeColumn = (listColumn: ColumnsDisplayType) => {
		if (!!this.props.onChangeColumn) {
			this.props.onChangeColumn(listColumn);
		}
	}
	render() {
		const self = this;
		const dateFormat = 'DD/MM/YYYY';
		return (
			<>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('DocumentName')}:</strong><br />
						<Input allowClear onPressEnter={() => this.handleSubmitSearch(true)} value={this.state.do_title} onChange={(e) => this.setState({ do_title: e.target.value })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('Author')}:</strong><br />
						<SelectedAuthor selected_au_id={this.state.author} onClear={() => this.setState({ author: undefined })} onChangeAuthor={(item: AuthorAbtractDto) => { this.setState({ author: item.au_name }) }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('Topic')}:</strong><br />
						<SelectedTopic selected_to_id={this.state.to_id} onChangeTopic={(item: number) => { this.setState({ to_id: item }) }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('Category')}:</strong><br />
						<SelectTreeCategory ca_id_select={this.state.ca_id} onSelectCategory={(item: number) => { this.setState({ ca_id: item }) }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('AvailableDate')}:</strong><br />
						<DatePicker
							onChange={(date: Moment | null, dateString: string) => this.onChangeDateAvailable(date)}
							format={dateFormat}
							placeholder={L("Select") + "..."}
							style={{ width: '100%' }}
							value={this.state.do_date_available}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('YearOfPublication')}:</strong><br />
						<DatePicker
							onChange={(date: Moment | null, dateString: string) => this.onChangeDatePublish(dateString)}
							format={"YYYY"}
							placeholder={L("Select") + "..."}
							picker='year'
							style={{ width: '100%' }}
							value={this.state.do_date_publish != undefined ? moment(this.state.do_date_publish, "YYYY") : undefined}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('Identifier')}:</strong><br />
						<Input allowClear onPressEnter={() => this.handleSubmitSearch(true)} value={this.state.do_identifier} onChange={(e) => this.setState({ do_identifier: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
					</Col>
					{/* <Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
					<strong>{L('Repository')}:</strong><br />
					<SelectTreeResponsitory re_id_select={this.state.re_id} onSelectRepository={(item: number) => { this.setState({ re_id: item }) }} />
				</Col> */}

					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }}>
						<strong>{L('BorrowStatus')}:</strong><br />
						<SelectEnum eNum={eDocumentBorrowType} enum_value={this.state.do_borrow_status} onChangeEnum={async (value: number | undefined) => await this.setState({ do_borrow_status: value })} />
					</Col>
					{this.props.isCheck == false ? "" :
						<Col  {...cssColResponsiveSpan(24, 12, 12, 6, 6, 6)} style={{ fontSize: '16px' }} >
							<strong>{L('DocumentStatus')}:</strong><br />
							<SelectEnum eNum={eDocumentStatus} enum_value={this.state.do_status} onChangeEnum={async (value: number | undefined) => await this.setState({ do_status: value })} />
						</Col>}
					<Col {...cssColResponsiveSpan(24, 12, 12, 3, 3, 2)} style={{ fontSize: '16px', textAlign:"center" }}>
						<Button style={{ marginTop: '24px' }} type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch(true)} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 5, 5, 5)} style={{ fontSize: '16px' }}>
						{(this.state.do_title
							|| this.state.author != undefined
							|| this.state.do_date_available != undefined
							|| this.state.do_date_publish != undefined
							|| this.state.do_identifier != undefined
							|| this.state.to_id != undefined
							|| this.state.ca_id != undefined
							|| this.state.re_id != undefined
							|| this.state.do_status != undefined
							|| this.state.do_borrow_status != undefined) &&
							<Button style={{ marginTop: '24px' }} danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col   {...cssColResponsiveSpan(24, 12, 12, 9, 9, 9)} style={{ fontSize: '16px' }}>
						<SelectedColumnDisplay listColumn={this.props.listColumn} onChangeColumn={this.onChangeColumn} />
					</Col>
				</Row>
			</>

		)
	}
}