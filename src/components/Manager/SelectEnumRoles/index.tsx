import * as React from 'react';
import { Select, message } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { MEnum } from '@src/lib/enumconst';
import { L } from '@src/lib/abpUtility';
const { Option } = Select;

export interface IProps {
	onChangeEnum: (value: number) => void;
	enum_value?: number;
	eNum: { [key: string]: MEnum };
	disable?: boolean;
	placeholder?: string;
	allowCheck?: boolean;
}

export default class SelectEnumRoles extends AppComponentBase<IProps> {
	state = {
		enum_value: undefined,
	};

	async componentDidMount() {
		if (this.props.enum_value != undefined) {
			this.setState({ enum_value: this.props.enum_value })
		}
	}
	componentDidUpdate(prevProps,prevState) {
		if (this.props.enum_value !== prevProps.enum_value || this.props.enum_value !== prevState.enum_value) {
			this.setState({ enum_value: this.props.enum_value });
		}
	}

	onChangeEnumSelected = (value: number) => {
		this.setState({ enum_value: value });
		if (this.props.onChangeEnum != undefined) {
			this.props.onChangeEnum(value);
		}
	}

	render() {
		const { eNum, placeholder, allowCheck } = this.props;

		return (
			<Select
				disabled={this.props.disable || false}
				style={{ width: "100%" }}
				onChange={this.onChangeEnumSelected}
				value={this.state.enum_value}
				allowClear={(allowCheck != undefined && allowCheck == true) ? false : true}
				placeholder={placeholder ? placeholder : L("Select")}
			>
				{Object.values(eNum).map((item, index: number) =>
					<Option key={"Key_enum_" + index} value={item.num}>{L(item.name)}</Option>
				)}
			</Select>
		);
	}

}

