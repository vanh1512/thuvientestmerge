import { SettingOutlined } from "@ant-design/icons";
import { L } from "@src/lib/abpUtility";
import { Button, Checkbox, Col, Divider, Drawer, Menu, Popover, Row, Select, Tag } from "antd";
import { ColumnType, ColumnsType } from "antd/lib/table";
import React from "react";
import { ColumnsDisplayType } from "./ColumnsDisplayType";
const { Option } = Select;

const arrayRange = (start, stop, step) =>
	Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step);

export interface IProps {
	listColumn: ColumnsDisplayType<any>;
	onChangeColumn: (listColumn: ColumnsDisplayType<any>) => void;
}
export default class SelectedColumnDisplay extends React.Component<IProps> {
	state = {
		visible: false,
		checkedList: [],
		indeterminate: false,
		checkAll: false,
	};
	listColumn: ColumnsDisplayType<any>;
	async componentDidMount() {
		if (this.props.listColumn != undefined) {
			await this.initData();
		}
	}
	async componentDidUpdate(prevProps) {
		if (this.props.listColumn.length !== prevProps.listColumn.length) {
			await this.initData();
		}
	}
	initData = async () => {
		this.setState({ isLoadDone: false });
		this.listColumn = this.props.listColumn.slice(2, this.props.listColumn.length - 1);
		let defaultColumn = this.listColumn.map((e, i) => e.displayDefault === true ? i : undefined).filter(item => item !== undefined);
		if (defaultColumn === undefined) {
			defaultColumn = [];
		}
		this.onChangeColumn(defaultColumn);
		this.setState({ isLoadDone: true });
	}
	onChangeColumn = async (checkedList) => {
		await this.setState({
			checkedList: checkedList,
			indeterminate: !!checkedList.length && checkedList.length < this.listColumn.length,
			checkAll: checkedList.length === this.listColumn.length,
		});
		let listFilter = this.listColumn.filter((currentValue, index, arr) => checkedList.some(j => index === j))
		if (this.props.onChangeColumn != undefined) {
			this.props.onChangeColumn(listFilter);
		}
	};
	onCheckAllChange = e => {
		const arr = this.state.checkAll === true ? [] : arrayRange(0, this.listColumn.length - 1, 1);
		this.onChangeColumn(arr);
	};

	render() {
		const { checkedList, indeterminate, checkAll } = this.state;
		const checkboxOptions = this.props.listColumn.map((column, index) => ({
			label: column.title?.toString(),
			value: index,
		}));
		return (
			<Row style={{ width: "100%" }}>
				<Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
					<Select
						mode="multiple"
						style={{ width: '100%' }}
						placeholder={L("Show")}
						maxTagTextLength={20}
						maxTagCount={5}
						// defaultValue={this.state.checkedList}
						value={this.state.checkedList}
						onChange={(values) => this.onChangeColumn(values)}
						dropdownRender={menu => (<div>
							{menu}
							<Divider style={{ margin: '4px 0' }} />
							<div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "left" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ onCheckAllChange: true })} >
								<Checkbox
									indeterminate={indeterminate}
									onChange={this.onCheckAllChange}
									checked={checkAll}
								>
									{L("ChooseAll")}
								</Checkbox>
							</div>
						</div>)}
					>
						{!!this.listColumn && this.listColumn.map((option: ColumnType<any>, index: number) => (
							<Option key={"option_" + index} value={index} >{option.title?.toString()}</Option>
						))}

					</Select>
					{/* <Popover content={
						<>
							<Checkbox
								indeterminate={indeterminate}
								onChange={this.onCheckAllChange}
								checked={checkAll}
							>
								{L('ChooseAll')}
							</Checkbox>
							<Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }} value={this.state.checkedList} defaultValue={this.state.checkedList} options={checkboxOptions} onChange={(values) => this.onChangeColumn(values)} />

						</>

					} trigger="click">
						<Button style={{ width: '100%', backgroundColor: 'aquamarine' }}><b> {L('Show')}({checkedList.length} {L('columns')})</b></Button>
					</Popover> */}
				</Col>
			</Row>


		);
	}
}



