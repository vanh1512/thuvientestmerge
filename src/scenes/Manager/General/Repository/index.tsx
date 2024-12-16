import * as React from 'react';
import { Col, Row, Button, Card, Modal, message, Tree } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ReponsitoryDto, UpdatePositionReponsitoryInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CaretDownOutlined, CaretUpOutlined, DeleteFilled, DownOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined, } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateRepository from './components/CreateOrUpdateRepository';
import ExportRepository from './components/ExportRepository';
import { TreeReponsitoryDto } from '@src/stores/reponsitoryStore';
import ImportRepository from './components/ImportRepository';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

const { confirm } = Modal;
const { TreeNode } = Tree;

export default class Repository extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelRepository: false,
		showActionButtons: false,
		visibleImportRepository: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		re_search: "",
		re_type: undefined,
		selectedKeys: [],
	};
	repositorySelected: ReponsitoryDto = new ReponsitoryDto();

	async componentDidMount() {
		const { treeReponsitoryDto } = stores.reponsitoryStore;
		await this.getAll();
		!!treeReponsitoryDto ? this.setState({ visibleModalCreateUpdate: false }) : this.setState({ visibleModalCreateUpdate: true })

	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.reponsitoryStore.getAll(this.state.re_search, this.state.re_type, this.state.skipCount, undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelRepository: false, });
	}

	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	deleteRepository = (repository: ReponsitoryDto) => {
		let self = this;
		confirm({
			title: L('ban_co_chac_muon_xoa_kho_nay') + ": " + repository.re_name + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				await stores.reponsitoryStore.delete(repository);
				await self.getAll();
				message.success(L("SuccessfullyDeleted"))
			},
			onCancel() {

			},
		});
	}

	createOrUpdateModalOpen = async (selectedKeys: any, input: ReponsitoryDto) => {
		this.repositorySelected.init(input);
		await this.setState({ selectedKeys: [selectedKeys] });
		if (input.re_id !== -1) {
			await this.setState({ visibleModalCreateUpdate: true, showActionButtons: true });
		} else {
			await this.setState({ visibleModalCreateUpdate: false, showActionButtons: true });
		}
	}

	loopTreeReponsitory = (data: TreeReponsitoryDto[]) => {
		return data.map((item, index) => {
			return <TreeNode
				data={item}
				key={item.key + "_key"}
				title={
					<div style={{ display: 'flex' }}>
						<div onClick={(e) => this.createOrUpdateModalOpen(item.key + "_key", item)}>{item.re_id != -1 && item.re_code + "__"} {item.title}</div>
						<div style={{ display: 'flex', alignItems: "baseline" }}>
							{this.state.showActionButtons &&
								<>
									{
										this.isGranted(AppConsts.Permission.General_Repository_Create) &&
										<>
											&nbsp;&nbsp;
											{item.re_id === -1 && item.re_id === this.repositorySelected.re_id &&
												<Button type='primary' icon={<PlusOutlined />} title={L("them_moi")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", ReponsitoryDto.fromJS({ re_id_parent: item.re_id }))}></Button>
											}
										</>
									}

									{(item.re_id >= 0 && item.re_id === this.repositorySelected.re_id) && (
										<>
											{this.isGranted(AppConsts.Permission.General_Repository_Sort) &&
												<>
													{index > 0 && <CaretUpOutlined sizes="small" onClick={() => { this.onMoveItem(item, data[index - 1]) }} />}
													{index < data.length - 1 && <CaretDownOutlined sizes="small" onClick={() => { this.onMoveItem(item, data[index + 1]) }} />}
												</>
											}
											&nbsp;&nbsp;
											{this.isGranted(AppConsts.Permission.General_Publisher_Create) &&
												<Button type='primary' icon={<PlusOutlined />} title={L("them_moi")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", ReponsitoryDto.fromJS({ re_id_parent: item.re_id }))}></Button>
											}
											&nbsp;&nbsp;
											{this.isGranted(AppConsts.Permission.General_Publisher_Edit) &&
												<Button icon={<EditOutlined />} title={L("chinh_sua")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", item)}></Button>
											}
											&nbsp;&nbsp;
											{this.isGranted(AppConsts.Permission.General_Publisher_Delete) &&
												<Button danger icon={<DeleteFilled />} title={L("xoa")} size="small" onClick={() => this.deleteRepository(item)}></Button>
											}
										</>
									)}
								</>
							}
						</div>
					</div>}
			>
				{(item.children && item.children.length) && this.loopTreeReponsitory(item.children)}
			</TreeNode>
		});
	}

	onMoveItem = async (itemChild: TreeReponsitoryDto, itemNext: TreeReponsitoryDto) => {
		await this.setState({ isLoadDone: false });
		let input = new UpdatePositionReponsitoryInput();
		input.re_id = itemChild.re_id;
		input.re_id2 = itemNext.re_id;
		await stores.reponsitoryStore.changePositionReponsitory(input);
		message.success(L("thao_tac_thanh_cong"));
		await this.setState({ isLoadDone: true });
	}
	onRefreshData = () => {
		this.setState({ visibleImportRepository: false });
		this.getAll();
	}
	render() {
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);
		const { treeReponsitoryDto } = stores.reponsitoryStore;
		return (
			<>
				<Card>
					<Row gutter={16}>
						<Col span={5} >
							<h2>{L('kho_vat_ly')}</h2>
						</Col>
						<Col span={19} style={{ textAlign: "end" }}>
							<Button title={L("them_moi_kho")} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(undefined, new ReponsitoryDto())}>{L("them_moi_kho")}</Button>
							<Button title={L("xuat_du_lieu")} style={{ marginLeft: '10px' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelRepository: true })}>{L('xuat_du_lieu')}</Button>
							<Button title={L("nhap_du_lieu")} style={{ marginLeft: '10px' }} type='primary' icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportRepository: true })}>{L('nhap_du_lieu')}</Button>
						</Col>
					</Row>
					<Row style={{ marginTop: '10px' }}>
						<Col {...left} >
							{treeReponsitoryDto.re_id != undefined &&
								<Tree
									height={500}
									showLine
									switcherIcon={<DownOutlined />}
									showIcon
									selectedKeys={this.state.selectedKeys}
									defaultExpandAll={true}
									selectable
								>
									{this.loopTreeReponsitory([treeReponsitoryDto])}
								</Tree>
							}
						</Col>

						<Col {...right} >
							<CreateOrUpdateRepository
								onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								onCancel={() => this.setState({ visibleModalCreateUpdate: false, selectedKeys: [] })}
								repositorySelected={this.repositorySelected}
								treeReponsitory={[treeReponsitoryDto]}
							/>
						</Col>
					</Row>
				</Card>
				<ExportRepository
					visibleExportExcelRepository={this.state.visibleExportExcelRepository}
					onCancel={() => this.setState({ visibleExportExcelRepository: false })}
				/>
				<Modal
					visible={this.state.visibleImportRepository}
					closable={false}
					maskClosable={false}
					onCancel={() => { this.setState({ visibleImportRepository: false }); }}
					footer={null}
					title={L("NHAP_KHO_VAT_LY")}
					width={"60vw"}
				>
					<ImportRepository
						onRefreshData={this.onRefreshData}
						onCancel={() => this.setState({ visibleImportRepository: false })}
					/>
				</Modal>
			</>
		)
	}
}