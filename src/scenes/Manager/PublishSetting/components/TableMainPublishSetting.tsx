import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, Modal, message, } from 'antd';
import { DeleteFilled, EditOutlined,} from '@ant-design/icons';
import { stores } from '@stores/storeInitializer';
import { PublishSettingDto, ICreatePublishSettingInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';

const { confirm } = Modal;

export interface IProps {
	onDoubleClickRow?: (item: PublishSettingDto) => void;
	createOrUpdateModalOpen?: (item: PublishSettingDto) => void;
	deletePublisher?: (item: PublishSettingDto) => void;
	publishSettingListResult: PublishSettingDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
}
export default class TableMainPublishSetting extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
	};
	publishSettingSelected: PublishSettingDto = new PublishSettingDto();
	onDoubleClickRow = (item: PublishSettingDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	deletePublisher = (item: PublishSettingDto) => {
		if (!!this.props.deletePublisher) {
			this.props.deletePublisher(item);
		}
	}
	createOrUpdateModalOpen = (item: PublishSettingDto) => {
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	render() {
		const { publishSettingListResult, pagination, hasAction } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_publishSetting_index', className: "no-print center",
			render: (text: string, item: PublishSettingDto) => (
				<div >
					<Button
							type="primary" icon={<EditOutlined />} title={L('Edit')}
							style={{ marginLeft: '10px' }}
							onClick={() => this.createOrUpdateModalOpen(item!)}
						></Button>
						<Button
							danger icon={<DeleteFilled />} title={L('xoa')}
							style={{ marginLeft: '10px' }}
							onClick={() => this.deletePublisher(item)}
						></Button>
				</div>
			)
		};
		const columns = [
			{ title: L('CategoryID'), dataIndex: 'ca_id', key: 'ca_id_publishSetting_index', render: (text: string, item: PublishSettingDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1): (index+1)}</div> },
			{ title: L('PublishSettingNotes'), dataIndex: 'pu_se_note', key: 'pu_se_note_publishSetting_index', render: (text: string) => <div>{text}</div> },
			{ title: L('PublishSettingType'), dataIndex: 'pu_se_type', key: 'pu_se_type_publishSetting_index', render: (text: string) => <div>{text}</div> },

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
				rowClassName={(record, index) => (this.publishSettingSelected.ca_id == record.ca_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={publishSettingListResult.length > 0 ? publishSettingListResult:[]}
				pagination={this.props.pagination}

			/>
		)
	}
}