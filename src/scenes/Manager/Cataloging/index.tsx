import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Badge, Popover, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { CatalogingDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CaretDownOutlined, ExportOutlined, PlusOutlined, PrinterOutlined, SearchOutlined } from '@ant-design/icons';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts, { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TableCataloging from './components/TableCataloging';
import { eDocumentItemStatus } from '@src/lib/enumconst';
import CreateCataloging from './components/CreateCataloging';
import UpdateCataloging from './components/UpdateCataloging';
import ModalExportCataloging from './components/ModalExportCataloging';
import PrintLabelCatalogingItem from './components/PrintLabelCatalogingItem';
import PrintLabelCataloging from './components/PrintLabelCataloging';


const { confirm } = Modal;
export default class Cataloging extends AppComponentBase {
	state = {
		isLoadDone: true,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		do_in_search: "",
		cata_resultDDC: "",
		cata_resultTitle: "",
		cata_resultColor: "",
		visibleModalCreate: false,
		visibleModalUpdate: false,
		visibleExportExcel: false,
		visibleModalPrintLabelItem: false,
		visibleModalPrintLabel: false,
		totalItem: 0,
		isButtonMultiExportClick: false,
		clicked: false,
	};
	catalogingSelected: CatalogingDto = new CatalogingDto();
	listCataloging: CatalogingDto[] = [];

	async componentDidMount() {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.marc21Store.getAll(undefined, undefined, undefined);
		await stores.catalogingStore.getAll(this.state.do_in_search, this.state.cata_resultDDC, this.state.cata_resultTitle, this.state.cata_resultColor, this.state.skipCount, undefined);
		await stores.documentInforStore.getAll(undefined, undefined, undefined, undefined, eDocumentItemStatus.WaitingCataloging.num, undefined, undefined);
		this.setState({ isLoadDone: true, visibleModalUpdate: false, visibleModalCreate: false, visibleExportExcel: false });
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: CatalogingDto) => {
		if (input !== undefined && input !== null) {
			this.catalogingSelected.init(input);
			if (input.cata_id == undefined) {
				await this.setState({ visibleModalCreate: true, visibleModalUpdate: false });
			} else {
				await this.setState({ visibleModalUpdate: true, visibleModalCreate: false });
			}
		}
	}

	actionTable = (cata: CatalogingDto, event: EventTable) => {
		if (cata == undefined || cata.cata_id == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		let self = this;
		const { totalCataloging } = stores.catalogingStore;
		if (event == EventTable.Edit || event == EventTable.RowDoubleClick) {
			this.createOrUpdateModalOpen(cata);
		}
		else if (event == EventTable.Delete) {
			confirm({
				title: L('ban_co_chac_muon_xoa') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalCataloging - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.catalogingStore.deleteCataloging(cata);
					message.success(L("SuccessfullyDeleted"));
					await self.getAll();
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
		else if (event == EventTable.PrintLabel) {
			this.createLabelItem(cata);
		}
	};
	onChangePage = async (page: number, pagesize?: number) => {
		const { totalCataloging } = stores.catalogingStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalCataloging;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	onCreateSuccess = async () => {
		this.setState({ isLoadDone: false });
		await this.getAll();
		this.setState({ isLoadDone: true });
	}

	onCancelPrintLabelItem = async () => {
		await this.setState({ visibleModalPrintLabelItem: false });
	}
	createLabelItem = async (input: CatalogingDto) => {
		if (input !== undefined && input !== null) {
			this.catalogingSelected.init(input);
			await this.setState({ visibleModalPrintLabelItem: true })
		}
	}
	onCancelPrintLabel = async () => {
		await this.setState({ visibleModalPrintLabel: false });
	}
	createLabel = async () => {

		await this.setState({ visibleModalPrintLabel: true })

	}
	onChange = (listCatalog: CatalogingDto[]) => {
		if (listCatalog != undefined) {
			this.listCataloging = listCatalog;
			this.setState({ totalItem: this.listCataloging.length })
		}
	}
	onVisibleModalExport = () => {
		if (!!this.listCataloging.length) {
			this.setState({ isButtonMultiExportClick: true, visibleExportExcel: true })
		}
		else {
			message.warning(L("hay_chon_hang_muon_xuat_du_lieu"));
		}
	}
	render() {
		const self = this;
		const left = this.state.visibleModalUpdate || this.state.visibleModalCreate ? cssColResponsiveSpan(0, 0, 0, 10, 10, 10) : cssCol(24);
		const right = this.state.visibleModalUpdate || this.state.visibleModalCreate ? cssColResponsiveSpan(24, 24, 24, 14, 14, 14) : cssCol(0);
		const { totalCataloging, catalogingListResult } = stores.catalogingStore;
		return (
			<Card>
				<Row >
					<Col {...cssColResponsiveSpan(24, 8, 8, 12, 5, 4)}>
						<h2>{L('bien_muc_tai_lieu')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 16, 16, 12, 10, 10)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
						<Input allowClear onChange={(e) => this.setState({ do_in_search: e.target.value.trim() })} placeholder={L('CodeDkcb')} onPressEnter={this.handleSubmitSearch}
							style={{ maxWidth: '60%', height: '32px' }} />
						<Button type="primary" icon={<SearchOutlined />} title={L('tim_kiem')} onClick={this.handleSubmitSearch}>{L('tim_kiem')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 24, 24, 24, 9, 10)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new CatalogingDto())}>{L('them_moi')}</Button>
						<Button style={{ marginBottom: '8px' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcel: true, isButtonMultiExportClick: false })}>{L('xuat_du_lieu')}</Button>
					</Col>
					<Col span={24} style={{ textAlign: 'start' }}>
						<Popover style={{ width: "200px" }} placement="right" content={
							<>
								<Row style={{ alignItems: "center" }}>
									<Button
										icon={<ExportOutlined />} title={L("xuat_du_lieu")}
										style={{ marginLeft: '10px' }}
										size='small'
										onClick={this.onVisibleModalExport}
										type='primary'
									></Button>
									<a style={{ paddingLeft: "10px" }} onClick={this.onVisibleModalExport}>{L('xuat_du_lieu')}</a>
								</Row>
								<Row style={{ alignItems: "center", marginTop:"10px" }}>
									<Button
										icon={<PrinterOutlined />} title={L("PrintLabel")}
										style={{ marginLeft: '10px' }}
										size='small'
										onClick={() => this.createLabel()}
										type='primary'
									></Button>
									<a style={{ paddingLeft: "10px" }} onClick={() => this.createLabel()}>{L('PrintLabel')}</a>
								</Row>
							</>
						} trigger={['hover']} >
							<Badge count={this.state.totalItem}>
								<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
							</Badge>
						</Popover >

					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableCataloging
							onChange={this.onChange}
							noscroll={false}
							actionTable={this.actionTable}
							catalogingListResult={catalogingListResult}
							isLoadDone={this.state.isLoadDone}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalCataloging,
								current: this.state.currentPage,
								showTotal: (tot) => (L("Total")) + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => {
									self.onChangePage(page, pagesize)

								}
							}}
						/>
					</Col>
					{this.state.visibleModalCreate &&
						<Col {...right}>
							<CreateCataloging
								onCreateSuccess={() => this.onCreateSuccess()}
								onCancel={() => this.setState({ visibleModalCreate: false })}
								catalogingSelected={this.catalogingSelected}
							/>
						</Col>
					}
					{this.state.visibleModalUpdate &&
						<Col {...right}>
							<UpdateCataloging
								onUpdateSuccess={async () => { await this.getAll(); }}
								onCancel={() => this.setState({ visibleModalUpdate: false })}
								catalogingSelected={this.catalogingSelected}
							/>
						</Col>
					}
				</Row>

				<ModalExportCataloging
					catalogingListResult={this.state.isButtonMultiExportClick ? this.listCataloging : catalogingListResult}
					visible={this.state.visibleExportExcel}
					onCancel={() => this.setState({ visibleExportExcel: false })}
				/>


				{
					this.state.visibleModalPrintLabelItem &&
					<PrintLabelCatalogingItem cataSelected={this.catalogingSelected} visible={this.state.visibleModalPrintLabelItem} onCancel={this.onCancelPrintLabelItem} />
				}
				{this.state.visibleModalPrintLabel &&

					<PrintLabelCataloging listItemLabel={this.listCataloging} visible={this.state.visibleModalPrintLabel} onCancel={this.onCancelPrintLabel} />
				}

			</Card>
		)
	}
}