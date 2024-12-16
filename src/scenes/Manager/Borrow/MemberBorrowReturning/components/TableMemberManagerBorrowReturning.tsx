import * as React from 'react';
import { Button, Modal, Table, Tag, } from 'antd';
import { ExportOutlined, EyeOutlined, StopOutlined, } from '@ant-design/icons';
import { BorrowReturningDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { colorEBorrowReturningProcess, eBorrowReturningProcess, iconEBorrowReturningProcess, valueOfeBorrowMethod, valueOfeBorrowReturningProcess } from '@src/lib/enumconst';
import { stores } from '@src/stores/storeInitializer';

export interface IProps {
	onAction?: (item: BorrowReturningDto) => void;
	borrowReturningListResult: BorrowReturningDto[],
	pagination: TablePaginationConfig | false;
	onMemberCancel?: (item: BorrowReturningDto) => void;
	onMemberDetailManager?: (item: BorrowReturningDto) => void;
	onExtendMemberDocument?: (item: BorrowReturningDto) => void;
	hasAction?: boolean;
	is_printed?: boolean;
	onCancel?: () => void;

}
export default class TableMemberManagerBorrowReturning extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalDetailManager: false,
	};
	borrowReSelected: BorrowReturningDto = new BorrowReturningDto();

	onAction = (item: BorrowReturningDto, action: number) => {
		this.setState({ isLoadDone: false });
		this.borrowReSelected.init(item);
		this.setState({ isLoadDone: true });
	}
	onMemberCancel = (item: BorrowReturningDto) => {
		if (!!this.props.onMemberCancel) {
			this.props.onMemberCancel(item);
		}
	}
	onMemberDetailManager = (item: BorrowReturningDto) => {
		if (!!this.props.onMemberDetailManager) {
			this.props.onMemberDetailManager(item);
		}
	}

	onExtendMemberDocument = (item: BorrowReturningDto) => {
		if (!!this.props.onExtendMemberDocument) {
			this.props.onExtendMemberDocument(item);
		}
	}

	render() {
		const { getUserNameById } = stores.sessionStore;
		const { borrowReturningListResult, pagination } = this.props;
		const columns: any = [
			{ title: L('N.O'), width: 50, key: 'no_borrowReturning', render: (text: string, item: BorrowReturningDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div> },
			{ title: L('DocumentBorrowingCode'), key: 'code_borrowReturning', render: (text: string, item: BorrowReturningDto) => <div>{item.br_re_code}</div> },
			{ title: L('BorrowingDate'), key: 'create_borrowReturning', render: (text: string, item: BorrowReturningDto) => <div>{moment(item.br_re_start_at).format("DD/MM/YYYY")}</div> },
			{ title: L('ReturningDate'), key: 'create_borrowReturning', render: (text: string, item: BorrowReturningDto) => <div>{moment(item.br_re_end_at).format("DD/MM/YYYY")}</div> },
			{ title: L('Description'), key: 'desc_borrowReturning', render: (text: string, item: BorrowReturningDto) => <div dangerouslySetInnerHTML={{ __html: item.br_re_desc! }}></div> },
			{ title: L('BorrowingMethod'), key: 'method_borrowReturning', render: (text: string, item: BorrowReturningDto) => <div>{valueOfeBorrowMethod(item.br_re_method)}</div> },
			{ title: L('NumberOfBorrowedDocument'), key: 'nr_borrowReturning', render: (text: string, item: BorrowReturningDto) => <div>{item.br_re_nr_document}</div> },
			{
				title: L('Status'), width: '20%', key: 'status_borrowReturning', render: (text: string, item: BorrowReturningDto) => {
					const ElementIcon = iconEBorrowReturningProcess(item.br_re_status);
					return (
						<>
							{(valueOfeBorrowReturningProcess(item.br_re_status) === eBorrowReturningProcess.CHO_DUYET.name) ?
								<Tag icon={<eBorrowReturningProcess.CHO_DUYET.icon spin />} color={colorEBorrowReturningProcess(item.br_re_status)}>
									{valueOfeBorrowReturningProcess(item.br_re_status)}
								</Tag>
								:
								<Tag icon={<ElementIcon />} color={colorEBorrowReturningProcess(item.br_re_status)}>
									{valueOfeBorrowReturningProcess(item.br_re_status)}
								</Tag>
							}
						</>
					)
				}
			},

		];

		let action = {
			title: "", width: 100, fixed: 'right', key: 'status_borrowReturning', children: [], className: "no-print center", render: (text: string, item: BorrowReturningDto) =>
				<div>
					{
						(item.br_re_status == eBorrowReturningProcess.CHO_DUYET.num || item.br_re_status == eBorrowReturningProcess.CHO_DUYET.num) &&
						<Button
							danger type="primary" icon={<StopOutlined />} title={L('CancelBorrowingRequest')} size="small"
							style={{ marginLeft: '10px' }}
							onClick={() => this.onMemberCancel(item)}
						></Button>
					}
					<Button
						type="primary" icon={<EyeOutlined />} title={L('SeeDetails')} size="small"
						style={{ marginLeft: '10px' }}
						onClick={() => this.onMemberDetailManager(item)}
					></Button>
					{(item.br_re_status == eBorrowReturningProcess.DA_GIAO_TAI_LIEU.num || item.br_re_status == eBorrowReturningProcess.DA_TRA_1PHAN.num) ? <Button
						type="primary" icon={<ExportOutlined />} title={L('ExtendBorrowedDocuments')} size="small"
						style={{ marginLeft: '10px' }}
						onClick={() => this.onExtendMemberDocument(item)}
					></Button> : <></>}
				</div>
		}


		if (this.props.hasAction && this.props.hasAction != undefined) {
			columns.push(action);
		}
		return (
			<div>
				<Table className='centerTable'
					loading={!this.state.isLoadDone}
					rowClassName={(record, index) => (this.borrowReSelected.br_re_id == record.br_re_id) ? "bg-click" : "bg-white"}
					rowKey={record => Math.random() + "_" + record.br_re_id}
					size={'middle'}
					scroll={this.props.is_printed ? { x: undefined, y: undefined } : { x: 1000, y: 500 }}
					bordered={true}
					locale={{ "emptyText": L('NoData') }}
					columns={columns}
					dataSource={borrowReturningListResult.length > 0 ? borrowReturningListResult : []}
					pagination={this.props.pagination}

				/>
			</div>
		)
	}
}