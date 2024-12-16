import * as React from 'react';
import { Button, Table, } from 'antd';
import { DeleteFilled, EditOutlined, } from '@ant-design/icons';
import { SupplierDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppConsts, { EventTable } from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { TableRowSelection } from 'antd/lib/table/interface';

export interface IProps {
	actionTable?: (item: SupplierDto, event: EventTable) => void;
	supplierListResult: SupplierDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	noscroll: boolean;
	onChangeSelect?: (listISupplier: SupplierDto[], listIdSupplier: number[]) => void;
}
export default class TableSupplier extends AppComponentBase<IProps> {
	state = {
		su_id_selected: undefined,
		isLoadDone: false,
	};
	listIdSupplier: SupplierDto[] = [];

	onAction = (item: SupplierDto, action: EventTable) => {
		this.setState({ su_id_selected: item.su_id });
		const { hasAction, actionTable } = this.props;
		if (hasAction != undefined && hasAction === true && actionTable !== undefined) {
			actionTable(item, action);
		}
	}
	render() {
		const { supplierListResult, pagination, hasAction } = this.props;
		let action: ColumnGroupType<SupplierDto> = {
			title: "", children: [], key: 'action_Supplier_index', className: "no-print center", fixed: 'right', width: 100,
			render: (text: string, item: SupplierDto) => (
				<div >
					{this.isGranted(AppConsts.Permission.General_Supplier_Edit) &&
						<Button
							type="primary" icon={<EditOutlined />} title={L('Edit')}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.onAction(item!, EventTable.Edit)}
						></Button>
					}
					{this.isGranted(AppConsts.Permission.General_Supplier_Delete) &&
						<Button
							danger icon={<DeleteFilled />} title={L('Delete')}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.onAction(item!, EventTable.Delete)}
						></Button>
					}
				</div>
			)
		};
		const columns: ColumnsType<SupplierDto> = [
			{ title: L('stt'), key: 'no_Supplier_index', fixed: 'left', width: 50, render: (text: string, item: SupplierDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('TaxCode'), key: 'su_tax_code', render: (text: string, item: SupplierDto) => <div>{item.su_tax_code}</div> },
			{ title: L('ShortName'), key: 'cpi_month_Supplier_index', className: "no-print", render: (text: string, item: SupplierDto) => <div>{item.su_short_name}</div> },
			{ title: L('SupplierName'), key: 'su_name', render: (text: string, item: SupplierDto) => <div style={{ overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.su_name! }}></div> },
			{ title: L('Address'), key: 'su_contact_address', render: (text: string, item: SupplierDto) => <div style={{ overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.su_contact_address! }}></div> },
			{ title: L('Contact'), key: 'su_contact_name', render: (text: string, item: SupplierDto) => <div>{item.su_contact_name}</div> },
			{ title: L('so_dien_thoai'), key: 'su_contact_phone', render: (text: string, item: SupplierDto) => <div>{item.su_contact_phone}</div> },
			{ title: L('Fax'), key: 'su_contact_fax', render: (text: string, item: SupplierDto) => <div>{item.su_contact_fax}</div> },
			{ title: L('Email'), key: 'su_contact_email', render: (text: string, item: SupplierDto) => <div style={{ overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.su_contact_email! }}></div> },
			{ title: L('Note'), key: 'su_contact_note', render: (text: string, item: SupplierDto) => <div style={{ overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.su_contact_note! }}></div> },

		];
		if (hasAction != undefined && hasAction === true && this.isGranted(AppConsts.Permission.General_Supplier_Edit || AppConsts.Permission.General_Supplier_Delete)) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<SupplierDto> = {

			onChange: (listKeySupplier: React.Key[], listItem: SupplierDto[]) => {
				let listIdSupplier = listItem.length > 0 ? listItem.map(item => item.su_id) : [];
				if (!!this.props.onChangeSelect) {
					this.props.onChangeSelect(listItem, listIdSupplier)
				}
			}
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { this.onAction(record, EventTable.RowDoubleClick) }
					};
				}}
				rowSelection={!!this.props.hasAction ? rowSelection : undefined}
				className="centerTable"
				scroll={this.props.noscroll ? { x: undefined } : { x: window.innerWidth }}
				loading={this.state.isLoadDone}
				rowClassName={(record, index) => (this.state.su_id_selected == record.su_id) ? "bg-click" : "bg-white"}
				rowKey={record => "supplier__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={supplierListResult.length > 0 ? supplierListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}