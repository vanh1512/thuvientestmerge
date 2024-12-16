import * as React from 'react';
import { Col, Card, Modal, Row, Button, } from 'antd';
import { MemberCardDto, MemberDto } from '@services/services_autogen';
import TableMainMemberCard from './TableMainMemberCard';
import { L } from '@src/lib/abpUtility';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';

export interface IProps {
	memberCardListResult: MemberCardDto[],
	memberListResult: MemberDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportMemberCard extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isHeaderReport: false,
		isLoadDone: true,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}

	render() {
		const { memberCardListResult, memberListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row>
						<Col span={12}>
							<h2>{L('ExportListOf') + " " + L('memberCard')}</h2>
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh_sach_the_doc_gia_ngay_' + moment().format('DD_MM_YYYY')}
								idPrint="memberCard_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button style={{ marginLeft: "10px" }} danger onClick={this.props.onCancel}>{L('Cancel')}</Button>
						</Col>

					</Row>
				}
				closable={false}
				footer={null}
				width='90vw'
				onCancel={this.props.onCancel}
				maskClosable={false}
			>
				<Col span={24} style={{ marginTop: '10px' }} id='memberCard_print_id' ref={this.setComponentRef}>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}
					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h2>{L("DANH_SACH_THE_DOC_GIA")}</h2></Col>
					<TableMainMemberCard
						isPrint={true}
						isLoadDone={true}
						memberCardListResult={memberCardListResult}
						memberListResult={memberListResult}
						hasAction={false}
						pagination={false}
					/>
					{this.state.isHeaderReport && <FooterReport />}

				</Col>
			</Modal>
		)
	}
}