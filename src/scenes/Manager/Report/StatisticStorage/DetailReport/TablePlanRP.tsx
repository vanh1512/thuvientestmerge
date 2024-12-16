import { CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, CloseOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import ActionExport from '@src/components/ActionExport';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import { L, displayDate } from '@src/lib/abpUtility';
import { eProcess, valueOfeProcess } from '@src/lib/enumconst';
import { PlanDto, StatisticPlanWithMonthDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Button, Col, Row, Table, Tag } from 'antd';
import * as React from 'react';

export interface IProps {
    su_id_arr: number[];
    title: string;
    titleTable: string,
    onCancel: () => void;
}
export default class TablePlanRP extends React.Component<IProps>{
    componentRef: any | null = null;

    state = {
        isLoadDone: false,
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
        isHeaderReport: false,
    };
    listInforPlan: PlanDto[] = [];
    async componentDidMount() {
        await this.getAll();
    }
    async getAll() {
        this.setState({ isLoadDone: false });
        await stores.planStore.getAll(undefined, undefined, undefined, undefined,);
        this.listInforPlan = await stores.planStore.getByListPlan(this.props.su_id_arr,)
        this.setState({ isLoadDone: true });
    }
    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    onChangePage = async (page: number, pagesize?: number) => {
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = this.props.su_id_arr.length;
            page = 1;
        }
        await this.setState({ pageSize: pagesize! });
        await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
            this.getAll();
        });
    }
    render() {
        const self = this;
        const columns = [
            {
                title: L('STT'),
                key: 'do_info_index',
                render: (text: string, item: PlanDto, index: number) => (
                    <div>
                        {this.state.pageSize! * (this.state.currentPage - 1) + (index + 1)}
                    </div>
                ),
            },
            { title: L('Title'), dataIndex: 'pl_title', key: 'pl_title', render: (text: string, item: PlanDto) => <div style={{ textAlign: "left" }}><b>{item.pl_title}</b><br /><small>{L("Created at")}: <i>{displayDate(item.pl_created_at)}</i></small></div> },
            {
                title: L('Status'), dataIndex: 'pl_process', key: 'pl_process', render: (text: string, item: PlanDto) =>
                    <div>
                        {item.pl_process == eProcess.Creating.num && <Tag color='yellow'>{valueOfeProcess(item.pl_process)}</Tag>}
                        {item.pl_process == eProcess.Wait_Approve.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeProcess(item.pl_process)}</Tag>}
                        {item.pl_process == eProcess.Approved.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeProcess(item.pl_process)}</Tag>}
                        {item.pl_process == eProcess.Sign.num && <Tag icon={<CheckCircleOutlined />} color='#2db7f5'>{valueOfeProcess(item.pl_process)}</Tag>}
                        {item.pl_process == eProcess.Give_Back.num && <Tag icon={<ClockCircleOutlined />} color='warning'>{valueOfeProcess(item.pl_process)}</Tag>}
                        {item.pl_process == eProcess.Cancel.num && <Tag icon={<MinusCircleOutlined />} color='error'>{valueOfeProcess(item.pl_process)}</Tag>}
                        {item.pl_process == eProcess.Complete.num && <Tag icon={<CheckOutlined />} color='green'>{valueOfeProcess(item.pl_process)}</Tag>}
                    </div>
            },
        ]
        return (
            <>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={12}>
                        <h3>{this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase()}</h3>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <ActionExport
                            isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
                            isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
                            isWord={true}
                            isExcel={true}
                            idPrint={this.props.title}
                            nameFileExport={this.props.title+ " " + this.props.titleTable}
                            componentRef={this.componentRef}
                        />
                        <Button icon={<CloseOutlined />} type="primary" style={{ margin: '0 10px' }} danger onClick={() => this.props.onCancel()}>Hủy</Button>
                    </Col>
                </Row>
                <div id={this.props.title} ref={this.setComponentRef}>
                    {this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
                    <Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase()}</h2></Col>
                    <Table className='centerTable'
                        rowKey={(record) => 'table_memberinfor_index__' + JSON.stringify(record)}
                        size={'small'}
                        bordered={true}
                        locale={{ emptyText: L('No Data') }}
                        columns={columns}
                        dataSource={this.listInforPlan.length > 0 ? this.listInforPlan : []}
                        pagination={{
                            className: "ant-table-pagination ant-table-pagination-right no-print ",
                            pageSize: this.state.pageSize,
                            total: this.props.su_id_arr.length,
                            current: this.state.currentPage,
                            showTotal: (tot) => L("tong") + tot + "",
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