
import { CloseOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@src/lib/abpUtility';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningIDetailDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Button, Card, Col, Row } from 'antd';
import Table, { TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import * as React from 'react';

export interface IProps {
	pagination: TablePaginationConfig | false;
	onCancel?: () => void;
	detail_borrow: BorrowReturningDetailsWithListDocumentDto;
}
export default class DetailMemberManagerBorrowReturning extends AppComponentBase<IProps>{
	state = {
		isLoadDone: false,
	}
	render() {
		const { detail_borrow } = this.props;
		const columns = [
			{ title: L('stt'), key: 'code_borrow', render: (text: string, item: BorrowReturningIDetailDto, index: number) => <div>{index + 1}</div> },
			{ title: L('DocumentName'), key: 'title_borrowReturning_cancel', render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.do_title}</div> },
			{ title: L('CodeDkcb'), key: 'borrowReturning_dkcb', render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.documentInfor != undefined && item.documentInfor.dkcb_code}</div> },
			{ title: L('BorrowingDate'), key: 'date_borrow', render: (text: string, item: BorrowReturningIDetailDto) => <div>{moment(item.document.do_created_at).format("DD/MM/YYYY")}</div> },
			{ title: L('Author'), key: 'au_borrow', render: (text: string, item: BorrowReturningIDetailDto) => <div>{stores.sessionStore.getNameAuthor(item.document.au_id_arr)}</div> },
			{ title: L('Publisher'), key: 'pu_borrow', render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.pu_id.name}</div> },
			{ title: L('NumberOfBorrowedDocument'), key: 'num_borrow', render: (text: string, item: BorrowReturningIDetailDto) => <div>{1}</div> },

		];
		return (
			<>
				<Row>
					<Col span={12} style={{ textAlign: 'left', marginBottom: '10px' }}>
						<h2>{L('PersonalDocumentBorrowingInformation')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={this.props.onCancel}>{L('Cancel')}</Button>
					</Col>
				</Row>
				<Table
					className='centerTable'
					rowKey={record => Math.random() + "_" + record.br_re_id}
					size={'middle'}
					bordered={true}
					locale={{ "emptyText": L('NoData') }}
					columns={columns}
					dataSource={detail_borrow.list_borrow!.length > 0 ? detail_borrow.list_borrow : []}
					pagination={false}

				></Table>
			</>
		)
	}
}