import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { L } from '@src/lib/abpUtility';
import { ItemUser, PunishDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import * as React from 'react';
import TablePunish from './components/TablePunish';
import { Badge, Button, Card, Col, DatePicker, Input, Modal, Popover, Row, message } from 'antd';
import AppConsts, { cssColResponsiveSpan } from '@src/lib/appconst';
import { DeleteOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import ModalExportPunish from './components/ModalExportPunish';
import moment, { Moment } from 'moment';
import SelectUser from '@src/components/Manager/SelectUser';
import SelectEnum from '@src/components/Manager/SelectEnum';
import { ePunishError, eUserType } from '@src/lib/enumconst';
import ModalDetailPunish from './components/ModalDetailPunish';

export default class Punish extends AppComponentBase {
    punishListResult: PunishDto[] = [];
    punishSelected: PunishDto = new PunishDto();
    keySelected: number[] = [];
    listItemSelected: PunishDto[] = [];
    state = {
        isLoadDone: true,
        isLoadFile: false,
        visibleModalExport: false,
        visibleModalViewDetail: false,
        br_re_id: undefined,
        dkcb_code: undefined,
        us_id_borrow: undefined,
        us_id_create: undefined,
        pun_error: undefined,
        pun_created_at: undefined,
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
        numberSelected: undefined,
        clicked: false,
        select: false,
    };
    async componentDidMount() {
        await this.getAll();
    }
    async getAll() {
        this.setState({ isLoadDone: false });
        await stores.punishStore.getPunishWithBorrowReturning(this.state.br_re_id, this.state.dkcb_code, this.state.us_id_borrow, this.state.us_id_create, this.state.pun_error, this.state.pun_created_at, this.state.skipCount, this.state.pageSize);
        this.setState({ isLoadDone: true, });
    }
    onChangePage = async (page: number, pagesize?: number) => {
        if (pagesize !== undefined) {
            await this.setState({ pageSize: pagesize! });
        }
        this.setState({ skipCount: (page - 1) * this.state.pageSize, currentPage: page }, async () => {
            this.getAll();
        })
    }
    handleSubmitSearch = async () => {
        this.onChangePage(1, this.state.pageSize);
    }
    clearSearch = async () => {
        await this.setState({
            br_re_id: undefined,
            dkcb_code: undefined,
            us_id_borrow: undefined,
            us_id_create: undefined,
            pun_error: undefined,
            pun_created_at: undefined,
        });
        this.getAll();
    }
    viewModalDetail = (item: PunishDto) => {
        this.punishSelected.init(item);
        this.setState({ isLoadFile: !this.state.isLoadFile, visibleModalViewDetail: true });
    }
    hide = () => {
        this.setState({ clicked: false });
    }
    handleVisibleChange = (visible) => {
        this.setState({ clicked: visible });
    }
    onChange = (listIdPunish: PunishDto[]) => {
        this.setState({ isLoadDone: false, })
        listIdPunish.map((item) => { this.keySelected.push(item.pun_id) });
        this.listItemSelected = listIdPunish;
        this.setState({ isLoadDone: true, numberSelected: listIdPunish.length });
    }
    render() {
        const self = this;
        const { totalPublishSetting, punishListResult } = stores.punishStore;
        return (
            <Card>
                <Row gutter={[16, 16]}>
                    <Col {...cssColResponsiveSpan(24, 4, 4, 4, 4, 4)} >
                        <h2>{L('Punish')}</h2>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 20, 20, 20, 20, 20)} style={{ textAlign: 'right' }}>
                        {/* {this.isGranted(AppConsts.Permission.General_Fields_Delete) && */}
                        <Badge count={this.state.numberSelected}>
                            <Popover style={{ width: "200px" }} visible={this.state.clicked} onVisibleChange={(e) => this.handleVisibleChange(e)} placement="bottom" content={
                                <>
                                    <Button
                                        type='primary'
                                        icon={<ExportOutlined />} title={L("ExportData")}

                                        size='small'
                                        onClick={async () => {
                                            if (this.keySelected.length < 1) {
                                                await message.warning(L("hay_chon_hang_muon_xuat_du_lieu"));
                                            }
                                            else {
                                                this.setState({ visibleModalExport: true, select: true })
                                            }; this.hide()
                                        }}
                                    ></Button>
                                    <a style={{ paddingLeft: "10px" }} onClick={async () => {
                                        if (this.keySelected.length < 1) {
                                            await message.warning(L("hay_chon_hang_muon_xuat_du_lieu"));
                                        }
                                        else {
                                            this.setState({ visibleModalExport: true, select: true })
                                        }; this.hide()
                                    }}>{L('ExportData')}</a>
                                </>
                            } trigger={['hover']} >
                                <Button style={{ margin: '0 10px 0.5em 0' }} type='primary'>{L("thao_tac_hang_loat")}</Button>
                            </Popover >
                        </Badge>
                        {/* } */}

                        {/* {this.isGranted(AppConsts.Permission.General_Publisher_Export) && */}
                        <Button type="primary" icon={<ExportOutlined />} onClick={() => this.setState({ visibleModalExport: true })}>{L('ExportData')}</Button>
                        {/* } */}
                    </Col>
                </Row>
                <Row gutter={[8, 8]} align='bottom'>
                    <Col {...cssColResponsiveSpan(24, 24, 12, 6, 6, 6)} >
                        <strong>{L('CodeDkcb')}:</strong><br />
                        <Input
                            value={this.state.dkcb_code}
                            allowClear
                            onChange={(e) => this.setState({ dkcb_code: e.target.value })} placeholder={L("nhap_tim_kiem") + '...'}
                            onPressEnter={this.handleSubmitSearch}
                        />
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 12, 6, 6, 6)} >
                        <strong>{L('Member')}:</strong><br />
                        <SelectUser role_user={eUserType.Member.num} onClear={() => this.setState({ us_id_borrow: undefined })} update={this.state.isLoadDone} userItem={!!this.state.us_id_borrow ? [ItemUser.fromJS({ id: this.state.us_id_borrow })] : undefined} mode={undefined} onChangeUser={(value) => this.setState({ us_id_borrow: value[0].id })}></SelectUser>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 12, 6, 6, 6)} >
                        <strong>{L('nguoi_phat')}:</strong><br />
                        <SelectUser role_user={eUserType.Manager.num} onClear={() => this.setState({ us_id_create: undefined })} update={this.state.isLoadDone} userItem={!!this.state.us_id_create ? [ItemUser.fromJS({ id: this.state.us_id_create })] : undefined} mode={undefined} onChangeUser={(value) => this.setState({ us_id_create: value[0].id })}></SelectUser>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 12, 6, 6, 6)} >
                        <strong>{L('loi')}:</strong><br />
                        <SelectEnum enum_value={this.state.pun_error} eNum={ePunishError} onChangeEnum={(value) => this.setState({ pun_error: value })}></SelectEnum>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 12, 6, 6, 6)} >
                        <strong>{L('ngay_phat')}:</strong><br />
                        <DatePicker
                            onChange={(date: Moment | null, dateString: string) => this.setState({ pun_created_at: !!date ? date.toDate() : undefined })}
                            format={"DD/MM/YYYY"}
                            placeholder={L("Select") + "..."}
                            style={{ width: '100%' }}
                            value={this.state.pun_created_at != undefined ? moment(this.state.pun_created_at) : undefined}
                        />
                    </Col>
                    <Col style={{textAlign:"center"}} {...cssColResponsiveSpan(24, 24, 3, 2, 3, 2)} >
                        <Button type="primary" icon={<SearchOutlined />} title={L('Search')} onClick={() => this.handleSubmitSearch()} >{L('Search')}</Button>
                    </Col>
                    <Col {...cssColResponsiveSpan(24, 24, 3, 3, 3, 3)}>
                        {(this.state.br_re_id != undefined || this.state.dkcb_code != undefined || this.state.us_id_borrow != undefined || this.state.us_id_create != undefined || this.state.pun_error != undefined || this.state.pun_created_at != undefined) &&
                            <Button danger icon={<DeleteOutlined />} title={L('ClearSearch')} onClick={() => this.clearSearch()} >{L('ClearSearch')}</Button>
                        }
                    </Col>
                </Row>

                <TablePunish
                    punishListResult={this.punishListResult}
                    viewModalDetail={this.viewModalDetail}
                    onChange={this.onChange}
                    pagination={{
                        pageSize: this.state.pageSize,
                        total: totalPublishSetting,
                        current: this.state.currentPage,
                        showTotal: (tot) => L("tong") + " " + tot + "",
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        onShowSizeChange(current: number, size: number) {
                            self.onChangePage(current, size)
                        },
                        onChange: (page: number, pagesize?: number) => this.onChangePage(page, pagesize)
                    }}

                />
                <ModalExportPunish
                    punishListResult={this.state.select == false ? punishListResult : this.listItemSelected}
                    visible={this.state.visibleModalExport}
                    onCancel={() => this.setState({ visibleModalExport: false, select: false })}
                ></ModalExportPunish>
                <ModalDetailPunish
                    isLoadFile={this.state.isLoadFile}
                    punishSelected={this.punishSelected}
                    visible={this.state.visibleModalViewDetail}
                    onCancel={() => this.setState({ visibleModalViewDetail: false })}
                ></ModalDetailPunish>
            </Card >
        )

    }
}
