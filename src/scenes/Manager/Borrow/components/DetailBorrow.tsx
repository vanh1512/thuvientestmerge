import * as React from 'react';
import { Row, Card, Col, Button } from 'antd';
import {  AuthorDto, BorrowReturningDto, DocumentBorrowDto, LanguagesDto } from '@services/services_autogen';
import { stores } from '@stores/storeInitializer';
import FileAttachments from '@src/components/FileAttachments';
import { valueOfeBorrowReturningStatus } from '@src/lib/enumconst';
import { L } from '@src/lib/abpUtility';
import DetailDocument from './DetailDocument';


export interface IProps {
    borrowReSelected: BorrowReturningDto;
    onCancel: () => void;
}

export default class DetailBorow extends React.Component<IProps>{
	
	state = {
		isLoadDone: true,
	};

    onCancel = () => {
		if (!!this.props.onCancel) {
			this.props.onCancel();
		}

	}
   
    
	render() {
		const self = this;
		const dateFormat = 'DD/MM/YYYY';
        const {borrowReSelected} = this.props;
		return (
			<Card>
                <Row style={{ marginTop: 10, display: "flex", flexDirection: "row" }}>
					<Col span={12}><h3>{L("xem_chi_tiet")}</h3></Col>
					<Col span={12} style={{ textAlign: 'right' }}>
						<Button danger onClick={() => this.onCancel()} style={{ marginLeft: '5px', marginTop: '5px' }}>
							{L("huy")}
						</Button>
					</Col>
				</Row>
                <Row style={{ marginTop: 10, display: "block", flexDirection: "row" }}>
                <Row className='dislplayBlock' style={{display: "block !important"}}>
						<h4>{L("thong_tin_muon")} :</h4>
						<Row>
							<Col span={8}>{L('ma')}:</Col>
							<Col span={16} >{borrowReSelected.br_re_code}</Col>
						</Row>
						<Row>
							<Col span={8}>{L('Status')}:</Col>
							<Col span={16} >{valueOfeBorrowReturningStatus[borrowReSelected.br_re_status]}</Col>
						</Row>
						{(!!borrowReSelected)?(
							<>
								<h4>{L('thong_tin_doc_gia')}:</h4>
								<Row>
									<Col span={12}>
										<Row>
											<Col span={8}>{L('ma')}:</Col>
											{/* <Col span={16} >{borrowReSelected.member!.me_code}</Col> */}
										</Row>
										<Row>
											<Col span={8}>{L('ten')}:</Col>
											{/* <Col span={16} >{borrowReSelected.member.me_name}</Col> */}
										</Row>
										<Row>
											<Col span={8}>{L('ngay_sinh')}:</Col>
											{/* <Col span={16} >{borrowReSelected.member.me_birthday}</Col> */}
										</Row>
									</Col>
									<Col span={12} >
										<Row>
											<Col span={8}>{L('sdt')}:</Col>
											{/* <Col span={16} >{borrowReSelected.member.me_phone}</Col> */}
										</Row>
										<Row>
											<Col span={8}>{L('gioi_tinh')}:</Col>
											{/* <Col span={16} >{borrowReSelected.member.me_sex == 0 ? "Nữ" : borrowReSelected.member.me_sex == 1 ? "Nam" : "Khác"}</Col> */}
										</Row>
										<Row>
											<Col span={8}>{L('dia_chi')}:</Col>
											{/* <Col span={16} >{borrowReSelected.member.me_address}</Col> */}
										</Row>
									</Col>
								</Row>
								
							</>
						):null}
					</Row>
                </Row>
            </Card>
		)
	}
}