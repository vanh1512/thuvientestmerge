import * as React from 'react';
import { Button, Table, Row, Popover, Avatar, } from 'antd';
import { CaretDownOutlined, DeleteFilled, EditOutlined, EyeOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import { AuthorDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { EventTable } from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';


export interface IProps {
	actionTable?: (item: AuthorDto, event: EventTable) => void;
	authorListResult: AuthorDto[],
	pagination: TablePaginationConfig | false;
	isLoadDone?: boolean;
	noscroll?: boolean;
	onChange?: (listItemAuthor: AuthorDto[], listIdAuthor: number[]) => void;
}
export default class TableAuthor extends AppComponentBase<IProps> {
	state = {
		au_id_selected: undefined,
		clicked: false,
		au_id: undefined,
	};
	onAction = (item: AuthorDto, action: EventTable) => {
		this.setState({ au_id_selected: item.au_id });
		const { actionTable } = this.props;
		if (actionTable !== undefined) {
			actionTable(item, action);
		}
	}
	handleVisibleChange = (visible, item: AuthorDto) => {
		this.setState({ clicked: visible, au_id: item.au_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	content = (item: AuthorDto) => (
		<div >
			{this.isGranted(AppConsts.Permission.General_Author_Detail) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EyeOutlined />}
						title={L('xem_thong_tin')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size="small"
						onClick={() => { this.onAction(item!, EventTable.View); this.hide() }}
					/>
					<a title={L('xem_thong_tin')} style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, EventTable.View); this.hide() }}>{L("xem_thong_tin")}</a>
				</Row>)
			}
			{this.isGranted(AppConsts.Permission.General_Author_Edit) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, EventTable.Edit); this.hide() }}
					></Button>
					<a title={L('chinh_sua')} style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, EventTable.Edit); this.hide() }}>{L("chinh_sua")}</a>
				</Row>)
			}
			{this.isGranted(AppConsts.Permission.General_Author_Delete) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, EventTable.Delete); this.hide() }}
					></Button>
					<a title={L('Delete')} style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onAction(item!, EventTable.Delete); this.hide() }}>{L("Delete")}</a>
				</Row>)
			}
		</div>
	)
	render() {
		const { authorListResult, pagination, actionTable } = this.props;
		let action: any = {
			title: L(''), dataIndex: '', key: 'action_author_index', className: "no-print", fixed: 'right', width: 50,
			render: (text: string, item: AuthorDto) => (
				<Popover visible={this.state.clicked && this.state.au_id == item.au_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.au_id == item.au_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};

		const columns: ColumnsType<AuthorDto> = [
			{ title: L('stt'), key: 'no_author_index', width: 50, fixed: "left", render: (text: string, item: AuthorDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },

			...(actionTable != undefined ?
				[
					{
						title: L('anh_dai_dien'),
						key: 'fi_id_author_index',
						render: (text: string, item: AuthorDto, index: number) => (
							<div style={{ textAlign: 'center' }}>
								<Avatar style={{ backgroundColor: AppConsts.boDauTiengViet1(AppConsts.backGroundColorByName[item.au_name!.charAt(0).toUpperCase()]) }} size={50} src={(item.fi_id != undefined && item.fi_id.isdelete == false) ? this.getFile(item.fi_id.id) : ""}>
									{(item.fi_id.id > 0 && item.fi_id.isdelete == false) ? "" : item.au_name?.charAt(0)}
								</Avatar>
							</div>
						),
					},
				] : []
			),
			{ title: L('ma_tac_gia'), key: 'au_code_author_index', render: (text: string, item: AuthorDto) => <div>{item.au_code}</div> },
			{ title: L('ho_ten'), key: 'au_name_author_index', render: (text: string, item: AuthorDto) => <div>{item.au_name}</div> },
			{ title: L('ngay_sinh'), key: 'au_dob_author_index', render: (text: string, item: AuthorDto) => <div>{item.au_dob}</div> },
			{ title: L('dia_chi'), key: 'au_address_author_index', render: (text: string, item: AuthorDto) => <div>{item.au_address}</div> },
			{ title: L('mo_ta'), key: 'au_decs_author_index', render: (text: string, item: AuthorDto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.au_decs! }}></div> },
		];
		if (actionTable != undefined && this.isGranted(AppConsts.Permission.General_Author_Edit || AppConsts.Permission.General_Author_Delete || AppConsts.Permission.General_Author_Detail)) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<AuthorDto> = {

			onChange: (listKeyAuthor: React.Key[], listItem: AuthorDto[]) => {
				let listIdAuthor = listItem.length > 0 ? listItem.map(item => item.au_id) : [];
				if (!!this.props.onChange) {
					this.props.onChange(listItem, listIdAuthor)
				}
			}
		}
		return (
			<>
				<Table
					onRow={(record, rowIndex) => {
						return {
							onDoubleClick: (event: any) => { this.onAction(record!, EventTable.RowDoubleClick) }
						};
					}}
					rowSelection={!!actionTable ? rowSelection : undefined}
					scroll={this.props.noscroll ? { x: undefined, y: undefined } : { x: window.innerWidth, y: window.innerHeight }}
					className='centerTable'
					loading={!this.props.isLoadDone}
					rowClassName={(record, index) => (this.state.au_id_selected === record.au_id) ? "bg-click" : "bg-white"}
					rowKey={record => "author_table_" + JSON.stringify(record)}
					size={'middle'}
					bordered={true}
					locale={{ "emptyText": L('khong_co_du_lieu') }}
					columns={columns}
					dataSource={authorListResult.length > 0 ? authorListResult : []}
					pagination={this.props.pagination}

				/>

			</>
		)
	}
}