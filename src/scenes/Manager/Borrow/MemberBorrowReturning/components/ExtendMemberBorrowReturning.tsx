import * as React from 'react';
import { Col, Row, Button, Table, Card, Input, message, DatePicker, Tag, } from 'antd';
import { BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, BorrowReturningIDetailDto, ExtendtBorrowReturningInput, ExtendtBorrowReturningItemInput, } from '@services/services_autogen';
import moment, { Moment } from 'moment';
import { colorEBorrowReturningStatus, eBorrowReturningStatus, valueOfeBorrowReturningStatus } from '@src/lib/enumconst';
import { BorrowReturningDetailMappingDto } from '../../ManagerBorrowReturning/TabExtendBorrowReturning/components/ExtendBorrowReturning';
import { L } from '@src/lib/abpUtility';
import AppSetting from '@src/lib/appsetting';


export interface IProps {
	detailBorrow: BorrowReturningDetailsWithListDocumentDto;
	borrowReturing: BorrowReturningDto;
	isLoadDone: boolean;
	onSuccessAction?: () => void;
	onExtendRequest?: (input: ExtendtBorrowReturningInput) => void;
	onCancel?: () => void;
}
const MAX_DUE_DATE_TIME: number = abp.setting.get(AppSetting.GeneralSettings_DueDateMaxTimes);
export default class ExtendMemberBorrowReturning extends React.Component<IProps> {
	state = {
		isLoadDone: false,
		br_re_extend_note: '',
	};
	listItemBorrow: BorrowReturningDetailMappingDto[] = [];
	async componentDidMount() {
		await this.initData();
	}
	initData = async () => {
		this.setState({ isLoadDone: false });
		const { detailBorrow } = this.props;
		this.listItemBorrow = [];
		if (detailBorrow != undefined && detailBorrow.list_borrow != undefined && detailBorrow.list_borrow!.length > 0) {
			detailBorrow.list_borrow.map((item: BorrowReturningIDetailDto) => {
				let itemAdd = new BorrowReturningDetailMappingDto(item);
				this.listItemBorrow.push(itemAdd);
			})
		}
		this.setState({ isLoadDone: true });

	}

	onExtendRequest = (input: ExtendtBorrowReturningInput) => {
		if (!!this.props.onExtendRequest) {
			this.props.onExtendRequest(input)
		}
	}

	onExtendRequestData = async () => {
		const { borrowReturing } = this.props;
		let input = new ExtendtBorrowReturningInput();
		input.br_re_id = borrowReturing.br_re_id;
		input.br_re_extend_note = this.state.br_re_extend_note;
		input.list = [];
		this.listItemBorrow.map(item => {
			let inputItem = new ExtendtBorrowReturningItemInput();
			inputItem.br_re_de_id = item.br_re_de_id;
			inputItem.br_re_de_due_date = moment(item.br_re_de_due_date).toDate();
			if (item.br_re_de_due_date?.format("DD/MM/YYYY") == moment(item.br_re_end_at).format("DD/MM/YYYY")) {
				inputItem.isExtend = false;
			}
			else {
				inputItem.isExtend = true;
			}
			input.list!.push(inputItem);
		})
		await this.onExtendRequest(input);
		await this.onSuccessAction();
		message.success(L('Success'));

	}
	onChangeDatePickerExtend(date: Moment | null, item: BorrowReturningDetailMappingDto) {
		this.setState({ isLoadDone: false });
		item.br_re_de_due_date = date;
		this.setState({ isLoadDone: true });
	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}
	onSuccessAction = () => {
		if (!!this.props.onSuccessAction) {
			this.props.onSuccessAction();
		}
	}

	render() {
		const dateFormat = 'DD/MM/YYYY';
		const columns = [
			{ title: L('N.O'), key: 'no_borrowReturning_extend', render: (text: string, item: BorrowReturningDetailMappingDto, index: number) => <div><b>Quyển số: {index + 1}</b></div> },
			{ title: L('DocumentName'), key: 'title_borrowReturning_extend', render: (text: string, item: BorrowReturningDetailMappingDto) => <div>{item.document.do_title}</div> },
			{ title: L('CodeDkcb'), key: 'dkcb_borrowReturning_extend', render: (text: string, item: BorrowReturningDetailMappingDto) => <div>{item.documentInfor != undefined && item.documentInfor.dkcb_code}</div> },
			{ title: L('TimeOFRenewal'), key: 'dkcb_borrowReturning_extend', render: (text: string, item: BorrowReturningDetailMappingDto) => <div>{item.br_re_de_no_adjourn}</div> },
			{ title: L('Status'), key: 'status_borrowReturning_extend', render: (text: string, item: BorrowReturningDetailMappingDto) => <div><Tag color={colorEBorrowReturningStatus(item.br_re_status)}>{valueOfeBorrowReturningStatus(item.br_re_status)}</Tag></div> },
			{
				title: L('RenewalDate'), key: 'date_borrowReturning_extend', render: (text: string, item: BorrowReturningDetailMappingDto) => <div>{
					(item.br_re_status != eBorrowReturningStatus.MAT.num && item.br_re_de_no_adjourn <= MAX_DUE_DATE_TIME) ?
						<DatePicker
							style={{ width: "100%" }}
							disabledDate={(current) => current ? current <= moment().startOf('day') : false}
							value={item.br_re_de_due_date}
							onChange={(date: moment.Moment | null, dateString: string) => this.onChangeDatePickerExtend(date, item)}
							format={dateFormat}
							placeholder={L("Select")}
						/>
						: <a style={{ color: "red" }}><b>{L('CanNotExtend')}</b></a>
				}</div>
			},

		];
		return (
			<>
				{/* <InformationMember memberSelected={this.props.memberBorrow} /> */}
				<Row>
					<Col span={24}>
						<Table
							className='centerTable'
							loading={!this.props.isLoadDone}
							rowKey={record => Math.random() + "_" + record.br_re_id}
							size={'middle'}
							bordered={true}
							locale={{ "emptyText": L('NoData') }}
							columns={columns}
							dataSource={this.listItemBorrow.length > 0 ? this.listItemBorrow : []}
							pagination={false}
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: "15px" }}>
					<Col span={4}><strong>{L('Note')}: </strong></Col>
					<Col span={20}><Input.TextArea rows={3} onChange={(e) => this.setState({ br_re_extend_note: e.target.value })} /></Col>
				</Row>
				<Row style={{ textAlign: "right", marginTop: "20px" }}>
					<Col span={24}>
						<Button danger onClick={() => this.onCancel()}>{L('Cancel')}</Button>
						&nbsp;
						<Button type='primary' onClick={() => this.onExtendRequestData()}>{L('Save')}</Button>
					</Col>
				</Row>
			</>
		)
	}
}