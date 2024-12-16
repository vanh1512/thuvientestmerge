import * as React from 'react';
import { Button, Col, Row, Table, Modal, message } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { L } from '@src/lib/abpUtility';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import readXlsxFile from 'read-excel-file';
import { CreateSubFieldWithCodeMarc21Input } from '@src/services/services_autogen';
import { PlusOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';


export interface IProps {
	onRefreshData: () => void;
	onCancel: () => void;
	visible: boolean;
}

const { confirm } = Modal;

export default class ModalImportSubfieldMarc21 extends React.Component<IProps>{
	state = {
		isLoadDone: false,
	}

	componentDidUpdate(prevProps) {
		if (prevProps.visible !== this.props.visible) {
			this.dataExcel = [];
		}
	}
	fileInput: any = React.createRef();
	dataExcel: CreateSubFieldWithCodeMarc21Input[] = [];
	onCancel = () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}
	readExcel = async (input) => {
		if (input != null) {
			let item = input.target.files[0];
			readXlsxFile(item).then((rows) => {
				this.dataExcel = [];
				let length = rows.length;
				if (rows != undefined && length > 1) {
					for (let i = 1; i < length; i++) {
						let itemCreate: CreateSubFieldWithCodeMarc21Input = new CreateSubFieldWithCodeMarc21Input();
						let item = rows[i];
						// kiểm tra dữ liệu import
						if (!item[1] || !item[2]) {
							message.error(L('du_lieu_bi_thieu_vui_long_kiem_tra_lai_file_excel'));
							break;
						}
						//  Giới hạn item 1 tối đa 50 ký tự
						else if (item[1].toString().length > 3) {
							message.error(L('ma_marc21_khong_duoc_dai_qua_3_ky_tu'))
							break;
						}
						else if (item[2].toString().length > 2) {
							message.error(L('ma_truong_con_khong_duoc_dai_qua_2_ky_tu'))
							break;
						}
						// else if (item[2].toString().length > AppConsts.maxLength.name) {
						// 	message.error(L('ma_truong_con_khong_duoc_dai_qua_50_ky_tu'))
						// 	break;
						// }
						else {
							// itemCreate.mar_code = item[1].toString();
							itemCreate.sub_code = item[2].toString()
							itemCreate.sub_desc = item[3] != null ? item[3].toString() : "";
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
				await stores.subFieldMarc21Store.createListSubFieldMarc21(self.dataExcel);
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
			{ title: L('STT'), key: 'lang_id_index', render: (text: number, item: any, index: number) => <div>{index + 1}</div>, },
			{ title: L('ma_marc21'), dataIndex: 'mar_code', key: 'mar_code', render: (text: string) => <div>{text}</div> },
			{ title: L('ma_truong_con'), dataIndex: 'sub_code', key: 'sub_code', render: (text: string) => <div>{text}</div> },
			{ title: L('Description'), dataIndex: 'sub_desc', key: 'sub_desc', render: (text: string) => <div>{text}</div> },
		];
		return (
			<Modal
				visible={this.props.visible}
				closable={false}
				footer={null}
				width='80vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
				title={L("NHAP_DU_LIEU_TRUONG_CON_MARC21")}
			>
				<Row gutter={[8, 8]} style={{ fontSize: 16, fontWeight: "bold" }}>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 15, 15)} style={{ textAlign: "left" }} >
						<Icon type="warning" style={{ color: "red", fontSize: 24 }} /> <strong> {L('luu_y: du_lieu_cap_nhat_cho_he_thong_phai_giong_voi_tep_mau')} </strong>&nbsp;
						<Button type="default" style={{ color: 'red', backgroundColor: 'floralwhite' }} title={L('du_lieu_mau')} target="_blank" href={process.env.PUBLIC_URL + "/sample_import/truong_con_marc21_mau.xlsx"}>
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
					<Button title={L("tai_danh_sach")} icon={<PlusOutlined />} type="dashed" onClick={this.onFocusInput} style={{ width: '100%', height: '50px', textAlign: 'center' }}>
					</Button>
					<input ref={fileInput => this.fileInput = fileInput} type="file"
						multiple={false} id="fileImportExcelEO"
						name="file" style={{ display: 'none' }}
						accept=".xlsx, .xls"
						onChange={this.readExcel}

					/>
				</Row>
				<Row style={{ marginTop: 10, overflow: 'auto', height: "60vh" }}>
					<Table
						style={{ width: '100%' }}
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