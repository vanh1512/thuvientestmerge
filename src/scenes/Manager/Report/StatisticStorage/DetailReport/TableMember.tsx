import * as React from 'react';
import { Button, Col, Row, Table, } from 'antd';
import { MemberDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import ActionExport from '@src/components/ActionExport';
import { CloseOutlined } from '@ant-design/icons';
import { valueOfeGENDER } from '@src/lib/enumconst';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
    me_id_arr: number[];
    title: string;
    titleTable: string,
    onCancel: () => void;
}
export default class TableMember extends React.Component<IProps> {
    componentRef: any | null = null;

    state = {
        isLoadDone: false,
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
        isHeaderReport: false,
    };
    listInforMember: MemberDto[] = [];
    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        this.setState({ isLoadDone: false });
        await stores.memberStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined,);
        this.listInforMember = await stores.memberStore.getAllByIdArr(this.props.me_id_arr, this.state.skipCount, this.state.pageSize);
        this.setState({ isLoadDone: true });
    }
    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    onChangePage = async (page: number, pagesize?: number) => {
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = this.props.me_id_arr.length;
            page = 1;
        }
        await this.setState({ pageSize: pagesize! });
        await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
            this.getAll();
        });
    }
    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }
    }
    render() {
        const self = this;
        const columns = [
            {
                title: L('STT'),
                key: 'do_info_index',
                width: 50,
                render: (text: string, item: MemberDto, index: number) => (
                    <div>
                        {this.state.pageSize! * (this.state.currentPage - 1) + (index + 1)}
                    </div>
                ),
            },
            {
                title: L('Tên độc giả'),
                key: 'me_id',
                render: (text: string, item: MemberDto, index: number) => (
                    <div>{item.me_name}</div>
                ),
            },
            {
                title: L('Giới tính'),
                key: 'me_sex',
                render: (text: string, item: MemberDto, index: number) => (
                    <div>{valueOfeGENDER(item.me_sex)}</div>
                ),
            },
            {
                title: L('Ngày sinh'),
                dataIndex: 'me_birthday',
                key: 'me_birthday',
                render: (text: string, item: MemberDto) => (
                    <div>{item.me_birthday}</div>
                ),
            },
            {
                title: L('Số điện thoại'),
                key: 'me_phone',
                render: (text: string, item: MemberDto) => (
                    <div>{(item.me_phone)}</div>
                ),
            },
            {
                title: L('CCCD'),
                key: 'me_identify',
                render: (text: string, item: MemberDto) => <div>{item.me_identify}</div>
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
                            idPrint={"Danhsachdocgia"}
                            nameFileExport={this.props.titleTable != "TỔNG" ? this.props.title + " " + this.props.titleTable : this.props.titleTable + " " + this.props.title}
                            componentRef={this.componentRef}
                        />
                        <Button icon={<CloseOutlined />} type="primary" style={{ margin: '0 10px' }} danger onClick={() => this.props.onCancel()}>Hủy</Button>
                    </Col>
                </Row>
                <div id={"Danhsachdocgia"} ref={this.setComponentRef}>
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
                        dataSource={this.listInforMember.length > 0 ? this.listInforMember : []}
                        pagination={{
                            className: "ant-table-pagination ant-table-pagination-right no-print ",
                            pageSize: this.state.pageSize,
                            total: this.props.me_id_arr.length,
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
