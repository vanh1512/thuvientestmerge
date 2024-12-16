import * as React from 'react';
import { Col, Row, Button, Popover, Input } from 'antd';
import AppComponentBase from '../Manager/AppComponentBase';
import { QuestionOutlined, SearchOutlined } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import { DictionaryTypeAbtractDto } from '@src/services/services_autogen';
import DictionariesItemHelp from './components/DictionariesItemHelp';
import SelectedDictionaryType from '../Manager/SelectedDictionaryType';
import { L } from '@src/lib/abpUtility';

export default class DictionaryHelp extends AppComponentBase {

	state = {
		isLoadDone: false,
		dic_ty_id: undefined,
		dic_search: "",
		is_search: false,
	};
	async getAllDictionary() {
		this.setState({ isLoadDone: false });
		await stores.gDictionaryStore.getAll(this.state.dic_search, this.state.dic_ty_id, undefined, undefined);
		this.setState({ isLoadDone: true });
	}

	handleSubmitSearch = async () => {
		this.setState({ isLoadDone: false, is_search: false });
		await this.getAllDictionary();
		this.setState({ isLoadDone: true, is_search: true });
	}

	render() {
		const { dictionaryItemListResult } = stores.gDictionaryStore;
		return (
			<Row>
				<Popover
					placement='topLeft'
					title={L("AnnotationDictionary")}
					content={

						<Row style={{ width: '32vw', overflowY: 'auto', overflowX: 'hidden', maxHeight: '80vh' }}>
							<Row style={{ padding: '5px', marginBottom: '10px' }} gutter={12}>
								<Col span={9}>
									<SelectedDictionaryType
										onChangeDictionaryType={(item: DictionaryTypeAbtractDto) => this.setState({ dic_ty_id: item.dic_ty_id })} onClear={async() => await this.setState({ dic_ty_id: undefined })}
									/>
								</Col>
								<Col span={9}>
									<Input allowClear onChange={(e) => this.setState({ dic_search: e.target.value.trim() })} placeholder={L("nhap_tim_kiem")} onPressEnter={()=>this.handleSubmitSearch()} />
								</Col>
								<Col span={6}>
									<Button type="primary" icon={<SearchOutlined />} title={L("tra_cuu")} onClick={() => this.handleSubmitSearch()} >{L("tra_cuu")}</Button>
								</Col>
							</Row>
							<Row style={{ width: '30vw' }} gutter={15}>
								<DictionariesItemHelp
									dictionariesItemListResult={dictionaryItemListResult}
								/>
							</Row>
							{this.state.is_search ? dictionaryItemListResult.length <= 0 ? <Col span={24} style={{ width: "30vw", textAlign: 'center' }}>{L("khong_co_du_lieu")}</Col> : ""
								: ""}
						</Row>
					}
					trigger='click'
				>
					<Button icon={<QuestionOutlined />} type='primary' title={L("tu_dien_chu_giai")}
						style={{
							fontSize: '18px',
							position: 'absolute',
							bottom: '150px',
							right: '30px',
							width: '53px',
							height: '53px',
							alignItems: 'center',
							backgroundColor: 'honeydew',
							borderRadius: '100%',
							color: 'green',
						}} />
				</Popover>
			</Row >
		)
	}
}