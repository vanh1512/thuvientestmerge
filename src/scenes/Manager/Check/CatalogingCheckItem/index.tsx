import * as React from 'react';
import { Col, Row, Button, Card, Input, message, Table, Radio, Slider, Tag, Badge, Tabs, Progress, Modal } from 'antd';
import { stores } from '@stores/storeInitializer';
import { DocumentInforDto, CheckItemDto, ChangeStatusDocumentInforCheckInput, GetDocumentInforByDKCBCheckDto, CheckDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CaretDownOutlined, CaretUpOutlined, CheckCircleFilled, SaveOutlined, SearchOutlined, StepBackwardOutlined } from '@ant-design/icons';
import HistoryHelper from '@src/lib/historyHelper';
import moment from 'moment';
import { MEnum, eCheckItemStatus, eCheckProcess, eDocumentItemStatus, valueOfeDocumentItemStatus } from '@src/lib/enumconst';
import GetNameItem from '@src/components/Manager/GetNameItem';
import { RouterPath } from '@src/lib/appconst';
import { Link } from 'react-router-dom';
import ModalTableCheckDocument from './components/ModalTableCheckDocument';
const { confirm } = Modal;
export default class CatalogingRecord extends React.Component {
	private inputRef: any = React.createRef();
	state = {
		isLoadDone: true,
		isChangeTable: false,
		visibleListDocumentInfor: false,
		dkcb_code: undefined,
		do_id: undefined,
		visibleInforCheck: false,
		checkUpDown: false,
		isTable: false,
		idSelected: [],
		titleTable: "",
		isntDone: true,
	};
	dicdata: { [key: number]: DocumentInforDto[] } = {};
	listDocumentInfor: DocumentInforDto[] = [];
	itemGetDocumentInforByDKCBDto: GetDocumentInforByDKCBCheckDto = new GetDocumentInforByDKCBCheckDto();
	itemCheckItemSelect: CheckItemDto = new CheckItemDto();
	checkSelected: CheckDto | undefined = new CheckDto();
	ck_id: string | null;

	async componentDidMount() {

		const query = new URLSearchParams(window.location.search);
		if (query == null) {
			HistoryHelper.back();
		}
		this.ck_id = query.get('ck_id');
		if (isNaN(Number(this.ck_id))) {
			HistoryHelper.back();
		}
		await this.getData(Number(this.ck_id));
		const { checkListResult } = stores.checkStore;
		this.checkSelected = checkListResult.find(item => item.ck_id == Number(this.ck_id));
		if (this.checkSelected != undefined && this.checkSelected.ck_process == eCheckProcess.DONE.num) {
			HistoryHelper.redirect(RouterPath.admin_check + "/check");
		}
		const { checkItemListResult } = stores.checkItemStore;

		checkItemListResult.map(item => {
			if (this.dicdata[item.do_id.id] == undefined) {
				this.setState({ isntDone: false });
			}
			//doing
			// let totalCheck = item.do_in_id_borrow!.length + item.do_in_id_valid!.length + item.do_in_id_invalid!.length + item.do_in_id_lost!.length;
			// let total = totalCheck + this.dicdata[item.do_id.id].length;
			// let value = ((totalCheck / total) * 100).toFixed(2);
			// if (parseFloat(value) != 100.00) {
			// 	this.setState({ isntDone: false });
			// }
			// console.log(12121,this.dicdata[item.do_id.id].length);

		})
	}
	getData = async (ck_id: number) => {
		this.setState({ isLoadDone: false });
		this.dicdata = {};
		await stores.checkItemStore.getAll(ck_id, undefined, undefined);
		await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
		await stores.checkStore.getAll(undefined, undefined, undefined, undefined, undefined);
		const { checkItemListResult } = stores.checkItemStore;
		if (checkItemListResult.length > 0) {
			this.itemCheckItemSelect = checkItemListResult[0];
			this.setState({ do_id: this.itemCheckItemSelect.do_id.id });
			checkItemListResult.map(async (item: CheckItemDto) => {
				this.setState({ isLoadDone: false });
				let result = await stores.documentInforStore.getAll(item.do_id.id, undefined, undefined, undefined, undefined, undefined, undefined);
				this.dicdata[item.do_id.id] = result.filter(item => item.do_in_is_check == true);
				this.setState({ isLoadDone: true });
			})
		}
		this.setState({ isLoadDone: true });
	}

