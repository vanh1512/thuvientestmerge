import * as React from 'react';
import { Button, Col, Form, Popconfirm, Row, Table, Tag, Typography, message } from 'antd';
import { CheckCircleOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined, RestOutlined } from '@ant-design/icons';
import {
	CreateDocumentInforInput, DocumentInforDto, UpdateDocumentInforInput,
} from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import { eDocumentItemStatus, valueOfeDocumentItemStatus } from '@src/lib/enumconst';
import GetNameItem from '@src/components/Manager/GetNameItem';
import { EditableCell } from '@src/scenes/Manager/Buy/Billing/BillingItem/components/TableMainBillingItem';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { EventTable } from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ItemLabel } from './PrintLabelDocumentInfor';

export interface IProps {
	actionTable?: (item: DocumentInforDto, evnet: EventTable) => void;
	onCreateDocumentInfor?: (unitData: CreateDocumentInforInput) => Promise<DocumentInforDto>;
	onEditDocumentInfor?: (unitData: UpdateDocumentInforInput) => void;
	onDeleteDocumentInfor?: (item: DocumentInforDto) => void;
	onClickDocument?: (do_id: number) => void;
	documentInforListResult: DocumentInforDto[];
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	isEditable?: boolean;
	do_id?: number;
	noscroll: boolean;
	is_printed?: boolean;
	onChange?: (listIdDocumentInfor: number[]) => void;
}
export default class TableMainDocumentInfor extends AppComponentBase<IProps> {
	private form: any = React.createRef();
	state = {
		isLoadDone: false,
		visibleModalCreateUpdate: false,
		editingKey: -1,
	};
	listIdDocumentInfor: number[] = [];
	async componentDidMount() {
		await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
		this.setState({ isLoadDone: true });
	}
	isEditing = (record: DocumentInforDto) => record.do_in_id === this.state.editingKey;

	edit = (record: Partial<DocumentInforDto> & { do_in_id: React.Key }) => {
		this.setState({ editingKey: record.do_in_id });
		this.form.current!.setFieldsValue({ ...record });
	};
	delete = (record: Partial<DocumentInforDto> & { do_in_id: React.Key }) => {
		this.form.current!.setFieldsValue({ ...record });
		this.setState({ editingKey: record.do_in_id });
	};
	cancel = () => {
		this.setState({ editingKey: -1 });
	};
	onEditDocumentInfor = async (record: DocumentInforDto) => {
		try {
			const row = (await this.form.current!.validateFields()) as DocumentInforDto;
			let unitData = new UpdateDocumentInforInput({ ...record, ...row });

			if (this.props.onEditDocumentInfor != undefined) {
				this.props.onEditDocumentInfor(unitData);
			}
			await this.setState({ editingKey: -1 });
		} catch (errInfo) {
		}
	};
	onCreateDocumentInfor = async () => {
		try {
			this.setState({ isLoadDone: false });
			await this.form.current!.resetFields();
			await this.form.current!.validateFields();
			let unitData = new CreateDocumentInforInput();

			if (this.props.onCreateDocumentInfor != undefined) {
				let result: Promise<DocumentInforDto> = this.props.onCreateDocumentInfor(unitData);
				await this.setState({ editingKey: (await result).do_in_id });
			}
			this.setState({ isLoadDone: true });
		} catch (errInfo) {
			console.log('Validate Failed:', errInfo);
		}
	};
	onDeleteDocumentInfor = async (item: DocumentInforDto) => {
		if (this.props.onDeleteDocumentInfor !== undefined) {
			this.props.onDeleteDocumentInfor(item);
		}
	};

