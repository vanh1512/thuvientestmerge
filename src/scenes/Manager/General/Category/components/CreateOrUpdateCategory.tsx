import * as React from 'react';
import { Col, Row, Button, Card, Form, Input, message, TreeSelect, InputNumber, Checkbox } from 'antd';
import { L } from '@lib/abpUtility';
import { CategoryDto, CreateCategoryInput, UpdateCategoryInput } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import AppConsts from '@src/lib/appconst';
import { TreeCategoryDto } from '@src/stores/categoryStore';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import rules from '@src/scenes/Validation';

export interface IProps {
	onCreateUpdateSuccess?: (borrowReDto: CategoryDto) => void;
	onCancel: () => void;
	categorySelected: CategoryDto;
	treeCategory: TreeCategoryDto[];

}

export default class CreateOrUpdateCategory extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		ca_id: -1,
		ca_id_parent: -1,
		ca_enable: false,
	}
	categorySelected: CategoryDto = new CategoryDto();
	async componentDidMount() {

		this.initData(this.props.categorySelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.categorySelected.ca_id !== prevState.ca_id || nextProps.categorySelected.ca_id_parent !== prevState.ca_id_parent) {
			return ({ ca_id: nextProps.categorySelected.ca_id, ca_id_parent: nextProps.categorySelected.ca_id_parent });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.ca_id !== prevState.ca_id || this.state.ca_id_parent !== prevState.ca_id_parent) {
			this.initData(this.props.categorySelected);
		}
	}


	initData = async (inputCategory: CategoryDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (inputCategory != undefined) {
			this.categorySelected = inputCategory;
			this.setState({ ca_enable: this.categorySelected.ca_enable });
		}
		if (this.categorySelected.ca_abstract == null) {
			this.categorySelected.ca_abstract = "";
		}
		this.formRef.current!.setFieldsValue({
			... this.categorySelected,
		});
		this.setState({ isLoadDone: true });
	}

	onCreateUpdate = () => {
		const { categorySelected } = this.props;

		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {

			if (categorySelected.ca_id === undefined) {
				let unitData = new CreateCategoryInput({ ...values });
				await stores.categoryStore.createCategory(unitData);
				message.success(L("them_moi_thanh_cong"));

			} else {
				let unitData = new UpdateCategoryInput({ ca_id: categorySelected.ca_id, ...values });
				unitData.ca_enable = this.state.ca_enable;
				if (this.categorySelected.dkcb_start != this.categorySelected.dkcb_current) {
					unitData.dkcb_start = this.categorySelected.dkcb_start;
					unitData.dkcb_code = this.categorySelected.dkcb_code;
				}
				if (categorySelected.ca_id == unitData.ca_id_parent || this.checkRelation(categorySelected.ca_id, unitData.ca_id)) {
					message.error(L("khong_the_them_vao"));
					return;
				}
				await stores.categoryStore.updateCategory(unitData);
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
			this.props.onCreateUpdateSuccess(this.categorySelected);
		}
	}

	checkRelation = (ca_id_parent, ca_id_child) => {
		const { categoryListResult } = stores.categoryStore;
		const cate_child = categoryListResult.find(x => x.ca_id == ca_id_child);
		if (cate_child == undefined) {
			return false;
		}
		if (cate_child.ca_id_parent == ca_id_parent) {
			return true;
		}
		if (cate_child.ca_id_parent == -1) {
			return false;
		} else {
			const cate_parent = categoryListResult.find(x => x.ca_id == cate_child.ca_id_parent);
			if (cate_parent === undefined) {
				return false;
			}
			this.checkRelation(ca_id_parent, cate_parent.ca_id);
		}
	}

	render() {
		const self = this;
		const { categorySelected, treeCategory } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={16}><h3>{this.state.ca_id === undefined ? L("them_moi_danh_muc") : L('chinh_sua_danh_muc') + ": " + categorySelected.ca_title}</h3></Col>
					<Col span={8} style={{ textAlign: 'right' }}>
						<Button danger title={L('huy')} onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button type="primary" title={L('luu')} onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					<Form ref={this.formRef}>
						{categorySelected.dkcb_start == categorySelected.dkcb_current &&
							<Form.Item label={L('so/ma_dang_ky_ca_biet')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'dkcb_code'}>
								<Input placeholder={L("so/ma_dang_ky_ca_biet") + "..."} maxLength={AppConsts.maxLength.code} />
							</Form.Item>
						}
						<Form.Item label={L('ten_danh_muc')} {...AppConsts.formItemLayout} rules={[rules.required, rules.chucai_so_kytudacbiet]} name={'ca_title'}  >
							<Input placeholder={L("ten_danh_muc") + "..."} maxLength={AppConsts.maxLength.name} />
						</Form.Item>
						<Form.Item label={L('them_vao_danh_muc')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'ca_id_parent'}>
							<TreeSelect
								style={{ width: '100%' }}
								dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
								treeData={treeCategory}
								treeDefaultExpandAll
								onSelect={(value, node) => {
									self.setState({ ca_id_parent: node.ca_id });
								}}
							/>
						</Form.Item>
						{categorySelected.dkcb_start != categorySelected.dkcb_current &&
							<Row justify='center'>
								<Col span={3}></Col>
								<Col span={9}><label style={{ margin: '0 0 0 5px' }} htmlFor="">{L("ma_dang_ky_ca_biet")}: <b>{this.categorySelected.dkcb_code}</b></label></Col>
								<Col span={6}>
									<label htmlFor="">{L("so_dang_ky_ca_biet_bat_dau")}: <b>{this.categorySelected.dkcb_start}</b></label>
								</Col>
								<Col span={6}>
									<label htmlFor="">{L("so_dang_ky_ca_biet_hien_tai")}: <b>{this.categorySelected.dkcb_current}</b></label>

								</Col>
							</Row>
						}
						{categorySelected.dkcb_start == categorySelected.dkcb_current &&
							<Form.Item label={L('so_bat_dau')} {...AppConsts.formItemLayout} rules={[rules.required]} name={'dkcb_start'}>
								<InputNumber min={0} formatter={a => AppConsts.numberWithCommas(a)}
									placeholder={L("so_bat_dau") + "..."}
									parser={a => a!.replace(/\$s?|(,*)/g, '')} />
							</Form.Item>
						}
						<Form.Item label={L('mo_ta')} {...AppConsts.formItemLayout} name={'ca_abstract'} valuePropName='data'
							getValueFromEvent={(event, editor) => {
								const data = editor.getData();
								return data;
							}}>
							<CKEditor
								placeholder={L("mo_ta") + "..."}
								editor={ClassicEditor} />
						</Form.Item>
						<Form.Item label={L('kich_hoat')} {...AppConsts.formItemLayout} name={'ca_enable'}>
							<Checkbox checked={this.state.ca_enable} onChange={() => this.setState({ ca_enable: !this.state.ca_enable })}></Checkbox>
						</Form.Item>
					</Form>
				</Row>
			</Card >
		)
	}
}