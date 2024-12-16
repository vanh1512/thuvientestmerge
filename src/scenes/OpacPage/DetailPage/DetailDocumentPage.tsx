import AppComponentBase from "@src/components/Manager/AppComponentBase"
import { GDocumentDto } from "@src/services/services_autogen";
import { Card, Col, Image, Row, message } from "antd";
import * as React from "react"
import HeaderPage from "../MainPage/Header";
import Footer from "../MainPage/Footer";
import EventDetail from "../MainPage/Event";
import HistoryHelper from "@src/lib/historyHelper";
import { stores } from "@src/stores/storeInitializer";
import AppConsts from "@src/lib/appconst";
import moment from "moment";

export interface IProps {
    documentListResult: GDocumentDto[];
}
export default class DetailDocumentPage extends AppComponentBase<IProps> {
    state = {
        isLoadDone: false,
        do_title: ""
    }
    async componentDidMount() {
        this.setState({ isLoadDone: false });
        const query = new URLSearchParams(window.location.search);
        if (query == null) {
            HistoryHelper.back();
        }
        await this.setState({ do_title: query.get("do_title") });
        this.getAll();
        this.setState({ isLoadDone: true });
    }
    getAll = async () => {
        this.setState({ isLoadDone: false });
        await stores.gDocument.getDocuments(this.state.do_title, undefined, undefined,);
        this.setState({ isLoadDone: true });
    }
    render() {
        const { gDocumentListDto } = stores.gDocument;
        const resultDocument = gDocumentListDto[0];

        return (
            <>
                <HeaderPage />
                <Card style={{ padding: '15px 10%', fontSize: 16 }}>
                    <Row gutter={16}>
                        <Col span={16}>
                            <h1>Thông tin chi tiết sách</h1>
                            {resultDocument != undefined &&
                                <>
                                    <Row gutter={16}>
                                        <Col span={6}>
                                            <Image height={113} src={(resultDocument!.fi_id_arr_cover != undefined && resultDocument!.fi_id_arr_cover.length > 0 && resultDocument!.fi_id_arr_cover![0].isdelete == false && this.getFile(resultDocument!.fi_id_arr_cover![0].id) != undefined) ? this.getFile(resultDocument!.fi_id_arr_cover![0].id) : process.env.PUBLIC_URL + '/icon_file_sample/no_image.png'}></Image>
                                        </Col>
                                        <Col span={18}>
                                            <h2>{resultDocument!.do_title}</h2>
                                            <hr style={{ height: '5px', backgroundColor: '#1DA57A' }} />
                                            <Row >

                                                <Col span={12}>
                                                    <div><b>Tác giả</b></div>
                                                    <div><b>Lần xuất bản</b></div>
                                                    <div><b>Mã sách</b></div>
                                                    <div><b>Nhà xuất bản</b></div>
                                                    <div><b>Năm xuất bản</b></div>
                                                    <div><b>Giá sách</b></div>
                                                    <div><b>Từ khóa</b></div>
                                                </Col>
                                                <Col span={12}>
                                                    <div>{resultDocument.au_id_arr?.map(resultDocument => resultDocument.name).join(", ")}</div>
                                                    <div>{resultDocument.do_republish}</div>
                                                    <div>{resultDocument.do_identifier}</div>
                                                    <div>{resultDocument.pu_id.name}</div>
                                                    <div>{moment(resultDocument.do_date_available).format("DD/MM/YYYY")}</div>
                                                    <div> {AppConsts.formatNumber(resultDocument.do_price) + " VNĐ"}</div>
                                                    <div> {stores.sessionStore.getNameTopic(resultDocument.to_id)}</div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <hr style={{ height: '5px', backgroundColor: '#1DA57A' }} />
                                    <div>
                                        <h2>Đăng ký mượn</h2>
                                        <div>Tổng số bản: {resultDocument.do_total_book}</div>
                                        <div>Số bản rỗi: {resultDocument.do_total_book_valid}</div>
                                        <div>Đặt mượn:</div>

                                    </div>
                                </>
                            }
                        </Col>
                        <Col span={8}>
                            <EventDetail />
                        </Col>

                    </Row>
                </Card>
                <Footer />
            </>
        )
    }
}