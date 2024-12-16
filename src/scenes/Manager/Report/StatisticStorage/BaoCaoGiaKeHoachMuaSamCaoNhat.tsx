import { CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, LineChartOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import ActionExport from '@src/components/ActionExport';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L, displayDate } from '@src/lib/abpUtility';
import { eProcess, valueOfeProcess } from '@src/lib/enumconst';
import { StatisticPlanMostMoneyDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { Button, Card, Col, Modal, Row, Table, Tag, message } from 'antd';
import * as React from 'react';
import TablePlanDetailRP from './DetailReport/TablePlanDetailRP';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export default class BaoCaoGiaKeHoachMuaSamCaoNhat extends AppComponentBase {
    componentRef: any | null = null;
    state = {
        isLoadDone: true,
        visibleModalDetail: false,
        isLineChart: false,
        titleList: '',
        titleColumn: '',
        titleTable: '',
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
        isHeaderReport: false,
    };
    listStatistcPlanMostMoney: StatisticPlanMostMoneyDto[] = [];
    listIdSlected: number[] = [];
    async componentDidMount() {
        await this.getAll();

    }
    async getAll() {
        this.setState({ isLoadDone: false })
        this.listStatistcPlanMostMoney = await stores.statisticStorageLibraryStore.statisticPlanMostMoney();
        this.setState({ isLoadDone: true })
    }
    onChangePage = async (page: number, pagesize?: number) => {
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = this.listStatistcPlanMostMoney.length;
            page = 1;
        }
        await this.setState({ pageSize: pagesize! });
        await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
            this.getAll();
        });
    }
    handleOnSelectedCell(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
        if (listIdSlected == undefined || listIdSlected.length < 1) {
            message.error('Danh sách trống');
            return;
        }
        this.listIdSlected = listIdSlected;
        this.setState({ visibleModalDetail: true, titleColumn: titleColumn, titleList: titleList });
    }
    handleOnSelectedCellCard(listIdSlected: number[] | undefined, titleList: string, titleColumn: string) {
        if (listIdSlected == undefined || listIdSlected.length < 1) {
            message.error('Danh sách trống');
            return;
        }
        this.listIdSlected = listIdSlected;
        this.setState({ visibleModalDetail: true, titleColumn: titleColumn, titleList: titleList });
    }
    handleLineChart(listStatistcPlanMostMoney: StatisticPlanMostMoneyDto[], titleTable: string) {
        this.listStatistcPlanMostMoney = listStatistcPlanMostMoney;
        this.setState({ isLineChart: true, titleTable: titleTable });
    }
    onCancelChart = async () => {
        await this.setState({ isLineChart: false })
    }
    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    render() {
        const self = this;
        const columns = [
            {
                key: "stt", className: "start", title: <b>STT</b>,
                render: (text: string, item: StatisticPlanMostMoneyDto, index: number) => {
                    if (item.nameDisplay != 'TỔNG') {
                        return ({
                            children: <div>{this.state.pageSize! * (this.state.currentPage! - 1) + (index + 1)}</div>,
                            props: {
                                colSpan: 1
                            }
                        })
                    }
                    else return ({
                        children: <div><b>TỔNG</b></div>,
                        props: {
                            colSpan: 4
                        }
                    })
                }

            },
            {
                key: "plan", className: "center", title: <b>Kế hoạch mua sắm cao nhất</b>,
                render: (text: string, item: StatisticPlanMostMoneyDto) => {
                    if (item.nameDisplay != 'TỔNG') {
                        return ({
                            children: <div>{item.nameDisplay}</div>,
                            props: {
                                colSpan: 1
                            }
                        })
                    }
                    else return ({
                        children: <div>{item.nameDisplay}</div>,
                        props: {
                            colSpan: 0
                        }
                    })
                }
            },
            {
                key: "pl_title", className: "start", title: <b>Trạng thái</b>,
                render: (text: string, item: StatisticPlanMostMoneyDto) => {
                    if (item.nameDisplay != 'TỔNG') {
                        return ({
                            children: <div>
                                {item.pl_process == eProcess.Creating.num && <Tag color='yellow'>{valueOfeProcess(item.pl_process)}</Tag>}
                                {item.pl_process == eProcess.Wait_Approve.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeProcess(item.pl_process)}</Tag>}
                                {item.pl_process == eProcess.Approved.num && <Tag icon={<SyncOutlined spin />} color="processing">{valueOfeProcess(item.pl_process)}</Tag>}
                                {item.pl_process == eProcess.Sign.num && <Tag icon={<CheckCircleOutlined />} color='#2db7f5'>{valueOfeProcess(item.pl_process)}</Tag>}
                                {item.pl_process == eProcess.Give_Back.num && <Tag icon={<ClockCircleOutlined />} color='warning'>{valueOfeProcess(item.pl_process)}</Tag>}
                                {item.pl_process == eProcess.Cancel.num && <Tag icon={<MinusCircleOutlined />} color='error'>{valueOfeProcess(item.pl_process)}</Tag>}
                                {item.pl_process == eProcess.Complete.num && <Tag icon={<CheckOutlined />} color='green'>{valueOfeProcess(item.pl_process)}</Tag>}
                            </div>,
                            props: {
                                colSpan: 1
                            }
                        })
                    }
                    else return ({
                        props: {
                            colSpan: 0
                        }
                    })
                }

            },
            {
                key: "pl_created_at", className: "start", title: <b>Ngày tạo</b>,
                render: (text: string, item: StatisticPlanMostMoneyDto) => {
                    if (item.nameDisplay != 'TỔNG') {
                        return ({
                            children: <div>{<i>{displayDate(item.pl_created_at)}</i>}</div>,
                            props: {
                                colSpan: 1
                            }
                        })
                    } else return ({
                        props: {
                            colSpan: 0
                        }
                    })
                }
            },
            {
                key: "totalMoney", className: "start", title: <b>Tổng giá</b>,
                onCell: (record: StatisticPlanMostMoneyDto) => {
                    return {
                        onClick: (e) => this.handleOnSelectedCellCard(record.planDetails?.map(item => item.pl_de_id), record.nameDisplay!, "Danh sách kế hoạch mua sắm "),
                    };

                },
                render: (text: string, item: StatisticPlanMostMoneyDto) => {
                    if (item.nameDisplay != 'TỔNG') {
                        return ({
                            children: <div>{item.moneyTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                        })
                    } else return ({
                        children: <div><b>{item.moneyTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</b></div>
                    })
                }
            },
        ]
        return (
            <Card>
                <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Button style={{ marginRight: "10px" }} type="primary" icon={<LineChartOutlined />} title={L('Biểu đồ')} onClick={() => this.handleLineChart(this.listStatistcPlanMostMoney, "Biểu đồ chi tiết kế hoạch mua sắm cao nhất")} >{L('Biểu đồ')}</Button>
                        <ActionExport
                            isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
                            isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
                            isWord={true}
                            isExcel={true}
                            idPrint={"baocaokehoachmuasamcaonhat"}
                            nameFileExport={"Bao_cao_chi_tiet_ke_hoach_mua_sam_ngay_" + moment().format('YYYY')}
                            componentRef={this.componentRef}
                        />
                    </Col>
                </Row>
                <div id='baocaokehoachmuasamcaonhat' ref={this.setComponentRef}>
                    
                    <div style={{ width:"100%"}}><h1 style={{ fontSize: '24px', textAlign: 'center' }}>{"BÁO CÁO CHI TIẾT KẾ HOẠCH MUA SẮM"}</h1></div>
                    {this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
                    <Table
                        className="centerTable"
                        loading={!this.state.isLoadDone}
                        size={'small'}
                        bordered={true}
                        dataSource={this.listStatistcPlanMostMoney}
                        columns={columns}
                        pagination={{
                            pageSize: this.state.pageSize,
                            total: this.listStatistcPlanMostMoney.length,
                            current: this.state.currentPage,
                            showTotal: (tot) => "Tổng: " + this.listStatistcPlanMostMoney.length + "",
                            className: "ant-table-pagination ant-table-pagination-right no-print ",
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
                <Modal
                    visible={this.state.visibleModalDetail}
                    onCancel={() => { this.setState({ visibleModalDetail: false }) }}
                    footer={null}
                    width='70vw'
                    closable={false}
                >
                    <TablePlanDetailRP
                        pl_de_id_arr={this.listIdSlected}
                        title={this.state.titleColumn}
                        titleTable={this.state.titleList}
                        onCancel={() => this.setState({ visibleModalDetail: false })}
                        pagination={false}
                    />
                </Modal>
                
            </Card>
        )
    }
}