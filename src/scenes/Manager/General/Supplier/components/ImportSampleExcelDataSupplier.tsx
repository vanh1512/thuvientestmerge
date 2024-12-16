import * as React from 'react';
import { Button, Card, Col, Row, Table, Modal, message } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { L } from '@src/lib/abpUtility';
import { CreateSupplierInput } from '@src/services/services_autogen';
import readXlsxFile from 'read-excel-file';
import { PlusOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';

export interface IProps {
    onRefreshData: () => void;
    onCancel: () => void;
}

const { confirm } = Modal;
export default class ImportSampleExcelDataSupplier extends React.Component<IProps>{
    state = {
        isLoadDone: false,
    }

    async componentDidMount() {
        this.dataExcel = [];
    }

    fileInput: any = React.createRef();
    dataExcel: CreateSupplierInput[] = [];
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
                        let itemCreate: CreateSupplierInput = new CreateSupplierInput();
                        let item = rows[i];
                        // kiểm tra dữ liệu import
                        if (!item[1 ] || !item[3] || !item[4] || !item[5] || !item[6]) {
                            message.error(L('du_lieu_bi_thieu_vui_long_kiem_tra_lai_file_excel'));
                            return;
                        }
                        if (item[1].toString().length > AppConsts.maxLength.name) {
                            message.error('ma_so_thue_dai_hon_300_ky_tu_vui_long_kiem_tra_lai_file_excel');
                            return;
                        }
                        if (item[3].toString().length > AppConsts.maxLength.name) {
                            message.error(L('ten_khong_duoc_dai_qua_300_ky_tu'))
                            return;
                        }
                        if (item[4].toString().length > AppConsts.maxLength.name){
                            message.error(L('ten_khong_duoc_dai_qua_300_ky_tu'));
                            return;
                        }
                        
                        if (!AppConsts.testPhoneNumber(item[6]!.toString())) {
                            message.error(L('so_dien_thoai_chua_dung'));
                            return;
                        }                       

                        itemCreate.su_tax_code = item[1].toString();
                        itemCreate.su_short_name = item[2] != null ? item[2].toString() : '';
                        itemCreate.su_name = item[3].toString();
                        itemCreate.su_contact_address = item[4].toString();
                        itemCreate.su_contact_name = item[5].toString();
                        itemCreate.su_contact_phone = item[6].toString();
                        itemCreate.su_contact_fax = item[7] != null ? item[7].toString() : '';
                        itemCreate.su_contact_email = item[8] != null ? item[8].toString() : '';
                        itemCreate.su_contact_note = item[9] != null ? item[9].toString() : '';
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
                await stores.supplierStore.createListSupplier(self.dataExcel);
                message.success(L('nhap_du_lieu_thanh_cong') + " " + self.dataExcel.length + " " + L('du_lieu_da_vao_he_thong'));
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
            { title: L('N.o'), dataIndex: '', key: 'no_Supplier_index', render: (text: string, item: any, index: number) => <div>{index + 1}</div> },
            { title: L('TaxCode'), dataIndex: "su_tax_code", key: 'su_tax_code', render: (text: string,) => <div>{text}</div> },
            { title: L('ShortName'), dataIndex: "su_short_name", key: 'su_short_name', render: (text: string) => <div>{text}</div> },
            { title: L('SupplierName'), dataIndex: "su_name", key: 'su_name', render: (text: string) => <div>{text}</div> },
            { title: L('Address'), dataIndex: "su_contact_address", key: 'su_contact_address', render: (text: string) => <div>{text}</div> },
            { title: L('Contact'), dataIndex: "su_contact_name", key: 'su_contact_name', render: (text: string) => <div>{text}</div> },
            { title: L('so_dien_thoai'), dataIndex: "su_contact_phone", key: 'su_contact_phone', render: (text: string) => <div>{text}</div> },
            { title: L('Fax'), dataIndex: "su_contact_fax", key: 'su_contact_fax', render: (text: string) => <div>{text}</div> },
            { title: L('Email'), dataIndex: "su_contact_email", key: 'su_contact_email', render: (text: string) => <div>{text}</div> },
            { title: L('Note'), dataIndex: "su_contact_note", key: 'su_contact_note', render: (text: string) => <div>{text}</div> },

        ];
        return (
            <>
                <Row gutter={[8, 8]} style={{ fontSize: 16, fontWeight: "bold" }}>
                    <Col {...cssColResponsiveSpan(24, 24, 24, 24, 15, 15)} style={{ textAlign: "left" }} >
                        <Icon type="warning" style={{ color: "red", fontSize: 24 }} />&nbsp; <strong> {L('luu_y: du_lieu_cap_nhat_cho_he_thong_phai_giong_voi_tep_mau')} </strong>&nbsp;
                        <Button type="default" style={{ color: 'red', backgroundColor: 'floralwhite' }} title={L('du_lieu_mau')} target="_blank" href={process.env.PUBLIC_URL + "/sample_import/nha_cung_cap_mau.xlsx"}>
                            <Icon type="download" />{L('file_mau')}
                        </Button>
                    </Col>

                    <Col {...cssColResponsiveSpan(24, 24, 24, 24, 9, 9)} className='textAlign-col-1200' >
                        <strong style={{ fontSize: '16px' }}>{L('tong')} {this.dataExcel.length} {L('hang')}</strong>
                        <Button
                            danger
                            style={{ marginLeft: "5px", marginBottom: "10px" }}
                            type="ghost" title={L('huy')}
                            onClick={() => this.onCancel()}
                        >
                            {L('huy')}
                        </Button>
                        <Button
                            style={{ marginLeft: "5px" }}
                            type="primary" title={L('nhap_du_lieu')}
                            onClick={() => this.createListLSC()}
                        >
                            {L('nhap_du_lieu')}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <h3>{L('tai_danh_sach')}:</h3>
                    <Button title={L('tai_danh_sach')} icon={<PlusOutlined />} type="dashed" onClick={this.onFocusInput} style={{ width: '100%', height: '50px', textAlign: 'center' }}>

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
                        rowKey={record => "importdatasupplier" + JSON.stringify(record)}
                        size={'middle'}
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