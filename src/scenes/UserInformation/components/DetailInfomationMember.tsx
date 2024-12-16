import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, FileDoneOutlined, HomeOutlined, PhoneOutlined, PlusCircleOutlined, ReloadOutlined, TagOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import { eGENDER, valueOfeGENDER, valueOfeMCardType, valueOfeMemberRegisterStatus, eMCardStatus, eMemberRegisterStatus, valueOfeMCardStatus } from "@src/lib/enumconst";
import { AttachmentItem, MemberCardDto, FindMemberBorrowDto, UpdateMemberAvatarSesionInput } from "@src/services/services_autogen";
import { Avatar, Button, Col, Form, Modal, Row, Tag, message } from "antd";
import AppLongLogo from '@images/logoego_long256.png';
import React from "react";
import { stores } from "@src/stores/storeInitializer";
import FormEditInforMember from "./FormEditInforMember";
import { L } from "@src/lib/abpUtility";
import FormCreateMemberCardOnline from "./FormCreateMemberCardOnline";
import { async } from "q";
import moment from "moment";
import AppConsts, { FileUploadType, cssColResponsiveSpan } from "@src/lib/appconst";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import FileAttachments from "@src/components/FileAttachments";
import UploadImage from "./UploadImage";
export interface IProps {
	visibleModalUpdateMember?: boolean;
	updateSuccess?: () => void;
	closeCreateUpdate?: () => void;
	ref?: any;
}
export default class DetailInformationMember extends AppComponentBase<IProps> {
	state = {
		isLoadDone: false,
		visibleFormCreateCardOnline: false,
		isLoadFile: false,
	}

	infoMember: FindMemberBorrowDto = new FindMemberBorrowDto();
	memberCardSelected: MemberCardDto = new MemberCardDto();
	fileAttachmentItem: AttachmentItem = new AttachmentItem();
	async componentDidMount() {
		this.getAll();
	}

