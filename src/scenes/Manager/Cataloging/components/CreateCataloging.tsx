import * as React from 'react';
import { Col, Row, Button, Card, Input, message, DatePicker, Select, } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { CatalogingDto, CreateCatalogingInput, Marc21Dto } from '@src/services/services_autogen';
import { DeleteFilled, PlusCircleTwoTone } from '@ant-design/icons';
import { stores } from '@src/stores/storeInitializer';
import { L } from '@src/lib/abpUtility';
import { eDocumentItemStatus } from '@src/lib/enumconst';

export class DicMarc21 {
    indicator1: string = "#"
    indicator2: string = "#"

    subfields: [{ [key: string]: string }] = [{}];
}
export interface IProps {
    onCreateSuccess: () => void;
    onCancel: () => void;
    catalogingSelected: CatalogingDto;
}
export default class CreateCataloging extends AppComponentBase<IProps> {
    state = {
        isLoadDone: true,
        defaultSubValue: '',
        do_in_id: -1,
    };
    dicData: { [key: string]: DicMarc21 } = {};
    listMarc21: Marc21Dto[] = [];
    do_in_id_arr: number;
    async componentDidMount() {
        await this.initData();
    }
    initData = async () => {
        this.setState({ isLoadDone: false });
        this.dicData = {};
        this.listMarc21 = [];
        const { marc21ListResult } = stores.marc21Store;
        this.listMarc21 = marc21ListResult
        this.listMarc21.map(item => {
            if (!this.dicData.hasOwnProperty(item.mar_code!)) {
                this.dicData[item.mar_code!] = new DicMarc21();
                this.dicData[item.mar_code!].subfields.pop();
            }
        });
        this.setState({ isLoadDone: true });
    }
    onAddSubField = async (key: string) => {
        this.setState({ isLoadDone: false });
        let marcSelect = this.listMarc21.find(a => a.mar_code == key)!;
        if (marcSelect.subFields != undefined && marcSelect.subFields.length > 0) {
            let dicSub = {};
            let subValue = "";
            dicSub[subValue] = "";
            await this.setState({ defaultSubValue: subValue })
            this.dicData[key].subfields.push(dicSub);
        } else {
            message.error(L("khong_ton_tai_truong_con"));
            return;
        }
        this.setState({ isLoadDone: true });
    }
    onDeleteSubField = (key: string, index: number) => {
        this.setState({ isLoadDone: false });
        this.dicData[key].subfields.splice(index, 1);
        this.setState({ isLoadDone: true });
    }
    onSave = async () => {
        this.setState({ isLoadDone: false });
        let dicToString = JSON.stringify(this.dicData);
        let input = new CreateCatalogingInput();
        let cata_DDC: { [key: string]: DicMarc21 } = {};
        let cata_title: { [key: string]: DicMarc21 } = {};
        cata_DDC["082"] = this.dicData["082"];
        cata_title["245"] = this.dicData["245"];
        if (this.do_in_id_arr != undefined) {
            input.do_in_id = this.do_in_id_arr;
        } else {
            message.error(L("DocumentInforIsEmpty"));
            return;
        }
        input.cata_content = dicToString;
        input.cata_resultDDC = JSON.stringify(cata_DDC);
        input.cata_resultTitle = JSON.stringify(cata_title);
        await stores.catalogingStore.createCataloging(input);
        await this.onCreateSuccess();
        message.success(L("CreateSuccessfully"));
        this.setState({ isLoadDone: true });
    }

