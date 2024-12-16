import * as React from 'react';
import { Button, Select, Table, } from 'antd';
import { DocumentDto, ItemDocument, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import { SorterResult, TableRowSelection } from 'antd/lib/table/interface';

export interface IProps {
	onDoubleClickRow?: (item: DocumentDto) => void;
	onMultiSelectedDocument?: (listItemDocument: ItemDocument[]) => void|undefined;
	onChooseDocument?: (listItemDocument: ItemDocument[]) => void|undefined;
	changeColumnSort?: (fieldSort: SorterResult<DocumentDto> | SorterResult<DocumentDto>[]) => void;
	doccumentListResult: DocumentDto[],
	pagination: TablePaginationConfig | false;
	listColumnDisplay: ColumnsDisplayType<any>;
	doIdSelected?: number | undefined;
	isLoadDone: boolean;
	noscroll: boolean;
	rowSelect?: TableRowSelection<DocumentDto>;
}
export default class TableMainDocument extends React.Component<IProps> {
	onDoubleClickRow = (item: DocumentDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	// rowSelection: TableRowSelection<DocumentDto> = {
	// 	onChange(selectedRowKeys: React.Key[], listDocumentDto: DocumentDto[]) => {
	// 	let listItemDocument: ItemDocument[] = [];
	// 	listDocumentDto.map((itemDocument: DocumentDto) => {
	// 		let itemDoc = new ItemDocument();
	// 		itemDoc.id = itemDocument.do_id;
	// 		itemDoc.name = itemDocument.do_title;
	// 		listItemDocument.push(itemDoc);
	// 	})
	// 	if (this.props.onChooseDocument != undefined) {
	// 		this.props.onChooseDocument(listItemDocument);
	// 	}
	// }
	rowSelection: TableRowSelection<DocumentDto> = {
		onChange: (listIdDocument: React.Key[], listItem: DocumentDto[]) => {
			this.setState({ isLoadDone: false });
			let listItemDocument: ItemDocument[] = [];
			listItem.map((itemDocument: DocumentDto) => {
				let itemDoc = new ItemDocument();
				itemDoc.id = itemDocument.do_id;
				itemDoc.name = itemDocument.do_title;
				listItemDocument.push(itemDoc);
				this.setState({ isLoadDone: true })
			})
			if (this.props.onChooseDocument != undefined) {
				this.props.onChooseDocument(listItemDocument);
			}
		}}
	
	render() {
			const { doccumentListResult, pagination, isLoadDone, doIdSelected, listColumnDisplay, onChooseDocument } = this.props;
			return (
				<Table
					className='centerTable page-break'
					rowSelection={this.props.onChooseDocument!=undefined?this.rowSelection:this.props.rowSelect}
					scroll={this.props.noscroll ? { y: undefined, x: undefined } : { y: window.innerHeight, x: window.innerWidth }}
					// style={{ height: '600px' }}
					loading={!isLoadDone}
					rowClassName={(record, index) => (doIdSelected == record.do_id) ? "bg-click" : "bg-white"}
					rowKey={record => record.do_id}
					onChange={(a, b, sort: SorterResult<DocumentDto> | SorterResult<DocumentDto>[]) => {
						if (!!this.props.changeColumnSort) {
							this.props.changeColumnSort(sort);
						}
					}}
					size={'middle'}
					bordered={true}
					locale={{ "emptyText": L('NoData') }}
					columns={listColumnDisplay}
					dataSource={(doccumentListResult !== undefined) ? doccumentListResult : []}
					pagination={pagination}
				/>

			)
		}
	}