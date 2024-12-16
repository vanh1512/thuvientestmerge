import * as React from 'react';
import { Divider, Input, Modal, Select } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import { TopicAbtractDto, TopicDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SettingOutlined } from '@ant-design/icons';
import Topic from '@src/scenes/Manager/General/Topic';
import { L } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;
export interface IProps {
	onChangeTopic?: (item: number) => void;
	selected_to_id?: number;
	onClear?: () => void;
}

export default class SelectedTopic extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		to_id_selected: undefined,
		visibleModalTopic: undefined,
	};
	topicListResult: TopicAbtractDto[] = [];
	async componentDidMount() {
		await this.setState({ isLoading: true });
		const topicListResult = await stores.sessionStore.getTopic();
		this.topicListResult = topicListResult.filter(item => item.to_is_active === true);

		if (this.props.selected_to_id != undefined) {
			this.setState({ to_id_selected: this.props.selected_to_id });
		}
		await this.setState({ isLoading: false });
	}

	componentDidUpdate(prevProps) {
		if (this.props.selected_to_id !== prevProps.selected_to_id) {
			this.setState({ to_id_selected: this.props.selected_to_id });
		}
	}

	onChangeTopicSelected = async (to_id: number) => {
		await this.setState({ to_id_selected: to_id });
		if (!!this.props.onChangeTopic) {
			this.props.onChangeTopic(to_id);
		}
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	onClearSelect() {
		this.setState({ to_id_selected: undefined });
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

		return (
			<>
				<Select style={{ width: "100%" }}
					showSearch
					onChange={(value: number) => this.onChangeTopicSelected(value)}
					allowClear
					onClear={() => this.onClearSelect()}
					value={this.state.to_id_selected}
					placeholder={L('Topic') + "..."}
					loading={this.state.isLoading}
					filterOption={this.handleFilter}
					dropdownRender={menu => (<div>
						{menu}
						{/* <Divider style={{ margin: '4px 0' }} />
						<div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "center" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ visibleModalTopic: true })} >
							<SettingOutlined title={'Manager'} /> {L('Managers')}
						</div> */}
					</div>
					)}>
					{this.topicListResult.map(item => (
						<Option key={"key_topics_" + item.to_id} value={item.to_id}>{item.to_name}</Option>
					))}
				</Select>
				{/* <Modal
					visible={this.state.visibleModalTopic}
					title={L('AddNewTopicList')}
					onCancel={() => { this.setState({ visibleModalTopic: false }) }}
					footer={null}
					width='90vw'
					maskClosable={false}
				>
					<Topic />
				</Modal> */}
			</>
		);
	}

}

