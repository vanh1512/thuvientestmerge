import * as React from 'react';
import { Col, Row, Button, Modal, Card, message } from 'antd';
import { CheckDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableMainCheck from './TableMainCheck';
import ActionExport from '@src/components/ActionExport';
import { cssColResponsiveSpan } from '@src/lib/appconst';
import moment from 'moment';
import { valueOfeCheckProcess } from '@src/lib/enumconst';
import TableMaincheckItem from '../CheckItem/components/TableMainCheckItem';
import { stores } from '@src/stores/storeInitializer';
import ReportStatus from './ReportStatus';
import TableViewCheckDocument from './TableViewCheckDocument';

export interface IProps {
	checkListResult: CheckDto[],
	onCancel?: () => void;
	visible: boolean;
	checkSelected: CheckDto;

}
export default class ModalViewCheck extends React.Component<IProps> {
	state = {
		isLoadDone: true,
		visibleModal: false,
		skipCount: 0,
		currentPage: 1,
		pageSize: 10,
		ck_id: 0,
	};
	
		render() {
		const self = this;
		const { checkSelected } = this.props;
		return (
			<>
				{checkSelected != undefined &&
					<Card>
						<Row style={{ justifyContent: "center", marginBottom: "25px" }}>
							<h2>{L("thong_tin_kiem_ke")}: <u>{checkSelected.ck_code} </u></h2>
						</Row>
							<Col><h3>1. {L("thong_tin_kiem_ke")}</h3></Col>
						<Row gutter={[16, 16]}>
							<Col {...cssColResponsiveSpan(24, 24, 24, 24, 24, 24)}>
								<p><b>{L("CheckStartDate")}: </b>{moment(checkSelected.ck_created_at).format("DD/MM/YYYY") || (L("chua_cap_nhat"))}</p>
								<p><b>{L("ParticipantInTheCheck")}:</b> {checkSelected.us_id_participant != undefined && checkSelected.us_id_participant.map(item => item.name).join(", ") || (L("chua_cap_nhat"))} </p>
								<p><b>{L("Status")}: </b>{valueOfeCheckProcess(checkSelected.ck_process) || (L("chua_cap_nhat"))}</p>
								{/* <p><b>{L("tai_lieu_bi_mat")}: </b>{(checkSelected.checkItems) || (L("chua_cap_nhat"))}</p> */}
							</Col>
							<Col><h3>2. {L("tai_lieu_kiem_ke")}</h3></Col>
							<Col {...cssColResponsiveSpan(24, 24, 24, 24, 24, 24)}>
								<p><b>{L("tai_lieu_kiem_ke")}</b></p>
								<TableViewCheckDocument onCancel={() => this.setState({ visibleModal: false })} checkSelected={checkSelected} />
							</Col>
						</Row>
					</Card>
				}
			</>
		)
	}
}