import * as React from 'react';
import { Button, Table,} from 'antd';
import { DeleteFilled, EditOutlined,} from '@ant-design/icons';
import { PublishRegisterDto,} from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';


export interface IProps {
	onDoubleClickRow?: (item: PublishRegisterDto) => void;
	createOrUpdateModalOpen?: (item: PublishRegisterDto) => void;
	publishRegisterListResult: PublishRegisterDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
}
export default class TableMainPublishRegister extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
	};
	publishRegisterSelected: PublishRegisterDto = new PublishRegisterDto();
	onDoubleClickRow = (item: PublishRegisterDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}

	createOrUpdateModalOpen = (item: PublishRegisterDto) => {
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	render() {
		const { publishRegisterListResult, pagination, hasAction } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_publishRegister_index', className: "no-print center",
			render: (text: string, item: PublishRegisterDto) => (
				<div >
					<Button
							type="primary" icon={<EditOutlined />} title={L('Edit')}
							style={{ marginLeft: '10px' }}
							onClick={() => this.createOrUpdateModalOpen(item!)}
						></Button>
				</div>
			)
		};
		const columns = [
			{ title: L('N.O'), dataIndex: '', key: 'no_publishRegister_index', render: (text: string, item: PublishRegisterDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1): (index+1)}</div> },
			{ title: L('Month'), dataIndex: 'cpi_month', key: 'cpi_month_publishRegister_index', render: (text: string) => <div>{text}</div> },
			{ title: L('Index'), dataIndex: 'index', key: 'index_publishRegister_index', render: (text: string) => <div>{text}</div> },

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
				rowClassName={(record, index) => (this.publishRegisterSelected.pu_re_id == record.pu_re_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={publishRegisterListResult.length > 0 ? publishRegisterListResult:[]}
				pagination={this.props.pagination}

			/>
		)
	}
}