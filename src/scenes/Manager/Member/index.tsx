import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Tabs, Tag } from 'antd';
import { stores } from '@stores/storeInitializer';
import { MemberDto, ChangeStatusMemberInput, FindMemberBorrowDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateMember from './components/CreateOrUpdateMember';
import TableMainMember, { ActionTableMember } from './components/TableMainMember';
import confirm from 'antd/lib/modal/confirm';
import { eDocumentSort, eMemberRegisterStatus } from '@src/lib/enumconst';
import SelectEnum from '@src/components/Manager/SelectEnum';
import MemberCard from '../MemberCard';
import MemberLog from '../MemberLog';
import InformationMember from './components/InformationMember';
import ChangePassword from './components/ChangePassword';
import ModalExportMember from './components/ModalExportMember';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SorterResult } from 'antd/lib/table/interface';
import ImportExcelMember from './components/ImportExcelMember';


export default class Member extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleModalInfoMember: false,
		visibleExportMember: false,
		visibleModalImport: false,
		visibleModalCreateUpdateCard: false,
		visibleModalChangePassword: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		me_search: undefined,
		me_code: undefined,
		me_status: undefined,
		sort: undefined,
		update: false,

	};
	memberSelected: MemberDto = new MemberDto();
	memberInformation: FindMemberBorrowDto = new FindMemberBorrowDto();
	selectedField: string;

	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.memberStore.getAll(this.state.me_search, this.state.me_status, this.selectedField, this.state.sort, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false });
	}
	clearSearch = async () => {
		await this.setState({
			me_search: undefined,
			me_status: undefined,
		});
		this.getAll();
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: MemberDto) => {
		if (input !== undefined && input !== null) {
			this.memberSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, visibleModalCreateUpdateCard: false });
		}
	}
	createCardModalOpen = async (item: MemberDto) => {
		this.memberSelected.init(item);
		await this.setState({ visibleModalCreateUpdate: false, visibleModalCreateUpdateCard: true, update: !this.state.update });
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	onDoubleClickRow = (value: MemberDto) => {
		if (value == undefined || value.me_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.Subscriber_Member_Edit)) {
			message.error(L("ban_khong_the_thuc_hien_thao_tac_nay"));
			return;
		}
		if (value.me_is_locked == false) {
			this.memberSelected.init(value);
			this.createOrUpdateModalOpen(this.memberSelected);
		}
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalMember } = stores.memberStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalMember;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	deleteMember = (member: MemberDto) => {
		let self = this;
		const { totalMember } = stores.memberStore;
		confirm({
			title: L('YouWantToDelete') + " " + L("Member") + ": " + member.me_name + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalMember - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				self.setState({ isLoadDone: false });
				await stores.memberStore.deleteMember(member);
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});
	}

	changeStatusMember = async (item: MemberDto, action: number) => {
		let input = new ChangeStatusMemberInput();
		input.me_id = item.me_id;
		if (action == ActionTableMember.Confirm) {
			input.me_status = eMemberRegisterStatus.ACCEPTED.num;
		} else {
			input.me_status = eMemberRegisterStatus.REJECT.num;
		}
		let self = this;
		confirm({
			title: L('ChangeStatusOf') + ", " + L("Member") + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				self.setState({ isLoadDone: false });
				await stores.memberStore.changeStatusMember(input);
				message.success(L("SuccessfullyChangeStatus"));
				self.setState({ isLoadDone: true });
			},
			onCancel() {
			},
		});
	}

	lockMember = async (item: MemberDto) => {
		let self = this;
		let lock = item.me_is_locked ? L("unlock") : L("lock");
		this.setState({ visibleModalCreateUpdate: false, visibleModalCreateUpdateCard: false });
		const titleElement = (
			<div>
				{L('DoYouWantTo')} <b style={{ color: "red" }}>{lock}</b>  {L('member')}: <b>{item.me_name}</b>?
			</div>
		);
		confirm({
			title: titleElement,
			okText: lock,
			cancelText: L('Cancel'),
			async onOk() {
				self.setState({ isLoadDone: false });
				let result = await stores.memberStore.lockMember(item.me_id);
				if (result != undefined) {
					let mes = result.me_is_locked ? L("lock") : L("unlock");
					message.success("Đã " + mes + " độc giả " + result.me_name + " thành công");
				}
				self.setState({ isLoadDone: true });
			},
			onCancel() {
			},
		});
	}

	infoMember = async (item: MemberDto) => {
		this.memberInformation.init(item);
		await this.setState({ visibleModalInfoMember: true });
	}

	changePasswordMember = (item: MemberDto) => {
		this.memberSelected.init(item);
		this.setState({ visibleModalChangePassword: true });
	}

	onActionTableMember = (item: MemberDto, action: number) => {

		action == ActionTableMember.DoubleClickRow && this.onDoubleClickRow(item);
		action == ActionTableMember.CreateOrUpdate && this.createOrUpdateModalOpen(item);
		action == ActionTableMember.Delete && this.deleteMember(item);
		action == ActionTableMember.CreateCard && this.createCardModalOpen(item);
		action == ActionTableMember.Confirm && this.changeStatusMember(item, ActionTableMember.Confirm);
		action == ActionTableMember.Reject && this.changeStatusMember(item, ActionTableMember.Reject);
		action == ActionTableMember.LockMember && this.lockMember(item);
		action == ActionTableMember.InfoMember && this.infoMember(item);
		action == ActionTableMember.ChangePassword && this.changePasswordMember(item);
	}
	changeColumnSort = async (sort: SorterResult<MemberDto> | SorterResult<MemberDto>[]) => {
		this.setState({ isLoadDone: false });
		this.selectedField = sort['field'];
		console.log("aaa", sort);

		let order = eDocumentSort.ASC.num;
		if (sort['order'] == "descend") order = eDocumentSort.DES.num
		await this.setState({ sort: order })
		await this.getAll();
		this.setState({ isLoadDone: true });
	}
	onRefreshData = async () => {
		this.setState({ visibleModalImport: false, });
		this.getAll();
	}
	render() {
		const self = this;
		const left = this.state.visibleModalCreateUpdate || this.state.visibleModalCreateUpdateCard ? { ...cssColResponsiveSpan(0, 0, 0, 0, 12, 12) } : cssCol(24);
		const right = this.state.visibleModalCreateUpdate || this.state.visibleModalCreateUpdateCard ? { ...cssColResponsiveSpan(24, 24, 24, 24, 12, 12) } : cssCol(0);
		const { memberListResult, totalMember } = stores.memberStore;
		return (
			<Card>
				<Row gutter={[16, 16]}>
					<Col {...cssColResponsiveSpan(24, 24, 3, 3, 2, 2)} >
						<h2>{L('Member')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(12, 6, 6, 4, 4, 4)} >
						<Input
							value={this.state.me_search}
							placeholder={L("MemberCode") + ", " + L("MemberName")}
							style={{ marginRight: '5px', height: 32 }} allowClear
							onChange={(e) => this.setState({ me_search: e.target.value.trim() })}
							onPressEnter={this.handleSubmitSearch}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(12, 6, 4, 4, 4, 4)} >
						<SelectEnum
							placeholder={L("Status")}
							eNum={eMemberRegisterStatus}
							enum_value={this.state.me_status}
							onChangeEnum={async (value: number) => { await this.setState({ me_status: value }) }} />
					</Col>
					<Col  {...cssColResponsiveSpan(12, 6, 4, 3, 3, 2)}>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 3, 3, 2, 2, 3)}>
						{(this.state.me_search != undefined || this.state.me_status != undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 7, 7, 9, 9)} style={{ textAlign: 'end' }}>
						{
							this.isGranted(AppConsts.Permission.Subscriber_Member_Create) &&
							<Button type="primary" icon={<PlusOutlined />} style={{ margin: '0 0.5em 0.5em 0' }} onClick={() => this.createOrUpdateModalOpen(new MemberDto())} title={L('CreateNew')}>{L('CreateNew')}</Button>
						}
						{
							this.isGranted(AppConsts.Permission.Subscriber_Member_Export) &&
							<Button type="primary" icon={<ExportOutlined />} style={{ margin: '0 0.5em 0.5em 0' }} onClick={() => this.setState({ visibleExportMember: true })} title={L('ExportData')}>{L('ExportData')}</Button>
						}
						{/* {this.isGranted(AppConsts.Permission.General_Author_Import) && */}
						<Button title={L('nhap_du_lieu')} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleModalImport: true })}>{L('nhap_du_lieu')}</Button>
						{/* // } */}
					</Col>
				</Row>
				{/* 
				<Row gutter={[16, 16]} style={{ marginBottom: '5px' }} align='bottom'>
				</Row> */}
				<Row style={{ alignItems: "center" }}>
					<Tag color='red' style={{ background: 'red', height: '10px' }}></Tag>
					<b>{L("MemberLockCard")}</b>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainMember
							isLoadDone={this.state.isLoadDone}
							onActionMember={this.onActionTableMember}
							changeColumnSort={this.changeColumnSort}
							memberListResult={memberListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalMember,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => {
									self.onChangePage(page, pagesize)

								}
							}}
						/>
					</Col>
					{this.state.visibleModalCreateUpdate &&
						<Col {...right}>
							<CreateOrUpdateMember
								onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								memberSelected={this.memberSelected}
							/>
						</Col>}
					{this.state.visibleModalCreateUpdateCard &&
						<Col {...right}>
							<Tabs tabBarExtraContent={<Button danger title={L("huy")} onClick={() => this.setState({ visibleModalCreateUpdateCard: false })}>{L("huy")}</Button>}>
								<Tabs.TabPane tab={L("MemberCard")} key="item-1">
									<MemberCard update={this.state.update} memberSelected={this.memberSelected} is_redirected_member_card={true} />
								</Tabs.TabPane>
								<Tabs.TabPane tab={L("MemberLog")} key="item-2">
									<MemberLog memberId={this.memberSelected.me_id} />
								</Tabs.TabPane>
							</Tabs>
						</Col>
					}
				</Row>
				<ModalExportMember
					memberListResult={memberListResult}
					visible={this.state.visibleExportMember}
					onCancel={() => this.setState({ visibleExportMember: false })}
				/>
				<Modal
					visible={this.state.visibleModalInfoMember}
					title={L('Information') + " " + L('Member')}
					onCancel={() => { this.setState({ visibleModalInfoMember: false }) }}
					footer={null}
					width='60vw'
					maskClosable={false}
				>
					<InformationMember
						memberSelected={this.memberInformation}
					/>
				</Modal>

				<Modal
					visible={this.state.visibleModalChangePassword}
					title={L('ChangePassword') + " " + L('Member')}
					onCancel={() => { this.setState({ visibleModalChangePassword: false }) }}
					footer={null}
					width='40vw'
					maskClosable={true}
				>
					<ChangePassword
						onClose={() => this.setState({ visibleModalChangePassword: false })}
						member_id={this.memberSelected.me_id}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalImport}
					closable={false}
					maskClosable={true}
					title={L("NHAP_DU_LIEU_DOC_GIA")}
					onCancel={() => { this.setState({ visibleModalImport: false }); }}
					footer={null}
					width={"100vw"}
				>
					<ImportExcelMember
						onRefreshData={this.onRefreshData}
						onCancel={() => this.setState({ visibleModalImport: false })}
					/>
				</Modal>
			</Card>
		)
	}
}