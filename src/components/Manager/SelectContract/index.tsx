import * as React from 'react';
import { Select } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { ContractDto, ContractStatus } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';
import { enumContracStatus } from '@src/lib/enumconst';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;

export interface IProps {
	onChangeContract?: (contractDto: number) => void;
	co_id?: number;
}

export default class SelectContract extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		co_id: undefined,
	};
	componentDidMount() {
		if (this.props.co_id != undefined) {
			this.setState({ co_id: this.props.co_id });
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.co_id !== prevProps.co_id) {
			this.setState({ co_id: this.props.co_id });
		}
	}

	onChangeContract = async (co_id: number) => {
		await this.setState({ co_id: co_id });
		if (!!this.props.onChangeContract) {
			this.props.onChangeContract(co_id);
		}
	}
	handleFilter = (inputValue, option) => {
		const normalizedInput = AppConsts.boDauTiengViet1(inputValue.toLowerCase());
		const normalizedOptionLabel = AppConsts.boDauTiengViet1(option.children.toLowerCase());
		return normalizedOptionLabel.indexOf(normalizedInput) >= 0;
	};
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {
		const { contractListResult } = stores.contractStore;

		return (
			<>
				<Select
					allowClear
					showSearch
					placeholder={L('Contract') + '...'}
					loading={this.state.isLoading}
					style={{ width: '100%' }}
					value={this.state.co_id}
					onChange={async (value: number) => await this.onChangeContract(value)}
					filterOption={this.handleFilter}
				>
					{contractListResult.map((item: ContractDto, index: number) => {
						if (item.co_status == enumContracStatus.DOING.num)
							return <Option key={"key_contract_" + index} value={item.co_id!}>{item.co_code + "__" + item.co_name}</Option>
					})}
				</Select>
			</>
		);
	}

}

