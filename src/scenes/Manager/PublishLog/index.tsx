import * as React from 'react';
import { Col, Row, Button, Table, Card, Modal, message, Input, Select, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { PublishLogDto, ICreatePublishLogInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateOrUpdatePublishLog from './components/CreateOrUpdatePublishLog';
import AppConsts from '@src/lib/appconst';
import ExportPublishLog from './components/ModalExportPublishLog';
import ModalExportPublishLog from './components/ModalExportPublishLog';


const { confirm } = Modal;
const { Option } = Select;

export default class PublishLog extends React.Component {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelPublishLog: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		pu_lo_id: undefined,
		pu_re_id: undefined,
		pu_lo_notes: undefined,
		us_id_created: undefined,
		pu_lo_created_at: undefined,
	};
	publishLogSelected: PublishLogDto = new PublishLogDto();

	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.publishLogStore.getAll(this.state.pu_re_id, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: PublishLogDto) => {
		if (input !== undefined && input !== null) {
			this.publishLogSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	onCreateUpdateSuccess = async (publishLogDto: PublishLogDto) => {
		await this.getAll();
	}
	async deletePublishLog(publishLog: PublishLogDto) {
		let self = this;
		confirm({
			title: L('ban_co_chac_muon_xoa') + ", " + L("PublishLog") + "?",
			okText: L('Confirm'),
			cancelText: L('Cancel'),
			async onOk() {
				await stores.publishLogStore.deletePublishLog(publishLog);
				await self.getAll();
				self.setState({ isLoadDone: true });
			},
			onCancel() {

			},
		});
	}

	onDoubleClickRow = (value: PublishLogDto) => {
		if (value == undefined || value.pu_re_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.publishLogSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}

	render() {

		const self = this;

		const left = this.state.visibleModalCreateUpdate ? AppConsts.cssRightMain.left : AppConsts.cssPanelMain.left;
		const right = this.state.visibleModalCreateUpdate ? AppConsts.cssPanelMain.right : AppConsts.cssRightMain.right;

		const { publishLogListResult, totalPublishLog } = stores.publishLogStore;

		const columns = [
			{ title: L('PublishRegisterID'), dataIndex: 'pu_re_id', key: 'pu_re_id_table', render: (text: string, item: PublishLogDto, index: number) => <div>{this.state.pageSize * (this.state.currentPage - 1) + (index + 1)}</div>, },
			{ title: L('PublishLogNotes'), dataIndex: 'pu_lo_notes', key: 'pu_lo_notes_table', render: (text: string) => <div>{text}</div> },
			{ title: L('UserID'), dataIndex: 'us_id_created', key: 'us_id_created_table', render: (text: string) => <div>{text}</div> },
			{ title: L('PublishLogCreateAt'), dataIndex: 'pu_lo_created_at', key: 'pu_lo_created_at_table', render: (text: string) => <div>{text}</div> },
			{
				title: "",
				key: 'action_quanlyhocvien_index',
				className: "center",
				render: (text: string, item: PublishLogDto) => (
					<div >
						<Button
							type="primary" icon="edit" title={L('Edit')}
							onClick={() => this.createOrUpdateModalOpen(item!)}
						></Button>
						<Button
							danger icon="delete" title={L('Delete')}
							style={{ marginLeft: "5px" }}
							onClick={() => this.deletePublishLog(item)}
						></Button>
					</div>
				)
			},
		];

		return (
			<Card>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L('PublishLog')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new PublishLogDto())}>{L('tao_moi')}</Button>
						&nbsp;&nbsp;
						<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelPublishLog: true })}>{L('xuat_du_lieu')}</Button>
					</Col>

				</Row>

				<Row gutter={16}>
					<Col span={4} style={{ display: 'flex' }}>
						<strong>{L('pu_re_id')}:</strong>&nbsp;&nbsp;
						<Select
							style={{ width: "100%" }}
							onChange={(e) => this.setState({ pu_re_id: e })}
							value={this.state.pu_re_id}
							allowClear
							placeholder={L("nhap_tim_kiem")}
						>
							{[1, 2, 3, 4].map(item =>
								<Option key={"key_" + item} value={item}>{item}</Option>
							)}
						</Select>
					</Col>
					<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
				</Row>
				<Row style={{ marginTop: '10px' }}>

					<Col {...left} style={{ overflowY: "auto" }}>
						<Table
							onRow={(record, rowIndex) => {
								return {
									onDoubleClick: (event: any) => { this.onDoubleClickRow(record) }
								};
							}}
							loading={!this.state.isLoadDone}
							rowClassName={(record, index) => (this.publishLogSelected.pu_re_id == record.pu_re_id) ? "bg-click" : "bg-white"}
							rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
							size={'middle'}
							bordered={true}
							locale={{ "emptyText": L('khong_co_du_lieu') }}
							columns={columns}
							dataSource={publishLogListResult.length > 0 ? [] : publishLogListResult}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalPublishLog,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total")+": " + tot + "",
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
						<CreateOrUpdatePublishLog
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							publishLogSelected={this.publishLogSelected}
						/>
					</Col>
				</Row>

				<ModalExportPublishLog
					publishLogListResult={publishLogListResult}
					visible={this.state.visibleExportExcelPublishLog}
					onCancel={() => this.setState({ visibleExportExcelPublishLog: false })}
				/>

			</Card>
		)
	}
}