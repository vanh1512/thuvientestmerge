import { BulbOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, HomeOutlined, MediumOutlined, SolutionOutlined, UserOutlined, WomanOutlined } from "@ant-design/icons";
import { valueOfeGENDER } from "@src/lib/enumconst";
import { AttachmentItem, GetCurrentLoginInformationsOutput, UpdateAvataInput, UserDto } from "@src/services/services_autogen";
import { Button, Col, Row } from "antd";
import AppLongLogo from '@images/logoego_long256.png';
import React from "react";
import moment from "moment";
import FormUpdateInfoUser from "./FormUpdateInfoUser";
import { L } from "@src/lib/abpUtility";
import { stores } from "@src/stores/storeInitializer";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { FileUploadType, cssColResponsiveSpan } from "@src/lib/appconst";
import UploadImage from "./UploadImage";
export interface IProps {
	visibleModalUpdateMember?: boolean;
	updateSuccess?: () => void;
	currentLogin: GetCurrentLoginInformationsOutput;
	editUser: UserDto;
	ref?: any;
	closeOpenCreateUpdate?: () => void;

}
export default class DetailInformationUser extends AppComponentBase<IProps>{
	fileAttachmentItem: AttachmentItem = new AttachmentItem();
	state = {
		isLoadDone: false,
		isLoadFile: false,
	}
	componentDidMount = () => {
		this.setState({ isLoadDone: false });
		let file = new AttachmentItem();
		file.id = this.props.currentLogin.user.us_avatar;
		file.ext = ".png";
		this.fileAttachmentItem = file;
		this.setState({ isLoadDone: true, isLoadFile: !this.state.isLoadFile });
	}
	updateSuccess = () => {
		if (!!this.props.updateSuccess) { this.props.updateSuccess(); }
	}
	updateAvataUser = async (input: UpdateAvataInput) => {
		if (input.id! === undefined || input.id! === null) {
			return;
		}
		await stores.userStore.updateAvataUser(input);
	}
	onAddAndRemoveFile = async (file: AttachmentItem | undefined) => {
		if (file === undefined) {
			file = new AttachmentItem();
			file.id = -1;
		}
		let data = new UpdateAvataInput();
		data.id = stores.userStore.editUser.id!;
		data.us_avatar = file.id;
		await this.updateAvataUser(data);
		this.setState({ isLoadDone: true });

	};
	onRemoveFile = async (fi_id: number) => {
		let data = new UpdateAvataInput();
		data.id = stores.userStore.editUser.id!;
		data.us_avatar = fi_id;
		await this.updateAvataUser(data);
		this.setState({ isLoadDone: true });
	}
	render() {
		const { currentLogin, editUser } = this.props;
		return (
			<Row gutter={[16, 16]}>
				<Col {...cssColResponsiveSpan(24, 24, 10, 10, 10, 10)} style={{ textAlign: 'center', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 8px', paddingTop: 20, }}>
					<h2>{L("Avatar")}</h2>
					<Row className="avatar_attachment">
						<UploadImage
							files={[this.fileAttachmentItem]}
							isMultiple={false}
							isLoadFile={this.state.isLoadFile}
							componentUpload={FileUploadType.Avatar}
							onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
								this.onAddAndRemoveFile(itemFile[0])
							}}
						/>
					</Row>
					<Row >
						<Col xs={{ span: 10, offset: 7 }} sm={{ span: 10, offset: 7 }} md={{ span: 16, offset: 4 }}
							lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }} xxl={{ span: 16, offset: 4 }}
							style={{ background: "#b8b1b142", padding: '10px', fontFamily: 'sans-serif', border: '1px solid rgb(183 141 141 / 56%)', borderRadius: '10px' }}>
							{/* <h4>{L("NewPhoto")}</h4>
							<h4>{L("MessageImage")}</h4> */}
							<h4>{L("MaximumSize")}</h4>
						</Col>
					</Row>
				</Col>
				<Col {...cssColResponsiveSpan(24, 24, 14, 14, 14, 14)}>
					{!this.props.visibleModalUpdateMember ?
						<div>
							<Row style={{ justifyContent: 'end' }}>
								<Button type='primary' onClick={this.props.closeOpenCreateUpdate}>{L("Edit")}
								</Button>
							</Row>
							<Row style={{ paddingBottom: '10px' }} gutter={16}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><CheckCircleOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Birthday")}: &nbsp;</b><label>{moment(currentLogin.user.us_dob).format("DD/MM/YYYY")}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><UserOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Name")}: &nbsp;</b><label>{currentLogin.user.name}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '30px', paddingBottom: '10px' }}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}>< CalendarOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Surname")}:  &nbsp;</b><label>{currentLogin.user.surname}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><SolutionOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("UserName")}: &nbsp;</b> <label>{currentLogin.user.userName}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '30px', paddingBottom: '10px' }}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><WomanOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Gender")}: &nbsp;</b><label>{valueOfeGENDER(currentLogin.user.us_gender)}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><HomeOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Address")}: &nbsp;</b><label>{currentLogin.user.us_address}</label></Col>
							</Row>
							<Row gutter={16} style={{ marginTop: '30px', paddingBottom: '10px' }}>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><MediumOutlined style={{ zoom: 1.5 }} /><b> &nbsp;Email: &nbsp;</b><label>{editUser != undefined && editUser.emailAddress}</label></Col>
								<Col {...cssColResponsiveSpan(24, 12, 12, 12, 12, 12)}><BulbOutlined style={{ zoom: 1.5 }} /><b> &nbsp;{L("Status")}: &nbsp;</b>
									<label>
										{(editUser != undefined && editUser.isActive === true) ? <>{L("Activated")} <CheckCircleOutlined style={{ color: "#1DA57A" }} /> </> : <>{L("NotActivate")} <CloseCircleOutlined style={{ color: "#d42121d9" }} /> </>}
									</label>
								</Col>
							</Row>
							<Row style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontSize: '20px', fontFamily: 'inherit' }}>
								<p >{L("Welcome")} <b>{currentLogin.user.surname + " " + currentLogin.user.name}</b> {L("To") + " " + L("TuyenQuangLibrary")} <img src={AppLongLogo} alt="Logo" /></p>
							</Row>

						</div>
						:
						<FormUpdateInfoUser currentLogin={currentLogin} updateSuccess={this.updateSuccess} ref={this.props.ref} />
					}
				</Col>
			</Row>
		)
	}
}