	handleSearch = async () => {
		this.setState({ isLoadDone: false });
		this.itemGetDocumentInforByDKCBDto = await stores.checkStore.getDocumentInforByDKCBInCheck(Number(this.ck_id), this.state.dkcb_code);
		this.listDocumentInfor = [this.itemGetDocumentInforByDKCBDto.documentInfo];
		this.showOut(this.itemGetDocumentInforByDKCBDto.checkItemInfo);
		this.setState({ isLoadDone: true });
	}
	showOut = async (item: CheckItemDto) => {
		this.setState({ isLoadDone: false, do_id: item.do_id.id, isChangeTable: !this.state.isChangeTable });
		this.itemCheckItemSelect = item;
		this.setState({ isLoadDone: true, });
	}
	renderValueProcess = (item: CheckItemDto) => {
		const twoColors = { '0%': '#108ee9', '100%': '#87d068' };
		if (this.dicdata[item.do_id.id] == undefined) {
			return 0;
		}
		let totalCheck = item.do_in_id_borrow!.length + item.do_in_id_valid!.length + item.do_in_id_invalid!.length + item.do_in_id_lost!.length;
		let total = totalCheck + this.dicdata[item.do_id.id].length;
		let value = ((totalCheck / total) * 100).toFixed(2);
		if (item.ck_it_status === eCheckItemStatus.DONE.num || value === '100.00') {
			return <Tag icon={<CheckCircleFilled />} color="processing">{L('CheckCompleted')}</Tag>;
		}
		return <Progress percent={parseFloat(value)} strokeColor={twoColors} />


	}
	onSave = async (item: DocumentInforDto) => {
		this.setState({ isLoadDone: false });
		let input = new ChangeStatusDocumentInforCheckInput();
		input.do_in_id = item.do_in_id;
		input.ck_it_id = this.itemCheckItemSelect.ck_it_id;
		let status = item.do_in_status;
		if (valueOfeDocumentItemStatus(status) != undefined) {
			input.do_in_status = status;
			let result = await stores.documentInforStore.changeStatusDocumentInforCheck(input);
			await stores.checkItemStore.updateListCheckItem(this.itemCheckItemSelect.ck_it_id, result);

			let index = this.dicdata[this.state.do_id!].findIndex(item => item.do_in_id == result.do_in_id);
			this.dicdata[this.state.do_id!].splice(index, 1);

			result.do_in_status == eDocumentItemStatus.Valid.num && this.itemCheckItemSelect.do_in_id_valid!.push(result.do_in_id);
			result.do_in_status == eDocumentItemStatus.Borrow.num && this.itemCheckItemSelect.do_in_id_borrow!.push(result.do_in_id);
			result.do_in_status == eDocumentItemStatus.Broken.num && this.itemCheckItemSelect.do_in_id_invalid!.push(result.do_in_id);
			result.do_in_status == eDocumentItemStatus.Lost.num && this.itemCheckItemSelect.do_in_id_lost!.push(result.do_in_id);

			this.itemGetDocumentInforByDKCBDto = new GetDocumentInforByDKCBCheckDto();
			this.listDocumentInfor = [];
			this.setState({ dkcb_code: undefined });

			message.success(L("UpdateSuccessful"));
			this.setState({ isLoadDone: true });
		}
		this.onFocusInput();
	}