	onClickDocument = (item: DocumentInforDto) => {
		if (!!this.props.onClickDocument) {
			this.props.onClickDocument(item.do_id);
		}
	}
	render() {
		const { pagination, is_printed } = this.props;
		const columns = [
			{
				title: L('N.O'),
				key: 'do_info_index',
				width: 50,
				render: (text: string, item: DocumentInforDto, index: number) => (
					<div>
						{pagination != false
							? pagination.pageSize! * (pagination.current! - 1) + (index + 1)
							: index + 1}
					</div>
				),
			},
			{
				title: L('CodeDkcb'),
				key: 'dkcb_code',
				render: (text: string, item: DocumentInforDto, index: number) => (
					<div>{item.dkcb_code}</div>
				),
			},
			{
				title: L('DocumentName'),
				key: 'do_id',
				render: (text: string, item: DocumentInforDto, index: number) => (
					<div>{GetNameItem.getNameDocument(item.do_id)}</div>
				),
			},
			{
				title: L('CodeIsbn'),
				dataIndex: 'do_in_isbn',
				key: 'do_in_isbn',
				editable: true,
				required: true,
			},

			{
				title: L('DocumentStatus'),
				key: 'do_in_status',
				render: (text: string, item: DocumentInforDto) => {
					if (is_printed !== undefined && is_printed) {
						return <div>{valueOfeDocumentItemStatus(item.do_in_status)}</div>
					} else {
						return <div>
							{item.do_in_status == eDocumentItemStatus.WaitingCataloging.num && <Tag color='blue'>{valueOfeDocumentItemStatus(item.do_in_status)}</Tag>}
							{item.do_in_status == eDocumentItemStatus.Borrow.num && <Tag color='yellow'>{valueOfeDocumentItemStatus(item.do_in_status)}</Tag>}
							{item.do_in_status == eDocumentItemStatus.Valid.num && <Tag color='green'>{valueOfeDocumentItemStatus(item.do_in_status)}</Tag>}
							{item.do_in_status == eDocumentItemStatus.Broken.num && <Tag color='brown'>{valueOfeDocumentItemStatus(item.do_in_status)}</Tag>}
							{item.do_in_status == eDocumentItemStatus.Lost.num && <Tag color='red'>{valueOfeDocumentItemStatus(item.do_in_status)}</Tag>}
						</div>
					}
				}
			},
			{
				title: L('Note'),
				dataIndex: 'do_in_note',
				key: 'do_in_note',
				editable: true,
				required: false,
			},

		];
		const action: any = {
			title: "",
			dataIndex: 'Action',
			fixed: 'right',
			width: 100,
			render: (_: any, record: DocumentInforDto) => {
				const editable = this.isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => this.onEditDocumentInfor(record)}
							style={{ marginRight: 8 }}
						>
							{L('Save')}
						</Typography.Link>
						<Popconfirm title={L('WantToCancel?')} onConfirm={this.cancel}>
							<a>{L('Cancel')}</a>
						</Popconfirm>
					</span>
				) : (
					<span>
						{this.isGranted(AppConsts.Permission.Document_DocumentInfor_Edit) &&
							<Typography.Link onClick={() => this.edit(record)}>
								<EditOutlined />
							</Typography.Link>
						}
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.Document_DocumentInfor_Delete) &&
							<Popconfirm title={L('WantToDelete?')} onConfirm={() => this.onDeleteDocumentInfor(record)}>
								<RestOutlined style={{ color: 'red' }} />

							</Popconfirm>
						}

					</span>
				);
			},
		};

		if (this.props.hasAction) {
			columns.push(action);
		}
		const mergedColumns = columns.map((col) => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: (record: DocumentInforDto) => ({
					record,
					inputType: col.dataIndex === 'do_in_isbn' ? 'text' : 'note',
					dataIndex: col.dataIndex,
					required: col.required,
					title: col.title,
					editing: this.isEditing(record),
				}),
			};
		});
		const rowSelection: TableRowSelection<DocumentInforDto> = {

			onChange: (listIdDocumentInfor: React.Key[], listItem: DocumentInforDto[]) => {
				this.listIdDocumentInfor = listItem.length > 0 ? listItem.map(item => item.do_in_id) : [];
				if (!!this.props.onChange) {
					this.props.onChange(this.listIdDocumentInfor)
				}
			}
		}
		return (
			<Form ref={this.form} component={false}>
				<Table className='centerTable'
					components={{
						body: {
							cell: this.props.isEditable ? EditableCell : undefined,
						},
					}}
					onRow={(record, rowIndex) => {
						return {
							onDoubleClick: (event: any) => {
								this.edit(record);
							},
							// 
						};
					}}
					scroll={this.props.noscroll ? { y: undefined, x: undefined } : { y: 1000, x: 1000 }}
					rowClassName={(record, index) =>
						this.state.editingKey == record.do_in_id ? 'bg-click' : 'bg-white'
					}
					rowSelection={!!this.props.hasAction ? rowSelection : undefined}
					rowKey={(record) => 'quanlyhocvien_index__' + JSON.stringify(record)}
					size={'middle'}
					bordered={true}
					locale={{ emptyText: L('khong_co_du_lieu') }}
					columns={mergedColumns}
					dataSource={[...this.props.documentInforListResult]}
					pagination={this.props.pagination}

				/>
			</Form>
		);
	}
}
