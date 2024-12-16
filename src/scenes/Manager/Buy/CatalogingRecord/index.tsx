import * as React from 'react';
import { Col, Row, Button, Card, Steps, Result } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ReceiptDto, CreateDocumentInforInput, BillingItemDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import PrintLabel, { ItemLabel } from './components/PrintLabel';
import Cataloging from './components/Cataloging';
import HistoryHelper from '@src/lib/historyHelper';
import { RouterPath } from '@src/lib/appconst';
import { eReceiptStatus } from '@src/lib/enumconst';
import { StepBackwardOutlined } from '@ant-design/icons';
export interface IProps {
	receiptSelected?: ReceiptDto;
	onSuccess?: () => void;
}
export default class CatalogingRecord extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		currentStep: 0,
	};
	receiptDtoSelect: ReceiptDto | undefined;
	listCreateDocumentInfor: CreateDocumentInforInput[] = [];
	planDetailList: BillingItemDto[] = [];
	itemLabelList: ItemLabel[] = [];
	rec_id: string | null;
	async componentDidMount() {
		const query = new URLSearchParams(window.location.search);
		if (query == null) {
			HistoryHelper.back();
		}
		this.rec_id = query.get('rec_id');

		if (isNaN(Number(this.rec_id))) {
			HistoryHelper.back();
		}
		await this.getData(Number(this.rec_id));
		if (this.receiptDtoSelect != undefined && this.receiptDtoSelect.rec_status != eReceiptStatus.Chua_nhap_tai_lieu.num) {
			HistoryHelper.redirect(RouterPath.admin_buy_importing_receipt);
		}

	}
	async getData(rec_id: number) {
		this.setState({ isLoadDone: false });
		await stores.receiptStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined);
		const { receiptListResult } = stores.receiptStore;
		this.receiptDtoSelect = receiptListResult.find(a => a.rec_id == rec_id);
		if (this.receiptDtoSelect != undefined) {
			this.planDetailList = await stores.billingItemStore.getByListId(this.receiptDtoSelect.bi_it_id_arr);
		}
		await this.initData();
		await this.setState({ isLoadDone: true });
	}

	initData = async () => {
		this.setState({ isLoadDone: false });
		this.listCreateDocumentInfor = [];
		this.itemLabelList = [];
		let dicCategoryId: { [key: number]: number } = {};
		if (this.planDetailList != undefined && this.planDetailList.length > 0) {
			this.planDetailList.map(async (item: BillingItemDto) => {
				let itemCate = await stores.categoryStore.getCateByDoID(item.do_id?.id);
				let dkcb = "";
				if (itemCate != undefined) {
					dkcb = itemCate.dkcb_code + "";
				}
				if (!dicCategoryId.hasOwnProperty(itemCate.ca_id)) {
					dicCategoryId[itemCate.ca_id] = itemCate.dkcb_current;
				}
				for (let i = 0; i < item.bi_it_amount; i++) {
					let itemDocIn = new CreateDocumentInforInput();
					itemDocIn.do_id = item.do_id.id;

					dicCategoryId[itemCate.ca_id] = dicCategoryId[itemCate.ca_id] + 1;
					itemDocIn.dkcb_code = dkcb + "." + this.returnStringDKCB(dicCategoryId[itemCate.ca_id]);
					this.listCreateDocumentInfor.push(itemDocIn);
					let itemLabel = new ItemLabel();
					itemLabel.dkcb_code = itemDocIn.dkcb_code;

					this.itemLabelList.push(itemLabel);
				}
			});
		}
		await this.setState({ isLoadDone: true });
	}
	returnStringDKCB = (value: number) => {
		//trả về 5 chữ số ( bao gồm số 0)
		let stringOutput: string = "";
		if ((value.toString()).length < 5) {
			for (let i = 0; i < 5 - (value.toString()).length; i++) {
				stringOutput = stringOutput.concat("0");
			}
		}
		stringOutput = stringOutput.concat(value + "");
		return stringOutput
	}
	onCreateListDocumentInfor = async (listCreateDocumentInfor: CreateDocumentInforInput[]) => {
		this.setState({ isLoadDone: false });
		let result = await stores.documentInforStore.createListDocumentInfor(listCreateDocumentInfor);
		if (result != undefined) {
			await stores.receiptStore.catalogingReceipt(this.receiptDtoSelect!.rec_id);
		}
		this.setState({ currentStep: this.state.currentStep + 1, isLoadDone: true });
	}
	onSuccess = () => {
		if (!!this.props.onSuccess) {
			this.props.onSuccess();
		}
	}
	render() {
		return (
			<Card loading={!this.state.isLoadDone}>
				<Row>
					<Col span={6} style={{ borderRight: "1px solid black" }}>
						<Steps current={this.state.currentStep} direction="vertical" >
							<Steps.Step title={L("bat_dau_quy_trinh_nhap_tai_lieu")} />
							<Steps.Step title={L("in_nhan_gay")} />
							<Steps.Step title={L("ImportDocument")} />
							<Steps.Step title={L("hoan_thanh")} />
						</Steps>
					</Col>
					<Col span={18}>
						{this.state.currentStep == 0 &&
							<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
								<h1 style={{ fontSize: '33px', justifyContent: 'center' }}>{L("quy_trinh_nhap_tai_lieu")}</h1>
								<Row justify='center' >
									<Button icon={<StepBackwardOutlined />} type='primary' onClick={() => HistoryHelper.redirect(RouterPath.admin_buy_importing_receipt)}>{L("Back")}</Button>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<Button type='primary' onClick={() => this.setState({ currentStep: this.state.currentStep + 1 })}>{L("Next")}</Button>
								</Row>
							</div>
						}
						{this.state.currentStep == 1 &&
							<>
								<PrintLabel listLabel={this.itemLabelList} />
								<Row gutter={32} justify='end' style={{ marginRight: '8%', marginTop: '1%' }}>
									<Col>
										<Button icon={<StepBackwardOutlined />} style={{ position: 'relative', left: '45%', marginBottom: '5px' }} type='primary' onClick={() => this.setState({ currentStep: this.state.currentStep - 1 })}>{L("Back")}</Button>
									</Col>
									<Col>
										<Button style={{ position: 'relative', left: '45%', marginBottom: '5px' }} type='primary' onClick={() => this.setState({ currentStep: this.state.currentStep + 1 })}>{L("Next")}</Button>
									</Col>
								</Row>
							</>
						}
						{ }
						{this.state.currentStep == 2 &&
							<>
								<div>
									<Cataloging
										onChangeStep={() => { this.setState({ currentStep: 1 }); }}
										receiptDtoSelect={this.receiptDtoSelect}
										planDetailList={this.planDetailList}
										listCreateDocumentInfor={this.listCreateDocumentInfor}
										onCreateListDocumentInfor={this.onCreateListDocumentInfor}
										onSuccess={this.onSuccess}
									/>

								</div>
							</>
						}
						{this.state.currentStep == 3 &&
							<Result
								status="success"
								title={L("HOAN_THANH_QUA_TRINH_BIEN_MUC")}
								extra={[
									<Button type='primary' onClick={() => HistoryHelper.redirect(RouterPath.admin_buy_importing_receipt)}>{L("Back")}</Button>
								]}
							>
							</Result>
						}
					</Col>
				</Row>

			</Card>
		)
	}
}