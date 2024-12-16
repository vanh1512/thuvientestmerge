import * as React from 'react';
import { Button, Col, Row, Table } from 'antd';
import { BorrowReturningIDetailDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import ActionExport from '@src/components/ActionExport';
import { CloseOutlined } from '@ant-design/icons';
import { valueOfeBorrowReturningDetailStatus } from '@src/lib/enumconst';
import moment from 'moment';
import GetNameItem from '@src/components/Manager/GetNameItem';
import { TablePaginationConfig } from 'antd/lib/table';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	do_in_id_arr: number[];
	title: string;
	titleTable: string,
	onCancel: () => void;
	pagination?: TablePaginationConfig | false;
}
export default class TableBorrowDocument extends React.Component<IProps> {
	componentRef: any | null = null;

	state = {
		isLoadDone: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		isHeaderReport: false,
	};

	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		const { do_in_id_arr } = this.props;
		this.setState({ isLoadDone: false });
		await stores.borrowReturningStore.getByIdArr(do_in_id_arr, this.state.skipCount, this.state.pageSize)
		this.setState({ isLoadDone: true });
	}

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = this.props.do_in_id_arr.length;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const self = this;
		const { borrowReturningDetailDtoPageResult } = stores.borrowReturningStore;

		const columns = [
			{
				title: L('STT'),
				key: 'do_info_index',
				width: 50,
				render: (text: string, item: BorrowReturningIDetailDto, index: number) => (
					<div>
						{this.state.pageSize! * (this.state.currentPage - 1) + (index + 1)}
					</div>
				),
			},
			{
				title: L('Tên tài liệu'),
				key: 'br_re_de_id',
				render: (text: string, item: BorrowReturningIDetailDto, index: number) => (
					<div>{item.document.do_title != undefined ? item.document.do_title : ""}</div>
				),
			},
			{
				title: L('Thông tin người mượn'),
				key: 'do_title',
				render: (text: string, item: BorrowReturningIDetailDto, index: number) => (
					<div>{item.document != undefined && stores.sessionStore.getUserNameById(item.document.do_id)}</div>
				),
			},
			{
				title: L('Năm xuất bản'),
				key: 'do_publish',
				render: (text: string, item: BorrowReturningIDetailDto) => (
					<div>{item.document != undefined && item.document.do_date_publish}</div>
				),
			},
			{
				title: L('Trạng thái'),
				key: 'do_abstract',
				render: (text: string, item: BorrowReturningIDetailDto) => (
					<div>{valueOfeBorrowReturningDetailStatus(item.br_re_status)}</div>
				),
			},
			{
				title: L('Số DKCB'),
				key: 'do_',
				render: (text: string, item: BorrowReturningIDetailDto) => (
					<div>{item.documentInfor != undefined && item.documentInfor.dkcb_code}</div>
				),
			},
			{
				title: L('Ngày trả'),
				key: 'br_re_end_at',
				render: (text: string, item: BorrowReturningIDetailDto) => (
					<div>{item.br_re_end_at != undefined ? moment(item.br_re_end_at).format("DD/MM/YYYY") : "Chưa trả"}</div>
				),
			},
		];

		return (
			<>
				<Row style={{ margin: '10px 0' }}>
					<Col span={12}>

						<h3>{this.props.titleTable != "TỔNG" && this.props.titleTable != null ? this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase() : this.props.titleTable.toUpperCase() + " " + this.props.title.toUpperCase()} </h3>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>

						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							isWord={true}
							isExcel={true}
							idPrint={this.props.title}
							nameFileExport={this.props.titleTable != "TỔNG" ? this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase() : this.props.titleTable.toUpperCase() + " " + this.props.title.toUpperCase()}
							componentRef={this.componentRef}
						/>
						<Button icon={<CloseOutlined />} type="primary" style={{ margin: '0 10px' }} danger onClick={() => this.props.onCancel()}>Hủy</Button>
					</Col>
				</Row>
				<div id={this.props.title} ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}>
						<h2>{this.props.titleTable != "TỔNG" ? this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase() : this.props.titleTable.toUpperCase() + " " + this.props.title.toUpperCase()}</h2>
					</Col>
					<Table className='centerTable page-break'
						rowKey={(record) => 'table_documentinfor_index__' + JSON.stringify(record)}
						size={'small'}
						bordered={true}
						locale={{ emptyText: L('No Data') }}
						columns={columns}
						dataSource={borrowReturningDetailDtoPageResult}
						pagination={{
							className: "ant-table-pagination ant-table-pagination-right no-print ",
							pageSize: this.state.pageSize,
							total: this.props.do_in_id_arr.length,
							current: this.state.currentPage,
							showTotal: (tot) => "Tổng: " + tot + "",
							showQuickJumper: true,
							showSizeChanger: true,
							pageSizeOptions: ['10', '20', '50', '100', L("All")],
							onShowSizeChange(current: number, size: number) {
								self.onChangePage(current, size)
							},
							onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
						}}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</div>

			</>
		);
	}
}
