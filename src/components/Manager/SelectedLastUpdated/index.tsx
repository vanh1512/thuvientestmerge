import * as React from 'react';
import { Button, DatePicker, Dropdown, Col, Popover, Row, Select } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { ArrowRightOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import AppConsts from '@src/lib/appconst';
import { L } from '@src/lib/abpUtility';
const { Option } = Select;
const { RangePicker } = DatePicker;

export interface IProps {
	onChangeDateSelect: (start_updated: Moment | undefined, last_updated: Moment | undefined, optionFilter:number|undefined) => void;
	optionFilter?: number;
	placeholder?: string;
	start_updated?: Moment | undefined;
	last_updated?: Moment | undefined;

}
export const DateFilter = [
	{ value: 1, name: L("HomNay") },
	{ value: 2, name: L("BayNgayGanDay") },
	{ value: 3, name: L("BaMuoiNgayTruoc") },
	{ value: 4, name: L("NamNay") },
	{ value: 5, name: L("NamTruoc") },
	{ value: 6, name: L("TuyChon") },
]
export default class SelectedLastUpdated extends AppComponentBase<IProps> {
	private selectRef: any = React.createRef();
	state = {
		isLoading: false,
		optionFilter: undefined,
		start_updated: undefined,
		last_updated: undefined,
		isDisplayDate: false,
	};


	onChangeDateFilter = async (value: number) => {
		await this.setState({ optionFilter: value });
		await this.onChangeDate(value);
		await this.onChangeDateSelect();
		let isDisplayDate = false;
		if (value == DateFilter[5].value) {
			isDisplayDate = true;
		}
		this.setState({ isDisplayDate: isDisplayDate, last_updated: this.props.last_updated, start_updated: this.props.start_updated });
	}
	onChangeDateSelect = async () => {
		if (!!this.props.onChangeDateSelect) {
			this.props.onChangeDateSelect(this.state.start_updated, this.state.last_updated, this.state.optionFilter);
		}
	}
	onChangeRange = async (start_updated: Moment, last_updated: Moment) => {
		await this.setState({ last_updated: last_updated, start_updated: start_updated });
		await this.onChangeDateSelect();
	}
	onChangeDate = async (status: number) => {
		this.setState({ isLoadDone: true });
		if (status == undefined) {
			this.setState({ last_updated: undefined, start_updated: undefined })
		}
		else {
			let date = moment();
			switch (status) {
				case DateFilter[0].value:
					this.setState({ last_updated: moment().startOf('day'), start_updated: moment().endOf('day') });
					break;
				case DateFilter[1].value:
					date = moment();
					this.setState({ start_updated: date.subtract(7, "days").toDate(), last_updated: moment() });
					break;
				case DateFilter[2].value:
					date = moment();
					this.setState({ start_updated: date.subtract(30, "days").toDate(), last_updated: moment() });
					break;
				case DateFilter[3].value:
					date = moment();
					this.setState({ start_updated: moment(date.startOf('year')), last_updated: moment(date.endOf('year')) });
					break;
				case DateFilter[4].value:
					date = moment().subtract(1, "years");
					this.setState({ start_updated: moment(date.startOf('year')), last_updated: moment(date.endOf('year')) });
					break;
				case DateFilter[5].value:
					break;
				default:
					break;
			}
		}
		this.setState({ isLoadDone: false });
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {
		const left = this.state.isDisplayDate ? AppConsts.cssPanel(12) : AppConsts.cssPanel(24);
		const right = this.state.isDisplayDate ? AppConsts.cssPanel(12) : AppConsts.cssPanel(0);
		return (
			<Row>
				<Col {...left}>
					<Select
						showSearch
						allowClear
						placeholder={this.props.placeholder}
						loading={this.state.isLoading}
						style={{ width: '100%' }}
						value={this.props.optionFilter}
						onChange={async (value: number) => await this.onChangeDateFilter(value)}
						filterOption={(input, option) => {
							let str = option!.props!.children! + "";
							return str.toLowerCase()!.indexOf(input.toLowerCase()) >= 0;
						}}
					>
						{DateFilter.map(item =>
							<Option key={"key_completed_plan_" + item.value} value={item.value}>{item.name}</Option>
						)}
					</Select>
				</Col>
				<Col {...right}>
					{this.state.isDisplayDate &&
						<RangePicker allowClear={false} defaultOpen={true} onChange={(value) => this.onChangeRange(value![0]!, value![1]!)} />
					}
				</Col>
			</Row>
		);
	}

}

