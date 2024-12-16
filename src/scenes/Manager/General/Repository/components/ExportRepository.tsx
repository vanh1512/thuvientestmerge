import * as React from 'react';
import { Col, Row, Modal, Button, Table, } from 'antd';
import { ReponsitoryDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import { stores } from '@src/stores/storeInitializer';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';
import { valueOfeRepositorType } from '@src/lib/enumconst';

export interface IProps {
	visibleExportExcelRepository: boolean,
	onCancel?: () => void;
}
export default class ExportRepository extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isLoadDone: true,
		isHeaderReport: false,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { visibleExportExcelRepository, onCancel } = this.props;
		const { treeReponsitoryDto } = stores.reponsitoryStore;
		const columns = [
			{ title: L('ma'), dataIndex: 're_code', key: 'cpi_month_member_index', render: (text: string, item: ReponsitoryDto) => <div>{item.re_code}</div> },
			{ title: L('ten'), dataIndex: 're_name', key: 'index_member_index', render: (text: string, item: ReponsitoryDto) => <div>{item.re_name}</div> },
			{ title: L('mo_ta'), dataIndex: 're_desc', key: 'index_member_index', render: (text: string, item: ReponsitoryDto) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.re_desc! }}></div> },
			{ title: L('loai'), with: 100, dataIndex: 're_type', key: 'index_member_index', render: (text: string, item: ReponsitoryDto) => <div>{valueOfeRepositorType(item.re_type)}</div> },
		];
		return (
			<Modal
				visible={visibleExportExcelRepository}
				closable={false}
				onCancel={this.props.onCancel}
				footer={null}
				width='70vw'
				maskClosable={true}
			>
				<Row>
					<Col span={12}>
						<h2>{L('xuat_danh_sach_kho_vat_Ly')}</h2>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							nameFileExport='Danh_sach_kho_vat_ly'
							idPrint="reponsitory_print_id"
							isExcel={true}
							isWord={true}
							componentRef={this.componentRef}
						/>
						&nbsp;
						<Button danger style={{ margin: '0 0 0 10px' }} title={L("huy")} onClick={onCancel}>{L("huy")}</Button>
					</Col>
				</Row>
				<Row ref={this.setComponentRef} id='reponsitory_print_id'>
					<Col span={24} style={{ marginTop: '10px' }} ref={this.setComponentRef} >
						{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
						<Col span={24} >						
							<Table
								bordered={true}
								expandable={{ defaultExpandAllRows: true }}
								columns={columns}
								dataSource={[treeReponsitoryDto]}
								pagination={false}
								
							/>
						</Col>
						{this.state.isHeaderReport && <FooterReport />}
					</Col>
				</Row>
			</Modal>

		)
	}
}