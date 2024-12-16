import * as React from 'react';
import { Col, Row, Button, Modal, message } from 'antd';
import { stores } from '@stores/storeInitializer';
import { BillingDto, ContractDto, CreateBillingInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, PlusOutlined, } from '@ant-design/icons';
import CreateOrUpdateBilling from './components/CreateOrUpdateBilling';
import TableMainBilling from './components/TableMainBilling';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import ContractPrintForm from './components/ContractPrintForm';
import ActionExport from '@src/components/ActionExport';
import FileAttachments from '@src/components/FileAttachments';

const { confirm } = Modal;
export interface IProps {
	co_id: number;
	contractSelected?: ContractDto;
	allow_editted?: boolean;
	changeStatus?: () => void;
}

export default class Billing extends AppComponentBase<IProps> {
	private buttonRef: any = React.createRef();
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
		isLoadFile: false,
		visibleModalCreateUpdate: false,
		visibleModalFile: false,
		visibleModalContractPrint: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		bi_code: undefined,
		su_id: undefined,
		co_id: undefined,
		bi_export_from: undefined,
		bi_export_to: undefined,
		bi_status: undefined,
		idSelected: -1,
	};
	billingSelected: BillingDto = new BillingDto();


	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.billingStore.getAll(this.state.bi_code, this.state.su_id, this.props.co_id, this.state.bi_export_from, this.state.bi_export_to, this.state.bi_status, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelBilling: false });
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.contractSelected != undefined) {

			if (nextProps.contractSelected.co_id !== prevState.idSelected) {
				return ({ idSelected: nextProps.contractSelected.co_id });
			}
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			await this.getAll();
		}
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}
	createOrUpdateModalOpen = async (input: CreateBillingInput) => {

		if (input !== undefined && input !== null) {
			this.billingSelected.init(input);
		}
		await this.setState({ visibleModalCreateUpdate: true, visibleModalBillingItem: false });
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	onDoubleClickRow = (value: BillingDto) => {
		if (value == undefined || value.bi_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}

		this.billingSelected.init(value);
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

	onCreateOrUpdateBillingItem = (item: BillingDto) => {
		this.billingSelected.init(item);
		this.setState({ visibleModalBillingItem: true, visibleModalCreateUpdate: false });
	}
	onShowModalOpen = async (value: BillingDto) => {
		if (value.fi_id_arr != undefined && value.fi_id_arr.length > 0) {
			this.billingSelected.init(value);
			await this.setState({ visibleModalFile: true, });
			await this.setState({ isLoadFile: !this.state.isLoadFile });
		}
		else {
			this.setState({ visibleModalFile: false });
			message.warning(L("ThereNoBillFile"));
		}
	}

	deleteBilling = async (item: BillingDto) => {
		this.setState({ isLoadDone: false });
		let self = this;
		const {totalBill } = stores.billingStore;
		confirm({
			title: L("YouWantToDelete") + " " + item.bi_code + "?",
			okText: L("Delete"),
			cancelText: L("huy"),
			async onOk() {
				if ( self.state.currentPage > 1 && (totalBill - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, 10)
				await stores.billingStore.deleteBilling(item.bi_id);
				await self.getAll();
				message.success(L("Delete"));
			},
			onCancel() {

			},
		});

		this.setState({ isLoadDone: true });
	}
	onPrintModalOpen = async (item: BillingDto) => {
		this.billingSelected.init(item);
		await stores.billingItemStore.getAll(item.bi_id, undefined, undefined);
		this.setState({ visibleModalContractPrint: true });
	}

	changeStatus = () => {
		if (!!this.props.changeStatus) { this.props.changeStatus(); }
	}
	onSuccess = async () => {
		await this.getAll();
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const self = this;
		const { billingItemListResult, totalBillItem } = stores.billingItemStore;
		const { billingListResult, totalBill } = stores.billingStore;
		const { allow_editted } = this.props;
		return (
			<>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L('DetailBillList')}</h2>
					</Col>
					{!allow_editted && <Col span={12} style={{ textAlign: "right" }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new BillingDto())}>{L('Create')}</Button>
					</Col>}
				</Row>
				<TableMainBilling
					createOrUpdateModalBillingItem={(item: BillingDto) => this.onCreateOrUpdateBillingItem(item)}
					onDoubleClickRow={allow_editted ? this.onShowModalOpen : this.onDoubleClickRow}
					createOrUpdateModalOpen={this.createOrUpdateModalOpen}
					onShowModalOpen={this.onShowModalOpen}
					onPrintModalOpen={this.onPrintModalOpen}
					deleteBilling={this.deleteBilling}
					billingListResult={billingListResult}
					hasAction={true}
					allow_editted={allow_editted}
					pagination={{
						pageSize: this.state.pageSize,
						total: totalBill,
						current: this.state.currentPage,
						showTotal: (tot) => L("Total") + ": " + tot + "",
						showQuickJumper: true,
						showSizeChanger: true,
						pageSizeOptions: ['10', '20', '50', '100'],
						onShowSizeChange(current: number, size: number) {
							self.onChangePage(current, size)
						},
						onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
					}}
				/>
				<Modal
					visible={this.state.visibleModalCreateUpdate}
					width={this.billingSelected.bi_id != undefined ? '100vw' : "40vw"}
					onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
					footer={null}
					maskClosable={false}
					closable={false}
					title={<Row>
						<Col span={6}>
							<h2>{L('Bill')}</h2>
						</Col>
						<Col span={18} style={{ textAlign: 'right' }}>
							<Button danger onClick={() => { this.setState({ visibleModalCreateUpdate: false }); this.onCreateUpdateSuccess(); }} icon={<CloseCircleOutlined />}>{L("Cancel")}</Button>
							&nbsp;&nbsp;
							{(this.billingSelected.bi_id != undefined && this.billingSelected.bi_id > 0) &&
								<Button type="primary"
									icon={<CheckCircleOutlined />}
									onClick={() => { this.buttonRef.current.onCreateUpdate(); this.onCreateUpdateSuccess(); }}
								>
									{L("Save")}
								</Button>
							}
						</Col>
					</Row>}
				>
					<CreateOrUpdateBilling
						changeBilling={(item: BillingDto) => {
							self.setState({ isLoadDone: false });
							self.billingSelected.init(item);
							self.setState({ isLoadDone: true });
						}}
						onCreateUpdateSuccess={this.onCreateUpdateSuccess}
						onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
						billingSelected={this.billingSelected}
						co_id={this.props.co_id!}
						changeStatus={this.changeStatus}
						ref={this.buttonRef}
					/>
				</Modal>
				<Modal
					visible={this.state.visibleModalFile}
					width={'50vw'}
					onCancel={() => this.setState({ visibleModalFile: false })}
					footer={null}
				>
					<FileAttachments
						files={this.billingSelected.fi_id_arr != undefined ? this.billingSelected.fi_id_arr.filter(item => item.isdelete == false) : []}
						isLoadFile={this.state.isLoadFile}
						isMultiple={false}
					/>
				</Modal>

				<Modal
					visible={this.state.visibleModalContractPrint}
					width={'50vw'}
					onCancel={() => this.setState({ visibleModalContractPrint: false })}
					footer={null}
					maskClosable={false}
					closable={false}
					title={<Row>
						<Col span={6}>
							<h2>{L('BillPrint')}</h2>
						</Col>
						<Col span={18} style={{ textAlign: 'right' }}>
							<ActionExport
								isWord={true}
								isExcel={true}
								idPrint={"contract_print_form_id"}
								nameFileExport={"Hóa đơn giá trị gia tăng"}
								componentRef={this.componentRef}
							/>
							<Button danger style={{ margin: '0 26px 0 10px' }} onClick={() => this.setState({ visibleModalContractPrint: false })}>{L("huy")}</Button>
						</Col>
					</Row>}
				>
					<Col id='contract_print_form_id' ref={this.setComponentRef}>
						<ContractPrintForm
							billingItemListResult={billingItemListResult}
							billingResult={this.billingSelected}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalBillItem,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100'],
							}}
						/>
					</Col>
				</Modal>
			</>
		)
	}
}