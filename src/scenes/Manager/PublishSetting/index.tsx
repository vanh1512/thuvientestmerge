import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, Select, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { PublishSettingDto, ICreatePublishSettingInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateOrUpdatePublishSetting from './components/CreateOrUpdatePublishSetting';
import AppConsts from '@src/lib/appconst';
import TableMainPublishSetting from './components/TableMainPublishSetting';
import ExportPublishSetting from './components/ModalExportPublishSetting';
import { ePublishSettingType } from '@src/lib/enumconst';
import SelectEnum from '@src/components/Manager/SelectEnum';
import ModalExportPublishSetting from './components/ModalExportPublishSetting';

const { confirm } = Modal;
const { Option } = Select;
export default class PublishSetting extends React.Component {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelPublishSetting: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		ca_id: 0,
		pu_se_type: 0,
	};
	publishSettingSelected: PublishSettingDto = new PublishSettingDto();

	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.publishSettingStore.getAll(this.state.ca_id, this.state.pu_se_type, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: ICreatePublishSettingInput) => {
		if (input !== undefined && input !== null) {
			this.publishSettingSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}
	async deletePublisher(publishSetting: PublishSettingDto) {
		let self = this;
		confirm({
			title: L('ban_co_chac_muon_xoa') + ", " + L("PublishSetting") + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				await stores.publishSettingStore.deletePublisher(publishSetting);
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});
	}
	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = (value: PublishSettingDto) => {
		if (value == undefined || value.ca_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.publishSettingSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}

	render() {

		const self = this;
		const left = this.state.visibleModalCreateUpdate ? AppConsts.cssRightMain.left : AppConsts.cssPanelMain.left;
		const right = this.state.visibleModalCreateUpdate ? AppConsts.cssPanelMain.right : AppConsts.cssRightMain.right;

		const { publishSettingListResult, totalPublishSetting } = stores.publishSettingStore;
		return (
			<Card>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L('PublishSetting')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new PublishSettingDto())}>{L('Create')}</Button>
						&nbsp;&nbsp;
						<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelPublishSetting: true })}>{L('xuat_du_lieu')}</Button>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('ca_id')}:</strong>&nbsp;&nbsp;
						<Select
							style={{ width: "100%" }}
							onChange={(e) => this.setState({ pl_de_status_book: e })}
							value={this.state.ca_id}
							allowClear
							placeholder={L("nhap_tim_kiem")}
						>
							{[1, 2, 3, 4].map(item =>
								<Option key={"key_" + item} value={item}>{item}</Option>
							)}
						</Select>
					</Col>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('pu_se_type')}:</strong>&nbsp;&nbsp;
						<SelectEnum eNum={ePublishSettingType} enum_value={this.state.pu_se_type} onChangeEnum={async (value: number) => { await this.setState({ pu_se_type: value }) }} />
					</Col>
					<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainPublishSetting
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							deletePublisher={this.deletePublisher}
							publishSettingListResult={publishSettingListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalPublishSetting,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total")+": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100'],
								onShowSizeChange(current: number, size: number) {
									self.onChangePage(current, size)
								},
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
					<Col {...right}>
						<CreateOrUpdatePublishSetting
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							publishSettingSelected={this.publishSettingSelected}
						/>
					</Col>
				</Row>

				<ModalExportPublishSetting
					publishSettingListResult={publishSettingListResult}
					visible={this.state.visibleExportExcelPublishSetting}
					onCancel={() => this.setState({ visibleExportExcelPublishSetting: false })}
				/>
			</Card>
		)
	}
}