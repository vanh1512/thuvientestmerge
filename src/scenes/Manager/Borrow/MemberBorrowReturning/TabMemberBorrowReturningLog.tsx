import * as React from 'react';
import { Col, Row, Button, Card, Modal, message, Select, DatePicker, AutoComplete, Pagination, Timeline, Input, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { BorrowReturningLogDto, MemberSearchBorrowReturningLogInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { eBorrowReturnLogType, valueOfeBorrowReturnLogType } from '@src/lib/enumconst';
import moment, { Moment } from 'moment';
import DetailBorrowReturningLog from '../BorrowReturningLog/DetailBorrowReturningLog';
import ExportBorrowReturningLog from '../BorrowReturningLog/ModalExportBorrowReturningLog';
import ModalExportBorrowReturningLog from '../BorrowReturningLog/ModalExportBorrowReturningLog';
import SelectEnum from '@src/components/Manager/SelectEnum';

const { Option } = Select || AutoComplete;
export default class TabMemberBorrowReturningLog extends React.Component {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelBorrowReturningLog: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		do_id: undefined,
		me_id_borrow: undefined,
		br_re_lo_type: -1,
		resultMemberAutoComplete: [],
		resultDocumentAutoComplete: [],
		br_re_start_at: undefined,
		br_re_end_at: undefined,
	};
	borrowReLoSelected: BorrowReturningLogDto = new BorrowReturningLogDto();

	componentDidMount() {
		this.getAll();
		this.clearSearch();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		let input: MemberSearchBorrowReturningLogInput = new MemberSearchBorrowReturningLogInput();

		if (this.state.br_re_lo_type != -1) {
			input.br_re_lo_type = this.state.br_re_lo_type;
		}
		input.start_date = this.state.br_re_start_at;
		input.skipCount = this.state.skipCount;
		input.maxResultCount = this.state.pageSize;
		await stores.borrowReturningLogStore.getAllLogForUser(input);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelBorrowReturningLog: false });

	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	detailModalOpen = async (input: BorrowReturningLogDto) => {
		if (input !== undefined && input !== null) {
			this.borrowReLoSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = (value: BorrowReturningLogDto) => {
		if (value == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.borrowReLoSelected.init(value);
		this.detailModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}

	onChangeDatePickerStart = async (date: Moment | null | undefined) => {
		if (!date) {
			this.setState({ br_re_start_at: undefined });
		} else {
			this.setState({ br_re_start_at: date });
		}
	}

	onChangeDatePickerEnd(date: Moment | null | undefined) {
		if (!date) {
			this.setState({ br_re_end_at: undefined });

		} else {
			this.setState({ br_re_end_at: date });

		}
	}

	formatTextAutoComplate = (id: number, name: string, code: string) => {
		name = name.replace(".", " ");
		code = code.replace(".", " ");
		return id + ". " + name + "(" + code + ")";
	}

	handleSearchDocumentAutoComplete = async (value) => {
		let result;
		if (!value || value.indexOf('@') >= 0) {
			result = [];
		}
		this.setState({ resultDocumentAutoComplete: result });
	};
	handleChangeDocumentAutoComplete = async (value) => {
		if (!!value) {
			const result = value.split(".");
			this.setState({ do_id: Number(result[0]) });
		}
	};

	handleInputEnter = (e) => {
		if (e.keyCode === 13) {
			this.handleSubmitSearch();
		}
	}
	clearSearch = async () => {
		await this.setState({
			br_re_lo_type: undefined,
			br_re_start_at: undefined,
			br_re_end_at: undefined,
		});
	}

	render() {

		const self = this;
		const left = this.state.visibleModalCreateUpdate ? AppConsts.cssRightMain.left : AppConsts.cssPanelMain.left;
		const right = this.state.visibleModalCreateUpdate ? AppConsts.cssPanelMain.right : AppConsts.cssRightMain.right;
		const dateFormat = 'DD/MM/YYYY';

		const { borrowReturningLogListResult, totalBorrowReturningLog } = stores.borrowReturningLogStore;

		const childrenDocumentAutoComplete = this.state.resultDocumentAutoComplete !== undefined ? this.state.resultDocumentAutoComplete.map(
			(item: any) =>
				<Option
					key={Math.random() + "_" + item.document.do_id}
					value={this.formatTextAutoComplate(item.document.do_id, item.document.do_title, item.document.dkcb_code)}
				>
					{this.formatTextAutoComplate(item.document.do_id, item.document.do_title, item.document.dkcb_code)}
				</Option>
		) : "";


		let action_color;

		return (
			<>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 24, 24, 5, 4, 3)} >
						<h2>{L('DocumentBorrowingAndReturningLog')}</h2>
					</Col>
					{/* <Col {...cssColResponsiveSpan(24, 12, 8, 5, 4, 4)} >
						<strong>{L('DocumentName')}:</strong>&nbsp;&nbsp;
						<AutoComplete
							onKeyUp={(e) => this.handleInputEnter(e)}
							style={{ width: '100%' }}
							onSearch={this.handleSearchDocumentAutoComplete}
							placeholder={L("nhap_tim_kiem")}
							onChange={this.handleChangeDocumentAutoComplete}
						>
							{childrenDocumentAutoComplete}
						</AutoComplete>
					</Col> */}
					<Col {...cssColResponsiveSpan(24, 24, 24, 5, 4, 4)} >
						<strong>{L('Status')}:</strong>&nbsp;&nbsp;
						<SelectEnum eNum={eBorrowReturnLogType} enum_value={this.state.br_re_lo_type == -1 ? undefined : this.state.br_re_lo_type} onChangeEnum={async (value: number) => { await this.setState({ br_re_lo_type: value }) }} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 5, 4, 4)} >
						<strong style={{ width: "30%" }}>{L('BorrowingDate')}:</strong><br />
						<DatePicker
							style={{ width: "100%" }}
							onChange={async (date: Moment | null, dateString: string) => await this.onChangeDatePickerStart(date)}
							format={dateFormat}
							placeholder={L("Select")}
							disabledDate={(current) => current ? current >= moment().endOf('day') : false}
							value={this.state.br_re_start_at}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 5, 4, 4)} >
						<strong style={{ width: "30%" }}>{L('ReturningDate')}:</strong><br />
						<DatePicker
							style={{ width: "100%" }}
							onChange={async (date: Moment | null, dateString: string) => await this.onChangeDatePickerEnd(date)}
							format={dateFormat}
							placeholder={L("Select")}
							disabledDate={(current) => current ? current <= moment().startOf('day') : false}
							value={this.state.br_re_end_at}
						/>
					</Col>
					<Col style={{ textAlign: "center" }} {...cssColResponsiveSpan(24, 12, 8, 3, 3, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 5, 5, 3, 3, 3)} >
						{(this.state.br_re_lo_type != undefined || this.state.br_re_end_at! != undefined || this.state.br_re_start_at != undefined) &&
							<Button title={L('ClearSearch')} danger icon={<DeleteOutlined />} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col {...cssColResponsiveSpan(12, 12, 8, 5, 4, 4)} style={{ textAlign: "end" }}>
						<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelBorrowReturningLog: true })}>{L('ExportData')}</Button>
					</Col>
				</Row>
				<Row>
					<Col {...left} >
						<Card>
							{(!!borrowReturningLogListResult && borrowReturningLogListResult.length > 0) ?
								<>
									<Timeline mode="alternate" style={{ marginTop: '10px' }}>
										{borrowReturningLogListResult.map((item: BorrowReturningLogDto) => {
											switch (item.br_re_lo_type) {
												case eBorrowReturnLogType.UPDATE.num:
													action_color = "#d4b106"
													break;
												case eBorrowReturnLogType.REGISTER_BORROW.num:
													action_color = '#0050b3'
													break;
												case eBorrowReturnLogType.REGISTER_BORROW_MEMBER.num:
													action_color = '#061178'
													break;
												case eBorrowReturnLogType.APROVE.num:
													action_color = "#389e0d"
													break;
												case eBorrowReturnLogType.BORROW.num:
													action_color = "#bae637"
													break;
												case eBorrowReturnLogType.DELETE.num:
													action_color = "#a8071a"
													break;
												case eBorrowReturnLogType.DELETE_DETAIL_ITEM.num:
													action_color = "#fa541c"
													break;
												case eBorrowReturnLogType.CANCEL.num:
													action_color = "#9254de"
													break;
												case eBorrowReturnLogType.CANCEL_MEMBER.num:
													action_color = "#391085"
													break;
												case eBorrowReturnLogType.RETURN.num:
													action_color = "#13c2c2"
													break;
												case eBorrowReturnLogType.EXTEND.num:
													action_color = "#9e1068"
													break;
												case eBorrowReturnLogType.PUNISH.num:
													action_color = "#610b00"
													break;
												default:
													action_color = 'black'
													break;
											}
											return <Timeline.Item color={action_color} key={item.br_re_lo_id + "_" + Math.random()}>
												<p>{item.br_re_lo_id + "	" + valueOfeBorrowReturnLogType(item.br_re_lo_type)}</p>
												<p><b>{item.br_re_lo_desc}</b></p>
												<p><b>{L("Time")}: </b>{moment(item.br_re_lo_created_at).format("HH:mm:ss DD/MM/YYYY")}</p>
											</Timeline.Item>
										})}
									</Timeline>
									{(!!totalBorrowReturningLog && totalBorrowReturningLog > 0) &&
										<Pagination
											total={totalBorrowReturningLog}
											showSizeChanger
											showQuickJumper
											showTotal={(total) => `${L("Total")}  ${total}`}
											current={this.state.currentPage}
											pageSizeOptions={['10', '20', '50', '100']}
											onShowSizeChange={(current: number, size: number) => self.onChangePage(current, size)}
											onChange={(page: number, pagesize?: number) => self.onChangePage(page, pagesize)}
											style={{ float: "right" }}
										/>
									}
								</>

								:
								<Row justify='center'>{L('NoData')}</Row>
							}
						</Card>
					</Col>
					<Col {...right}>
						<DetailBorrowReturningLog
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							borrowReLoSelected={this.borrowReLoSelected}
						/>
					</Col>
				</Row>
				<ModalExportBorrowReturningLog
					borrowReturningLogListResult={borrowReturningLogListResult}
					visible={this.state.visibleExportExcelBorrowReturningLog}
					onCancel={() => this.setState({ visibleExportExcelBorrowReturningLog: false })}
				/>

			</>
		)
	}
}