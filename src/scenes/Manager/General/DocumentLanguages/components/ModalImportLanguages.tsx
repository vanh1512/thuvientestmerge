import * as React from 'react';
import { Button, Col, Row, Table, Modal, message } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { L } from '@src/lib/abpUtility';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import readXlsxFile from 'read-excel-file';
import {CreateLanguagesInput } from '@src/services/services_autogen';
import { PlusOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';

export interface IProps {
	onRefreshData: () => void;
	onCancel: () => void;
	visible: boolean;
}

const { confirm } = Modal;

export default class ModalImportLanguages extends React.Component<IProps>{
	state = {
		isLoadDone: false,
	}

	async componentDidMount() {
		this.dataExcel = [];
	}

	fileInput: any = React.createRef();
	dataExcel: CreateLanguagesInput[] = [];
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
				if (rows != undefined && rows.length > 1) {

					for (let i = 1; i < rows.length; i++) {
						let itemCreate: CreateLanguagesInput = new CreateLanguagesInput();
						let item = rows[i];
						 // kiểm tra dữ liệu import
						 if(!item[1]){
							message.error(L('du_lieu_bi_thieu_vui_long_kiem_tra_lai_file_excel'));
							return;
						}
						itemCreate.la_title =item[1].toString();
						this.dataExcel.push(itemCreate);
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
				await stores.languagesStore.createListLanguages(self.dataExcel);
				message.success(L('nhap_du_lieu_thanh_cong')+ " " + self.dataExcel.length + " " + L('du_lieu_da_vao_he_thong'));
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
			{ title: L('stt'), key: 'lang_id_index', render: (text: number, item: any, index: number) => <div>{index + 1}</div>, },
			{ title: L('Language'), dataIndex: 'la_title', key: 'la_title', render: (text: string) => <div>{text}</div> },
		];
		return (
			<Modal
				visible={this.props.visible}
				closable={false}
				footer={null}
				width='70vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
				// title="NHẬP DỮ LIỆU NGÔN NGỮ"
			>
				<Row gutter={[8, 8]} style={{ fontSize: 16, fontWeight: "bold" }}>
				<Col {...cssColResponsiveSpan(24, 24, 24, 24, 15, 15)} style={{textAlign: "left" }} >
						<Icon type="warning" style={{ color: "red", fontSize: 24 }} />&nbsp; <strong> {L('luu_y: du_lieu_cap_nhat_cho_he_thong_phai_giong_voi_tep_mau')} </strong>&nbsp;
						<Button type="default" style={{ color: 'red', backgroundColor: 'floralwhite' }} title={L('du_lieu_mau')} target="_blank" href={process.env.PUBLIC_URL + "/sample_import/ngon_ngu_mau.xlsx"}>
							<Icon type="download" />{L('file_mau')}
						</Button>
					</Col>

					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 9, 9)} className='textAlign-col-1200' >
						<strong style={{ fontSize: '16px' }}>{L('tong')} : {this.dataExcel.length} {L('hang')}</strong>
						<Button
							danger
							style={{ marginLeft: "5px" }}
							type="ghost" title={L('huy')}
							onClick={() => this.onCancel()}
						>
							{L('huy')}
						</Button>
						<Button
							style={{ marginLeft: "5px", marginTop:"10px" }}
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