import { Card, Col, Row, } from "antd"
import * as React from "react"
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import Footer from "../MainPage/Footer";
import HeaderPage from "../MainPage/Header";
import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import EventDetail from "../MainPage/Event";
export default class RulesPage extends AppComponentBase {

    render() {
        // const linkLogin = RouterPath.g_login
        return (
            <div>
                <HeaderPage />
                <Card style={{ padding: '15px 10%', fontSize: 16 }}>
                    <Row >
                        <Col span={16}>
                            <div>
                                <h1>Nội quy Thư Viện</h1>
                                <p><CalendarOutlined style={{ color: 'red' }} /> <i>11/7/2023</i> &nbsp;&nbsp;&nbsp; <EyeOutlined style={{ color: 'red' }} /> <i>3035</i> </p>
                            </div>
                            <div>
                                <h4>Điều 1: Thẻ thư viện (Library card)</h4>
                                &nbsp;&nbsp;&nbsp; <p>Thẻ sinh viên / nhân viên đồng thời là thẻ thư viện để sử dụng các dịch vụ của thư viện.</p>
                                <h4>Điều 2: Giờ mở cửa</h4>
                                <Row><h4>Thứ Hai – Thứ Sáu</h4>:  8h15 – 21h00 </Row>
                                <Row><h4> Cuối tuần</h4>: 8h00 – 12h00, 13h00 – 17h00 (Buổi tối và cuối tuần thư viện chỉ phục vụ chỗ tự học) </Row>
                                <h4>Điều 3: Các dịch vụ của Thư viện</h4>
                                <ol style={{ listStyleType: 'decimal-leading-zero' }}>
                                    <li>Mượn, trả, gia hạn tài liệu.</li>
                                    <li>Hướng dẫn tìm tin và sử dụng thư viện.</li>
                                    <li>Tìm kiếm và tư vấn thông tin.</li>
                                    <li>Tìm kiếm và tư vấn thông tin.</li>
                                    <li>Tiếp nhận đề nghị đặt mua tài liệu.</li>
                                    <li>Mượn liên thư viện.</li>
                                    <li>Phòng học nhóm.</li>
                                </ol>
                                <h4>Điều 4: Các quy định chung khi vào thư viện</h4>
                                <ol style={{ listStyleType: 'decimal-leading-zero' }}>
                                    <li>Xuất trình thẻ thư viện khi giao dịch với Thư viện. Không dùng thẻ của người khác và không cho người khác mượn thẻ của mình.</li>
                                    <li>Giữ gìn trật tự, đi nhẹ, nói khẽ.</li>
                                    <li>Giữ gìn vệ sinh chung: không hút thuốc lá, không viết, vẽ lên mặt bàn, không ngồi gác chân lên ghế, bỏ rác đúng nơi quy định.</li>
                                    <li>Không được mang vào thư viện đồ ăn, uống, chất độc hại, chất cháy nổ,...</li>
                                    <li>Tắt chuông điện thoại, không nói chuyện điện thoại trong thư viện.</li>
                                    <li>Không viết bút chì, bút mực hoặc sử dụng bút đánh dấu lên sách.</li>
                                    <li>Không gập hoặc làm nhàu nát, rách sách.</li>
                                    <li>Không để sách bị ẩm ướt, mốc hoặc hư hỏng dưới bất kỳ hình thức nào.</li>
                                </ol>
                                <h4>Điều 5: Quy định khi mượn/trả tài liệu</h4>
                                <ol style={{ listStyleType: 'decimal-leading-zero' }}>
                                    <li> Sau khi đọc sách xong, bạn đọc đặt sách về khu vực đã được quy định, không tự ý xếp sách lên giá.</li>
                                    <li>Không mang bất cứ tài liệu nào ra khỏi thư viện khi chưa làm thủ tục mượn về.</li>
                                    <li> Đối với giáo trình, tài liệu học tập: Mỗi sinh viên được mượn 1 bộ giáo trình, tài liệu dùng cho kỳ học hiện tại theo danh sách lớp của phòng Đào tạo. Những tài liệu giáo trình này, bạn đọc được gia hạn tối đa 1 tuần khi có lý do hợp lý.</li>
                                    <li>Đối với sách giáo trình được mượn như tài liệu tham khảo, hạn trả áp dụng như đối với sách tham khảo thông thường.</li>
                                    <li>Đối với tài liệu tham khảo: Bạn đọc được mượn tối đa 10 tên sách, trong thời hạn 1 tuần/ tài liệu tiếng Việt, 2 tuần/ tài liệu ngoại văn và được gia hạn 4 lần.</li>
                                    <li>Người có trach nhiệm:
                                        <ol>
                                            <li>Kiểm tra và xác nhận quá trình giao dịch với thủ thư ngay tại quầy.</li>
                                            <li>Kiểm tra tình trạng thực tế của tài liệu đã được ghi mượn trước khi mang ra khỏi thư viện, đồng thời giữ gìn, bảo quản tài liệu trong thời gian mượn. Khi phát hiện hư hỏng, người mượn cuối cùng của tài liệu đó sẽ chịu trách nhiệm bồi thường theo quy định.</li>
                                        </ol>
                                    </li>
                                </ol>
                                <h4>Điều 6: Xử lý vi phạm nội quy thư viện</h4>
                                <ol style={{ listStyleType: 'decimal-leading-zero' }}>
                                    <li>Bạn đọc vi phạm các quy định tại Điều 4, 5 tùy theo mức độ và lần vi phạm có thể bị nhắc nhở, khiển trách và mời ra khỏi thư viện; lập biên bản cảnh cáo, tạm ngừng sử dụng các dịch vụ thư viện hoặc sẽ bị tước quyền sử dụng các dịch vụ thư viện vĩnh viễn, tạm thời đình chỉ học tập hoặc buộc thôi học.</li>
                                    <li>Trường hợp làm hư hại (như long bìa, nhàu nát, bôi bẩn, viết, vẽ, mất trang...) hoặc mất tài liệu, bạn đọc phải bồi thường thiệt hại tương đương với giá trị của tài liệu.</li>
                                    <li>Trường hợp mượn tài liệu quá hạn sẽ phải chịu tiền phạt là: 5.000 đồng/ngày/1 cuốn kể cả ngày nghỉ.</li>
                                    <li>Trong bất cứ trường hợp vi phạm nào, bạn đọc phải đền bù thiệt hại theo quy định.</li>
                                </ol>
                                <h3 style={{ width: "100%", textAlign: 'end' }}>PHÒNG THÔNG TIN - THƯ VIỆN</h3>
                                <h2 style={{ width: "100%", textAlign: 'center' }}>LIBRARY REGULATIONS</h2>
                                <h4>Article 1: How to get library card?</h4>
                                &nbsp;&nbsp;&nbsp;&nbsp;<p>Your student ID card is your Library card. Use your Student or Staff ID card to access Library services and resources.</p>
                                <h4>Article 2: Opening hours</h4>
                                &nbsp;&nbsp;&nbsp;&nbsp;<p>Monday - Friday: 8:15 – 21:00</p>
                                &nbsp;&nbsp;&nbsp;&nbsp;<p>Weekend: 8:00 – 12:00, 13:00 – 17:00  (Evenings and weekends the library only serves self-study)</p>
                                <h4>Article 3: Library services:</h4>
                                <ol style={{ listStyleType: 'decimal-leading-zero' }}>
                                    <li>Circulation.</li>
                                    <li>Seeking information.</li>
                                    <li>Information consulting.</li>
                                    <li>“Log - on - to e-resource”.</li>
                                    <li>Request materials.</li>
                                    <li>Interlibrary loan.</li>
                                    <li>Group work rooms.</li>
                                </ol>
                                <h4>Article 4: General regulations</h4>
                                <ol style={{ listStyleType: 'decimal-leading-zero' }}>
                                    <li>Patrons must present a valid card to enter library. Cards are non-transferrable.</li>
                                    <li>Loud conversation is forbidden throughout the Library.</li>
                                    <li>Please consciously keep the library clean, no smoking, no graffiti, no littering ...</li>
                                    <li>Food, drink, toxic and explosive substances in the Library are forbidden</li>
                                    <li>Please keep quiet in the library and set the mobile phone or computer and other equipment in silent mode. Do not talk to other via phone.</li>
                                    <li>Do not use pencils, pens or highlighters in the book.</li>
                                    <li>Do not bend or tear the pages of the book.</li>
                                    <li>Do not let it get wet or mouldy or damaged in any way.</li>
                                </ol>
                                <h4>Article 5: Circulation policies</h4>
                                <ol style={{ listStyleType: 'decimal-leading-zero' }}>
                                    <li>Place books on designed area after finishing. Do not arrange books on shelf freely.</li>
                                    <li>Materials may not be taken out of the FPT university library without permission of the Librarian.</li>
                                    <li>Textbook for semester/block: Textbook are delivered according to academic calendar. Textbooks can only be renewed up to 1 week when you having suitable reasons.</li>
                                    <li>Textbook for reference purposes: 1 week after new block start, patrons can borrow textbooks as reference books.</li>
                                    <li>Reference book: Patrons can borrow up to 10 titles, loan period is 1 week for mother tongue books and 2 weeks for foreign language books, you can renew up to 4 times.</li>
                                    <li>Patrons should:
                                        <ol>
                                            <li>Check list of books borrowed and confirm with librarian.</li>
                                            <li> Make sure book condition notes at the end of your borrowed books are updated. You are responsible for the condition of everything while it is on loan to you. Please take good care of books or you pay for the damage according to the regulation.</li>
                                        </ol>
                                    </li>
                                </ol>
                            </div>
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