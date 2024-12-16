import * as React from 'react';
import { Button, Popover, Row, Table, Tag, Tooltip, Modal, message } from 'antd';
import { CaretDownOutlined, CheckCircleOutlined, CheckOutlined, DeleteFilled, EditOutlined, EyeOutlined, ReloadOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import { ContractDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { stores } from '@src/stores/storeInitializer';
import { enumContracStatus, valueOfeContract } from '@src/lib/enumconst';
import AppConsts, { EventTable } from '@src/lib/appconst';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

const { confirm } = Modal;
export interface IProps {
	onDoubleClickRow?: (item: ContractDto) => void;
	createOrUpdateModalOpen?: (item: ContractDto) => void;
	createOrUpdateModalBill?: (item: ContractDto) => void;
	changeStatus?: () => void;
	contractListResult: ContractDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	actionTable?: (item: ContractDto, event: EventTable) => void;
	isPrint?: boolean;
	pl_id?: number;
}
export default class TableMainContract extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		contract_id_selected: undefined,
		co_id: undefined,
		clicked: false,
	};
	contractSelected: ContractDto = new ContractDto();

	onDoubleClickRow = (item: ContractDto) => {
		this.contractSelected = item;
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}

	createOrUpdateModalOpen = (item: ContractDto) => {
		this.contractSelected = item;
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}

	createOrUpdateModalBill = (item: ContractDto) => {
		this.contractSelected = item;
		if (!!this.props.createOrUpdateModalBill) {
			this.props.createOrUpdateModalBill(item);
		}
	}

	confirmDone = async (input: ContractDto) => {
		this.setState({ isLoadDone: false });
		const self = this;
		confirm({
			title: L('ban_muon_xac_nhan_hop_dong') + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				await stores.contractStore.confimDone(input);
				self.changeStatus();
				message.success(L('thao_tac_thanh_cong'));
			},
			onCancel() {
			},
		});
		this.setState({ isLoadDone: true });
	}
	changeStatus = () => {
		if (!!this.props.changeStatus) { this.props.changeStatus(); }
	}
	onAction = (item: ContractDto, action: EventTable) => {
		this.setState({ contract_id_selected: item.co_id });
		const { actionTable } = this.props;
		if (actionTable !== undefined) {
			actionTable(item, action);
		}
	}
	handleVisibleChange = (visible, item: ContractDto) => {
		this.setState({ clicked: visible, co_id: item.co_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	content = (item: ContractDto) => (<div >
		{!!this.props.pl_id ?
			this.isGranted(AppConsts.Permission.Buy_Buying_Detail) &&
			(<Row style={{ alignItems: "center" }}>
				<Button
					type="primary" icon={<EyeOutlined />} title={L('ContractInfo')}
					style={{ marginLeft: '10px', marginTop: "5px" }}
					size='small'
					onClick={() => { this.onDoubleClickRow(item!); this.hide() }}
				></Button>
				<a style={{ paddingLeft: "10px" }} onClick={() => { this.onDoubleClickRow(item!); this.hide() }}>{L('ContractInfo')}</a>
			</Row>)
			:
			<>
				{(this.isGranted(AppConsts.Permission.Buy_Buying_Edit) && item.co_status != enumContracStatus.DONE.num) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							type="primary" icon={<EditOutlined />} title={L('Edit')}
							style={{ marginLeft: '10px', marginTop: "5px" }}
							size='small'
							onClick={() => { this.createOrUpdateModalOpen(item!); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px" }} onClick={() => { this.createOrUpdateModalOpen(item!); this.hide() }}>{L('Edit')}</a>
					</Row>)
				}
				{(this.isGranted(AppConsts.Permission.Buy_Buying_Confirm) && item.co_status == enumContracStatus.DOING.num) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							type="primary" icon={<CheckCircleOutlined />} title={L('ConfirmContract')}
							style={{ marginLeft: '10px', marginTop: "5px" }}
							size='small'
							onClick={() => { this.confirmDone(item!); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px" }} onClick={() => { this.confirmDone(item!); this.hide() }}>{L('ConfirmContract')}</a>
					</Row>)}
				{(this.isGranted(AppConsts.Permission.Buy_Buying_Detail) && item.co_status == enumContracStatus.DONE.num) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							type="primary" icon={<EyeOutlined />} title={L('ContractInfo')}
							style={{ marginLeft: '10px', marginTop: "5px" }}
							size='small'
							onClick={() => { this.onDoubleClickRow(item!); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px" }} onClick={() => { this.onDoubleClickRow(item!); this.hide() }}>{L('ContractInfo')}</a>
					</Row>)
				}
				{(this.isGranted(AppConsts.Permission.Buy_Buying_Delete) && item.co_status != enumContracStatus.DONE.num) &&
					(<Row style={{ alignItems: "center" }}>
						<Button
							danger icon={<DeleteFilled />} title={L('Delete')}
							style={{ marginLeft: '10px', marginTop: "5px" }}
							size='small'
							onClick={() => { this.onAction(item!, EventTable.Delete); this.hide() }}
						></Button>
						<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onAction(item!, EventTable.Delete); this.hide() }}>{L('Delete')}</a>
					</Row>)}
			</>
		}
	</div>)
	render() {
		const { contractListResult, pagination, hasAction, pl_id } = this.props;
		const { getUserNameById } = stores.sessionStore;
		let action: ColumnGroupType<ContractDto> = {
			title: "", children: [], key: 'action_contract_index', className: "no-print center", fixed: 'right', width: 50,
			render: (text: string, item: ContractDto) => (
				<Popover visible={this.state.clicked && this.state.co_id == item.co_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.co_id == item.co_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};
		const columns: ColumnsType<ContractDto> = [
			{ title: L('N.O'), width: 50, key: 'no_contract_index', render: (text: string, item: ContractDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('ContractCode'), key: 'co_code', render: (text: string, item: ContractDto) => <div>{item.co_code}</div> },
			{ title: L('ContractName'), key: 'co_name', render: (text: string, item: ContractDto) => <div>{item.co_name}</div> },
			{ title: L('Supplier'), key: 'co_su', render: (text: string, item: ContractDto) => <div>{stores.sessionStore.getNameSupplier(item.su_id)}</div> },
			{
				title: L('Signer'), key: 'co_user_sign', render: (text: string, item: ContractDto) => <div>{getUserNameById(item.us_id_accept)}
				</div>
			},
			{ title: L('SignAt'), key: 'co_signed_at', render: (item: ContractDto) => <div>{moment(item.co_signed_at).format('DD/MM/YYYY')}</div> },
			{
				title: L('Status'), key: 'co_status',

				render: (item: ContractDto) => {
					if (this.props.isPrint !== undefined && this.props.isPrint) {
						return <div>{valueOfeContract(item.co_status)}</div>
					} else {
						return <div>
							{
								item.co_status === enumContracStatus.INIT.num &&
								<Tag color='red' icon={<ReloadOutlined spin />}>{L(enumContracStatus.INIT.name)}</Tag>
							}
							{
								item.co_status === enumContracStatus.DOING.num &&
								<Tag color='green' icon={<CheckCircleOutlined />}>{L(enumContracStatus.DOING.name)}</Tag>
							}
							{
								item.co_status === enumContracStatus.DONE.num &&
								<Tag color='blue' icon={<CheckOutlined />}>{L(enumContracStatus.DONE.name)}</Tag>
							}
						</div>
					}
				}
			},
			{ title: L('Description'), key: 'co_desc', render: (text: string, item: ContractDto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.co_desc! }}></div> },
		];
		if (hasAction != undefined && hasAction === true && this.isGranted(
			AppConsts.Permission.Buy_Buying_Edit ||
			AppConsts.Permission.Buy_Buying_Confirm ||
			AppConsts.Permission.Buy_Buying_Detail ||
			AppConsts.Permission.Buy_Buying_Delete)) {
			columns.push(action);
		}
		return (
			<Table className='centerTable'
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onDoubleClickRow(record) }
					};
				}}
				scroll={this.props.isPrint ? { y: undefined, x: undefined } : { y: 400, x: 1000 }}
				// style={this.props.isPrint ? { height: 500 } : { height: 'auto' }}
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.contractSelected.co_id == record.co_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'small'}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				columns={columns}
				dataSource={contractListResult.length > 0 ? contractListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}