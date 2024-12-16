import * as React from 'react';
import { Button, Card, Checkbox, Col, Input, Modal, Popover, Row, Switch, Table, Tag, message } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@lib/abpUtility';
import { CaretDownOutlined, DeleteFilled, EditOutlined, LockOutlined, PlusOutlined, SearchOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AppConsts, { RouterPath, cssCol, cssColResponsiveSpan } from '@lib/appconst';
import HistoryHelper from '@lib/historyHelper';
import PassWordLevel2 from './components/PassWordLevel2';
import './index.css'
import { stores } from '@src/stores/storeInitializer';
import { Int64EntityDto, UserDto } from '@src/services/services_autogen';
import CreateOrUpdateUser from './components/FormCreateOrUpdateUser';
import Check from '@src/scenes/Manager/Check';
import PasswordChanging from '@src/components/PasswordChanging';

const confirm = Modal.confirm;

export default class User extends AppComponentBase {

	state = {
		isLoadDone: false,
		modalCreateUpdate: false,
		modalChangePassWord: false,
		pageSize: 10,
		skipCount: 0,
		currentPage: 1,
		userId: 0,
		filter: '',
		isActive: true,
		visiblePassWordLevel2ModalOpen: false,
		isCheckPassword2: false,
		isExistPassword2: false,
		clicked: false,
		us_id: undefined,
	};
	userSelected: UserDto = new UserDto();

	async componentDidMount() {
		await this.getAll();
		const user = await stores.sessionStore.getUserLogin();

		if (user != undefined && user.hasPassword2 != false) {
			await this.setState({ visiblePassWordLevel2ModalOpen: true, isCheckPassword2: true, isExistPassword2: true });
		} else {
			await this.setState({ visiblePassWordLevel2ModalOpen: true });
		}
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.userStore.getAll(this.state.filter.trim(), undefined, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, modalCreateUpdate: false, modalChangePassWord: false });
	}

	async activateOrDeActive(checked: boolean, id: number) {
		this.setState({ isLoadDone: false });
		let item_id = new Int64EntityDto();
		item_id.id = id;
		if (checked) {
			await stores.userStore.activate(item_id);
			message.success(L("bat_thanh_cong"));
		} else {
			await stores.userStore.deActivate(item_id);
			message.success(L("tat_thanh_cong"));
		}
		await this.getAll();
		this.setState({ isLoadDone: true });
	}

	delete = (item: UserDto) => {
		let self = this;
		const { totalUser } = stores.userStore
		confirm({
			title: L('ban_co_chac_muon_xoa') + ": " + item.fullName + "?",
			async onOk() {
				if (self.state.currentPage > 1 && (totalUser - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				self.setState({ isLoadDone: false });
				await stores.userStore.deleteUser(item.id);
				self.setState({ isLoadDone: true, modalCreateUpdate: false, });
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	createOrUpdateModalOpen = async (inputUser: UserDto) => {
		this.userSelected = inputUser;
		await this.setState({ modalCreateUpdate: true, modalChangePassWord: false });
	}
	async changePassWordModalOpen(inputUser: UserDto) {
		this.userSelected = inputUser;
		await this.setState({ modalChangePassWord: true, modalCreateUpdate: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	};

	openModalPassWordLevel2 = async (isCheckPassword2: boolean) => {
		this.setState({
			isCheckPassword2: isCheckPassword2,
			visiblePassWordLevel2ModalOpen: !this.state.visiblePassWordLevel2ModalOpen,
		});
	};

	onsavePassWordLevel2 = async (val: boolean) => {
		if (val != undefined && val == true) {
			await this.getAll();
		} else {
			Modal.error({ title: L("thong_bao"), content: L("khong_duoc_truy_cap") });
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}

	onCancelUsersPassWordLevel2 = () => {
		this.setState({ visiblePassWordLevel2ModalOpen: false });
		if (this.state.isCheckPassword2 == true) {
			HistoryHelper.redirect(RouterPath.admin_home);
		}
	}

	onChangePage = async (page: number, pageSize?: number) => {
		if (pageSize !== undefined) {
			await this.setState({ pageSize: pageSize });
		}
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page, pageSize: this.state.pageSize });
		await this.getAll()
	};

	handleVisibleChange = (visible, item: UserDto) => {
		this.setState({ clicked: visible, us_id: item.id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}

	content = (item: UserDto) => (
		<div>
			{this.isGranted(AppConsts.Permission.System_Users_Edit) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
						style={{ marginLeft: '10px', marginBottom: "10px" }}
						onClick={() => { this.createOrUpdateModalOpen(item!); this.hide() }}
						size='small'
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.createOrUpdateModalOpen(item!); this.hide() }}>{L("chinh_sua")}</a>
				</Row>)
			}
			{this.isGranted(AppConsts.Permission.System_Users_ChangePassWord) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<LockOutlined />} title={L('doi_mat_khau')}
						style={{ marginLeft: '10px', marginBottom: "10px" }}
						onClick={() => { this.changePassWordModalOpen(item!); this.hide() }}
						size='small'
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.changePassWordModalOpen(item!); this.hide() }}>{L("doi_mat_khau")}</a>
				</Row>)
			}
			{this.isGranted(AppConsts.Permission.System_Users_Delete) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')}
						style={{ marginLeft: '10px', marginBottom: "10px" }}
						onClick={() => { this.delete(item); this.hide() }}
						size='small'
					></Button>
					<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.delete(item!); this.hide() }}>{L("Delete")}</a>
				</Row>)
			}
		</div>
	)
	public render() {
		const left = this.state.modalChangePassWord || this.state.modalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 12, 12, 12) : cssCol(24);
		const right = this.state.modalChangePassWord || this.state.modalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);
		const { users, totalUser } = stores.userStore;
		const self = this;
		const columns = [
			{ title: L('stt'), key: 'stt', width: 50, render: (text: string, item: UserDto, index: number) => <div>{(this.state.currentPage - 1) * this.state.pageSize + index + 1}</div> },
			{ title: L('ten_dang_nhap'), key: 'userName', width: 150, render: (text: string, item: UserDto, index: number) => <div>{item.userName}</div> },
			{ title: L('ho_ten'), key: 'name', width: 150, render: (text: string, item: UserDto, index: number) => <div>{item.surname + " " + item.name}</div> },
			{ title: L('email'), dataIndex: 'emailAddress', key: 'emailAddress', width: 150, render: (text: string) => <div>{text}</div> },
			{
				title: L('kich_hoat'), dataIndex: 'isActive', key: 'isActive', width: 150,
				render: (text: string, item: UserDto) => <Switch checked={item.isActive} onClick={(checked: boolean) => this.activateOrDeActive(checked, item.id)}></Switch>
			},
			{
				title: "", width: 50,
				render: (text: string, item: UserDto) => (
					<Popover visible={this.state.clicked && this.state.us_id == item.id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
						{this.state.clicked && this.state.us_id == item.id ? <CaretDownOutlined/> : <UnorderedListOutlined/>}
					</Popover >
				),
			},
		];

		return (
			<Card>
				<Row gutter={[16, 16]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 8, 5, 4, 4, 4)} >
						<h2 >{L('nguoi_dung')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 11, 12, 12, 12)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<Input onPressEnter={() => this.handleSubmitSearch()} style={{ margin: "0 10px" }} value={this.state.filter} allowClear={true} onChange={(e) => this.setState({ filter: e.target.value })} placeholder={L("UserName") + '...'} />
						<Button title={L('tim_kiem')} type='primary' icon={<SearchOutlined />} onClick={this.handleSubmitSearch}>{L("tim_kiem")}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 8, 8, 8)} className='textAlign-col-992'>
						{this.isGranted(AppConsts.Permission.System_Users_Edit) &&
							<Button title={L('AddNew')} type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new UserDto())} />
						}
						&nbsp;&nbsp;
						<Button  type="primary" icon={<SettingOutlined />} title={L("cai_dat_mat_khau_cap_2")} onClick={() => this.openModalPassWordLevel2(false)}>{L("cai_dat_mat_khau_cap_2")}</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 20 }}>
					<Col {...left} >
						<Table
							className='centerTable'
							rowKey={(record) => record.id!.toString()}
							onRow={(record, rowIndex) => {
								return {
									onDoubleClick: (event: any) => { this.createOrUpdateModalOpen(record!) }
								};
							}}
							scroll={{ y: 600 }}
							size={'middle'}
							bordered={true}
							rowClassName={(record, index) => (this.userSelected.id == record.id ? 'bg-click' : 'bg-white')}
							columns={columns}
							loading={!this.state.isLoadDone}
							dataSource={users === undefined ? [] : users}
							pagination={{
								pageSize: this.state.pageSize,
								total: users === undefined ? 0 : totalUser,
								current: this.state.currentPage,
								showTotal: (total) => L("tong") + " " + AppConsts.formatNumber(total),
								showQuickJumper: true,
								showSizeChanger: true,
								onShowSizeChange(current: number, size: number) {
									self.onChangePage(current, size)
								},
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize),
								pageSizeOptions: ['10', '20', '50', '100'],
							}}
						// onChange={this.handleTableChange}
						/>
					</Col>
					<Col {...right}>
						{this.state.modalCreateUpdate &&
							<CreateOrUpdateUser
								onCancel={() => {
									this.setState({ modalCreateUpdate: false, });
								}}
								onCreateOrUpdatedSuccess={async () => { await this.getAll() }}
								userSelected={this.userSelected}
							/>
						}
						{this.state.modalChangePassWord &&
							<PasswordChanging
								onClose={() => this.setState({ modalChangePassWord: false })}
								user_id={this.userSelected.id}
							/>
						}
					</Col>
				</Row>

				<Modal
					title={L("mat_khau_cap_2")}
					visible={this.state.visiblePassWordLevel2ModalOpen}
					onCancel={() => this.onCancelUsersPassWordLevel2()}
					cancelText={L("huy")}
					footer={null}
					className="UsersPassWordLevel2ModalClass"
					destroyOnClose={true}
					closable={false}
					maskClosable={false}
					width='40vw'
				>
					<PassWordLevel2
						oncancel={() => this.setState({ visiblePassWordLevel2ModalOpen: false })}
						onsave={this.onsavePassWordLevel2}
						isCheckPassword2={this.state.isCheckPassword2}
						isExistPassword2={this.state.isExistPassword2}
					/>
				</Modal>
			</Card>
		);
	}
}
