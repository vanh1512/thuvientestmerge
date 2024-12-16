import { Button, Col, Input, Row, message } from "antd"
import * as React from "react"
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import "./styles.css";
import { RouterPath } from "@src/lib/appconst";
import HistoryHelper from "@src/lib/historyHelper";
export default class Container extends AppComponentBase {
    state = {
        isLoadDone: false,
        textSearch: "",
    }

    handleSearch = () => {
        this.setState({ isLoadDone: false });
        if (this.state.textSearch != "") {
            window.location.href = RouterPath.g_opacpage_search + "?textSearch=" + this.state.textSearch;
        }
        else {
            message.error("Vui lòng nhập từ khóa")
        }
        this.setState({ isLoadDone: true })
    }
    render() {
        const styleImage = {
            backgroundImage: `url(${process.env.PUBLIC_URL}/backgr.jpg)`,
            height: '400px',
            marginBottom: 15
        }

        let styleCol = {
            backgroundColor: "#1DA57A",
            marginRight: "15px",
            height: 100,
            display: 'flex',
            alignItems: "center",
            cursor: "pointer",
            boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
        }

        return (
            <>
                <div style={styleImage}>
                    <Row justify="center" gutter={16} style={{ paddingTop: "10%" }}>
                        <Col style={{ width: "50%", height: 50, textAlign: 'center' }}>
                            <Input  onChange={(e) => this.setState({ textSearch: e.target.value.trim() })} onPressEnter={this.handleSearch} style={{ height: "100%",borderRadius:15 }} placeholder="Tìm kiếm tất cả"></Input>
                        </Col>
                        <Col  >
                            <Button  type="primary" style={{ height: 50,borderRadius:"10px" }} onClick={this.handleSearch}>Tìm kiếm</Button>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <b><a href="#" style={{ color: '#fff', fontSize: '16px' }}> Tìm kiếm nâng cao</a></b>

                    </Row>

                </div>
                <h1 style={{ textAlign: "center" }}>Bạn có thể xem thêm</h1>
                <Row justify="center" >
                    <Col className="colTitle" span={4} style={styleCol}><div style={{ width: '100%', textAlign: "center", fontSize: 20 }}> <a href={RouterPath.g_opacpage_mostviewdocument} style={{ color: 'black' }}> Sách có nhiều lượt xem nhất</a></div></Col>
                    <Col className="colTitle" span={4} style={styleCol}><div style={{ width: '100%', textAlign: "center", fontSize: 20 }}><a href={RouterPath.g_opacpage_mostborrowdocument} style={{ color: 'black' }}>Lượt mượn nhiều nhất</a></div></Col>
                    <Col className="colTitle" span={4} style={styleCol}><div style={{ width: '100%', textAlign: "center", fontSize: 20 }}><a href={RouterPath.g_opacpage_documentnewest} style={{ color: 'black' }}>Tài liệu mới nhất</a></div></Col>
                </Row>
            </>
        )
    }
}