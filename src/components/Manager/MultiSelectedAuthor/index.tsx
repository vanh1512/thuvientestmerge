import * as React from 'react';
import { Select } from 'antd';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { AuthorAbtractDto, ItemAuthor } from '@src/services/services_autogen';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;
export interface IProps {
	mode?: "multiple" | undefined;
	onChangeAuthor?: (item_arr: ItemAuthor[] | undefined) => void;
	onChangeAuthorId?: (item_arr: number | number[]) => void;
	authorsId?: number | number[];
	authors?: ItemAuthor[] | undefined;
	selectType: "all" | "only_active";
}

export default class MultiSelectedAuthor extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		visibleModalAuthor: false,
	};
	authors: number[];
	authorListResult: AuthorAbtractDto[] = [];

	async componentDidMount() {
		await this.setState({ isLoading: true });
		const authorListResult = await stores.sessionStore.getAuthorToManager();
		this.authorListResult = authorListResult.filter(item => item.au_is_deleted == false);
		await this.initData();
		await this.setState({ isLoading: false });

	}

	componentDidUpdate(prevProps) {
		if (this.props.authors !== prevProps.authors) {
			this.initData();
		}
	}
	initData = async () => {
		if (this.props.authors != undefined) {
			this.authors = [];
			if (Array.isArray(this.props.authors)) {
				this.props.authors.map((item: ItemAuthor) => {
					this.authors.push(item.id);
				})
			}
		}
	}

	onChangeAuthorSelected = async (au_id_arr: number[]) => {
		this.authors = au_id_arr;
		let selectedauthors: ItemAuthor[] = [];
		if (this.authorListResult.length > 0) {
			au_id_arr.forEach(au_id => {
				const authorDto: AuthorAbtractDto | undefined = this.authorListResult.find((item) => item.au_id === au_id);
				if (authorDto) {
					const itemData = new ItemAuthor();
					itemData.id = authorDto.au_id;
					itemData.name = authorDto.au_name;
					selectedauthors.push(itemData);
				}
			})
		}
		if (this.props.onChangeAuthor != undefined) {
			this.props.onChangeAuthor(selectedauthors);
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
					mode={this.props.mode}
					showSearch
					onChange={(value: number[]) => {
						this.onChangeAuthorSelected(value);
					}}
					value={this.authors}
					allowClear={true}
					placeholder={L("tac_gia") + "..."}
					loading={this.state.isLoading}
					filterOption={this.handleFilter}
					dropdownRender={menu => (<div>
						{menu}
						{/* <Divider style={{ margin: '4px 0' }} />
						<div style={{ padding: '4px 8px', cursor: 'pointer', textAlign: "center" }} onMouseDown={e => e.preventDefault()} onClick={() => this.setState({ visibleModalAuthor: true })} >
							<SettingOutlined title={L('Manager')} /> {L('Managers')}
						</div> */}
					</div>
					)}
				>
					{this.authorListResult.map(item => (
						<Option key={"key_su_" + item.au_id} value={item.au_id}>{item.au_name}</Option>
					))}
				</Select>
			</>
		);
	}

}

