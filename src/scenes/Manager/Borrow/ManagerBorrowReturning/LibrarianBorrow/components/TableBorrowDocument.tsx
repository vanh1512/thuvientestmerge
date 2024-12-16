import * as React from 'react';
import { Table, } from 'antd';
import { DocumentBorrowDto, DocumentDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import { stores } from '@src/stores/storeInitializer';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import { SorterResult } from 'antd/lib/table/interface';


export interface IProps {
	pagination: TablePaginationConfig | false;
	listColumnDisplay: ColumnsDisplayType<DocumentBorrowDto>;
	doccumentListResult: DocumentBorrowDto[];
	changeColumnSort?: (fieldSort: SorterResult<DocumentBorrowDto> | SorterResult<DocumentBorrowDto>[]) => void;
	is_printed: boolean;
}
export default class TableBorrowDocument extends React.Component<IProps> {
	state = {
		isLoadDone: true,
	};
	doccumentSelected: DocumentBorrowDto = new DocumentBorrowDto();

	render() {
		const { doccumentListResult, listColumnDisplay } = this.props;
		return (
			<Table className='centerTable'
				scroll={this.props.is_printed ? { x: undefined, y: undefined } : { x: 1500, y: 1500 }}
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.doccumentSelected.do_id == record.do_id) ? "bg-click" : "bg-white"}
				rowKey={record => "tbbr_index__" + JSON.stringify(record)}
				size={'small'}
				onChange={(a, b, sort: SorterResult<DocumentBorrowDto> | SorterResult<DocumentBorrowDto>[]) => {
					if (!!this.props.changeColumnSort) {
						this.props.changeColumnSort(sort);
					}
				}}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				columns={listColumnDisplay}
				dataSource={(doccumentListResult !== undefined) ? doccumentListResult : []}
				pagination={this.props.pagination}
			/>
		)
	}
}