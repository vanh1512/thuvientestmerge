import * as React from 'react';
import { Select } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import { DictionaryTypeAbtractDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@src/lib/abpUtility';
const { Option } = Select;
export interface IProps {
	onChangeDictionaryType?: (item: DictionaryTypeAbtractDto) => void;
	selected_dic_ty_id?: number;
	onClear?: () => void;

}

export default class SelectedDictionaryType extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		dic_ty_id_selected: undefined,
		visibleModalDictionaryType: undefined,
	};
	dictionaryTypeListResult: DictionaryTypeAbtractDto[] = [];
	async componentDidMount() {
		await this.setState({isLoading: true});
		await stores.dictionaryTypeStore.getAll(undefined, undefined, undefined);
		const dictionaryTypeListResult = await stores.sessionStore.getDictionaryType()
		this.dictionaryTypeListResult = dictionaryTypeListResult.filter(item => item.dic_ty_is_delete === false);
		if(this.props.selected_dic_ty_id != undefined){
			this.setState({dic_ty_id_selected:this.props.selected_dic_ty_id});
		}
		await this.setState({isLoading: false});
	}

	componentDidUpdate(prevProps) {
		if (this.props.selected_dic_ty_id !== prevProps.selected_dic_ty_id) {
			this.setState({ dic_ty_id_selected: this.props.selected_dic_ty_id });
		}
	}

	onChangeDictionaryTypeSelected = async (dic_ty_id: number) => {
		// const dictionaryTypeListResult = stores.sessionStore.getDictionaryType();
		await this.setState({ dic_ty_id_selected: dic_ty_id });
		if (this.dictionaryTypeListResult.length > 0) {
			let dictionaryTypeDto = this.dictionaryTypeListResult.find((item) => item.dic_ty_id == dic_ty_id);
			
			if (!!dictionaryTypeDto && !!this.props.onChangeDictionaryType) {
				this.props.onChangeDictionaryType(dictionaryTypeDto);
			}
		}
	}

	componentWillUnmount() {
		this.setState = (state,callback)=>{
			return;
		};
	}
	onClearSelect = async () => {
		await this.setState({ dic_ty_id_selected: undefined });
		if (this.props.onClear != undefined) {
			this.props.onClear();
		}
	}
	render() {
		const dictionaryTypeListResult = stores.sessionStore.getDictionaryType();

		return (
			<>
				<Select style={{width: "100%" }}
					onClear={this.onClearSelect}
					showSearch
					onChange={(value: number) => this.onChangeDictionaryTypeSelected(value)}
					allowClear
					value={this.state.dic_ty_id_selected}
					placeholder={L('tu_dien') + '...'}
					loading={this.state.isLoading}
					filterOption={(input, option) => {
						let str = option!.props!.children! + "";
						return str.toLowerCase()!.indexOf(input.toLowerCase()) >= 0;
					}}
					>
					{dictionaryTypeListResult.map(item => (
						<Option key={"key_dictionaryTypes_" + item.dic_ty_id} value={item.dic_ty_id}>{item.dic_ty_name}</Option>
					))}
				</Select>
			</>
		);
	}

}

