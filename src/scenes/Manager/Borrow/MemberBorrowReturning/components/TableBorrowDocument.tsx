import * as React from 'react';
import { Button, Modal, Row, Table, } from 'antd';
import { DocumentBorrowDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import { SorterResult } from 'antd/lib/table/interface';


export interface IProps {
	pagination: TablePaginationConfig | false;
	listColumnDisplay: ColumnsDisplayType<DocumentBorrowDto>;
	doccumentListResult: DocumentBorrowDto[],
	changeColumnSort?: (fieldSort: SorterResult<DocumentBorrowDto> | SorterResult<DocumentBorrowDto>[]) => void;
	hasAction?: boolean;
	is_printed?: boolean;

}
export default class TableBorrowDocument extends React.Component<IProps> {
	state = {
		isLoadDone: true,
	};
	render() {
		const { doccumentListResult, listColumnDisplay } = this.props;

		return (
			<Table className='centerTable'
				loading={!this.state.isLoadDone}
				rowKey={record => "tbbr_index__" + JSON.stringify(record)}
				size={'small'}
				scroll={this.props.is_printed ? { x: undefined, y: undefined } : { x: 1500, y: 1500 }}
				bordered={true}
				onChange={(a, b, sort: SorterResult<DocumentBorrowDto> | SorterResult<DocumentBorrowDto>[]) => {
					if (!!this.props.changeColumnSort) {
						this.props.changeColumnSort(sort);
					}
				}}
				locale={{ "emptyText": L('NoData') }}
				columns={listColumnDisplay}
				dataSource={(doccumentListResult !== undefined) ? doccumentListResult : []}
				pagination={this.props.pagination}
			/>
		)
	}
}