import * as React from 'react';
import { Button, Table } from 'antd';
import { DeleteFilled, EditOutlined } from '@ant-design/icons';
import { SubFieldMarc21Dto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { EventTable } from '@src/lib/appconst';
import GetNameItem from '@src/components/Manager/GetNameItem';
import { TableRowSelection } from 'antd/lib/table/interface';


export interface IProps {
	actionTable?: (item: SubFieldMarc21Dto, event: EventTable) => void;
	subFieldMarc21ListResult: SubFieldMarc21Dto[],
	pagination: TablePaginationConfig | false;
	isLoadDone?: boolean;
	noscroll?: boolean;
	onChange?: (listItemSubField: SubFieldMarc21Dto[],listIdSubField:number[]) => void;
}
export default class TableSubFieldMarc21 extends AppComponentBase<IProps> {
	state = {
		mar_id_selected: undefined,
	};
	listSubField: SubFieldMarc21Dto[] = [];

	onAction = (item: SubFieldMarc21Dto, action: EventTable) => {
		this.setState({ mar_id_selected: item.sub_id });
		const { actionTable } = this.props;
		if (actionTable !== undefined) {
			actionTable(item, action);
		}
	}

	render() {
		const { subFieldMarc21ListResult, pagination, actionTable } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_author_index', className: "no-print",
			render: (text: string, item: SubFieldMarc21Dto) => (
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

		const columns: ColumnsType<SubFieldMarc21Dto> = [
			{ title: L('stt'), key: 'no_mar_index', width: 50, fixed: "left", render: (text: string, item: SubFieldMarc21Dto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('ma_marc21'), key: 'mar_id_index', render: (text: string, item: SubFieldMarc21Dto) => <div>{GetNameItem.getNamePlaMARC21(item.mar_id)}</div> },
			{ title: L('ma_truong_con'), key: 'sub_code_index', render: (text: string, item: SubFieldMarc21Dto) => <div>{item.sub_code}</div> },
			{ title: L('mo_ta'), key: 'sub_desc_index', render: (text: string, item: SubFieldMarc21Dto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.sub_desc! }}></div> },

		];
		if (actionTable != undefined) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<SubFieldMarc21Dto> = {

			onChange: (listKeySubField: React.Key[], listItem: SubFieldMarc21Dto[]) => {
				let listIdSubField = listItem.length > 0 ? listItem.map(item=>item.sub_id) : [];
				if (!!this.props.onChange) {
					this.props.onChange(listItem,listIdSubField)
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
				scroll={this.props.noscroll ? { x: undefined, y: undefined } : { x: window.innerWidth, y: window.innerHeight }}
				rowSelection={!!this.props.actionTable ? rowSelection : undefined}
				className='centerTable'
				loading={!this.props.isLoadDone}
				rowClassName={(record, index) => (this.state.mar_id_selected === record.sub_id) ? "bg-click" : "bg-white"}
				rowKey={record => "author_table_" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={subFieldMarc21ListResult.length > 0 ? subFieldMarc21ListResult : []}
				pagination={this.props.pagination}

			/>

		)
	}
}