import * as React from 'react';
import { Button, Table } from 'antd';
import { DeleteFilled, EditOutlined } from '@ant-design/icons';
import { Marc21Dto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { EventTable } from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';


export interface IProps {
	actionTable?: (item: Marc21Dto, event: EventTable) => void;
	marc21ListResult: Marc21Dto[],
	pagination: TablePaginationConfig | false;
	isLoadDone?: boolean;
	noscroll?: boolean;
	onChange?: (listItemMarc21: Marc21Dto[],listIdMarc21:number[]) => void;
}
export default class TableMarc21 extends AppComponentBase<IProps> {
	state = {
		mar_id_selected: undefined,
	};
	onAction = (item: Marc21Dto, action: EventTable) => {
		this.setState({ mar_id_selected: item.mar_id });
		const { actionTable } = this.props;
		if (actionTable !== undefined) {
			actionTable(item, action);
		}
	}

	render() {
		const { marc21ListResult, pagination, actionTable } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_author_index', className: "no-print", width: 100,
			render: (text: string, item: Marc21Dto) => (
				<div >
					{/* {this.isGranted(AppConsts.Permission.General_Author_Edit) && */}
					<Button
						type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
						style={{ marginLeft: '10px' }}
						size='small'
						onClick={() => this.onAction(item!, EventTable.Edit)}
					></Button>
					{/* } */}
					{/* {this.isGranted(AppConsts.Permission.General_Author_Delete) && */}
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')}
						style={{ marginLeft: '10px' }}
						size='small'
						onClick={() => this.onAction(item!, EventTable.Delete)}
					></Button>
					{/* } */}
				</div>
			)
		};

		const columns: ColumnsType<Marc21Dto> = [
			{ title: L('stt'), key: 'no_mar_index', width: 50, fixed: "left", render: (text: string, item: Marc21Dto, index: number) => <div>{pagination !== false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('ma_marc21'), width: 150, key: 'mar_code_index', render: (text: string, item: Marc21Dto) => <div>{item.mar_code}</div> },
			{ title: L('mo_ta'), key: 'mar_desc_index', render: (text: string, item: Marc21Dto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.mar_desc! }}></div> },

		];
		if (actionTable !== undefined) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<Marc21Dto> = {

			onChange: (listKeyMarc21: React.Key[], listItem: Marc21Dto[]) => {
				let listIdMarc21 = listItem.length > 0 ? listItem.map(item=>item.mar_id) : [];
				if (!!this.props.onChange) {
					this.props.onChange(listItem,listIdMarc21)
				}
			}
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { this.onAction(record!, EventTable.RowDoubleClick) }
					};
				}}
				rowSelection={!!this.props.actionTable ? rowSelection : undefined}
				scroll={this.props.noscroll ? { x: undefined, y: undefined } : { x: 500, y: 900 }}
				className='centerTable'
				loading={!this.props.isLoadDone}
				rowClassName={(record, index) => (this.state.mar_id_selected === record.mar_id) ? "bg-click" : "bg-white"}
				rowKey={record => "author_table_" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={marc21ListResult.length > 0 ? marc21ListResult : []}
				pagination={this.props.pagination}

			/>

		)
	}
}