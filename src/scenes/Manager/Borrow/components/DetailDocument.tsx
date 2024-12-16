import * as React from 'react';
import { Row, Card } from 'antd';
import { AttachmentItem, AuthorDto, DocumentBorrowDto, ItemAuthor, ItemLanguages, LanguagesDto } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import { FileUploadType } from '@src/lib/appconst';


export interface IProps {
	do_id: number;
}

export default class DetailDocument extends React.Component<IProps>{

	// state = {
	// 	isLoadDone: true,
	// 	documentSelected: new DocumentBorrowDto(),
	// };

	// async componentDidUpdate(prevProps) {
	// 	if (this.props.do_id !== prevProps.do_id && !!this.props.do_id) {
	// 		const doc = await stores.borrowReturningStore.memberGetDocumentBorrowById(this.props.do_id);
	// 		this.setState({ documentSelected: doc });
	// 	}
	// }

	// render() {
	// 	const self = this;
	// 	const dateFormat = 'DD/MM/YYYY';

	// 	return (
	// 		<div>
	// 			<h3 style={{ fontWeight: "bold" }}>{this.state.documentSelected.do_title}</h3>
	// 			<hr />
	// 			<div>
	// 				<h4>{L("tom_tat")}: </h4>
	// 				<p>{this.state.documentSelected.do_abstract}</p>
	// 			</div>
	// 			<div>
	// 				<h4>{L("nam_xuat_ban")}: </h4>
	// 				<p>{this.state.documentSelected.do_date_publish}</p>

	// 			</div>
	// 			<div>
	// 				<h4>{L("Publisher")}: </h4>
	// 				<p>{this.state.documentSelected.publisher.name}</p>

	// 			</div>
	// 			<div>
	// 				<h4>{L("tai_ban_lan")}: </h4>
	// 				<p>{this.state.documentSelected.do_republish}</p>

	// 			</div>
	// 			<div>
	// 				<h4>{L("tac_gia")}: </h4>
	// 				<p>
	// 					{(!!this.state.documentSelected.authors_arr && this.state.documentSelected.authors_arr.length > 0) ? (
	// 						this.state.documentSelected.authors_arr.map((item: ItemAuthor, index: number) => (
	// 							<span key={item.id + "_author" + index}>
	// 								<a href="#">{item.name}</a>
	// 								{(!!self.state.documentSelected?.authors_arr && index !== self.state.documentSelected?.authors_arr.length - 1) ? "," : null}
	// 							</span>
	// 						))
	// 					) : null}
	// 				</p>

	// 			</div>
	// 			<div>
	// 				<h4>{L("Language")}: </h4>
	// 				<p>
	// 					{(!!this.state.documentSelected.languages && this.state.documentSelected.languages.length > 0) ? (
	// 						this.state.documentSelected.languages.map((item: ItemLanguages, index: number) => (
	// 							<span key={item.id + "_lang_" + index}>
	// 								{item.name}
	// 								{(self.state.documentSelected?.languages && index !== self.state.documentSelected?.languages.length - 1) ? "," : null}
	// 							</span>
	// 						))
	// 					) : null}
	// 				</p>

	// 			</div>
	// 			<div>
	// 				<h4>{L("Quote")}: </h4>
	// 				<p>{this.state.documentSelected.do_identifier_citation}</p>
	// 			</div>
	// 			<div>
	// 				<h4>{L("luot_xem")}: </h4>
	// 				<p>{this.state.documentSelected.do_num_view}</p>
	// 			</div>
	// 			<div>
	// 				<h4>{L("luot_tai")}: </h4>
	// 				<p>{this.state.documentSelected.do_num_dowload}</p>
	// 			</div>
	// 			<Row  >
	// 				<strong>{L("CoverImage")}</strong>
	// 				{/* <FileAttachments
	//                     files={self.state.documentSelected.fi_id_arr_cover || []}
	//                     allowEditting={false}
	//                     allowRemove={false}
	//                     isMultiple={false}
	//                 /> */}
	// 				<FileAttachments
	// 					files={self.state.documentSelected.fi_id_arr_cover || []}
	// 					allowRemove={false}
	// 					isMultiple={false}
	// 					isViewFile={false}
	// 					componentUpload={FileUploadType.Avatar}
	// 					onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
	// 						self.state.documentSelected.fi_id_arr_cover = itemFile;
	// 					}}
	// 				/>
	// 			</Row>

	// 		</div>
	// 	)
	// }
}