import * as React from 'react';
import { Button, Table, Avatar, Row, Popover, } from 'antd';
import { CaretDownOutlined, DeleteFilled, EditOutlined, EyeOutlined, PrinterOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import { CatalogingDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { EventTable } from '@src/lib/appconst';
import { TableRowSelection } from 'antd/lib/table/interface';


export interface IProps {
	actionTable?: (item: CatalogingDto, event: EventTable) => void;
	catalogingListResult: CatalogingDto[],
	pagination: TablePaginationConfig | false;
	isLoadDone?: boolean;
	noscroll?: boolean;
	onChange?: (listCataloging: CatalogingDto[]) => void;

}
export default class TableCataloging extends AppComponentBase<IProps> {
	state = {
		cata_id_selected: undefined,
		clicked: false,
		cata_id: undefined,
	};
	listCatalog: CatalogingDto[] = [];
	onAction = (item: CatalogingDto, action: EventTable) => {
		this.setState({ cata_id_selected: item.cata_id });
		const { actionTable } = this.props;
		if (actionTable !== undefined) {
			actionTable(item, action);
		}
	}
	handleVisibleChange = (visible, item: CatalogingDto) => {
		this.setState({ clicked: visible, cata_id: item.cata_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	content = (item: CatalogingDto) => (
		<div >
			<Row style={{ alignItems: "center" }}>
				<Button
					type="primary" icon={<EditOutlined />} title={L('chinh_sua')}
					style={{ marginLeft: '10px', marginTop: "5px" }}
					size='small'
					onClick={() => { this.onAction(item!, EventTable.Edit); this.hide() }}
				></Button>
				<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, EventTable.Edit); this.hide() }}>{L('chinh_sua')}</a>
			</Row>
			<Row style={{ alignItems: "center" }}>
				<Button
					type="primary" icon={<PrinterOutlined />} title={L('PrintLabel')}
					style={{ marginLeft: '10px', marginTop: "5px" }}
					size='small'
					onClick={() => { this.onAction(item!, EventTable.PrintLabel); this.hide() }}
				></Button>
				<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, EventTable.PrintLabel); this.hide() }}>{L('PrintLabel')}</a>
			</Row>
			<Row style={{ alignItems: "center" }}>
				<Button
					danger icon={<DeleteFilled />} title={L('Delete')}
					style={{ marginLeft: '10px', marginTop: "5px" }}
					size='small'
					onClick={() => { this.onAction(item!, EventTable.Delete); this.hide() }}
				></Button>
				<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onAction(item!, EventTable.Delete); this.hide() }}>{L('Delete')}</a>
			</Row>
		</div>
	)
	render() {
		const { catalogingListResult, pagination, actionTable } = this.props;
		let action: any = {
			title: "", dataIndex: '', key: 'action_author_index', fixed: 'right', className: "no-print", width: 50,
			render: (text: string, item: CatalogingDto) => (
				<Popover visible={this.state.clicked && this.state.cata_id == item.cata_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.cata_id == item.cata_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};

		const columns: ColumnsType<CatalogingDto> = [
			{ title: L('stt'), key: 'no_mar_index', width: 50, fixed: "left", render: (text: string, item: CatalogingDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('Document'), key: 'do_in_id', render: (text: string, item: CatalogingDto) => <div> {item.document != undefined ? item.document.name : ""}</div> },
			{ title: L('CodeDkcb'), key: 'do_in_id', render: (text: string, item: CatalogingDto) => <div> {item.dkcb_code}</div> },
			{ title: L('DDC'), key: 'cata_ddc', render: (text: string, item: CatalogingDto) => <div>{(item.cata_resultDDC != "" && JSON.parse(item.cata_resultDDC!)["082"] != undefined && JSON.parse(item.cata_resultDDC!)["082"].subfields != undefined && JSON.parse(item.cata_resultDDC!)["082"].subfields.find(item => "$a" in item) != undefined) ? JSON.parse(item.cata_resultDDC!)["082"].subfields.find(item => "$a" in item).$a : ""}</div> },
			{ title: L('Title'), key: 'cata_ddc', render: (text: string, item: CatalogingDto) => <div>{(item.cata_resultTitle != "" && JSON.parse(item.cata_resultTitle!)["245"] != undefined && JSON.parse(item.cata_resultTitle!)["245"].subfields != undefined && JSON.parse(item.cata_resultTitle!)["245"].subfields.find(item => "$a" in item) != undefined) ? AppConsts.titleEncode(JSON.parse(item.cata_resultTitle!)["245"].subfields.find(item => "$a" in item).$a) : ""}</div> },

		];
		if (actionTable != undefined) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<CatalogingDto> = {

			onChange: (listIdMember: React.Key[], listItem: CatalogingDto[]) => {
				this.listCatalog = listItem;
				if (!!this.props.onChange) {
					this.props.onChange(this.listCatalog)
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
				className='centerTable'
				loading={!this.props.isLoadDone}
				scroll={!!this.props.noscroll ? { x: undefined, y: undefined } : { x: window.innerWidth, y: window.innerHeight }}
				rowClassName={(record, index) => (this.state.cata_id_selected === record.cata_id) ? "bg-click" : "bg-white"}
				rowKey={record => "author_table_" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				rowSelection={actionTable != undefined ? rowSelection : undefined}
				dataSource={catalogingListResult.length > 0 ? catalogingListResult : []}
				pagination={this.props.pagination}
			/>
		)
	}
}