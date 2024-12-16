import * as React from 'react';
import { Col, Row, Button, Input, message, Popconfirm, Form, DatePicker, } from 'antd';
import { AttachmentItem, CreateBorrowReturningAtDeskInput, FindMemberBorrowDto, GetDocumentInforByDKCBDto, ItemBorrowReturning, ItemUser, MemberDto, } from '@services/services_autogen';
import AppConsts, { FileUploadType, cssCol, cssColResponsiveSpan } from '@src/lib/appconst';
import { stores } from '@src/stores/storeInitializer';
import InformationMember from '@src/scenes/Manager/Member/components/InformationMember';
import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';
import { L } from '@lib/abpUtility';
import moment, { Moment } from 'moment';
import SelectUser from '@src/components/Manager/SelectUser';
import { eUserType } from '@src/lib/enumconst';
import FileAttachments from '@src/components/FileAttachments';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export interface IProps {
    onCancel: () => void;
    onSuccessAction: () => void,
}

export default class DeliveryDirectedDocument extends React.Component<IProps> {
    private formRef: any = React.createRef();
    state = {
        isLoadDone: true,
        inputDKCBCode: '',
        inputDesc: '',
        borrowEndDate: moment(),
        us_id_borrow: undefined,
    };
    memberSelected: FindMemberBorrowDto = new FindMemberBorrowDto();
    listDetail: GetDocumentInforByDKCBDto[] = [];
    listAttachmentItem_file: AttachmentItem[] = [];


