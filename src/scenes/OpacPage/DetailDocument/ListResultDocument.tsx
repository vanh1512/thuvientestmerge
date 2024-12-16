
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import AppConsts, { RouterPath } from "@src/lib/appconst";
import { GDocumentDto } from "@src/services/services_autogen";
import { Col, Image, Row } from "antd";
import * as React from "react"

export interface IProps {
    documentListResult: GDocumentDto[];
}
export default class ListResultDocument extends AppComponentBase<IProps> {
    state = {
        isLoadDone: false,
    }

    render() {

        return (
            this.props.documentListResult.length > 0 && this.props.documentListResult.map((item, index) => {
                return <Row gutter={16} key={item.do_id} style={{ marginBottom: '20px', backgroundColor: '#f1f1f1' }}>
                    <Col span={8}>
                        <Image height={113} src={(item.fi_id_arr_cover != undefined && item.fi_id_arr_cover.length > 0 && item.fi_id_arr_cover![0].isdelete == false && this.getFile(item.fi_id_arr_cover![0].id) != undefined) ? this.getFile(item.fi_id_arr_cover![0].id) : process.env.PUBLIC_URL + '/icon_file_sample/no_image.png'}></Image>
                    </Col>
                    <Col span={16}>
                        <h3><a href={RouterPath.g_opacpage_detail_document + "?do_title=" + item.do_title}>{item.do_title}</a></h3>
                        <div><b>Giá sách</b>: {AppConsts.formatNumber(item.do_price) + " VNĐ"}</div>
                        <div><b>Tác giả</b>: {item.au_id_arr?.map(item => item.name).join(", ")}</div>
                        <div><b>Mã sách</b>: {item.do_identifier}</div>
                    </Col>
                </Row>
            })
        )
    }
}