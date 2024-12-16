import * as React from 'react';
import { Col, Row, Button, Table, Card, Modal, Form, Input, Checkbox, Select } from 'antd';
import { L } from '@lib/abpUtility';
import { BorrowReturningLogDto } from '@services/services_autogen';
import { CloseOutlined } from '@ant-design/icons';

export interface IProps {
	onCancel: () => void;
	borrowReLoSelected: BorrowReturningLogDto;
}

const { Option } = Select;

export default class DetailBorrowReturningLog extends React.Component<IProps>{
	private formRef: any = React.createRef();

	state = {
		isLoadDone: false,
	}

	onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}

	render() {
		const { borrowReLoSelected } = this.props;

		return (
			<Card >
				<Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{L("thong_tin_chi_tiet_lich_su")}: {borrowReLoSelected.br_re_lo_desc}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger icon= {<CloseOutlined />} type="link" onClick={() => this.onCancel()}>
						</Button>
					</Col>
				</Row>
				<Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
					{/* Giang làm form thông tin chi tiết giúp anh */}
				</Row>
			</Card >
		)
	}
}