import * as React from 'react';
import { Button, Col, Row, Table } from 'antd';
import { DocumentInforDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { valueOfeDocumentItemStatus } from '@src/lib/enumconst';
import GetNameItem from '@src/components/Manager/GetNameItem';
import { stores } from '@src/stores/storeInitializer';
import ActionExport from '@src/components/ActionExport';
import { CloseOutlined } from '@ant-design/icons';
import { TablePaginationConfig } from 'antd/lib/table';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
    do_in_id_arr: number[];
    title: string;
    titleTable: string,
    onCancel: () => void;
    pagination?: TablePaginationConfig | false;
    isHeaderReport?: boolean;
}
export default class TableDocumentInfor extends React.Component<IProps> {
    componentRef: any | null = null;

    state = {
        isLoadDone: false,
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
        isHeaderReport: false,
    };
    listDocumentInfor: DocumentInforDto[] = [];

    async componentDidMount() {
        await this.getAll();
    }

    async getAll() {
        this.setState({ isLoadDone: false });
        await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        this.listDocumentInfor = await stores.documentInforStore.getAllByIdArr(this.props.do_in_id_arr, this.state.skipCount, this.state.pageSize)
        this.setState({ isLoadDone: true });
    }
    setComponentRef = (ref) => {
        this.setState({ isLoadDone: false });
        this.componentRef = ref;
        this.setState({ isLoadDone: true });
    }
    onChangePage = async (page: number, pagesize?: number) => {
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = this.props.do_in_id_arr.length;
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
                render: (text: string, item: DocumentInforDto, index: number) => (
                    <div>
                        {this.state.pageSize! * (this.state.currentPage - 1) + (index + 1)}
                    </div>
                ),
            },
            {
                title: L('Tên tài liệu'),
                key: 'do_id',
                render: (text: string, item: DocumentInforDto, index: number) => (
                    <div>{GetNameItem.getNameDocument(item.do_id)}</div>
                ),
            },
            {
                title: L('Mã đăng ký cá biệt'),
                key: 'dkcb_code',
                render: (text: string, item: DocumentInforDto, index: number) => (
                    <div>{item.dkcb_code}</div>
                ),
            },
            {
                title: L('Mã ISBN'),
                dataIndex: 'do_in_isbn',
                key: 'do_in_isbn',
                render: (text: string, item: DocumentInforDto) => (
                    <div>{item.do_in_isbn}</div>
                ),
            },
            {
                title: L('Trạng thái'),
                key: 'do_in_status',
                render: (text: string, item: DocumentInforDto) => (
                    <div>{valueOfeDocumentItemStatus(item.do_in_status)}</div>
                ),
            },
        ];

        return (
            <>
                <Row style={{ margin: '10px 0' }}>
                    <Col span={12}>
                        <h3> {this.props.title.toUpperCase()}{this.props.titleTable.toUpperCase()}</h3>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>

                        <ActionExport
                            isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
                            isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
                            isWord={true}
                            isExcel={true}
                            idPrint={this.props.title}
                            nameFileExport={this.props.title + this.props.titleTable}
                            componentRef={this.componentRef}
                        />
                        <Button icon={<CloseOutlined />} type="primary" style={{ margin: '0 10px' }} danger onClick={() => this.props.onCancel()}>Hủy</Button>
                    </Col>
                </Row>
                <div id={this.props.title} ref={this.setComponentRef}>
                    {this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
                    <Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{this.props.title.toUpperCase()}{this.props.titleTable.toUpperCase()}</h2></Col>
                    <Table className='centerTable'
                        rowKey={(record) => 'table_documentinfor_index__' + JSON.stringify(record)}
                        size={'small'}
                        bordered={true}
                        locale={{ emptyText: L('No Data') }}
                        columns={columns}
                        dataSource={this.listDocumentInfor.length > 0 ? this.listDocumentInfor : []}
                        pagination={{
                            className: "ant-table-pagination ant-table-pagination-right no-print ",
                            pageSize: this.state.pageSize,
                            total: this.props.do_in_id_arr.length,
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
