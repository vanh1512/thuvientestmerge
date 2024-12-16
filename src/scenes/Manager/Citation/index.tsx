import * as React from 'react';
import { Col, Row, Button, Card, Modal, message, Input, DatePicker, Popover, Badge, } from 'antd';
import { stores } from '@stores/storeInitializer';
import { L } from '@lib/abpUtility';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { EventTable, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import { DeleteOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import { CitationDto, DocumentDto } from '@src/services/services_autogen';
import CreateOrUpdateCitation from './components/CreateOrUpdateCitation';
import TableCitation from './components/TableCittation';
import ModalExportCitation from './components/ModalExportCitation';
import moment, { Moment } from 'moment';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eCitationStructure, eCitationType } from '@src/lib/enumconst';
import { async } from 'q';
import { TableRowSelection } from 'antd/lib/table/interface';
const { confirm } = Modal;
export interface IProps {
	documentSelected?: DocumentDto;
	findCitation: (item: DocumentDto) => void;
}
export default class Citation extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleImportExcelCitation: false,
		visibleExportCitation: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		ci_year_publish: undefined,
		ci_date_acces: undefined,
		ci_type: undefined,
		ci_structure: undefined,
		exportMulti:undefined

	};
	citationSelected: CitationDto = new CitationDto();
	citationNumberList: number[] = [];
	listCitationSelectExport: CitationDto[]=[];
	listCitaton: CitationDto[] = [];
	async componentDidMount() {
		await this.getAll();
	}
	clearSearch = async () => {
		await this.setState({
			ci_year_publish: undefined,
			ci_date_acces: undefined,
			ci_type: undefined,
			ci_structure: undefined,
		});
		this.getAll();
	}
	handleSubmitSearch = async () => {
		await this.getAll();
	}
	async getAll() {
		this.setState({ isLoadDone: false });
		await stores.citationStore.getAll(this.state.ci_year_publish, this.state.ci_date_acces, this.state.ci_type, this.state.ci_structure, this.state.skipCount, this.state.pageSize);
		await this.findCitation(this.props.documentSelected!);
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false });
	}
	onChangePage = async (page: number, pagesize?: number) => {
		const { listCitation, totalCitation } = stores.citationStore;
		if (pagesize === undefined || isNaN(pagesize)) {
			pagesize = totalCitation;
			page = 1;
		}
		await this.setState({ pageSize: pagesize! });
		await this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
			this.getAll();
		});
	}
	createOrUpdateModalOpen = async (input: CitationDto) => {
		if (input !== undefined && input !== null) {
			this.citationSelected.init(input);
			await this.setState({ visibleModalCreateUpdate: true, });
		}
	}
	actionTable = (citation: CitationDto, event: EventTable) => {
		const { totalCitation } = stores.citationStore;
		if (citation == undefined || citation.ci_id == undefined) {
			message.error(L('khong_tim_thay'));
			return;
		}
		let self = this;
		if (event == EventTable.Edit || event == EventTable.RowDoubleClick) {
			this.createOrUpdateModalOpen(citation);
		}
		if (event == EventTable.View) {
			this.citationSelected.init(citation);
			this.setState({ visibleInfoAuthor: true });
		}
		else if (event == EventTable.Delete) {
			confirm({
				title: L('WantDelete') + " " + L("citation") + "?",
				okText: L('xac_nhan'),
				cancelText: L('huy'),
				async onOk() {
					if (self.state.currentPage > 1 && (totalCitation - 1) % 10 == 0) self.onChangePage(self.state.currentPage - 1, self.state.pageSize)
					await stores.citationStore.delete(citation.ci_id);
					message.success(L("SuccessfullyDeleted"));
					await self.getAll();
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
	};
	onSuccess = async () => {
		this.setState({ isLoadDone: false });
		await this.getAll();
		this.setState({ isLoadDone: true, visibleModalCreateUpdate: false });
	}
	resultCitation = (document: DocumentDto) => {
		const { listCitation } = stores.citationStore;
		this.setState({ isLoadDone: false });
		const citationResult = document != undefined && listCitation.find(item => item.itemDocument.id == document?.do_id)
		this.listCitaton = document != undefined ? (citationResult != undefined && citationResult && citationResult != undefined ? [citationResult] : []) : listCitation
		this.setState({ isLoadDone: true });

	}
	findCitation = async (item: DocumentDto) => {
		const { listCitation } = stores.citationStore;
		if (!!this.props.findCitation) {
			this.props.findCitation(item);
			await this.resultCitation(item);
		}
		else { this.listCitaton = listCitation }
	}
	deleteMulti = async (list_num: number[]) => {
		const self = this;
		if (list_num.length > 0) {
			confirm({
				title: L('WantDelete') + " " + L("All") + " " + L('document') + "?",
				okText: L('Confirm'),
				cancelText: L('Cancel'),
				async onOk() {

					self.setState({ isLoadDone: false });
					await stores.citationStore.deleteMulti(list_num);
					await self.getAll();
					self.listCitationSelectExport = [];
					self.citationNumberList = [];
					self.setState({ isLoadDone: true, });
				},
				onCancel() {
				},
			});
		}
		else await message.warning(L("hay_chon_1_hang_truoc_khi_xoa"));
	}
	exportMulti=() =>{
		this.setState({isLoadDone:false});
		if(this.listCitationSelectExport.length <= 0)
		{
			 message.warning(L("hay_chon_1_hang_truoc_khi_xuat"));
		}
		else{
			this.setState({isLoadDone:true,visibleExportCitation: true,exportMulti:true})
		}
	}
	render() {
		const left = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(12, 12, 12, 12, 12, 12) : cssCol(24)
		const right = this.state.visibleModalCreateUpdate ? cssColResponsiveSpan(12, 12, 12, 12, 12, 12) : cssCol(0)
		const self = this;
		const {listCitation} = stores.citationStore;
		const rowSelection: TableRowSelection<CitationDto> = {
			onChange: (listIdSupplier: React.Key[], listItem: CitationDto[]) => {
				this.setState({isLoadDone:false});
				this.citationNumberList = listItem.map(item => item.ci_id);
				this.listCitationSelectExport = listItem;
				this.setState({isLoadDone:true});
			}
		}
		return (
			<Card>
				<Row>
					<Col {...cssColResponsiveSpan(24, 12, 6, 6, 6, 6)}>
						<h2>{L("trich_dan")}</h2>
					</Col>

					<Col style={{ display: 'flex', justifyContent: 'end' }} {...cssColResponsiveSpan(24, 12, 18, 18, 18, 18)} className='textAlign-col-576' >
						{
							this.listCitaton.length <= 0 && this.props.documentSelected != undefined &&
							<Button style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.createOrUpdateModalOpen(new CitationDto)}>{L('them_moi')}</Button>

						}
						<Button style={{ margin: '0 10px 0.5em 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleExportCitation: true,exportMulti:false })}>{L('xuat_du_lieu')}</Button>
					</Col>
				</Row>
				{this.props.documentSelected == undefined &&
					<>
						<Row gutter={[8, 8]} align='bottom'>
							<Col {...cssColResponsiveSpan(24, 12, 12, 6, 4, 4)} >
								<strong>{L('nam_xuat_ban')}:</strong>
								<DatePicker
									value={this.state.ci_year_publish != undefined ? moment(this.state.ci_year_publish, "YYYY") : undefined}
									onChange={(date: Moment | null, dateString: string) => this.setState({ ci_year_publish: dateString })}
									format={'YYYY'}
									placeholder={L("Select") + "..."}
									picker='year'
									style={{ width: '100%' }}
								/>
							</Col>
							<Col {...cssColResponsiveSpan(24, 12, 12, 6, 4, 4)} >
								<strong>{L('AvailableDate')}:</strong>
								<DatePicker
									onChange={(date: Moment | null, dateString: string) => this.setState({ ci_date_acces: date == null ? undefined : date })}
									format={'DD/MM/YYYY'}
									placeholder={L("Select") + "..."}
									style={{ width: '100%' }}
									value={this.state.ci_date_acces != undefined ? moment(this.state.ci_date_acces, "YYYY") : undefined}
								/>
							</Col>

							<Col {...cssColResponsiveSpan(24, 12, 12, 6, 4, 4)} >
								<strong>{L('kieu_trich_dan')}:</strong>
								<SelectEnum
									enum_value={this.state.ci_type}
									eNum={eCitationType}
									onChangeEnum={async (value) => { await this.setState({ ci_type: value }) }} />
							</Col>
							<Col {...cssColResponsiveSpan(24, 12, 12, 6, 4, 4)} >
								<strong>{L('cau_truc_trich_dan')}:</strong>
								<SelectEnum
									enum_value={this.state.ci_structure}
									eNum={eCitationStructure}
									onChangeEnum={async (value) => { await this.setState({ ci_structure: value }) }} />

							</Col>
							<Col {...cssColResponsiveSpan(9, 6, 4, 3, 3, 2)} style={{ textAlign:"center" }}>
								<Button onClick={() => this.handleSubmitSearch()} type='primary' icon={<SearchOutlined />} > {L("tim_kiem")}</Button>
							</Col>
							<Col {...cssColResponsiveSpan(3, 3, 5, 5, 5, 5)} >
								{(this.state.ci_year_publish != undefined || this.state.ci_date_acces != undefined || this.state.ci_type != undefined || this.state.ci_structure != undefined) &&
									<Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
								}
							</Col>
						</Row>
						<Row style={{marginBottom:5}}>
							<Col span={12}>
								<Popover
									placement='rightBottom'
									content={(<>
									<Row style={{ alignItems: "center" }}>
											<Button
												icon={<ExportOutlined />} title={L("xuat_du_lieu")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={()=>this.exportMulti() }
												type='primary'
											></Button>
											<a style={{ paddingLeft: "10px" }} onClick={()=>this.exportMulti() }>{L('xuat_du_lieu')}</a>
										</Row>
										<Row style={{ alignItems: "center", marginTop:"10px" }}>
											<Button
												danger icon={<DeleteOutlined />} title={L("Delete")}
												style={{ marginLeft: '10px' }}
												size='small'
												onClick={() => this.deleteMulti(this.citationNumberList)}
												type='primary'
											></Button>
											<a style={{ paddingLeft: "10px" }} onClick={()=>this.exportMulti() }>{L('Delete')}</a>
										</Row>
									</>)}
									trigger="hover">
									<Badge count={this.listCitationSelectExport.length} >
										<Button type='primary'>{L("thao_tac_hang_loat")}</Button>
									</Badge>
								</Popover>
							</Col>
						</Row>
					</>
				}

				<Row>
					<Col {...left}>
						<TableCitation
							listCitation={this.listCitaton}
							actionTable={this.actionTable}
							hasAction={true}
							rowSelection={rowSelection}
							documentSelected={this.props.documentSelected}
							pagination={{
								pageSize: this.state.pageSize,
								total: this.listCitaton.length,
								current: this.state.currentPage,
								showTotal: (tot) => (L("Total")) + ": " + tot + "",
								showQuickJumper: true,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '50', '100', L('All')],
								onChange: (page: number, pagesize?: number) => {
									self.onChangePage(page, pagesize)

								}
							}} />
					</Col>
					<Col {...right}>
						{this.state.visibleModalCreateUpdate &&
							<CreateOrUpdateCitation citationSelected={this.citationSelected} documentSelected={this.props.documentSelected} onCreateUpdateSuccess={this.onSuccess} onCancel={() => this.setState({ visibleModalCreateUpdate: false })} />
						}
					</Col>

					<ModalExportCitation visible={this.state.visibleExportCitation} citationList={this.props.documentSelected ==undefined ? (this.state.exportMulti== true ? this.listCitationSelectExport :listCitation ): this.listCitaton} onCancel={() => this.setState({ visibleExportCitation: false })} />
				</Row>
			</Card >
		)
	}
}