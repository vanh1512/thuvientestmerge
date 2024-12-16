import * as React from 'react';
import { InputNumber, Table, } from 'antd';
import { BillingItemDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType } from 'antd/lib/table';
import AppConsts from '@src/lib/appconst';

export interface IProps {
	billingItemListDisplay: BillingItemDto[];
}
export default class TableMainCreate extends React.Component<IProps> {
	state = {
		isLoadDone: false,
		lengthList: -1,
	};
	async componentDidMount() {
		this.setState({ isLoadDone: true });
	}
	render() {
		const columns: ColumnsType<BillingItemDto> = [
			{ title: L('N.O'), width: 50, key: 'no_receipt_index_create', render: (text: string, item: BillingItemDto, index: number) => <div>{index + 1}</div> },
			{ title: L('TitleDocuemnt'), key: 'rec_code_create', render: (text: string, item: BillingItemDto) => <div>{item.bi_it_name}</div> },
			{ title: L('ReceiptPrice'), key: 'rec_price_create', render: (text: string, item: BillingItemDto) => <div>{AppConsts.formatNumber(item.bi_it_cost)}</div> },
			{ title: L('ReceiptQuantity'), key: 'co_quantity_create', render: (text: string, item: BillingItemDto) => <div>{AppConsts.formatNumber(item.bi_it_amount)}</div> },
		];
		return (
			<Table
				className='centerTable'
				rowKey={record => "tablemmaincreate_index__" + JSON.stringify(record)}
				size={'small'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={[...this.props.billingItemListDisplay]}
				pagination={false}
			/>
		)
	}
}