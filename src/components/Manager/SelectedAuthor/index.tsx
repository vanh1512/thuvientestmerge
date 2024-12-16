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
	onChangeAuthor?: (item: AuthorAbtractDto) => void;
	selected_au_id?: number;
	onClear?: () => void;
}

export default class SelectedAuthor extends AppComponentBase<IProps>{
	state = {
		isLoading: false,
		au_id_selected: undefined,
		visibleModalAuthor: undefined,
	};
	authorListResult: AuthorAbtractDto[] = [];
	async componentDidMount() {
		await this.setState({ isLoading: true });
		await stores.sessionStore.getAuthorToManager();
		// this.authorListResult = authorListResult.filter(item => item.au_is_deleted === false);
		if (this.props.selected_au_id != undefined) {
			this.setState({ au_id_selected: this.props.selected_au_id });
		}
		await this.setState({ isLoading: false });
	}
	componentDidUpdate(prevProps) {
		if (this.props.selected_au_id !== prevProps.selected_au_id) {
			this.setState({ au_id_selected: this.props.selected_au_id });
		}
	}

	onChangeAuthorSelected = async (au_id: number) => {
		await this.setState({ au_id_selected: au_id });
		const authorListResult = stores.sessionStore.getAuthorToManager();
		if (authorListResult.length > 0) {
			let authorDto = authorListResult.find((item) => item.au_id == au_id);
			if (!!authorDto && !!this.props.onChangeAuthor) {
				this.props.onChangeAuthor(authorDto);
			}
		}
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	onClearSelect() {
		this.setState({ au_id_selected: undefined });
		if (this.props.onClear != undefined) {
			this.props.onClear();
		}
	}
	handleFilter = (inputValue, option) => {
		const normalizedInput = AppConsts.boDauTiengViet1(inputValue.toLowerCase());
		const normalizedOptionLabel = AppConsts.boDauTiengViet1(option.children.toLowerCase());
		return normalizedOptionLabel.indexOf(normalizedInput) >= 0;
	};
	render() {
		const authorListResult = stores.sessionStore.getAuthorToManager();
		return (<>
			<Select style={{ width: "100%" }}
				showSearch
				onChange={(value: number) => this.onChangeAuthorSelected(value)}
				allowClear
				onClear={() => this.onClearSelect()}
				value={this.state.au_id_selected}
				placeholder={L('Author') + "..."}
				loading={this.state.isLoading}
				optionFilterProp="children"
				filterOption={this.handleFilter}
				dropdownRender={menu => (<div>
					{menu}
					{/* <Divider style={{ margin: '4px 0' }} />
					<div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "center" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ visibleModalTopic: true })} >
						<SettingOutlined title={'Manager'} /> {L('Managers')}
					</div> */}
				</div>
				)}
			>
				{authorListResult.map(item => (
					<Option key={"key_topics_" + item.au_id} value={item.au_id}>{item.au_name}</Option>
				))}
			</Select>
			<Modal
				visible={this.state.visibleModalAuthor}
				title={L('AddNewAuthorList')}
				onCancel={() => { this.setState({ visibleModalAuthor: false }) }}
				footer={null}
				width='90vw'
				maskClosable={false}
			>
				<Author />
			</Modal>
		</>)
	}
}