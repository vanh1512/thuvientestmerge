import * as React from 'react';
import { Button, Table, Tag, } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteFilled, EditOutlined, SyncOutlined, } from '@ant-design/icons';
import { TopicDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { valueOfeGENDER } from '@src/lib/enumconst';
import AppConsts from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';


export interface IProps {
	onDoubleClickRow?: (item: TopicDto) => void;
	createOrUpdateModalOpen?: (item: TopicDto) => void;
	deleteTopic?: (item: TopicDto) => void;
	topicListResult: TopicDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	onChange?: (listItemTopic: TopicDto[], listIdTopic: number[]) => void;

}
export default class TableMainTopic extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,

	};
	topicSelected: TopicDto = new TopicDto();
	listIdTopic: TopicDto[] = [];
	onDoubleClickRow = (item: TopicDto) => {
		this.topicSelected = item;
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	deleteTopic = (item: TopicDto) => {
		if (!!this.props.deleteTopic) {
			this.props.deleteTopic(item);
		}
	}
	createOrUpdateModalOpen = (item: TopicDto) => {
		this.topicSelected = item;
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}
	render() {
		const { topicListResult, pagination, hasAction } = this.props;
		let action = {
			classNames: 'no-print center',
			title: "", width: 100, dataIndex: '', key: 'action_Topic_index', className: "no-print center",
			render: (text: string, item: TopicDto) => (
				<div >
					{this.isGranted(AppConsts.Permission.General_Topic_Edit) &&
						<Button
							type="primary" icon={<EditOutlined />} title={L('Edit')}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.createOrUpdateModalOpen(item!)}

						></Button>
					}
					{this.isGranted(AppConsts.Permission.General_Topic_Delete) &&
						<Button
							danger icon={<DeleteFilled />} title={L('Delete')}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.deleteTopic(item)}
						></Button>
					}
				</div>
			)
		};
		const columns: ColumnsType<TopicDto> = [
			{ title: L('N.O'), width: 50, dataIndex: '', key: 'no_topic_index', render: (text: string, item: TopicDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('TopicName'), key: 'to_name', render: (text: string, item: TopicDto) => <div>{item.to_name}</div> },
			{ title: L('TopicCode'), key: 'to_code', render: (text: string, item: TopicDto) => <div>{item.to_code}</div> },
			{
				title: L('Status'),
				key: 'toppic_status',
				width: 150,
				className: 'no-print',
				render: (text: string, item: TopicDto) => {
					return (
						<div>
							{
								item.to_is_active ? <Tag icon={<CheckCircleOutlined />} color="success">{L("kich_hoat_true")}</Tag> : <Tag icon={<CheckCircleOutlined />} color="error">{L("kich_hoat_false")}</Tag>
							}
						</div>
					);
				},
			},
			{ title: L('Description'), key: 'to_desc', render: (text: string, item: TopicDto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.to_desc! }}></div> },
		];
		if (hasAction != undefined && hasAction === true && this.isGranted(AppConsts.Permission.General_Topic_Edit || AppConsts.Permission.General_Topic_Delete)) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<TopicDto> = {
			onChange: (listKeyTopic: React.Key[], listItem: TopicDto[]) => {

				let listIdTopic = listItem.length > 0 ? listItem.map(item => item.to_id) : [];
				if (!!this.props.onChange) {
					this.props.onChange(listItem, listIdTopic)
				}
			}
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onDoubleClickRow(record) }
					};
				}}
				rowSelection={!!this.props.deleteTopic ? rowSelection : undefined}
				className="centerTable"
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.topicSelected.to_id == record.to_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={topicListResult.length > 0 ? topicListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}