import * as React from 'react';
import { Card, Col, Row, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@lib/abpUtility';
import Stores from '@stores/storeIdentifier';
import { stores } from '@stores/storeInitializer';
import moment from 'moment'
import { CalendarOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { eUserType } from '@src/lib/enumconst';
import DetailInformationUser from './components/DetailInfomationUser';
import DetailInformationMember from './components/DetailInfomationMember';
const { currentLogin } = stores.sessionStore;

@inject(Stores.UserStore, Stores.SessionStore)
@observer

export default class UserInformation extends AppComponentBase {
	private buttonRef: any = React.createRef();
	state = {
		currentId: -1,
		isLoadDone: true,
		visibleModalUpdate: false,
	}
	async componentDidMount() {
		await this.setState({ isLoadDone: false });
		await stores.sessionStore.getCurrentLoginInformations();
		this.setState({ currentId: currentLogin.user!.id });
		await this.getAll();
		await this.setState({ isLoadDone: true });
	}

	async getAll() {
		if (this.state.currentId >= 0) {
			await stores.userStore.getUserById(this.state.currentId);
		}
	}
	updateSuccess = async () => {
		await this.setState({ isLoadDone: false })
		await this.getAll();
		await stores.sessionStore.getCurrentLoginInformations();
		await this.setState({ isLoadDone: true, visibleModalUpdate: !this.state.visibleModalUpdate });
	}
	closeOpenCreateUpdate = () => {
		this.setState({ visibleModalUpdate: !this.state.visibleModalUpdate })
	}

	render() {
		const { editUser } = stores.userStore;
		const { currentLogin } = stores.sessionStore;
		return (
			<Card>
				<Row style={{ marginTop: '10px' }}>
					<h3>1.{L("LoginInformation")}</h3>
				</Row>
				{editUser &&
					<Row style={{ marginTop: '10px' }}>
						<Col span={10} offset={1}>
							<Row gutter={16} style={{ marginTop: '10px' }}>
								<UserOutlined style={{ zoom: 1.5 }} /><b>{L("NameUser")} &nbsp;: &nbsp;</b> <label>{currentLogin.user.name}</label>
							</Row>
							<Row gutter={16} style={{ marginTop: '10px' }}>
								<CalendarOutlined style={{ zoom: 1.5 }} /><b>&nbsp;{L("ngay_tao_tai_khoan")}: &nbsp;</b> <label>{moment(editUser.us_created_at).format("DD/MM/YYYY")}</label>
							</Row>
						</Col>
						<Col span={13}>
							<Row gutter={16} style={{ marginTop: '10px' }}>
								<SolutionOutlined style={{ zoom: 1.5 }} /><b>&nbsp;{L("UserName")}: &nbsp;</b> <label>{currentLogin.user.userName}</label>
							</Row>
							<Row gutter={16} style={{ marginTop: '10px' }}>
								<CalendarOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("LastLogin")}: &nbsp;</b> <label>{moment(editUser.lastLoginTime!).format('DD-MM-YYYY')}</label>
							</Row>
						</Col>
					</Row>
				}
				<Row style={{ marginTop: '10px', justifyContent: 'space-between' }}>
					<h3>2.{L('UserInformation')}</h3>
				</Row>
				<Col span={24} >
					{(editUser && editUser.us_type == eUserType.Member.num) ?
						<DetailInformationMember visibleModalUpdateMember={this.state.visibleModalUpdate} updateSuccess={this.updateSuccess} closeCreateUpdate={this.closeOpenCreateUpdate} ref={this.buttonRef} />
						:
						<DetailInformationUser closeOpenCreateUpdate={this.closeOpenCreateUpdate} currentLogin={currentLogin} visibleModalUpdateMember={this.state.visibleModalUpdate} updateSuccess={this.updateSuccess} editUser={editUser} ref={this.buttonRef} />
					}
				</Col>
			</Card>
		);
	}
}
