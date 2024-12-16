import * as React from 'react';
import { Button, Table, } from 'antd';
import { ContainerOutlined, DeleteFilled, EditOutlined, EyeOutlined, FilePdfOutlined, PrinterOutlined, } from '@ant-design/icons';
import { BillingDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';

export interface IProps {
	onDoubleClickRow?: (item: BillingDto) => void;
	createOrUpdateModalOpen?: (item: BillingDto) => void;
	createOrUpdateModalBillingItem?: (item: BillingDto) => void;
	deleteBilling?: (item: BillingDto) => void;
	onShowModalOpen?: (item: BillingDto) => void;
	onPrintModalOpen?: (item: BillingDto) => void;
	billingListResult: BillingDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	allow_editted?: boolean;
}
export default class TableMainBilling extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleModalFile: false,
	};
	billingSelected: BillingDto = new BillingDto();

	onDoubleClickRow = (item: BillingDto) => {
		this.billingSelected = item;
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	deleteBilling = (item: BillingDto) => {
		if (!!this.props.deleteBilling) {
			this.props.deleteBilling(item);
		}
	}
	onShowModalOpen = (item: BillingDto) => {
		if (!!this.props.onShowModalOpen) {
			this.props.onShowModalOpen(item);
		}
	}
	createOrUpdateModalOpen = (item: BillingDto) => {
		this.billingSelected = item;
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	createOrUpdateModalBillingItem = (item: BillingDto) => {
		this.billingSelected = item;
		if (!!this.props.createOrUpdateModalBillingItem) {
			this.props.createOrUpdateModalBillingItem(this.billingSelected);
		}
	}

	onPrintModalOpen = (item: BillingDto) => {
		this.billingSelected = item;
		if (!!this.props.onPrintModalOpen) {
			this.props.onPrintModalOpen(this.billingSelected);
		}
	}

	render() {
		const { billingListResult, pagination, hasAction, allow_editted } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_billing_index', className: "no-print center",
			render: (text: string, item: BillingDto) => (
				<div >
					{!allow_editted && <>
						<Button
							type="primary" icon={<EditOutlined />} title={L('Edit')} size='small'
							style={{ marginLeft: '10px' }}
							onClick={() => this.createOrUpdateModalOpen(item!)}
						></Button>
					</>
					}
					<Button
						type="primary" icon={<FilePdfOutlined />} title={L('BillFile')} size='small'
						style={{ marginLeft: '10px' }}
						onClick={() => this.onShowModalOpen(item)}
					></Button>
					<Button
						type="primary" icon={<EyeOutlined />} title={L('BillPrint')} size='small'
						style={{ marginLeft: '10px' }}
						onClick={() => this.onPrintModalOpen(item)}
					></Button>
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')} size='small'
						style={{ marginLeft: '10px' }}
						onClick={() => this.deleteBilling(item)}
					></Button>
				</div>
			)
		};
		const columns: ColumnsType<BillingDto> = [
			{ title: L('N.O'), dataIndex: '', width: 50, key: 'no_bill_table', render: (text: string, item: BillingDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div>, },
			{ title: L('BillCode'), dataIndex: 'bi_code', key: 'bi_code_bill_table', render: (text: string, item: BillingDto, index: number) => <div>{item.bi_code}</div>, },
			{ title: L('ExportBillDate'), dataIndex: 'bi_export', key: 'bi_export_bill_table', render: (text: string, item: BillingDto) => <div>{moment(item.bi_export).format('DD/MM/YYYY')}</div> },
			{ title: L('Quantity'), dataIndex: 'bi_export', key: 'bi_export_bill_table', render: (text: string, item: BillingDto) => <div>{item.billingItems!.length}</div> },
			{ title: L('Note'), dataIndex: 'bi_note', key: 'bi_note_bill_table', render: (text: string, item: BillingDto) => <div dangerouslySetInnerHTML={{ __html: item.bi_note! }}></div> },

		];
		if (hasAction != undefined && hasAction === true) {
			columns.push(action);
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onDoubleClickRow(record) }
					};
				}}
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.billingSelected.bi_id == record.bi_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				columns={columns}
				dataSource={billingListResult.length > 0 ? billingListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}