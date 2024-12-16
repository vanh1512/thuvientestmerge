import * as React from 'react';
import { Button, Table, Tag, Tooltip, } from 'antd';
import { BorrowReturningDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { colorEBorrowMethod, colorEBorrowReturningProcess, eBorrowReturningProcess, iconEBorrowMethod, iconEBorrowReturningProcess, valueOfeBorrowMethod, valueOfeBorrowReturningProcess } from '@src/lib/enumconst';
import { stores } from '@src/stores/storeInitializer';
import Icon from '@ant-design/icons';

export interface IProps {
	onAction?: (item: BorrowReturningDto) => void;
	borrowReturningListResult: BorrowReturningDto[],
	actionTable?: ColumnGroupType<BorrowReturningDto>,
	pagination: TablePaginationConfig | false;
	noscroll?: boolean;
	is_printed?: boolean;
}
export default class TableManagerAllDocumentBorrowReturning extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
	};
	borrowReSelected: BorrowReturningDto = new BorrowReturningDto();

	render() {
		const { getUserNameById } = stores.sessionStore;
		const { borrowReturningListResult, pagination, actionTable, is_printed } = this.props;
		const columns: ColumnsType<BorrowReturningDto> = [
			{
				title: L('N.O'), key: 'no_borrowReturning', width: 60,
				render: (text: string, item: BorrowReturningDto, index: number) => <div>{pagination != false ?
					pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div>
			},

			{
				title: L('DocumentBorrowingCode'), key: 'code_borrowReturning',
				render: (text: string, item: BorrowReturningDto) => <div>{item.br_re_code}</div>
			},
			{
				title: L('Borrower'), key: 'us_borrowReturning',
				render: (text: string, item: BorrowReturningDto) => <div>{getUserNameById(item.us_id_borrow)}</div>
			},
			{
				title: L('BorrowingDate'), key: 'create_borrowReturning',
				render: (text: string, item: BorrowReturningDto) => <div>{moment(item.br_re_start_at).format("DD/MM/YYYY")}</div>
			},
			{
				title: L('ReturningDate'), key: 'received_borrowReturning',
				render: (text: string, item: BorrowReturningDto) => <div>{moment(item.br_re_end_at).format("DD/MM/YYYY")}</div>
			},
			{
				title: L('Description'), key: 'desc_borrowReturning',
				render: (text: string, item: BorrowReturningDto) => <div dangerouslySetInnerHTML={{ __html: item.br_re_desc! }}></div>
			},
			{
				title: L('BorrowingMethod'), key: 'method_borrowReturning',
				render: (text: string, item: BorrowReturningDto) => {
					if (is_printed !== undefined && is_printed) {
						return <div>{valueOfeBorrowMethod(item.br_re_method)}</div>
					} else {
						const ElementIcon = iconEBorrowMethod(item.br_re_method);
						return (
							<Tag icon={<ElementIcon />} color={colorEBorrowMethod(item.br_re_method)}>{valueOfeBorrowMethod(item.br_re_method)}</Tag>
						)
					}
				}
			},
			{
				title: L('NumberOfBorrowedDocument'), key: 'nr_borrowReturning', width: 60,
				render: (text: string, item: BorrowReturningDto) => <div>{item.br_re_nr_document}</div>
			},
			// dùng tooltip thì ko bị vỡ bảng 
			{
				title: L('tinh_trang_muon_tra'), key: 'status_borrowReturning', width: '20%',
				render: (value, item) => {
					const ElementIcon = iconEBorrowReturningProcess(item.br_re_status);
					return <Tooltip placement="topLeft" title={""}>
						{is_printed !== undefined && is_printed ? (
							<div>{valueOfeBorrowReturningProcess(item.br_re_status)}</div>
						) :
							(valueOfeBorrowReturningProcess(item.br_re_status) === eBorrowReturningProcess.CHO_DUYET.name ?
								<Tag icon={<eBorrowReturningProcess.CHO_DUYET.icon spin />} color={colorEBorrowReturningProcess(item.br_re_status)}>
									{valueOfeBorrowReturningProcess(item.br_re_status)}
								</Tag>
								:
								<Tag icon={<ElementIcon />} color={colorEBorrowReturningProcess(item.br_re_status)}>

									{valueOfeBorrowReturningProcess(item.br_re_status)}
								</Tag>

							)
						}
					</Tooltip>
				}

			},



		];
		if (actionTable != undefined) {
			columns.push(actionTable);
		}
		return (
			<Table className='centerTable'
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.borrowReSelected.br_re_id == record.br_re_id) ? "bg-click" : "bg-white"}
				scroll={this.props.is_printed ? { y: undefined, x: undefined } : { y: 500, x: 1000 }}
				rowKey={record => Math.random() + "_" + record.br_re_id}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				columns={columns}
				dataSource={borrowReturningListResult.length > 0 ? borrowReturningListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}