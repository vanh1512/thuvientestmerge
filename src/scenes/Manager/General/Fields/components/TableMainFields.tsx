import * as React from 'react';
import { Button, Table, } from 'antd';
import { DeleteFilled, EditOutlined, MenuOutlined, } from '@ant-design/icons';
import { FieldsDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppConsts, { EventTable } from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { TableRowSelection } from 'antd/lib/table/interface';
import { SortableContainer, SortableContainerProps, SortableElement, SortableHandle, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';


export interface IProps {
	actionTable?: (item: FieldsDto, event: EventTable) => void;
	onDoubleClickRow?: (item: FieldsDto) => void;
	onCreateUpdateSuccess?: () => void;
	createOrUpdateModalOpen?: (item: FieldsDto) => void;
	deleteFields?: (item: FieldsDto) => void;
	onChangePosition?: (input: FieldsDto[]) => void;
	fieldsListResult: FieldsDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	onChangeSelect?: (listItemField: FieldsDto[], listIdField: number[]) => void;
	isPrint?: boolean;
	isLoadTable?: boolean;
	isLoadDone?: boolean;
}

const DragHandle = SortableHandle(() => <MenuOutlined title={L('keo_tha_de_thay_doi')} style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
	<tr {...props} />
));
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
	<tbody {...props} />
));

export default class TableMainFields extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		fie_id_selected: undefined,
		lengthList: false,
	};
	fieldsSelected: FieldsDto = new FieldsDto();
	dataSource: FieldsDto[] = []

	async componentDidMount() {
		this.dataSource = [...this.props.fieldsListResult];
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.fieldsListResult.length !== prevState.lengthList) {
			return ({ lengthList: nextProps.fieldsListResult.length });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.lengthList !== prevState.lengthList || prevProps.isLoadTable !== this.props.isLoadTable) {
			this.dataSource = [...this.props.fieldsListResult];
			this.setState({ isLoadDone: !this.state.isLoadDone });
		}
	}
	onDoubleClickRow = (item: FieldsDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	deleteFields = (item: FieldsDto) => {
		if (!!this.props.deleteFields) {
			this.props.deleteFields(item);
		}
	}
	createOrUpdateModalOpen = (item: FieldsDto) => {
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess();
		}
	}

	onAction = (item: FieldsDto, action: EventTable) => {
		this.setState({ fie_id_selected: item.fie_id });
		const { actionTable } = this.props;
		if (actionTable !== undefined) {
			actionTable(item, action);
		}
	}

	onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable(this.dataSource.slice(), oldIndex, newIndex).filter(
				(el: FieldsDto) => !!el,
			);
			this.dataSource = newData;
			this.setState({ isLoadDone: !this.state.isLoadDone });
			if (this.props.onChangePosition != undefined) {
				this.props.onChangePosition(this.dataSource);
			}
		}
	};

	render() {
		const { fieldsListResult, pagination, hasAction } = this.props;
		const DraggableContainer = (props: SortableContainerProps) => (
			<SortableBody
				useDragHandle
				disableAutoscroll
				helperClass="row-dragging"
				onSortEnd={this.onSortEnd}
				{...props}
			/>
		);

		const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
			const index = this.dataSource.findIndex((x: FieldsDto, index: number) => x.fie_id === restProps['data-row-key']);
			return <SortableItem index={index} {...restProps} />;
		};

		let action = {
			title: "", dataIndex: '', key: 'action_Fields_index', className: "no-print center",
			render: (text: string, item: FieldsDto, index: number) => (
				<div >
					{this.isGranted(AppConsts.Permission.General_Fields_Edit) &&
						<Button
							type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.onAction(item!, EventTable.Edit)}
						></Button>
					}
					{this.isGranted(AppConsts.Permission.General_Fields_Delete) &&
						<Button
							danger icon={<DeleteFilled />} title={L("Delete")}
							style={{ marginLeft: '10px' }}
							size='small'
							onClick={() => this.deleteFields(item)}
						></Button>
					}
				</div>
			)
		};

		let dnd = {
			title: L('Sort'),
			dataIndex: 'sort',
			width: 70,
			className: 'drag-visible no-print',
			render: () => <div>
				{this.props.isPrint ? "" :
					<DragHandle />
				}
			</div>
		}

		const columns: ColumnsType<FieldsDto> = [
			{ title: L('N.O'), width: 50, dataIndex: '', key: 'no_fields_index', render: (text: string, item: FieldsDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div> },
			{ title: L('FieldName'), dataIndex: 'fie_name', key: 'name_fields_index', render: (text: string, item: FieldsDto) => <div style={{ textAlign:"justify" }}>{item.fie_name}</div> },
			{ title: L('ma'), dataIndex: 'fie_code', key: 'code_fields_index', render: (text: string, item: FieldsDto) => <div>{item.fie_code}</div> },
			{ title: L('Description'), dataIndex: 'fie_desc', key: 'desc_fields_index', render: (text: string, item: FieldsDto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere", textAlign:"justify" }} dangerouslySetInnerHTML={{ __html: item.fie_desc! }}></div> },
		];
		if (hasAction != undefined && hasAction === true && this.isGranted(AppConsts.Permission.General_Fields_Edit || AppConsts.Permission.General_Fields_Delete)) {
			columns.push(action);
			columns.push(dnd);
		}
		const rowSelection: TableRowSelection<FieldsDto> = {

			onChange: (listKeyField: React.Key[], listItemFied: FieldsDto[]) => {
				let listIdFields = listItemFied.length > 0 ? listItemFied.map(item => item.fie_id) : [];


				if (!!this.props.onChangeSelect) {
					this.props.onChangeSelect(listItemFied, listIdFields)
				}
			}
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { this.onAction(record!, EventTable.RowDoubleClick) }
					};
				}}
				rowSelection={!!this.props.actionTable ? rowSelection : undefined}
				className='centerTable'
				// loading={!this.props.isLoadDone}
				rowKey={"fie_id"}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={[...this.dataSource]}
				pagination={this.props.pagination}
				components={{
					body: {
						wrapper: DraggableContainer,
						row: DraggableBodyRow,
					},
				}}
			/>
		)
	}
}