import * as React from 'react';
import { MemberLogDto, } from '@services/services_autogen';
import moment from 'moment';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { L } from '@src/lib/abpUtility';
import { valueOfeMemberAction } from '@src/lib/enumconst';
import { Col, Row, Table } from 'antd';


export interface IProps {
	memberLogListResult: MemberLogDto[]
	pagination: TablePaginationConfig | false;

}
export default class TableMainMemberLog extends React.Component<IProps> {
	render() {
		const { memberLogListResult, pagination } = this.props;
		const columns: ColumnsType<MemberLogDto> = [
			{ title: L('stt'), width: 50, key: 'no_borrowReturning', render: (text: string, item: MemberLogDto, index: number) => <div>{pagination != false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div> },
			{ title: L('mo_ta'), key: 'br_re_lo_desc_borrowReturningLog', render: (text: string, item: MemberLogDto) => <div>{item.me_lo_data}</div> },
			{ title: L('tac_vu'), key: 'br_re_lo_type_borrowReturningLog', render: (text: string, item: MemberLogDto) => <div>{valueOfeMemberAction(item.me_lo_action)}</div> },
			{ title: L('thoi_gian'), key: 'br_re_lo_created_at_borrowReturningLog', render: (text: string, item: MemberLogDto) => <div>{moment(item.me_lo_created_at).format("DD/MM/YYYY")}</div> },

		];
		return (
			<Row>
				<Col span={24}>
					<Table
						loading={false}
						// rowClassName={(record, index) => (this.borrowReSelected.br_re_lo_id == record.br_re_lo_id) ? "bg-click" : "bg-white"}
						rowKey={record => Math.random() + "_" + record.me_lo_id}
						size={'middle'}
						bordered={true}
						locale={{ "emptyText": L('khong_co_du_lieu') }}
						columns={columns}
						dataSource={memberLogListResult.length > 0 ? memberLogListResult : []}
						pagination={this.props.pagination}
					/>
				</Col>
			</Row>
		)
	}
}