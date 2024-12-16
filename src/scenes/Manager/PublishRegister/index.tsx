import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Select, DatePicker } from 'antd';
import { stores } from '@stores/storeInitializer';
import { PublishRegisterDto, ICreatePublishRegisterInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import CreateOrUpdatePublishRegister from './components/CreateOrUpdatePublishRegister';
import TableMainPublishRegister from './components/TableMainPublishRegister';
import { eTypePublishRegister } from '@src/lib/enumconst';
import SelectEnum from '@src/components/Manager/SelectEnum';
import ModalExportPublishRegister from './components/ModalExportPublishRegister';

const dateFormat = 'DD-MM-YYYY';
const { Option } = Select;

export default class PublishRegister extends React.Component {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelPublishRegister: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		pu_re_name: "",
		ca_id: 0,
		pu_re_receive_type: undefined,
		me_id: 0,
	};
	publishRegisterSelected: PublishRegisterDto = new PublishRegisterDto();

	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.publishRegisterStore.getAll(
			this.state.pu_re_name,
			this.state.ca_id,
			this.state.pu_re_receive_type,
			this.state.me_id,
			this.state.skipCount,
			this.state.pageSize);
		this.setState({ isLoadDone: true });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: ICreatePublishRegisterInput) => {
		if (input !== undefined && input !== null) {
			this.publishRegisterSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = (value: PublishRegisterDto) => {
		if (value == undefined || value.pu_re_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.publishRegisterSelected.init(value);
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

		const { publishRegisterListResult, totalPublishRegister } = stores.publishRegisterStore;
		return (
			<Card>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L('PlanDetail')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new PublishRegisterDto())}>{L('Create')}</Button>
						&nbsp;&nbsp;
						<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelPublishRegister: true })}>{L('xuat_du_lieu')}</Button>
					</Col>
				</Row>

				<Row gutter={16} style={{ marginBottom: '5px' }}>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('pu_re_name')}:</strong>&nbsp;&nbsp;<Input allowClear={true} onChange={(e) => this.setState({ pu_re_name: e.target.value })} placeholder={L("nhap_tim_kiem")}/>
					</Col>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('ca_id')}:</strong>&nbsp;&nbsp;
						<Select
							style={{ width: "100%" }}
							onChange={(e) => this.setState({ ca_id: e })}
							value={this.state.ca_id}
							allowClear
							placeholder={L("nhap_tim_kiem")}
						>
							{[1, 2, 3, 4].map(item =>
								<Option key={"key_" + item} value={item}>{item}</Option>
							)}
						</Select>
					</Col>

					<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
				</Row>
				<Row gutter={16} style={{ marginBottom: '5px' }}>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('pu_re_receive_type')}:</strong>&nbsp;&nbsp;
						<SelectEnum eNum={eTypePublishRegister} enum_value={this.state.pu_re_receive_type} onChangeEnum={async (value: number) => { await this.setState({ pu_re_receive_type: value }) }} />
					</Col>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('me_id')}:</strong>&nbsp;&nbsp;
						<Select
							style={{ width: "100%" }}
							onChange={(e) => this.setState({ me_id: e })}
							value={this.state.me_id}
							allowClear
							placeholder={L("nhap_tim_kiem")}
						>
							{[1, 2, 3, 4].map(item =>
								<Option key={"key_" + item} value={item}>{item}</Option>
							)}
						</Select>
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainPublishRegister
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							publishRegisterListResult={publishRegisterListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalPublishRegister,
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
						<CreateOrUpdatePublishRegister
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							publishRegisterSelected={this.publishRegisterSelected}
						/>
					</Col>
				</Row>
				<ModalExportPublishRegister
					publishRegisterListResult={publishRegisterListResult}
					visible={this.state.visibleExportExcelPublishRegister}
					onCancel={() => this.setState({ visibleExportExcelPublishRegister: false })}
				/>

			</Card>
		)
	}
}