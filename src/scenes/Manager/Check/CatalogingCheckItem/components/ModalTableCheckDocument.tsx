import ActionExport from "@src/components/ActionExport";
import FooterReport from "@src/components/LayoutReport/FooterReport";
import HeaderReport from "@src/components/LayoutReport/HeaderReport";
import GetNameItem from "@src/components/Manager/GetNameItem";
import { L } from "@src/lib/abpUtility";
import { DocumentInforDto } from "@src/services/services_autogen";
import { stores } from "@src/stores/storeInitializer";
import { Button, Col, Modal, Row, Table } from "antd";
import moment from "moment";
import React from "react";

export interface IProps {
	idSelected: number[];
	isChangeTable: boolean;
	visible: boolean;
	titleTable: string;
	onCancel: () => void;
}
export default class ModalTableCheckDocument extends React.Component<IProps>
{
	state = {
		isLoadDone: false,
		isChangeTable: undefined,
		isHeaderReport: false,
	}
	listDocumentInfor: DocumentInforDto[] = [];
	componentRef: any | null = null;
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	async componentDidMount() {
		await this.getAll()
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.isChangeTable !== prevState.isChangeTable) {
			return ({ isChangeTable: nextProps.isChangeTable });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.isChangeTable !== prevState.isChangeTable) {
			await this.getAll()

		}
	}
	getAll = async () => {
		this.setState({ isLoadDone: false });
		this.listDocumentInfor = await stores.documentInforStore.getAllByIdArr(this.props.idSelected!, undefined, undefined);
		this.setState({ isLoadDone: true });
	}

	render() {
		const columns = [
			{ title: L('N.O'), width: 60, key: 'do_index', render: (text: string, item: DocumentInforDto, index: number) => <div>{index + 1}</div> },
			{ title: L('DocumentName'), key: 'dkcb', render: (text: string, item: DocumentInforDto, index: number) => <div>{GetNameItem.getNameDocument(item.do_id)}</div> },
			{ title: L('ĐKCB'), key: 'dkcb', render: (text: string, item: DocumentInforDto, index: number) => <div>{item.dkcb_code}</div> },
			{ title: L('CodeIsbn'), key: 'date_create', render: (text: string, item: DocumentInforDto, index: number) => <div>{item.do_in_isbn}</div> },
			{ title: L('Note'), key: 'note', render: (text: string, item: DocumentInforDto, index: number) => <div>{item.do_in_note}</div> },

		]
		return (
			<Modal
				title={
					<Row>
						<Col span={5}>
							<h3>{this.props.titleTable}</h3>
						</Col>
						<Col span={19} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={this.props.titleTable + "_" + moment().format("DD-MM-YYYY")}
								idPrint="checkItem_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L('huy')} danger style={{ margin: '0 26px 0 10px' }} onClick={this.props.onCancel}>{L("huy")}</Button>
						</Col>
					</Row>
				}
				visible={this.props.visible}
				closable={false}
				maskClosable={true}
				onCancel={() => !!this.props.onCancel && this.props.onCancel()}
				footer={null}
				width={"60vw"}
			>


				<Row style={{ marginTop: '10px' }} id='checkItem_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{L("DANH_SACH") + " " + this.props.titleTable.toUpperCase()}</h2></Col>
					<Col span={24}>
						<Table
							scroll={this.state.isHeaderReport ? { x: undefined, y: undefined } : { x: 700, y: 500 }}
							rowKey={record => "tableCheckDocumeny_index__" + JSON.stringify(record)}
							columns={columns}
							bordered={true}
							locale={{ "emptyText": L('NoData') }}
							dataSource={this.listDocumentInfor.length > 0 ? this.listDocumentInfor : []}
							pagination={false}
						/>
					</Col>
					{this.state.isHeaderReport && <FooterReport />}

				</Row>
			</Modal>

		)
	}
}