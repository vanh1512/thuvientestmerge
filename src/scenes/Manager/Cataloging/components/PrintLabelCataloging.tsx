import * as React from 'react';
import { Button, Card, Col, Input, Modal, Row, message } from 'antd';
import ActionExport from '@src/components/ActionExport';
import LabelBook from '../../Buy/CatalogingRecord/components/LabelBook';
import { L } from '@src/lib/abpUtility';
import { stores } from '@src/stores/storeInitializer';
import { SearchOutlined } from '@ant-design/icons';
import { ItemLabel } from '../../DocumentInfor/components/PrintLabelDocumentInfor';
import AppConsts from '@src/lib/appconst';
import { CatalogingDto } from '@src/services/services_autogen';

export interface IProps {
	visible: boolean;
	onCancel: () => void;
	listItemLabel?: CatalogingDto[];
}
export default class PrintLabelCataloging extends React.Component<IProps> {
	componentRef: any | null = null;
	listLabel: ItemLabel[] = [];
	state = {
		isLoadDone: true,
		dkcbCode: undefined,
	}

	componentDidMount() {
		this.initData();
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	initData = () => {
		const { listItemLabel } = this.props;
		this.setState({ isLoadDone: false });
		if (listItemLabel != undefined && listItemLabel.length > 0) {
			listItemLabel.map(item => {
				let itemLabel = new ItemLabel();
				itemLabel.ma_1 = (item.cata_resultDDC != "" && JSON.parse(item.cata_resultDDC!)["082"].subfields != undefined && JSON.parse(item.cata_resultDDC!)["082"].subfields.find(item => "$a" in item) != undefined) ? JSON.parse(item.cata_resultDDC!)["082"].subfields.find(item => "$a" in item).$a : "";
				itemLabel.ma_2 = (item.cata_resultTitle != "" && JSON.parse(item.cata_resultTitle!)["245"].subfields != undefined && JSON.parse(item.cata_resultTitle!)["245"].subfields.find(item => "$a" in item) != undefined) ? AppConsts.titleEncode(JSON.parse(item.cata_resultTitle!)["245"].subfields.find(item => "$a" in item).$a) : "";
				itemLabel.dkcb_code = item.dkcb_code!;
				this.listLabel.push(itemLabel);
			});
		}
		this.setState({ isLoadDone: true });

	}
	searchDocumentInforByDkcb = async () => {
		this.setState({ isLoadDone: false });
		if (this.state.dkcbCode != undefined) {
			let item = await stores.catalogingStore.getDocumentInforByDkcbCode(this.state.dkcbCode);
			if (item.dkcb_code != undefined) {
				let itemLabel = new ItemLabel();
				itemLabel.ma_1 = (item.cata_resultDDC != "" && JSON.parse(item.cata_resultDDC!)["082"].subfields != undefined && JSON.parse(item.cata_resultDDC!)["082"].subfields.find(item => "$a" in item) != undefined) ? JSON.parse(item.cata_resultDDC!)["082"].subfields.find(item => "$a" in item).$a : "";
				itemLabel.ma_2 = (item.cata_resultTitle != "" && JSON.parse(item.cata_resultTitle!)["245"].subfields != undefined && JSON.parse(item.cata_resultTitle!)["245"].subfields.find(item => "$a" in item) != undefined) ? AppConsts.titleEncode(JSON.parse(item.cata_resultTitle!)["245"].subfields.find(item => "$a" in item).$a) : "";
				itemLabel.dkcb_code = item.dkcb_code!;
				this.listLabel.push(itemLabel);
			}
			else {
				message.error(L("khong_co_ma_Isbn_nay"));
				return;
			}
		}
		await this.setState({ isLoadDone: true, dkcbCode: undefined });
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
		console.log(3211, this.props.listItemLabel);
		console.log(44444444, this.listLabel);


		return (
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
					<Row style={{ marginBottom: '10px', justifyContent: 'center' }}>
						<Col span={10}>
							<strong>{L('CodeDkcb')}:</strong> &nbsp;&nbsp;<Input maxLength={AppConsts.maxLength.name} allowClear onPressEnter={this.searchDocumentInforByDkcb} value={this.state.dkcbCode} onChange={(e) => this.setState({ dkcbCode: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} />
						</Col>
						<Col span={4} style={{ marginTop: '23px' }}>
							&nbsp;&nbsp;
							<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.searchDocumentInforByDkcb()} >{L('CreateLabel')}</Button>
						</Col>
					</Row>
					{this.listLabel != undefined && this.listLabel.length > 0 &&
						<div id={"label_book_id"} ref={this.setComponentRef} style={{ boxSizing: 'border-box' }}>
							<div style={{ width: "100%", display: "flex", flexWrap: "wrap", boxSizing: 'border-box' }}>
								{this.listLabel != undefined && [...this.listLabel].map((item, index) =>
									<div id={'labelClass'} className='page-break' key={"labelClass_" + index + "_" + item.dkcb_code} style={{ width: "24%", marginLeft: '3px' }} >
										<LabelBook itemLabel={item} />
									</div>
								)}
							</div>
						</div>
					}
				</>
			</Modal>
		)

	}
}