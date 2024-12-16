import * as React from 'react';
import { Row, Button, Input, Card, message, Tabs, Col, } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SaveOutlined } from '@ant-design/icons';
import { L } from '@src/lib/abpUtility';
import { GeneralSettingsEditDto, SendGmailSettingsEditDto } from '@src/services/services_autogen';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export interface IProps {
	onSaveEmailSetting?: (item: SendGmailSettingsEditDto, item2: GeneralSettingsEditDto) => void;
	auto_email_setting: SendGmailSettingsEditDto;
	general_setting: GeneralSettingsEditDto;
}
const { TabPane } = Tabs;
export default class AutoSentEmailSetting extends AppComponentBase<IProps> {
	private formRef: any = React.createRef();
	editorRef: any = React.createRef();
	state = {
		isLoadDone: false,
		visible_article: false,
		title: "",
		context: "",
		key: "",
	}

	sendGmailSettingsEditDto: SendGmailSettingsEditDto = new SendGmailSettingsEditDto();
	componentDidMount() {
		this.initData(this.props.auto_email_setting, "birthday");
	}
	initData = async (inputWebhookSubcription: SendGmailSettingsEditDto | undefined, key: string) => {
		this.setState({ isLoadDone: false });
		if (inputWebhookSubcription !== undefined && key != undefined) {
			this.sendGmailSettingsEditDto = inputWebhookSubcription;
			this.setState({ title: this.sendGmailSettingsEditDto[key].title, context: this.sendGmailSettingsEditDto[key].context, key: key })
		}

	}
	onSaveAutoSendEmailSetting = () => {
		if (this.state.key != "") {
			this.sendGmailSettingsEditDto[this.state.key].title = this.state.title;
			this.sendGmailSettingsEditDto[this.state.key].context = this.state.context;
		}
		if (!!this.props.onSaveEmailSetting) {
			this.props.onSaveEmailSetting(this.sendGmailSettingsEditDto, this.props.general_setting);
		}
		message.success(L("cap_nhat_thanh_cong"));
		this.setState({ visible_article: false });
	}
	handleInsert = (string: string) => {
		const editor = this.editorRef.current.editor;
		const nameToInsert = '{{' + string + '}}';
		if (editor) {
			const position = editor.model.document.selection.getFirstPosition();
			editor.model.change(writer => {
				writer.insertText(nameToInsert, position);
			});
		}
	}
	handleEditorChange = (event, editor) => {
		const data = editor.getData();
		this.setState({ context: data });
	};
	render() {
		const { auto_email_setting } = this.props;
		return (
			<Card>
				<Row gutter={16}>
					<Tabs
						onChange={(value) => {
							this.initData(this.props.auto_email_setting, value)
						}}
						defaultActiveKey="birthday"
						tabPosition={'top'}
						style={{ height: '100%' }}
					>
						{Object.entries(auto_email_setting).map(([key, value]) =>
							<TabPane tab={L(`${key}`)} key={key}>
								<Row style={{ display: 'block' }}>
									<hr style={{ marginTop: "20px", marginBottom: '10px' }}></hr>
									<Row >
										<h2>{L('Title')}</h2>
										<Input value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })}></Input>
									</Row>
									<Row style={{ display: 'flex' }} className='custom_ckeditor'>
										<Col span={24}>
											<h2>{L('Context')}</h2>
										</Col>
										<Col span={20}>
											<CKEditor
												editor={ClassicEditor}
												data={this.state.context}
												onChange={this.handleEditorChange}
												ref={this.editorRef}
											/>
										</Col>
										<Col span={4} style={{ paddingLeft: '20px' }}>
											<Row style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
												<h3>{L("chon_truong")}</h3>
											</Row>
											<Row style={{ marginBottom: '20px' }}>
												<Button title={L('Name')} style={{ width: '100%' }} type='primary' onClick={() => this.handleInsert('name')}>{L("Name")}</Button>
											</Row>
											<Row>
												<Button title={L('Date')} style={{ width: '100%' }} type='primary' onClick={() => this.handleInsert('date')}>{L("Date")}</Button>
											</Row>
										</Col>
									</Row>

									<hr style={{ marginTop: "20px" }}></hr>
									<Button icon={<SaveOutlined />} title={L('luu_cai_dat')} type='primary' onClick={this.onSaveAutoSendEmailSetting}> {L("luu_cai_dat")} </Button>
								</Row>
							</TabPane>
						)}
					</Tabs>
				</Row>
			</Card >
		);
	}
}