import * as React from 'react';
import { Divider, Input, Modal, Select } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import { ItemPublisher, PublisherAbtractDto, PublisherDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SettingOutlined } from '@ant-design/icons';
import Publisher from '@src/scenes/Manager/General/Publisher';
import { L } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;
export interface IProps {
	onChangePublisher?: (item: ItemPublisher | undefined) => void;
	publisherId?: number | undefined;
	publisher?: ItemPublisher;
}

export default class SelectedPublisher extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		pu_id_selected: undefined,
		visibleModalPublisher: false,
	};
	publisherListResult: PublisherAbtractDto[] = [];
	async componentDidMount() {
		await this.setState({ isLoading: true });
		const publisherListResult = stores.sessionStore.getPublisherToManager();
		this.publisherListResult = publisherListResult.filter(item => item.pu_is_delete === false);
		if (this.props.publisher != undefined || this.props.publisherId != undefined) {
			this.setState({ pu_id_selected: this.props.publisher!.id || this.props.publisherId });
		}
		await this.setState({ isLoading: false });
	}

	componentDidUpdate(prevProps) {
		if (this.props.publisher !== prevProps.publisher) {
			this.setState({ pu_id_selected: this.props.publisher!.id });
		}
		if (this.props.publisherId !== prevProps.publisherId) {
			this.setState({ pu_id_selected: this.props.publisherId });
		}
	}


	onChangePublisherSelected = async (pu_id: number) => {

		await this.setState({ pu_id_selected: pu_id });
		if (pu_id == undefined) {
			if (this.props.onChangePublisher != undefined) {
				this.props.onChangePublisher(undefined);
			}
		} else {

			if (this.publisherListResult.length > 0) {
				let publisherDto: PublisherAbtractDto | undefined = this.publisherListResult.find((item) => item.pu_id == pu_id);
				let itemData = new ItemPublisher();
				if (publisherDto != undefined) {
					itemData.id = publisherDto.pu_id;
					itemData.name = publisherDto.pu_name;
				}

				if (this.props.onChangePublisher != undefined) {
					this.props.onChangePublisher(itemData);
				}
			}
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
		return (
			<>
				<Select style={{ width: "100%" }}
					showSearch
					allowClear
					onChange={this.onChangePublisherSelected}
					value={this.state.pu_id_selected}
					placeholder={L('Publisher') + "..."}
					loading={this.state.isLoading}
					filterOption={this.handleFilter}
					dropdownRender={menu => (<div>
						{menu}
						{/* <Divider style={{ margin: '4px 0' }} />
						<div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "center" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ visibleModalPublisher: true })} >
							<SettingOutlined title={'Manager'} /> {L('Managers')}
						</div> */}
					</div>
					)}>
					{this.publisherListResult.map(item => (
						<Option key={"key_publishers_" + item.pu_id} value={item.pu_id}>{item.pu_name}</Option>
					))}
				</Select>
				{/* <Modal
					visible={this.state.visibleModalPublisher}
					title={L('AddNewPublisherList')}
					onCancel={() => { this.setState({ visibleModalPublisher: false }) }}
					footer={null}
					width='90vw'
					maskClosable={false}
				>
					<Publisher />
				</Modal> */}
			</>
		);
	}

}

