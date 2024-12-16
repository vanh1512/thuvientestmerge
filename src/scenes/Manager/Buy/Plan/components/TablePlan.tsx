import * as React from 'react';
import { Button, Popconfirm, Popover, Row, Table, Tag, message, } from 'antd';
import { AuditOutlined, CheckCircleOutlined, ClockCircleOutlined, CheckOutlined, CloseOutlined, DeleteFilled, EditOutlined, EyeOutlined, MinusCircleOutlined, RollbackOutlined, SyncOutlined, FileSearchOutlined, UnorderedListOutlined, CaretDownOutlined, } from '@ant-design/icons';
import { ConfirmPlanDoneInput, PlanDto, PlanProcess, } from '@services/services_autogen';
import { displayDate, L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import { eProcess, valueOfeProcess } from '@src/lib/enumconst';
import { ActionPlan } from '..';
import { stores } from '@src/stores/storeInitializer';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';


export interface IProps {
	actionPlan?: (item: PlanDto, action: number, status?: number) => void;
	planListResult: PlanDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	isLoadDone?: boolean;
	getSuccessConfirm?: () => void;
	isTitle?: boolean;
	is_printed?: boolean;
}
export default class TablePlan extends AppComponentBase<IProps> {
	state = {
		isLoadDone: false,
		visibleModalCreateUpdate: false,
		clicked: false,
		pl_id: undefined,
	};
	planSelected: PlanDto = new PlanDto();

	onActionPlan = (item: PlanDto, action: number, status?: number) => {
		this.planSelected.init(item);
		if (!!this.props.actionPlan) {
			this.props.actionPlan(item, action, status);
		}
	}

	confirmDone = async (id: number | undefined) => {

		this.setState({ isLoadDone: false });
		let initData = new ConfirmPlanDoneInput();
		if (id != undefined) {
			initData.pl_id = id;
		}
		await stores.planStore.comfirmDone(initData);
		this.getSuccessConfirm();
		message.success(L("xac_nhan_thanh_cong"));
		this.setState({ isLoadDone: true });

	}
	handleVisibleChange = (visible, item: PlanDto) => {
		this.setState({ clicked: visible, pl_id: item.pl_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	getSuccessConfirm = () => {
		if (!!this.props.getSuccessConfirm) {
			this.props.getSuccessConfirm();
		}
	}
	content = (item: PlanDto) => (<div >
		{(item.pl_process == eProcess.Creating.num || item.pl_process == eProcess.Give_Back.num) &&
			(
				this.isGranted(AppConsts.Permission.Buy_Plan_Edit) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EditOutlined />} title={L('Edit')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.CreateOrUpdate); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionPlan(item!, ActionPlan.CreateOrUpdate); this.hide() }}>{L('Edit')}</a>
				</Row>)
			)
		}
		{item.pl_process == eProcess.Complete.num &&
			(
				this.isGranted(AppConsts.Permission.Buy_Plan_Detail) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EyeOutlined />} title={L('PlanInfomation')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.ShowPlanDetail); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionPlan(item!, ActionPlan.ShowPlanDetail); this.hide() }}>{L('PlanInfomation')}</a>
				</Row>)
			)
		}
		{(item.pl_process != eProcess.Creating.num && item.pl_process != eProcess.Complete.num && item.pl_process != eProcess.Give_Back.num) &&
			(
				this.isGranted(AppConsts.Permission.Buy_Plan_Detail) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<FileSearchOutlined />} title={L('PlanInfomation')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.CreateOrUpdate); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionPlan(item!, ActionPlan.CreateOrUpdate); this.hide() }}>{L('PlanInfomation')}</a>
				</Row>))
		}
		{(item.pl_process == eProcess.Wait_Approve.num || item.pl_process == eProcess.Approved.num) &&
			(
				(this.isGranted(AppConsts.Permission.Buy_Plan_Approve) || this.isGranted(AppConsts.Permission.Buy_Plan_Sign)) &&
				(<Row style={{ alignItems: "center" }}>

					<Button
						type="dashed" icon={<RollbackOutlined />} title={L('GiveBack')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Give_Back.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Give_Back.num); this.hide() }}>{L('GiveBack')}</a>
				</Row>))
		}
		{item.pl_process == eProcess.Wait_Approve.num &&
			(
				this.isGranted(AppConsts.Permission.Buy_Plan_Approve) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<CheckCircleOutlined />} title={L('ApprovedByDepartment')}
						style={{ marginLeft: '10px', marginTop: '5px', backgroundColor: 'cornflowerblue' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Approved.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Approved.num); this.hide() }}>{L('ApprovedByDepartment')}</a>
				</Row>))
		}
		{item.pl_process == eProcess.Approved.num &&
			(
				this.isGranted(AppConsts.Permission.Buy_Plan_Sign) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<AuditOutlined />} title={L('SignedByManager')}
						style={{ marginLeft: '10px', marginTop: '5px', backgroundColor: 'cornflowerblue' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Sign.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Sign.num); this.hide() }}>{L('SignedByManager')}</a>
				</Row>))
		}
		{(item.pl_process == eProcess.Wait_Approve.num || item.pl_process == eProcess.Approved.num) &&
			(
				(this.isGranted(AppConsts.Permission.Buy_Plan_Approve) || this.isGranted(AppConsts.Permission.Buy_Plan_Sign)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger
						type="primary" icon={<CloseOutlined />} title={L('CancelPlan')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Cancel.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onActionPlan(item!, ActionPlan.ChangeStatus, eProcess.Cancel.num); this.hide() }}>{L('CancelPlan')}</a>
				</Row>))
		}
		{(item.pl_process != eProcess.Sign.num && item.pl_process != eProcess.Complete.num) &&
			(
				this.isGranted(AppConsts.Permission.Buy_Plan_Delete) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')}
						style={{ marginLeft: '10px', marginTop: '5px' }}
						size='small'
						onClick={() => { this.onActionPlan(item!, ActionPlan.Delete); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onActionPlan(item!, ActionPlan.Delete); this.hide() }}>{L('Delete')}</a>
				</Row>))
		}
	</div>)
	render() {
		const { planListResult, pagination, hasAction, is_printed } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_member_index', ixed: 'right', className: "no-print center", width: 50,
			render: (text: string, item: PlanDto) => (
				<Popover style={{ width: "200px" }} visible={this.state.clicked && this.state.pl_id == item.pl_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.pl_id == item.pl_id ? <CaretDownOutlined/> : <UnorderedListOutlined/>}
				</Popover >
			)
		};
		const columns = [
			{ title: L('N.O'), dataIndex: '', width: 50, key: 'no_member_index', render: (text: string, item: PlanDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('Title'), dataIndex: 'pl_title', key: 'pl_title', render: (text: string, item: PlanDto) => <div style={{ textAlign: "left" }}><b>{item.pl_title}</b><br /><small>{L("Created at")}: <i>{displayDate(item.pl_created_at)}</i></small></div> },
			{
				title: L('Status'), dataIndex: 'pl_process', key: 'pl_process', render: (text: string, item: PlanDto) => {
					if (is_printed !== undefined && is_printed) {
						return <div>{valueOfeProcess(item.pl_process)}</div>
					} else {
						return <div>
							{item.pl_process == eProcess.Creating.num && <Tag color='yellow'>{valueOfeProcess(item.pl_process)}</Tag>}
							{item.pl_process == eProcess.Wait_Approve.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeProcess(item.pl_process)}</Tag>}
							{item.pl_process == eProcess.Approved.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeProcess(item.pl_process)}</Tag>}
							{item.pl_process == eProcess.Sign.num && <Tag icon={<CheckCircleOutlined />} color='#2db7f5'>{valueOfeProcess(item.pl_process)}</Tag>}
							{item.pl_process == eProcess.Give_Back.num && <Tag icon={<ClockCircleOutlined />} color='warning'>{valueOfeProcess(item.pl_process)}</Tag>}
							{item.pl_process == eProcess.Cancel.num && <Tag icon={<MinusCircleOutlined />} color='error'>{valueOfeProcess(item.pl_process)}</Tag>}
							{item.pl_process == eProcess.Complete.num && <Tag icon={<CheckOutlined />} color='green'>{valueOfeProcess(item.pl_process)}</Tag>}
						</div>
					}
				}
			},

		];
		if (hasAction != undefined && hasAction === true && this.isGranted(
			AppConsts.Permission.Buy_Plan_Edit ||
			AppConsts.Permission.Buy_Plan_Detail ||
			AppConsts.Permission.Buy_Plan_Approve ||
			AppConsts.Permission.Buy_Plan_Sign ||
			AppConsts.Permission.Buy_Plan_Delete)) {
			columns.push(action);
		}
		return (
			<Table
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => { (hasAction != undefined && hasAction === true) && this.onActionPlan(record, ActionPlan.DoubleClickRow) }
					};
				}}
				className='centerTable'
				rowClassName={(record, index) => (this.planSelected.pl_id == record.pl_id) ? "bg-click" : "bg-white"}
				rowKey={record => "plan_table_" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				scroll={this.props.is_printed ? { y: undefined, x: undefined } : { y: 500 }}
				columns={columns}
				dataSource={planListResult !== undefined ? planListResult : []}
				pagination={this.props.pagination}
			/>
		)
	}
}