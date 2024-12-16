import * as React from 'react';
import { Col, Row, Button, Input, Card, Form, message, InputNumber, Checkbox } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SaveOutlined } from '@ant-design/icons';
import { GeneralSettingsEditDto } from '@src/services/services_autogen';
import { L } from '@src/lib/abpUtility';
import rules from '@src/scenes/Validation';

export interface IProps {
	onSaveGeneralSetting?: (item: GeneralSettingsEditDto) => void;
	general_setting: GeneralSettingsEditDto;
}

export default class GeneralSettings extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();
	state = {
		isLoadDone: true,
		isAutoBlockCardWithStatusCard: true,
	};

	async componentDidMount() {
		this.initData(this.props.general_setting);
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.props.general_setting != prevProps.general_setting) {
			this.initData(this.props.general_setting);
		}
	}

	initData = async (general_setting: GeneralSettingsEditDto) => {
		this.setState({ isLoadDone: false });
		if (general_setting !== undefined) {
			let general_setting_init: GeneralSettingsEditDto = general_setting;
			general_setting_init.maxUploadedData = general_setting.maxUploadedData / 1024 / 1024;
			general_setting_init.maxResourcesData = general_setting.maxResourcesData / 1024 / 1024 / 1024;
			await this.formRef.current!.setFieldsValue({ ...general_setting_init });
		} else {
			this.formRef.current.resetFields();
		}
		this.setState({ isLoadDone: true });
	}

	onSaveGeneralSetting = () => {
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			let general_setting = new GeneralSettingsEditDto({ ...values });
			general_setting.isAutoBlockCardWithStatusCard = this.state.isAutoBlockCardWithStatusCard;
			if (this.props.onSaveGeneralSetting) {
				this.props.onSaveGeneralSetting(general_setting);
			}
			message.success(L("cap_nhat_thanh_cong"));
		})
	}

	render() {
		return (
			<Card>
				<Form ref={this.formRef}>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"defaultCheckTime"}>
							<Input min={1} addonAfter={L("ngay")} />
						</Form.Item></Col>
						<Col span={20}>{L("thoi_gian_kiem_ke_mac_dinh")}</Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("cai_dat_chu_ky_thoi_gian_cho_cac_lan_kiem_ke")}.</i></Col>
					</Row>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"defaultBorrowMaxTime"}>
							<Input min={1} addonAfter={L("ngay")} />
						</Form.Item></Col>
						<Col span={20}>{L("thoi_gian_muon_toi_da")}</Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("cai_dat_thoi_gian_muon_tai_lieu_toi_da")}.</i></Col>
					</Row>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"deleteRegisterBorrowMaxTime"}>
							<Input min={1} addonAfter={L("ngay")} />
						</Form.Item></Col>
						<Col span={20}>{L("xoa_dang_ky_muon_neu_doc_gia_dang_ky_muon_nhung_khong_lay_sau_so_ngay_nhat_dinh")}</Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("xoa_dang_ky_muon_neu_doc_gia_dang_ky_muon_nhung_khong_lay_sau_so_ngay_nhat_dinh")}.</i></Col>
					</Row>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"defaultMoneyOutOfDate"}>
							<Input min={1} addonAfter={L("ngay")} />
						</Form.Item></Col>
						<Col span={20}>{L("cai_dat_phat_tien_khi_qua_han")} (VND/{L("ngay")})</Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("tien_phat_khi_qua_han_muon_tai_lieu")}.</i></Col>
					</Row>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"timeChangeStatusRecoveredDocument"}>
							<Input min={1} addonAfter={L("ngay")} />
						</Form.Item></Col>
						<Col span={20}>{L("qua_bao_lau_thi_chuyen_sang_trang_thai_can_thu_hoi") + "/" + L("ngay")}</Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("qua_bao_lau_thi_chuyen_sang_trang_thai_can_thu_hoi")}.</i></Col>
					</Row>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"dueDateMaxTimes"} >
							<InputNumber min={0} style={{ width: "100%" }} />
						</Form.Item></Col>
						<Col span={20}>{L("cai_dat_so_lan_gia_han_mac_dinh")}</Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("so_lan_gia_han")}.</i></Col>
					</Row>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"maxUploadedData"}>
							<InputNumber min={1} max={10} style={{ width: "100%" }} />
						</Form.Item></Col>
						<Col span={20}>{L("gioi_han_kich_thuoc_file") + "(MB)" + "/" + L("File")}</Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("gioi_han_kich_thuoc_file_moi_lan_tai_len")}/MB.</i></Col>
					</Row>
					<Row gutter={15} style={{ marginTop: "10px" }}>
						<Col span={4}><Form.Item rules={[rules.numberOnly]} name={"maxResourcesData"}>
							<InputNumber min={1} max={10} style={{ width: "100%" }} />
						</Form.Item></Col>
						<Col span={20}>{L("gioi_han_kich_thuoc_tai_nguyen") + "(GB)" + "/" + L("account")} </Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("gioi_han_kich_thuoc_tai_nguyen_moi_tai_khoan")}/GB.</i></Col>
					</Row>
					<Row style={{ marginTop: "10px" }}>
						<Col span={24}><Form.Item name="isAutoBlockCardWithStatusCard">
							<Checkbox onChange={(e) => this.setState({ isAutoBlockCardWithStatusCard: e.target.checked })} >
								{L("cai_dat_tu_dong_khoa_the_neu_the_het_han_the_dang_no_sach_the_dang_no_tien")}
							</Checkbox>
						</Form.Item></Col>
						<Col span={24} style={{ marginTop: "10px", marginBottom: "10px", fontSize: "13px", color: "#096dd9" }}><i>{L("khoa_the_neu_the_het_han_the_dang_no_sach_the_dang_no_tien")}.</i></Col>
					</Row>
				</Form>
				<hr style={{ marginTop: "20px" }}></hr>
				<Button title={L('luu_cai_dat')} icon={<SaveOutlined />} type='primary' onClick={this.onSaveGeneralSetting}>{L("luu_cai_dat")}</Button>
			</Card >
		);
	}
}