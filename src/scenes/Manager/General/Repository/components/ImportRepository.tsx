import * as React from 'react';
import { Button, Card, Col, Row, Table, Modal, message } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { L } from '@src/lib/abpUtility';
import readXlsxFile from 'read-excel-file';
import { CreateReponsitoryInput } from '@src/services/services_autogen';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import SelectTreeResponsitory from '@src/components/Manager/SelectTreeResponsitory';
import { valueOfeRepositorType } from '@src/lib/enumconst';
import { cssColResponsiveSpan } from '@src/lib/appconst';


export interface IProps {
    onRefreshData: () => void;
    onCancel: () => void;
}

const { confirm } = Modal;

export default class ImportRepository extends React.Component<IProps>{
    state = {
        isLoadDone: false,
        re_id: -2,
    }

    async componentDidMount() {
        this.dataExcel = [];
    }

    fileInput: any = React.createRef();
    dataExcel: CreateReponsitoryInput[] = [];
    onCancel = () => {
        if (this.props.onCancel !== undefined) {
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
                        let itemCreate: CreateReponsitoryInput = new CreateReponsitoryInput();
                        let item = rows[i];
                        if (!item[1] || !item[2] || !item[4]) {
                            message.error(L('khong_duoc_de_trong_truong_nao_trong_file_du_lieu'));
                            return;
                        }
                        itemCreate.re_code = item[1].toString();
                        itemCreate.re_name = item[2].toString();
                        itemCreate.re_desc = item[3] != null ? item[3].toString() : "";
                        if (item[4].toString() == L("Depot")) itemCreate.re_type = Number(1);
                        if (item[4].toString() == L("Box")) itemCreate.re_type = Number(2);
                        if (item[4].toString() == L("Shelf")) itemCreate.re_type = Number(3);
                        if (item[4].toString() == L("Cabinet")) itemCreate.re_type = Number(4);
                        itemCreate.re_id_parent = this.state.re_id;
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
        if (this.state.re_id == -2) {
            message.warning(L('vui_long_chon_truong_de_them_vao'));
            return;
        }
        confirm({
            title: L('kiem_tra_du_lieu_va_nhap_vao_he_thong'),
            okText: L('nhap_du_lieu'),
            cancelText: L('huy'),
            async onOk() {
                await stores.reponsitoryStore.createListReponsitory(self.dataExcel);
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
        if (this.state.re_id == -2) {
            message.error(L("hay_chon_kho_de_them_du_lieu"));
            return;
        } else {
            this.fileInput.click();
        }
    }

    render() {
        const columns = [
            { title: L('N.O'), key: 'au_id_index', render: (text: number, item: any, index: number) => <div>{index + 1}</div>, },
            { title: L('ma_kho'), dataIndex: 're_code', key: 're_code', render: (text: string) => <div>{text}</div> },
            { title: L('ten_kho'), dataIndex: 're_name', key: 're_name', render: (text: string) => <div>{text}</div> },
            { title: L('loai_kho'), dataIndex: 're_type', key: 're_type', render: (text: number) => <div>{valueOfeRepositorType(text)}</div> },
            { title: L('Description'), dataIndex: 're_desc', key: 're_desc', render: (text: string) => <div>{text}</div> },
        ];
        return (
            <Card>
                <Row gutter={[8, 8]} style={{ fontSize: 16, fontWeight: "bold" }}>
                    <Col {...cssColResponsiveSpan(24, 24, 24, 24, 15, 15)} style={{ textAlign: "left" }} >
                        <Icon type="warning" style={{ color: "red", fontSize: 24 }} />&nbsp; <strong> {L('luu_y: du_lieu_cap_nhat_cho_he_thong_phai_giong_voi_tep_mau')} </strong>&nbsp;
                        <Button type="default" style={{ color: 'red', backgroundColor: 'floralwhite' }} title={L('du_lieu_mau')} target="_blank" href={process.env.PUBLIC_URL + "/sample_import/kho_vat_ly_mau.xlsx"}>
                            <Icon type="download" />{L('file_mau')}
                        </Button>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 24, 24, 9, 9)} className='textAlign-col-1200' >
                        <strong style={{ fontSize: '16px' }}>{L('tong')} {this.dataExcel.length} {L('hang')}</strong>
                        <Button
                            danger
                            style={{ marginLeft: "5px" }}
                            type="ghost" title={L('huy')}
                            onClick={() => this.onCancel()}
                        >
                            {L('huy')}
                        </Button>
                        <Button
                            style={{ marginLeft: "5px", marginTop: "5px" }}
                            type="primary" title={L('nhap_du_lieu')}
                            onClick={() => this.createListLSC()}
                        >
                            {L('nhap_du_lieu')}
                        </Button>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 15, 15, 12, 12)} style={{ paddingTop: '10px', justifyContent: 'center' }} >
                        <SelectTreeResponsitory onClear={() => this.setState({ re_id: -2 })} re_id_select={this.state.re_id != -2 ? this.state.re_id : undefined} onSelectRepository={(item: number) => { this.setState({ re_id: item }) }} />
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
                        rowKey={record => "importreponsitoryfromexcel_index___" + JSON.stringify(record)}
                        size={'large'}
                        bordered={true}
                        columns={columns}
                        pagination={false}
                        locale={{ "emptyText": L('khong_co_du_lieu') }}
                        dataSource={this.dataExcel == undefined || this.dataExcel.length == 0 ? [] : this.dataExcel}
                    />
                </Row>
            </Card>
        );
    }
}