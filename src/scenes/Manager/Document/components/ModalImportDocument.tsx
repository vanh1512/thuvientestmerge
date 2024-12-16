import * as React from 'react';
import { Button, Col, Row, Table, Modal, message } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { L } from '@src/lib/abpUtility';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import readXlsxFile from 'read-excel-file';
import { ImportDocumentInput } from '@src/services/services_autogen';
import { PlusOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import moment from 'moment';


export interface IProps {
	onRefreshData: () => void;
	onCancel: () => void;
	visible: boolean;
}

const { confirm } = Modal;

export default class ModalImportDocument extends React.Component<IProps>{
	state = {
		isLoadDone: true,
	}

	componentDidUpdate(prevProps) {
		if (prevProps.visible !== this.props.visible) {
			this.dataExcel = [];
		}
	}
	fileInput: any = React.createRef();
	dataExcel: ImportDocumentInput[] = [];
	onCancel = () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}
	readExcel = async (input) => {
		this.setState({ isLoadone: false })
		if (input != null) {
			let item = input.target.files[0];
			readXlsxFile(item).then((rows) => {
				this.dataExcel = [];
				let length = rows.length;
				if (rows != undefined && length > 1) {
					for (let i = 1; i < length; i++) {
						let itemCreate: ImportDocumentInput = new ImportDocumentInput();
						let item = rows[i];
						// kiểm tra dữ liệu import
						if (!item[1] || !item[8] || !item[9] || !item[10] || !item[11] || !item[12] || !item[13] || !item[14] || !item[15] || !item[16]) {
							message.error(L('du_lieu_bi_thieu_vui_long_kiem_tra_lai_file_excel'));
							break;
						}
						//  Giới hạn item 1 tối đa 255 ký tự
						else if (item[1].toString().length > 255) {
							message.error(L('ten_tai_lieu_khong_duoc_dai_qua_255_ky_tu'))
							break;
						}
						else if (item[5] != null && +item[5] < 0 && !Number.isInteger(+item[5])) {
							message.error(L('so_trang_phai_la_so_nguyen_duong'));
							break;
						}
						else if (item[6] != null && +item[6] < 0 && !Number.isInteger(+item[6])) {
							message.error(L('gia_nhap_phai_la_so_nguyen_duong'));
							break;
						}
						else if (item[7] != null && +item[7] < 0 && !Number.isInteger(+item[7])) {
							message.error(L('so_lan_tai_ban_phai_la_so_nguyen_duong'));
							break;
						}
						else if (item[12] != null && +item[12] < 0 && !Number.isInteger(+item[12])) {
							message.error(L('chu_ky_kiem_ke_la_so_nguyen_duong'));
							break;
						}
						else if (!AppConsts.testDate(item[13]!.toString())) {
							message.error(L('ngay_khai_khac_khong_dung_dinh_dang'));
							break;
						}
						else {
							itemCreate.do_title = item[1].toString();
							itemCreate.au_name_arr = item[2] != null ? item[2].toString().split(",") : [];
							itemCreate.do_abstract = item[3] != null ? item[3].toString() : "";
							itemCreate.do_translator = item[4] != null ? item[4].toString() : "";
							itemCreate.do_nr_pages = item[5] != null ? +item[5] : 0;
							itemCreate.do_price = item[6] != null ? +item[6] : 0;
							itemCreate.do_republish = item[7] != null ? +item[7] : 0;
							itemCreate.do_identifier = item[8].toString();
							itemCreate.lang_name_arr = item[9].toString().split(",");
							itemCreate.pu_name = item[10].toString();
							itemCreate.do_date_publish = item[11].toString();
							itemCreate.do_period_check = +item[12];
							itemCreate.do_date_available = moment(item[13].toString(), "DD/MM/YYYY").toDate();
							itemCreate.fie_name_arr = item[14].toString().split(";");
							itemCreate.to_name = item[15].toString();
							itemCreate.ca_name = item[16].toString();
							this.dataExcel.push(itemCreate);
						}
					}
				}
				this.setState({ isLoadone: true })
			});
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
				await stores.documentStore.importDocuments(self.dataExcel);
				message.success(L('nhap_du_lieu_thanh_cong'));
				if (!!self.props.onRefreshData) {
					self.props.onRefreshData();
				}

			},
			onCancel() {
			},
		});
	}
	onFocusInput = async () => {
		this.fileInput.click();
	}

	render() {
		const columns = [
			{ title: L('STT'), width: 50, key: 'lang_id_index', render: (text: number, item: any, index: number) => <div>{index + 1}</div>, },
			{ title: L('DocumentName'), dataIndex: 'do_title', key: 'do_title', render: (text: string) => <div>{text}</div> },
			{ title: L('Author'), dataIndex: 'au_name_arr', key: 'au_name_arr', render: (text: string) => <div>{text}</div> },
			{ title: L('Description'), dataIndex: 'do_abstract', key: 'do_abstract', render: (text: string) => <div>{text}</div> },
			{ title: L('Translator'), dataIndex: 'do_translator', key: 'do_translator', render: (text: string) => <div>{text}</div> },
			{ title: L('NumberOfPage'), dataIndex: 'do_nr_pages', key: 'do_nr_pages', render: (text: string) => <div>{text}</div> },
			{ title: L('Price'), dataIndex: 'do_price', key: 'do_price', render: (text: string, item: ImportDocumentInput) => <div>{AppConsts.formatNumber(item.do_price)}</div> },
			{ title: L('RepublishedTimes'), dataIndex: 'do_republish', key: 'do_republish', render: (text: string) => <div>{text}</div> },
			{ title: L('Identifier'), dataIndex: 'do_identifier', key: 'do_identifier', render: (text: string) => <div>{text}</div> },
			{
				title: L('Language'), dataIndex: 'lang_name_arr', key: 'lang_name_arr', render: (text: string, item: ImportDocumentInput) =>
					<div>{(!!item.lang_name_arr && item.lang_name_arr.length > 0) && item.lang_name_arr.join(", ")}</div>
			},
			{ title: L('Publisher'), dataIndex: 'pu_name', key: 'pu_name', render: (text: string) => <div>{text}</div> },
			{ title: L('YearOfPublication'), dataIndex: 'do_date_publish', key: 'do_date_publish', render: (text: string) => <div>{text}</div> },
			{ title: L('CheckPeriod'), dataIndex: 'do_period_check', key: 'do_period_check', render: (text: string) => <div>{text}</div> },
			{ title: L('AvailableDate'), dataIndex: 'do_date_available', key: 'do_date_available', render: (text: string) => <div>{moment(text).format("DD/MM/YYYY")}</div> },
			{
				title: L('Field'), dataIndex: 'fie_name_arr', key: 'fie_name_arr', render: (text: string, item: ImportDocumentInput) =>
					<div>{(!!item.fie_name_arr && item.fie_name_arr.length > 0) && item.fie_name_arr.join(", ")}</div>
			},
			{ title: L('Topic'), dataIndex: 'to_name', key: 'to_name', render: (text: string) => <div>{text}</div> },
			{ title: L('Category'), dataIndex: 'ca_name', key: 'ca_name', render: (text: string) => <div>{text}</div> },
		];
		return (
			<Modal
				visible={this.props.visible}
				closable={false}
				footer={null}
				width='100vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
				title={L("NHAP_DU_LIEU_TAI_LIEU")}
			>
				<Row gutter={[8, 8]} style={{ fontSize: 16, fontWeight: "bold" }}>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 15, 15)} style={{ textAlign: "left" }} >
						<Icon type="warning" style={{ color: "red", fontSize: 24 }} /> <strong> {L('luu_y: du_lieu_cap_nhat_cho_he_thong_phai_giong_voi_tep_mau')} </strong>&nbsp;
						<Button type="default" style={{ color: 'red', backgroundColor: 'floralwhite' }} title={L('du_lieu_mau')} target="_blank" href={process.env.PUBLIC_URL + "/sample_import/tai_lieu_mau.xlsx"}>
							<Icon type="download" />{L('file_mau')}
						</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 9, 9)} className='textAlign-col-1200'>
						<strong style={{ fontSize: '16px' }}>{L('Total')} : {this.dataExcel.length} {L('hang')}</strong>
						<Button
							style={{ marginLeft: "5px" }}
							danger
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
				<Row>
					<h3>{L('tai_danh_sach')}:</h3>
					<Button icon={<PlusOutlined />} type="dashed" onClick={this.onFocusInput} style={{ width: '100%', height: '50px', textAlign: 'center' }}>
					</Button>
					<input ref={fileInput => this.fileInput = fileInput} type="file"
						multiple={false} id="fileImportExcelEO"
						name="file" style={{ display: 'none' }}
						accept=".xlsx, .xls"
						onChange={this.readExcel}

					/>
				</Row>
				<Row style={{ marginTop: 10, }}>
					<Table
						loading={!this.state.isLoadDone}
						className='centerTable'
						style={{ width: '100%' }}
						scroll={{ x: 1500, y: 1500 }}
						rowKey={record => "importstudentfromexcel_index___" + JSON.stringify(record)}
						size={'large'}
						bordered={true}
						columns={columns}
						pagination={false}
						locale={{ "emptyText": L('khong_co_du_lieu') }}
						dataSource={this.dataExcel == undefined || this.dataExcel.length == 0 ? [] : this.dataExcel}
					/>
				</Row>
			</Modal>
		);
	}
}