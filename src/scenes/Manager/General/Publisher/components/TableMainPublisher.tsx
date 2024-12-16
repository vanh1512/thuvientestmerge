import * as React from 'react';
import { Avatar, Button, Table, } from 'antd';
import { DeleteFilled, EditOutlined, } from '@ant-design/icons';
import { PublisherDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';


export interface IProps {
	onDoubleClickRow?: (item: PublisherDto) => void;
	createOrUpdateModalOpen?: (item: PublisherDto) => void;
	deletePublisher?: (item: PublisherDto) => void;
	onChange?: (listItemPublisher: PublisherDto[],listIdPublisher:number[]) => void;
	publisherListResult: PublisherDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	noscroll: boolean;
}
export default class TableMainPublisher extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
	};
	publisherSelected: PublisherDto = new PublisherDto();
	listIdPublisher: number[] = [];
	listItemPublisher:PublisherDto[]=[];

	onDoubleClickRow = (item: PublisherDto) => {
		this.publisherSelected = item;
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	deletePublisher = (item: PublisherDto) => {
		if (!!this.props.deletePublisher) {
			this.props.deletePublisher(item);
		}
	}

	createOrUpdateModalOpen = (item: PublisherDto) => {
		this.publisherSelected = item;
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	rowSelection = {
		onChange: (listIdPublisher: React.Key[], listItem: PublisherDto[]) => {
			this.listIdPublisher = listItem.length > 0 ? listItem.map(item=>item.pu_id) : [];
			this.listItemPublisher = listItem.length > 0 ? listItem : [];
			if (!!this.props.onChange) {
				this.props.onChange(this.listItemPublisher,this.listIdPublisher)
			}
		}
	}
	render() {
		const { publisherListResult, pagination, hasAction } = this.props;
		let action: ColumnGroupType<PublisherDto> = {
			title: "", children: [], key: 'action_Publisher_index', className: "no-print center", fixed: 'right', width: 100,
			render: (text: string, item: PublisherDto) => (
				<div >
					{this.isGranted(AppConsts.Permission.General_Publisher_Edit) &&
						<Button
							type="primary" icon={<EditOutlined />} title={L("Edit")}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.createOrUpdateModalOpen(item!)}
						></Button>
					}
					{this.isGranted(AppConsts.Permission.General_Publisher_Delete) &&
						<Button
							danger icon={<DeleteFilled />} title={L('Delete')}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.deletePublisher(item)}
						></Button>
					}
				</div>
			)
		};
		const columns: ColumnsType<PublisherDto> = [
			{ title: L('N.O'), fixed: 'left', key: 'no_publisher_index', width: 50, render: (text: string, item: PublisherDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('PublisherName'), key: 'pu_name', render: (text: string, item: PublisherDto) => <div>{item.pu_name}</div> },
			{ title: L('ShortNamePublisher'), key: 'pu_short_name', className: "no-print", render: (text: string, item: PublisherDto) => <div>{item.pu_short_name}</div> },
			{ title: L('PublisherAddess'), key: 'pu_address', render: (text: string, item: PublisherDto) => <div dangerouslySetInnerHTML={{ __html: item.pu_address! }}></div> },
			{ title: L('Email'), key: 'pu_email', render: (text: string, item: PublisherDto) => <div dangerouslySetInnerHTML={{ __html: item.pu_email! }}></div> },
			{ title: L('ContactPhone'), key: 'pu_phone', render: (text: string, item: PublisherDto) => <div>{item.pu_phone}</div> },
			{ title: L('Website'), key: 'pu_website', render: (text: string, item: PublisherDto) => <div style={{ overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.pu_website! }}></div> },
			{ title: L('Information'), key: 'pu_info', render: (text: string, item: PublisherDto) => <div style={{ overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.pu_infor! }}></div> },

		];
		if (hasAction != undefined && hasAction === true && this.isGranted(AppConsts.Permission.General_Publisher_Edit || AppConsts.Permission.General_Publisher_Delete)) {
			columns.push(action);
		}
		return (
			<Table
				className='centerTable'
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onDoubleClickRow(record) }
					};
				}}
				rowSelection={!!hasAction ? {
					type: 'checkbox',
					...this.rowSelection,
				} : undefined}
				scroll={this.props.noscroll ? { x: undefined } : { x: 1500 }}
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.publisherSelected.pu_id == record.pu_id) ? "bg-click" : "bg-white"}
				rowKey={"pu_id"}
				size={'small'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={publisherListResult.length > 0 ? publisherListResult : []}
				pagination={this.props.pagination}
			/>
		)
	}
}