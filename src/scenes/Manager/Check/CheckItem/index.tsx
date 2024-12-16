import * as React from 'react';
import { Col, Row, Button, Card, Modal, message, Select, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { ChangeProcessCheckInput, CheckDto, CheckItemDto, CreateCheckItemInput, ItemDocument, UpdateCheckItemInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { CarryOutOutlined, ExportOutlined, PlusOutlined, } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import CreateOrUpdateCheckItem from './components/CreateOrUpdateCheckItem';
import TableMaincheckItem from './components/TableMainCheckItem';
import { eProcess } from '@src/lib/enumconst';
import Document from '../../Document';
import ModalExportCheckItem from './components/ModalExportCheckItem';

const { Option } = Select;
export interface IProps {
	onCancel: () => void;
	check_selected: CheckDto;
}

export default class CheckItem extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		isLoadList: false,
		visibleModalCreateUpdate: false,
		visibleModalDocument: false,
		visibleExportExcelCheckItem: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		ck_id: 0,
	};
	checkItemSelected: CheckItemDto = new CheckItemDto();
	listItemDocument: ItemDocument[] = [];


	async componentDidMount() {
		await this.getAll();
	}
	componentDidUpdate(prevState, prevProps) {
		if (this.state.ck_id != this.props.check_selected.ck_id) {
			this.setState({ ck_id: this.props.check_selected.ck_id })
			this.getAll();
		}
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.checkItemStore.getAll(this.props.check_selected.ck_id, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelCheckItem: false });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: CheckItemDto) => {
		if (input !== undefined && input !== null) {
			this.checkItemSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	onEditBillingItem = async (unitData: UpdateCheckItemInput) => {
		this.setState({ isLoadDone: false });
		await stores.checkItemStore.updateCheckItem(unitData);
		this.setState({ isLoadDone: true });
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}
	onDoubleClickRow = (value: CheckItemDto) => {
		if (value == undefined || value.ck_id == undefined) {
			message.error(L('CanNotfound'));
			return;
		}
		this.checkItemSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		const { totalCheckItem } = stores.checkItemStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalCheckItem;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}
	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}
	onCreateCheckItem = async () => {
		this.setState({ isLoadDone: false });
		const { checkItemListResult, totalCheckItem } = stores.checkItemStore;
		let listDoId = checkItemListResult.map(item => item.do_id.id);
		if (this.listItemDocument != undefined && this.listItemDocument.length > 0) {
			this.listItemDocument.map(async (itemDocument: ItemDocument) => {
				let createItem = new CreateCheckItemInput();
				createItem.ck_id = this.props.check_selected.ck_id;
				createItem.do_id = itemDocument;
				createItem.ck_it_note = this.checkItemSelected.ck_it_note;
				if (listDoId.includes(itemDocument.id)) {
					await message.error(L("Document") + " " + `${itemDocument.name}` + " " + L("Duplicate"));
					return;
				}
				await stores.checkItemStore.createCheckItem(createItem);
				message.success(L("SuccessfullyAdded"));
				await this.setState({ isLoadDone: true, visibleModalDocument: false });
			});
			await this.onChangePage(1, this.state.pageSize);
		}
	}
	onDeleteBillingItem = async (item: CheckItemDto) => {
		this.setState({ isLoadDone: false });
		await stores.checkItemStore.deleteCheckItem(item);
		await this.onChangePage(1, this.state.pageSize);
		await this.setState({ isLoadDone: true, });
	}
	onApproveCheck = async () => {
		await this.setState({ isLoadDone: false });
		let input = new ChangeProcessCheckInput();
		input.ck_id = this.props.check_selected.ck_id;
		input.ck_process = eProcess.Wait_Approve.num;
		await stores.checkStore.waitApprove(input);
		message.success(L("Success"));
		await this.onCancel();
		await this.setState({ isLoadDone: false });
	}
	render() {
		const self = this;

		const left = this.state.visibleModalCreateUpdate ? AppConsts.cssRightMain.left : AppConsts.cssPanelMain.left;
		const right = this.state.visibleModalCreateUpdate ? AppConsts.cssPanelMain.right : AppConsts.cssRightMain.right;
		const { checkItemListResult, totalCheckItem } = stores.checkItemStore;
		const { documentListResult } = stores.documentStore;
		const { check_selected } = this.props;

		return (
			<Card>
				<Row gutter={16}>
					<Col span={6} >
						<h2>{L('Detail')} {L('Check')}</h2>
					</Col>
					<Col span={18} className='textAlign-col-992' >
						{checkItemListResult.length > 0 &&
							<Button style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<CarryOutOutlined />} title={L('SubmitAPlan')} onClick={() => this.onApproveCheck()}>{L('SubmitAPlan')}</Button>
						}
						{check_selected.ck_process != eProcess.Sign.num &&
							<>
								<Button style={{ margin: '0 10px 0.5em 0' }} title={L('SelectCheckBook')} type="primary" icon={<PlusOutlined />} onClick={() => this.setState({ visibleModalDocument: true })}>{L('SelectCheckBook')}</Button>
								<Button style={{ margin: '0 10px 0.5em 0' }} title={L('ExportData')} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelCheckItem: true })}>{L('ExportData')}</Button>
							</>}
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMaincheckItem
							onDoubleClickRow={this.onDoubleClickRow}
							onEditBillingItem={this.onEditBillingItem}
							onDeleteBillingItem={this.onDeleteBillingItem}
							checkItemListResult={checkItemListResult}
							documentListResult={documentListResult}
							hasAction={check_selected.ck_process == eProcess.Sign.num ? false : true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalCheckItem,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total") + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L("All")],
								onShowSizeChange(current: number, size: number) {
									self.onChangePage(current, size)
								},
								onChange: (page: number, pagesize?: number) => self.onChangePage(page, pagesize)
							}}
						/>
					</Col>
					<Col {...right}>
						<CreateOrUpdateCheckItem
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							checkItemSelected={this.checkItemSelected}
							ck_id={this.props.check_selected.ck_id}
						/>
					</Col>
				</Row>

				<ModalExportCheckItem
					checkItemListResult={checkItemListResult}
					documentListResult={documentListResult}
					visible={this.state.visibleExportExcelCheckItem}
					onCancel={() => this.setState({ visibleExportExcelCheckItem: false })}
				/>
				<Modal
					visible={this.state.visibleModalDocument}
					title={
						<Row>
							<Col span={12}><h2>{L('Danh_sach_tai_lieu')}</h2></Col>
							<Col span={12} style={{ textAlign: 'end' }}>
								<Button danger title={L('Cancel')} onClick={() => this.setState({ visibleModalDocument: false })}>{L('Cancel')}</Button>
								&nbsp;
								<Button type='primary' title={L('Select')} onClick={this.onCreateCheckItem}>{L('Select')}</Button>
							</Col>
						</Row>
					}
					onCancel={() => { this.setState({ visibleModalDocument: false }) }}
					footer={null}
					width='90vw'
					closable={false}
					maskClosable={false}
				>
					<Document is_create={false} is_Selected={true} onChooseDocument={(listItemDocument: ItemDocument[]) => this.listItemDocument = listItemDocument} />
				</Modal>
			</Card>
		)
	}
}