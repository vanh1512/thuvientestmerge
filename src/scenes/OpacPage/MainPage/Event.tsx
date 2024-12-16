
import AppComponentBase from "@src/components/Manager/AppComponentBase"
import { RouterPath } from "@src/lib/appconst"
import { GDocumentDto } from "@src/services/services_autogen"
import { stores } from "@src/stores/storeInitializer";
import * as React from "react"
export default class EventDetail extends AppComponentBase {
	documentList: GDocumentDto[] = [];
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		await stores.gDocument.getByBorrow(undefined, undefined, undefined);
		const { gDocumentListDto } = stores.gDocument;
		this.documentList = gDocumentListDto.slice(0, 5);
		this.setState({ isLoadDone: true });
	}
	onClickDetailDocument = (item: GDocumentDto) => {
		window.location.href = RouterPath.g_opacpage_detail_document + "?do_title=" + item.do_title;
	}
	render() {
		return (
			<>
				<div>
					<h2 style={{ color: "#1da57a" }}>Đề nghị sách</h2>
					<div style={{ border: "1px solid", padding: "10px" }}>
						Nếu bạn có yêu cầu hay đóng góp sách mới, hãy cho thư viện biết bằng cách điền thông tin <a href="https://forms.gle/9KvRFGduA97JWstj8">tại đây!</a>
					</div>
				</div>
				<div style={{ border: "1px solid", marginTop: '20px', marginBottom: 10 }}>
					<h2 style={{ color: "#fff", background: "#1da57a", margin: '0px', textAlign: 'center' }}>Mượn nhiều nhất</h2>
					<div>
						<ul style={{ margin: 0, listStyleType: 'disc' }}>
							{this.documentList.map((item, index) =>
							(<React.Fragment key={"key_" + index}>
								<li key={"key_" + index} ><a onClick={() => this.onClickDetailDocument(item)} style={{ cursor: "pointer" }}>{item.do_title}</a> </li>
							</React.Fragment>)
							)}
						</ul>
					</div>
				</div>
				<div>
					<h2 style={{ color: "#1da57a" }}>Cơ sở dữ liệu</h2>
					<div style={{ padding: "10px 0", border: "1px solid" }}>
						<ul style={{ margin: 0, listStyleType: 'disc' }}>
							<li><a href={RouterPath.g_opacpage_mostviewdocument}>Sách có nhiều lượt xem nhất</a></li>
							<li><a href={RouterPath.g_opacpage_mostborrowdocument}>Sách có lượt mượn nhiều nhất</a></li>
							<li><a href={RouterPath.g_opacpage_documentnewest}>Sách mới nhất</a></li>
						</ul>
					</div>
				</div>
			</>
		)
	}
}