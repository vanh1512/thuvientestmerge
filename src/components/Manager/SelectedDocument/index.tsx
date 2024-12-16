import * as React from 'react';
import { Divider, Modal, Select, } from 'antd';
import { stores } from '@src/stores/storeInitializer';
import { DocumentDto, ItemDocument } from '@src/services/services_autogen';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { SettingOutlined } from '@ant-design/icons';
import Document from '@src/scenes/Manager/Document';
import { L } from '@src/lib/abpUtility';
import AppConsts from '@src/lib/appconst';
const { Option } = Select;
export interface IProps {
	onChangeDocument?: (item: ItemDocument) => void;
	document?: ItemDocument;
	documentID?: number;
}

export default class SelectedDocument extends AppComponentBase<IProps> {
	state = {
		isLoading: false,
		document_selected: undefined,
		visibleModalDocument: false,
	};

	async componentDidMount() {
		await this.setState({ isLoading: true });
		if (this.props.documentID || this.props.document != undefined) {
			this.setState({ document_selected: this.props.documentID || this.props.document!.id });
		}
		await this.setState({ isLoading: false });
	}


	componentDidUpdate(prevProps) {
		if (this.props.document !== prevProps.document) {
			this.setState({ document_selected: this.props.document?.id });
		}
		if (this.props.documentID !== prevProps.documentID) {
			this.setState({ document_selected: this.props.documentID });
		}
	}

	onChangeDocumentSelected = async (do_id: number) => {
		const { documentListResult } = stores.documentStore;
		await this.setState({ document_selected: do_id });

		if (documentListResult.length > 0) {
			let documentDto: DocumentDto | undefined = documentListResult.find((item) => item.do_id == do_id);
			let itemData = new ItemDocument();
			if (documentDto != undefined) {
				itemData.id = documentDto.do_id;
				itemData.name = documentDto.do_title;
			}
			if (!!this.props.onChangeDocument) {
				this.props.onChangeDocument(itemData);
			}
		}
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
	handleFilter = (inputValue, option) => {
		const normalizedInput = AppConsts.boDauTiengViet1(inputValue.toLowerCase());
		const normalizedOptionLabel = AppConsts.boDauTiengViet1(option.children.toLowerCase());
		return normalizedOptionLabel.indexOf(normalizedInput) >= 0;
	};
	render() {
		const { documentListResult } = stores.documentStore;

		return (
			<>
				<Select style={{ width: "100%" }}
					onSearch={async (e) => {
						await this.setState({ su_search: e });
					}}
					showSearch
					onChange={(value: number) => this.onChangeDocumentSelected(value)}
					value={this.state.document_selected}
					allowClear={true}
					placeholder={L("Document") + '...'}
					loading={this.state.isLoading}
					filterOption={this.handleFilter}
					dropdownRender={menu => (<div>
						{menu}
					</div>
					)}
				>
					{documentListResult.map(item => (
						<Option key={"key_su_" + item.do_id} value={item.do_id!}>{item.do_title}</Option>
					))}
				</Select>
				<Modal
					visible={this.state.visibleModalDocument}
					title={L('AddNewDocmentList')}
					onCancel={() => { this.setState({ visibleModalDocument: false }) }}
					width='90vw'
					maskClosable={false}
					closable={false}
				>
					<Document is_Selected={false}
					// onChooseDocument={(listItem: DocumentDto [])}
					/>
				</Modal>
			</>
		);
	}

}

