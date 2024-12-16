import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ContractDto, CreateContractInput, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { EventTable, cssCol } from '@src/lib/appconst';
import { enumContracStatus } from '@src/lib/enumconst';
import TableMainContract from '../../Contract/components/TableMainContract';
import ActionExport from '@src/components/ActionExport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';
const { confirm } = Modal;
export interface IProps {
	pl_id: number;
	onCancel: () => void;
	is_redirect_billing?: boolean;
	create: boolean;
	setComponentRef?: any | undefined;

}

export default class DetaiContract extends React.Component<IProps> {
	componentRef: any | null = null;

	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelContract: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		co_search: "",
		pl_id: undefined,
		bi_id: -1,
		co_status: undefined,
		isHeaderReport: false,
	};
	contractSelected: ContractDto = new ContractDto();
	async componentDidMount() {
		await this.getAll();
	}
	async componentDidUpdate(prevState, prevProps) {
		if (prevProps.pl_id != this.props.pl_id) {
			this.setState({ pl_id: this.props.pl_id })
			await this.getAll();
		}
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.contractStore.getAll(this.props.pl_id, this.state.co_status, this.state.co_search, this.state.skipCount, this.state.pageSize);
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
		this.contractSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalContract } = stores.contractStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalContract;
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
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const self = this;
		const { pl_id, is_redirect_billing } = this.props;

		const { contractListResult, totalContract } = stores.contractStore;
		return (
			<Card>
				<Row gutter={16} style={{ justifyContent: 'end' }}>

					<ActionExport
						isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
						isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
						nameFileExport='danh_sach_hop_dong'
						idPrint="contract_list"
						isExcel={true}
						isWord={true}
						componentRef={this.componentRef}
					/>
					<Button danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L('Cancel')}</Button>
				</Row>
				<Row style={{ marginTop: '10px', justifyContent: 'center' }}>
					<Col id='contract_list' ref={this.setComponentRef} >
						{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

						<Row style={{ justifyContent: 'center' }}>
							<h2>{L("danh_sach_hop_dong")}</h2>
						</Row>
						<Row style={{ width: '100%' }}>
							<TableMainContract
								isPrint={false}
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
									showTotal: (tot) => ("tong") + ": " + tot + "",
									showQuickJumper: true,
									showSizeChanger: true,
									pageSizeOptions: ['10', '20', '50', '100', L("All")],
									onShowSizeChange(current: number, size: number) {
										self.onChangePage(current, size)
									},
									onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
								}}
							/>
						</Row>
						{this.state.isHeaderReport && <FooterReport />}

					</Col>

				</Row >


			</Card >
		)
	}
}