import * as React from 'react';
import { Button, Col, Modal, Row, Table } from 'antd';
import ActionExport from '@src/components/ActionExport';
import { CategoryDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	onCancel: () => void;
	visibleExportCategory: boolean;
}
export default class ModalExportCategory extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isHeaderReport: false,
		isLoadDone: false,
	}
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { treeCategoryDto } = stores.categoryStore;
		const columns = [
			{
				title: (L('ten_danh_muc')),
				dataIndex: 'ca_title',
				render: (text: string, item: CategoryDto, index: number) =>
					<div>{item.ca_title}</div>
			},
			{
				title: (L('mo_ta')),
				dataIndex: 'ca_abstract',
				render: (text: string, item: CategoryDto, index: number) =>
					<div>{item.ca_abstract}</div>
			},
			{
				title: (L('ma_dang_ky_ca_biet')),
				dataIndex: 'dkcb_code',
				render: (text: string, item: CategoryDto, index: number) =>
					<div>{item.dkcb_code}</div>
			},
			{
				title: (L('so_dang_ky_ca_biet')),
				dataIndex: 'dkcb_start',
				render: (text: string, item: CategoryDto, index: number) =>
					<div>{item.dkcb_start}</div>
			},
			{
				title: (L('so_dang_ky_ca_biet_hien_tai')),
				dataIndex: 'dkcb_current',

				render: (text: string, item: CategoryDto, index: number) =>
					<div>{item.dkcb_current}</div>
			},
		]

		return (
			<Modal
				visible={this.props.visibleExportCategory}
				onCancel={this.props.onCancel}
				footer={null}
				width='70vw'
				maskClosable={true}
				closable={false}
			>
				<Row>
					<Col span={12}>
						<h2>{L("xuat_danh_sach_danh_muc")}</h2>
					</Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<ActionExport
							isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
							isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
							nameFileExport={'Danh_sach_danh_muc_ngay' + moment().format('DD_MM_YYYY')}
							idPrint="Category_print_id"
							isExcel={true}
							isWord={true}
							componentRef={this.componentRef}
						/>
						<Button danger style={{ margin: '0 0 0 10px' }} title={L('huy')} onClick={this.props.onCancel}>{L("huy")}</Button>
					</Col>
				</Row>
				<Row ref={this.setComponentRef} id='Category_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col span={24} >
						<Table
							columns={columns}
							expandable={{ defaultExpandAllRows: true }}
							dataSource={[treeCategoryDto]}
							bordered={true}
							pagination={false}
						/>
					</Col>
					{this.state.isHeaderReport && <FooterReport />}
				</Row>
			</Modal>
		)
	}
}
