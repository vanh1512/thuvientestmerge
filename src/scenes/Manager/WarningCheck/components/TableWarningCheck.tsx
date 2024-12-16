import * as React from 'react';
import { Button, Table, } from 'antd';
import { MinusOutlined, PlusOutlined, } from '@ant-design/icons';
import { DocumentDto, DocumentInforDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { stores } from '@src/stores/storeInitializer';
import moment from 'moment';
import { DocumentMappingDto } from '..';

export interface IProps {
	documentWarningListResult: DocumentMappingDto[];
	listDocumentChecking: DocumentMappingDto[];
	pagination: TablePaginationConfig | false;
	onAddDocToCheck?: (item: DocumentMappingDto) => void;
	onRemove?: (item: DocumentMappingDto) => void;
}
export default class TableWarningCheck extends React.Component<IProps> {
	state = {
		isLoadDone: true,
	};
	document_selected: DocumentMappingDto = new DocumentMappingDto(true);
	documentInfor: DocumentInforDto[];
	onAddDocToCheck = (item: DocumentMappingDto) => {
		this.document_selected = item;
		if (!!this.props.onAddDocToCheck) {
			this.props.onAddDocToCheck(item);
		}
	}
	onRemoveItem = async (item: DocumentMappingDto) => {
		this.setState({ isLoadDone: false });
		if (!!this.props.onRemove) {
			await this.props.onRemove(item);
		}
		this.setState({ isLoadDone: true });

	}
	onEnable = (document_item: DocumentDto) => {
		const { listDocumentChecking } = this.props;
		if (listDocumentChecking !== undefined) {
			let item_selected = listDocumentChecking.find((item: DocumentDto) => item.do_id = document_item.do_id);
			if (!!item_selected) {
				return false;
			}
		}
		return true;
	}

	render() {
		const { documentWarningListResult, pagination, } = this.props;
		const columns: ColumnsType<any> = [
			{ title: L('stt'), key: ('_no_Doccument_index_main_warn_check'), width: 50, fixed: "left", render: (text: string, item: DocumentMappingDto, index: number) => <div>{pagination !== false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div> },
			{ title: L('ten_tai_lieu'), key: ('do_title_main_warn_check'), width: 150, render: (text: string, item: DocumentMappingDto) => <div>{item.do_title}</div> },
			{ title: L('tac_gia'), key: ('do_author_main_warn_check'), render: (text: string, item: DocumentMappingDto) => <div>{stores.sessionStore.getNameAuthor(item.au_id_arr)}</div> },
			{ title: L('ngay_khai_thac'), key: 'do_date_available_main_warn_check', render: (text: string, item: DocumentMappingDto) => <div>{moment(item.do_date_available).format("DD/MM/YYYY")}</div> },
			{ title: L('nha_xuat_ban'), key: 'pu_id_main_warn_check', render: (text: string, item: DocumentMappingDto) => <div>{item.pu_id.name}</div> },
			{ title: L('chu_de'), key: 'to_id_main_warn_check', render: (text: string, item: DocumentMappingDto) => <div>{stores.sessionStore.getNameTopic(item.to_id)}</div> },
			{ title: L('danh_muc'), key: 'ca_id_main_warn_check', render: (text: string, item: DocumentMappingDto) => <div>{stores.sessionStore.getNameCategory(item.ca_id)}</div> },
			{ title: L('ngay_den_han_kiem_ke'), key: 'checking_date_warn_check', render: (text: string, item: DocumentMappingDto) => <div>{moment(item.do_date_available).add(item.do_period_check, "day").format("DD/MM/YYYY")}</div> },
			{
				title: "", key: 'action_main_warn_check', render: (text: string, item: DocumentMappingDto) =>
					<>
						<div>{item.is_viewed && <Button icon={<PlusOutlined />} type="primary" size='small' title={L("them_vao_dot_kiem_ke")} onClick={() => this.onAddDocToCheck(item)} />}</div>
						<div>{!item.is_viewed && <Button danger type='primary' icon={<MinusOutlined />} title={L("bo_chon_tai_lieu")} size='small' onClick={() => this.onRemoveItem(item)} />}</div>
					</>

			},
		];
		return (
			<Table
				className='centerTable'
				loading={!this.state.isLoadDone}
				rowClassName={(record, index) => (this.document_selected.do_id == record.do_id!) ? "bg-click" : "bg-white"}
				rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
				size={'middle'}
				scroll={{ x: 1000 }}
				bordered={true}
				locale={{ "emptyText": L('khong_co_du_lieu') }}
				columns={columns}
				dataSource={documentWarningListResult.length > 0 ? documentWarningListResult : []}
				pagination={pagination}
			/>
		)
	}
}