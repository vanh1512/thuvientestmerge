import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, Select, message, TreeSelect } from 'antd';
import { L } from '@lib/abpUtility';
import { ReponsitoryDto, CreateReponsitoryInput, UpdateReponsitoryInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import { TreeReponsitoryDto } from '@src/stores/reponsitoryStore';
import { eRepositoryType } from '@src/lib/enumconst';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';
import SelectEnum from '@src/components/Manager/SelectEnum';

const { Option } = Select;
export interface IProps {
	onCreateUpdateSuccess?: (member: ReponsitoryDto) => void;
	onCancel: () => void;
	repositorySelected: ReponsitoryDto;
	treeReponsitory: TreeReponsitoryDto[];
}

export default class CreateOrUpdateReponsitory extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		re_id: -1,
		re_id_parent: -1,
	}
	repositorySelected: ReponsitoryDto = new ReponsitoryDto;
	treeRepositorySelected: TreeReponsitoryDto[] = [];

	async componentDidMount() {
		this.initData(this.props.repositorySelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.repositorySelected.re_id !== prevState.re_id || nextProps.repositorySelected.re_id_parent !== prevState.re_id_parent) {
			return ({ re_id: nextProps.repositorySelected.re_id, re_id_parent: nextProps.repositorySelected.re_id_parent });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.re_id !== prevState.re_id || this.state.re_id_parent !== prevState.re_id_parent) {
			this.initData(this.props.repositorySelected);
		}
	}

	initData = async (repository: ReponsitoryDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (repository != undefined) {
			this.repositorySelected = repository;
		} else {
			this.repositorySelected = new ReponsitoryDto();
		}
		if (this.repositorySelected.re_desc == null) {
			this.repositorySelected.re_desc = "";
		}
		this.formRef.current!.setFieldsValue({
			... this.repositorySelected,
		});

		this.setState({ isLoadDone: true });

	}

	onCreateUpdate = () => {
		const { repositorySelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (repositorySelected.re_id === undefined || repositorySelected.re_id < 0) {
				let unitData = new CreateReponsitoryInput(values);
				await stores.reponsitoryStore.createReponsitory(unitData);
				message.success(L("them_moi_thanh_cong"));
			} else {
				let unitData = new UpdateReponsitoryInput({ re_id: repositorySelected.re_id, ...values });
				if (repositorySelected.re_id == unitData.re_id_parent || this.checkRelation(repositorySelected.re_id, unitData.re_id)) {
					message.error(L("khong_the_them_vao"));
					return;
				}
				await stores.reponsitoryStore.updateReponsitory(unitData);
				message.success(L("chinh_sua_thanh_cong"));
			}
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
			this.props.onCreateUpdateSuccess(this.repositorySelected);
		}

	}

	checkRelation = (id_parent, id_child) => {
		const { reponsitoryListResult } = stores.reponsitoryStore;
		const rep_child = reponsitoryListResult.find(x => x.re_id == id_child);
		if (rep_child == undefined) {
			return false;
		}
		if (rep_child.re_id_parent == id_parent) {
			return true;
		}
		if (rep_child.re_id_parent == -1) {
			return false;
		} else {
			const rep_parent = reponsitoryListResult.find(x => x.re_id == rep_child.re_id_parent);
			if (rep_parent === undefined) {
				return false;
			}
			this.checkRelation(id_parent, rep_parent.re_id);
		}
	}

	render() {
		const self = this;
		const { repositorySelected, treeReponsitory } = this.props;
		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.re_id === undefined ? L("them_moi_kho") : L('chinh_sua_kho') + " " + repositorySelected.re_name}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L("huy")} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L("luu")} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef}>
						<Form.Item label={L('ma_kho')} {...AppConsts.formItemLayout} rules={[rules.required, rules.noSpaces]} name={'re_code'}  >
							<Input placeholder={L("ma_kho") + "..."} maxLength={AppConsts.maxLength.code} />
						</Form.Item>
						<Form.Item label={L('ten_kho')} {...AppConsts.formItemLayout} rules={[rules.required, rules.chucai_so_kytudacbiet]} name={'re_name'}>
							<Input placeholder={L("ten_kho") + "..."} maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={L('them_vao_kho')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'re_id_parent'}  >
							<TreeSelect
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
								treeData={treeReponsitory}
								treeDefaultExpandAll
								onSelect={(value, node) => {
									self.setState({ re_id_parent: node.re_id });
								}}
							/>
						</Form.Item>
						<Form.Item label={L('loai_kho')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'re_type'}  >
							{/* <Select
								style={{ width: "100%" }}
							>
								{Object.values(eRepositoryType).map(item =>
									<Option key={"key_us_id_updated" + item.num} value={item.num}>{item.name}</Option>
								)}
							</Select> */}
							<SelectEnum eNum={eRepositoryType} enum_value={repositorySelected.re_type} onChangeEnum={async (value: number) => { await this.formRef.current!.setFieldsValue({ re_type: value }) }} />
						</Form.Item>
						<Form.Item label={L('mo_ta')} {...AppConsts.formItemLayout} name={'re_desc'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor placeholder={L("mo_ta") + "..."} editor={ClassicEditor} />
						</Form.Item>

					</Form>
				</Row>
			</Card >
		)
	}
}