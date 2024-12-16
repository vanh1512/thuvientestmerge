import * as React from 'react';
import { Input, Modal, Tabs, Form, Checkbox, Card, Button, Col, message, Row, Divider, Spin, Radio, Popover } from 'antd';
import { L } from '@lib/abpUtility';
import RoleStore from '@stores/roleStore';
import { FormInstance } from 'antd/lib/form';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import AppConsts from '@lib/appconst';
import { stores } from '@stores/storeInitializer';
import { CreateRoleInput, GetRoleForEditOutput, PermissionDto, RoleDto } from '@src/services/services_autogen';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SearchOutlined } from '@ant-design/icons';
import { eDefaultRole, eUserType } from '@src/lib/enumconst';
import rules from '@src/scenes/Validation';

const TabPane = Tabs.TabPane;

export class ItemPermis {
	label: string;
	value: string;
}

export interface IProps {
	onCancel: () => void;
	onCreateOrUpdatedSuccess: () => void;
	roleSelected: RoleDto;
}

export default class FormCreateOrUpdateRole extends React.Component<IProps> {
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		roleId: -1,
		defaultvalue: [] = [],
		isDefault: false,
		typeUserRole: -1,
		role_search: "",
		checkAll: false,
		indeterminate: false,
	};
	roleSelected: RoleDto;
	dicDisplayAllPermission: { [key: string]: ItemPermis[]; } = {};
	dicPermissionChecked: { [key: string]: string[]; } = {};
	option: any;

	async componentDidMount() {
		await this.initData(this.props.roleSelected);
	}
	getLengthAllPermisson = () => {
		let x = 0;
		Object.keys(this.dicDisplayAllPermission).map(key => {
			x += this.dicDisplayAllPermission[key].length;
		})
		return x;
	}
	getLengthCheckedPermission = () => {
		let y = 0;
		Object.keys(this.dicPermissionChecked).map(key => {
			y += this.dicPermissionChecked[key].length;
		})
		return y;
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.roleSelected.id !== prevState.roleId) {
			return ({ roleId: nextProps.roleSelected.id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.roleId !== prevState.roleId) {
			console.time("init")			
			await this.initData(this.props.roleSelected);
			console.timeEnd("init")
		}
		this.option = Object.entries(eDefaultRole).map(item => ({ label: L(`${item[1].name}`), value: item[1].num }))
	}

	initData = async (roleInput: RoleDto | undefined) => {
		this.setState({ isLoadDone: false });
		if (roleInput != undefined) {
			this.roleSelected = roleInput!;
		}
		else {
			this.roleSelected = new RoleDto();
		}
		if (this.roleSelected.id !== undefined) {
			if (this.roleSelected.description == null) {
				this.roleSelected.description = "";
			}
			this.formRef.current!.setFieldsValue({ ...this.roleSelected });
			await this.setState({ isDefault: this.roleSelected.isDefault });
			await this.setState({ typeUserRole: this.roleSelected.typeUserRole });
		}
		else {
			this.formRef.current!.resetFields();
		}
		await stores.roleStore.getAllPermissions();
		await stores.roleStore.getRoleForEdit(this.state.roleId);
		this.initDicDisplayAllPermission();
		this.initDicPermissionChecked();
		this.getCheckedAllPermission();
		this.checkBoxAll();
		await this.setState({ isLoadDone: true });
	}
	onCreateUpdate = () => {
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			let grantedPermissions: string[] = [];
			if (this.dicPermissionChecked != undefined) {
				for (let itemKey in this.dicPermissionChecked) {
					if (!!this.dicPermissionChecked[itemKey] && this.dicPermissionChecked[itemKey].length > 0) {
						for (let itemRes of this.dicPermissionChecked[itemKey]) {
							if (!grantedPermissions.includes(itemRes)) {
								grantedPermissions.push(itemRes);
							}
						}
					}
				}
			}
			if (this.state.roleId === undefined || this.state.roleId < 0) {
				let createData = new CreateRoleInput(values);
				createData.grantedPermissions = grantedPermissions;
				createData.isDefault = this.state.isDefault
				createData.typeUserRole = this.state.typeUserRole;
				await stores.roleStore.create(createData);
				message.success(L("them_moi_thanh_cong"))
			} else {
				let updateData = new RoleDto({ id: this.state.roleId, ...values });
				updateData.grantedPermissions = grantedPermissions;
				updateData.isDefault = this.state.isDefault
				updateData.typeUserRole = this.state.typeUserRole;
				await stores.roleStore.update(updateData);
				message.success(L("chinh_sua_thanh_cong"));
			}

			if (this.props.onCreateOrUpdatedSuccess !== undefined) {
				await this.props.onCreateOrUpdatedSuccess();
			}
		});
	}

	initDicDisplayAllPermission = () => {
		const { allPermissions } = stores.roleStore;
		for (const [itemKey, itemValue] of Object.entries(AppConsts.Granted_Permissions_Const)) {
			this.dicDisplayAllPermission[itemKey] = [];
			allPermissions.map((item: PermissionDto) => {
				if (item.name && item.name.includes(itemValue.name) && item.name !== AppConsts.Permission.System_Tenants) {
					let itemPer = new ItemPermis();
					itemPer.label = item.displayName!;
					itemPer.value = item.name!;
					this.dicDisplayAllPermission[itemKey].push(itemPer);
				}
			})
		}
	}
	initDicPermissionChecked = () => {
		const { roleEdit } = stores.roleStore;
		for (const [itemKey, itemValue] of Object.entries(AppConsts.Granted_Permissions_Const)) {
			this.dicPermissionChecked[itemKey] = [];
			if (roleEdit != undefined && roleEdit.grantedPermissionNames != undefined && roleEdit.grantedPermissionNames!.length > 0) {
				roleEdit.grantedPermissionNames!.map((item: string) => {
					if (item && item.includes(itemValue.name)) {
						this.dicPermissionChecked[itemKey].push(item);
					}
				})
			}
		}
	}
	getCheckedAllPermission = () => {
		const { roleEdit } = stores.roleStore;
		let defaultItem = this.state.defaultvalue;
		let data = roleEdit.grantedPermissionNames != undefined ? roleEdit.grantedPermissionNames : [];

		Object.keys(this.dicDisplayAllPermission).map(key => {
			let item = this.dicDisplayAllPermission[key];
			defaultItem[key] = [];
			item.map(itemValue => {
				if (data.includes(itemValue.value)) {
					defaultItem[key].push(itemValue.value);
				}
			});
		});

		this.setState({ isLoading: false, defaultvalue: defaultItem,})
	}

	onCancel = () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}
	checkBoxAll = async () => {
		const lengthCheckedPermission = await this.getLengthCheckedPermission();
		const lengthAllPermission = await this.getLengthAllPermisson();
		if (lengthAllPermission == lengthCheckedPermission) {
			this.setState({ checkAll: true, indeterminate: false });
		}
		if (lengthCheckedPermission < lengthAllPermission && lengthCheckedPermission > 0) {
			this.setState({ indeterminate: true, checkAll: false });
		}
		if (lengthCheckedPermission == 0) {
			this.setState({ indeterminate: false, checkAll: false });
		}
	}
	onCheckPermission = (arrPermission, key: string) => {
		let arrayString = arrPermission != undefined ? arrPermission : [];
		let default1 = this.state.defaultvalue;
		default1[key] = arrayString;
		this.setState({ defaultvalue: default1 })
		if (!this.dicPermissionChecked.hasOwnProperty(key)) {
			this.dicPermissionChecked[key] = [];
		}
		this.dicPermissionChecked[key] = arrayString;
		this.checkBoxAll();
	}
	onCheckAllPermission = (e: any, key: string, arr: ItemPermis[]) => {
		let isCheckAll = e.target.checked;
		let arrayString: string[] = [];
		arr.map(item => { arrayString.push(item.value); });
		this.onCheckPermission(isCheckAll ? arrayString : [], key);
	}
	checkFullPermission = async (e) => {
		if (!e.target.checked) {
			this.dicPermissionChecked = {};
			this.setState({ defaultvalue: [] });
		} else {
			Object.entries(this.dicDisplayAllPermission).map(([key, value]) => this.dicPermissionChecked[key] = value.map(item => item.value));
			const default1 = this.state.defaultvalue;
			Object.entries(this.dicPermissionChecked).map(([key, value]) => default1[key] = value);
			await this.setState({ defaultvalue: default1 });
		}
		this.checkBoxAll();
	}
	handleSubmitSearch = async () => {
		this.setState({ isLoadDone: false });
		if (this.state.role_search != "") {
			let searchPermis = {};
			Object.keys(this.dicDisplayAllPermission).forEach(permis => {
				searchPermis[permis] = this.dicDisplayAllPermission[permis].filter(item =>
					item.label.toLowerCase().includes(this.state.role_search!.toLowerCase())
				);
			});
			this.dicDisplayAllPermission = searchPermis;
		}
		else {
			this.initDicDisplayAllPermission();
		}
		this.setState({ isLoadDone: true });
	}
	renderCheckboxPermission = () => {
		let self = this;
		let content = (
			<>
				<Row gutter={16}>
					<Col span={5} >
						<h4>{L('Tìm kiếm')}</h4>
					</Col>
					<Col span={19} >
						<Input style={{ width: "50%", marginRight: '5px' }} allowClear
							onChange={(e) => this.setState({ role_search: e.target.value.trim() })} placeholder={L('nhap_tim_kiem')}
							onPressEnter={this.handleSubmitSearch}
						/>
						<Button type="primary" icon={<SearchOutlined />} title={L('tim_kiem')} onClick={() => this.handleSubmitSearch()} >{L('tim_kiem')}</Button>
					</Col>

				</Row>
				<Checkbox
					onChange={(e) => { this.checkFullPermission(e); }}
					checked={this.state.checkAll}
					indeterminate={this.state.indeterminate}
				>
					{L("ChooseAll")}
				</Checkbox>
				{Object.keys(this.dicDisplayAllPermission) != null && Object.keys(this.dicDisplayAllPermission).map(key => {
					return (
						<React.Fragment key={key}>
							{this.dicDisplayAllPermission[key].length > 0 &&
								<Row key={key + "_row"}>
									<Col span={8}>
										<Checkbox key={key + "_checkbox"}
											onChange={(e) => this.onCheckAllPermission(e, key, this.dicDisplayAllPermission[key])}
											checked={(!!self.state.defaultvalue[key] && self.state.defaultvalue[key].length != 0) && self.state.defaultvalue[key].length == this.dicDisplayAllPermission[key].length}
											indeterminate={(!!self.state.defaultvalue[key] && self.state.defaultvalue[key].length != 0) && self.state.defaultvalue[key].length < this.dicDisplayAllPermission[key].length}
										>
											&nbsp;&nbsp;
											{AppConsts.Granted_Permissions_Const[key].display_name}
										</Checkbox>
									</Col>
									<Col span={16}>
										<CheckboxGroup options={this.dicDisplayAllPermission[key]} onChange={(e) => this.onCheckPermission(e, key)} value={self.state.defaultvalue[key]} defaultValue={self.state.defaultvalue[key]} />
									</Col>
									<Divider />
								</Row>
							}
						</React.Fragment>

					)
				})}
			</>
		)
		return content;
	}
	render() {
		return (
			<Card>
				<Row justify='end'>
					<Col>
						<Button title={L('huy')} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L('luu')} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Form {...AppConsts.formItemLayoutResponsive([24, 24], [6, 18], [6, 18], [6, 18], [6, 18], [6, 18])} ref={this.formRef} name="control-ref">
					<Tabs defaultActiveKey={'role'} size={'small'} tabBarGutter={64}>
						<TabPane tab={L('thong_tin')} key={'role'}>
							<Form.Item label={L('ten_vai_tro')} name={'name'} rules={[rules.required, rules.userName]} >
								<Input placeholder={L('ten_vai_tro') + "..."} maxLength={AppConsts.maxLength.name} />
							</Form.Item>
							<Form.Item label={L('ten_hien_thi')} name={'displayName'} rules={[rules.required, rules.chucai_so]} >
								<Input placeholder={L('ten_hien_thi') + "..."} maxLength={AppConsts.maxLength.name} />
							</Form.Item>
							<Form.Item label={L('mo_ta')} name={'description'} valuePropName='data'
								getValueFromEvent={(event, editor) => {
									const data = editor.getData();
									return data;
								}}>
								<CKEditor editor={ClassicEditor} />
							</Form.Item>
							<Form.Item label={L('mac_dinh')} name={'isDefault'} >
								<Checkbox checked={this.state.isDefault} onChange={() => this.setState({ isDefault: !this.state.isDefault })}></Checkbox>
								{
									this.state.isDefault &&
									<>
										<span style={{ marginLeft: '5px' }}> {L("cho")} </span>
										<Radio.Group
											style={{ marginLeft: '5px' }}
											options={this.option}
											value={this.state.typeUserRole}
											onChange={(e) => this.setState({ typeUserRole: e.target.value })}
										></Radio.Group>
									</>


								}
							</Form.Item>
						</TabPane>
						<TabPane tab={L('phan_quyen_vai_tro')} key={'permission'} forceRender={true}>
							{this.renderCheckboxPermission()}
						</TabPane>
					</Tabs>
				</Form>
			</Card>
		);
	}
}
