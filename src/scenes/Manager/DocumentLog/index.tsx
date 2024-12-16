import * as React from 'react';
import { Col, Row, Button, Card, Input, Modal, message, Select } from 'antd';
import { stores } from '@stores/storeInitializer';
import { DocumentLogDto, ICreateDocumentLogInput } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AppConsts from '@src/lib/appconst';
import CreateOrUpdateDocumentLog from './components/CreateOrUpdateDocumentLog';
import TableMainDocumentLog from './components/TableMainDocumentLog';
import ExportDocumentLog from './components/ModalExportDocumentLog';
import { eDocumentLogAction } from '@src/lib/enumconst';
import ModalExportDocumentLog from './components/ModalExportDocumentLog';

const {Option}=Select;

export default class DocumentLog extends React.Component {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleExportExcelDocumentLog: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		do_id: 0,
		do_lo_action: undefined,
		us_id: 1,
	};
	documentLogSelected: DocumentLogDto = new DocumentLogDto();

	async componentDidMount() {
		await this.getAll();
	}

	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.documentLogStore.getAll(this.state.do_id, this.state.do_lo_action,this.state.us_id, this.state.skipCount, this.state.pageSize);
		this.setState({ isLoadDone: true });
	}

	handleSubmitSearch = async () => {
		this.onChangePage(1,this.state.pageSize);
	}

	createOrUpdateModalOpen = async (input: ICreateDocumentLogInput) => {
		if (input !== undefined && input !== null) {
			this.documentLogSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	onCreateUpdateSuccess = async () => {
		await this.getAll();
	}

	handleSearch = (value: string) => {
		this.setState({ filter: value }, async () => await this.getAll());
	};
	onDoubleClickRow = (value: DocumentLogDto) => {
		if (value == undefined || value.do_lo_id == undefined) {
			message.error(L('CanNotFound'));
			return;
		}
		this.documentLogSelected.init(value);
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

		const { documentLogListResult, totalDocumentLog } = stores.documentLogStore;
		return (
			<Card>
				<Row gutter={16}>
					<Col span={12} >
						<h2>{L('DocumentLog')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: "right" }}>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => this.createOrUpdateModalOpen(new DocumentLogDto())}>{L('tao_moi')}</Button>
						&nbsp;&nbsp;
						<Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportExcelCheck: true })}>{L('xuat_du_lieu')}</Button>
					</Col>
				</Row>

				<Row gutter={16} style={{marginBottom: '5px'}}>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('do_id')}:</strong>&nbsp;&nbsp;
						<Select
							style={{width:"100%"}}
							onChange={(e) => this.setState({ do_id: e })} 
							value={this.state.do_id}
							allowClear
							
							placeholder={L("nhap_tim_kiem")}
						>
							{[1,2,3,4].map(item=>
								<Option key={"key_"+item}  value={item}>{item}</Option>
								)}
						</Select>
					</Col>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('do_lo_action')}:</strong>&nbsp;&nbsp;
						
						<Select
							style={{width:"100%"}}
							onChange={(e) => this.setState({ do_lo_action: e })} 
							value={this.state.do_lo_action}
							allowClear
							placeholder={L("nhap_tim_kiem")}
						>
							{Object.values(eDocumentLogAction).map(item=>
								<Option key={"key_"+item.num}  value={item.num}>{item.name}</Option>
								)}
						</Select>
					</Col>
					<Col span={4} style={{ display: 'flex', fontSize: '16px' }}>
						<strong>{L('us_id')}:</strong>&nbsp;&nbsp;
						<Select
							style={{width:"100%"}}
							onChange={(e) => this.setState({ us_id: e })} 
							value={this.state.us_id}
							allowClear
							placeholder={L("nhap_tim_kiem")}
						>
							{[1,2,3,4].map(item=>
								<Option key={"key_"+item}  value={item}>{item}</Option>
								)}
						</Select>
					</Col>
					<Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
				</Row>
				<Row style={{ marginTop: '10px' }}>
					<Col {...left} style={{ overflowY: "auto" }}>
						<TableMainDocumentLog
							onDoubleClickRow={this.onDoubleClickRow}
							createOrUpdateModalOpen={this.createOrUpdateModalOpen}
							documentLogListResult={documentLogListResult}
							hasAction={true}
							pagination={{
								pageSize: this.state.pageSize,
								total: totalDocumentLog,
								current: this.state.currentPage,
								showTotal: (tot) => L("Total")+ ": " + tot + "",
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
						<CreateOrUpdateDocumentLog
							onCreateUpdateSuccess={this.onCreateUpdateSuccess}
							onCancel={() => this.setState({ visibleModalCreateUpdate: false })}
							documentLogSelected={this.documentLogSelected}
						/>
					</Col>
				</Row>
				<ModalExportDocumentLog
					documentLogListResult={documentLogListResult}
					visible={this.state.visibleExportExcelDocumentLog}
					onCancel={()=> this.setState({ visibleExportExcelDocumentLog: false })}
				/>
			</Card>
		)
	}
}