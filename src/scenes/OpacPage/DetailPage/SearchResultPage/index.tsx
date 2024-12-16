
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import * as React from "react"
import HeaderPage from "../../MainPage/Header";
import { stores } from "@src/stores/storeInitializer";
import { Button, Card, Col, Input, Row, message } from "antd";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import EventDetail from "../../MainPage/Event";
import Footer from "@src/components/Manager/Footer";
import HistoryHelper from "@src/lib/historyHelper";
import ListResultDocument from "../../DetailDocument/ListResultDocument";
import moment from "moment";

export default class SearchResultPage extends AppComponentBase {
    state = {
        isLoadDone: false,
        skipCount: 1,
        maxResultCount: 10,
        textSearch: "",
        textTitle:"",
    }
    textSearch: string | null | undefined;
    async componentDidMount() {
        this.setState({ isLoadDone: false });
        const query = new URLSearchParams(window.location.search);
        if (query == null) {
            HistoryHelper.back();
        }
        await this.setState({ textSearch: query.get("textSearch") });
        this.getAll();
        this.setState({ isLoadDone: true });
    }
    getAll = async () => {
        this.setState({ isLoadDone: false });
        if (this.state.textSearch != "") {

            await stores.gDocument.getDocuments(this.state.textSearch.trim(), undefined, undefined,);
        }
        else {
            message.error("Vui lòng nhập từ khóa");
        }
        this.setState({ isLoadDone: true });
    }
    render() {
        const { gDocumentListDto } = stores.gDocument;

        return (
            <>
                <HeaderPage />
                <Card style={{ padding: '15px 10%', fontSize: 16 }}>
                    <Row gutter={16}>
                        <Col span={16} >
                            <div>
                                <h1 style={{ margin: 0 }}>Tra cứu tài liệu trực tuyến</h1>
                                <p> <CalendarOutlined style={{ color: 'red' }} />&nbsp;<i>{moment(Date.now()).format("DD/MM/YYYY")}</i> &nbsp;&nbsp;<EyeOutlined style={{ color: 'red' }} /> &nbsp;<i>3035</i></p>
                            </div>
                            <Row gutter={16}>
                                <Col style={{ width: "75%", height: 50, textAlign: 'center' }}>
                                    <Input value={this.state.textSearch} onChange={(e) => { this.setState({ isLoadDone: false }); this.setState({ textSearch: e.target.value }); this.setState({ isLoadDone: true }); }} onPressEnter={this.getAll} style={{ height: "100%" }} placeholder="Tìm kiếm tất cả"></Input>
                                </Col>
                                <Col  >
                                    <Button type="primary" style={{ height: 50 }} onClick={()=>{this.getAll();this.setState({textTitle:this.state.textSearch})}}>Tìm kiếm</Button>
                                </Col>
                            </Row>
                            <Row justify="center">
                                <b><a href="#" style={{ color: '#fff', fontSize: '16px' }}> Tìm kiếm nâng cao</a></b>

                            </Row>
                            <h2>Kết quả tìm kiếm: Tìm thấy {gDocumentListDto.length} biểu ghi cho từ khóa <span style={{ color: 'green' }}>{this.state.textTitle}</span></h2>
                            <ListResultDocument documentListResult={gDocumentListDto} />
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