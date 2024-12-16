import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message } from 'antd';
import { stores } from '@stores/storeInitializer';
import { FileDocumentDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { DeleteOutlined, ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import CreateOrUpdateFileDocument from './components/CreateOrUpdateFileDocument';
import TableMainFileDocument from './components/TableMainFileDocument';
import ModalExportFileDocument from './components/ModalExportFileDocument';

const { confirm } = Modal;
export default class FileDocument extends React.Component {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelFileDocument: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		fi_do_name: undefined,
		do_title: undefined,
		isCreate: false,
		visibleExportExcelDocumentLog: false,
	};
	fileDocumentSelected: FileDocumentDto = new FileDocumentDto();

	async componentDidMount() {
		await stores.settingStore.getAll();
		await stores.documentStore.getAll(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.fileDocumentStore.getAll(this.state.fi_do_name, this.state.do_title, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false, visibleExportExcelFileDocument: false, visibleExportExcelDocumentLog: false, });
	}
	clearSearch = async () => {
		await this.setState({
			fi_do_name: undefined,
			do_title: undefined,
		})
		await this.getAll();
	}
	handleSubmitSearch = async () => {
		this.onChangePage(1, this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: any) => {
		if (input !== undefined && input !== null) {
			this.fileDocumentSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = (value: FileDocumentDto) => {
		if (value === undefined || value.fi_do_id === undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.fileDocumentSelected.init(value);
		this.createOrUpdateModalOpen(value);
	};

	deleteItem = async (item: FileDocumentDto) => {
		const self = this;
		const { totalFileDocument } = stores.fileDocumentStore
		if (item.fi_do_id !== undefined) {
			self.setState({ isLoadDone: false });
			confirm({
				title: L('ban_co_chac_muon_xoa') + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalFileDocument - 1) % 10 === 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.fileDocumentStore.deleteFileDocument(item.fi_do_id);
					await self.getAll();
					self.setState({ isLoadDone: true });
					message.success(L("SuccessfullyDeleted"))
				},
				onCancel() {
				},
			});
		}
		await this.onCreateUpdateSuccess();
	}
	onChangePage = async (page: number, pagesize?: number) => {
		if (pagesize !== undefined) {
			await this.setState({ pageSize: pagesize! });
		}
		this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		})
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	render() {
		const self = this;
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(0, 0, 0, 12, 12, 12) : cssCol(24);
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(24, 24, 24, 12, 12, 12) : cssCol(0);
		const { fileDocumentListResult, totalFileDocument } = stores.fileDocumentStore;
		return (
			<Card>
				<Row gutter={[8, 8]} align='bottom'>
					<Col {...cssColResponsiveSpan(24, 24, 24, 3, 3, 3)} >
						<h2>{L('FileDocument')}</h2>
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 4, 5)} >
						<strong>{L("Title")}</strong>&nbsp;&nbsp;
						<Input value={this.state.do_title} allowClear onChange={(e) => this.setState({ do_title: e.target.value.trim() })}
							onPressEnter={this.handleSubmitSearch}
							placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col {...cssColResponsiveSpan(24, 12, 12, 6, 4, 5)} >
						<strong>{L('File')}</strong>&nbsp;&nbsp;
						<Input value={this.state.fi_do_name} allowClear onChange={(e) => this.setState({ fi_do_name: e.target.value.trim() })}
							onPressEnter={this.handleSubmitSearch}
							placeholder={L("nhap_tim_kiem")} />
					</Col>
					<Col style={{ textAlign: "center" }} {...cssColResponsiveSpan(24, 12, 6, 3, 3, 2)} >
						<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
					</Col>
					<Col {...cssColResponsiveSpan(24, 8, 6, 3, 3, 3)} >
						{(this.state.fi_do_name !== undefined || this.state.do_title !== undefined) &&
							<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
						}
					</Col>
					<Col className='textAlign-col-1200' {...cssColResponsiveSpan(24, 16, 12, 12, 7, 6)}>
						<Button style={{ margin: '0 10px 0 0' }} type="primary" icon={<PlusOutlined />} onClick={() => { this.createOrUpdateModalOpen(FileDocumentDto.fromJS({ isDownload: true })); this.setState({ isCreate: true }) }}>{L('tao_moi')}</Button>
						<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelDocumentLog: true })}>{L('xuat_du_lieu')}</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainFileDocument
							NoScroll={false}
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							fileDocumentListResult={fileDocumentListResult}
							deleteItem={this.deleteItem}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalFileDocument,
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
					{this.state.visibleModalCreateUpdate &&
						<Col {...right}>
							<CreateOrUpdateFileDocument
								isCreate={this.state.isCreate}
								onCreateUpdateSuccess={this.onCreateUpdateSuccess}
								onCancel={() => { this.setState({ visibleModalCreateUpdate: false }); this.getAll(); }}
								fileDocumentSelected={this.fileDocumentSelected}
							/>
						</Col>
					}
				</Row>
				<ModalExportFileDocument
					fileDocumentListResult={fileDocumentListResult}
					visible={this.state.visibleExportExcelDocumentLog}
					onCancel={() => this.setState({ visibleExportExcelDocumentLog: false })}
				/>
			</Card>
		)
	}
}