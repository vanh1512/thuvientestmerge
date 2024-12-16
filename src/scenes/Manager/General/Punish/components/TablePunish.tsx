import { EyeOutlined } from "@ant-design/icons";
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { L } from "@src/lib/abpUtility";
import AppConsts from "@src/lib/appconst";
import { valueOfePunishError } from "@src/lib/enumconst";
import { PunishDto, PunishError } from "@src/services/services_autogen";
import { stores } from "@src/stores/storeInitializer";
import { Button, Table } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import moment from "moment";

import * as React from 'react';

export interface IProps {
    pagination: TablePaginationConfig | false;
    punishListResult: PunishDto[];
    noscroll?: boolean;
    hasAction?: boolean;
    viewModalDetail?: (item: PunishDto) => void;
    onChange?: (listPunish: PunishDto[]) => void;
}
export default class TablePunish extends AppComponentBase<IProps> {
    state = {
        isLoadDone: true,
    };
    listPunish: PunishDto[] = [];

    viewModalDetail = (item: PunishDto) => {
        if (!!this.props.viewModalDetail) {
            this.props.viewModalDetail(item);
        }
    }
    render() {
        let action: any = {
            title: "", children: [], key: 'action_Publisher_index', className: "no-print center", fixed: 'right', width: 100,
            render: (text: string, item: PunishDto) => (
                <div >
                    {this.isGranted(AppConsts.Permission.General_Publisher_Edit) &&
                        <Button
                            type="primary" icon={<EyeOutlined />} title={L("View")}
                            style={{ marginLeft: '10px' }}
                            size='small'
                            onClick={() => this.viewModalDetail(item!)}
                        ></Button>
                    }
                </div>
            )
        };
        const { punishListResult } = stores.punishStore;
        const { pagination, noscroll, hasAction } = this.props;
        const columns: ColumnsType<any> = [
            { title: L('stt'), key: ('punish'), width: 50, fixed: "left", render: (text: string, item: PunishDto, index: number) => <div>{pagination !== false ? pagination.pageSize! * (pagination.current! - 1) + (index + 1) : (index + 1)}</div> },
            { title: L('Member'), key: ('us_id_borrow'), render: (text: number, item: PunishDto) => <div>{stores.sessionStore.getUserNameById(item.us_id_borrow)}</div> },
            { title: L('nguoi_phat'), key: ('us_id_create'), render: (text: number, item: PunishDto) => <div>{stores.sessionStore.getUserNameById(item.us_id_create)}</div> },
            { title: L('ly_do_phat'), key: ('pun_reason'), render: (text: string, item: PunishDto) => <div>{item.pun_reason}</div> },
            { title: L('loi'), key: ('pun_error'), render: (text: PunishError, item: PunishDto) => <div>{valueOfePunishError(item.pun_error)}</div> },
            { title: L('PunishmentMoney'), key: (' pun_money'), render: (text: number, item: PunishDto) => <div>{AppConsts.formatNumber(item.pun_money)}</div> },
            { title: L('ngay_phat'), key: (' pun_created_at'), render: (text: number, item: PunishDto) => <div>{moment(item.pun_created_at).format("DD/MM/YYYY")}</div> },
        ];

        if (!!hasAction && hasAction) {
            columns.push(action);
        }
        const rowSelection: TableRowSelection<PunishDto> = {

            onChange: (listPunish: React.Key[], listItem: PunishDto[]) => {
                this.listPunish = listItem.length > 0 ? listItem : [];
                if (!!this.props.onChange) {
                    this.props.onChange(this.listPunish)
                }
            }
        }
        return (
            <Table
                className='centerTable'
                rowSelection={!!hasAction ? rowSelection : undefined}
                loading={!this.state.isLoadDone}
                size={'middle'}
                scroll={noscroll ? { x: undefined, y: undefined } : { x: window.innerWidth, y: window.innerHeight }}
                bordered={true}
                locale={{ "emptyText": L('khong_co_du_lieu') }}
                columns={columns}
                dataSource={punishListResult}
                pagination={pagination}
            />
        )
    }

}