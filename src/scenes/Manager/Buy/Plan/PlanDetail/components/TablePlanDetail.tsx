import * as React from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Row, Table, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, RestOutlined, } from '@ant-design/icons';
import { CreatePlanDetailInput, ItemDocument, ItemSupplier, PlanDetailDto, PlanDetailStatusBook, PlanDetailType, UpdatePlanDetailInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import AppConsts, { EventTable } from '@src/lib/appconst';
import { ePlanDetailStatusBook, ePlanDetailType, valueOfPlanDetailStatus, valueOfePlanDetailStatusBook, valueOfePlanDetailType } from '@src/lib/enumconst';
import { stores } from '@src/stores/storeInitializer';
import SelectedDocument from '@src/components/Manager/SelectedDocument';
import SelectedSupplier from '@src/components/Manager/SelectedSupplier';
import SelectEnum from '@src/components/Manager/SelectEnum';



export interface IProps {
	actionTable?: (item: PlanDetailDto, event: EventTable) => void;
	planDetailListResult?: PlanDetailDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	isLoadDone?: boolean;
	isPrint?: boolean;
	planId?: number;
	onCreateOrSucces?: () => void;
	onCancel?: () => void;

}

export default class TablePlanDetail extends React.Component<IProps> {
	private form: any = React.createRef();
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		planDetailSelected: undefined,
	};
	onCreateOrSucces = () => {
		if (!!this.props.onCreateOrSucces) {
			this.props.onCreateOrSucces();
		}
	}
	onAction = (item: PlanDetailDto, event: EventTable) => {
		if (!!this.props.actionTable) {
			this.props.actionTable(item, event)
		}
	}
	render() {
		const { planDetailListResult, pagination, hasAction } = this.props;
		const action: any = {
			title: "",
			dataIndex: 'Action',
			width: 100,
			fixed: 'right',
			render: (text: string, item: PlanDetailDto,) =>
				<div>
					<Button type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, EventTable.Edit); }}></Button>
					<Button danger
						type="primary" icon={<DeleteOutlined />} title={L('xoa')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, EventTable.Delete); }}></Button>
				</div>
		};
		const columns = [
			{ title: L('N.O'), width: 50, key: 'no_languages_index', render: (text: string, item: PlanDetailDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('TitleDocument'), key: 'do_id', render: (text: string, item: PlanDetailDto, index: number) => <div>{item.do_id.name}</div> },
			{ title: L('Quantity'), width: 70, key: 'pl_de_quantity', render: (text: string, item: PlanDetailDto, index: number) => <div>{AppConsts.formatNumber(item.pl_de_quantity)}</div> },
			{ title: L('Price'), key: 'pl_de_price', render: (text: string, item: PlanDetailDto, index: number) => <div>{AppConsts.formatNumber(item.pl_de_price)} VNĐ</div> },
			{ title: L('StatusDocument'), key: 'pl_de_status_book', render: (text: string, item: PlanDetailDto, index: number) => <div>{valueOfPlanDetailStatus(item.pl_de_status)}</div> },
			{ title: L('TypeDocument'), key: 'pl_de_type', render: (text: string, item: PlanDetailDto, index: number) => <div>{valueOfePlanDetailStatusBook(item.pl_de_status_book)}</div> },
			{ title: L('Note'), key: 'pl_de_note', render: (text: string, item: PlanDetailDto, index: number) => <div dangerouslySetInnerHTML={{ __html: item.pl_de_note! }}></div> },

		];
		if (hasAction != undefined && hasAction === true) {
			columns.push(action);
		}
		return (
			<Table
				className='centerTable'
				loading={!this.props.isLoadDone}
				rowClassName={(record, index) => (this.state.planDetailSelected == record.pl_de_id) ? "bg-click" : "bg-white"}
				scroll={!this.props.isPrint ? { y: 400, x: 1000 } : { y: undefined, x: undefined }}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				columns={columns}
				dataSource={(planDetailListResult != undefined && planDetailListResult.length > 0) ? planDetailListResult : []}
				pagination={pagination}
			// style={{ width: '100%' }}
			/>
		)
	}
}