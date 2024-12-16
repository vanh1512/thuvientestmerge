import { BookOutlined, ContainerOutlined } from "@ant-design/icons";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { L } from "@src/lib/abpUtility";
import { GDocumentDto } from "@src/services/services_autogen";
import { Button, Modal, Table } from "antd";
import * as React from "react"
import ModalDetailDocument from "./ModalDetailDocument";
import { RouterPath } from "@src/lib/appconst";
import { stores } from "@src/stores/storeInitializer";
export interface Iprops {
    gDocumentList: GDocumentDto[];
    totalDocument: number;
    getAll: () => void;
}
export default class TableDocumentDetail extends AppComponentBase<Iprops>
{
    state = {
        isLoadDone: true,
        visibleDetailDocument: false,
        pageSize: 10,
        currentPage: 1,
    }
    gDocumentSelected: GDocumentDto = new GDocumentDto();
    getAll = () => {
        if (!!this.props.getAll) {
            this.props.getAll();
        }
    }
    onChangePage = async (page: number, pagesize?: number) => {
        const { totalDocument } = this.props;
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = totalDocument;
            page = 1;
        }
        await this.setState({ pageSize: pagesize! });
        await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
            this.getAll();
        });
    }
    openModalDetailDocument = async (item: GDocumentDto) => {
        this.setState({ isLoadDone: false });
        await this.gDocumentSelected.init(item);
        this.setState({ isLoadDone: true, visibleDetailDocument: true });
    }
    borrowDocument = () => {
        this.setState({ isLoadDone: false });
        if (stores.authenticationStore.isAuthenticated) {
            window.location.href = RouterPath.admin_borrow + "/memberBorrow";
        } else {
            window.location.href = RouterPath.g_login;
        }
        this.setState({ isLoadDone: true })
    }

    render() {
        const { gDocumentList, totalDocument } = this.props;
        const self = this;
        const columns = [
            { title: L('stt'), key: 'stt', render: (text: string, item: GDocumentDto, index: number) => <div>{index + 1}</div> },
            { title: L('Tên tài liệu'), key: 'do_title', render: (text: string, item: GDocumentDto, index: number) => <div>{item.do_title}</div> },
            { title: L('Số lượt xem '), key: 'do_view', render: (text: string, item: GDocumentDto, index: number) => <div>{item.do_num_view}</div> },
            { title: L('Số lượng tài liệu'), key: 'do_total', render: (text: string, item: GDocumentDto,) => <div>{item.do_total_book}</div> },
            {
                title: "",
                render: (text: string, item: GDocumentDto) => (
                    <div>

                        <Button
                            type="primary" icon={<ContainerOutlined />} title={L('Thông tin chi tiết')}
                            style={{ marginLeft: '10px' }}
                            onClick={() => this.openModalDetailDocument(item)}
                        ></Button>
                        <Button
                            type="primary" icon={<BookOutlined />} title={L('Mượn tài liệu')}
                            style={{ marginLeft: '10px' }}
                            onClick={() => this.borrowDocument()}
                        ></Button>
                    </div>
                ),
            },
        ];
        return (
            <>
                <Table className='centerTable'
                    style={{ marginRight: '3%' }}
                    // loading={!this.state.isLoadDone}
                    // rowClassName={(record, index) => (this.doccumentSelected.do_id == record.do_id) ? "bg-click" : "bg-white"}
                    rowKey={record => "tbbr_index__" + JSON.stringify(record)}
                    size={'small'}
                    bordered={true}
                    locale={{ "emptyText": L('No Data') }}
                    columns={columns}
                    dataSource={(gDocumentList !== undefined) ? gDocumentList : []}
                    pagination={{
                        pageSize: this.state.pageSize,
                        total: totalDocument,
                        current: this.state.currentPage,
                        showTotal: (tot) => L("Total") + ": " + tot + "",
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100', L('All')],
                        onChange: (page: number, pagesize?: number) => {
                            self.onChangePage(page, pagesize)

                        }
                    }}
                />
                <Modal
                    visible={this.state.visibleDetailDocument}
                    onCancel={() => this.setState({ visibleDetailDocument: false })}
                    closable={false}
                    maskClosable={true}
                    footer={null}
                >
                    <ModalDetailDocument gDocument={this.gDocumentSelected} />

                </Modal>
            </>
        )
    }
}