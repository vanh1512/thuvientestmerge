import * as React from 'react';
import { Divider, Modal, Select, } from 'antd';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import { ItemLanguages, LanguagesDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SettingOutlined } from '@ant-design/icons';
import DocumentLanguages from '@src/scenes/Manager/General/DocumentLanguages';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;
export interface IProps {
	onChangeLanguages?: (value: ItemLanguages | ItemLanguages[]) => void;
	//onChangeLanguagesId?: (value: number | number[]) => void;
	mode?: "multiple" | undefined;
	lang?: ItemLanguages[] | undefined;
}

export default class SelectedLanguages extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		visibleModalLanguages: false,
	};

	langs: number[];
	async componentDidMount() {
		await this.setState({ isLoading: true });
		this.initData()
		await this.setState({ isLoading: false });
	}


	componentDidUpdate(prevProps) {
		if (this.props.lang !== prevProps.lang) {
			this.initData();
		}
	}
	initData = async () => {
		if (this.props.lang != undefined) {
			this.langs = [];
			if (Array.isArray(this.props.lang)) {
				this.props.lang.map((item: ItemLanguages) => {
					this.langs.push(item.id);
				})
			}
		}
	}
	onChangeLanguagesSelected = async (la_id: number[]) => {
		const languagesListResult = stores.sessionStore.getLangsToManager();
		let arrayLanguage: ItemLanguages[] = [];
		this.langs = la_id;
		if (languagesListResult.length > 0) {
			la_id.forEach(
				itemLaId => {
					let selectedLanguage = languagesListResult.find(item => item.la_id == itemLaId);
					let langItem = new ItemLanguages();
					langItem.id = selectedLanguage!.la_id;
					langItem.name = selectedLanguage!.la_title;
					arrayLanguage.push(langItem);
				}
			)
			if (this.props.onChangeLanguages !== undefined) {
				this.props.onChangeLanguages(arrayLanguage);
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
		const languagesListResult = stores.sessionStore.getLangsToManager();
		return (
			<>
				<Select style={{ width: "100%" }}
					showSearch
					mode={this.props.mode}
					onChange={this.onChangeLanguagesSelected}
					value={this.langs}
					allowClear={true}
					placeholder={L("Languages")}
					loading={this.state.isLoading}
					filterOption={this.handleFilter}
					dropdownRender={menu => (<div>
						{menu}
						{/* <Divider style={{ margin: '4px 0' }} /> */}
						{/* <div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "center" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ visibleModalLanguages: true })} >
							<SettingOutlined title={L('Manager')} /> {L('Managers')}
						</div> */}
					</div>
					)}>
					{languagesListResult.map(item => (
						<Option key={"key_la_" + item.la_id} value={item.la_id!}>{item.la_title}</Option>
					))}
				</Select>
				{/* <Modal
					visible={this.state.visibleModalLanguages}
					title={L('AddNewLanguageList')}
					onCancel={() => { this.setState({ visibleModalLanguages: false }) }}
					footer={null}
					width='90vw'
					maskClosable={false}
				>
					<DocumentLanguages />
				</Modal> */}
			</>
		);
	}

}

