import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';
import { DeleteFilled, EditOutlined, EyeOutlined, } from '@ant-design/icons';
import { stores } from '@stores/storeInitializer';
import { BorrowReturningLogDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { valueOfeBorrowReturnLogType } from '@src/lib/enumconst';
import moment from 'moment';

const { confirm } = Modal;

export interface IProps {
	onDoubleClickRow?: (item: BorrowReturningLogDto) => void;
	detailModalOpen?: (item: BorrowReturningLogDto) => void;
	deleteBorrowReturningLog?: (item: BorrowReturningLogDto) => void;
	borrowReturningLogListResult: BorrowReturningLogDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
}
export default class TableMainBorrowReturningLog extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
	};
	borrowReSelected: BorrowReturningLogDto = new BorrowReturningLogDto();
	onDoubleClickRow = (item: BorrowReturningLogDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	deleteBorrowReturningLog = (item: BorrowReturningLogDto) => {
		if (!!this.props.deleteBorrowReturningLog) {
			this.props.deleteBorrowReturningLog(item);
		}
	}
	detailModalOpen = (item: BorrowReturningLogDto) => {
		if (!!this.props.detailModalOpen) {
			this.props.detailModalOpen(item);
		}
	}

	render() {
		const { borrowReturningLogListResult, pagination, hasAction } = this.props;
		let action = {
			title: L('chuc_nang'), key: 'action_author_index', className: "no-print center",
			render: (text: string, item: BorrowReturningLogDto) => (
				<div >
					<Button
						type="primary" icon={<EyeOutlined />} title={L('xem_chi_tiet')} size="small"
						style={{ marginLeft: '10px' }}
						onClick={() => this.detailModalOpen(item!)}
					></Button>
				</div>
			)
		};
		const columns: ColumnsType<BorrowReturningLogDto> = [
			{ title: L('stt'), width: 50, key: 'no_borrowReturning', render: (text: string, item: BorrowReturningLogDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div> },
			{ title: L('mo_ta'), key: 'br_re_lo_desc_borrowReturningLog', render: (text, item: BorrowReturningLogDto) => <div>{item.br_re_lo_desc}</div> },
			{ title: L('tac_vu'), key: 'br_re_lo_type_borrowReturningLog', render: (text, item: BorrowReturningLogDto) => <div>{valueOfeBorrowReturnLogType(item.br_re_lo_type)}</div> },
			{ title: L('thoi_gian'), key: 'br_re_lo_created_at_borrowReturningLog', render: (text, item: BorrowReturningLogDto) => <div>{moment(item.br_re_lo_created_at).format("DD/MM/YYYY")}</div> },

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
				rowClassName={(record, index) => (this.borrowReSelected.br_re_lo_id == record.br_re_lo_id) ? "bg-click" : "bg-white"}
				rowKey={record => Math.random() + "_" + record.br_re_lo_id}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={borrowReturningLogListResult.length > 0 ? borrowReturningLogListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}