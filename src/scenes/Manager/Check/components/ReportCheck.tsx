import * as React from 'react';
import { Col, Row, Button, Table, Card, } from 'antd';
import { CheckDto, CheckItemDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import { eCheckItemStatus, valueOfeCheckItemStatus } from '@src/lib/enumconst';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import FooterPlanReport from '@src/components/LayoutReport/FooterPlanReport';

export interface IProps {
    checkSelected: CheckDto;
    onCancel: () => void;
}
export default class ReportCheck extends React.Component<IProps> {
    componentRef: any | null = null;
    state = {
        isLoadDone: true,
        isHeaderReport: false,
        visibleModalCreateUpdate: false,
    };
    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    async componentDidMount() {
    }
    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }
    }
    render() {
        const { checkSelected } = this.props;
        const columns = [
            { title: L('N.O'), dataIndex: '', key: 'no_member_index', render: (text: string, item: CheckItemDto, index: number) => <div> {index + 1}</div> },
            { title: L('DocumentName'), key: 'name', render: (text: string, item: CheckItemDto) => <div>{item.do_id.name}</div> },
            { title: L('Quantity'), key: 'quantity', render: (text: string, item: CheckItemDto) => <div>{(item.do_in_id_borrow != undefined && item.do_in_id_invalid != undefined && item.do_in_id_lost != undefined && item.do_in_id_valid != undefined) ? (item.do_in_id_borrow.length + item.do_in_id_invalid.length + item.do_in_id_valid.length + item.do_in_id_lost.length) : ""}</div> },
            { title: L('Status'), key: 'status', render: (text: string, item: CheckItemDto) => <div>{valueOfeCheckItemStatus(item.ck_it_status)}</div> },
            { title: L('Note'), key: 'note', render: (text: string, item: CheckItemDto) => <div>{item.ck_it_note}</div> },

        ];
        return (
            <Card>
                <Row style={{ justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <ActionExport
                        isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
                        isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
                        nameFileExport={L('bien_ban_kiem_ke_thu_vien') + " " + checkSelected.ck_name + " " + moment().format("DD-MM-YYYY")}
                        idPrint="report_check"
                        isExcel={true}
                        isWord={true}
                        componentRef={this.componentRef}
                    />
                    <Button style={{ marginLeft: '10px' }} danger onClick={() => this.onCancel()}>Hủy</Button>
                </Row>
                <div id='report_check' ref={this.setComponentRef}>
                    {this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

                    <Row style={{ justifyContent: "center" }}>
                        <h4 style={{ textAlign: "center" }}> <strong>KIỂM KÊ HỒ SƠ THƯ VIỆN</strong></h4>
                    </Row>
                    <Table
                        className='centerTable'
                        loading={!this.state.isLoadDone}
                        rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
                        size={'middle'}
                        bordered={true}
                        locale={{ "emptyText": L('khong_co_du_lieu') }}
                        columns={columns}
                        dataSource={this.props.checkSelected.checkItems}
                        pagination={false}

                    />
                    {this.state.isHeaderReport && <FooterPlanReport footer="check" />}

                    <br />
                </div>
            </Card>
        )
    }
}