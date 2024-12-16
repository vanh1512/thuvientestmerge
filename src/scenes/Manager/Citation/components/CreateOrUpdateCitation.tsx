import * as React from 'react';
import { Col, Row, Button, Card, Form, message } from 'antd';
import { L } from '@lib/abpUtility';
import { CitationDto, CreateOrUpdateCitationInput, DocumentDto, ItemDocument } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import rules from '@src/scenes/Validation';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { eCitationStructure, eCitationType } from '@src/lib/enumconst';

export interface IProps {
	onCreateUpdateSuccess?: (citation: CitationDto) => void;
	onCancel?: () => void;
	citationSelected: CitationDto;
	documentSelected?: DocumentDto;

}

export default class CreateOrUpdateCitation extends React.Component<IProps>{
	private formRef: any = React.createRef();
	state = {
		isLoadDone: false,
		isLoadFile: false,
		ci_id_selected: -1,
		ci_type: undefined,
		ci_structure: undefined,
	}
	itemDocument: ItemDocument = new ItemDocument();



	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.citationSelected != undefined && nextProps.citationSelected.ci_id !== prevState.ci_id_selected) {
			return ({ ci_id_selected: nextProps.citationSelected.ci_id });
		}
		return null;
	}
	componentDidMount() {
		this.initData(this.props.citationSelected);
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.ci_id_selected !== prevState.ci_id_selected) {
			this.initData(this.props.citationSelected);
		}
	}


	initData = async (citation: CitationDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (citation == undefined) {
			citation = new CitationDto();
		}
		this.itemDocument = citation!.itemDocument;
		this.setState({ ci_type: citation.ci_type })
		this.setState({ ci_structure: citation.ci_structure })
		await this.formRef.current!.setFieldsValue({ ...citation });
		await this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { citationSelected, documentSelected } = this.props;
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			this.setState({ isLoadDone: false });
			let unitData = new CreateOrUpdateCitationInput(values);
			let itemDocument = new ItemDocument();
			if(documentSelected!= undefined)
			{
				itemDocument.id = documentSelected?.do_id!;
				itemDocument.name = documentSelected?.do_title;
			}
			else{
				itemDocument.id = citationSelected?.itemDocument.id!;
				itemDocument.name = citationSelected?.itemDocument.name;
			}
			unitData.itemDocument = itemDocument;
			unitData.ci_type = this.state.ci_type!;
			unitData.ci_structure = this.state.ci_structure!;	
			await stores.citationStore.createOrUpdateCitation(unitData);
			message.success(L("SuccessfullyEdited"));
			await this.onCreateUpdateSuccess();
			this.setState({ isLoadDone: true });
		})
	};
	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
	onCreateUpdateSuccess = () => {
		if (!!this.props.onCreateUpdateSuccess) {
			this.props.onCreateUpdateSuccess(this.props.citationSelected!);
		}

	}


	render() {
		const self = this;
		const { citationSelected, documentSelected } = this.props;
		return (

			<Card >
				<Row style={{ marginTop: 10 }}>
					<Col span={12}><h3>{this.state.ci_id_selected === undefined ? L('them_moi_trich_dan') : L('chinh_sua_trich_dan') + ": "}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Cancel')}
						</Button>
						<Button type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L('Save')}
						</Button>
					</Col>
				</Row>

				<Row style={{ marginTop: 10 }}>
					<Form ref={this.formRef} style={{ width: "100%" }}>
						<Form.Item label={L('ten_tai_lieu')} {...AppConsts.formItemLayout} name={'itemDocument'}>
							{documentSelected!= undefined ?  <b>{documentSelected.do_title }</b>: <b>{citationSelected.itemDocument.name}</b>}
						</Form.Item>
						<Form.Item label={L("kieu_trich_dan")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'ci_type'}>
							<SelectEnum eNum={eCitationType} enum_value={citationSelected.ci_type} onChangeEnum={async (value: number) => { await this.formRef.current!.setFieldsValue({ ci_type: value });await this.setState({ ci_type: value }) }} />
						</Form.Item>
						<Form.Item label={L("cau_truc_trich_dan")} {...AppConsts.formItemLayout} rules={[rules.required]} name={'ci_structure'}>
							<SelectEnum eNum={eCitationStructure} enum_value={citationSelected.ci_structure} onChangeEnum={async (value: number) => { await this.formRef.current!.setFieldsValue({ ci_structure: value });await this.setState({ ci_structure: value }) }} />
						</Form.Item>

					</Form>
				</Row>
			</Card >
		)
	}
}