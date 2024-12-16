import * as React from 'react';
import { Col, Row, Button, Card, Input, message, Table, } from 'antd';
import { AttachmentItem, BorrowReturningDetailsWithListDocumentDto, BorrowReturningIDetailDto, CancelBorrowReturningInput, } from '@services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';

export interface IProps {
	onCancel?: () => void;
	detail_borrow: BorrowReturningDetailsWithListDocumentDto;
	onSuccessAction: () => void,
}

export default class CancelMemberBorrowReturn extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		ressonCancel: ""
	};
	listAttachmentItem_file: AttachmentItem[] = [];

	onSuccessAction = () => {
		if (!!this.props.onSuccessAction) {
			this.props.onSuccessAction();
		}
	}
	onCancelRequest = async () => {
		let input = new CancelBorrowReturningInput();
		input.br_re_id = this.props.detail_borrow.br_re_id;
		input.br_re_desc = this.state.ressonCancel;
		await stores.borrowReturningStore.memeberCancel(input);
		message.success(L('Success'));
		await this.onSuccessAction();
	}
	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}

	render() {
		const { detail_borrow } = this.props;
		const columns = [
			{ title: L('N.O'), key: 'no_borrowReturning_cancel', width: 50, render: (text: string, item: BorrowReturningIDetailDto, index: number) => <div>{index + 1}</div> },
			{ title: L('DocumentName'), key: 'title_borrowReturning_cancel', render: (text: string, item: BorrowReturningIDetailDto) => <div>{item.document.do_title}</div> },
		];
		return (
			<>
				{/* <InformationMember memberSelected={this.props.memberBorrow} /> */}
				<Row>
					<Col span={24}>
						<Table
							loading={!this.state.isLoadDone}
							rowKey={record => Math.random() + "_" + record.br_re_id}
							size={'middle'}
							bordered={true}
							locale={{ "emptyText": L('NoData') }}
							columns={columns}
							dataSource={detail_borrow.list_borrow!.length > 0 ? detail_borrow.list_borrow : []}
							pagination={false}
						/>
					</Col>
				</Row>
				<Row style={{ marginTop: "15px" }}>
					<Col span={6}><strong>{L('CanceledReason')}: </strong></Col>
					<Col span={18}><Input.TextArea rows={3} onChange={(e) => this.setState({ ressonCancel: e.target.value })} /></Col>
				</Row>
				<Row style={{ textAlign: "right", marginTop: "20px" }}>
					<Col span={24}>
						<Button danger onClick={() => this.onCancel()}>{L('Cancel')}</Button>
						&nbsp;
						<Button type='primary' onClick={() => this.onCancelRequest()}>{L('Save')}</Button>
					</Col>
				</Row>
			</>
		)
	}
}