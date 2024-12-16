import * as React from 'react';
import { Select } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { ItemUser, UserDto } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';

const { Option } = Select;

export interface IProps {
	mode?: "multiple" | undefined;
	onChangeUser?: (item_arr: ItemUser[]) => void;
	userItem?: ItemUser[] | undefined;
	role_user?: number;
	user_id?: number;
	update?: boolean;
	onClear?: () => void;
}

export default class SelectUser extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();
	state = {
		isLoadDone: false,
	};
	userItem: number[] = [];
	listUserDisplay: UserDto[] = [];

	async componentDidMount() {
		await this.initData();
	}
	componentDidUpdate(prevProps) {
		if (prevProps.update !== this.props.update) {
			this.initData();
		}
	}
	initData = async () => {
		this.setState({ isLoadDone: false });
		if (this.props.userItem != undefined) {
			this.userItem = [];
			if (Array.isArray(this.props.userItem)) {
				this.props.userItem.map((item: ItemUser) => {
					this.userItem.push(item.id);
				})
			}
		}
		else {
			this.userItem = [];
		}
		if (this.props.user_id != undefined) {
			this.userItem = [this.props.user_id]
		}
		let { currentLogin } = stores.sessionStore;
		if (currentLogin != undefined && currentLogin.users != undefined) {
			let newList = [...currentLogin.users];
			if (this.props.role_user != undefined) {
				newList = newList.filter(item => item.us_type == this.props.role_user);
			}
			this.listUserDisplay = newList.filter(item => item.isDeleted == false && item.isActive == true);
		}
		this.setState({ isLoadDone: true });
	}
	onChangeUser = async (userItem: number[]) => {
		const userss = stores.sessionStore.getAllUsers();
		this.userItem = userItem;

		if (userss != undefined && userItem !== undefined) {
			let selected_users: ItemUser[] = [];
			if (typeof (userItem) == "number") {
				let userDto = userss.find((item) => item.id === userItem);
				if (!!userDto) {
					let itemData = new ItemUser();
					itemData.id = userDto.id;
					itemData.name = userDto.name;
					itemData.me_id = userDto.me_id!;
					selected_users.push(itemData);
				}
			} else {
				for (let i = 0; i < userItem.length; i++) {
					let userDto = userss.find((item) => item.id === userItem[i]);
					if (!!userDto) {
						let itemData = new ItemUser();
						itemData.id = userDto.id;
						itemData.name = userDto.name;
						itemData.me_id = userDto.me_id!;
						selected_users.push(itemData);
					}
				}
			}
			if (this.props.onChangeUser != undefined) {
				this.props.onChangeUser(selected_users);
			}
		}
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}

	onClearUser() {
		this.setState({ isLoading: true });
		this.userItem = [];
		this.props.onClear != undefined && this.props.onClear();
		this.setState({ isLoading: false });
	}
	handleFilter = (inputValue, option) => {
		const normalizedInput = AppConsts.boDauTiengViet1(inputValue.toLowerCase());
		const normalizedOptionLabel = AppConsts.boDauTiengViet1(option.children.toLowerCase());
		return normalizedOptionLabel.indexOf(normalizedInput) >= 0;
	};
	render() {
		return (
			<Select
				showSearch
				allowClear
				disabled={this.props.user_id != -1 ? false : true}
				onClear={() => this.onClearUser()}
				mode={this.props.mode}
				placeholder={L("Select") + "..."}
				style={{ width: '100%' }}
				value={this.userItem}
				onChange={this.onChangeUser}
				filterOption={this.handleFilter}
			>
				{this.listUserDisplay.map((item: UserDto) =>
					<Option key={"key_user_admin_" + item.id + "_" + item.name} value={item.id}>{item.surname + " " + item.name}</Option>
				)}
			</Select>
		);
	}

}

