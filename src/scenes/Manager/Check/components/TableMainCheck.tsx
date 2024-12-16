import * as React from 'react';
import { Button, Popover, Row, Table, Tag, } from 'antd';
import { AuditOutlined, CaretDownOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseOutlined, DeleteFilled, EditOutlined, EyeFilled, EyeOutlined, FileProtectOutlined, FileSearchOutlined, FileTextOutlined, MinusCircleOutlined, RollbackOutlined, SyncOutlined, UnorderedListOutlined, } from '@ant-design/icons';
import { CheckDto, CheckItemDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnGroupType, ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { eCheckProcess, valueOfeCheckProcess } from '@src/lib/enumconst';
import { ActionCheck } from '..';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';


export interface IProps {
	actionCheck?: (item: CheckDto, action: number, status?: number) => void;
	checkListResult: CheckDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	gotoCataloging?: (item: CheckDto) => void;
	scroll?: boolean;
	noscroll?: boolean;
	is_printed?: boolean;
}
export default class TableMainCheck extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		clicked: false,
		ck_id: undefined,
	};
	checkSelected: CheckDto = new CheckDto();
	checkItemSelected: CheckItemDto = new CheckItemDto();
	onAction = (item: CheckDto, action: number, status?: number) => {
		this.checkSelected.init(item);
		if (!!this.props.actionCheck) {
			this.props.actionCheck(item, action, status);
		}
	}
	gotoCataloging = (item: CheckDto) => {
		this.checkSelected = item;
		if (!!this.props.gotoCataloging) {
			this.props.gotoCataloging(item);
		}
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	handleVisibleChange = (visible, item: CheckDto) => {
		this.setState({ clicked: visible, ck_id: item.ck_id });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	content = (item: CheckDto) => (
		<div>
			{(item.ck_process == eCheckProcess.Sign.num || item.ck_process == eCheckProcess.CHECKING.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_CatalogingCheck)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<FileProtectOutlined />} title={L('DocumentCheck')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.gotoCataloging(item!); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.gotoCataloging(item!); this.hide() }}>{L("DocumentCheck")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.CHECKING.num || item.ck_process == eCheckProcess.DONE.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_CheckReport)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<FileSearchOutlined />} title={L('ViewReportInspectionReport')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.ReportCheck); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, ActionCheck.ReportCheck!); this.hide() }}>{L("ViewReportInspectionReport")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.CHECKING.num || item.ck_process == eCheckProcess.DONE.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_Detail)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type='primary'
						icon={<EyeOutlined />} title={L('ViewCheck')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.ViewCheck); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, ActionCheck.ViewCheck!); this.hide() }}>{L("ViewCheck")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.CHECKING.num || item.ck_process == eCheckProcess.DONE.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_CheckReport)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type='primary'
						icon={<FileTextOutlined />} title={L('bao_cao_trang_thai_tai_lieu')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.StatusDocumentInfoReport); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, ActionCheck.StatusDocumentInfoReport!); this.hide() }}>{L("bao_cao_trang_thai_tai_lieu")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.Creating.num || item.ck_process == eCheckProcess.Give_Back.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_Edit)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<EditOutlined />} title={L('Edit')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.CreateOrUpdate); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, ActionCheck.CreateOrUpdate!); this.hide() }}>{L("Edit")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.Wait_Approve.num || item.ck_process == eCheckProcess.Approved.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_Sign) || this.isGranted(AppConsts.Permission.Check_Check_Approve)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="dashed" icon={<RollbackOutlined />} title={L('Return')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Give_Back.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Give_Back.num); this.hide() }}>{L("Return")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.Wait_Approve.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_Approve)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<CheckCircleOutlined />} title={L('RoomAccessPlan')}
						style={{ marginLeft: '10px', marginBottom: '5px' }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Approved.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Approved.num); this.hide() }}>{L("RoomAccessPlan")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.Approved.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_Sign)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						type="primary" icon={<AuditOutlined />} title={L('DirectorApproves')}
						style={{ marginLeft: '10px', marginBottom: '5px', backgroundColor: 'cornflowerblue' }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Sign.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px" }} onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Sign.num); this.hide() }}>{L("DirectorApproves")}</a>
				</Row>)
			}
			{(item.ck_process == eCheckProcess.Wait_Approve.num || item.ck_process == eCheckProcess.Approved.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_Sign) || this.isGranted(AppConsts.Permission.Check_Check_Approve)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger
						type="primary" icon={<CloseOutlined />} title={L('Cancel')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Cancel.num); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onAction(item!, ActionCheck.ChangeStatus, eCheckProcess.Cancel.num); this.hide() }}>{L("Cancel")}</a>
				</Row>)
			}
			{(item.ck_process != eCheckProcess.Sign.num && item.ck_process != eCheckProcess.CHECKING.num && item.ck_process != eCheckProcess.DONE.num) &&
				(this.isGranted(AppConsts.Permission.Check_Check_Delete)) &&
				(<Row style={{ alignItems: "center" }}>
					<Button
						danger icon={<DeleteFilled />} title={L('Delete')}
						style={{ marginLeft: '10px', marginBottom: "5px" }}
						size='small'
						onClick={() => { this.onAction(item!, ActionCheck.Delete); this.hide() }}
					></Button>
					<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.onAction(item!, ActionCheck.Delete); this.hide() }}>{L("Delete")}</a>
				</Row>)
			}
		</div>
	)

	render() {
		const { checkListResult, pagination, hasAction, is_printed } = this.props;
		let action: ColumnGroupType<CheckDto> = {
			title: "", children: [], key: 'action_member_index', className: "no-print center", fixed: 'right', width: 50,
			render: (text: string, item: CheckDto) => (
				<Popover visible={this.state.clicked && this.state.ck_id == item.ck_id} onVisibleChange={(e) => this.handleVisibleChange(e, item)} placement="bottom" content={this.content(item)} trigger={['hover']} >
					{this.state.clicked && this.state.ck_id == item.ck_id ? <CaretDownOutlined /> : <UnorderedListOutlined />}
				</Popover >
			)
		};
		const columns: ColumnsType<CheckDto> = [
			{ title: L('N.O'), key: 'no_Check_index', width: 50, render: (text: string, item: CheckDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('CheckCode'), key: 'ck_code', render: (text: string, item: CheckDto) => <div>{item.ck_code}</div> },
			{ title: L('ten_kiem_ke'), key: 'ck_name', render: (text: string, item: CheckDto) => <div>{item.ck_name}</div> },
			{
				title: L('Status'), key: 'ck_process', render: (text: string, item: CheckDto) => {
					if (is_printed !== undefined && is_printed) {
						return <div>{valueOfeCheckProcess(item.ck_process)}</div>
					} else {
						return <div>
							{item.ck_process == eCheckProcess.Creating.num && <Tag color='green'>{valueOfeCheckProcess(item.ck_process)}</Tag>}
							{item.ck_process == eCheckProcess.Wait_Approve.num && <Tag icon={<SyncOutlined spin />} color="yellow">{valueOfeCheckProcess(item.ck_process)}</Tag>}
							{item.ck_process == eCheckProcess.Approved.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeCheckProcess(item.ck_process)}</Tag>}
							{item.ck_process == eCheckProcess.Sign.num && <Tag icon={<CheckCircleOutlined />} color='pink'>{valueOfeCheckProcess(item.ck_process)}</Tag>}
							{item.ck_process == eCheckProcess.Give_Back.num && <Tag icon={<ClockCircleOutlined />} color='warning'>{valueOfeCheckProcess(item.ck_process)}</Tag>}
							{item.ck_process == eCheckProcess.Cancel.num && <Tag icon={<MinusCircleOutlined />} color='error'>{valueOfeCheckProcess(item.ck_process)}</Tag>}
							{item.ck_process == eCheckProcess.CHECKING.num && <Tag icon={<ClockCircleOutlined />} color='yellow'>{valueOfeCheckProcess(item.ck_process)}</Tag>}
							{item.ck_process == eCheckProcess.DONE.num && <Tag icon={<CheckCircleOutlined />} color='#2db7f5'>{valueOfeCheckProcess(item.ck_process)}</Tag>}
						</div>
					}
				}
			},
			{ title: L('Description'), key: 'cd_desc', render: (text: string, item: CheckDto) => <div style={{ paddingTop: "14px" }} dangerouslySetInnerHTML={{ __html: item.ck_desc! }}></div> },
		];
		if (hasAction != undefined && hasAction === true && this.isGranted(
			AppConsts.Permission.Check_Check_CatalogingCheck ||
			AppConsts.Permission.Check_Check_CheckReport ||
			AppConsts.Permission.Check_Check_Edit ||
			AppConsts.Permission.Check_Check_Approve ||
			AppConsts.Permission.Check_Check_Sign ||
			AppConsts.Permission.Check_Check_Delete)) {
			columns.push(action);
		}
		return (
			<Table
				className='centerTable'
				onRow={(record, rowIndex) => {
					return {
						onDoubleClick: (event: any) => {
							(hasAction != undefined && hasAction === true) && this.onAction(record, ActionCheck.DoubleClickRow)
						}
					};
				}}
				scroll={this.props.noscroll ? { x: undefined } : { y: 400, x: 1000 }}
				// style={{ height: '500px' }}
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.checkSelected.ck_id == record.ck_id) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				bordered={true}
				locale={{ "emptyText": L('NoData') }}
				columns={columns}
				dataSource={checkListResult.length > 0 ? checkListResult : []}
				pagination={this.props.pagination}

			/>
		)
	}
}