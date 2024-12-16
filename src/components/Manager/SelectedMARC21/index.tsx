import * as React from 'react';
import AppComponentBase from '../AppComponentBase';
import { Divider, Modal, Select } from 'antd';
import { AuthorAbtractDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import { SettingOutlined } from '@ant-design/icons';
import Author from '@src/scenes/Manager/General/Author';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;
export interface IProps {
	onChangeMARC21?: (item: number) => void;
	selected_marc21?: number;
	onClear?: () => void;
}

export default class SelectedMARC21 extends AppComponentBase<IProps>{
	state = {
		isLoading: false,
		marc21_selected: undefined,
	};
	async componentDidMount() {
		await this.setState({ isLoading: true });
		if (this.props.selected_marc21 != undefined) {
			this.setState({ marc21_selected: this.props.selected_marc21 });
		}
		await this.setState({ isLoading: false });
	}
	componentDidUpdate(prevProps) {
		if (this.props.selected_marc21 !== prevProps.selected_marc21) {
			this.setState({ marc21_selected: this.props.selected_marc21 });
		}
	}

	onChangeMARC21 = async (mar_21: number) => {
		await this.setState({ marc21_selected: mar_21 });
		if (!!this.props.onChangeMARC21) {
			this.props.onChangeMARC21(mar_21);
		}
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	handleFilter = (inputValue, option) => {
		const normalizedInput = AppConsts.boDauTiengViet1(inputValue.toLowerCase());
		const normalizedOptionLabel = AppConsts.boDauTiengViet1(option.children.toLowerCase());
		return normalizedOptionLabel.indexOf(normalizedInput) >= 0;
	};
	onClearSelect() {
		this.setState({ marc21_selected: undefined });
		if (this.props.onClear != undefined) {
			this.props.onClear();
		}
	}

	render() {
		const { totalMarc21, marc21ListResult } = stores.marc21Store;
		return (
			<div>
				<Select style={{ width: "100%" }}
					showSearch
					onChange={(value: number) => this.onChangeMARC21(value)}
					allowClear
					onClear={() => this.onClearSelect()}
					value={this.state.marc21_selected}
					placeholder={L('MARC21') + "..."}
					loading={this.state.isLoading}
					filterOption={this.handleFilter}
				>
					{marc21ListResult.map(item => (
						<Option key={"key_topics_" + item.mar_id} value={item.mar_id}>{item.mar_code}</Option>
					))}
				</Select>
			</div>
		)
	}
}