import * as React from 'react';
import { Button, Form, Popconfirm, Table, Typography, } from 'antd';
import { EditOutlined, RestOutlined, } from '@ant-design/icons';
import { CheckItemDto, DocumentDto, UpdateCheckItemInput, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import GetNameItem from '@src/components/Manager/GetNameItem';
import { EditableCell } from '@src/scenes/Manager/Buy/Billing/BillingItem/components/TableMainBillingItem';

export interface IProps {
	onDoubleClickRow?: (item: CheckItemDto) => void;
	onEditBillingItem?: (item: UpdateCheckItemInput) => void;
	onDeleteBillingItem?: (item: CheckItemDto) => void;
	checkItemListResult: CheckItemDto[],
	documentListResult: DocumentDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
}

export default class TableMaincheckItem extends React.Component<IProps> {
	private form: any = React.createRef();
	state = {
		isLoadDone: false,
		editingKey: -1,
	};
	async componentDidMount() {
		this.setState({ isLoadDone: true });
	}
	
	onDoubleClickRow = (item: CheckItemDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	isEditing = (record: CheckItemDto) => record.ck_it_id === this.state.editingKey;

	edit = (record: Partial<CheckItemDto> & { ck_it_id: React.Key }) => {
		this.form.current!.setFieldsValue({ ...record });
		this.setState({ editingKey: record.ck_it_id });
	};
	delete = (record: Partial<CheckItemDto> & { ck_it_id: React.Key }) => {
		this.form.current!.setFieldsValue({ ...record });
		this.setState({ editingKey: record.ck_it_id });
	};
	cancel = () => {
		this.setState({ editingKey: -1 });
	};
	onEditBillingItem = async (record: CheckItemDto) => {
		try {
			const row = (await this.form.current!.validateFields()) as CheckItemDto;
			let unitData = new UpdateCheckItemInput({ ...record, ...row });
			if (this.props.onEditBillingItem != undefined) {
				this.props.onEditBillingItem(unitData)
			}
			await this.setState({ editingKey: -1 });
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};
	onDeleteBillingItem = async (item: CheckItemDto) => {
		if (this.props.onDeleteBillingItem != undefined) {
			this.props.onDeleteBillingItem(item)
		}
		await this.setState({ isLoadDone: !this.state.isLoadDone });
	};
	render() {
		const { pagination, hasAction } = this.props;
		let action = {
			title: "",
			key: 'action',
			dataIndex: '',
			render: (_: any, record: CheckItemDto) => {
				const editable = this.isEditing(record);
				return editable ? (
					<span>
						<Typography.Link onClick={() => this.onEditBillingItem(record)} style={{ marginRight: 8 }}>
							{L("Save")}
						</Typography.Link>
						<Popconfirm title={L("WantCancel") + "?"} onConfirm={this.cancel}>
							<a>{L("Cancel")}</a>
						</Popconfirm>
					</span>
				) : (
					<>
						<Typography.Link onClick={() => this.edit(record)}>
							<EditOutlined />
						</Typography.Link>
						&nbsp;&nbsp;
						<Popconfirm title={L("WantDelete") + "?"} onConfirm={() => this.onDeleteBillingItem(record)}>
							<RestOutlined style={{ color: 'red' }} />
						</Popconfirm>
					</>
				);
			},
		};
		const columns = [
			{ title: L('N.O'), dataIndex: '', key: 'no_checkItem_index', render: (text: string, item: CheckItemDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('Document'), key: 'do_id', dataIndex: 'do_id', render: (text: string, item: CheckItemDto) => <div>{item.do_id.name}</div> },
			{ title: L('Note'), key: 'ck_it_note', dataIndex: 'ck_it_note', editable: true, required: false },
		];
		if (hasAction != undefined && hasAction === true) {
			columns.push(action);
		}
		const mergedColumns = columns.map(col => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: (record: CheckItemDto) => ({
					record,
					inputType: col.dataIndex === 'bi_it_cost' ? 'number' : 'text',
					dataIndex: col.dataIndex,
					required: col.required,
					title: col.title,
					editing: this.isEditing(record),
				}),
			};
		});
		return (
			<Form ref={this.form} component={false}>
				<Table
					className="centerTable"
					rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					rowClassName={(record, index) => (this.state.editingKey == record.ck_it_id) ? "bg-click" : "bg-white"}
					size={'small'}
					bordered={true}
					locale={{ "emptyText": L('khong_co_du_lieu') }}
					columns={mergedColumns}
					dataSource={[...this.props.checkItemListResult]}
					pagination={this.props.pagination}

				/>
			</Form>
		)
	}
}