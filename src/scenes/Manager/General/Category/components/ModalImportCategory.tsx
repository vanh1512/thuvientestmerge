import * as React from 'react';
import { Button, Card, Col, Row, Table, Modal, message } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { L } from '@src/lib/abpUtility';
import readXlsxFile from 'read-excel-file';
import { CreateAuthorInput, CreateCategoryInput } from '@src/services/services_autogen';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import SelectTreeCategory from '@src/components/Manager/SelectTreeCategory';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';

export interface IProps {
    onRefreshData: () => void;
    onCancel: () => void;
}

const { confirm } = Modal;

export default class ModalImportCategory extends React.Component<IProps>{
    state = {
        isLoadDone: false,
        ca_id: -2,
    }

    async componentDidMount() {
        this.dataExcel = [];
    }

    fileInput: any = React.createRef();
    dataExcel: CreateCategoryInput[] = [];
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
                        let itemCreate: CreateCategoryInput = new CreateCategoryInput();
                        let item = rows[i];
                        if (!item[1] || !item[2] || item[3] == null) {
                            message.error(L('khong_duoc_de_trong_truong_nao_trong_file_du_lieu'));
                            return;
                        }
                        if (+item[3] < 0 || !Number.isInteger(+item[3])) {
                            message.error(L('so_bat_dau_khong_duoc_am'));
                            return;
                        }
                        // Giới hạn item 1 tối đa 30 ký tự
                        if (item[1].toString().length > 100) {
                            message.error(L('ten_danh_muc_khong_duoc_dai_qua_50_ky_tu'))
                            return;
                        }
                        // Giới hạn item 2 tối đa 50 ký tự1
                        if (item[2].toString().length > AppConsts.maxLength.code) {
                            message.error(L('ten_danh_muc_khong_duoc_dai_qua_50_ky_tu'))
                        }
                        itemCreate.ca_title = item[1].toString();
                        itemCreate.dkcb_code = item[2].toString();
                        itemCreate.dkcb_start = Number(item[3]);
                        itemCreate.ca_abstract = item[4] != null ? item[4].toString() : "";
                        itemCreate.ca_id_parent = this.state.ca_id;
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
        if (this.state.ca_id == -2) {
            message.error(L('vui_long_chon_truong_de_them_vao'));
            return;
        }
        confirm({
            title: L('kiem_tra_du_lieu_va_nhap_vao_he_thong'),
            okText: L('nhap_du_lieu'),
            cancelText: L('huy'),
            async onOk() {
                await stores.categoryStore.createListCategory(self.dataExcel);
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
        if (this.state.ca_id == -2) {
            message.error(L("hay_chon_danh_muc_de_them_du_lieu"));
            return;
        } else {
            this.fileInput.click();
        }
    }
    render() {
        const columns = [
            { title: L('N.O'), key: 'au_id_index', render: (text: number, item: any, index: number) => <div>{index + 1}</div>, },
            { title: L('so/ma_dang_ky_ca_biet'), dataIndex: 'dkcb_code', key: 'dkcb_code', render: (text: string) => <div>{text}</div> },
            { title: L('ten_danh_muc'), dataIndex: 'ca_title', key: 'ca_title', render: (text: string) => <div>{text}</div> },
            { title: L('so_bat_dau'), dataIndex: 'dkcb_start', key: 'dkcb_start', render: (text: number) => <div>{text}</div> },
            { title: L('Describe'), dataIndex: 'ca_abstract', key: 'ca_abstract', render: (text: string) => <div>{text}</div> },
        ];
        return (
            <>
                <Row style={{ fontSize: 16, fontWeight: "bold" }}>
                    <Col span={24} style={{ textAlign: "left" }} >
                        <Icon type="warning" style={{ color: "red", fontSize: 24 }} />&nbsp; <strong> {L('luu_y: du_lieu_cap_nhat_cho_he_thong_phai_giong_voi_tep_mau')} </strong>&nbsp;
                        <Button type="default" style={{ color: 'red', backgroundColor: 'floralwhite' }} title={L('du_lieu_mau')} target="_blank" href={process.env.PUBLIC_URL + "/sample_import/danh_muc_mau.xlsx"}>
                            <Icon type="download" />{L('file_mau')}
                        </Button>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 24, 8, 12, 16)} style={{ marginTop: "10px" }} >
                        <SelectTreeCategory onClear={() => this.setState({ ca_id: -2 })} ca_id_select={this.state.ca_id == -2 ? undefined : this.state.ca_id} onSelectCategory={(item: number) => { this.setState({ ca_id: item }) }} />
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 24, 16, 12, 8)} style={{ marginTop: "10px", display: 'flex', justifyContent: "center", flexWrap: "wrap" }} >
                        <p><strong style={{ fontSize: '16px', marginRight: 15 }}>{L('Total')} : {this.dataExcel.length} {L('hang')}</strong></p>
                        <div style={{ display: 'flex', gap: "15px" }}>
                            <Button
                                danger
                                type="ghost" title={L('huy')}
                                onClick={() => this.onCancel()}
                            >
                                {L('huy')}
                            </Button>
                            <Button
                                type="primary" title={L('nhap_du_lieu')}
                                onClick={() => this.createListLSC()}
                            >
                                {L('nhap_du_lieu')}
                            </Button>
                        </div>
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
                        rowKey={record => "importstudentfromexcel_index___" + JSON.stringify(record)}
                        size={'large'}
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