	getAll = async () => {
		this.setState({ isLoadDone: false });
		this.infoMember = await stores.sessionStore.getMemberInformations();
		this.fileAttachmentItem = this.infoMember.fi_id;
		this.memberCardSelected = this.infoMember.memberCard;
		this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
	}
	updateSuccess = async () => {
		await this.getAll();
		this.props.closeCreateUpdate!();
	}
	createOrUpdateSuccess = async () => {
		await this.setState({ isLoadDone: false });
		await this.getAll();
		await this.setState({ isLoadDone: true, visibleFormCreateCardOnline: false });
	}
	onRegisterCardOnline = (memberStatus: number) => {
		if (memberStatus == eMemberRegisterStatus.NONE.num) {
			message.error(L("doc_gia_chua_duoc_duyet"));
			return;
		}
		else {
			this.setState({ visibleFormCreateCardOnline: true })
		}
	}
	onAddAndRemoveFile = async (file: AttachmentItem) => {
		if (file == undefined) {
			file = new AttachmentItem();
			file.id = -1;
		}
		let data = new UpdateMemberAvatarSesionInput();
		data.fi_id = file;
		data.me_id = this.infoMember.me_id;
		await stores.sessionStore.updateMemberAvatar(data);
		this.setState({ isLoadDone: true });
	};
	render() {
		const { infoMember, memberCardSelected } = this;
		const today = new Date();
		const self = this;
		return (
			<Row gutter={[16, 16]} >
				<Col {...cssColResponsiveSpan(24, 24, 10, 10, 10, 10)} style={{ textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 8px', paddingTop: 20 }}>
					<h2>{L("Avatar")}</h2>
					<Row className="avatar_attachment">
						<UploadImage
							files={[this.fileAttachmentItem]}
							isMultiple={false}
							isLoadFile={this.state.isLoadFile}
							componentUpload={FileUploadType.Avatar}
							onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
								await this.onAddAndRemoveFile(itemFile[0])
							}}
						/>
					</Row>
					<Row >
						<Col xs={{ span: 10, offset: 7 }} sm={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }}
							lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }} xxl={{ span: 16, offset: 4 }}
							style={{ background: "#b8b1b142", marginBottom: 10, padding: '10px', fontFamily: 'sans-serif', border: '1px solid rgb(183 141 141 / 56%)', borderRadius: '10px' }}>
							{/* <h4>{L("NewPhoto")}</h4>
							<h4>{L("MessageImage")}</h4> */}
							<h4>{L("MaximumSize")}</h4>
						</Col>
					</Row>
				</Col>
				<Col {...cssColResponsiveSpan(24, 24, 14, 14, 14, 14)}>
					{!this.props.visibleModalUpdateMember ?
						<div style={{ width: "100%" }}>
							{/* <Row style={{ justifyContent: 'end' }}>
								<Button type='primary' onClick={this.props.closeCreateUpdate}>{L("Edit")}
								</Button>
							</Row> */}
							<Row style={{ paddingBottom: '10px' }} gutter={16}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><UserOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("MemberCode")}: &nbsp;</b> <label>{infoMember.me_code}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><UserOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("MemberName")}: &nbsp;</b> <label>{infoMember.me_name}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '20px', paddingBottom: '10px' }}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><CalendarOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Birthday")}: &nbsp;</b> <label>{infoMember.me_birthday}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><HomeOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Address")}: &nbsp;</b> <label>{infoMember.me_address}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '20px', paddingBottom: '10px' }}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><WomanOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Gender")}: &nbsp;</b> <label>{valueOfeGENDER(infoMember.me_sex)}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><PhoneOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("ContactPhone")}: &nbsp;</b> <label>{infoMember.me_phone}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '20px', paddingBottom: '10px' }}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><CheckCircleOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Status")}: &nbsp;</b>
									<>
										{infoMember.me_status === eMemberRegisterStatus.NONE.num &&
											<Tag color='blue' icon={<ReloadOutlined spin />}>{valueOfeMemberRegisterStatus(infoMember.me_status)}</Tag>
										}
										{
											infoMember.me_status === eMemberRegisterStatus.REJECT.num &&
											<Tag color='red' icon={<CloseCircleOutlined />}>{valueOfeMemberRegisterStatus(infoMember.me_status)}</Tag>
										}
										{
											infoMember.me_status === eMemberRegisterStatus.ACCEPTED.num &&
											<Tag color='green' icon={<CheckCircleOutlined />}>{valueOfeMemberRegisterStatus(infoMember.me_status)}</Tag>
										}
									</>
								</Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><CalendarOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Identification")}: &nbsp;</b> <label>{infoMember.me_identify}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '20px', paddingBottom: '10px' }}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><FileDoneOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Note")}: &nbsp;</b> <label>{infoMember.me_note}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><TagOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Information")}: &nbsp;</b> <label>{infoMember.me_more_infor}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '20px', paddingBottom: '10px' }}>
								<Col span={24}><CheckCircleOutlined style={{ zoom: 1.5 }} />
									<>
										<b> &nbsp;{L("CardStatus")}: &nbsp;</b>
										{infoMember.me_status == eMemberRegisterStatus.ACCEPTED.num ?

											infoMember.me_has_card == false ?
												<>
													<label>{L("chua_co_the")}</label>&nbsp;
													<Button title={L('dang_ky_the_truc_tuyen')} type="primary" onClick={() => this.onRegisterCardOnline(infoMember.me_status)} >{L("dang_ky_the_truc_tuyen")}</Button>
												</>
												:
												(memberCardSelected.me_ca_status == eMCardStatus.Register.num ?
													<>
														<label>{L("dang_duyet_the")}</label>&nbsp;
														<Button title={L('chinh_sua_thong_tin_dang_ky_the')} type="primary" onClick={() => this.setState({ visibleFormCreateCardOnline: true })} >{L("chinh_sua_thong_tin_dang_ky_the")}</Button>

													</>
													:
													(
														(memberCardSelected.me_ca_time_receive != undefined && today.getTime() < memberCardSelected.me_ca_time_receive!.getTime()) ?
															<Tag color="orange" icon={<ReloadOutlined spin />}>{L("the_cua_ban_da_duoc_duyet.ban_co_the_nhan_the_vao") + " " + moment(memberCardSelected.me_ca_time_receive).format("DD/MM/YYYY")}</Tag>
															:
															<>
																{memberCardSelected.me_ca_status === eMCardStatus.Creating.num &&
																	<Tag color='green' >{valueOfeMCardStatus(memberCardSelected.me_ca_status)}</Tag>
																}
																{
																	memberCardSelected.me_ca_status === eMCardStatus.Timeup.num &&
																	<Tag color='red' icon={<CloseCircleOutlined />}>{valueOfeMCardStatus(memberCardSelected.me_ca_status)}</Tag>
																}
																{
																	memberCardSelected.me_ca_status === eMCardStatus.DebtDocument.num &&
																	<Tag color='orange' icon={<ExclamationCircleOutlined />}>{valueOfeMCardStatus(memberCardSelected.me_ca_status)}</Tag>
																}
																{
																	memberCardSelected.me_ca_status === eMCardStatus.DebtMoney.num &&
																	<Tag color='blue' icon={<ClockCircleOutlined />}>{valueOfeMCardStatus(memberCardSelected.me_ca_status)}</Tag>
																}
															</>
													)
												)
											:
											(infoMember.me_status == eMemberRegisterStatus.NONE.num ? L("ban_chua_duoc_phe_duyet_doc_gia") : L("ban_bi_tu_choi_phe_duyet"))
										}
										&nbsp;
									</>
								</Col>
							</Row>
							<Row style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontSize: '20px', fontFamily: 'inherit' }}>
								<p >{L("Welcome")} <b>{infoMember.me_name}</b> {L("To") + " " + L("TuyenQuangLibrary")} <img src={AppLongLogo} alt="Logo" /></p>
							</Row>
						</div>
						:
						<FormEditInforMember
							ref={this.props.ref}
							memberInfo={this.infoMember}
							updateSuccess={this.updateSuccess}
						/>
					}

				</Col>
				<Modal
					visible={this.state.visibleFormCreateCardOnline}
					onCancel={() => this.setState({ visibleFormCreateCardOnline: false })}
					closable={false}
					maskClosable={false}
					footer={null}
				>
					<FormCreateMemberCardOnline
						onCancel={() => this.setState({ visibleFormCreateCardOnline: false })}
						onSuccessRegister={this.createOrUpdateSuccess}
						memberCardSelected={this.memberCardSelected != undefined ? this.memberCardSelected : new MemberCardDto()}
					></FormCreateMemberCardOnline>

				</Modal>
			</Row>
		)
	}
}