import * as React from 'react';
import { Row, Button, Col } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@src/lib/abpUtility';
import { FileExcelOutlined, FileWordOutlined, PrinterOutlined } from '@ant-design/icons';
import ReactToPrint from 'react-to-print';

export interface IProps {
    idPrint: string,
    isExcel: boolean,
    isWord: boolean,
    sizeSmall?: boolean,
    nameFileExport: string,
    headerPrint?: string | undefined,
    componentRef?: any | undefined,
    isHeaderReport?: () => void,
    isntHeaderReport?: () => void,
}

export default class ActionExport extends AppComponentBase<IProps> {
    state = {
        isLoadDone: false,
    };
    render() {
        const { idPrint, isExcel, isWord, sizeSmall, nameFileExport } = this.props;
        let contentHTML = "<html><head> ";
        contentHTML += "<style>";
        contentHTML += "@page {";
        contentHTML += "size: A4;";
        //contentHTML += "margin-left: 5mm; overflow: scroll;}";
        contentHTML += "@media print {";

        // contentHTML += "#labelClass {page-break-before:always; }";
        // contentHTML += "color:rgb(0 0 0) !important;";
        //contentHTML += ".no-print  { display:none;overflow: hidden;height:0;}"; // CSS để bỏ những thứ không cần in
        // contentHTML += ".color-black-print  {color:rgb(0 0 0) !important;}"; // CSS để bỏ những thứ không cần in
        //contentHTML += ".page-break {margin-top: 1rem;display: flex;page-break-before: auto;page-break-inside: avoid}"; // CSS để tạo page break khi in nhiều trang
        //contentHTML += "html, body { height: initial !important;overflow: initial !important;}"; // CSS để bỏ trang trống
        contentHTML += "}";
        //contentHTML += "table {width: 100%;}";
        //contentHTML += "table, th, td, thead , tr{border: 0.01em solid black; border-collapse: collapse; text-align: center;}";
        //contentHTML += "td {padding:0px 7px}";
        contentHTML += ".noneBorder table, .noneBorder th, .noneBorder td, .noneBorder tr {border: none !important;}";
        contentHTML += "}</style></head>";
        contentHTML += "</html>";
        const pageStyle = contentHTML;
        return (
            <>
                {!!this.props.componentRef && (
                    <>
                        <ReactToPrint
                            pageStyle={pageStyle}
                            onBeforeGetContent={this.props.isHeaderReport}
                            onAfterPrint={this.props.isntHeaderReport}
                            onBeforePrint={this.props.isntHeaderReport}
                            trigger={() =>
                                <Button
                                    type="primary"
                                    title={L("Print")}
                                >
                                    <Row>
                                        {(!!sizeSmall && sizeSmall == true) ?
                                            (<Col><PrinterOutlined />&nbsp;&nbsp;</Col>)
                                            :
                                            (
                                                <>
                                                    <Col xs={24} sm={24} md={2}><PrinterOutlined />&nbsp;&nbsp;</Col>
                                                    <Col xs={0} sm={0} md={{ span: 12, offset: 8 }}>{L('Print')}</Col>
                                                </>
                                            )
                                        }
                                    </Row>
                                </Button>}
                            content={() => this.props.componentRef}
                        />

                        &nbsp;&nbsp;
                        {(!!isWord && <Button
                            title={L("tai_xuong_word")}
                            type="primary"
                            onClick={() => this.exportHTMLToDoc(idPrint, nameFileExport)}
                        >
                            <Row>
                                {(!!sizeSmall && sizeSmall == true) ?
                                    (<Col><FileWordOutlined /></Col>)
                                    :
                                    (
                                        <>
                                            <Col xs={24} sm={24} md={4}><FileWordOutlined /></Col>
                                            <Col xs={0} sm={0} md={18}>{L('tai_xuong_word')}</Col>
                                        </>
                                    )
                                }
                            </Row>
                        </Button>)}
                        &nbsp;&nbsp;
                        {(!!isExcel && <Button
                            title={L("tai_xuong_excel")}
                            type="primary"
                            onClick={() => this.exportHTMLToExcel(idPrint, nameFileExport)}
                        >
                            <Row>
                                {(!!sizeSmall && sizeSmall == true) ?
                                    (<Col><FileExcelOutlined /></Col>)
                                    :
                                    (
                                        <>
                                            <Col xs={24} sm={24} md={4}><FileExcelOutlined /></Col>
                                            <Col xs={0} sm={0} md={18}>{L('tai_xuong_excel')}</Col>
                                        </>
                                    )
                                }
                            </Row>
                        </Button>)}
                    </>
                )}
            </>
        )
    }
}