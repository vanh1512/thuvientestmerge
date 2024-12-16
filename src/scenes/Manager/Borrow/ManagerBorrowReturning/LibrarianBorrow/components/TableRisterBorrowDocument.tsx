import * as React from 'react';
import { Button, Card, Col, DatePicker, Form, Row, message, } from 'antd';
import { MinusOutlined, PlusOutlined, } from '@ant-design/icons';
import { BorrowReturningDto, CreateBorrowReturningInput, DocumentBorrowDto, FindMemberBorrowDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import moment, { Moment } from 'moment';
import AppConsts from '@src/lib/appconst';
import AppSetting from '@src/lib/appsetting';
import { stores } from '@src/stores/storeInitializer';
import InformationMember from '@src/scenes/Manager/Member/components/InformationMember';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export interface IProps {
	onRemoveDocIntoRegisterBorrow: (item: DocumentBorrowDto) => void;
	onAddDoc2RegisterBorrow?: (item: DocumentBorrowDto) => void;
	onRegister?: (item: CreateBorrowReturningInput) => void;
	onCancel: () => void;
	onClear?: () => void;
	onClearListDocumentBorrow?: () => void;

	listDocumentBorrowDisplay: {},
	documentListResult: DocumentBorrowDto[];
	listDocumentBorrow?: CreateBorrowReturningInput[],
	memberSelected?: FindMemberBorrowDto,
	us_id: number,
}

const max_br_day: number = abp.setting.get(AppSetting.GeneralSettings_DefaultBorrowMaxTime);

export default class TableRisterBorrowDocument extends React.Component<IProps> {
	private formRef: any = React.createRef();
	state = {
		isLoadDone: true,
		borrowStartDate: undefined || moment(),
		borrowEndDate: undefined || moment(),
	};
	borrowReturningSelected: BorrowReturningDto = new BorrowReturningDto();

	async componentDidMount() {
		await this.setState({ isLoadDone: false, borrowEndDate: this.createNewMoment(this.state.borrowStartDate).add(max_br_day, "day") });
		await this.initData(this.borrowReturningSelected);
		this.setState({ isLoadDone: true });
	}
	onCancel = () => {
		if (this.props.onCancel !== undefined) {
			this.props.onCancel();
		}
	}
	initData = async (inputdoccument: BorrowReturningDto | undefined) => {
		this.setState({ isLoadDone: false });
		inputdoccument!.br_re_start_at = this.state.borrowStartDate.toDate();
		inputdoccument!.br_re_end_at = this.state.borrowEndDate.toDate();
		await this.formRef.current!.setFieldsValue({ ...inputdoccument, });
		await this.setState({ isLoadDone: true });
	}
	onCreateBorrowReturning = () => {
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			if (this.borrowReturningSelected.br_re_id === undefined || this.borrowReturningSelected.br_re_id < 0) {
				let unitData = new CreateBorrowReturningInput(values);
				const do_id = Object.keys(this.props.listDocumentBorrowDisplay).reduce((acc: number[], key) => {
					const value = this.props.listDocumentBorrowDisplay[key];
					const repeatedElements = Array(value).fill(Number(key));
					return acc.concat(repeatedElements);
				}, []);
				if (do_id.length <= 0) {
					message.warning(L('PleaseChooseDocumentToBorrow'));
					return;
				}
				unitData.do_id = [...do_id];
				unitData.us_id_borrow = this.props.us_id;
				unitData.br_re_method = 0;
				await stores.borrowReturningStore.createBorrowReturning(unitData);
				this.formRef.current!.resetFields();
				message.success(L('SuccessfullyAdded'));
			}
			this.setState({ isLoadDone: true });
			this.onCancel();
			if (this.props.onClearListDocumentBorrow !== undefined) {
				this.props.onClearListDocumentBorrow();
			}
			// if (this.props.onClear !== undefined) {
			// 	this.props.onClear();
			// }
		});

	};
	onRemoveDocIntoRegisterBorrow = (item: DocumentBorrowDto) => {
		if (!!this.props.onRemoveDocIntoRegisterBorrow) {
			this.props.onRemoveDocIntoRegisterBorrow(item);
		}
		this.setState({ isLoadDone: true });
	}
	onAddDoc2RegisterBorrow = (item: DocumentBorrowDto) => {
		if (!!this.props.onAddDoc2RegisterBorrow) {
			this.props.onAddDoc2RegisterBorrow(item);
			this.setState({ isLoadDone: true });
		}
	}

	onChangeStartDate = async (date: Moment | null) => {
		await this.setState({ borrowStartDate: date });
		let dateValid = this.createNewMoment(this.state.borrowStartDate);
		dateValid = dateValid.add(max_br_day, 'days');
		if (!this.state.borrowEndDate.isBetween(this.state.borrowStartDate, dateValid)) {
			await this.setState({ borrowEndDate: this.createNewMoment(this.state.borrowStartDate).add(max_br_day, "day") });
		}
		await this.formRef.current.setFieldsValue({ br_re_start_at: date });
	}
	createNewMoment = (date: Moment) => {
		return moment(date, "DD/MM/YYYY");
	}

	render() {
		const { listDocumentBorrowDisplay, documentListResult } = this.props;
		return (
			<Card>
				<Row style={{ justifyContent: 'flex-end', textAlign: 'end' }}>
					<Col span={12} >
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Cancel')}
						</Button>
						<Button type="primary" onClick={() => this.onCreateBorrowReturning()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Save')}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, }}>
					<Col span={18}>
						<InformationMember memberSelected={this.props.memberSelected!} />
					</Col>
					<Col span={6}>
						<Form ref={this.formRef}>
							<Form.Item label={L('BorrowingDate')} {...AppConsts.formItemLayout} valuePropName='br_re_start_at' name={'br_re_start_at'} rules={[{ required: true, message: L('ThisFieldIsRequired') }]} hasFeedback>
								<DatePicker
									style={{ width: '100%' }}
									onChange={async (date: Moment | null, dateString: string) => await this.onChangeStartDate(date)}
									format={"DD/MM/YYYY"}
									value={this.state.borrowStartDate}
									disabledDate={(current) => current ? (current <= moment().startOf('day') || current > moment().add(max_br_day, 'day').startOf('day')) : false}
								/>
							</Form.Item>
							<Form.Item label={L('ReturningDate')} valuePropName='br_re_end_at' name={'br_re_end_at'} {...AppConsts.formItemLayout} rules={[{ required: true, message: L('ThisFieldIsRequired') }]} hasFeedback>
								<DatePicker
									style={{ width: '100%' }}
									onChange={(date: Moment | null, dateString: string) => { this.setState({ borrowEndDate: date }); this.formRef.current.setFieldsValue({ br_re_end_at: date }); }}
									format={"DD/MM/YYYY"}
									value={this.state.borrowEndDate}
									disabledDate={(current) => current ? (current <= this.createNewMoment(this.state.borrowStartDate).startOf('day') || current >= this.createNewMoment(this.state.borrowStartDate).add((Number(max_br_day) + 1), 'day').startOf('day')) : false}
								/>
							</Form.Item>
							<Form.Item label={L('Description')} {...AppConsts.formItemLayout} name={'br_re_desc'} hasFeedback valuePropName='data'
								getValueFromEvent={(event, editor) => {
									const data = editor.getData();
									return data;
								}}
							>
								<CKEditor editor={ClassicEditor} />
							</Form.Item>
						</Form>
					</Col>
				</Row>

				<table style={{ borderCollapse: 'inherit', width: '100%' }}>
					<thead className='ant-table-thead'>
						<tr>
							<th className='ant-table-cell'>{L('N.O')}</th>
							<th className='ant-table-cell'>{L('Title')}</th>
							<th className='ant-table-cell'>{L('Abtract')}</th>
							<th className='ant-table-cell'>{L('Author')}</th>
							<th className='ant-table-cell'>{L('YearOfPublication')}</th>
							<th className='ant-table-cell'>{ }</th>
						</tr>
					</thead>
					<tbody className='ant-table-tbody'>
						{documentListResult !== undefined && Object.keys(listDocumentBorrowDisplay).map((item, index) => (
							<tr className='ant-table-row ant-table-row-level-0' key={item}>
								<td className='ant-table-cell'>{index + 1}</td>
								<td className='ant-table-cell'>{documentListResult.find(doc => doc.do_id === Number(item))!.do_title} </td>
								<td className='ant-table-cell'><div dangerouslySetInnerHTML={{ __html: documentListResult.find(doc => doc.do_id === Number(item))!.do_abstract! }}></div></td>
								<td className='ant-table-cell'>{stores.sessionStore.getNameAuthor(documentListResult.find(doc => doc.do_id === Number(item))!.authors_arr)}</td>
								<td className='ant-table-cell'>{documentListResult.find(doc => doc.do_id === Number(item))!.do_date_publish}</td>
								<td className='ant-table-cell'>
									<Row style={{ fontSize: '15px', alignItems: 'center', justifyContent: 'center' }}>
										{<MinusOutlined onClick={() => this.onRemoveDocIntoRegisterBorrow(documentListResult.find(doc => doc.do_id === Number(item))!)}
											style={{ color: 'red' }} />}
										&nbsp;&nbsp;
										<label >{listDocumentBorrowDisplay[Number(item)]!}</label>
										&nbsp;&nbsp;
										{<PlusOutlined onClick={() => this.onAddDoc2RegisterBorrow(documentListResult.find(doc => doc.do_id === Number(item))!)}
											style={{ color: 'green' }} />}
									</Row>
								</td>
							</tr>
						))}
					</tbody>
				</table>

			</Card>
		)
	}
}