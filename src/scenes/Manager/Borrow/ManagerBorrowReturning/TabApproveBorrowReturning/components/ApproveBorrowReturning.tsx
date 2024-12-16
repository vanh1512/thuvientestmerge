import * as React from 'react';
import { Col, Row, Button, Card, Input, message, Popconfirm, Modal, } from 'antd';
import { AttachmentItem, BorrowReturningDetailsWithListDocumentDto, BorrowReturningIDetailDto, FindMemberBorrowDto } from '@services/services_autogen';

import { stores } from '@src/stores/storeInitializer';
import InformationMember from '@src/scenes/Manager/Member/components/InformationMember';
import { BookOutlined, CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import DeliveryDocument from '../../TabDeliveryDocumentBorrowReturning/components/DeliveryDocument';
import { L } from '@src/lib/abpUtility';


export interface IProps {
	detailBorrow: BorrowReturningDetailsWithListDocumentDto;
	memberBorrow: FindMemberBorrowDto,
	onCancel: () => void,
	onSuccessAction: () => void,
	onSuccessActionItem: () => void,
}

export default class ApproveBorrowReturning extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleListDocumnetApprove: true,
		visibleModalDelivery: false,
		acceptBorrow: ""
	};

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
			this.setState({ visibleListDocumnetApprove: false, visibleModalDelivery: false })
		}
	}
	onSuccessAction = () => {
		if (!!this.props.onSuccessAction) {
			this.props.onSuccessAction();
		}
	}
	onSuccessActionItem = () => {
		if (!!this.props.onSuccessActionItem) {
			this.props.onSuccessActionItem();
		}
	}

	deleteBorrowReturningItem = async (item: BorrowReturningIDetailDto) => {
		this.setState({ isLoadDone: false });
		this.props.detailBorrow.list_borrow = await stores.borrowReturningStore.deleteBorrowReturningItem(item);
		message.destroy(L('SuccessfullyDeleted'));
		await this.onSuccessActionItem();
		this.setState({ isLoadDone: true });
	}

	approveBorrowReturning = async () => {
		this.setState({ isLoadDone: false });
		await stores.borrowReturningStore.approveBorrowReturning(this.props.detailBorrow.br_re_id, this.state.acceptBorrow);
		message.success(L('SuccessfullyApproved'));
		await this.onSuccessAction();
		this.setState({ isLoadDone: true })
	}

	approveAndDeliveryBorrowReturning = async () => {
		await stores.borrowReturningStore.approveBorrowReturning(this.props.detailBorrow.br_re_id, this.state.acceptBorrow);
		message.success(L('SuccessfullyApproved'));
		this.setState({ visibleModalDelivery: true, visibleListDocumnetApprove: false, });
	}

	render() {
		const { detailBorrow, memberBorrow } = this.props;
		return (
			<Card>
				{this.state.visibleListDocumnetApprove &&
					<>
						<InformationMember memberSelected={memberBorrow} />
						<Row>
							<Col span={24}><h2 style={{ textAlign: 'center' }}>{L('ListOfRegisteredDocumentBorrowings')}</h2></Col>
						</Row>
						<div>
							{detailBorrow.list_borrow != undefined && [...detailBorrow.list_borrow!].map((item: BorrowReturningIDetailDto, index: number) =>
								<Row key={index + "_"} gutter={16} style={{ padding: '3px', justifyContent: 'start', alignItems: 'center', marginTop: '5px', backgroundColor: index % 2 == 0 ? '#f1f3f4' : '#fff' }}>
									<Col span={4} offset={2}>
										<b>{L("quyen_so") + " " + (index + 1) + ": "}</b>
									</Col>
									<Col span={11}>
										{item.document.do_title}
									</Col>
									<Col span={5}>
										{L('Price')} : {item.document.do_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
									</Col>
									<Col span={1} >
										<Popconfirm title={L('WantToDelete?')} onConfirm={() => this.deleteBorrowReturningItem(item)}>
											<DeleteOutlined style={{ color: 'red' }} />
										</Popconfirm>
									</Col>
								</Row>
							)}
						</div>
						<div>
							<Row>
								<Col span={24} style={{ textAlign: "center", marginTop: "5px" }}><h2>{L("Note")}</h2></Col>
							</Row>
							<Row>
								<Col style={{ marginTop: "5px" }} span={24}><Input.TextArea rows={3} onChange={(e) => this.setState({ acceptBorrow: e.target.value })} /></Col>
							</Row>
						</div>
						<Row style={{ textAlign: "center", marginTop: "20px" }}>
							<Col span={24}>
								<Button danger onClick={() => this.onCancel()}>{L('Exit')} </Button>
								&nbsp;&nbsp;
								<Button type='default' icon={<BookOutlined />} onClick={this.approveAndDeliveryBorrowReturning} style={{ backgroundColor: 'cyan' }}>{L('DeliverDocuments')} </Button>
								&nbsp;&nbsp;
								<Button type='primary' icon={<CheckCircleOutlined />} onClick={this.approveBorrowReturning}>{L('Approve')} </Button>
							</Col>
						</Row>
					</>
				}
				{this.state.visibleModalDelivery &&
					<Modal
						visible={this.state.visibleModalDelivery}
						title={L('DeliverDocuments')}
						footer={null}
						width='60vw'
						closable={false}
						onCancel={this.onCancel}
					>
						<DeliveryDocument
							detailBorrow={this.props.detailBorrow}
							onSuccessAction={this.onSuccessAction}
							onSuccessActionItem={this.onSuccessActionItem}
							memberBorrow={this.props.memberBorrow}
							onCancel={this.onCancel}
						/>
					</Modal>
				}
			</Card>
		)
	}
}