import * as React from 'react';
import { Divider, Modal, TreeSelect } from 'antd';
import { TreeReponsitoryDto } from '@src/stores/reponsitoryStore';
import { SettingOutlined } from '@ant-design/icons';
import Repository from '../../../scenes/Manager/General/Repository';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';

export interface IProps {
	onSelectRepository: (re_id: number) => void;
	re_id_select?: number;
	onClear?: () => void;
}
export default class SelectTreeResponsitory extends React.Component<IProps>{
	state = {
		isLoading: false,
		re_id_value: undefined,
		visibleModalRepository: false,
	};

	async componentDidMount() {
		await this.setState({ isLoading: true });
		// await stores.sessionStore.getResponsitoriesToManager();
		if (this.props.re_id_select != undefined) {
			this.setState({ re_id_value: this.props.re_id_select });
		}
		await this.setState({ isLoading: false });
	}

	componentDidUpdate(prevProps) {
		if (this.props.re_id_select !== prevProps.re_id_select) {
			this.setState({ re_id_value: this.props.re_id_select });
		}
	}
	onSelectRepository = (re_id: number) => {
		this.setState({ re_id_value: re_id });
		if (this.props.onSelectRepository != undefined) {
			this.props.onSelectRepository(re_id);
		}
	}
	onClear = () => {
		if (this.props.onClear != undefined) {
			this.props.onClear();
		}
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {
		const treeAbtractRepositoryDto = stores.sessionStore.getTreeResponsitoriesToManager();
		return (
			<>
				<TreeSelect
					showSearch
					filterTreeNode={(search, item) => {
						if (item != undefined) {
							return AppConsts.boDauTiengViet1(item!.re_name!.toLowerCase()).indexOf(AppConsts.boDauTiengViet1(search.toLowerCase())) >= 0;

						}
						return false;
					}}
					style={{ width: '100%' }}
					onClear={this.onClear}
					dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
					treeData={[treeAbtractRepositoryDto!]}
					treeDefaultExpandAll
					value={this.state.re_id_value}
					placeholder={L("Select")}
					allowClear
					onChange={(value: number) => { this.onSelectRepository(value); }}
					dropdownRender={menu => (<div>
						{menu}
						{/* <Divider style={{ margin: '4px 0' }} />
						<div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "center" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ visibleModalRepository: true })} >
							<SettingOutlined title={'Manager'} /> {L('Managers')}
						</div> */}
					</div>
					)}
				/>

			</>
		)
	}
}