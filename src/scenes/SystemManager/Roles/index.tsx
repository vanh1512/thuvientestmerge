import * as React from 'react';

import { Button, Card, Col, Input, Modal, Row, Table, message } from 'antd';
import CreateOrUpdateRole from './components/FormCreateOrUpdateRole';
import { L } from '@lib/abpUtility';
import { DeleteFilled, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { RouterPath, cssCol, cssColResponsiveSpan } from '@lib/appconst';
import { stores } from '@stores/storeInitializer';
import { TablePaginationConfig } from 'antd/lib/table';
import { RoleDto } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import PassWordLevel2 from '../Users/components/PassWordLevel2';
import HistoryHelper from '@src/lib/historyHelper';
import { eUserType } from '@src/lib/enumconst';


const confirm = Modal.confirm;

export default class Role extends AppComponentBase {
	state = {
		isLoadDone: false,
		modalCreateUpdate: false,
		modalChangePassWord: false,
		pageSize: 10,
		skipCount: 0,
		currentPage: 1,
		roleId: 0,
		filter: '',
		visiblePassWordLevel2ModalOpen: false,
		isCheckPassword2: false,
		isExistPassword2: false,
	};
	roleSelected: RoleDto = new RoleDto();

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
		await stores.roleStore.getAll(this.state.filter.trim(), this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, modalCreateUpdate: false, modalChangePassWord: false });
	}

	handleTableChange = (pagination: TablePaginationConfig) => {
		this.setState({ skipCount: (pagination.current! - 1) * this.state.pageSize! }, async () => await this.getAll());
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
	delete = (id: number) => {
		let self = this;
		const { totalRoles } = stores.roleStore;
		confirm({
			title: (L('ban_chac_chan_muon_xoa_vai_tro_nay')),
			async onOk() {
				if (self.state.currentPage > 1 && (totalRoles - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				self.setState({ isLoadDone: false });
				await stores.roleStore.delete(id);
				message.success(L("xoa_thanh_cong"));
				self.setState({ isLoadDone: true });
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	createOrUpdateModalOpen = async (inputRole: RoleDto) => {
		this.roleSelected.init(inputRole);
		if (!this.isGranted(AppConsts.Permission.System_Roles_Edit)) {
			message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
			return;
		}
		await this.setState({ roleId: inputRole.id });
		await this.setState({ modalCreateUpdate: true, modalChangePassWord: false });
	}
	async changePassWordModalOpen(inputRole: RoleDto) {
		this.roleSelected = inputRole;
		await this.setState({ modalChangePassWord: true, modalCreateUpdate: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	};

	onChangePage = async (page: number, pageSize?: number) => {
		if (pageSize !== undefined) {
			await this.setState({ pageSize: pageSize });
		}
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page, pageSize: this.state.pageSize });
		await this.getAll()
	};

	public render() {

		const left = this.state.modalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 12, 12, 12) : cssCol(24);
		const right = this.state.modalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);
		const { allPermissions, roles } = stores.roleStore;
		const columns = [
			{ title: L('stt'), key: 'name', width: 50, render: (text: string, item: RoleDto, index:number) => <div>{ this.state.pageSize! * (this.state.currentPage! - 1) + (index + 1)}</div> },
			{ title: L('ten_vai_tro'), key: 'name', width: 150, render: (text: string, item: RoleDto) => <div>{item.name}</div> },
			{ title: L('ten_hien_thi'), key: 'displayName', width: 150, render: (text: string, item: RoleDto) => <div>{item.displayName}</div> },
			{
				title: "",
				width: 50,
				render: (text: string, item: RoleDto) => (
					<div>
						{this.isGranted(AppConsts.Permission.System_Roles_Edit) &&
							<Button
								type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
								style={{ marginLeft: '10px' }}
								onClick={() => this.createOrUpdateModalOpen(item)}>
							</Button>
						}
						{this.isGranted(AppConsts.Permission.System_Roles_Delete) && item.id != 1 &&
							<Button
								danger icon={<DeleteFilled />} title={L('Delete')}
								style={{ marginLeft: '10px' }}
								onClick={() => this.delete(item.id)}>
							</Button>
						}

					</div>
				),
			},
		];

		return (
			<Card>

				<Row gutter={[16, 16]}>
					<Col {...cssColResponsiveSpan(4, 4, 4, 4, 4, 4)} >
						<h2>{L('vai_tro')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(16, 16, 16, 10, 10, 10)}>
						<Input onPressEnter={() => this.handleSubmitSearch()} style={{ width: '60%', marginRight: '5px' }} allowClear value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value })} placeholder={L("ten_vai_tro") + ', ' + L("ten_hien_thi") + '...'} />
						<Button type='primary' title={L('tim_kiem')} icon={<SearchOutlined />} onClick={this.handleSubmitSearch}>{L("tim_kiem")}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(4, 4, 4, 10, 10, 10)} style={{ textAlign: "right" }}>
						{this.isGranted(AppConsts.Permission.System_Roles_Create) &&
							<Button title={L('AddNew')} type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new RoleDto())} />
						}
					</Col>
				</Row>
				<Row gutter={16} >
				</Row>
				<Row style={{ marginTop: 20 }}>
					<Col {...left}>
						<Table
							rowKey="id"
							onRow={(record, rowIndex) => {
								return {
									onDoubleClick: (event: any) => { this.createOrUpdateModalOpen(record!) }
								};
							}}
							className='centerTable'
							bordered={true}
							scroll={{ x: 1000, y: 1000 }}
							rowClassName={(record, index) => (this.state.roleId == record.id ? 'bg-click' : 'bg-white')}
							pagination={{
								pageSize: this.state.pageSize,
								total: roles === undefined ? 0 : roles.totalCount,
								defaultCurrent: 1,
								current: this.state.currentPage,
								showTotal: (total) => (L("tong")) + " " + AppConsts.formatNumber(total),
								showQuickJumper: true,
								showSizeChanger: true,
								onChange: this.onChangePage,
								onShowSizeChange: this.onChangePage,
								pageSizeOptions: ['10', '20', '50', '100'],
							}} columns={columns}
							loading={roles === undefined ? true : false}
							dataSource={roles === undefined ? [] : roles.items}
							onChange={this.handleTableChange}
						/>
					</Col>
					<Col {...right}>
						{this.state.modalCreateUpdate &&
							<CreateOrUpdateRole
								onCancel={() =>
									this.setState({ modalCreateUpdate: false, })
								}
								onCreateOrUpdatedSuccess={() => { this.getAll() }}
								roleSelected={this.roleSelected}
							/>}

					</Col>
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
						width="50vw"
					>
						<PassWordLevel2
							oncancel={() => this.setState({ visiblePassWordLevel2ModalOpen: false })}
							onsave={this.onsavePassWordLevel2}
							isCheckPassword2={this.state.isCheckPassword2}
							isExistPassword2={this.state.isExistPassword2}
						/>
					</Modal>
				</Row>
			</Card>
		);
	}
}

