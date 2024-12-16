
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import * as React from "react"
import HeaderPage from "../MainPage/Header"
import Footer from "../MainPage/Footer"
import { Card, Col, Row } from "antd"
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons"
import EventDetail from "../MainPage/Event"
export default class InstructionExtend extends AppComponentBase {
    render() {
        return (
            <>
                <HeaderPage />
                <Card style={{ padding: '15px 10%', fontSize: 16 }}>
                    <Row>
                        <Col span={16} >
                            <h1>Hướng dẫn bạn đọc xem sách đang mượn, tự gia hạn sách</h1>
                            <p> <CalendarOutlined style={{ color: 'red' }} />&nbsp;<i>11/7/2023 </i> &nbsp;&nbsp;<EyeOutlined style={{ color: 'red' }} /> &nbsp;<i>1728</i></p>
                            <p>Để xem sách đang mượn và gia hạn sách, Bạn đọc làm theo các bước sau:</p>
                            <p><b>Bước 1</b>: Truy cập link: <a href="http://mlibrary.vn/">http://mlibrary.vn/</a> Sau đó nhấp chuột vào Login (góc phải màn hình)</p>
                            <img style={{ width: "90%" }} src={process.env.PUBLIC_URL + '/library1.jpg'}></img>
                            
                            <p><b>Bước 2</b>:  Nhập thông tin đăng nhập</p>
                            <p>- Bạn hãy nhập đủ tên đăng nhập và mật khẩu.</p>
                            <p>- Sau đó nhấn đăng nhập nếu đã có tài khoản từ trước.</p>
                            <p>- Nếu chưa có bạn có thể đăng ký</p>
                            <img style={{ width: "90%" }} src={process.env.PUBLIC_URL + '/library2.jpg'}></img>

                            <p><b>Bước 3</b>:  Vào mục gia hạn</p>
                            <p>- Sau khi đăng nhập thành công bạn sẽ vào trang gia hạn tài liệu</p>
                            <img style={{ width: "90%" }} src={process.env.PUBLIC_URL + '/library3.png'}></img>
                            <p>- Chọn ngày gia hạn tài liệu</p>
                            <img style={{ width: "90%" }} src={process.env.PUBLIC_URL + '/library5.png'}></img>
                            <p>- Sau khi chọn ngày gia hạn xong sẽ lưu để gia hạn thành công</p>
                            <img style={{ width: "90%" }} src={process.env.PUBLIC_URL + '/library4.png'}></img>
                           
                            <h3>Bạn có thể đến quầy dịch vụ của thư viện để được gia hạn mượn tài liệu!</h3>
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