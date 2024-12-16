
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import * as React from "react"
import HeaderPage from "../MainPage/Header"
import Footer from "../MainPage/Footer"
import { Card, Col, Row } from "antd"
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons"
import { stores } from "@src/stores/storeInitializer"
import TableDocumentDetail from "./TableDocumentDetail"
import EventDetail from "../MainPage/Event"
import { cssCol } from "@src/lib/appconst"

export default class MostViewDocument extends AppComponentBase {
    state = {
        isLoadDone: false,
        skipCount: 1,
        maxResultCount: 10,
    }
    async componentDidMount() {
        await this.getAll();
    }
    getAll = async () => {
        this.setState({ isLoadDone: false });
        await stores.gDocument.getByView(undefined, this.state.skipCount, this.state.maxResultCount);

        this.setState({ isLoadDone: true });
    }
    render() {
        const { gDocumentListDto, total } = stores.gDocument;

        return (

            <>
                <HeaderPage />
                <Card style={{ padding: '15px 5%', fontSize: 16, }}>
                    <Row>
                        <Col {...cssCol(16)} >
                            <div>
                                <h1 style={{ margin: 0 }}>Tài liệu có lượt xem nhiều nhất</h1>
                                <p> <CalendarOutlined style={{ color: 'red' }} />&nbsp;<i>11/7/2023 </i> &nbsp;&nbsp;<EyeOutlined style={{ color: 'red' }} /> &nbsp;<i>3035</i></p>
                            </div>
                            <h2 style={{ textAlign: 'center' }}>Danh sách tài liệu có lượt xem nhiều nhất</h2>
                            <TableDocumentDetail gDocumentList={gDocumentListDto} totalDocument={total} getAll={this.getAll} />
                        </Col>
                        <Col {...cssCol(8)}>
                            <EventDetail />
                        </Col>
                    </Row>
                </Card>
                <Footer />
            </>
        )
    }
}