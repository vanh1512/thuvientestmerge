import * as React from 'react';
import { Button, Table, } from 'antd';
import { DeleteFilled, EditOutlined, } from '@ant-design/icons';
import { CitationDto, DocumentDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppConsts, { EventTable } from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { valueOfeCitationStructure, valueOfeCitationType } from '@src/lib/enumconst';
import moment from 'moment';
import { TableRowSelection } from 'antd/lib/table/interface';

export interface IProps {
	actionTable?: (item: CitationDto, event: EventTable) => void;
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	noscroll?: boolean;
	listCitation: CitationDto[];
	rowSelection?: TableRowSelection<CitationDto>;
	documentSelected?: DocumentDto;
}
export default class TableCitation extends AppComponentBase<IProps> {
	state = {
		ci_id_selected: undefined,
		isLoadDone: false,
	};
	listCitation: CitationDto[] = [];
	onAction = (item: CitationDto, action: EventTable) => {
		this.setState({ ci_id_selected: item.ci_id });
		const { hasAction, actionTable } = this.props;
		if (hasAction != undefined && hasAction === true && actionTable !== undefined) {
			actionTable(item, action);
		}
	}
	render() {
		const { listCitation,documentSelected,rowSelection } = this.props;
		let action: ColumnGroupType<CitationDto> = {
			title: "", children: [], key: 'action_Supplier_index', className: "no-print center", fixed: 'right', width: 100,
			render: (text: string, item: CitationDto) => (
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
		const columns: ColumnsType<CitationDto> = [
			{ title: L('stt'), key: 'no_Supplier_index', fixed: 'left', width: 50, render: (text: string, item: CitationDto, index: number) => <div>{index + 1}</div> },
			{ title: L('ten_tai_lieu'), key: 'cpi_month_Supplier_index', className: "no-print", render: (text: string, item: CitationDto) => <div>{item.itemDocument.name}</div> },
			{ title: L('trich_dan'), key: 'ci_citation', render: (text: string, item: CitationDto) => <div>{item.ci_citation}</div> },
			{ title: L('AvailableDate'), key: 'ci_date_access', width: 150, render: (text: string, item: CitationDto) => <div>{moment(item.ci_date_access).format("DD/MM/YYYY")}</div> },
			{ title: L('kieu_trich_dan'), key: 'su_contact_email', render: (text: string, item: CitationDto) => <div>{valueOfeCitationType(item.ci_type)}</div> },
			{ title: L('cau_truc_trich_dan'), key: 'su_contact_note', render: (text: string, item: CitationDto) => <div>{valueOfeCitationStructure(item.ci_structure)}</div> },
		];
		if (this.props.hasAction == true) {
			columns.push(action);
		}
		
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { this.onAction(record, EventTable.RowDoubleClick) }
					};
				}}
				className="centerTable"
				scroll={this.props.noscroll ? { x: undefined } : { x: 1500 }}
				loading={this.state.isLoadDone}
				rowClassName={(record, index) => (this.state.ci_id_selected == record.ci_id) ? "bg-click" : "bg-white"}
				rowKey={record => "supplier__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				rowSelection={rowSelection!=undefined && documentSelected == undefined ? this.props.rowSelection  : undefined}
				// rowSelection={!!this.props.hasAction ? rowSelection :undefined}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={listCitation.length > 0 ? listCitation : []}
				pagination={this.props.pagination}

			/>
		)
	}
}