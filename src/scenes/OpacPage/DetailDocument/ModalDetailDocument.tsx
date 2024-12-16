
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import * as React from "react"
import { Card, Col, Row } from "antd"
import { GDocumentDto } from "@src/services/services_autogen"
import moment from "moment";
export interface Iprops {
    gDocument: GDocumentDto;
}
export default class ModalDetailDocument extends AppComponentBase<Iprops> {


    render() {
        const { gDocument } = this.props;
        return (
            <Card>
                <h2>Thông tin tài liệu</h2>
             
                    <Row>
                        <Col span={12}>
                            <p>Tên tài liệu: {gDocument.do_title}</p>
                            <p>Ngày xuất bản: {moment(gDocument.do_date_publish).format("DD/MM/YYYY")}</p>
                            <p>Tái bản lần thứ: {gDocument.do_republish}</p>
                            {/* <p>Ngôn ngữ: {gDocument.do_language_iso?.m}</p> */}
                        </Col>
                        <Col span={12}>
                            <p>Số lượt xem: {gDocument.do_num_view}</p>
                            <p>Số lượt mượn: {gDocument.do_num_borrow}</p>
                            <p>Số lượng tài liệu trong kho: {gDocument.do_total_book}</p>
                            <p>Số tài liẹu hợp lệ: {gDocument.do_total_book_valid}</p>
                        </Col>
                    </Row>
                
            </Card>

        )
    }
}