	onFocusInput = () => {
		this.inputRef.current.focus();
	}
	onChangeStatusCheckDone = async () => {
		let self = this;
		confirm({
			title: self.state.isntDone ? L("Xac_nhan_hoan_thanh_kiem_ke?") : L("Co_sach_chua_kiem_ke, ban_co_muon_xac_nhan_hoan_thanh_kiem_ke?"),
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				self.setState({ isLoadDone: false });
				await stores.checkStore.changeStatusDone(Number(self.ck_id));
				HistoryHelper.redirect(RouterPath.admin_check + "/check");
				message.success(L('CheckCompleted'));
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});

	}
	render() {
		const { checkItemListResult } = stores.checkItemStore;
		const { itemCheckItemSelect } = this;
		const documentInfo: DocumentInforDto = this.itemGetDocumentInforByDKCBDto.documentInfo != undefined ? this.itemGetDocumentInforByDKCBDto.documentInfo : new DocumentInforDto()
		const listDocInfoCheck: DocumentInforDto[] = this.dicdata[this.state.do_id!] != undefined ? this.dicdata[this.state.do_id!] : [];
		const resultCheck = this.checkSelected;

		let action = {
			title: "", dataIndex: '', key: 'action_planDetail_index', fixed: 'right', className: "no-print center",
			render: (text: string, item: DocumentInforDto) => (
				<div >
					<Button
						type="primary" icon={<SaveOutlined />} title={L("luu")}
						style={{ marginLeft: '10px' }}
						size='small'
						onClick={() => { this.onSave(item) }}
					></Button>
				</div>
			)
		};
		const columns = [
			{ title: L('N.O'), dataIndex: '', key: 'no_member_index', render: (text: string, item: DocumentInforDto, index: number) => <div>{index + 1}</div> },
			{ title: L('CodeDkcb'), key: 'dkcb_code', render: (text: string, item: DocumentInforDto) => <div>{item.dkcb_code}</div> },
			{ title: L('BookName'), key: 'do_id', render: (text: string, item: DocumentInforDto) => <div>{GetNameItem.getNameDocument(item.do_id)}</div> },
			{ title: L('CodeIsbn'), key: 'do_in_isbn', render: (text: string, item: DocumentInforDto) => <div>{item.do_in_isbn}</div> },
			{
				title: L('DocumentStatus'),
				render: (text, item: DocumentInforDto) => (
					<div>
						<Radio.Group
							onChange={async (e) => {
								item.do_in_status = e.target.value;
							}}
							defaultValue={item.do_in_status}
						>
							{Object.values(eDocumentItemStatus).map((item: MEnum, index: number) =>
								<Radio key={"key_radio" + index} value={item.num}>{valueOfeDocumentItemStatus(item.num)}</Radio>
							)}
						</Radio.Group>
					</div>
				)
			},

		];
		columns.push(action);

		const columnsDocument = [
			{
				title: L('ListOfCheckItems'), dataIndex: '', key: 'document_check_index',
				onCell: (item: CheckItemDto) => {
					return {
						onClick: (e) => this.showOut(item),
					};
				},
				render: (text: string, item: CheckItemDto, index: number) => <div>{item.do_id.name}</div>
			},
			{
				title: L(''), dataIndex: '', key: 'document_tien_trinh_check_index',
				render: (text: string, item: CheckItemDto, index: number) => <div style={{ textAlign: 'center' }}>{this.renderValueProcess(item)}</div>
			},
		];
		const columnsDocumentInfor = [
			{
				title: L('Document'), dataIndex: '', key: 'document_infor_check_index',
				onCell: (item: DocumentInforDto) => {
					return {
						onDoubleClick: async (e) => { await this.setState({ dkcb_code: item.dkcb_code }); this.handleSearch() },
					};
				},
				render: (text: string, item: DocumentInforDto, index: number) => <div><span style={{ color: 'darkblue' }}>{item.dkcb_code}</span> - {itemCheckItemSelect.do_id.name}</div>
			},
		];


		return (
			<Card>
				<Row gutter={10}>
					<Col span={16} >
						<Row>
							<Link to="/check/check">
								<Button style={{ marginRight: 10 }}><StepBackwardOutlined /></Button>
							</Link>
							<h2>{L('ConductADocumentCheck')}</h2>
						</Row>
						<Row>
							<h3> 1.{L('InformationAboutTheCheck')} {this.state.visibleInforCheck == false ? < CaretDownOutlined onClick={() => this.setState({ visibleInforCheck: true })} /> : <CaretUpOutlined onClick={() => this.setState({ visibleInforCheck: false })} />}</h3>
						</Row>
						{(resultCheck != undefined && this.state.visibleInforCheck != false) &&
							<>
								<Card style={{
									border: '1px solid',
									backgroundColor: '#8d88884d',
								}}>
									<Row>
										<Col span={12}>
											<span style={{ fontWeight: 500 }}>{L('CheckCode')}: </span> <i>{resultCheck.ck_code}</i><br />
											<span style={{ fontWeight: 500 }}>{L('Status')}: </span><i>{resultCheck.ck_desc}</i>
										</Col>
										<Col span={12}>
											<span style={{ fontWeight: 500 }}>{L('CheckStartDate')} :  </span><i>{moment(resultCheck.ck_created_at).format("DD/MM/YYYY")}</i><br />
											<span style={{ fontWeight: 500 }}>{L('ParticipantInTheCheck')} :  </span><i>{stores.sessionStore.getNameParticipant(resultCheck.us_id_participant!)}</i>

										</Col>
									</Row>
								</Card>
							</>
						}
						<Row>
							<h3>2.{L('CheckProcess')}</h3>
						</Row>
						<Row>
							<Col span={6} offset={8}>
								<Input
									ref={this.inputRef}
									allowClear
									value={this.state.dkcb_code}
									size='middle'
									onPressEnter={() => this.handleSearch()}
									onChange={(e) => this.setState({ dkcb_code: e.target.value })}
									placeholder={L("ScannCodeDKCB")}
								/>
							</Col>
							<Col span={2}>
								<Button type='primary' size='middle' onClick={() => this.handleSearch()} icon={<SearchOutlined />} />
							</Col>
						</Row>

					</Col>
					<Col span={8} style={{ borderLeft: '1px solid #ccc' }}>
						<Row>
							<Col span={12} >
								<Badge count={itemCheckItemSelect.do_in_id_valid != undefined && itemCheckItemSelect.do_in_id_valid!.length}><Button style={{ width: "120px" }} type='primary' onClick={() => { this.setState({ isTable: true, isChangeTable: !this.state.isChangeTable, idSelected: itemCheckItemSelect.do_in_id_valid!, titleTable: L('ValidDocuments') }) }}>{L('ValidDocuments')}</Button></Badge>
							</Col>
							<Col span={12}>
								<Badge count={itemCheckItemSelect.do_in_id_borrow != undefined && itemCheckItemSelect.do_in_id_borrow!.length}><Button style={{ width: "120px" }} type='primary' onClick={() => { this.setState({ isTable: true, isChangeTable: !this.state.isChangeTable, idSelected: itemCheckItemSelect.do_in_id_borrow!, titleTable: L('BorrowedDocuments') }) }}>{L('BorrowedDocuments')}</Button></Badge>
							</Col>
						</Row>
						<Row style={{ marginTop: "30px" }}>
							<Col span={12} >
								<Badge count={itemCheckItemSelect.do_in_id_invalid != undefined && itemCheckItemSelect.do_in_id_invalid!.length}><Button style={{ width: "120px" }} type='primary' onClick={() => { this.setState({ isTable: true, isChangeTable: !this.state.isChangeTable, idSelected: itemCheckItemSelect.do_in_id_invalid!, titleTable: L('CorruptDocument') }) }}>{L('CorruptDocument')}</Button></Badge>
							</Col>
							<Col span={12}>
								<Badge count={itemCheckItemSelect.do_in_id_lost != undefined && itemCheckItemSelect.do_in_id_lost!.length}><Button style={{ width: "120px" }} type='primary' onClick={() => { this.setState({ isTable: true, isChangeTable: !this.state.isChangeTable, idSelected: itemCheckItemSelect.do_in_id_lost!, titleTable: L('LostDocument') }) }}>{L('LostDocument')}</Button></Badge>
							</Col>
						</Row>
						<ModalTableCheckDocument onCancel={() => this.setState({ isTable: false })} visible={this.state.isTable} titleTable={this.state.titleTable} isChangeTable={this.state.isChangeTable} idSelected={this.state.idSelected} />

					</Col>
				</Row>
				<Row gutter={10} style={{ marginTop: '10px' }}>
					<Col span={14} >
						<Table
							title={() => <Row style={{ justifyContent: 'center', color: 'black' }}>{L('DocumentHeaderList')}: {checkItemListResult.length}</Row>}
							rowClassName={(record, index) => (this.state.do_id == record.do_id.id) ? "bg-click" : "bg-white"}
							showHeader={false}
							rowKey={record => "plan_table_" + JSON.stringify(record)}
							size={'small'}
							bordered={true}
							scroll={{ y: 280 }}
							locale={{ "emptyText": L('NoData') }}
							columns={columnsDocument}
							dataSource={checkItemListResult}
							pagination={false}
						/>
					</Col>
					<Col span={10} >
						<Table
							title={() =>
								<Row style={{ justifyContent: 'center', color: 'seagreen' }}>
									{L('MaterialsInStockAreNotYetCheck')}: {listDocInfoCheck.length}
								</Row>}
							rowClassName={(record, index) => (documentInfo.do_in_id == record.do_in_id) ? "bg-click" : "bg-white"}
							showHeader={false}
							rowKey={record => "plan_table_" + JSON.stringify(record)}
							size={'small'}
							bordered={true}
							scroll={{ y: 280 }}
							locale={{ "emptyText": L('NoData') }}
							columns={columnsDocumentInfor}
							dataSource={[...listDocInfoCheck]}
							pagination={false}
						/>
					</Col>
				</Row>
				<hr />
				<Table
					className='centerTable'
					bordered
					style={{ marginTop: '10px' }}
					rowKey={record => "plan_table_" + JSON.stringify(record)}
					size={'middle'}
					locale={{ "emptyText": L('NoData') }}
					columns={columns}
					dataSource={this.listDocumentInfor.length > 0 ? this.listDocumentInfor : []}
					pagination={false}
				/>
				<Row justify='center' style={{ marginTop: '10px' }}>
					<Button type='primary' onClick={() => this.onChangeStatusCheckDone()}>{L('Hoan_thanh_kiem_ke')}</Button>
				</Row>
			</Card >
		)
	}
}