    setCharAt = (str: string, index: number, chr: string) => {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + chr + str.substring(index + 1);
    }
    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }
    }
    onCreateSuccess = () => {
        if (!!this.props.onCreateSuccess) {
            this.props.onCreateSuccess();
        }
    }
    onMultiSelect = (num: number) => {
        this.setState({ isLoadDone: false });
        this.do_in_id_arr = num;
        this.setState({ isLoadDone: true });
    }
    render() {
        const { documentInforListResult } = stores.documentInforStore;
        return (
            <Card>
                <Row>{L('bien_muc_tai_lieu')}</Row>
                <Row style={{ marginBottom: '10px' }}>
                    <Col span={12}>
                        <Select
                            showSearch
                            allowClear={true}
                            style={{ width: '100%' }}
                            onChange={(value: number) => this.onMultiSelect(value)}
                            filterOption={(input, option) => {
                                let str = option!.props!.children! + "";
                                return str.toLowerCase()!.indexOf(input.toLowerCase()) >= 0;
                            }}
                        >
                            {documentInforListResult.map(item =>
                                item.do_in_status == eDocumentItemStatus.WaitingCataloging.num && <Select.Option key={item.do_in_id} value={item.do_in_id}>{item.dkcb_code}</Select.Option>
                            )}
                        </Select>
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button danger onClick={this.onCancel}>{L("Cancel")}</Button>&nbsp;&nbsp;
                        <Button type='primary' onClick={this.onSave}>{L("Save")}</Button>
                    </Col>

                </Row>
                <Col span={24} style={{ overflowY: 'auto', maxHeight: window.innerHeight }}>
                    {this.listMarc21.map((itemMarc21, index) =>
                        <div style={{ width: '97%' }} key={"key_item_" + itemMarc21.mar_code + index}>
                            <Row gutter={16} style={{ margin: '5px 0' }}>
                                <Col span={17}>
                                    <b style={{ display: 'flex' }}>{itemMarc21.mar_code}-<span dangerouslySetInnerHTML={{ __html: itemMarc21.mar_desc! }}></span> </b>
                                </Col>
                                <Col span={3}>
                                    <Input defaultValue={'#'} minLength={0} maxLength={1} onChange={(e) => this.dicData[itemMarc21.mar_code!].indicator1 = e.target.value} />
                                </Col>
                                <Col span={3}>
                                    <Input defaultValue={'#'} minLength={0} maxLength={1} onChange={(e) => this.dicData[itemMarc21.mar_code!].indicator2 = e.target.value} />
                                </Col>
                                <Col span={1}>
                                    <Button type='primary' icon={<PlusCircleTwoTone />} onClick={() => this.onAddSubField(itemMarc21.mar_code!)} />
                                </Col>
                            </Row>
                            {this.dicData[itemMarc21.mar_code!] != undefined && this.dicData[itemMarc21.mar_code!].subfields.map((itemSub, index) =>
                                <Row gutter={16} key={"key_item_sub" + itemMarc21.mar_code + "_" + index} style={{ margin: '5px 0' }}>
                                    <Col span={10}>
                                        <Select
                                            style={{ width: '100%' }}
                                            defaultValue={this.state.defaultSubValue}
                                            onChange={(value: string) => {
                                                Object.keys(itemSub).map((keyItemSub) => {
                                                    const obj = itemSub;
                                                    obj[value] = itemSub[keyItemSub];
                                                    delete obj[keyItemSub];
                                                })
                                            }}>
                                            {this.listMarc21.find(a => a.mar_code == itemMarc21.mar_code!) != undefined && this.listMarc21.find(a => a.mar_code == itemMarc21.mar_code!)!.subFields!.map((item, index) =>
                                                <Select.Option key={"key_select_" + itemSub + item.sub_code + index} value={item.sub_code!}><p style={{ display: 'flex' }}>{item.sub_code}-<span dangerouslySetInnerHTML={{ __html: item.sub_desc! }}></span></p></Select.Option>
                                            )}
                                        </Select>
                                    </Col>
                                    <Col span={10}>
                                        <Input onChange={(e) => Object.keys(itemSub).map((keyItemSub) => {
                                            itemSub[keyItemSub] = e.target.value;
                                        })} />
                                    </Col>
                                    <Col span={4}>
                                        <Button type='primary' icon={<DeleteFilled />} onClick={() => this.onDeleteSubField(itemMarc21.mar_code!, index)} />
                                    </Col>
                                </Row>
                            )}
                        </div>
                    )}
                </Col>
            </Card>
        )
    }
}