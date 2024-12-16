import * as React from 'react';
import { Col, Row, Button, Card, Input, message, Checkbox, Badge, InputNumber, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { CheckDto, DocumentDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts, { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import TableWarningCheck from './components/TableWarningCheck';
import CreateOrUpdateWarningCheck from './components/CreateOrUpdateWarningCheck';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

export const ActionCheck = {
	DoubleClickRow: 0,
	CreateOrUpdate: 1,
	Delete: 2,
	ChangeStatus: 3,
	ReportCheck: 4,
}

export class DocumentMappingDto extends DocumentDto {
	is_viewed: boolean;
	constructor(props) {
		super(props);
		this.is_viewed = true;
	}
}

export default class WarningCheck extends AppComponentBase {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleReport: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		day: 60,
		total_valid_book: undefined,
		ignore_do_inside_check_plan: false,
	};
	checkSelected: CheckDto = new CheckDto();
	listDocumentChecking: DocumentMappingDto[] = [];
	listResultDocument: DocumentMappingDto[] = [];

	async componentDidMount() {
		await this.getAllWarningDocument();
	}

	async getAllWarningDocument() {
		this.setState({ isLoadDone: false });
		await stores.checkStore.getDocumentWarningAll(this.state.day, this.state.total_valid_book, this.state.ignore_do_inside_check_plan, this.state.skipCount, this.state.pageSize);
		this.initData();
		this.setState({ isLoadDone: true });
	}

	initData = async () => {
		const { documentWarningListResult } = stores.checkStore;
		this.setState({ isLoadDone: false });
		this.listResultDocument = [];
		if (documentWarningListResult != undefined) {
			documentWarningListResult.map((item: DocumentDto) => {
				let itemAdd = new DocumentMappingDto(item);
				this.listResultDocument.push(itemAdd);
			})
		}
		this.setState({ isLoadDone: true });

	}

	createOrUpdateModalOpen = async (input: CheckDto) => {
		this.setState({ visibleModalCreateUpdate: true });
		if (input !== undefined && input !== null) {
			this.checkSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, visibleReport: false });
		}
	}

	onDoubleClickRow = (value: CheckDto) => {
		if (value == undefined || value.ck_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.checkSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAllWarningDocument();
		})
	}

	onAddDocToCheck = async (item: DocumentMappingDto) => {
		this.setState({ isLoadDone: false });
		item.is_viewed = false;
		await this.listDocumentChecking.push(item);
		this.setState({ isLoadDone: true });
	}

	onRemove = async (item: DocumentMappingDto) => {
		this.setState({ isLoadDone: false });
		item.is_viewed = true;
		let index = this.listDocumentChecking.findIndex((unit: DocumentMappingDto) => unit.do_id == item.do_id);
		this.listDocumentChecking.splice(index, 1);
		this.setState({ isLoadDone: true });
	}
	onCreateSuccess = async () => {
		this.setState({ isLoadDone: false });
		await this.getAllWarningDocument();
		this.setState({ visibleModalCreateUpdate: false, isLoadDone: true });
	}
	handlePressEnter = () => {
		this.getAllWarningDocument()
	};

	render() {
		const self = this;
		const left = this.state.visibleModalCreateUpdate || this.state.visibleReport ? cssColResponsiveSpan(0, 0, 0, 0, 10, 10) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate || this.state.visibleReport ? cssColResponsiveSpan(24, 24, 24, 24, 14, 14) : cssCol(0);
		const { totalDocumentWarningListResult } = stores.checkStore;
		return (
			<Card>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L("canh_bao_tai_lieu_den_dot_kiem_ke")}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>
						{this.isGranted(AppConsts.Permission.Check_WarningCheck_Create) &&
							<Badge count={this.listDocumentChecking.length} >
								<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new CheckDto())}>{L("lap_ke_hoach")}</Button>
							</Badge>
						}

					</Col>
				</Row>
				<Row gutter={[16, 16]} style={{ fontSize: '16px', margin: "10px 0px 20px 0" }}>
					<Col {...cssColResponsiveSpan(24, 12, 12, 12, 8, 6)} >
						<strong>{L('thoi_gian_cach_ngay_kiem_ke_gan_nhat')}:</strong>&nbsp;&nbsp;
						<InputNumber
							onPressEnter={this.handlePressEnter}
							style={{ width: "100%" }}
							value={this.state.day==null?undefined:this.state.day}
							onChange={(value) => { (value != "" && value !=null) ? this.setState({ day: value }) : this.setState({ day: undefined }) }}
							parser={(value) => (value !== undefined ? value.replace(/\D/g, '') : '')}
							min={0}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 12, 8, 6)} >
						<strong>{L('so_luong_co_trong_kho')}:</strong>&nbsp;&nbsp;
						<InputNumber
							onPressEnter={this.handlePressEnter}
							style={{ width: "100%" }}
							value={this.state.total_valid_book}
							onChange={(value) => this.setState({ total_valid_book: !!value ? value : undefined })}
							parser={(value) => (value !== undefined ? value.replace(/\D/g, '') : '')}
							min={0}
						/>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 12, 5, 6)} >
						<strong>{L('tai_lieu_da_co_trong_ke_hoach_kiem_ke_khac')}:</strong>&nbsp;&nbsp;
						<Checkbox onChange={(e) => this.setState({ ignore_do_inside_check_plan: e.target.checked })} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 12, 3, 6)}>
						<Button style={{ marginTop: "5px" }} type="primary" icon={<SearchOutlined />} title={L('xem_so_tai_lieu_sap_den_dot_kiem_ke')} onClick={() => this.getAllWarningDocument()} >{L("tim_kiem")}</Button>
					</Col>
				</Row>

				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableWarningCheck
							listDocumentChecking={this.listDocumentChecking}
							documentWarningListResult={this.listResultDocument}
							onAddDocToCheck={(item: DocumentMappingDto) => this.onAddDocToCheck(item)}
							onRemove={this.onRemove}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalDocumentWarningListResult,
								current: this.state.currentPage,
								showTotal: (tot) => L("tong") + " " + tot + "",
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
					<Col {...right}>
						<CreateOrUpdateWarningCheck
							listDocumentChecking={this.listDocumentChecking}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							onRemove={(item: DocumentMappingDto) => this.onRemove(item)}
							createSuccess={() => this.onCreateSuccess()}
							checkSelected={this.checkSelected}
						/>
					</Col>
				</Row>

			</Card>
		)
	}
}