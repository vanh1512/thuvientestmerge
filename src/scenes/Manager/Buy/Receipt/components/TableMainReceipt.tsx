import * as React from 'react';
import { Button, Col, Popover, Row, Table, Tag, message, } from 'antd';
import { CaretDownOutlined, CheckCircleOutlined, DeleteFilled, EditOutlined, FileProtectOutlined, PrinterOutlined, SyncOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import { PlanDto, ReceiptDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { eReceiptStatus, valueOfeReceiptStatus } from '@src/lib/enumconst';
import Modal from 'antd/lib/modal/Modal';
import ReceiptFormExport from './ReceiptFormExport';
import ActionExport from '@src/components/ActionExport';
import { stores } from '@src/stores/storeInitializer';
import GetNameItem from '@src/components/Manager/GetNameItem';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';

export interface IProps {
	onDoubleClickRow?: (item: ReceiptDto) => void;
	createOrUpdateModalOpen?: (item: ReceiptDto) => void;
	gotoCataloging?: (item: ReceiptDto) => void;
	deleteItem?: (item: ReceiptDto) => void;
	printForm?: (item: ReceiptDto) => void;
	receiptListResult: ReceiptDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	noscroll?: boolean;
	is_printed?: boolean;

}
export default class TableMainReceipt extends AppComponentBase<IProps> {
	componentRef: any | null = null;

	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleReceiptForm: false,
		rec_id: undefined,
		clicked: false,
	};
	receiptSelected: ReceiptDto = new ReceiptDto();
	async componentDidMount() {
		await this.setState({ isLoading: true });
		await stores.planStore.getAll(undefined, undefined, undefined, undefined);
		await this.setState({ isLoading: false });
	}
	onDoubleClickRow = (item: ReceiptDto) => {
		this.receiptSelected = item;
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}

	createOrUpdateModalOpen = (item: ReceiptDto) => {
		this.receiptSelected = item;
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	deleteReceipt = (item: ReceiptDto) => {
		this.receiptSelected = item;
		if (!!this.props.deleteItem) {
			this.props.deleteItem(item);
		}
	}
	gotoCataloging = (item: ReceiptDto) => {
		this.receiptSelected = item;
		if (!!this.props.gotoCataloging) {
			this.props.gotoCataloging(item);
		}
	}

	printForm = (item: ReceiptDto) => {
		this.receiptSelected = item;
		this.setState({ visibleReceiptForm: true })
		if (!!this.props.printForm) {
			this.props.printForm(item);
		}
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	handleVisibleChange = (visible, item: ReceiptDto) => {
		this.setState({ clicked: visible, rec_id: item.rec_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	content = (item: ReceiptDto) => (
		<div >
			{
				item.rec_status == eReceiptStatus.Chua_nhap_tai_lieu.num ?
					<>
						{this.isGranted(AppConsts.Permission.Buy_Receipt_Edit) &&
							(<Row style={{ alignItems: "center" }}>
								<Button
									type="primary" icon={<EditOutlined />} title={L('Edit')}
									style={{ marginLeft: '10px', marginTop: "5px" }}
									size='small'
									onClick={() => { this.createOrUpdateModalOpen(item!); this.hide() }}
								></Button>
								<a style={{ paddingLeft: "10px" }} onClick={() => { this.createOrUpdateModalOpen(item!); this.hide() }}>{L('Edit')}</a>
							</Row>)
						}
						{this.isGranted(AppConsts.Permission.Buy_Receipt_Cataloging) &&
							(<Row style={{ alignItems: "center" }}>
								<Button
									type="primary" icon={<FileProtectOutlined />} title={L('ImportDocument')}
									style={{ marginLeft: '10px', marginTop: "5px" }}
									size='small'
									onClick={() => { this.gotoCataloging(item!); this.hide() }}
								></Button>
								<a style={{ paddingLeft: "10px" }} onClick={() => { this.gotoCataloging(item!); this.hide() }}>{L('ImportDocument')}</a>
							</Row>)}
						{this.isGranted(AppConsts.Permission.Buy_Receipt_Delete) &&
							(<Row style={{ alignItems: "center" }}>
								<Button
									danger
									type="primary" icon={<DeleteFilled />} title={L('Delete')}
									style={{ marginLeft: '10px', marginTop: '5px' }}
									size='small'
									onClick={() => { this.deleteReceipt(item!); this.hide() }}
								></Button>
								<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteReceipt(item!); this.hide() }}>{L('Delete')}</a>
							</Row>)}
					</>
					:
					(

						this.isGranted(AppConsts.Permission.Buy_Receipt_PrintReceip) &&
						(<Row style={{ alignItems: "center" }}>
							<Button
								type="primary" icon={<PrinterOutlined />} title={L('PrintReceipt')}
								style={{ marginLeft: '10px', marginTop: "5px" }}
								size='small'
								onClick={() => { this.printForm(item!); this.hide() }}
							></Button>
							<a style={{ paddingLeft: "10px" }} onClick={() => { this.printForm(item!); this.hide() }}>{L('PrintReceipt')}</a>
						</Row>)

					)
			}
		</div>
	)
	render() {
		const { receiptListResult, pagination, hasAction, is_printed } = this.props;

		let action = {
			title: "", dataIndex: '', key: 'action_receipt_index', className: "no-print center", width: 50,
			render: (text: string, item: ReceiptDto) => (
				<Popover visible={this.state.clicked && this.state.rec_id == item.rec_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.rec_id == item.rec_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};
		const columns: ColumnsType<ReceiptDto> = [
			{ title: L('N.O'), width: 50, key: 'no_receipt_index', render: (text: string, item: ReceiptDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('ReceitptCode'), key: 'rec_code', render: (text: string, item: ReceiptDto) => <div>{item.rec_code}</div> },
			{ title: L('ReceiptImport'), key: 'co_signed_at', render: (item: ReceiptDto) => <div>{moment(item.rec_import_date).format('DD/MM/YYYY')}</div> },
			{ title: L('ReceiptReason'), key: 'rec_reason', render: (text: string, item: ReceiptDto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.rec_reason! }}></div> },
			{
				title: L('Status'), key: 'rec_status', render: (text: string, item: ReceiptDto) => {
					if (is_printed !== undefined && is_printed) {
						return <div>{valueOfeReceiptStatus(item.rec_status)}</div>
					} else {
						return <div>
							{item.rec_status == eReceiptStatus.Da_nhap_tai_lieu.num ?
								<Tag icon={<CheckCircleOutlined />} color="success">
									{valueOfeReceiptStatus(item.rec_status)}
								</Tag>
								:
								<Tag icon={<SyncOutlined spin />} color="processing">
									{valueOfeReceiptStatus(item.rec_status)}
								</Tag>
							}
						</div>
					}
				}

			},
		];
		if (hasAction != undefined && hasAction === true && this.isGranted(
			AppConsts.Permission.Buy_Receipt_Edit ||
			AppConsts.Permission.Buy_Receipt_Cataloging ||
			AppConsts.Permission.Buy_Receipt_Delete ||
			AppConsts.Permission.Buy_Receipt_PrintReceip)) {
			columns.push(action);
		}
		return (
			<>
				<Table
					onRow={(record, rowIndex) => {
						return {
							onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onDoubleClickRow(record) }
						};
					}}
					loading={!this.state.isLoadDone}
					rowClassName={(record, index) => (this.receiptSelected.rec_id == record.rec_id) ? "bg-click" : "bg-white"}
					rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
					size={'middle'}
					className='centerTable'
					bordered={true}
					locale={{ "emptyText": L('NoData') }}
					columns={columns}
					dataSource={receiptListResult.length > 0 ? receiptListResult : []}
					pagination={this.props.pagination}
				/>

				<Modal
					visible={this.state.visibleReceiptForm}
					title={
						<Row>
							<Col span={7}>
								<h3>{L('ExportReceipt')}</h3>
							</Col>
							<Col span={14} style={{ textAlign: 'end' }}>
								< ActionExport
									nameFileExport='Phiếu nhập kho'
									idPrint="receipt_form_print_id"
									isExcel={true}
									isWord={true}
									componentRef={this.componentRef}
								/>
							</Col>
							<Col span={3}>
								<Button danger style={{ margin: '0 26px 0 10px' }} onClick={() => this.setState({ visibleReceiptForm: false })}>{L("huy")}</Button>
							</Col>
						</Row>
					}
					closable={false}
					onCancel={() => { this.setState({ visibleReceiptForm: false }) }}
					footer={null}
					width='60vw'
					maskClosable={true}

				>
					<Col id='receipt_form_print_id' ref={this.setComponentRef}>
						<ReceiptFormExport
							receiptSelected={this.receiptSelected}
						/>
					</Col>
				</Modal>
			</>
		)
	}
}