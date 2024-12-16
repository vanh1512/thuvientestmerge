import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { LanguagesDto, CreateLanguagesInput, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteFilled, DeleteOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { EventTable, cssColResponsiveSpan } from '@src/lib/appconst';
import Tablelanguages from './components/Tablelanguages';
import ModalExportlanguages from './components/ModalExportlanguages';
import ModalImportLanguages from './components/ModalImportLanguages';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

const { confirm } = Modal;
export default class DocumentLanguages extends AppComponentBase {
	private buttonAddOrDeleteRef: any = React.createRef()
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcellanguages: false,
		visibleImportExcelLanguages: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		au_search: "",
		editingKey: -1,
		isValidInput: true,
		numberSelected: 0,
		select: false,
		clicked: false,
		isButtonMultiExportClick: false,
	};
	languagesSelected: LanguagesDto = new LanguagesDto();
	keySelected: number[] = [];
	listItemSelected: LanguagesDto[] = [];

	async componentDidMount() {
		await this.getAll();
		const { languagesListResult } = stores.languagesStore;
		languagesListResult.map(async item => {
			if (item.la_title == "" || item.la_title == undefined) {
				await stores.languagesStore.deleteLanguages(item);
				await this.getAll();
			}
		}
		)
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.languagesStore.getAll(this.state.au_search.trim(), undefined, undefined);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcellanguages: false });
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: LanguagesDto) => {
		await this.setState({ isLoadDone: false, isValidInput: undefined });
		let unitData = new CreateLanguagesInput();
		unitData.la_enable = false;
		await stores.languagesStore.createLanguages(unitData);
		message.success(L("SuccessfullyAdded"))
		this.getAll();
		await this.setState({ isLoadDone: true, isValidInput: input.la_title === "" ? false : true, });
	}
	handleInputChange = (e) => {
		const inputValue = e.target.value;
		const regex = /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ_ ]*$/;
		const isValidInput = regex.test(inputValue);
		this.setState({
			la_title: inputValue,
			isValidInput: isValidInput,
		});
	};
	buttonCreateOrUpdateModalOpen = async (input: LanguagesDto) => {
		await this.setState({ isLoadDone: false, isValidInput: undefined });
		await this.buttonAddOrDeleteRef.current.createOrUpdateModalOpen(input);
		await this.setState({ isLoadDone: true, isValidInput: input.la_title === "" ? false : true, });
	}


	actionTable = async (languages: LanguagesDto, event: EventTable) => {
		if (languages == undefined || languages.la_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		const { totalLanguages } = stores.languagesStore
		if (event == EventTable.Edit || event == EventTable.RowDoubleClick) {
			if (!this.isGranted(AppConsts.Permission.General_DocumentLanguages_Edit)) {
				message.error(L("ban_khong_co_quyen_thuc_hien_thao_tac_nay"));
				return;
			}
			this.createOrUpdateModalOpen(languages);
		}
		else if (event == EventTable.Delete) {
			await stores.languagesStore.deleteLanguages(languages);
			if (this.state.currentPage > 1 && (totalLanguages - 1) % 10 == 0) {
				this.onChangePage(this.state.currentPage - 1);
			}
			else {
				await this.getAll();
			}
		}
	};

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}

	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}
	onRefreshData = () => {
		this.setState({ visibleImportExcelLanguages: false });
		this.getAll();
	}
	deleteAll() {
		let self = this;
		this.setState({ isLoadDone: false });
		confirm({
			title: L("ban_co_chac_muon_xoa_tat_ca"),
			okText: L("Delete"),
			cancelText: L("huy"),
			async onOk() {
				await stores.languagesStore.deleteAll();
				await self.getAll();
				message.success(L("xoa_thanh_cong"));
			},
			onCancel() {

			},
		});
		this.setState({ isLoadDone: true });
	}
	deleteMulti = async (lisstIdLanguages: number[]) => {
		if (this.state.numberSelected < 1) {
			await message.error(L("hay_chon_1_hang_truoc_khi_xoa"));
		}
		else {
			let self = this;
			const { totalLanguages } = stores.languagesStore
			confirm({
				title: L('ban_co_muon_xoa_hang_loat') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalLanguages - self.keySelected.length) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.languagesStore.deleteMulti(lisstIdLanguages);
					await self.getAll();
					self.setState({ isLoadDone: true, numberSelected: 0, checkDeleteMulti: false });
					message.success(L("xoa_thanh_cong" + "!"))
				},
				onCancel() {
				},
			});
		}
	}
	onChangeSelect = (listItemLanguages: LanguagesDto[], listIdLanguagues: number[]) => {
		this.setState({ isLoadDone: false });
		this.listItemSelected = listItemLanguages;
		this.keySelected = listIdLanguagues;
		listItemLanguages.length == 0 ? this.setState({ checkDeleteMulti: false }) : this.setState({ checkDeleteMulti: true })
		this.setState({ isLoadDone: true, numberSelected: listItemLanguages.length });
	}
	hide = () => {
		this.setState({ clicked: false });
	}
	handleVisibleChange = (visible) => {
		this.setState({ clicked: visible });
	}
	render() {
		const self = this;
		const { languagesListResult } = stores.languagesStore;
		return (
			<Card>
				<Row gutter={[8, 8]}>
					<Col {...cssColResponsiveSpan(24, 8, 8, 8, 6, 6)} >
						<h2>{L("DocumentLanguageManagement")}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 16, 10, 8, 8)} >
						<Input
							style={{ width: "60%", marginRight: '5px' }} allowClear
							onChange={(e) => this.setState({ au_search: e.target.value })} placeholder={L("Language") + '...'}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 10, 10)} className='textAlign-col-992'>

						{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Create) &&
							<Button title={L("AddNewLanguage")} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<PlusOutlined />} onClick={() => this.buttonCreateOrUpdateModalOpen(new LanguagesDto)}>{L('AddNewLanguage')}</Button>
						}

						{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Export) &&
							<Button title={L("ExportData")} style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcellanguages: true, isButtonMultiExportClick: false })}>{L('ExportData')}</Button>
						}

						{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Import) &&
							<Button title={L("nhap_du_lieu")} type="primary" icon={<ImportOutlined />} onClick={() => this.setState({ visibleImportExcelLanguages: true })}>{L('nhap_du_lieu')}</Button>
						}
					</Col>
				</Row>
				<Row gutter={[8, 4]}>
					<Col span={24} >
						{this.isGranted(AppConsts.Permission.General_Fields_Delete) &&
							<Badge count={this.state.numberSelected}>
								<Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="right" content={
									<>
										{this.isGranted(AppConsts.Permission.General_DocumentLanguages_Delete) &&
											<Row style={{ alignItems: "center" }}>
												<Button
													danger icon={<DeleteOutlined />} title={L("xoa_tat_ca")}
													style={{ marginLeft: '10px' }}
													size='small'
													type='primary'
													onClick={() => { this.deleteAll(); this.hide() }}
												></Button>
												<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteAll(); this.hide() }}>{L('xoa_tat_ca')}</a>
											</Row>
										}
										<Row style={{ alignItems: "center", marginTop: "10px" }}>
											<Button
												danger icon={<DeleteFilled />} title={L("Delete")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => { this.deleteMulti(this.keySelected); this.hide() }}
											></Button>
											<a style={{ paddingLeft: "10px", color: "red" }} onClick={() => { this.deleteMulti(this.keySelected); this.hide() }}>{L('xoa_hang_loat')}</a>
										</Row>
										<Row style={{ alignItems: "center", marginTop: "10px" }}>
											<Button
												type='primary'
												icon={<ExportOutlined />} title={L("ExportData")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcellanguages: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}

											></Button>
											<a style={{ paddingLeft: "10px" }}
												onClick={() => !!this.listItemSelected.length ? this.setState({ isButtonMultiExportClick: true, visibleExportExcellanguages: true }) : message.warning(L("hay_chon_hang_muon_xuat_du_lieu"))}
											>
												{L('ExportData')}
											</a>
										</Row>
									</>
								} trigger={['hover']} >
									<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
								</Popover >
							</Badge>
						}
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col span={24} style={{ overflowY: "auto" }}>
						<Tablelanguages
							onChangeSelect={this.onChangeSelect}
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							ref={this.buttonAddOrDeleteRef}
							actionTable={this.actionTable}
							languagesListResult={languagesListResult}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
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
					</Col>
				</Row>
				<ModalExportlanguages
					languagesListResult={this.state.isButtonMultiExportClick ? this.listItemSelected : languagesListResult}
					visible={this.state.visibleExportExcellanguages}
					onCancel={() => this.setState({ visibleExportExcellanguages: false, select: false })}
				/>

				<ModalImportLanguages
					onRefreshData={this.onRefreshData}
					visible={this.state.visibleImportExcelLanguages}
					onCancel={() => this.setState({ visibleImportExcelLanguages: false })}
				/>
			</Card>
		)
	}
}