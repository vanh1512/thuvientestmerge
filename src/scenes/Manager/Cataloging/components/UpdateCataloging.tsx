import * as React from 'react';
import { Col, Row, Button, Card, Input, message, DatePicker, Select, } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { CatalogingDto, CreateCatalogingInput, Marc21Dto, UpdateCatalogingInput } from '@src/services/services_autogen';
import { DeleteFilled, PlusCircleTwoTone } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import { DicMarc21 } from './CreateCataloging';
import { L } from '@src/lib/abpUtility';

export interface IProps {
	onUpdateSuccess: () => void;
	onCancel: () => void;
	catalogingSelected: CatalogingDto;
}
export default class UpdateCataloging extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		defaultSubValue: '',
		idSelected: -1,
	};
	JSONMarc21: { [key: string]: DicMarc21 } = {};
	listMarc21: Marc21Dto[] = [];
	async componentDidMount() {
		await this.initData();
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.catalogingSelected.cata_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.catalogingSelected.cata_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.initData();
		}
	}
	initData = async () => {
		this.setState({ isLoadDone: false });
		this.JSONMarc21 = {};
		this.listMarc21 = [];
		const { marc21ListResult } = stores.marc21Store;
		this.listMarc21 = marc21ListResult
		this.JSONMarc21 = JSON.parse(this.props.catalogingSelected.cata_content!);
		this.setState({ isLoadDone: true });
	}
	onAddSubField = async (key: string) => {
		this.setState({ isLoadDone: false });
		let marcSelect = this.listMarc21.find(a => a.mar_code == key)!;
		if (marcSelect.subFields != undefined && marcSelect.subFields.length > 0) {
			let dicSub = {};
			let subValue = "";
			dicSub[subValue] = "";
			await this.setState({ defaultSubValue: subValue })
			this.JSONMarc21[key].subfields.push(dicSub);
		} else {
			message.error(L("khong_ton_tai_truong_con"));
			return;
		}
		this.setState({ isLoadDone: true });
	}
	onDeleteSubField = (key: string, index: number) => {
		this.setState({ isLoadDone: false });
		this.JSONMarc21[key].subfields.splice(index, 1);
		this.setState({ isLoadDone: true });
	}
	onSave = async () => {
		this.setState({ isLoadDone: false });
		let cata_DDC: { [key: string]: DicMarc21 } = {};
		let cata_title: { [key: string]: DicMarc21 } = {};
		cata_DDC["082"] = this.JSONMarc21["082"];
		cata_title["245"] = this.JSONMarc21["245"];
		let dicToString = JSON.stringify(this.JSONMarc21);
		let input = new UpdateCatalogingInput();
		input.init(this.props.catalogingSelected);
		input.cata_content = dicToString;
		input.cata_resultDDC = JSON.stringify(cata_DDC);
		input.cata_resultTitle = JSON.stringify(cata_title);
		await stores.catalogingStore.updateCataloging(input);
		if (!!this.props.onUpdateSuccess) {
			this.props.onUpdateSuccess();
		}
		message.success(L("SuccessfullyUpdated"));
		this.setState({ isLoadDone: true });
	}

	setCharAt = (str: string, index: number, chr: string) => {
		return str.substring(0, index) + chr + str.substring(index + 1);
	}
	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}
	render() {
		return (
			<Card>
				<Row>{L('bien_muc_tai_lieu') + ": "} <b>{this.props.catalogingSelected.document.name + " - " + this.props.catalogingSelected.dkcb_code}</b></Row>
				<Row style={{ marginBottom: '10px' }}>
					<Col span={12}></Col>
					<Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
						<Button danger onClick={this.onCancel}>{L("Cancel")}</Button>&nbsp;&nbsp;
						<Button type='primary' onClick={this.onSave}>{L("Save")}</Button>
					</Col>

				</Row>
				<Col span={24} style={{ overflowY: 'auto', maxHeight: window.innerHeight }}>
					{this.listMarc21.map((itemMarc21, indexMar21) =>
						<div style={{ width: '97%' }} key={"key_item_" + itemMarc21.mar_code + indexMar21}>
							<Row gutter={16} style={{ margin: '5px 0' }}>
								<Col span={17}>
									<b style={{ display: 'flex' }}>{itemMarc21.mar_code}-<span dangerouslySetInnerHTML={{ __html: itemMarc21.mar_desc! }}></span> </b>
								</Col>
								<Col span={3}>
									<Input value={this.JSONMarc21[itemMarc21.mar_code!] != undefined ? this.JSONMarc21[itemMarc21.mar_code!].indicator1 : ""} minLength={0} maxLength={1}
										onChange={(e) => {
											this.setState({ isLoadDone: false })
											this.JSONMarc21[itemMarc21.mar_code!].indicator1 = e.target.value;
											this.setState({ isLoadDone: true })
										}} />
								</Col>
								<Col span={3}>
									<Input value={this.JSONMarc21[itemMarc21.mar_code!] != undefined ? this.JSONMarc21[itemMarc21.mar_code!].indicator2 : ""} minLength={0} maxLength={1}

										onChange={(e) => {
											this.setState({ isLoadDone: false })
											this.JSONMarc21[itemMarc21.mar_code!].indicator2 = e.target.value;
											this.setState({ isLoadDone: true })
										}} />
								</Col>

								<Col span={1}>
									<Button type='primary' icon={<PlusCircleTwoTone />} onClick={() => this.onAddSubField(itemMarc21.mar_code!)} />
								</Col>
							</Row>
							{this.JSONMarc21[itemMarc21.mar_code!] != undefined && this.JSONMarc21[itemMarc21.mar_code!].subfields.map((itemSub, indexSub) =>
								<Row gutter={16} key={"key_item_sub" + itemSub + "_" + indexSub} style={{ margin: '5px 0' }}>
									{
										Object.keys(itemSub).map((subItemKey, index) => {
											return <React.Fragment key={"key_item_sub_1" + itemSub + "_" + index}>
												<Col span={10}>
													<Select
														allowClear={subItemKey == "" ? false : true}
														style={{ width: '100%' }}
														value={subItemKey}
														onChange={(value: string) => {
															this.setState({ isLoadDone: false });
															Object.keys(itemSub).map((keyItemSub) => {
																const obj = itemSub;
																if (value != undefined) {
																	obj[value] = itemSub[keyItemSub];
																}
																else {
																	obj[""] = itemSub[keyItemSub];
																}
																delete obj[keyItemSub];
															})
															this.setState({ isLoadDone: true });
														}}>
														{this.listMarc21.find(a => a.mar_code == itemMarc21.mar_code!) != undefined && this.listMarc21.find(a => a.mar_code == itemMarc21.mar_code!)!.subFields!.map((item, index) =>
															<Select.Option key={"key_select_" + itemSub + item.sub_code + index} value={item.sub_code!}><p style={{ display: 'flex' }}>{item.sub_code}-<span dangerouslySetInnerHTML={{ __html: item.sub_desc! }}></span></p></Select.Option>
														)}
													</Select>
												</Col>
												<Col span={10}>
													<Input value={itemSub[subItemKey]} onChange={(e) => {
														this.setState({ isLoadDone: false });
														itemSub[subItemKey] = e.target.value;
														this.setState({ isLoadDone: true });
													}} />
												</Col>
												<Col span={4}>
													<Button danger icon={<DeleteFilled />} onClick={() => this.onDeleteSubField(itemMarc21.mar_code!, indexSub)} />
												</Col>
											</React.Fragment>
										})
									}
								</Row>
							)}
						</div>
					)}
				</Col>
			</Card>
		)
	}
}