    onSelectMember = async (us_id: number) => {

        if (!!us_id && !isNaN(Number(us_id))) {
            await this.setState({ us_id_borrow: us_id });

        }
        this.setState({ isLoadDone: false });
        this.memberSelected = await stores.borrowReturningStore.findMemberById(this.state.us_id_borrow);
        this.setState({ isLoadDone: true });
    }

    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }
    }
    handleCheckBorrow = async (value: string) => {
        let itemExist = -1;
        if (value == undefined || value == "") {
            message.error(L('PleaseEnterTheĐkcbNumber.'));
            return;
        }
        let result: GetDocumentInforByDKCBDto = await stores.borrowReturningStore.getDocumentInforByDKCB(value);
        for (let i = 0; i < this.listDetail.length; ++i) {
            if (this.listDetail[i].documentInfo.do_in_id === result.documentInfo.do_in_id) {
                itemExist = i;
            }
        }

        if (itemExist !== -1) {
            message.error(L("sach_da_duoc_quet"));
            return;
        } else {
            if (result !== undefined) {
                this.setState({ isLoadDone: false });
                this.listDetail.push(result);
                message.success(L('DocumentScannedSuccessfully.'));
                this.setState({ inputDKCBCode: '', isLoadDone: true });
            } else {
                message.warning(L('NoDocumentFound.'))
            }
        }
    }

    onSuccessAction = () => {
        if (!!this.props.onSuccessAction) {
            this.props.onSuccessAction();
        }
    }

    handleSaveDeliveryDirectedResquest = async () => {
        let self = this;
        confirm({
            title: L('WantSave') + ", " + L("ListOf") + ": " + this.listDetail.length + " " + L("Book") + "?",
            okText: L('Confirm'),
            cancelText: L('Cancel'),
            async onOk() {
                self.setState({ isLoadDone: false });
                let input = new CreateBorrowReturningAtDeskInput();
                let arrayDocuments: ItemBorrowReturning[] = [];
                for (const item of self.listDetail) {
                    let itemBr = new ItemBorrowReturning();
                    itemBr.do_id = item.documentInfo.do_id;
                    itemBr.do_in_id = item.documentInfo.do_in_id;
                    arrayDocuments.push(itemBr);
                }
                input.documents = arrayDocuments;
                input.br_re_desc = self.state.inputDesc;
                input.us_id_borrow = self.memberSelected.me_id;
                input.br_re_start_at = moment().toDate();
                input.br_re_end_at = moment(self.state.borrowEndDate).toDate();
                input.fi_id_arr = self.listAttachmentItem_file;
                await stores.borrowReturningStore.createAtDesk(input);
                message.success(L('Success'));
                await self.onSuccessAction();
                self.setState({ isLoadDone: true });
            },
            onCancel() {

            },
        });
    }

    deleteBorrowReturningItem = async (index: number) => {
        this.setState({ isLoadDone: false });
        this.listDetail.splice(index, 1);
        message.destroy(L('SuccessfullyDeleted'));
        this.setState({ isLoadDone: true });
    }

    handleInputEnter = (e, code: string) => {
        if (e.keyCode === 13) {
            this.handleCheckBorrow(code);
        }
    }



    render() {
        const left = this.memberSelected != undefined && this.memberSelected.me_id ? cssCol(6) : cssCol(0);
        return (
            <>
                <Row justify='center'>
                    <h3>{L('ChooseMember')}</h3>
                </Row>
                <Row justify='center'>
                    <Col span={8}>
                        <SelectUser role_user={eUserType.Member.num} onChangeUser={async (value: ItemUser[]) => this.onSelectMember(value[0].id)} />
                    </Col>
                </Row>

                <Row justify='center' style={{ marginTop: '20px' }}>
                    {this.memberSelected !== undefined && this.memberSelected.me_id &&
                        <>
                            <Col {...cssColResponsiveSpan(24, 24, 12, 12, 16, 16)}>
                                <InformationMember memberSelected={this.memberSelected} />
                            </Col>
                            <Col {...cssColResponsiveSpan(24, 24, 12, 12, 8, 8)} style={{ paddingTop: '3%' }}>
                                <Row justify='center'>
                                    <Col span={24}>
                                        <Form>
                                            <Form.Item label={L('ReturningDate')} {...AppConsts.formItemLayout} valuePropName='br_re_end_at' name={'br_re_end_at'} rules={[{ required: true, message: L('ThisFieldIsRequired') }]}>
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    onChange={(date: Moment | null, dateString: string) => { this.setState({ borrowEndDate: date }) }}
                                                    format={"DD/MM/YYYY"}
                                                    value={this.state.borrowEndDate}
                                                    disabledDate={(current) => current ? current <= moment().startOf('day') : false}
                                                />
                                            </Form.Item>
                                        </Form>
                                    </Col>
                                    <Col span={24}>
                                        <Form>
                                            <Form.Item label={L('Note')} {...AppConsts.formItemLayout} name={'me_more_infor'} valuePropName='data'
                                                getValueFromEvent={(event, editor) => {
                                                    const data = editor.getData();
                                                    this.setState({ inputDesc: data });
                                                    return data;
                                                }}
                                            >
                                                <CKEditor editor={ClassicEditor} />
                                            </Form.Item>
                                        </Form>
                                    </Col>

                                </Row>
                                {/* <Row gutter={[16, 16]} justify='start'>
                                    <h4>{L('Note')}</h4>
                                    <TextArea placeholder={L("NoteInformation")} rows={3} value={this.state.inputDesc} onChange={(e) => this.setState({ inputDesc: e.target.value })} />
                                </Row> */}
                            </Col>
                        </>
                    }
                </Row>
                <Row>
                    {this.memberSelected !== undefined && this.memberSelected.me_id &&
                        <Col span={24}><hr style={{ width: '100%', textAlign: 'center' }}></hr></Col>
                    }
                </Row>
                {this.memberSelected != undefined && this.memberSelected.me_id &&
                    <Row style={{ justifyContent: 'center', margin: '0 0 20px 0' }}>
                        <Col span={10} style={{ display: 'flex', margin: '0 10px 0 0' }}>
                            <Input value={this.state.inputDKCBCode} onKeyUp={(e) => this.handleInputEnter(e, this.state.inputDKCBCode)} onChange={(e) => this.setState({ inputDKCBCode: e.target.value })} placeholder={L("ma_dang_ky_ca_biet")} />
                        </Col>

                        <Col span={2}>
                            <Button type='primary' onClick={() => this.handleCheckBorrow(this.state.inputDKCBCode)}><CheckCircleOutlined /></Button>
                        </Col>
                    </Row>
                }
                {this.listDetail != undefined && this.listDetail.length != 0 && this.listDetail!.map((item: GetDocumentInforByDKCBDto, index: number) =>
                    <>
                        <Row key={index + "_"} gutter={16} style={{ padding: '3px', justifyContent: 'start', alignItems: 'center', marginTop: '5px', backgroundColor: index % 2 == 0 ? '#f1f3f4' : '#fff' }}>
                            <Col span={4} offset={2}>
                                <b>{"-  Quyển số " + (index + 1) + ": "}</b>
                            </Col>
                            <Col span={9}>
                                {item.document.do_title}
                            </Col>
                            <Col span={7}>
                                <b>{L('CodeDkcb')}: </b>{item.documentInfo != undefined ? <span>{item.documentInfo.dkcb_code}<CheckCircleFilled style={{ color: 'seagreen' }} /></span> : ""}
                            </Col>
                            <Col span={1}>
                                <Popconfirm title={L('WantToDelete?')} onConfirm={() => this.deleteBorrowReturningItem(index)}>
                                    <DeleteOutlined style={{ color: 'red' }} />
                                </Popconfirm>
                            </Col>
                        </Row>

                    </>
                )}

                {this.listDetail != undefined && this.listDetail.length != 0 &&
                    <>
                        <Row style={{ marginTop: '10px' }}>
                            <strong>File</strong>
                            <FileAttachments
                                files={this.listAttachmentItem_file}
                                isMultiple={true}
                                componentUpload={FileUploadType.Avatar}
                                onSubmitUpdate={async (itemFile: AttachmentItem[]) => {
                                    this.listAttachmentItem_file = itemFile;
                                }}
                            />
                        </Row>
                        <Row style={{ textAlign: "end", marginTop: "20px" }}>
                            <Col span={24}>
                                <Button type='primary' onClick={() => { this.handleSaveDeliveryDirectedResquest() }}>{L('Save')}</Button>
                                &nbsp;
                            </Col>
                        </Row>
                    </>

                }



            </>
        )
    }
}