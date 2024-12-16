import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';
import { DeleteFilled, EditOutlined,} from '@ant-design/icons';
import { stores } from '@stores/storeInitializer';
import { PublishLogDto, ICreatePublishLogInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';

const { confirm } = Modal;

export interface IProps {
	onDoubleClickRow?: (item: PublishLogDto) => void;
	createOrUpdateModalOpen?: (item: PublishLogDto) => void;
	deletePublishLog?: (item: PublishLogDto) => void;
	publishLogListResult: PublishLogDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
}
export default class TableMainPublishLog extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
	};
	publishLogSelected: PublishLogDto = new PublishLogDto();
	onDoubleClickRow = (item: PublishLogDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	deletePublishLog = (item: PublishLogDto) => {
		if (!!this.props.deletePublishLog) {
			this.props.deletePublishLog(item);
		}
	}
	createOrUpdateModalOpen = (item: PublishLogDto) => {
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	render() {
		const { publishLogListResult, pagination, hasAction } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_publishLog_index', className: "no-print center",
			render: (text: string, item: PublishLogDto) => (
				<div >
					<Button
							type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
							style={{ marginLeft: '10px' }}
							onClick={() => this.createOrUpdateModalOpen(item!)}
						></Button>
						<Button
							danger icon={<DeleteFilled />} title={L('xoa')}
							style={{ marginLeft: '10px' }}
							onClick={() => this.deletePublishLog(item)}
						></Button>
				</div>
			)
		};
		const columns = [
			{ title: L('PublishRegisterID'),dataIndex: 'pu_re_id',  key: 'pu_re_id_table', render: (text: string, item: PublishLogDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1): (index+1)}</div>, },
			{ title: L('PublishLogNotes'), dataIndex: 'pu_lo_notes', key: 'pu_lo_notes_table', render: (text: string) => <div>{text}</div> },
			{ title: L('UserID'), dataIndex: 'us_id_created', key: 'us_id_created_table', render: (text: string) => <div>{text}</div> },
			{ title: L('PublishLogCreateAt'), dataIndex: 'pu_lo_created_at', key: 'pu_lo_created_at_table', render: (text: string) => <div>{text}</div> },

		];
		if (hasAction != undefined && hasAction === true) {
			columns.push(action);
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onDoubleClickRow(record) }
					};
				}}
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.publishLogSelected.pu_re_id == record.pu_re_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={publishLogListResult.length > 0 ? publishLogListResult:[]}
				pagination={this.props.pagination}

			/>
		)
	}
}