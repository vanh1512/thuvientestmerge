import { CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, CloseOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import ActionExport from '@src/components/ActionExport';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import { L, displayDate } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';
import { ePlanDetailStatus, eProcess, valueOfPlanDetailStatus, valueOfePlanDetailType, valueOfeProcess } from '@src/lib/enumconst';
import { PlanDetailDto, PlanDto, StatisticPlanWithMonthDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Button, Col, Row, Table, Tag } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import * as React from 'react';

export interface IProps {
    pl_de_id_arr: number[];
    title: string;
    titleTable: string,
    onCancel: () => void;
    pagination: TablePaginationConfig | false;
}
export default class TablePlanDetailRP extends React.Component<IProps>{
    componentRef: any | null = null;

    state = {
        isLoadDone: false,
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
        isHeaderReport: false,
    };
    listInforPlanDetail: PlanDetailDto[] = [];
    async componentDidMount() {
        await this.getAll();
    }
    async getAll() {
        this.setState({ isLoadDone: false });
        this.listInforPlanDetail = await stores.planDetailStore.getByListPlanDetail(this.props.pl_de_id_arr)
        this.setState({ isLoadDone: true });
    }
    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    onChangePage = async (page: number, pagesize?: number) => {
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = this.props.pl_de_id_arr.length;
            page = 1;
        }
        await this.setState({ pageSize: pagesize! });
        await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
            this.getAll();
        });
    }
    render() {
        const self = this;
        const { pagination } = this.props
        const columns = [
            {
                title: L('N.O'), key: 'no_planDetail_index',
                render: (text: string, item: PlanDetailDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div>
            },
            {
                title: L('TitleDocuemnt'), key: 'do_id',
                render: (text: string, item: PlanDetailDto) => <div>{item.do_id.name}</div>
            },
            {
                title: L('Quantity'), key: 'pl_de_type',
                render: (text: string, item: PlanDetailDto) => <div>{AppConsts.formatNumber(item.pl_de_quantity)}</div>
            },
            {
                title: L('gia_tien'), key: 'pl_de_type',
                render: (text: string, item: PlanDetailDto) => <div>{AppConsts.formatNumber(item.pl_de_price)}</div>
            },
            {
                title: L('StatusDocument'), key: 'pl_de_status',
                render: (text: string, item: PlanDetailDto) => <div><Tag color={item.pl_de_status == ePlanDetailStatus.chua_nhap_kho.num ? "#2db7f5" : 'success'}>{valueOfPlanDetailStatus(item.pl_de_status)}</Tag></div>
            },
            {
                title: L('TypeDocument'), key: 'pl_de_type',
                render: (text: string, item: PlanDetailDto) => <div>{valueOfePlanDetailType(item.pl_de_type)}</div>
            },
        ];
        return (
            <>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={12}>
                        <h3>{this.props.titleTable != "TỔNG" ? this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase() : this.props.titleTable.toUpperCase() + " " + this.props.title.toUpperCase()}</h3>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <ActionExport
                            isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
                            isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
                            isWord={true}
                            isExcel={true}
                            idPrint={this.props.title}
                            nameFileExport={this.props.titleTable != "TỔNG" ? this.props.title + " " + this.props.titleTable : this.props.titleTable + " " + this.props.title}
                            componentRef={this.componentRef}
                        />
                        <Button icon={<CloseOutlined />} type="primary" style={{ margin: '0 10px' }} danger onClick={() => this.props.onCancel()}>Hủy</Button>
                    </Col>
                </Row>
                <div id={this.props.title} ref={this.setComponentRef}>
                    {this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
                    <Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}>
                        <h2>{this.props.titleTable != "TỔNG" ? this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase() : this.props.titleTable.toUpperCase() + " " + this.props.title.toUpperCase()}</h2>
                    </Col>
                    <Table className='centerTable'
                        rowKey={(record) => 'table_memberinfor_index__' + JSON.stringify(record)}
                        size={'small'}
                        bordered={true}
                        locale={{ emptyText: L('No Data') }}
                        columns={columns}
                        dataSource={this.listInforPlanDetail.length > 0 ? this.listInforPlanDetail : []}
                        pagination={{
                            className: "ant-table-pagination ant-table-pagination-right no-print ",
                            pageSize: this.state.pageSize,
                            total: this.props.pl_de_id_arr.length,
                            current: this.state.currentPage,
                            showTotal: (tot) => "Tổng: " + tot + "",
                            showQuickJumper: true,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100', L("All")],
                            onShowSizeChange(current: number, size: number) {
                                self.onChangePage(current, size)
                            },
                            onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
                        }}
                    />
                    {this.state.isHeaderReport && <FooterReport />}
                </div>

            </>

        )
    }
}