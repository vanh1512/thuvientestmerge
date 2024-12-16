import * as React from 'react';
import { Divider, Modal, Select, } from 'antd';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import { ItemSupplier, SupplierAbtractDto, SupplierDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SettingOutlined } from '@ant-design/icons';
import Supplier from '@src/scenes/Manager/General/Supplier';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;
export interface IProps {
	onChangeSupplier?: (item: ItemSupplier) => void;
	supplier?: ItemSupplier;
	supplierID?: number;
	checkItem?: boolean;
}

export default class SelectedSupplier extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		supplier_selected: undefined,
		visibleModalSupplier: false,
	};

	async componentDidMount() {
		await this.setState({ isLoading: true });
		if (this.props.supplier != undefined) {
			this.setState({ supplier_selected: this.props.supplier!.id });
		}
		if (this.props.supplierID != undefined) {
			this.setState({ supplier_selected: this.props.supplierID! });
		}
		await this.setState({ isLoading: false });
	}

	componentDidUpdate(prevProps) {
		if (this.props.supplier !== prevProps.supplier) {
			this.setState({ supplier_selected: this.props.supplier?.id });
		}
		if (this.props.supplierID !== prevProps.supplierID) {
			this.setState({ supplier_selected: this.props.supplierID });
		}
	}

	onChangeSupplierSelected = async (su_id: number) => {
		const supplierListResult = await stores.sessionStore.getSupplierToManager();
		await this.setState({ supplier_selected: su_id });
		if (supplierListResult.length > 0) {
			let supplierDto: SupplierAbtractDto | undefined = supplierListResult.find((item) => item.su_id == su_id);
			let itemData = new ItemSupplier();
			if (supplierDto != undefined) {
				itemData.id = supplierDto.su_id;
				itemData.name = supplierDto.su_name;
			}

			if (!!this.props.onChangeSupplier) {
				this.props.onChangeSupplier(itemData);
			}
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
	render() {
		const supplierListResult = stores.sessionStore.getSupplierToManager();
		return (
			<>
				<Select style={{ width: "100%" }}
					disabled={this.props.checkItem}
					onSearch={async (e) => {
						await this.setState({ su_search: e });
					}}
					showSearch
					onChange={(value: number) => this.onChangeSupplierSelected(value)}
					value={this.state.supplier_selected}
					allowClear={true}
					placeholder={L('Supplier') + "..."}
					loading={this.state.isLoading}
					filterOption={this.handleFilter}
					dropdownRender={menu => (<div>
						{menu}
					</div>
					)}>
					{supplierListResult.map(item => (
						<Option key={"key_su_" + item.su_id} value={item.su_id!}>{item.su_name}</Option>
					))}
				</Select>
				<Modal
					visible={this.state.visibleModalSupplier}
					title={L('AddNewSupplier')}
					onCancel={() => { this.setState({ visibleModalSupplier: false }) }}
					footer={null}
					width='90vw'
					maskClosable={false}
				>
					<Supplier />
				</Modal>
			</>
		);
	}

}

