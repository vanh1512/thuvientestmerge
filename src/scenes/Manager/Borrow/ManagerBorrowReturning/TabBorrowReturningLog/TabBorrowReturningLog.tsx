import * as React from 'react';
import { Col, Row, Button, message, Select, DatePicker, AutoComplete, Timeline, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { BorrowReturningLogDto, ItemUser } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import ModalExportBorrowReturningLog from '../../BorrowReturningLog/ModalExportBorrowReturningLog';
import { eMemberRegisterStatus, eUserType, valueOfeBorrowReturnLogType, eBorrowReturnLogType } from '@src/lib/enumconst';
import moment, { Moment } from 'moment';
import SelectUser from '@src/components/Manager/SelectUser';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import SelectEnum from '@src/components/Manager/SelectEnum';

const { Option } = Select || AutoComplete;
export default class BorrowReturningLog extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelBorrowReturningLog: false,
		skipCount: undefined,
		currentPage: 1,
		pageSize: undefined,
		do_id: undefined,
		us_id_borrow: undefined,
		br_re_start_at: undefined,
		br_re_end_at: undefined,
		br_re_lo_type: undefined,
		resultMemberAutoComplete: [],
		resultDocumentAutoComplete: []
	};
	borrowReLoSelected: BorrowReturningLogDto = new BorrowReturningLogDto();

	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.borrowReturningLogStore.getAll(
			this.state.us_id_borrow,
			this.state.br_re_start_at,
			this.state.br_re_lo_type,
			this.state.skipCount,
			this.state.pageSize
		);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelBorrowReturningLog: false });

	}

	handleSubmitSearch = async () => this.getAll();

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

	onChangeDatePickerStart(date: Moment | null | undefined) {
		if (date == null) {
			date = undefined;
		}
		this.setState({ br_re_start_at: date });
	}

	onChangeDatePickerEnd(date: any) {
		if (!date) {
			this.setState({ br_re_lo_type: undefined });
		} else {
			let end_at = new Date(date);
			this.setState({ br_re_lo_type: end_at });
		}
	}

	getAllMember = async (keyword: string) => {
		return await stores.memberStore.getAll(keyword, eMemberRegisterStatus.ACCEPTED.num, undefined, undefined, 0, 10);
	}
	handleSearchMemberAutoComplete = async (value) => {
		let result;
		if (!value || value.indexOf('@') >= 0) {
			result = [];
		} else {
			const listMember = await this.getAllMember(value);
			result = listMember.map(member => ({
				member,
				label: `${value}@${member.me_name}`,
			}));
		}
		this.setState({ resultMemberAutoComplete: result });
	};
	handleChangeMemberAutoComplete = async (value) => {
		if (!!value) {
			const result = value.split(".");
			this.setState({ us_id_borrow: Number(result[0]) });
		}
	};
	formatTextAutoComplate = (id: number, name: string, code: string) => {
		name = name.replace(".", " ");
		code = code.replace(".", " ");
		return id + ". " + name + "(" + code + ")";
	}
	getAllDocument = async (keyword) => {
		// return await stores.borrowReturningStore.getAllDocumentToBorrow(keyword, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 0, 10);
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
			us_id_borrow: undefined,
			br_re_start_at: undefined,
		});
		this.getAll();
	};


	render() {

		const self = this;

		const dateFormat = 'DD/MM/YYYY';
		let action_color;

		const { borrowReturningLogListResult } = stores.borrowReturningLogStore;

		const childrenDocumentAutoComplete = this.state.resultDocumentAutoComplete != undefined && this.state.resultDocumentAutoComplete.map(
			(item: any) =>
				<Option
					key={Math.random() + "_" + item.document.do_id}
					value={this.formatTextAutoComplate(item.document.do_id, item.document.do_title, item.document.dkcb_code)}
				>
					{this.formatTextAutoComplate(item.document.do_id, item.document.do_title, item.document.dkcb_code)}
				</Option>
		);

		return (
			<>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)}>
						<strong style={{ width: "30%" }}>{L("Member")}:</strong>
						<SelectUser role_user={eUserType.Member.num} onClear={() => this.setState({ us_id_borrow: undefined })} update={this.state.isLoadDone} userItem={!!this.state.us_id_borrow ? [ItemUser.fromJS({ id: this.state.us_id_borrow })] : undefined} mode={undefined} onChangeUser={(value) => this.setState({ us_id_borrow: value[0].id })}></SelectUser>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)}>
						<strong style={{ width: "30%" }}>{L("Status")}:</strong>
						<SelectEnum
							eNum={eBorrowReturnLogType}
							enum_value={this.state.br_re_lo_type}
							onChangeEnum={async (value: number) => {
								await this.setState({ br_re_lo_type: value })
							}}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 4, 4, 4)}>
						<strong style={{ width: "30%" }}>{L('BorrowingDate')}:</strong><br />
						<DatePicker
							style={{ width: "100%" }}
							value={this.state.br_re_start_at}
							onChange={(date: any, dateString: any) => this.onChangeDatePickerStart(date)}
							format={dateFormat}
							placeholder={L("Select")}
							disabledDate={(current) => current ? current >= moment().endOf('day') : false}

						/>
					</Col>
					<Col {...cssColResponsiveSpan(12, 12, 4, 4, 4, 4)}>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(12, 12, 8, 4, 4, 4)} style={{ textAlign: "end" }}>
						{(this.state.br_re_lo_type != undefined || this.state.us_id_borrow != undefined || this.state.br_re_start_at != undefined) &&
							<Button title={L('ClearSearch')} danger icon={<DeleteOutlined />} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					{this.isGranted(AppConsts.Permission.Borrow_BorrowReturing_Export) &&
						<Col {...cssColResponsiveSpan(24, 12, 24, 3, 4, 4)} style={{ textAlign: "end" }}>
							<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelBorrowReturningLog: true })}>{L('ExportData')}</Button>
						</Col>
					}
				</Row>
				<Row>

					<Col span={24} style={{ overflowY: "hidden", overflowX: 'hidden' }}>
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
									<p><b>{L('Borrower')}: </b>{stores.sessionStore.getUserNameById(item.us_id_borrow)}</p>
									<p><b>{L('Executor')}: </b>{stores.sessionStore.getUserNameById(item.us_id_created)}</p>
									<p><b>{item.br_re_lo_desc}</b></p>
									<p><b>{L('Time')}: </b>{moment(item.br_re_lo_created_at).format("HH:mm:ss DD/MM/YYYY")}</p>
								</Timeline.Item>
							})}
						</Timeline>
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