import * as React from 'react';
import { Button, Card, Col, Row, Table, Modal, message, Upload, Image, Avatar } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { L } from '@src/lib/abpUtility';
import readXlsxFile from 'read-excel-file';
import { AttachmentItem, CreateMemberInput, FilesDto } from '@src/services/services_autogen';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import AppConsts, { FileUploadType, cssColResponsiveSpan } from '@src/lib/appconst';
import { RcFile } from 'antd/lib/upload';
import { eGENDER, valueOfeGENDER } from '@src/lib/enumconst';
export interface ImageUrlTest {

}
export interface IProps {
	onRefreshData: () => void;
	onCancel: () => void;
}

const { confirm } = Modal;

export default class ImportExcelMember extends React.Component<IProps>{

	state = {
		isLoadDone: false,
	}

	async componentDidMount() {
		this.dataExcel = [];
	}

	fileInput: any = React.createRef();
	folderInput: any = React.createRef();
	dataExcel: CreateMemberInput[] = [];
	dicImage: {} = {};
	dicFile: {} = {};
	onCancel = () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}
	async createListLSC() {
		let self = this;
		if (self.dataExcel.length < 1) {
			message.error(L('vui_long_chon_file_de_nhap_du_lieu'));
			return;
		}
		confirm({
			title: L('kiem_tra_du_lieu_va_nhap_vao_he_thong'),
			okText: L('nhap_du_lieu'),
			cancelText: L('huy'),
			async onOk() {
				self.setState({ isLoadDone: false });
				Object.entries(self.dicFile).map(async ([key, value], index) => {
					let result: FilesDto = await stores.fileStore.createFile(FileUploadType.Avatar, { "data": value, "fileName": key });
					if (!!result && result.fi_id != undefined) {
						let attachmentItem = new AttachmentItem();
						attachmentItem.id = result.fi_id;
						attachmentItem.key = result.fi_name;
						attachmentItem.ext = result.fi_extension;
						attachmentItem.path = result.fi_path;
						attachmentItem.isdelete = false;
						self.dataExcel[index].fi_id = attachmentItem;
					}
					else {
						message.error(L('thu_muc_anh_co_chua_anh_loi'));
						return;
					}
				});
				// hầm onOK hoạt động ảo lắm nên phải setTimeout mới hoạt động đúng
				setTimeout(async () => {
					await stores.memberStore.createListMembers(self.dataExcel);
					await message.success(L('nhap_du_lieu_thanh_cong') + " " + self.dataExcel.length + " " + L('du_lieu_da_vao_he_thong'))
					if (!!self.props.onRefreshData) {
						self.props.onRefreshData();
					}
				}, 1000);
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});
	}
	onFocusInput = async () => {
		this.fileInput.click();
	}
	uploadExcel = async (options) => {
		const { onSuccess, file } = options;
		onSuccess("done");
		if (file != null) {
			let item = file;
			readXlsxFile(item).then((rows) => {
				this.dataExcel = [];
				if (rows != undefined && rows.length > 1) {
					for (let i = 1; i < rows.length; i++) {
						let itemCreate: CreateMemberInput = new CreateMemberInput();
						let item = rows[i];
						// Kiểm tra dữ liệu import
						if (!item[2] || !item[3] || !item[4] || !item[5] || !item[6] || !item[7] || !item[8] || !item[9] || !item[10] || !item[11]) {
							message.error(L('du_lieu_bi_thieu_vui_long_kiem_tra_lai_file_excel'));
							return;
						}
						//  Giới hạn tên độc giả tối đa 50 ký tự
						if (item[2].toString().length > AppConsts.maxLength.name) {
							message.error(L('ten_khong_duoc_dai_qua_50_ky_tu'));
							return;
						}
						if (item[3].toString().length > AppConsts.maxLength.cccd) {
							message.error(L('cccd_khong_duoc_dai_qua_12_ky_tu'));
							return;
						}
						//Check định dạng ngày sinh
						if (item[4] != null && !AppConsts.testDate(item[4]!.toString())) {
							message.error(L('ngay_sinh_khong_dung_dinh_dang'));
							return;
						}
						if (item[8] != null && !AppConsts.testEmail(item[8]!.toString())) {
							message.error(L('email_khong_dung'));
							return;
						}
						if (item[9] != null && !AppConsts.testUserName(item[9]!.toString())) {
							message.error(L('ky_tu_dau_tien_la_chu_it_nhat_nam_ky_tu_khong_chua_ky_tu_tieng_viet'));
							return;
						}
						if (!AppConsts.testPassword(item[10]!.toString())) {
							message.error(L('PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber'));
							return;
						}
						itemCreate.fi_id = item[1] != null ? AttachmentItem.fromJS({ key: item[1].toString() }) : new AttachmentItem;
						itemCreate.me_name = item[2].toString();
						itemCreate.me_identify = item[3].toString()
						itemCreate.me_birthday = moment(item[4].toString(), "DD/MM/YYYY").format("DD/MM/YYYY");
						itemCreate.me_sex = item[5].toString() == "Nam" ? eGENDER.MALE.num : (item[5].toString() == "Nữ" ? eGENDER.FEMALE.num : eGENDER.OTHER.num);
						itemCreate.me_address = item[6].toString();
						itemCreate.me_phone = item[7].toString();
						itemCreate.emailAddress = item[8].toString();
						itemCreate.userName = item[9].toString();
						itemCreate.password = item[10].toString();
						itemCreate.me_note = item[11] != null ? item[11].toString() : "";
						itemCreate.me_more_infor = item[12] != null ? item[12].toString() : "";
						this.dataExcel.push(itemCreate);
					}
				}
				this.setState({ isLoadone: true })
			});
		}
	}
	uploadImage = async (options) => {
		this.setState({ isLoadDone: false });
		const { onSuccess, file } = options;
		onSuccess("done");
		this.dicFile[file.name] = file;
		let src = await new Promise(resolve => {
			const reader = new FileReader();
			reader.readAsDataURL(file as RcFile);
			reader.onload = () => resolve(reader.result as string);
		});
		this.dicImage[file.name] = src;
		this.setState({ isLoadDone: true });
	}
	render() {
		const columns = [
			{ title: L('N.O'), key: 'au_id_index', width: 50, render: (text: number, item: any, index: number) => <div>{index + 1}</div>, },
			{ title: L('Avatar'), dataIndex: 'au_pen_name', key: 'au_pen_name', render: (text: string, item: CreateMemberInput) => <div>{<Avatar src={item.fi_id == undefined ? "" : !this.dicImage.hasOwnProperty(item.fi_id.key!) ? "" : this.dicImage[item.fi_id.key!]} />}</div> },
			{ title: L('ho_ten'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.me_name}</div> },
			{ title: L('Identification'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.me_identify}</div> },
			{ title: L('ngay_sinh'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.me_birthday}</div> },
			{ title: L('gioi_tinh'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{valueOfeGENDER(item.me_sex)}</div> },
			{ title: L('dia_chi'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.me_address}</div> },
			{ title: L('email'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.emailAddress}</div> },
			{ title: L('so_dien_thoai'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.me_phone}</div> },
			{ title: L('ten_dang_nhap'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.userName}</div> },
			{ title: L('Password'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.password}</div> },
			{ title: L('Note'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.me_note}</div> },
			{ title: L('mo_ta'), dataIndex: 'au_name', key: 'au_name', render: (text: string, item: CreateMemberInput) => <div>{item.me_more_infor}</div> },
		];
		return (
			<>
				<Row gutter={[8, 8]} style={{ fontSize: 16, fontWeight: "bold" }}>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 15, 15)} style={{ textAlign: "left" }} >
						<Icon type="warning" style={{ color: "red", fontSize: 24 }} />&nbsp; <strong> {L('luu_y: du_lieu_cap_nhat_cho_he_thong_phai_giong_voi_tep_mau')} </strong>&nbsp;
						<Button type="default" style={{ color: 'red', backgroundColor: 'floralwhite' }} title={L('du_lieu_mau')} target="_blank" href={process.env.PUBLIC_URL + "/sample_import/doc_gia_mau.xlsx"}>
							<Icon type="download" />{L('file_mau')}
						</Button>
					</Col>

					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 9, 9)} className='textAlign-col-1200'>
						<strong style={{ fontSize: '16px' }}>{L('Total')} : {this.dataExcel.length} {L('hang')}</strong>
						<Button
							danger
							style={{ marginLeft: "5px" }}
							type="ghost" title={L('huy')}
							onClick={() => this.onCancel()}
						>
							{L('huy')}
						</Button>
						<Button
							style={{ marginLeft: "5px", marginTop: "10px" }}
							type="primary" title={L('nhap_du_lieu')}
							onClick={() => this.createListLSC()}
						>
							{L('nhap_du_lieu')}
						</Button>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<h3>{L('tep_excel')}</h3>
						<Upload
							customRequest={this.uploadExcel}
						>
							<Button icon={<UploadOutlined />}>{L('tai_len_tep_excel')}</Button>
						</Upload>
					</Col>
					<Col span={12}>
						<h3>{L('thu_muc_anh')}</h3>
						<Upload
							directory
							customRequest={this.uploadImage}
							showUploadList={false}
							style={{ width: '100%' }}
						>
							<Button style={{ width: '100%' }} icon={<UploadOutlined />}>{L('tai_len_thu_muc_anh')}</Button>
						</Upload>
					</Col>
				</Row>
				<Row style={{ marginTop: 10 }}>
					<Table
						style={{ width: '100%' }}
						rowKey={record => "importstudentfromexcel_index___" + JSON.stringify(record)}
						size={'large'}
						scroll={{ x: 1000, y: 1000 }}
						bordered={true}
						columns={columns}
						pagination={false}
						locale={{ "emptyText": L('khong_co_du_lieu') }}
						dataSource={this.dataExcel == undefined || this.dataExcel.length == 0 ? [] : this.dataExcel}
					/>
				</Row>
			</>
		);
	}
}