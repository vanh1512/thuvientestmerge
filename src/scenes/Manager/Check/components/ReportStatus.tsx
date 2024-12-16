import * as React from 'react';
import { Col, Row, Button, Table, Card, Modal, Tag, message, } from 'antd';
import { CheckDto, CheckItemDto, DocumentInforDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import { stores } from '@src/stores/storeInitializer';
import GetNameItem from '@src/components/Manager/GetNameItem';
import FooterPlanReport from '@src/components/LayoutReport/FooterPlanReport';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import { ExportOutlined } from '@ant-design/icons';

export interface IProps {
	checkSelected: CheckDto;
	onCancel: () => void;
	getDocumentInfoList?: (list_selected: number[]) => void;
}
export default class ReportStatus extends React.Component<IProps> {
	componentRef: any | null = null;

	state = {
		isLoadDone: true,
		visibleModalDocumentInfo: false,
		idSelected: -1,
		isHeaderReport: false,
	};
	total_circulated_list: number[] = [];
	total_lost_list: number[] = [];
	total_others_list: number[] = [];
	circulated_do_id_list: DocumentInforDto[] = [];
	lost_do_id_list: DocumentInforDto[] = [];
	others_do_id_list: DocumentInforDto[] = [];
	selected_do_id_list: DocumentInforDto[] = [];

	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	//Chua co phan tai lieu la
	async componentDidMount() {
		this.setState({ isLoadDone: false });
		this.initData();
		this.setState({ isLoadDone: true });
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.checkSelected.ck_id !== prevState.idSelected) {
			return ({ idSelected: nextProps.checkSelected.ck_id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.idSelected !== prevState.idSelected) {
			this.total_circulated_list = [];
			this.total_lost_list = [];
			this.total_others_list = [];
			if (this.props.checkSelected.checkItems != undefined && this.props.checkSelected.checkItems![this.props.checkSelected.checkItems.length - 1].ck_id !== undefined) {
				this.initData();
			}
		}
	}

	initData = async () => {
		if (this.props.checkSelected.checkItems != undefined) {
			this.props.checkSelected.checkItems.forEach(element => {
				this.total_circulated_list = [...this.total_circulated_list, ...element.do_in_id_valid!];
				this.total_lost_list = [...this.total_lost_list, ...element.do_in_id_lost!];
				this.total_others_list = [...this.total_others_list, ...element.do_in_id_lost!];
			});

			this.setState({ isLoadDone: false });
			await this.props.checkSelected.checkItems.push(new CheckItemDto());
			this.circulated_do_id_list = await stores.documentInforStore.getAllByIdArr(this.total_circulated_list, undefined, undefined);
			this.lost_do_id_list = await stores.documentInforStore.getAllByIdArr(this.total_lost_list, undefined, undefined);
			this.others_do_id_list = await stores.documentInforStore.getAllByIdArr(this.total_others_list, undefined, undefined);
			this.setState({ isLoadDone: true });
		}
	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}

	getDocumentInfoList = (list_selected: number[]) => {
		if (!!this.props.getDocumentInfoList) {
			this.props.getDocumentInfoList(list_selected);
		}
	}

	onSelectDocumentInfoList = (document_info_visible_list: DocumentInforDto[]) => {
		this.setState({ isLoadDone: false });
		this.selected_do_id_list = document_info_visible_list;
		this.setState({ visibleModalDocumentInfo: true });
		this.setState({ isLoadDone: true });
	}

	render() {
		const self = this;
		const columns = [
			{ title: L('N.O'), dataIndex: '', key: 'no_member_index', render: (text: string, item: CheckItemDto, index: number) => <div> {item.ck_id !== undefined && index + 1}</div> },
			{ title: L('DocumentName'), key: 'name', render: (text: string, item: CheckItemDto) => <div>{item.do_id != undefined ? item.do_id.name : "Tổng"}</div> },
			{ title: L('tai_lieu_luu_thong'), key: 'quantity_using', render: (text: string, item: CheckItemDto) => <div>{item.ck_id !== undefined ? item.do_in_id_valid!.length : <Tag color='blue' onClick={() => self.onSelectDocumentInfoList(self.circulated_do_id_list)} >{self.total_circulated_list.length}</Tag>}</div> },
			{ title: L('tai_lieu_bi_hong'), key: 'quantity_damaged', render: (text: string, item: CheckItemDto) => <div>{item.ck_id !== undefined ? item.do_in_id_lost!.length : <Tag color='red' onClick={() => self.onSelectDocumentInfoList(self.lost_do_id_list)}>{self.total_lost_list.length}</Tag>}</div> },
			{ title: L('tai_lieu_la'), key: 'quantity_strange', render: (text: string, item: CheckItemDto) => <div>{item.ck_id !== undefined ? item.do_in_id_lost!.length : <Tag color='orange' onClick={() => self.onSelectDocumentInfoList(self.others_do_id_list)}>{self.total_others_list.length}</Tag>}</div> },
			{ title: L('Note'), key: 'note', render: (text: string, item: CheckItemDto) => <div>{item.ck_id !== undefined && item.ck_it_note}</div> },

		];
		const columns_document_info = [
			{
				title: L('N.O'),
				key: 'do_info_index',
				width: 50,
				render: (text: string, item: DocumentInforDto, index: number) => (<div>{index + 1}</div>),
			},
			{
				title: L('CodeDkcb'),
				key: 'dkcb_code',
				render: (text: string, item: DocumentInforDto, index: number) => (<div>{item.dkcb_code}</div>),
			},
			{
				title: L('DocumentName'),
				key: 'do_id',
				render: (text: string, item: DocumentInforDto, index: number) => (<div>{GetNameItem.getNameDocument(item.do_id)}</div>),
			},
			{
				title: L('CodeIsbn'),
				dataIndex: '',
				key: 'do_in_isbn',
				render: (text: string, item: DocumentInforDto, index: number) => (<div>{item.do_in_isbn}</div>),
			},
		];
		return (
			<>
				<Card id='Check_Circulated_print_id'>
					<Row style={{ justifyContent: 'flex-end', marginBottom: '10px' }}>
						<Button style={{ margin: '0 0.5rem 0.5rem 0' }} type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleModalDocumentInfo: true })}>{L('ExportData')}</Button>
						<Button danger onClick={() => this.onCancel()}>Hủy</Button>
					</Row>
					<div id='Report_status' ref={this.setComponentRef}>
						<Row style={{ justifyContent: 'center', textAlign: 'center' }}>
							<h3> <strong> DANH SÁCH TRẠNG THÁI TÀI LIỆU </strong></h3>
						</Row>
						<Row >
							<Table
								style={{ width: '100%' }}
								loading={!this.state.isLoadDone}
								rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
								size={'middle'}
								bordered={true}
								locale={{ "emptyText": L('No Data') }}
								columns={columns}
								dataSource={this.props.checkSelected.checkItems != undefined ? [...this.props.checkSelected.checkItems] : []}
								pagination={false}
							/>
						</Row>
						<br />
					</div>
					<Modal
						width={"60vw"}
						visible={this.state.visibleModalDocumentInfo}
						onCancel={() => this.setState({ visibleModalDocumentInfo: false })}
						okButtonProps={{ style: { display: 'none' } }}
						cancelButtonProps={{ style: { display: 'none' } }}
						closable={false}
						title={
							<Row>
								<Col span={8}>
									<h2>{L('ExportListOf')}</h2>
								</Col>
								<Col span={16} style={{ textAlign: 'right' }}>
									<ActionExport
										isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
										isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
										nameFileExport='LibrarianBorrow'
										idPrint="do_in_print_id"
										isExcel={true}
										isWord={true}
										componentRef={this.componentRef}
									/>
									&nbsp;&nbsp;
									<Button danger style={{ margin: '0 26px 0 10px' }} onClick={() => { this.setState({ visibleModalDocumentInfo: false }) }}>{L('Cancel')}</Button>
								</Col>
							</Row>
						}
					>
						<div id='do_in_print_id' ref={this.setComponentRef}>
							{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
							<Row style={{ justifyContent: 'center', textAlign: 'center' }}>
								<h3> <strong> DANH SÁCH TRẠNG THÁI TÀI LIỆU <br /> Năm : .............. </strong></h3>
							</Row>
							<Row>
								<Col span={24}  >
									<Table
										style={{ width: '100%' }}
										loading={!this.state.isLoadDone}
										rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
										size={'middle'}
										bordered={true}
										locale={{ "emptyText": L('NoData') }}
										columns={columns}
										dataSource={this.props.checkSelected.checkItems != undefined ? [...this.props.checkSelected.checkItems] : []}
										pagination={false}
									/>
								</Col>
								{this.state.isHeaderReport && <FooterPlanReport footer="check" />}

							</Row>
						</div>
					</Modal>
				</Card>
			</>
		)
	}
}