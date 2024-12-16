import * as React from 'react';
import { Col, Row, Button, Card, Input, message, Popconfirm, Modal, } from 'antd';
import { AttachmentItem, BorrowReturningDetailsWithListDocumentDto, BorrowReturningDto, BorrowReturningIDetailDto, DeliveryBorrowReturningDetailItem, DeliveryDocumentInput, GetDocumentInforByDKCBDto, FindMemberBorrowDto, ReturnBorrowReturningDetailItem, ReturnDocumentInput } from '@services/services_autogen';
import { FileUploadType } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import InformationMember from '@src/scenes/Manager/Member/components/InformationMember';
import { CheckCircleFilled, CheckCircleOutlined, CheckSquareOutlined, DeleteOutlined, FontSizeOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import FileAttachments from '@src/components/FileAttachments';
import { eDocumentItemStatus } from '@src/lib/enumconst';

export interface IProps {
	detailBorrow: BorrowReturningDetailsWithListDocumentDto;
	memberBorrow: FindMemberBorrowDto,
	onCancel: () => void;
	onSuccessAction: () => void,
	onSuccessActionItem: () => void,
	onPrintFormBorrow?: () => void,

}
const { confirm } = Modal;

export default class DeliveryDocument extends React.Component<IProps> {
	state = {
		isLoadDone: false,
		isLoadFile: false,
		inputDKCBCode: '',
	};
	listAttachmentItem_file: AttachmentItem[] = [];
	listDetailBorrow: BorrowReturningIDetailDto[] = [];
	async componentDidMount() {
		if (this.props.detailBorrow.fi_id_arr != undefined) {
			this.listAttachmentItem_file = this.props.detailBorrow.fi_id_arr;
		}
		if (!!this.props.detailBorrow.list_borrow) {
			this.listDetailBorrow = [...this.props.detailBorrow.list_borrow];
		}
		await this.setState({ isLoadFile: !this.state.isLoadFile });
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

	onPrintFormBorrow = () => {
		if (!!this.props.onPrintFormBorrow) {
			this.props.onPrintFormBorrow();
		}
	}

	onActionDeliveryRequest = async (is_printed: boolean) => {
		const self = this;
		this.setState({ isLoadDone: false });
		const { detailBorrow } = this.props;
		let input = new DeliveryDocumentInput();
		input.br_re_id = detailBorrow.br_re_id;
		let count = 0;
		input.list_document = detailBorrow.list_borrow!.map(item => {
			let inputItem = new DeliveryBorrowReturningDetailItem();
			inputItem.init(item);
			if (item.do_in_id > 0) {
				count++;
			}
			return inputItem;
		});
		if (count !== detailBorrow.list_borrow!.length) {
			message.error(L("DocumentNotConfirmedYet"))
			return;
		}
		if (is_printed) {
			this.onPrintFormBorrow();
		} else {
			confirm({
				title: L("HaveYouPrintedTheBorrowingFormYet") + "?",
				okText: 'Ok',
				cancelText: L('Exit'),
				async onOk() {
					input.fi_id_arr = self.listAttachmentItem_file;
					await stores.borrowReturningStore.deliveryDocument(input);
					message.success(L('Success'));
					await self.onSuccessAction();
					self.setState({ isLoadDone: true });
				},
				onCancel() {
				},
			});
		}
		this.setState({ isLoadDone: true });
	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}
	}

	deleteBorrowReturningItem = async (item: BorrowReturningIDetailDto) => {
		this.setState({ isLoadDone: false });
		this.props.detailBorrow.list_borrow = await stores.borrowReturningStore.deleteBorrowReturningItem(item);
		message.destroy(L('SuccessfullyDeleted'));
		await this.onSuccessActionItem();
		this.setState({ isLoadDone: true });
	}

	handleCheckBorrow = async (value: string) => {
		if (value == undefined || value == "") {
			message.error(L('PleaseEnterTheĐkcbNumber.'));
			return;
		}
		let result: GetDocumentInforByDKCBDto = await stores.borrowReturningStore.getDocumentInforByDKCB(value);
		if (!!result) {
			if (result.documentInfo.do_in_status == eDocumentItemStatus.Borrow.num) {
				message.error(L('tai_lieu_da_duoc_muon'));
			}
			else {
				const item = this.listDetailBorrow!.find(item => item.do_id === result.document.do_id && item.do_in_id == -1);
				if (item !== undefined) {
					const itemScanned = this.listDetailBorrow!.find(item => item.do_in_id == result.documentInfo.do_in_id);
					if (itemScanned != undefined) {
						message.error(L('da_quet_tai_lieu_nay'));
					}
					else {
						this.setState({ isLoadDone: false });
						item.do_in_id = result.documentInfo.do_in_id;
						item.documentInfor = result.documentInfo;
						message.success(L('DocumentScannedSuccessfully.'));
						this.setState({ inputDKCBCode: '', isLoadDone: true });
					}
				}
				else {
					message.warning(L('NoDocumentFound.'))
				}
			}

		}
	}

	render() {
		const { detailBorrow, memberBorrow } = this.props;
		return (
			<>
				<InformationMember memberSelected={memberBorrow} />
				<Row>
					<Col span={24}><h2>{L('ListOfRegisteredDocumentBorrowings')}</h2></Col>
				</Row>
				<Row style={{ justifyContent: 'center', margin: '0 0 20px 0' }}>
					<Col span={10} style={{ display: 'flex', margin: '0 10px 0 0' }}>
						<Input value={this.state.inputDKCBCode} onPressEnter={() => this.handleCheckBorrow(this.state.inputDKCBCode)} onChange={(e) => this.setState({ inputDKCBCode: e.target.value.trim() })} placeholder={L("ma_dang_ky_ca_biet")} />
					</Col>

					<Col span={2}>
						<Button type='primary' onClick={() => this.handleCheckBorrow(this.state.inputDKCBCode)}><CheckCircleOutlined /></Button>
					</Col>
				</Row>
				{detailBorrow != undefined && detailBorrow.list_borrow?.length !== 0 && detailBorrow.list_borrow!.map((item: BorrowReturningIDetailDto, index: number) =>
					<Row key={index + "_"} gutter={16} style={{ padding: '3px', justifyContent: 'start', alignItems: 'center', marginTop: '5px', backgroundColor: index % 2 == 0 ? '#f1f3f4' : '#fff' }}>
						<Col span={4} offset={2}>
							<b>{"- " + L("DocumentNumber") + " " + (index + 1) + ": "}</b>
						</Col>
						<Col span={9}>
							{item.document.do_title}
						</Col>
						<Col span={7}>
							<b>{L('CodeDkcb')}: </b>{item.documentInfor !== undefined ? <span>{item.documentInfor.dkcb_code}<CheckCircleFilled style={{ color: 'seagreen' }} /></span> : ""}
						</Col>
						<Col span={1}>
							<Popconfirm title={L('WantToDelete?')} onConfirm={() => this.deleteBorrowReturningItem(item)}>
								<DeleteOutlined style={{ color: 'red' }} />
							</Popconfirm>
						</Col>
					</Row>
				)}
				<Row style={{ marginTop: '10px' }}>
					<strong>{L("File")}</strong>
					<FileAttachments
						files={this.listAttachmentItem_file}
						isLoadFile={this.state.isLoadFile}
						isMultiple={true}
						componentUpload={FileUploadType.Contracts}
						onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
							this.listAttachmentItem_file = itemFile;
						}}
					/>
				</Row>
				<Row style={{ textAlign: "center", marginTop: "20px" }}>
					<Col span={24}>
						<Button danger onClick={() => this.onCancel()}>{L('Exit')}</Button>
						&nbsp;&nbsp;
						<Button type='primary' onClick={() => this.onActionDeliveryRequest(false)}>{L('Save')}</Button>
						&nbsp;&nbsp;
						<Button type='primary' onClick={async () => await this.onActionDeliveryRequest(true)}>{L('PrintBorrowingForm')}</Button>
					</Col>
				</Row>
			</>
		)
	}
}