import * as React from 'react';
import { Button, Col, DatePicker, Input, Row, Select, Table,} from 'antd';
import { DeleteFilled, EditOutlined, EyeOutlined, MinusCircleOutlined, PlusCircleOutlined,} from '@ant-design/icons';
import { CreateBorrowReturningInput, DocumentDto,} from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import { TablePaginationConfig } from 'antd/lib/table';
import moment from 'moment';
import { eBorrowMethod } from '@src/lib/enumconst';

const { TextArea } = Input;
const { Option } = Select;

export interface IProps {
	onCancel: () => void;
	onAddDoc2RegisterBorrow?: (docbr: CreateBorrowReturningInput) => void;
	doccumentSelected: DocumentDto;
	me_id_borrow?: number;
}
export default class MemberRegisterBorrowDocumentModal extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		br_re_start_at: new Date(),
		br_re_end_at: new Date(),
		br_re_desc: undefined,
		br_re_method: eBorrowMethod.OFFLINE.num,
	};
	
	onAddDoc2RegisterBorrow = () => {
		if (!!this.props.onAddDoc2RegisterBorrow) {
			let input: CreateBorrowReturningInput = new CreateBorrowReturningInput();
			// input.do_id = this.props.doccumentSelected.do_id;
			// // input.br_re_code = this.props.doccumentSelected.b;
			// input.br_re_start_at = this.state.br_re_start_at;
			// input.br_re_end_at = this.state.br_re_end_at;
			// input.br_re_desc = this.state.br_re_desc;
			// input.br_re_method = this.state.br_re_method;
			// if(!!this.props.me_id_borrow){
			// 	input.me_id_borrow = this.props.me_id_borrow;
			// }else{
			// 	input.me_id_borrow = abp.session.userId;
			// }
			this.props.onAddDoc2RegisterBorrow(input);
		}
	}
	
	onChangeDatePickerStart = (date) => {
		if (!date) {
			this.setState({ br_re_start_at: undefined });
		} else {
			let start_from = new Date(date);
			this.setState({ br_re_start_at: start_from });
		}
	}

	onChangeDatePickerEnd = (date) => {
		if (!date) {
			this.setState({ br_re_end_at: undefined });
		} else {
			let end_at = new Date(date);
			this.setState({ br_re_end_at: end_at });
		}
	}
	

	render() {
		
		const dateFormat = 'DD/MM/YYYY';
		return (
			<>
				<Row style={{gap: 10}}>
					<Col span={3} style={{ fontSize: '16px' }}>
						<strong>{L('BorrowDate')}:</strong><br/>
					</Col>
					<Col span={8}>
						<DatePicker
							style={{ width: "100%" }}
							onChange={(date: any, dateString: any) => this.onChangeDatePickerStart(date)}
							defaultValue={moment(this.state.br_re_start_at, dateFormat)} 
							format={dateFormat}
							placeholder={L("Select")}
						/>				
					</Col>
					<Col span={3} style={{ fontSize: '16px' }}>
						<strong>{L('ReturningDate')}:</strong><br/>
					</Col>
					<Col span={8}>
						<DatePicker
							style={{ width: "100%" }}
							onChange={(date: any, dateString: any) => this.onChangeDatePickerEnd(date)}
							defaultValue={moment(this.state.br_re_end_at, dateFormat)} 
							format={dateFormat}
							placeholder={L("Select")}
						/>			
					</Col>
				</Row>
				<Row style={{marginTop: 10, gap: 10}}>
					<Col span={3} style={{ fontSize: '16px' }}>
						<strong>{L('BorrowingMethod')}:</strong><br/>
					</Col>
					<Col span={8}>
						<Select
							style={{ width: "100%" }}
							allowClear={true}
							onChange={(e) => this.setState({ br_re_method: e })}
							defaultValue={this.state.br_re_method}
						>
							{Object.values(eBorrowMethod).map(item =>
								<Option key={"key_methodrg_" + item.num} value={item.num}>{item.name}</Option>
							)}
						</Select>
					</Col>
					<Col span={3} style={{ fontSize: '16px' }}>
						<strong>{L('Describe')}:</strong><br/>
					</Col>
					<Col span={8}>
						<TextArea 
							onChange={(e) => this.setState({br_re_desc : e.target.value})}
							rows={3} 
						/>
					</Col>
				
				</Row>
				<Row style={{marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '15px', justifyContent: 'right'}}>
					<Button
						danger title={L("Cancel")}
						style={{ marginLeft: '10px' }}
						onClick={() => this.props.onCancel()}
					>{L("Cancel")}</Button>
					<Button
						type="primary" title={L("Register")}
						style={{ marginLeft: '10px' }}
						onClick={() => this.onAddDoc2RegisterBorrow()}
					>{L("AddToSubscriptionList")}</Button>
				</Row>
			</>
		)
	}
}