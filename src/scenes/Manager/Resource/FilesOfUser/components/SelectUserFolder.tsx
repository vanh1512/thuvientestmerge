import * as React from 'react';
import { Select } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { FilesOfUserDto, FilesOfUserRolesDto, FolderDto, FolderRolesDto, ItemUser, UserDto } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';

const { Option } = Select;

export interface IProps {
    onChangeUser?: (item_arr: ItemUser[]) => void;
    listUs_id: any[];
    id_ower: any;
}

export default class SelectUserFolder extends AppComponentBase<IProps> {
    state = {
        isLoadDone: false,
    };
    userItem: number[] = [];
    listUserDisplay: UserDto[] = [];

    async componentDidMount() {
        await this.initData();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.listUs_id !== this.props.listUs_id) {
            this.initData();
        }
    }
    initData = async () => {
        this.setState({ isLoadDone: false });
        let { currentLogin } = stores.sessionStore;
        if (currentLogin != undefined && currentLogin.users != undefined) {
            this.listUserDisplay = currentLogin.users;
        }

        let listUsId = [...this.props.listUs_id].map(i => i.us_id);
        let listIdOwer = [this.props.id_ower];
        this.listUserDisplay = this.listUserDisplay.filter(a => !listUsId.includes(a.id));
        this.listUserDisplay = this.listUserDisplay.filter(item => !listIdOwer.includes(item.id));
        this.setState({ isLoadDone: true });
    }
    onChangeUser = async (userItem: number[]) => {
        const userss = await stores.sessionStore.getAllUsers();
        this.userItem = userItem;

        if (userss != undefined && userItem !== undefined) {
            let selected_users: ItemUser[] = [];
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
    render() {
        return (
            <Select
                showSearch
                allowClear
                mode="multiple"
                placeholder={L("Select") + "..."}
                style={{ width: '100%' }}
                value={this.userItem}
                onChange={this.onChangeUser}
                filterOption={(input, option) => {
                    let str = option!.props!.children! + "";
                    return str.toLowerCase()!.indexOf(input.toLowerCase()) >= 0;
                }}
            >
                {this.listUserDisplay.map((item: UserDto) =>
                    <Option key={"key_user_admin_" + item.id + "_" + item.name} value={item.id}>{item.name}</Option>
                )}
            </Select>
        );
    }

}

