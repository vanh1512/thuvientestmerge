import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { TopicDto, ICreateTopicInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateTopic from './components/CreateOrUpdateTopic';
import TableMainTopic from './components/TableMainTopic';
import ModalExportTopic from './components/ModalExportTopic';
import ImportSampleExcelDataTopic from './components/ImportSampleExcelDataTopic';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

const { confirm } = Modal;

export default class Topic extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelTopic: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		to_search: "",
		visibleImportExcelTopic: false,
		numberSelected: 0,
		select: false,
		clicked: false,
		isButtonMultiExportClick: false,
	};
	topicSelected: TopicDto = new TopicDto();
	keySelected: number[] = [];
	listItemSelected: TopicDto[] = [];
	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.topicStore.getAll(
			this.state.to_search,
			this.state.skipCount,
			undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelTopic: false, });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: ICreateTopicInput) => {
		if (input !== undefined && input !== null) {
			this.topicSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}

	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	onDoubleClickRow = (value: TopicDto) => {
		if (value == undefined || value.to_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.General_Topic_Edit)) {
			message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
			return;
		}
		this.topicSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalTopic } = stores.topicStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalTopic;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	onRefreshData = async () => {
		this.setState({ isLoadDone: false });
		await this.getAll();
		this.setState({ isLoadDone: true });
		this.setState({ visibleImportExcelTopic: false });
	}

	deleteTopic = (topic: TopicDto) => {
		let self = this;
		const { totalTopic } = stores.topicStore
		confirm({
			title: L('WantDelete') + " " + L("Topic") + ": " + topic.to_name + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalTopic - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.topicStore.deleteTopic(topic);
				await self.getAll();
				message.success(L("SuccessfullyDeleted"))
			},
			onCancel() {

			},
		});
	}

	deleteMulti = async (listIdTopic: number[]) => {
		if (this.state.numberSelected < 1) {
			await message.warning(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			let self = this;
			const { totalTopic } = stores.topicStore
			confirm({
				title: (L('ban_co_muon_xoa_hang_loat')) + "?",
				okText: (L('xac_nhan')),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalTopic - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.topicStore.deleteMulti(listIdTopic);
					await self.getAll();

					self.setState({ isLoadDone: true, numberSelected: -1 })
					message.success(L("xoa_thanh_cong" + "!"))
				},
				onCancel() {
				},
			});
		}
	}
	deleteAll() {
		let self = this;
		this.setState({ isLoadDone: false });
		confirm({
			title: L("ban_co_chac_muon_xoa_tat_ca"),
			okText: L("Delete"),
			cancelText: L("huy"),
			async onOk() {
				await stores.topicStore.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {
			},
		});
		this.setState({ isLoadDone: true });
	}
	onChange = (listItemTopic: TopicDto[], listIdTopic: number[]) => {
		this.setState({ isLoadDone: false });
		this.listItemSelected = listItemTopic;
		this.keySelected = listIdTopic;
		this.setState({ isLoadDone: true, numberSelected: listItemTopic.length });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	handleVisibleChange = (visible) => {
		this.setState({ clicked: visible });
	}
	render() {
		const self = this;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);
		const { topicListResult, totalTopic } = stores.topicStore;

		return (
			<Card>
				<Row gutter={[8, 4]}>
					<Col {...cssColResponsiveSpan(24, 24, 5, 5, 4, 4)} >
						<h2>{L('Topic')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 16, 12, 8, 8)} >
						<Input
							style={{ width: '60%', marginRight: '5px' }} allowClear
							onChange={(e) => this.setState({ to_search: e.target.value.trim() })} placeholder={L("TopicName") + ", " + L("TopicCode") + "..."}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>

					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 12, 12)} className='textAlign-col-1200'>

						&nbsp;&nbsp;&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.General_Topic_Create) &&
							<Button title={L('CreateNew')} style={{ margin: '0 0.5em 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new TopicDto())}>{L('CreateNew')}</Button>
						}
						{this.isGranted(AppConsts.Permission.General_Topic_Export) &&
							<Button title={L('ExportData')} style={{ margin: '0 0.5em 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelTopic: true, isButtonMultiExportClick: false })}>{L('ExportData')}</Button>
						}
						{this.isGranted(AppConsts.Permission.General_Topic_Export) &&
							<Button title={L('nhap_du_lieu')} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportExcelTopic: true })}>{L('nhap_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24}>
						<>
							{this.isGranted(AppConsts.Permission.General_Topic_Delete) &&
								<Badge count={this.state.numberSelected}>
									<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
										<>
											<Row style={{ alignItems: "center" }}>
												<Button
													danger icon={<DeleteOutlined />} title={L("xoa_tat_ca")}
													style={{ marginLeft: '10px' }}
													size='small'
													onClick={() => { this.deleteAll(); this.hide() }}
													type='primary'
												></Button>
												<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteAll(); this.hide() }}>{L('xoa_tat_ca')}</a>
											</Row>
											<Row style={{ alignItems: "center", marginTop: "10px" }}>
												<Button
													danger icon={<DeleteFilled />} title={L("Delete")}
													style={{ marginLeft: '10px' }}
													size='small'
													onClick={() => { this.deleteMulti(this.keySelected); this.hide() }}
												></Button>
												<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteMulti(this.keySelected); this.hide() }}>{L('xoa_hang_loat')}</a>
											</Row>
											<Row style={{ alignItems: "center", marginTop: "10px" }}>
												<Button
													type='primary'
													icon={<ExportOutlined />} title={L("ExportData")}
													style={{ marginLeft: '10px' }}
													size='small'
													onClick={() => !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelTopic: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}

												></Button>
												<a style={{ paddingLeft: "10px" }}
													onClick={() => !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcelTopic: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}
												>
													{L('ExportData')}
												</a>

											</Row>
										</>
									} trigger={['hover']} >
										<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
									</Popover >
								</Badge>
							}
						</>
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainTopic
							onChange={this.onChange}
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							deleteTopic={this.deleteTopic}
							topicListResult={topicListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalTopic,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
					<Col {...right}>
						{this.state.visibleModalCreateUpdate &&
							<CreateOrUpdateTopic
								onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
								topicSelected={this.topicSelected}
							/>}
					</Col>
				</Row>
				<ModalExportTopic
					topicListResult={this.state.isButtonMultiExportClick ? this.listItemSelected : topicListResult}
					visible={this.state.visibleExportExcelTopic}
					onCancel={() => this.setState({ visibleExportExcelTopic: false, select: false })}
				/>
				<Modal
					visible={this.state.visibleImportExcelTopic}
					closable={false}
					maskClosable={false}
					onCancel={() => { this.setState({ visibleImportExcelTopic: false }); }}
					footer={null}
					width={"60vw"}
					title={L("NHAP_DU_LIEU_CHU_DE")}
				>
					<ImportSampleExcelDataTopic
						onRefreshData={this.onRefreshData}
						onCancel={() => this.setState({ visibleImportExcelTopic: false })}
					/>
				</Modal>
			</Card>
		)
	}
}