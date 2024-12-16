import * as React from 'react';
import { Button, Checkbox, Row, Table, } from 'antd';
import { DeleteFilled, EditOutlined, } from '@ant-design/icons';
import { DictionaryTypeDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';


export interface IProps {
	onClickRow?: (item: DictionaryTypeDto) => void;
	onDoubleClickRow?: (item: DictionaryTypeDto) => void;
	actionUpdate?: (item: DictionaryTypeDto) => void;
	actionDelete?: (item: DictionaryTypeDto) => void;
	actionChangeStatus?: (item: DictionaryTypeDto, checked: boolean) => void;
	dictionaryTypeListResult: DictionaryTypeDto[],
	pagination: TablePaginationConfig | false;
	isLoadDone?: boolean;
	noscroll?: boolean;
	onChange?: (listItemDictionaryType: DictionaryTypeDto[], listIdDictionaryType: number[]) => void;
}
export default class TableDictionaryType extends AppComponentBase<IProps> {
	state = {
		dic_ty_id_selected: undefined
	};
	render() {
		const { dictionaryTypeListResult, pagination, isLoadDone, actionUpdate, actionDelete, actionChangeStatus, onClickRow, onDoubleClickRow } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_dictionary_type', className: "no-print center", width: "10%",
			render: (text: string, item: DictionaryTypeDto) => (
				<Row justify='center'>

					{(this.isGranted(AppConsts.Permission.General_DictionaryType_ChangeStatus) && actionChangeStatus !== undefined) && <div title={L("kich_hoat")}><Checkbox checked={item.dic_ty_is_active} onChange={(e) => { actionChangeStatus(item, e.target.checked) }} ></Checkbox></div>}
					{this.isGranted(AppConsts.Permission.General_DictionaryType_Edit) &&
						<>
							{(actionUpdate !== undefined) && <Button
								type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
								style={{ marginLeft: '10px' }}
								size='small'
								onClick={() => {
									this.setState({ dic_ty_id_selected: item.dic_ty_id });
									actionUpdate(item!);
								}}
							></Button>}
						</>
					}
					{this.isGranted(AppConsts.Permission.General_DictionaryType_Delete) &&
						<>
							{(actionDelete !== undefined) && <Button
								danger icon={<DeleteFilled />} title={L('xoa')}
								style={{ marginLeft: '10px' }}
								size='small'
								onClick={() => {
									this.setState({ dic_ty_id_selected: item.dic_ty_id });
									actionDelete(item)
								}}
							></Button>}
						</>
					}
				</Row>
			)
		};
		const columns: ColumnsType<DictionaryTypeDto> = [
			{ title: L('stt'), width: 50, dataIndex: '', key: 'no_DictionaryType_index', render: (text: string, item: DictionaryTypeDto, index: number) => <div style={{ textAlign: "center" }}>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('ten_tu_dien'), dataIndex: 'dic_ty_name', key: 'dic_ty_name', render: (text: string, item: DictionaryTypeDto,) => <div style={{ textAlign: "center" }}>{item.dic_ty_name}</div> },
			{ title: L('mo_ta'), dataIndex: 'dic_ty_desc', key: 'dic_ty_desc', render: (text: string, item: DictionaryTypeDto,) => <div style={{ overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.dic_ty_desc! }}></div> },
		];
		if (actionChangeStatus !== undefined && actionUpdate !== undefined && actionDelete !== undefined && this.isGranted(AppConsts.Permission.General_DictionaryType_Edit || AppConsts.Permission.General_DictionaryType_Delete)) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<DictionaryTypeDto> = {

			onChange: (listKeyDictionaryType: React.Key[], listItem: DictionaryTypeDto[]) => {
				let listIdDictionaryType = listItem.length > 0 ? listItem.map(item=>item.dic_ty_id) : [];
				if (!!this.props.onChange) {
					this.props.onChange(listItem,listIdDictionaryType)
				}
			}
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onClick: (event: any) => {
							this.setState({ dic_ty_id_selected: record.dic_ty_id });
							if (onClickRow !== undefined) {
								onClickRow(record);
							}
						}, onDoubleClick: (event: any) => {
							this.setState({ dic_ty_id_selected: record.dic_ty_id });
							if (onDoubleClickRow !== undefined) {
								onDoubleClickRow(record);
							}
						},
					};
				}}
				rowSelection={!!actionDelete ? rowSelection : undefined}
				className='centerTable'
				loading={!isLoadDone}
				scroll={this.props.noscroll ? { y: undefined } : { y: window.innerHeight }}
				rowClassName={(record, index) => (this.state.dic_ty_id_selected == record.dic_ty_id) ? "bg-click" : "bg-white"}
				rowKey={record => "dictionary_table__" + JSON.stringify(record)}
				size={'middle'}
				style={{ width: "100%" }}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={(dictionaryTypeListResult !== undefined) ? dictionaryTypeListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}