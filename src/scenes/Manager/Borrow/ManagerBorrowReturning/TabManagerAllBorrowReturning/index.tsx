
import { L } from "@src/lib/abpUtility";
import { stores } from "@src/stores/storeInitializer";
import { Button, Col, Row } from "antd";
import * as React from "react";
import SelectEnum from "@src/components/Manager/SelectEnum";
import { eBorrowReturningDetailStatus, eBorrowReturningProcess } from "@src/lib/enumconst";
import { BorrowReturningProcess } from "@src/services/services_autogen";
import { ExportOutlined, SearchOutlined } from "@ant-design/icons";
import ModalExportManagerAllDocumentBorrowReturning from "./components/ModalExportManagerAllDocumentBorrowReturning";
import TableManagerAllDocumentBorrowReturning from "./components/TableManagerAllDocumentBorrowReturning";
import { cssCol, cssColResponsiveSpan } from "@src/lib/appconst";

export default class ManagerAllBorrowReturning extends React.Component {
    state = {
        isLoadDone: true,
        pageSize: 10,
        currentPage: 1,
        visibleExportExcelDoccument: false,
        br_re_de_status: undefined,

    }

    doc_br_status: BorrowReturningProcess[] = [];
    componentDidMount() {
        this.getAll();
    }

    getAll = async () => {
        this.setState({ isLoadDone: false });
        await stores.borrowReturningStore.getAll(undefined, undefined, undefined, undefined, undefined, this.doc_br_status, undefined, this.state.br_re_de_status, undefined, undefined);
        this.setState({ isLoadDone: true });
    }
    onChangePage = async (page: number, pagesize?: number) => {
        const { totalBorrowReturning } = stores.borrowReturningStore;
        if (pagesize === undefined || isNaN(pagesize)) {
            pagesize = totalBorrowReturning;
            page = 1;
        }
        await this.setState({ pageSize: pagesize! });
        await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
            this.getAll();
        });
    }
    handleSubmitSearch = async () => {
        await this.onChangePage(1, this.state.pageSize);
    }

    onOpenModalExport = () => {
        this.setState({ visibleExportExcelDoccument: true });
    }
    render() {
        const { borrowReturningDtoListResult, totalBorrowReturning } = stores.borrowReturningStore;
        const self = this;
        return (
            <>
                <Row gutter={[8, 8]} align="bottom">
                    <Col {...cssColResponsiveSpan(24, 12, 7, 8, 8, 8)}>
                        <strong style={{ width: "30%" }}>{L('tinh_trang_muon_tra')}:</strong>
                        <SelectEnum eNum={eBorrowReturningProcess} enum_value={this.doc_br_status != undefined ? this.doc_br_status![0] : undefined} onChangeEnum={(value: number) => value != undefined ? this.doc_br_status[0] = value : this.doc_br_status = []} />
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 12, 7, 8, 8, 8)}>
                        <strong style={{ width: "30%" }}>{L('Status')}:</strong>
                        <SelectEnum eNum={eBorrowReturningDetailStatus} enum_value={this.state.br_re_de_status} onChangeEnum={(value: number) => this.setState({ br_re_de_status: value })} />
                    </Col>
                    <Col {...cssColResponsiveSpan(12, 12, 5, 4, 4, 4)}>
                        <Button type="primary" icon={<SearchOutlined />} onClick={() => this.handleSubmitSearch()}>{L("Search")}</Button>
                    </Col>
                    <Col {...cssColResponsiveSpan(12, 12, 5, 4, 4, 4)} style={{ textAlign: 'end' }}>
                        <Button type="primary" icon={<ExportOutlined />} onClick={this.onOpenModalExport}>{L('ExportData')}</Button>
                    </Col>
                </Row>

                <TableManagerAllDocumentBorrowReturning
                    borrowReturningListResult={borrowReturningDtoListResult}
                    pagination={{
                        pageSize: this.state.pageSize,
                        total: totalBorrowReturning,
                        current: this.state.currentPage,
                        showTotal: (tot) => L("Total") + ": " + tot + "",
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100', L("All")],
                        onShowSizeChange(current: number, size: number) {
                            self.onChangePage(current, size)
                        },
                        onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
                    }}
                />
                {this.state.visibleExportExcelDoccument &&
                    <ModalExportManagerAllDocumentBorrowReturning onCancel={() => { this.setState({ visibleExportExcelDoccument: false }) }} visible={this.state.visibleExportExcelDoccument} doccumentListResult={borrowReturningDtoListResult} />
                }
            </>
        )
    }
}
