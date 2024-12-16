import * as React from 'react';
import { TreeSelect } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';

export interface IProps {
	onSelectCategory: (ca_id: number) => void;
	ca_id_select?: number;
	onClear?: () => void;
	disable?: boolean;
}
export default class SelectTreeCategory extends React.Component<IProps>{
	state = {
		isLoading: false,
		ca_id_value: undefined,
		visibleModalCategory: false,
	};
	async componentDidMount() {
		await this.setState({ isLoading: true });
		if (this.props.ca_id_select != undefined) {
			this.setState({ ca_id_value: this.props.ca_id_select });
		}
		await this.setState({ isLoading: false });
	}

	componentDidUpdate(prevProps) {
		if (this.props.ca_id_select !== prevProps.ca_id_select) {
			this.setState({ ca_id_value: this.props.ca_id_select });
		}
	}
	onSelectCategory = async (ca_id: number) => {
		this.setState({ ca_id_value: ca_id });
		if (this.props.onSelectCategory != undefined) {
			this.props.onSelectCategory(ca_id);
		}
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	onClear() {
		this.setState({ ca_id_value: undefined });
		if (this.props.onClear != undefined) {
			this.props.onClear();
		}
	}
	render() {
		const treeAbtractCategoryDto = stores.sessionStore.getTreeCategories();
		return (
			<>
				<TreeSelect
					showSearch
					filterTreeNode={(search, item) => {
						if (item != undefined) {
							return AppConsts.boDauTiengViet1(item!.ca_title!.toLowerCase()).indexOf(AppConsts.boDauTiengViet1(search.toLowerCase())) >= 0;
						}
						return false;
					}}
					style={{ width: '100%' }}
					disabled={this.props.disable}
					dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
					treeData={[treeAbtractCategoryDto]}
					treeDefaultExpandAll
					value={this.state.ca_id_value}
					placeholder={L("Select")}
					allowClear
					onClear={() => this.onClear()}
					onChange={(value: number) => this.onSelectCategory(value)}
					dropdownRender={menu => (<div>
						{menu}					
					</div>
					)}
				/>
			</>
		)
	}
}