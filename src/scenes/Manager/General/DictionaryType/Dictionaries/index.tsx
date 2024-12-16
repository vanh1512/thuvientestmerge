import * as React from 'react';
import { Col, Row, Button, Input, Modal, message, Badge } from 'antd';
import { stores } from '@stores/storeInitializer';
import { DictionariesDto, DictionaryTypeDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateDictionaries from './components/CreateOrUpdateDictionaries';
import TableDictionaries from './components/TableDictionaries';
import ModalExportDictionaries from './components/ExportDictionaries';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import ModalImportDictionary from './components/ImportDictionary';

const { confirm } = Modal;

export interface IProps {
	dictionaryType: DictionaryTypeDto;
}
export default class Dictionaries extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleImportDictionaries: false,
		visibleExportExcelDictionaries: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		dic_ty_id: -1,
		dic_search: "",
		checkDeleteMulti: false,
		numberSelected: undefined,
	};
	dictionaries: DictionariesDto = new DictionariesDto();
	keySelected: number[] = [];
	async componentDidMount() {
		this.getAll();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.dictionaryType !== undefined && nextProps.dictionaryType.dic_ty_id !== prevState.dic_ty_id) {
			return ({ dic_ty_id: nextProps.dictionaryType.dic_ty_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.dic_ty_id !== prevState.dic_ty_id) {
			await this.getAll();
		}
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.dictionariesStore.getAll(this.state.dic_search, this.state.dic_ty_id, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelDictionaries: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	onDoubleClickRow = async (input: DictionariesDto) => {
		if (input == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		if (!this.isGranted(AppConsts.Permission.General_Dictionary_Edit)) {
			message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
			return;
		}
		if (input.dic_id === undefined || input.dic_ty_id === undefined) {
			input.dic_ty_id = this.props.dictionaryType.dic_ty_id;
		}
		this.dictionaries.init(input);
		await this.setState({ visibleModalCreateUpdate: true });
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalDictionaries } = stores.dictionariesStore;

		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalDictionaries;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}

	onRefreshData = async () => {
		this.setState({ visibleImportDictionaries: false, });
		this.getAll();
	}
	deleteDictionaries = (dictionaries: DictionariesDto) => {
		const self = this;
		const { totalDictionaries } = stores.dictionariesStore;
		confirm({
			title: L('ban_co_chac_muon_xoa_tu_dien_nay') + "?",
			okText: L('xac_nhan'),
			cancelText: L('huy'),
			async onOk() {
				if (self.state.currentPage > 1 && (totalDictionaries - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
				await stores.dictionariesStore.deleteDictionaries(dictionaries);
				await self.getAll();
				message.success(L("xoa_thanh_cong"))
			},
			onCancel() {

			},
		});
	}

	deleteAll() {
		let self = this;
		this.setState({ isLoadDone: false });
		confirm({
			title: L("ban_co_chac_muon_xoa_tat_ca"),
			okText: L("Delete"),
			cancelText: L("huy"),
			async onOk() {
				await stores.dictionariesStore.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });
	}
	deleteMulti = async (listIdDictionaries: number[]) => {
		const self = this;
		const { totalDictionaries } = stores.dictionariesStore;
		if (listIdDictionaries.length < 1) {
			await message.error(L("hay_chon_1_hang_truoc_khi_xoa "));
		}
		else {
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalDictionaries - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.dictionariesStore.deleteMulti(listIdDictionaries);
					await self.getAll();
					self.setState({ isLoadDone: true, numberSelected: undefined });
					message.success(L("xoa_thanh_cong") + "!")
				},
				onCancel() {
				},
			});
		}
	}
	onChange = (listIdDictionaries: number[]) => {
		this.setState({ isLoadDone: false });
		this.keySelected = listIdDictionaries;
		{ listIdDictionaries.length == 0 ? this.setState({ checkDeleteMulti: false }) : this.setState({ checkDeleteMulti: true }) }
		this.setState({ isLoadDone: true, numberSelected: this.keySelected.length });
	}
	render() {

		const self = this;
		const { dictionaryType } = this.props;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);

		const { dictionariesListResult, totalDictionaries } = stores.dictionariesStore;

		return (
			<>
				<Row gutter={[8, 8]}>
					<Col span={24}><h2>{L("dinh_nghia_thuat_ngu")}: {dictionaryType.dic_ty_name}</h2></Col>
					<Col span={12}>
						<Input
							allowClear style={{ width: '73%', marginRight: '5px' }}
							onChange={(e) => this.setState({ dic_search: e.target.value })} placeholder={L("nhap_tim_kiem_thuat_ngu")}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('tim_kiem_thuat_ngu')} onClick={() => this.handleSubmitSearch()} >{L('tim_kiem')}</Button>
					</Col>
					<Col span={12} style={{ textAlign: "end" }}>
						{this.isGranted(AppConsts.Permission.General_DictionaryType_Delete) &&
							<Button danger title={L('xoa_tat_ca')} onClick={() => this.deleteAll()}><DeleteOutlined />{L('xoa_tat_ca')}</Button>
						}
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.General_Dictionary_Create) &&
							<Button type="primary" title={L('tao_moi')} icon={<PlusOutlined />} onClick={() => this.onDoubleClickRow(new DictionariesDto())}>{L('tao_moi')}</Button>
						}
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.General_Dictionary_Export) &&
							<Button type="primary" title={L('xuat_du_lieu')} icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelDictionaries: true })}>{L('xuat_du_lieu')}</Button>
						}
						&nbsp;&nbsp;
						{this.isGranted(AppConsts.Permission.General_Dictionary_Export) &&
							<Button type="primary" title={L('nhap_du_lieu')} icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportDictionaries: true })}>{L('nhap_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						{this.isGranted(AppConsts.Permission.General_Dictionary_Delete) &&
							<Badge count={this.state.numberSelected}>
								{this.state.checkDeleteMulti == true ?
									<Button danger onClick={() => this.deleteMulti(this.keySelected)}><DeleteOutlined />{L('xoa_hang_loat')}</Button>
									: ""
								}
							</Badge>
						}
					</Col>
				</Row>
				<Row >
					<Col {...left}>
						<TableDictionaries
							onChange={this.onChange}
							noscroll={false}
							onDoubleClickRow={this.onDoubleClickRow}
							actionUpdate={this.onDoubleClickRow}
							actionDelete={this.deleteDictionaries}
							dictionariesListResult={dictionariesListResult}
							hasAction={true}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalDictionaries,
								current: this.state.currentPage,
								showTotal: (tot) => (L("Total")) + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onShowSizeChange(current: number, size: number) {
									self.onChangePage(current, size)
								},
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
					<Col {...right}>
						<CreateOrUpdateDictionaries
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							dictionaries={this.dictionaries}
						/>
					</Col>
				</Row>
				<ModalExportDictionaries
					dictionaryType={dictionaryType}
					dictionariesListResult={dictionariesListResult}
					visible={this.state.visibleExportExcelDictionaries}
					onCancel={() => this.setState({ visibleExportExcelDictionaries: false })}
				/>
				<Modal
					visible={this.state.visibleImportDictionaries}
					closable={false}
					maskClosable={true}
					title={L("NHAP_DU_LIEU_TU_DIEN")}
					onCancel={() => { this.setState({ visibleImportDictionaries: false }); }}
					footer={null}
					width={"60vw"}
				>
					<ModalImportDictionary dic_ty_id={dictionaryType.dic_ty_id} onRefreshData={this.onRefreshData} onCancel={() => this.setState({ visibleImportDictionaries: false })} />
				</Modal>
			</>
		)
	}
}