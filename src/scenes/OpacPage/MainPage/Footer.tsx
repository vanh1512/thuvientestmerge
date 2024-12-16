import { Col, Row } from "antd"
import AppLongLogo from '@images/logoego_long256.png';
import * as React from "react"
import { FacebookOutlined, HomeOutlined, MailOutlined, PhoneOutlined, YoutubeOutlined } from "@ant-design/icons";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import "./styles.css";



export default class Footer extends AppComponentBase {
    render() {
        return (
            <>
                <Row className="footer" style={{ marginTop: 20, background: "#1e3e2d"}} >
                    <Col span={4} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <img src={AppLongLogo} style={{ width: 175}} alt="Logo" />
                    </Col> &nbsp;&nbsp;
                    <Col span={10} style={{ borderRight: "1px solid white", color: "#fff", paddingLeft: 10 }}>
                        <h2 style={{ color: "#fff" }}>THƯ VIỆN TỈNH TUYÊN QUANG</h2>
                        <p><HomeOutlined /> <i>Số 88, Đường 17/8, Phường Minh Xuân, Tuyên Quang, Vietnam</i></p>
                        <p><PhoneOutlined /> <i>0207 3822 084</i></p>
                        <p><MailOutlined /> <i>thuvientuyenquang@gmail.com</i></p>
                    </Col>
                    <Col span={9} style={{ textAlign: 'center' }}>
                        <h2 style={{ color: "#fff" }}>Mạng xã hội</h2>
                        <div style={{display:'flex',justifyContent:'center '}}>
                            <div className="colTitle">
                                <a style={{ fontSize: 40 }} href="https://www.youtube.com/@SachvaTritueViet"><YoutubeOutlined style={{ color: "red" }} /></a>&nbsp;&nbsp;
                            </div>
                            <div className="colTitle">
                                <a style={{ fontSize: 40 }} href="https://www.facebook.com/thuvientinhtuyenquang1708"><FacebookOutlined style={{ color: '#0866FF' }} /></a>
                            </div>                       
                             </div>
                    </Col>
                </Row>
            </>
        )
    }
}