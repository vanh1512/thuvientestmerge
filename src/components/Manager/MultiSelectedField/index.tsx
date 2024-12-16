import * as React from 'react';
import { Divider, Modal, Select } from 'antd';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SettingOutlined } from '@ant-design/icons';
import HistoryHelper from '@src/lib/historyHelper';
import { RouterPath } from '@src/lib/appconst';
import Fields from '@src/scenes/Manager/General/Fields';
import { FieldsAbtractDto, ItemField } from '@src/services/services_autogen';
const { Option } = Select;
export interface IProps {
	mode?: "multiple" | undefined;
	onChangeField?: (item_arr: ItemField[] |undefined) => void;
	// onChangeFieldId?: (item_arr: number | number[]) => void;
	// fie_id?: number | number[];
	fields?: ItemField[] |undefined;
}

export default class MultiSelectedField extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		visibleModalField: false,
	};
	fields:number[];
	fieldsListResult:FieldsAbtractDto[]=[];
	async componentDidMount() {
		await this.setState({ isLoading: true });
		const fieldsListResult= stores.sessionStore.getFields();
			this.fieldsListResult = fieldsListResult.filter(item => item.fie_is_delete===false);
		this.initData();
		await this.setState({ isLoading: false });

	}

	componentDidUpdate(prevProps) {
		if (this.props.fields !== prevProps.fields) {
			this.initData();
		}
	}
	initData = async () => {
		if (this.props.fields != undefined) {
			this.fields = [];
			if (Array.isArray(this.props.fields)) {
				this.props.fields.map((item: ItemField) => {
					this.fields.push(item.id);
				})
			}
		}
	}
	onChangeFieldSelected = async (fie_id_arr: number[]) => {
		let arrayField: ItemField[] = [];
		this.fields=fie_id_arr;
		if (this.fieldsListResult.length > 0) {
			fie_id_arr.forEach(
				item => {
					const field = this.fieldsListResult.find(x => x.fie_id === item);
					let fieldItem = new ItemField();
					fieldItem.id = field!.fie_id;
					fieldItem.name = field!.fie_name;
					arrayField.push(fieldItem);
				}
			)
		}

		if (this.props.onChangeField != undefined) {
			this.props.onChangeField(arrayField)
		}
	}
	clickManagerField = () => {
		this.setState({ visibleModalCreate: true });
		HistoryHelper.redirect(RouterPath.admin_general_field);
	};

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {

		return (
			<>
				<Select style={{ width: "100%" }}
					onSearch={async (e) => {
						await this.setState({ su_search: e });
					}}
					mode={this.props.mode}
					showSearch
					onChange={this.onChangeFieldSelected}
					value={this.fields}
					allowClear={true}
					placeholder={L('Fields') + "..."}
					loading={this.state.isLoading}
					dropdownRender={menu => (<div>
						{menu}
						{/* <Divider style={{ margin: '4px 0' }} /> */}
						{/* <div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "center" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ visibleModalField: true })} >
							<SettingOutlined title={L('Manager')} /> {L('Manager')}
						</div> */}
					</div>
					)}>
					{this.fieldsListResult.map(item => (
						<Option key={"key_field_" + item.fie_id} value={item.fie_id!}>{item.fie_name}</Option>
					))}
				</Select>
				{/* <Modal
					visible={this.state.visibleModalField}
					title={L('AddNewFieldsList')}
					onCancel={() => { this.setState({ visibleModalField: false }) }}
					footer={null}
					width='90vw'
					maskClosable={false}
				>
					<Fields />
				</Modal> */}
			</>
		);
	}

}

