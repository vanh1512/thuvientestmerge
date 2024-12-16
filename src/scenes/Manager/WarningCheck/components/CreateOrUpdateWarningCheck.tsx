import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, DatePicker, message, Table } from 'antd';
import { L } from '@lib/abpUtility';
import { CheckDto, CreateCheckInput, CreateCheckItemInput, DocumentDto, ItemDocument, ItemUser } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { Moment } from 'moment';
import moment from 'moment';
import SelectUser from '@src/components/Manager/SelectUser';
import { eProcess, eUserType } from '@src/lib/enumconst';
import { ColumnsDisplayType } from '@src/components/Manager/SelectedColumnDisplay/ColumnsDisplayType';
import { DocumentMappingDto } from '..';
import { MinusOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCancel: () => void;
	onRemove?: (item: DocumentMappingDto) => void;
	checkSelected: CheckDto;
	listDocumentChecking: DocumentMappingDto[];
	createSuccess?: () => void;
}

export default class CreateOrUpdateWarningCheck extends React.Component<IProps>{
	private formRef: any = React.createRef();
	state = {
		isLoadDone: true,
		idSelected: -1,
		ck_start_at: moment() || null,
	}
	checkSelected: CheckDto;
	document_checking_list: DocumentDto[];

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.checkSelected.ck_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.checkSelected.ck_id });

		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.props.listDocumentChecking !== prevProps.listDocumentChecking) {
			this.initData(this.props.checkSelected);
		}
	}


	initData = async (inputcheck: CheckDto | undefined) => {
		this.setState({ isLoadDone: false, ck_start_at: undefined });
		if (inputcheck !== undefined && inputcheck.ck_id !== undefined) {
			if (inputcheck.ck_start_at != undefined) {
				this.setState({
					ck_start_at: moment(inputcheck.ck_start_at, "DD/MM/YYYY"),

				})
			}
			await this.formRef.current!.setFieldsValue({ ...inputcheck, });
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });

	}

	onCreate = () => {
		const form = this.formRef.current;
		this.setState({ isLoadDone: false });
		form!.validateFields().then(async (values: any) => {
			let unitData = new CreateCheckInput(values);
			if (this.props.listDocumentChecking.length > 0) {
				let created_ckeck = await stores.checkStore.createCheck(unitData);
				this.onCreateCheckingItems(created_ckeck.ck_id);
				message.success(L('SuccessfullyAdded'));
				await this.onCreateSuccess();
				this.setState({ isLoadDone: true });
			}
			else {
				this.setState({ isLoadDone: true });
				message.warning(L('tao_ke_hoach_kiem_ke_that_bai_do_khong_co_tai_lieu_de_kiem_ke'));
				this.setState({ isLoadDone: true });
			}
		})
	};

	onCreateCheckingItems = async (ck_id: number) => {
		const { listDocumentChecking } = this.props;
		let unitData: CreateCheckItemInput[] = [];
		listDocumentChecking.map((item: DocumentMappingDto) => {
			let item_data = new CreateCheckItemInput();
			item_data.ck_it_note = "";
			item_data.ck_id = ck_id;
			item_data.do_id = new ItemDocument();
			item_data.do_id.id = item.do_id;
			item_data.do_id.name = item.do_title;
			unitData.push(item_data);
		});
		await stores.checkItemStore.createListCheckItem(unitData);
	};

	onRemoveItem = async (item: DocumentMappingDto) => {
		this.setState({ isLoadDone: false });
		if (!!this.props.onRemove) {
			await this.props.onRemove(item);
		}
		this.setState({ isLoadDone: true });

	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateSuccess = () => {
		if (!!this.props.createSuccess) {
			this.props.createSuccess();
		}

	}
	render() {
		const { checkSelected, listDocumentChecking } = this.props;
		const columns: ColumnsDisplayType<any> = [
			{ title: L('stt'), allowSort: true, displayDefault: true, key: ('doccument_index_warning_check'), width: 50, fixed: "left", render: (text: string, item: DocumentMappingDto, index: number) => <div>{index + 1}</div> },
			{ title: L('ten_tai_lieu'), allowSort: true, displayDefault: true, key: ('do_title_warning_check'), width: "12%", render: (text: string, item: DocumentMappingDto) => <div>{item.do_title}</div> },
			{ title: L('tac_gia'), allowSort: true, displayDefault: true, key: ('do_author_warning_check'), render: (text: string, item: DocumentMappingDto) => <div>{stores.sessionStore.getNameAuthor(item.au_id_arr)}</div> },
			{ title: L('ngay_khai_thac'), allowSort: true, displayDefault: true, key: 'do_date_available_warning_check', width: 100, render: (text: string, item: DocumentMappingDto) => <div>{moment(item.do_date_available).format("DD/MM/YYYY")}</div> },
			{ title: L('nha_xuat_ban'), displayDefault: true, key: 'pu_id_warning_check', render: (text: string, item: DocumentMappingDto) => <div>{item.pu_id.name}</div> },
			{ title: L('chu_de'), displayDefault: true, key: 'to_id_warning_check', render: (text: string, item: DocumentMappingDto) => <div>{stores.sessionStore.getNameTopic(item.to_id)}</div> },
			{ title: L('danh_muc'), displayDefault: true, key: 'ca_id_warning_check', render: (text: string, item: DocumentMappingDto) => <div>{stores.sessionStore.getNameCategory(item.ca_id)}</div> },
			{ title: L('ngay_den_han_kiem_ke'), displayDefault: false, key: 'checking_date_warning_check', render: (text: string, item: DocumentMappingDto) => <div>{moment(item.do_date_available).add(item.do_period_check, "day").format("DD/MM/YYYY")}</div> },
			{
				title: "", displayDefault: false, key: 'action_warning_check', render: (text: string, item: DocumentMappingDto) =>
					<div>{!item.is_viewed && <Button danger type='primary' icon={<MinusOutlined />} title={L("bo_chon_tai_lieu")} size='small' onClick={() => this.onRemoveItem(item)} />}</div>
			},
		];
		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.idSelected === undefined ? L("them_ke_hoach_kiem_ke") : L('chinh_sua_ke_hoach_kiem_ke"') + ": " + checkSelected.ck_code}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						{checkSelected.ck_process != eProcess.Sign.num &&
							<Button type="primary" onClick={() => this.onCreate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
								{L("luu")}
							</Button>}
					</Col>
				</Row>
				<Row style={{ marginTop: 20, display: 'flex', flexDirection: "column" }}>
					<Form ref={this.formRef}>
						<Col  {...cssColResponsiveSpan(23, 24, 24, 24, 24, 24)}>
							<Form.Item label={L('ten_kiem_ke')} {...AppConsts.formItemLayout} name={'ck_name'} rules={[rules.required, rules.noAllSpaces]} hasFeedback>
								<Input placeholder={L("ten_kiem_ke") + "..."} maxLength={AppConsts.maxLength.name} />
							</Form.Item>
							<Form.Item label={L('CheckStartDate')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'ck_start_at'} hasFeedback valuePropName='ck_start_at'>
								<DatePicker
									placeholder={L("CheckStartDate") + "..."}
									onChange={(date: Moment | null, dateString: string) => { this.setState({ ck_start_at: date }); this.formRef.current.setFieldsValue({ ck_start_at: date }); }}
									format={"DD/MM/YYYY"}
									allowClear
									style={{ width: "100%" }}
									disabledDate={(current) => current ? current <= moment().startOf('day') : false}
								/>
							</Form.Item>
							<Form.Item label={L('ParticipantInTheCheck')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'us_id_participant'}>
								<SelectUser mode='multiple' role_user={eUserType.Manager.num} userItem={checkSelected.ck_id! == undefined ? checkSelected.us_id_participant : []} onChangeUser={(value: ItemUser[]) => this.formRef.current!.setFieldsValue({ us_id_participant: value })} />
							</Form.Item>
							<Form.Item label={L('Describe')} {...AppConsts.formItemLayout} name={'ck_desc'} valuePropName='data'
								getValueFromEvent={(event, editor) => {
									const data = editor.getData();
									return data;
								}}
							>
								<CKEditor editor={ClassicEditor} />
							</Form.Item>
						</Col>
					</Form>
				</Row>
				<Row>
					<Col span={24}>
						<Table
							className='centerTable'
							loading={!this.state.isLoadDone}
							rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
							size={'middle'}
							bordered={true}
							scroll={{ x: 1000 }}
							locale={{ "emptyText": L('khong_co_du_lieu') }}
							columns={columns}
							dataSource={[...listDocumentChecking]}
							pagination={false}
						/>
					</Col>
				</Row>
			</Card >
		)
	}
}