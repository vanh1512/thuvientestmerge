import * as React from 'react';
import { Col, Row, Button, Card, Modal, message, Tree, Tag } from 'antd';
import { stores } from '@stores/storeInitializer';
import { CategoryDto, UpdatePositionCategoryInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CaretDownOutlined, CaretUpOutlined, DeleteFilled, DownOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateCategory from './components/CreateOrUpdateCategory';
import { TreeCategoryDto } from '@src/stores/categoryStore';
import ModalExportCategory from './components/ModalExportCategory';
import ModalImportCategory from './components/ModalImportCategory';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

const { TreeNode } = Tree;
const { confirm } = Modal;
export default class Category extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		showActionButtons: false,
		visibleExportCategory: false,
		visibleImportCategory: false,
		selectedKeys: [],
		ca_search: "",
	};
	categorySelected: CategoryDto = new CategoryDto();

	async componentDidMount() {
		const { treeCategoryDto } = stores.categoryStore;
		await this.getAll();
		!!treeCategoryDto ? this.setState({ visibleModalCreateUpdate: false }) : this.setState({ visibleModalCreateUpdate: true })
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.categoryStore.getAll(this.state.ca_search);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelCategory: false, });
	}

	createOrUpdateModalOpen = async (selectedKeys: any, input: CategoryDto) => {
		this.categorySelected.init(input);
		await this.setState({ selectedKeys: [selectedKeys] });
		if (input.ca_id !== -1) {
			await this.setState({ visibleModalCreateUpdate: true, showActionButtons: true });
		} else {
			await this.setState({ visibleModalCreateUpdate: false, showActionButtons: true });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}
	deleteCategory = (category: CategoryDto) => {
		let self = this;
		confirm({
			title: L('ban_co_chac_muon_xoa_danh_muc_nay') + ": " + category.ca_title + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				await stores.categoryStore.deleteCategory(category);
				await self.getAll();
				message.success(L("SuccessfullyDeleted"))
			},
			onCancel() {
			},
		});
	}
	loopTreeCategory = (data: TreeCategoryDto[]) => {
		return data.map((item, index) => {
			return <TreeNode
				data={item}
				key={item.key + "_key"} title={
					<div style={{ display: 'flex' }}>
						<div onClick={(e) => this.createOrUpdateModalOpen(item.key + "_key", item)}
							style={{ color: item.ca_enable ? 'green' : 'red' }}>{item.title}{item.ca_id != -1 && " (" + item.dkcb_code + " - " + item.dkcb_current + ")"}</div>
						<div style={{ display: 'flex', alignItems:"baseline" }}>
							{this.state.showActionButtons &&
								<>
									&nbsp;&nbsp;
									{item.ca_id === -1 && item.ca_id == this.categorySelected.ca_id &&
										<Button type='primary' icon={<PlusOutlined />} title={L("them_moi")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", CategoryDto.fromJS({ ca_id_parent: item.ca_id }))}></Button>
									}
									{(item.ca_id >= 0 && item.ca_id == this.categorySelected.ca_id) && (
										<>
											{this.isGranted(AppConsts.Permission.General_Category_Sort) &&
												<>
													&nbsp;&nbsp;{index > 0 && <CaretUpOutlined sizes="small" onClick={() => { this.onMoveItem(item, data[index - 1]) }} />}
													&nbsp;&nbsp;{index < data.length - 1 && <CaretDownOutlined sizes="small" onClick={() => { this.onMoveItem(item, data[index + 1]) }} />}&nbsp;
												</>
											}

											{this.isGranted(AppConsts.Permission.General_Category_Create) &&
												<Button type='primary' icon={<PlusOutlined />} title={L("them_moi")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", CategoryDto.fromJS({ ca_id_parent: item.ca_id }))}></Button>
											}

											{this.isGranted(AppConsts.Permission.General_Category_Edit) &&
												<>
													&nbsp;&nbsp;<Button icon={<EditOutlined />} title={L("chinh_sua")} size="small" onClick={() => this.createOrUpdateModalOpen(item.key + "_key", item)} ></Button>
												</>
											}

											{this.isGranted(AppConsts.Permission.General_Category_Delete) &&
												<>
													&nbsp;&nbsp;<Button danger icon={<DeleteFilled />} onClick={() => this.deleteCategory(item)} title={L("xoa")} size="small"></Button>
												</>
											}
										</>
									)}
								</>
							}
						</div>
					</div>}>
				{(item.children && item.children.length) && this.loopTreeCategory(item.children)}
			</TreeNode>
		});
	}

	onMoveItem = async (itemChild: TreeCategoryDto, itemNext: TreeCategoryDto) => {
		await this.setState({ isLoadDone: false });
		let input = new UpdatePositionCategoryInput();
		input.ca_id = itemChild.ca_id;
		input.ca_id2 = itemNext.ca_id;
		await stores.categoryStore.changePositionCategory(input);
		await this.setState({ isLoadDone: true });
	}

	onCancel = () => {
		this.setState({ visibleExportCategory: false })
	}
	onRefreshData = () => {
		this.setState({ visibleImportCategory: false });
		this.getAll();

	}

	render() {
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 12, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 12, 12, 12, 12) : cssCol(0);
		const { treeCategoryDto } = stores.categoryStore;
		return (
			<Card>
				<Row >
					<Col span={8} >
						<h2>{L('danh_sach_danh_muc')}</h2>
						<Tag color='green' style={{ background: 'green', height: '10px' }}></Tag>
						<b style={{marginRight:"10px"}}>{L("Activated")}</b>
						<Tag color='red' style={{ background: 'red', height: '10px' }}></Tag>
						<b>{L("NotActivate")}</b>
					</Col>
					<Col span={16} style={{ textAlign: 'end' }}>
						<Button title={L("them_moi_danh_muc")} type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(undefined ,new TreeCategoryDto)}>{L("them_moi_danh_muc")}</Button>
						<Button title={L("xuat_du_lieu")} style={{ marginLeft: '10px' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportCategory: true })}>{L('xuat_du_lieu')}</Button>
						<Button title={L("nhap_du_lieu")} style={{ marginLeft: '10px' }} type='primary' icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportCategory: true })}>{L('nhap_du_lieu')}</Button>
					</Col>
					<Col  {...left}>
						{treeCategoryDto.ca_id != undefined &&
							<Tree
								height={500}
								showLine
								switcherIcon={<DownOutlined />}
								showIcon
								selectedKeys={this.state.selectedKeys}
								defaultExpandAll={true}
							>
								{this.loopTreeCategory([treeCategoryDto])}
							</Tree>
						}
					</Col>
					<Col {...right} >
						<CreateOrUpdateCategory
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false, selectedKeys: [] })}
							categorySelected={this.categorySelected}
							treeCategory={[treeCategoryDto]}
						/>
					</Col>
				</Row>

				<ModalExportCategory
					visibleExportCategory={this.state.visibleExportCategory}
					onCancel={this.onCancel}
				/>
				<Modal
					visible={this.state.visibleImportCategory}
					closable={false}
					maskClosable={true}
					onCancel={() => { this.setState({ visibleImportCategory: false }); }}
					footer={null}
					width={"60vw"}
					title={L("NHAP_DU_LIEU_DANH_MUC")}
				>
					<ModalImportCategory
						onRefreshData={this.onRefreshData}
						onCancel={() => this.setState({ visibleImportCategory: false })}
					/>
				</Modal>
			</Card >
		)
	}
}