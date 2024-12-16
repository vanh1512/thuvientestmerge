import * as React from 'react';
import { Button, Col, Row, Table, } from 'antd';
import { MemberCardDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import ActionExport from '@src/components/ActionExport';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
    me_card_id_arr: number[];
    title: string;
    titleTable: string,
    onCancel: () => void;
}
export default class TableMemberCard extends React.Component<IProps> {
    componentRef: any | null = null;

    state = {
        isLoadDone: false,
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
        isHeaderReport: false,
    };
    listInforMemberCard: MemberCardDto[] = [];
    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        this.setState({ isLoadDone: false });
        await stores.memberCardStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        this.listInforMemberCard = await stores.memberCardStore.getAllByIdArr(this.props.me_card_id_arr, this.state.skipCount, this.state.pageSize)
        this.setState({ isLoadDone: true });
    }
    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    onChangePage = async (page: number, pagesize?: number) => {
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = this.props.me_card_id_arr.length;
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
                width: 50,
                render: (text: string, item: MemberCardDto, index: number) => (
                    <div>
                        {this.state.pageSize! * (this.state.currentPage - 1) + (index + 1)}
                    </div>
                ),
            },
            {
                title: L('Tên độc giả'),
                key: 'me_id',
                render: (text: string, item: MemberCardDto, index: number) => (
                    <div>{stores.sessionStore.getUserNameById(item.me_id)}</div>
                ),
            },
            {
                title: L('Số thẻ'),
                key: 'me_ca_id',
                render: (text: string, item: MemberCardDto, index: number) => (
                    <div>{item.me_ca_id}</div>
                ),
            },
            {
                title: L('Mã thẻ'),
                dataIndex: 'me_birthday',
                key: 'me_birthday',
                render: (text: string, item: MemberCardDto) => (
                    <div>{item.me_ca_code}</div>
                ),
            },
            {
                title: L('Thời gian thẻ có hiệu lực'),
                key: 'me_ca_use_from',
                render: (text: string, item: MemberCardDto) => (
                    <div>{moment(item.me_ca_use_from).format('DD/MM/YYYY')}</div>
                ),
            },
            {
                title: L('Thời gian thẻ hết hiệu lực'),
                key: 'me_ca_use_to',
                render: (text: string, item: MemberCardDto) => <div>{moment(item.me_ca_use_to).format('DD/MM/YYYY')}</div>
            },
            {
                title: L('Ngày quá hạn'),
                key: 'me_ca_time_extend',
                render: (text: string, item: MemberCardDto) => <div>{moment(item.me_ca_time_extend).format('DD/MM/YYYY')}</div>
            },
            {
                title: L('Ngày khoá thẻ'),
                key: 'me_ca_time_block',
                render: (text: string, item: MemberCardDto) => <div>{moment(item.me_ca_time_block).format('DD/MM/YYYY')}</div>
            },
            {
                title: L('Số tiền còn lại'),
                key: 'me_ca_money',
                render: (text: string, item: MemberCardDto) => <div>{item.me_ca_money.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
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
                            idPrint={"Danhsachthedocgia"}
                            nameFileExport={this.props.titleTable != "TỔNG" ? this.props.title + " " + this.props.titleTable : this.props.titleTable + " " + this.props.title}
                            componentRef={this.componentRef}
                        />
                        <Button icon={<CloseOutlined />} type="primary" style={{ margin: '0 10px' }} danger onClick={() => this.props.onCancel()}>Hủy</Button>
                    </Col>
                </Row>
                <div id={"Danhsachthedocgia"} ref={this.setComponentRef}>
                    {this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
                    <Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}>
                        <h2>{this.props.titleTable != "TỔNG" ? this.props.title.toUpperCase() + " " + this.props.titleTable.toUpperCase() : this.props.titleTable.toUpperCase() + " " + this.props.title.toUpperCase()} </h2>
                    </Col>
                    <Table className='centerTable'
                        rowKey={(record) => 'table_memberinfor_index__' + JSON.stringify(record)}
                        size={'small'}
                        bordered={true}
                        locale={{ emptyText: L('No Data') }}
                        columns={columns}
                        dataSource={this.listInforMemberCard.length > 0 ? this.listInforMemberCard : []}
                        pagination={{
                            className: "ant-table-pagination ant-table-pagination-right no-print ",
                            pageSize: this.state.pageSize,
                            total: this.props.me_card_id_arr.length,
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
        );
    }
}
