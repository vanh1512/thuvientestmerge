import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ContractDto, CreateContractInput, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TableMainContract from './components/TableMainContract';
import ModalExportContract from './components/ModalExportContract';
import Billing from '../Billing';
import { enumContracStatus } from '@src/lib/enumconst';
import TabsContract from './components/TabsContract';
import DetaiContract from '../Plan/components/DetaiContract';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import SelectPlan from '@src/components/Manager/SelectPlan';
import SelectEnum from '@src/components/Manager/SelectEnum';
const { confirm } = Modal;
export interface IProps {
	pl_id: number;
	pl_status?: number;
	onCancel: () => void;
	is_redirect_billing?: boolean;
	create: boolean;
	setComponentRef?: any | undefined;
	isTitle?: boolean;

}

export default class Contract extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleModalBill: false,
		visibleModalBillingItem: false,
		visibleExportExcelContract: false,
		visibleContractDetail: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		co_search: undefined,
		pl_id: undefined,
		co_status: undefined,
	};
	contractSelected: ContractDto = new ContractDto();
	async componentDidMount() {
		this.setState({ pl_id: this.props.pl_id })
		await this.getAll();
	}
	clearSearch = async () => {
		await this.setState({
			pl_id: undefined,
			co_status: undefined,
			co_search: undefined,
		});
		await this.getAll();
	}
	async componentDidUpdate(prevState, prevProps) {
		if (!!this.props.pl_id && prevProps.pl_id != this.props.pl_id) {
			this.setState({ pl_id: this.props.pl_id })
			await this.getAll();
		}
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.contractStore.getAll(this.state.pl_id, this.state.co_status, this.state.co_search, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelContract: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: CreateContractInput) => {
		if (input !== undefined && input !== null) {
			this.contractSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, visibleModalBill: false });
		}
	}
	onCreateUpdateSuccess = async () => {
		this.setState({ isLoadDone: false });
		await this.getAll();
		this.setState({ isLoadDone: true });
	}

	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = (value: ContractDto) => {
		if (value == undefined || value.co_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.Buy_Buying_Edit)) {
			message.error(L("ban_khong_the_thuc_hien_thao_tac_nay"));
			return;
		}
		this.contractSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalContract } = stores.contractStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalContract;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	onCreate = () => {
		this.contractSelected = new ContractDto();
		if (this.props.pl_id !== undefined) {
			this.contractSelected.pl_id = this.props.pl_id;
			this.createOrUpdateModalOpen(this.contractSelected);
		} else {
			this.createOrUpdateModalOpen(new ContractDto());
		}
	}

	actionTable = (contract: ContractDto, event: EventTable) => {
		const self = this;
		const { totalContract } = stores.contractStore;
		if (contract == undefined || contract.co_id == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		else if (event == EventTable.Delete) {
			confirm({
				title: L('ban_co_chac_muon_xoa') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalContract - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.contractStore.delete(contract.co_id);
					self.getAll();
				},
				onCancel() {
				},
			});
		}
	}

	createOrUpdateModalBill = (value: ContractDto) => {
		if (value == undefined || value.co_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.contractSelected.init(value);
		if (!this.props.is_redirect_billing) {
			this.setState({ visibleModalBill: true, visibleModalCreateUpdate: false })
		} else {

		}

	}
	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	render() {
		const self = this;
		const { pl_id, is_redirect_billing } = this.props;
		const { contractListResult, totalContract } = stores.contractStore;
		return (
			<Card>
				<Row gutter={[8, 8]} align='bottom'>
					{this.props.isTitle == false ? "" :
						<Col  {...cssColResponsiveSpan(24, 24, 4, 2, 2, 2)} >
							<h2>{L('Contract')}</h2>
						</Col>
					}
					{(!!this.props.pl_id !== true) ?
						<Col  {...cssColResponsiveSpan(24, 8, 6, 3, 3, 4)} >
							<strong>{L('ContractName') + ", " + L('ContractCode')}</strong>
							<Input value={this.state.co_search} onPressEnter={() => this.handleSubmitSearch()} allowClear onChange={(e) => this.setState({ co_search: e.target.value.trim() })} placeholder={L('ContractName') + ", " + L('ContractCode')} />
						</Col>
						:
						<Col  {...cssColResponsiveSpan(24, 8, 5, 5, 5, 5)} >
							<strong>{L('ContractName') + ", " + L('ContractCode')}</strong>
							<Input value={this.state.co_search} onPressEnter={() => this.handleSubmitSearch()} allowClear onChange={(e) => this.setState({ co_search: e.target.value.trim() })} placeholder={L('ContractName') + ", " + L('ContractCode')} />
						</Col>
					}
					{(!!this.props.pl_id !== true) ?
						<Col  {...cssColResponsiveSpan(24, 8, 5, 3, 3, 4)} >
							<strong>{L('PurchasePlan')}</strong>
							<SelectPlan pl_id={this.state.pl_id} onChangePlan={(plan) => this.setState({ pl_id: plan.pl_id })} />
						</Col>
						:
						""
					}
					{(!!this.props.pl_id !== true) ?
						<Col  {...cssColResponsiveSpan(24, 8, 5, 3, 3, 4)} >
							<strong>{L('Status')}</strong>
							<SelectEnum eNum={enumContracStatus} enum_value={this.state.co_status} onChangeEnum={(value) => this.setState({ co_status: value })}></SelectEnum>
						</Col>
						:
						<Col  {...cssColResponsiveSpan(24, 5, 5, 5, 5, 5)} >
							<strong>{L('Status')}</strong>
							<SelectEnum eNum={enumContracStatus} enum_value={this.state.co_status} onChangeEnum={(value) => this.setState({ co_status: value })}></SelectEnum>
						</Col>
					}
					{(!!this.props.pl_id !== true) ?
						<Col style={{ textAlign: "center" }} {...cssColResponsiveSpan(9, 6, 3, 3, 3, 2)}>
							<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
						</Col> :
						<Col style={{ textAlign: "center" }} {...cssColResponsiveSpan(9, 6, 4, 4, 4, 4)}>
							<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
						</Col>
					}
					{(!!this.props.pl_id !== true) ?
						<Col style={{ textAlign: "start" }} {...cssColResponsiveSpan(4, 4, 3, 3, 2, 2)}>
							{(this.state.pl_id != undefined || this.state.co_status != undefined || this.state.co_search != undefined) &&
								<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
							}
						</Col>
						:
						<Col style={{ textAlign: "start" }} {...cssColResponsiveSpan(4, 5, 5, 5, 5, 5)}>
							{(this.state.pl_id != undefined || this.state.co_status != undefined || this.state.co_search != undefined) &&
								<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
							}
						</Col>
					}
					{(!!this.props.pl_id !== true) &&
						<Col  {...cssColResponsiveSpan(24, 14, 21, 8, 8, 6)} style={{ textAlign: 'end' }} className='textAlign-col-576'>
							{this.isGranted(AppConsts.Permission.Buy_Buying_Create) &&
								<Button style={{ margin: '0 0.5em 0 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.onCreate()}>{L('Create')}</Button>
							}
							<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelContract: true })}>{L('ExportData')}</Button>
						</Col>
					}
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col id='tab_contract_list'  >
						<TableMainContract
							isPrint={false}
							pl_id={this.props.pl_id}
							ref={this.props.setComponentRef}
							actionTable={this.actionTable}
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							createOrUpdateModalBill={this.createOrUpdateModalBill}
							contractListResult={contractListResult}
							changeStatus={this.onCreateUpdateSuccess}
							hasAction={true}
							pagination={{
								className: "ant-table-pagination ant-table-pagination-right no-print ",
								pageSize: this.state.pageSize,
								total: totalContract,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L("All")],
								onShowSizeChange(current: number, size: number) {
									self.onChangePage(current, size)
								},
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
				</Row >
				<Modal
					visible={this.state.visibleModalCreateUpdate}
					onCancel={() => { this.setState({ visibleModalCreateUpdate: false }) }}
					footer={null}
					width='70vw'
					maskClosable={true}
					closable={false}
					title={L("Contract")}
				>
					<TabsContract
						onCreateUpdateSuccess={this.onCreateUpdateSuccess}
						onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
						contractSelected={this.contractSelected}
						pl_id={pl_id}
						allow_editted={(this.contractSelected.co_status == enumContracStatus.DONE.num || pl_id != undefined) ? true : false}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalBill}
					title={L('ListOf') + " " + L('Bill')}
					onCancel={() => { this.setState({ visibleModalBill: false }) }}
					footer={null}
					width='90vw'
					maskClosable={false}
				>
					<Billing
						co_id={this.contractSelected.co_id}
					/>
				</Modal>

				<ModalExportContract
					contractListResult={contractListResult}
					visible={this.state.visibleExportExcelContract}
					onCancel={() => this.setState({ visibleExportExcelContract: false })}
				/>
				<Modal
					visible={this.state.visibleContractDetail}
					title={L("DetailContract")}
					onCancel={() => { this.setState({ visibleContractDetail: false }) }}
					footer={null}
					width='80vw'
					maskClosable={false}
				>
					<DetaiContract
						create={false} pl_id={this.props.pl_id} onCancel={() => { this.setState({ visibleContractDetail: false }) }} is_redirect_billing={true} />
				</Modal>
			</Card >
		)
	}
}