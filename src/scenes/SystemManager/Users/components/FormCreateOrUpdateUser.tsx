import * as React from 'react';

import { Checkbox, Input, Tabs, Form, Card, Button, message, Col, Row, Select } from 'antd';
import { L } from '@lib/abpUtility';
import { CreateUserDto, ItemUser, RoleDto, UpdateUserInput, UserDto } from '@services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import moment from 'moment';
import AppConsts from '@src/lib/appconst';
import CheckboxGroup, { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { eDefaultRole, eUserType } from '@src/lib/enumconst';
import rules from '@src/scenes/Validation';

const TabPane = Tabs.TabPane;

export interface IProps {
	onCancel: () => void;
	onCreateOrUpdatedSuccess: () => void;
	userSelected: UserDto;
}
export default class FormCreateOrUpdateUser extends React.Component<IProps> {

	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
		confirmDirty: false,
		userId: -1,
		isActive: true,
		usIdSelected: undefined
	};
	userSelected: UserDto;
	optionsRoles: string[] = [];
	async componentDidMount() {
		await this.initData(this.props.userSelected);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.userSelected.id !== prevState.userId) {
			return ({ userId: nextProps.userSelected.id });
		}
		return null;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.userId !== prevState.userId) {
			await this.initData(this.props.userSelected);
		}
	}

	initData = async (userInput: UserDto | undefined) => {
		this.setState({ isLoadDone: false });
		await stores.userStore.getRoles();
		const { roles } = stores.userStore;
		if (userInput != undefined) {
			this.userSelected = userInput!;
		} else {
			this.userSelected = new UserDto();
		}
		let roleDefault: string[] = [];
		this.optionsRoles = [];
		if (roles != undefined && roles.length > 0) {
			roles.map((x: RoleDto) => {
				if (x.isDefault == true && x.typeUserRole != eDefaultRole.MEMBER.num) {
					roleDefault.push(x.normalizedName!);
				}
				this.optionsRoles.push(x.normalizedName!);
			});
		}

		if (this.userSelected.id == undefined) {
			this.userSelected.roleNames = roleDefault;
		}
		this.formRef.current.setFieldsValue({ ...this.userSelected, });
		this.setState({ isLoadDone: true });
	}

	compareToFirstPassword = (rule: any, value: any, callback: any) => {
		const form = this.formRef.current;
		if (value && value !== form!.getFieldValue('password')) {
			return Promise.reject('mat_khau_khong_trung_nhau');
		}
		return Promise.resolve();
	};

	validateToNextPassword = (rule: any, value: any, callback: any) => {
		const { validateFields, getFieldValue } = this.formRef.current!;
		this.setState({
			confirmDirty: true,
		});

		if (value && this.state.confirmDirty && getFieldValue('confirm')) {
			validateFields(['confirm']);
		}
		return Promise.resolve();
	};

	onCancel = () => {
		if (this.props.onCancel != undefined) {
			this.props.onCancel();
		}
	}

	onCreateUpdate = () => {
		const form = this.formRef.current;
		form!.validateFields().then(async (values: any) => {
			let roleNames = values.roleNames;
			if (roleNames === undefined) {
				roleNames = [];
			}
			if (this.state.userId === undefined || this.state.userId < 0) {
				let createData = new CreateUserDto(values);
				createData.roleNames = roleNames;
				createData.isActive = this.state.isActive;
				await stores.userStore.create(createData);
				message.success(L("them_moi_thanh_cong"))
			} else {
				let updateData = new UpdateUserInput({ id: this.state.userId, ...values });
				updateData.roleNames = roleNames;
				updateData.isActive = this.state.isActive;
				await stores.userStore.updateUser(updateData);
				message.success(L("chinh_sua_thanh_cong"));
			}

			if (this.props.onCreateOrUpdatedSuccess !== undefined) {
				await this.props.onCreateOrUpdatedSuccess();
			}
			this.setState({ isLoadDone: true });
		});
	}


	render() {

		const { userSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{this.state.userId === undefined ? L("them_nguoi_dung") : L('chinh_sua_nguoi_dung') + ": " + userSelected.fullName}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button title={L('huy')} danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
						<Button title={L('luu')} type="primary" onClick={() => this.onCreateUpdate()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("luu")}
						</Button>
					</Col>
				</Row>
				<Form ref={this.formRef} style={{ width: "100%" }}>

					<Tabs defaultActiveKey={'userInfo'} size={'small'} tabBarGutter={64}>
						<TabPane tab={L('nguoi_dung')} key={'userInfo'}>
							<Form.Item label={L('ten')} {...AppConsts.formItemLayout} name={'name'} rules={[rules.required, rules.onlyLetter]} >
								<Input placeholder={L('ten')} maxLength={AppConsts.maxLength.name} />
							</Form.Item>
							<Form.Item label={L('ho')} {...AppConsts.formItemLayout} name={'surname'} rules={[rules.required, rules.onlyLetter]}>
								<Input placeholder={L('ho')} maxLength={AppConsts.maxLength.name} />
							</Form.Item>
							<Form.Item label={L('ten_dang_nhap')} {...AppConsts.formItemLayout} name={'userName'} rules={[rules.required, rules.userName]}>
								<Input placeholder={L('ten_dang_nhap')} maxLength={AppConsts.maxLength.name} />
							</Form.Item>
							<Form.Item label={L('email')} {...AppConsts.formItemLayout} name={'emailAddress'} rules={[rules.required, rules.emailAddress]}>
								<Input placeholder={L('email')} maxLength={AppConsts.maxLength.email} />
							</Form.Item>
							{this.state.userId === undefined ? (
								<Form.Item
									label={L('Password')}
									{...AppConsts.formItemLayout}
									name={'password'}
									rules={[rules.required, rules.password]}

								>
									<Input.Password type="password" />
								</Form.Item>
							) : null}
							{this.state.userId === undefined ? (
								<Form.Item
									label={L('ConfirmPassword')}
									{...AppConsts.formItemLayout}
									rules={[rules.required, rules.password]}
									name={'confirm'}
								>
									<Input.Password type="password" />
								</Form.Item>
							) : null}
							<Form.Item label={L('kich_hoat')} {...AppConsts.formItemLayout} name={'isActive'} valuePropName='checked'>
								<Checkbox onChange={(e) => this.setState({ isActive: e.target.checked })} ></Checkbox>
							</Form.Item>
						</TabPane>
						<TabPane tab={L('vai_tro')} key={'rol'}>
							<Form.Item name={'roleNames'}>
								<CheckboxGroup
									options={this.optionsRoles}
								/>
							</Form.Item>

						</TabPane>
					</Tabs>
				</Form>
			</Card >
		);
	}
}

