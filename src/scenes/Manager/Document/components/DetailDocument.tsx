import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { AttachmentItem, DocumentDto, TopicDto } from "@src/services/services_autogen";
import { Card, Col, Image, Row } from "antd";
import moment from "moment";
import React from "react";
import { stores } from '@stores/storeInitializer';
import TableMainDocumentInfor from "../../DocumentInfor/components/TableMainDocumentInfor";
import { L } from "@src/lib/abpUtility";


interface IProps {
	documentSelected: DocumentDto | undefined;
	do_id?: number;
	onCancel?: () => void;
}


export default class DetailDocument extends AppComponentBase<IProps>{

	state = {
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,

	}
	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.documentInforStore.getAll(this.props.documentSelected!.do_id, undefined, undefined, undefined, undefined, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true });
	}

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}


	render() {
		const self = this;
		const documentSelected = this.props.documentSelected != undefined ? this.props.documentSelected : new DocumentDto();
		const { documentInforListResult, totalDocumentInfor } = stores.documentInforStore;
		return (
			<Card className="detailDocument">
				<Row justify="center" style={{ marginBottom: 10 }}>
					<Col span={18}>
						<Row style={{ justifyContent: 'center', }}>
							<h1 style={{ textTransform: 'uppercase' }}>{documentSelected.do_title}</h1>
						</Row>

						<Row gutter={16} style={{ justifyContent: 'center' }}>
							<Col>
								<p> <b>{L('Author')} </b>:  {documentSelected.au_id_arr?.map(({ id, name }) => name + ". ")}</p>
								<p><b>{L('Category')} : </b>{stores.sessionStore.getNameCategory(documentSelected.ca_id)}</p>
							</Col>

							<Col>
								<p><b>{L('Topic')} : </b>{stores.sessionStore.getNameTopic(documentSelected.to_id)}</p>
								<p><b>{L('Publisher')}:</b> {documentSelected.pu_id.name}</p>
							</Col>

							<Col>
								<p><b>{L('AvailableDate')}:</b> {moment(documentSelected.do_date_available).format('DD/MM/YYYY')}</p>
								<p><b>{L('Quote')}: </b>{documentSelected.do_identifier_citation}</p>
							</Col>
						</Row>
					</Col>

					{documentSelected.fi_id_arr_cover !== undefined && documentSelected.fi_id_arr_cover.length > 0 &&
						<Col span={6}>
							<Row justify="center">
								&nbsp;
								<Image
									width={130}
									src={this.getFile(documentSelected.fi_id_arr_cover.filter(item => (item.isdelete == false))[0].id)}
								/>
							</Row>
						</Col>
					}
				</Row>

				<Row>
					<TableMainDocumentInfor
						noscroll={false}
						documentInforListResult={documentInforListResult}
						isEditable={false}
						pagination={{
							pageSize: this.state.pageSize,
							total: totalDocumentInfor,
							current: this.state.currentPage,
							showTotal: (tot) => L("Total") + ": " + tot + "",
							showQuickJumper: true,
							showSizeChanger: true,
							pageSizeOptions: ['10', '20', '50', '100'],
							onShowSizeChange(current: number, size: number) {
								self.onChangePage(current, size)
							},
							onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
						}}
					/>
				</Row>
			</Card>
		)
	}
}