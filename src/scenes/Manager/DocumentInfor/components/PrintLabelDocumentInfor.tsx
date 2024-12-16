import * as React from 'react';
import { Button, Card, Col, Input, Modal, Row, message } from 'antd';
import ActionExport from '@src/components/ActionExport';
import LabelBook from '../../Buy/CatalogingRecord/components/LabelBook';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import { Iprops } from '../../Document/TabDocumentInfor';
import { SearchOutlined } from '@ant-design/icons';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import { DocumentInforDto } from '@src/services/services_autogen';

export class ItemLabel {
	ma_1: string;
	ma_2: string;
	dkcb_code: string;
}
export interface IProps {
	visible: boolean;
	onCancel: () => void;
	do_in_id_arr?: number[];
}
export default class PrintLabelDocumentInfor extends React.Component<IProps> {
	componentRef: any | null = null;
	listLabel: ItemLabel[] = [];
	state = {
		isLoadDone: true,
		isbn: undefined,
	}
	listDocumentInfo: DocumentInforDto[] = [];
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		if (!!this.props.do_in_id_arr && this.props.do_in_id_arr.length > 0) {
			await this.getAllByIdArr();
			this.listDocumentInfo.map(async item => {
				if (item.dkcb_code != undefined) {
					let itemLabel = new ItemLabel();
					itemLabel.dkcb_code = item.dkcb_code!;
					this.listLabel.push(itemLabel);
				}
			})
		}
		this.setState({ isLoadDone: true });
	}
	async getAllByIdArr() {
		this.listDocumentInfo = await stores.documentInforStore.getAllByIdArr(this.props.do_in_id_arr, undefined, undefined);
	}

	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	searchDocumentInforByIsbn = async () => {
		this.setState({ isLoadDone: false });
		if (this.state.isbn != undefined) {
			let item = await stores.documentInforStore.getDocumentInforForISBN(this.state.isbn);
			if (item.dkcb_code != undefined) {
				let itemLabel = new ItemLabel();
				itemLabel.dkcb_code = item.dkcb_code!;
				this.listLabel.push(itemLabel);
			}
			else {
				message.error(L("khong_co_ma_Isbn_nay"));
				return;
			}
		}
		await this.setState({ isLoadDone: true, isbn: undefined });
	}
	onCancel = () => {
		this.setState({ isLoadDone: false });
		if (!!this.props.onCancel) {
			this.props.onCancel();
			this.listLabel = [];
		}
		this.setState({ isLoadDone: true });
	}
	render() {
		return (
			<div>
				<Modal
					visible={this.props.visible}
					title={
						<Row gutter={16} justify='space-between'>
							<Col >{L('PrintLabel')}</Col>
							<Col >
								<ActionExport
									nameFileExport='Label book'
									idPrint="label_book_id"
									isExcel={false}
									isWord={false}
									componentRef={this.componentRef}
								/>&nbsp;
								<Button danger onClick={this.onCancel}>{L("Cancel")}</Button>
							</Col>
						</Row>
					}
					onCancel={this.onCancel}
					footer={null}
					width='70vw'
					maskClosable={false}
					closable={false}
				>
					<>
						<Row style={{ marginBottom: '10px', justifyContent: 'center' }} gutter={8} align='bottom'>
							<Col {...cssColResponsiveSpan(12, 12, 12, 8, 8, 8)}>
								<strong>{L('CodeIsbn')}:</strong> &nbsp;&nbsp;<Input allowClear onPressEnter={this.searchDocumentInforByIsbn} value={this.state.isbn} onChange={(e) => this.setState({ isbn: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
							</Col>
							<Col {...cssColResponsiveSpan(12, 12, 12, 8, 8, 8)}>
								&nbsp;&nbsp;
								<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.searchDocumentInforByIsbn()} >{L('CreateLabel')}</Button>
							</Col>
						</Row>
						{/* {this.listLabel != undefined && this.listLabel.length > 0 &&
							<Row id={"label_book_id"} ref={this.setComponentRef} gutter={[8, 8]} style={{ boxSizing: 'border-box', width: '100%' }}>
								{this.listLabel != undefined && [...this.listLabel].map((item, index) =>
									<Col id={'labelClass'} className='page-break' key={"labelClass_" + index + "_" + item.dkcb_code} span={4}>
										<Row>
											<LabelBook itemLabel={item} />
										</Row>
									</Col>
								)}
							</Row>
						} */}
						{this.listLabel != undefined && this.listLabel.length > 0 &&
							<div id={"label_book_id"} ref={this.setComponentRef} style={{ boxSizing: 'border-box' }}>
								<div style={{ width: "100%", display: "flex", flexWrap: "wrap", boxSizing: 'border-box' }}>
									{this.listLabel != undefined && [...this.listLabel].map(item =>
										<div id={'labelClass'} className='page-break' key={"labelClass" + item.dkcb_code} style={{ width: "24%", marginLeft: '3px', marginBottom: '5px' }} >
											<LabelBook itemLabel={item} />
										</div>
									)}
								</div>
							</div>}
					</>
				</Modal>
			</div>
		)

	}
}