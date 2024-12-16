
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import * as React from "react"
import HeaderPage from "../MainPage/Header"
import Footer from "../MainPage/Footer"
import { Card, Col, Row } from "antd"
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons"
import { RouterPath } from "@src/lib/appconst"
import EventDetail from "../MainPage/Event"
export default class PageExtend extends AppComponentBase {
    render() {

        return (
            <>
                <HeaderPage />
                <Card style={{ padding: '15px 10%', fontSize: 16 }}>
                    <Row>
                        <Col span={16} >
                            <h1>Dịch vụ gia hạn sách</h1>
                            <p> <CalendarOutlined style={{ color: 'red' }} />&nbsp;<i>11/7/2023 </i> &nbsp;&nbsp;<EyeOutlined style={{ color: 'red' }} /> &nbsp;<i>3035</i></p>
                            <p>Bạn đọc thân mến,</p>
                            <p>Thư viện xin hướng dẫn các bạn các cách gia hạn sách như sau:</p>
                            <h4>Cách 𝟏: Bản thân tự gia hạn, hướng dẫn <a href={RouterPath.g_opacpage_instruction_extend}>TẠI ĐÂY</a>:</h4>
                            <h4>Cách 𝟐: Gửi email tới "thuvientuyenquang@gmail.com"</h4>
                            <ul>
                                <li>Chủ đề mail "Xin gia hạn sách"</li>
                                <li>Nội dung mail các bạn cần ghi rõ họ tên + mã sinh viên/nhân viên,</li>
                                <li>Lý do xin gia hạn sách và thời hạn mong muốn nếu cần (để thư viện xem xét tùy từng trường hợp nha)</li>
                                <li>Ký tên (VD Họ tên, số điện thoại liên hệ, CLB em tham gia,...)</li>
                            </ul>
                            <p>LƯU Ý: Tuyệt đối 𝐊𝐇Ô̂𝐍𝐆 𝐑𝐄𝐏𝐋𝐘 𝐀𝐔𝐓𝐎𝐌𝐀𝐈𝐋, các bạn nhớ soạn mail mới để đặt chủ đề mail đúng nha. (Mail tự động ngoài việc thông báo hạn trả còn là hướng dẫn cách gia hạn nên các bạn đọc kỹ chữ đừng bỏ qua nhé.)</p>
                            <h4>Cách 3: Gọi điện tới Thư viện (gọi trong giờ hành chính) theo số: 0207 3822 084</h4>
                            <h4>Cách 4: Inbox page <a href="https://www.facebook.com/thuvientinhtuyenquang1708">https://www.facebook.com/thuvientinhtuyenquang1708</a>, Admin hỗ trợ nhé.</h4>
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