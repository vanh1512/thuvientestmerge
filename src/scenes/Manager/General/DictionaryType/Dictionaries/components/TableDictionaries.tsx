import * as React from 'react';
import { Avatar, Button, Table, Tooltip, } from 'antd';
import { DeleteFilled, EditOutlined, } from '@ant-design/icons';
import { DictionariesDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';


export interface IProps {
	onDoubleClickRow?: (item: DictionariesDto) => void;
	actionUpdate?: (item: DictionariesDto) => void;
	actionDelete?: (item: DictionariesDto) => void;
	dictionariesListResult: DictionariesDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	isLoadDone: boolean;
	noscroll: boolean;
	onChange?: (listIdDictionaries: number[]) => void;
}
export default class TableDictionaries extends AppComponentBase<IProps> {
	state = {
		dic_id_selected: -1
	}
	listIdDictionaries: number[] = [];
	render() {
		const { isLoadDone, dictionariesListResult, pagination, hasAction, onDoubleClickRow, actionUpdate, actionDelete } = this.props;
		let action: ColumnGroupType<DictionariesDto> = {
			title: "", key: 'action_dictionaries_index', className: "no-print center", children: [], width: 100, fixed: 'right',
			render: (index: number, item: DictionariesDto) => (
				<div >
					{this.isGranted(AppConsts.Permission.General_Dictionary_Edit) &&
						<>
							{(actionUpdate !== undefined) && <Button
								type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
								style={{ marginLeft: '10px' }}
								size='small'
								onClick={() => { this.setState({ dic_id_selected: item!.dic_id }); actionUpdate(item!); }}
							></Button>}
						</>
					}
					{this.isGranted(AppConsts.Permission.General_Dictionary_Delete) &&
						<>
							{(actionDelete !== undefined) && <Button
								danger icon={<DeleteFilled />} title={L('xoa')}
								style={{ marginLeft: '10px' }}
								size='small'
								onClick={() => { this.setState({ dic_id_selected: item!.dic_id }); actionDelete(item) }}
							></Button>}
						</>
					}
				</div>
			)
		};
		const columns: ColumnsType<DictionariesDto> = [
			{ title: (L('stt')), key: 'no_dictionaries_index', width: 50, fixed: "left", render: (text: string, item: DictionariesDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			...(hasAction != undefined ?
				[
					{
						title: L('anh_file'),
						key: 'fi_id_symbol',
						render: (text: string, item: DictionariesDto, index: number) => (
							<div style={{ textAlign: 'center' }}>
								<Avatar size={50} src={(item.fi_id_symbol != undefined && item.fi_id_symbol.isdelete == false) ? this.getFile(item.fi_id_symbol.id) : ""} />
							</div>
						),
					},
				] : []
			),

			{ title: (L('ten')), key: 'dic_name_index', render: (text: string, item: DictionariesDto, index: number) => <div style={{ textAlign: "center" }}>{item.dic_name}</div> },
			...(hasAction != true ?
				[
					{
						title: L('mo_ta'),
						key: 'dic_desc',
						render: (text: string, item: DictionariesDto, index: number) => (
							<div style={{ textAlign: 'center', overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: item.dic_desc! }}></div>
						),
					},
				] : [{
					title: (L('mo_ta_ngan')), key: 'dic_short_des_index', render: (text: string, item: DictionariesDto, index: number) => {
						if (item.dic_short_des!.length > 30 && item.dic_short_des != undefined) {
							return <Tooltip  color='#0080A5' placement="bottom" title={<div style={{ color: "white", }} dangerouslySetInnerHTML={{ __html: item.dic_desc! }}></div>} trigger={"hover"}><div style={{ display: "-webkit-box", WebkitBoxOrient: 'vertical', overflow: "hidden", textOverflow: 'ellipsis', WebkitLineClamp: 1, }} dangerouslySetInnerHTML={{ __html: item.dic_short_des! }}></div></Tooltip>
						}
						else {
							return <div style={{ textAlign: 'center', overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: item.dic_short_des! }}></div>
						}
					}
				}]
			),
		]
		if (hasAction != undefined && hasAction === true && this.isGranted(AppConsts.Permission.General_Dictionary_Edit || AppConsts.Permission.General_Dictionary_Delete)) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<DictionariesDto> = {

			onChange: (listIdDictionaries: React.Key[], listItem: DictionariesDto[]) => {
				this.listIdDictionaries = listItem.length > 0 ? listItem.map(item => item.dic_id) : [];
				if (!!this.props.onChange) {
					this.props.onChange(this.listIdDictionaries)
				}
			}
		}
		return (
			<Table
				style={{ width: "100%" }}
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => {
							if (onDoubleClickRow != undefined && hasAction != undefined && hasAction === true) {
								this.setState({ dic_id_selected: record!.dic_id });
								onDoubleClickRow(record);
							}
						}
					};
				}}
				rowSelection={!!actionDelete ? rowSelection : undefined}
				className='centerTable'
				scroll={this.props.noscroll ? { y: undefined } : { y: 1000 }}
				loading={!isLoadDone}
				rowClassName={(record, index) => (this.state.dic_id_selected !== undefined && this.state.dic_id_selected == record.dic_id) ? "bg-click" : "bg-white"}
				rowKey={record => "dictionary_table_" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={(dictionariesListResult !== undefined) ? dictionariesListResult : []}
				pagination={pagination}

			/>
		)
	}
}