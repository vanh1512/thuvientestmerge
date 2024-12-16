import * as React from 'react';
import { Col, Row, Tabs, Card, } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { inject, observer } from 'mobx-react';
import { L } from '@lib/abpUtility';
import Stores from '@stores/storeIdentifier';
import './index.css'
import { EmailSettingsEditDto, GeneralSettingsEditDto, HostSettingsEditDto, SecuritySettingsEditDto, SendGmailSettingsEditDto } from '@services/services_autogen';
import GeneralSettings from './components/GeneralSettings';
import UserSettings from './components/UserSettings';
import EmailSetting from './components/EmailSetting';
import { stores } from '@src/stores/storeInitializer';
import AutoSentEmailSetting from './components/AutoSentEmailSetting';
const { TabPane } = Tabs;
@inject(Stores.SessionStore)
@observer

export default class Setting extends AppComponentBase {
	state = {
		isLoadDone: false,
		visibleViewLogLogin: false,
		skipCount: 0,
		pageSize: 10,
		browserInfo: "",
		clientIpAddress: "",
		currentPage: 1,
		tabCurrent: "tabslog1"
	};
	// hostSetting: HostSettingsEditDto[] = [];
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		this.getAllSetting();
		this.setState({ isLoadDone: true });
	}


	async getAll() {
		this.setState({ isLoadDone: false });
		this.setState({ isLoadDone: true, });

	}


	async getAllSetting(){
		this.setState({ isLoadDone: false });
		await stores.settingStore.getAll();
		this.setState({ isLoadDone: true  });
	}

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}



	onChangeTabs = async (value) => {
		if (!!value) {
			await this.setState({ tabCurrent: value });
			await this.getAll();
		}
	}

	onUpdateSetting=async(setting: HostSettingsEditDto) =>{
		await stores.settingStore.updateSetting(setting);
	}

	onSaveEmailSetting=(item: EmailSettingsEditDto,item2: GeneralSettingsEditDto) =>{
		const {hostSetting} = stores.settingStore;
		let setting:HostSettingsEditDto= hostSetting;
		setting.email = item;
		setting.general = item2;
		item2.maxUploadedData = setting.general.maxUploadedData * 1024 *1024 ;
		item2.maxResourcesData = setting.general.maxResourcesData*1024 *1024 *1024;
		this.onUpdateSetting(setting);
	}


	onSaveGeneralSetting=async(item: GeneralSettingsEditDto) =>{
		const {hostSetting} = stores.settingStore;
		let setting:HostSettingsEditDto= hostSetting;
		setting.general = item;
		item.maxUploadedData = setting.general.maxUploadedData * 1024 *1024 ;
		item.maxResourcesData = setting.general.maxResourcesData*1024 *1024 *1024;
		await stores.settingStore.updateSetting(setting);
	}

	onSaveUserSetting=(item: SecuritySettingsEditDto, item2: GeneralSettingsEditDto) =>{
		const {hostSetting} = stores.settingStore;
		let setting:HostSettingsEditDto= hostSetting;
		setting.security = item;
		setting.general = item2;
		item2.maxUploadedData = setting.general.maxUploadedData * 1024 *1024 ;
		item2.maxResourcesData = setting.general.maxResourcesData*1024 *1024 *1024;
		this.onUpdateSetting(setting);
	}
	onSaveSendGmailSetting=(item: SendGmailSettingsEditDto,item2: GeneralSettingsEditDto) =>{
		const {hostSetting} = stores.settingStore;
		let setting:HostSettingsEditDto= hostSetting;
		setting.sendGmail = item;
		setting.general = item2;
		item2.maxUploadedData = setting.general.maxUploadedData * 1024 *1024 ;
		item2.maxResourcesData = setting.general.maxResourcesData*1024 *1024 *1024;
		this.onUpdateSetting(setting);
	}
	render() {

		const {hostSetting} = stores.settingStore;
		
		return (
			<Card>
				<Row>
					<Col
						xs={{ span: 22, offset: 0 }}
						sm={{ span: 22, offset: 0 }}
						md={{ span: 22, offset: 0 }}
						lg={{ span: 22, offset: 0 }}
						xl={{ span: 22, offset: 0 }}
						xxl={{ span: 22, offset: 0 }}
					>
						<h1 style={{ fontSize: '30px' }}>{L("cai_dat")}</h1>
					</Col>
				</Row>
				<Tabs defaultActiveKey="tabslog1">
					<TabPane tab={L("cai_dat_chung")} key="tabslog1">
						<GeneralSettings onSaveGeneralSetting={this.onSaveGeneralSetting} general_setting={hostSetting.general}/>
					</TabPane>
					<TabPane tab={L("cai_dat_email")} key="tabslog2">
						<EmailSetting onSaveEmailSetting={this.onSaveEmailSetting}  general_setting={hostSetting.general} email_setting={hostSetting.email}/>
					</TabPane>
					<TabPane tab={L("cai_dat_nguoi_dung")} key="tabslog3">
						<UserSettings onSaveUserSetting={this.onSaveUserSetting}  general_setting={hostSetting.general} user_setting={hostSetting.security}/>
					</TabPane>
					<TabPane tab={L("cai_dat_email_tu_dong_gui")} key="tabslog4">
						<AutoSentEmailSetting  auto_email_setting={hostSetting.sendGmail} general_setting={hostSetting.general} onSaveEmailSetting={this.onSaveSendGmailSetting}/>
					</TabPane>
				</Tabs>
			</Card >
		);
	}
}