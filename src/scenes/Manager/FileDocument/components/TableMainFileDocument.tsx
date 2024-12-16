import * as React from 'react';
import { Button, Table } from 'antd';
import { DeleteFilled, EditOutlined, } from '@ant-design/icons';
import { AttachmentItem, FileDocumentDto, } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import ViewFileOfUserContent from '@src/components/ViewFile/viewFileOfUserContent';
import AppComponentBase from '@src/components/Manager/AppComponentBase';

export interface IProps {
	onDoubleClickRow?: (item: FileDocumentDto) => void;
	createOrUpdateModalOpen?: (item: FileDocumentDto) => void;
	fileDocumentListResult: FileDocumentDto[],
	pagination: TablePaginationConfig | false;
	hasAction?: boolean;
	onCreateUpdateSuccess?: (fileDocument: FileDocumentDto) => void;
	deleteItem?: (item: FileDocumentDto) => void
	NoScroll?: boolean;
}
export default class TableMainFileDocument extends AppComponentBase<IProps> {
	state = {
		isLoadDone: true,
		visibleModalCreateUpdate: false,
		visibleFile: false,
		itemAttachment: new AttachmentItem(),
		urlFileView: "",
		extFileView: "",
	};
	fileDocumentSelected: FileDocumentDto = new FileDocumentDto();
	onDoubleClickRow = (item: FileDocumentDto) => {
		if (!!this.props.onDoubleClickRow) {
			this.props.onDoubleClickRow(item);
		}
	}
	get = (id, ext, key) => {
		let a = new AttachmentItem();
		a.id = id;
		a.key = key;
		a.ext = ext;
		a.isdelete = undefined!;
		return [a];
	}
	onClickRow = async (item: FileDocumentDto) => {
		this.setState({ isLoadDone: false });
		let urlItem = await this.getFileDocument(item);
		await this.setState({ urlFileView: urlItem, extFileView: item.fi_do_extension });
		const result = await this.get(item.fi_do_id, item.fi_do_extension, item.fi_do_name);
		this.setState({
			itemAttachment: result
		});
		await this.setState({ visibleFile: true });
		this.setState({ isLoadDone: true });
	}
	createOrUpdateModalOpen = (item: FileDocumentDto) => {
		if (!!this.props.createOrUpdateModalOpen) {
			this.props.createOrUpdateModalOpen(item);
		}
	}
	deleteItem = (item: FileDocumentDto) => {
		if (!!this.props.deleteItem) {
			this.props.deleteItem(item);
		}
	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.fileDocumentSelected);
		}
	}

	render() {
		const { fileDocumentListResult, pagination, hasAction } = this.props;
		let action = {
			title: "", dataIndex: '', key: 'action_fileDocument_index', className: "no-print center",
			render: (text: string, item: FileDocumentDto) => (
				<div >
					<Button
						type="primary" icon={<EditOutlined />} title={L("chinh_sua")}
						style={{ marginLeft: '10px' }}
						size='small'
						onClick={() => { this.createOrUpdateModalOpen(item!) }}
					></Button>
					<Button
						type="ghost" icon={<DeleteFilled style={{ color: 'red' }} />} title={L("Delete")}
						style={{ marginLeft: '10px' }}
						size='small'
						onClick={() => this.deleteItem(item!)}
					></Button>
				</div>
			)
		};
		const columns = [
			{ title: L('N.O'), dataIndex: '', key: 'no_fileDocument_index', render: (text: string, item: FileDocumentDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : index + 1}</div> },
			{ title: L('Title'), dataIndex: 'fi_do_title', key: 'fi_do_title', render: (text: string, item: FileDocumentDto,) => <div>{item.document === undefined ? "" : item.document.name}</div> },
			{ title: L('mo_ta'), dataIndex: 'fi_do_desc', key: 'fi_do_desc', render: (text: string, item: FileDocumentDto,) => <div style={{ marginTop: "14px", overflowWrap: "anywhere" }} dangerouslySetInnerHTML={{ __html: item.fi_do_desc! }}></div> },
			{
				title: L('File'), dataIndex: 'fi_do_name', key: 'fi_do_name',
				onCell: (item: FileDocumentDto) => {
					return {
						onClick: () => this.onClickRow(item),
					};
				}, render: (text: string) => <div style={{ cursor: "pointer" }}>{text}</div>
			},
		];
		if (hasAction !== undefined && hasAction === true) {
			columns.push(action);
		}
		return (
			<>
				<Table
					onRow={(record, rowIndex) => {
						return {
							onDoubleClick: (event: any) => { (hasAction !== undefined && hasAction === true) && this.onDoubleClickRow(record) }
						};
					}}
					scroll={this.props.NoScroll == false ? { x: 1500, y: 1000 } : { x: undefined, y: undefined }}
					className='centerTable'
					loading={!this.state.isLoadDone}
					rowClassName={(record, index) => (this.fileDocumentSelected.fi_do_id == record.fi_do_id) ? "bg-click" : "bg-white"}
					rowKey={record => "quanlyhocvien_index__" + JSON.stringify(record)}
					size={'middle'}
					bordered={true}
					locale={{ "emptyText": L('NoData') }}
					columns={columns}
					dataSource={fileDocumentListResult.length > 0 ? fileDocumentListResult : []}
					pagination={this.props.pagination}

				/>
				<ViewFileOfUserContent
					visible={this.state.visibleFile}
					onCancel={() => this.setState({ visibleFile: false })}
					urlView={this.state.urlFileView!}
					ext={this.state.extFileView}
				/>
			</>
		)
	}
}