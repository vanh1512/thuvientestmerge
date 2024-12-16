import * as React from 'react';
import { Col, Row, Button, Modal } from 'antd';
import { AuthorDto } from '@services/services_autogen';
import { L } from '@lib/abpUtility';
import TableAuthor from './TableAuthor';
import ActionExport from '@src/components/ActionExport';
import moment from 'moment';
import HeaderReport from '@src/components/LayoutReport/HeaderReport';
import FooterReport from '@src/components/LayoutReport/FooterReport';


export interface IProps {
	authorListResult: AuthorDto[],
	onCancel?: () => void;
	visible: boolean;
}
export default class ModalExportAuthor extends React.Component<IProps> {
	componentRef: any | null = null;
	state = {
		isHeaderReport: false,
		isLoadDone: false,
	};
	setComponentRef = (ref) => {
		this.setState({ isLoadDone: false });
		this.componentRef = ref;
		this.setState({ isLoadDone: true });
	}
	render() {
		const { authorListResult } = this.props;
		return (
			<Modal
				visible={this.props.visible}
				title={
					<Row >
						<Col span={12}>
							{L('xuat_danh_sach') + " " + L('tac_gia')}
						</Col>
						<Col span={12} style={{ textAlign: 'end' }}>
							<ActionExport
								isntHeaderReport={async () => await this.setState({ isHeaderReport: false })}
								isHeaderReport={async () => await this.setState({ isHeaderReport: true })}
								nameFileExport={'Danh sách tác giả ngày ' + moment().format('DD_MM_YYYY')}
								idPrint="author_print_id"
								isExcel={true}
								isWord={true}
								componentRef={this.componentRef}
							/>
							<Button title={L('huy')} style={{ margin: '0 0 0 9px' }} danger onClick={() => { this.props.onCancel!() }}>{L("huy")}</Button>
						</Col>
					</Row>
				}
				closable={false}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => { this.props.onCancel!() }}
				footer={null}
				width='90vw'
				maskClosable={false}

			>
				<Row ref={this.setComponentRef} id='author_print_id'>
					{this.state.isHeaderReport && <div style={{ width: "100%" }}><HeaderReport /></div>}

					<Col style={{ textAlign: "center", marginBottom: "10px" }} span={24}><h1>{L("danh_sach_tac_gia")} </h1></Col>
					<Col span={24}>
						<TableAuthor
							authorListResult={authorListResult}
							pagination={false}
							isLoadDone={true}
							noscroll={true}
						/>
					</Col>
					{this.state.isHeaderReport && <FooterReport />}

				</Row>
			</Modal>
		)
	}
}