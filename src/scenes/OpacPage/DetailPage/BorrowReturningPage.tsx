
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import * as React from "react"
import HeaderPage from "../MainPage/Header"
import Footer from "../MainPage/Footer"
import { Card, Col, Row } from "antd"
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons"
import "../MainPage/styles.css";
import EventDetail from "../MainPage/Event"

export default class BorrowReturningPage extends AppComponentBase {
    render() {
        return (
            <div>
                <HeaderPage />
                <Card style={{ padding: '15px 10%', fontSize: 16,height:'80%' }}>
                    <Row>
                        <Col span={16} >
                            <div>
                                <h1 style={{ margin: 0 }}>Dịch vụ mượn, trả tài liệu</h1>
                                <p> <CalendarOutlined style={{ color: 'red' }} />&nbsp;<i>11/7/2023 </i> &nbsp;&nbsp;<EyeOutlined style={{ color: 'red' }} /> &nbsp;<i>3035</i></p>
                                <p>Dịch vụ này nhằm mục đích giúp bạn đọc có thể mượn sách về nhà. Bạn đọc cần biết một số thông tin sau:</p>
                            </div>
                            <h3>1. Mượn sách</h3>
                            <h4>1.1 Hạn ngạch</h4>
                            <p>- Bạn đọc được mượn tối đa 5 tài liệu cùng lúc.</p>
                            <h4>1.2 Điều kiện</h4>
                            <p>- Bạn đọc cần xuất trình thẻ sinh viên hoặc căn cước công dân khi mượn (KHÔNG DÙNG ẢNH CHỤP).</p>
                            <p>- Không sử dụng thẻ của bạn đọc khác khi mượn sách tại thư viện.</p>
                            <p>-  Bạn đọc không vi phạm nội quy thư viện.</p>
                            <h4>1.3 Cách thức mượn đối với sách tham khảo:</h4>
                            <p>- Bạn đọc tự tìm sách trên giá, xem hướng dẫn tìm sách <a href="#">TẠI ĐÂY</a></p>
                            <p>- Lựa chọn các tài liệu phù hợp</p>
                            <p>- Làm thủ tục mượn tại quầy thủ thư.</p>
                            <h4>- Thời hạn mượn: Sách tiếng Việt 7 ngày/tài liệu | sách ngoại văn, song ngữ: 14 ngày/tài liệu.</h4>
                            <h4>1.4 Cách thức mượn đối với sách giáo trình:</h4>
                            <p>- Bạn đọc mượn, nhận giáo trình tại quầy thủ thư.</p>
                            <p>- Trong vòng 3 ngày sau khi mượn, nếu phát hiện sách bị hư hại, bạn đọc có thể đổi một cuốn sách khác.</p>
                            <h4>- Thời hạn mượn: Theo kỳ học như lịch thông báo.</h4>
                            <h4>1.5 Yêu cầu khi mượn sách:</h4>
                            <p>- Cần kiểm tra kỹ tình trạng sách trước khi rời khỏi quầy thủ thư.</p>
                            <p>- Cần trả sách đúng hạn, không để quá hạn sách.</p>
                            <p>- Phải giữ gìn sách cẩn thận, không viết, vẽ, làm ướt, tẩy, xóa lên nội dung sách.</p>
                            <h4>1.6 Phí phạt nếu vi phạm nội quy:</h4>
                            <p>- Quá hạn sách: 5.000vnđ/tài liệu/ngày (bao gồm ngày nghỉ).</p>
                            <p>- Đền sách: Bằng giá tiền thư viện nhập sách cộng tiền quá hạn sách (nếu có);</p>
                            <p>- Hư hỏng sách: Tùy theo mức độ ảnh hưởng, thủ thư sẽ đưa ra mức phí phạt phù hợp, tối đa bằng giá đền sách.</p>
                            <h3>2. TRẢ SÁCH</h3>
                            <p>Bạn đọc mang sách đã mượn tới quầy thủ thư (phòng 107 hoặc phòng 108 tòa nhà Delta) để thực hiện trả sách</p>
                            <p>Yêu cầu:</p>
                            <p>- Bạn đọc cần trả sách đúng hạn, không để quá hạn sách.</p>
                            <p>- Có thể nhờ người khác mang sách đi trả.</p>
                            <h4>Thông tin liên hệ:  </h4>
                            <p>SĐT: 0207 3822 084</p>
                            <p>Email: thuvientuyenquang@gmail.com</p>
                            <p>Fanpage: <a href="https://www.facebook.com/thuvientinhtuyenquang1708">https://www.facebook.com/thuvientinhtuyenquang1708</a> </p>

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