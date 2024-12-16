import * as React from 'react';
import { Table, Image, Input, message, Checkbox, Upload, Row, Modal, Typography, Popconfirm, Form, } from 'antd';
import { EditOutlined, PlusOutlined, RestOutlined, } from '@ant-design/icons';
import { CreateLanguagesInput, LanguagesDto, UpdateLanguagesInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { EventTable } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { EditableCell } from '@src/scenes/Manager/Buy/Billing/BillingItem/components/TableMainBillingItem';
import { TableRowSelection } from 'antd/lib/table/interface';
export interface IProps {
	actionTable?: (item: LanguagesDto, event: EventTable) => void;
	onCreateUpdateSuccess?: () => void;
	languagesListResult: LanguagesDto[],
	pagination: TablePaginationConfig | false;
	isLoadDone?: boolean;
	onChangeSelect?: (listItemLanguages: LanguagesDto[], listIdLanguagues: number[]) => void;
}
export default class Tablelanguages extends AppComponentBase<IProps> {
	state = {
		la_id_selected: undefined,
		visibleModalViewFile: false,
		is_editted: false,
		la_flag: "",
		la_title: undefined,
		la_enable: false,
		editingKey: -1,
		isValidInput: true,
	};
	listFile: UploadFile[] = [];
	file: any;
	private form: any = React.createRef();
	onEdit = (item: LanguagesDto) => {
		this.setState({ la_id_selected: item.la_id, la_flag: item.la_flag, la_title: item.la_title, is_editted: true, la_enable: item.la_enable, isValidInput: item.la_title === '' ? false : true, });
		this.listFile = [];
		this.file = {
			uid: item.la_id,
			name: 'image.png',
			status: 'done',
			url: item.la_flag,
		};
		this.listFile.push(this.file);
		this.form.current!.setFieldsValue({ ...item })
		this.setState({ editingKey: item.la_id,});
	}
	isEditing = (record: LanguagesDto) => record.la_id === this.state.editingKey;
	onSave = async (item: LanguagesDto) => {
		await this.setState({ la_id_selected: item.la_id, });
		let unitData = new UpdateLanguagesInput();
		unitData.la_id = this.state.la_id_selected!;
		unitData.la_flag = this.state.la_flag;
		unitData.la_title = this.state.la_title;
		unitData.la_enable = this.state.la_enable;
		await stores.languagesStore.updateLanguages(unitData);
		message.success(L("them_moi_thanh_cong"));
		this.listFile.pop();
		await this.setState({ is_editted: false, la_id_selected: undefined, editingKey: -1, isValidInput: true });
		await this.onCreateUpdateSuccess();
	}
	getBase64 = (file: RcFile): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = error => reject(error);
		});

	changeHandler = async ({ fileList: newFileList }) => {
		this.setState({ isLoadDone: false });
		this.listFile = newFileList;
		if (this.listFile.length > 0) {
			let file: UploadFile = this.listFile[0];
			this.getBase64(file.originFileObj as RcFile)
				.then(result => this.setState({ la_flag: result }));
		}
		this.setState({ isLoadDone: true });
	}
	uploadImage = async (options) => {
		const { onSuccess, onError, file, onProgress } = options;
		onSuccess("done");
	}

	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess();
		}

	}
	actionTable = (item: LanguagesDto, event: EventTable) => {
		if (!!this.props.actionTable) {
			this.props.actionTable(item, event);
		}
	}

	onActionTable = (item: LanguagesDto, event: EventTable) => {
		if (!!this.props.actionTable) { this.props.actionTable(item, event) };
		this.setState({isValidInput: true})
	}
	cancel = () => {
		this.setState({ editingKey: -1, la_id_selected: undefined });
		this.listFile.pop();
	};
	createOrUpdateModalOpen = async (input: LanguagesDto) => {
		if(this.state.isValidInput==false || this.state.editingKey!=-1){
			message.error(L("vui_long_luu_truoc_khi_them_moi"));
			return;
		}
		this.setState({ isLoadDone: false, la_title: undefined });
		await this.form.current!.validateFields()
		let unitData = new CreateLanguagesInput();
		unitData.la_enable = false;
		let result = await stores.languagesStore.createLanguages(unitData);
		this.setState({ la_id_selected: result.la_id });
		await this.form.current!.setFieldsValue({ ...result });
		await this.setState({ editingKey: (await result).la_id })
		await this.onCreateUpdateSuccess();
		await this.setState({ isLoadDone: true, isValidInput: (input.la_title === undefined || input.la_title=="") ? false : true});

	};
	handleInputChange = (e) => {
		const inputValue = e.target.value;
		const regex = /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ_ ]*$/;
		const isValidInput = regex.test(inputValue);
		this.setState({
			la_title: inputValue,
			isValidInput: isValidInput,
		});
	};
	beforeUpload = (file: RcFile) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error(L("anh_phai_la_tep_jpg/png") + "!");
			return Promise.reject(false);
		}

		const limitSize = file.size / 1024 / 1024 < 0.05;
		if (!limitSize) {
			message.error(L('anh_phai_nho_hon_50kb'));
			return Promise.reject(false);
		}
		return true;
	};
	
	render() {
		const uploadButton = (
			<div style={{ borderBlock: "1px" }}>
				<PlusOutlined />
				<div style={{ marginTop: 8 }}>{L("tai_anh_len")}</div>
			</div>
		);
		const self = this;
		const { languagesListResult, pagination, actionTable } = this.props;
		const action: any = {
			title: "",
			dataIndex: 'Action',
			fixed: 'right',
			render: (_: any, record: LanguagesDto) => {
				const editable = this.isEditing(record);
				return editable ? (
					<span>
						{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Edit) &&
							<Typography.Link
								onClick={this.state.isValidInput ? (this.state.la_title != undefined ? () => this.onSave(record) : () => { this.setState({ isValidInput: !this.state.isValidInput }) }) : () => { }}
								style={{ marginRight: 8 }}
							>
								{L('Save')}
							</Typography.Link>
						}

						{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Edit) &&
							<>{record.la_title === "" ?
								<Popconfirm title={L('WantToDelete?')} onConfirm={() => this.onActionTable(record, EventTable.Delete)}>
									<RestOutlined style={{ color: 'red' }} />
								</Popconfirm> :
								<Popconfirm title={L('WantToCancel?')} onConfirm={this.cancel}>
									<a style={{color:"red"}}>{L('Cancel')}</a>
								</Popconfirm>
							}
							</>
						}
					</span>
				) : (
					<span>
						{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Edit) &&
							<Typography.Link onClick={() => this.onEdit(record)}>
								<EditOutlined />
							</Typography.Link>
						}
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Delete) &&
							<Popconfirm title={L('WantToDelete?')} onConfirm={() => this.onActionTable(record, EventTable.Delete)}>
								<RestOutlined style={{ color: 'red' }} />
							</Popconfirm>
						}

					</span>
				);
			},
		};
		const columns = [
			{ title: L('N.O'), dataIndex: "", key: 'no_languages_index', render: (text: string, item: LanguagesDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{
				title: L('Language'), dataIndex: 'la_title', key: 'no_languages_title', editable: true, required: true, render: (text: string, item: LanguagesDto, index: number) =>
					<div>{this.state.la_id_selected == item.la_id ?
						<>
							<Row>
								<Input maxLength={AppConsts.maxLength.language} style={{ width: "50%" }} defaultValue={item.la_title} onChange={this.handleInputChange} />
								&nbsp;&nbsp;
								{L("IsEnable")}: <Checkbox defaultChecked={item.la_enable} onChange={() => this.setState({ la_enable: !item.la_enable })} />
							</Row>
							<Row></Row>
							{!this.state.isValidInput && <div style={{ color: 'red' }}>{L("khong_hop_le")}</div>}
						</>
						: item.la_title} </div>
			},
			{
				title: L('Avatar'), key: 'no_languages_flag ', dataIndex: 'la_flag', render: (text: string, item: LanguagesDto, index: number) => <div>{
					this.state.la_id_selected == item.la_id ?
						<Row>
							<Upload
								beforeUpload={this.beforeUpload}
								customRequest={this.uploadImage}
								listType="picture-card"
								fileList={this.listFile}
								onChange={this.changeHandler}
							>
								{this.listFile.length >= 1 ? null : uploadButton}
							</Upload>

						</Row>
						: <Image style={{ cursor: 'pointer' }} src={(item.la_flag != undefined && item.la_flag != "") ? item.la_flag : process.env.PUBLIC_URL + '/icon_file_sample/no_image.png'} height={100} width={100} />
				}</div>
			},

		];
		if (actionTable != undefined && this.isGranted(AppConsts.Permission.General_DocumentLanguages_Edit || AppConsts.Permission.General_DocumentLanguages_Delete)) {
			columns.push(action);
		}
		const rowSelection: TableRowSelection<LanguagesDto> = {

			onChange: (listKeyLanguagues: React.Key[], listItemLanguages: LanguagesDto[]) => {
				let listIdLanguagues = listItemLanguages.length > 0 ? listItemLanguages.map(item => item.la_id) : [];
	
	
				if (!!this.props.onChangeSelect) {
					this.props.onChangeSelect(listItemLanguages, listIdLanguagues)
				}
			}
		}
		return (
			<Form ref={this.form} component={false} >
				<Table
					rowSelection={!!this.props.actionTable ? rowSelection : undefined}
					className="centerTable"
					loading={!this.props.isLoadDone}
					rowClassName={(record, index) => (this.state.la_id_selected === record.la_id) ? "bg-click" : "bg-white"}
					rowKey={record => "languages_table_" + JSON.stringify(record)}
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					size={'middle'}
					bordered={true}
					locale={{ "emptyText": L('khong_co_du_lieu') }}
					columns={columns}
					dataSource={languagesListResult.length > 0 ? languagesListResult : []}
					pagination={this.props.pagination}

				/>

				<Modal
					width={'50vw'}
					destroyOnClose={true}
					visible={this.state.visibleModalViewFile}
					footer={null}
					onCancel={() => this.setState({ visibleModalViewFile: false })}
					cancelText={L("huy")}
					title="File"
				>
				</Modal>
			</Form>
		)
	}
}