import * as React from 'react';
import { Button, Table,} from 'antd';
import { DeleteFilled, EditOutlined,} from '@ant-design/icons';
import { DocumentLogDto,} from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';


export interface IProps {
	onDoubleClickRow?: (item: DocumentLogDto) => void;
	createOrUpdateModalOpen?: (item: DocumentLogDto) => void;
	documentLogListResult: DocumentLogDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
}
export default class TableMainDocumentLog extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
	};
	documentLogSelected: DocumentLogDto = new DocumentLogDto();
	onDoubleClickRow = (item: DocumentLogDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}

	createOrUpdateModalOpen = (item: DocumentLogDto) => {
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	render() {
		const { documentLogListResult, pagination, hasAction } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_documentLog_index', className: "no-print center",
			render: (text: string, item: DocumentLogDto) => (
				<div >
					<Button
							type="primary" icon={<EditOutlined />} title='Chỉnh sửa'
							style={{ marginLeft: '10px' }}
							onClick={() => this.createOrUpdateModalOpen(item!)}
						></Button>
				</div>
			)
		};
		const columns = [
			{ title: L('N.O'), dataIndex: '', key: 'no_documentLog_index', render: (text: string, item: DocumentLogDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1): index+1}</div> },
			{ title: L('Month'), dataIndex: 'cpi_month', key: 'cpi_month_documentLog_index', render: (text: string) => <div>{text}</div> },
			{ title: L('Index'), dataIndex: 'index', key: 'index_documentLog_index', render: (text: string) => <div>{text}</div> },

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
				rowClassName={(record, index) => (this.documentLogSelected.do_lo_id == record.do_lo_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={documentLogListResult.length > 0 ? documentLogListResult:[]}
				pagination={this.props.pagination}

			/>
		)
	}
}