import { SearchOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import { SearchStatisticBorrowMostInput } from '@src/services/services_autogen';
import { Button, DatePicker, Row, Select, Col } from 'antd';
import moment, { Moment } from 'moment';
import React from 'react';

export const eFormatPicker = {
	date: "date",
	month: "month",
	year: "year",
}
export interface IProps {
	onDataChanged: (inputSearchData: SearchStatisticBorrowMostInput) => void;
}
export default class InputSearch extends React.Component<IProps> {
	state = {
		isLoadDone: false,
		selectedOption: undefined,
		dateTime: moment(),
	};
	inputSearch: SearchStatisticBorrowMostInput = new SearchStatisticBorrowMostInput();

	async componentDidMount() {
		await this.setState({ selectedOption: eFormatPicker.date, isLoadDone: true });
		await this.handleDateChange(this.state.dateTime);
	}

	handleSubmitSearch = async () => {
		this.setState({ isLoadDone: false });
		const { onDataChanged } = this.props;
		if (onDataChanged != undefined) {
			onDataChanged(this.inputSearch);
		}
		this.setState({ isLoadDone: true });
	}
	handleOptionChange = async (event) => {
		await this.setState({ selectedOption: event, });
		this.handleDateChange(this.state.dateTime);
	};
	handleDateChange = (date: Moment | null) => {
		if (date == null) {
			return;
		}
		this.setState({ isLoadDone: false, dateTime: date });
		this.inputSearch = new SearchStatisticBorrowMostInput();
		this.inputSearch.year = Number(date.format("YYYY"));
		if (this.state.selectedOption == eFormatPicker.date) {
			this.inputSearch.day = Number(date.format("DD"));
			this.inputSearch.month = Number(date.format("MM"));
		}
		if (this.state.selectedOption == eFormatPicker.month) {
			this.inputSearch.month = Number(date.format("MM"));
		}
		this.setState({ isLoadDone: true });
	};

	render() {

		return (
			<Row gutter={10}>
				<Col span={8}>
					<Select
						value={this.state.selectedOption}
						onChange={this.handleOptionChange}
						style={{ width: '100%' }}
					>
						<Select.Option value={eFormatPicker.date}>Ngày</Select.Option>
						<Select.Option value={eFormatPicker.month}>Tháng</Select.Option>
						<Select.Option value={eFormatPicker.year}>Năm</Select.Option>
					</Select>
				</Col>
				<Col span={8}>
					<DatePicker disabledDate={(current) => current ? current >= moment().endOf('day') : false}  style={{ width: '100%' }} onChange={this.handleDateChange} value={this.state.dateTime} picker={this.state.selectedOption} format={this.inputSearch.day ? "DD/MM/YYYY" : (this.inputSearch.month ? "MM/YYYY" : "YYYY")} />
				</Col>
				<Col span={8}>
					<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={this.handleSubmitSearch} >{L('Search')}</Button>
				</Col>
			</Row>
		);
	}
}
