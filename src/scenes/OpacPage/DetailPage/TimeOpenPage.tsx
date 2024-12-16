
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import * as React from "react"
import HeaderPage from "../MainPage/Header"
import Footer from "../MainPage/Footer"
import { Card, Col, Row } from "antd"
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons"
import "../MainPage/styles.css";
import EventDetail from "../MainPage/Event"

export default class TimeOpenPage extends AppComponentBase {
    render() {
        return (
            <div>
                <HeaderPage />
                <Card style={{ padding: '15px 10%', fontSize: 16,height:'80%' }}>
                    <Row>
                        <Col span={16} >
                            <div>
                                <h1 style={{ margin: 0 }}>Giờ mở cửa</h1>
                                <p> <CalendarOutlined style={{ color: 'red' }} />&nbsp;<i>11/7/2023 </i> &nbsp;&nbsp;<EyeOutlined style={{ color: 'red' }} /> &nbsp;<i>3035</i></p>
                            </div>
                            <h2 style={{ textAlign: 'center' }}>Giờ mở cửa phục vụ tại thư viện Tỉnh Tuyên Quang</h2>
                            <table style={{ width: "70%", marginLeft: '15%' }}>
                                <thead>
                                    <tr>
                                        <th>TT</th>
                                        <th>NGÀY TRONG TUẦN</th>
                                        <th>THỜI GIAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>01</td>
                                        <td>Thứ hai - Thứ sáu</td>
                                        <td>8:15 - 21:00 </td>
                                    </tr>
                                    <tr>
                                        <td>02</td>
                                        <td>Thứ bảy - Chủ nhật</td>
                                        <td >8:00 - 12:00 và 13:00 - 17:00</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p>Lưu ý: Các buổi tối và cuối tuần thư viện chỉ phục vụ chỗ tự học, không phục vụ mượn trả hay các dịch vụ khác.</p>
                            <p>Mọi thắc mắc xin liên hệ:</p>
                            <ul>
                                <li>Số ĐT: 0207 3822 084</li>
                                <li>Email: thuvientuyenquang@gmail.com</li>
                                <li>Fanpage: <a href="https://www.facebook.com/thuvientinhtuyenquang1708">https://www.facebook.com/thuvientinhtuyenquang1708</a></li>
                            </ul>
                        </Col>
                        <Col span={8}>
                            <EventDetail />
                        </Col>
                    </Row>
                </Card>
                <Footer />
            </div>
        )
    }
}