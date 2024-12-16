import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { L } from "@src/lib/abpUtility";
import { cssColResponsiveSpan } from "@src/lib/appconst";
import { AuthorDto } from "@src/services/services_autogen";
import { Avatar, Button, Card, Col, Row } from "antd";
import * as React from "react";

export interface IProps {
    author_info: AuthorDto | undefined;
    onCancel?: () => void;
}

export default class AuthorInfomation extends AppComponentBase<IProps>{
    state = {
        isLoadDone: false,
    }
    onCancel = () => {
        if (!!this.props.onCancel) {
            this.props.onCancel();
        }
    }
    render() {
        const { author_info } = this.props;
        return (
            <>
                {author_info != undefined &&
                    <Card className="au_info">
                        <Row style={{ justifyContent: "center", marginBottom: "25px" }}>
                            <h2>{L("thong_tin_tac_gia")}: <u>{author_info.au_name} </u></h2>
                        </Row>
                        <Row gutter={[16, 16]} >
                            <Col {...cssColResponsiveSpan(24, 24, 24, 8, 8, 8)} style={{ textAlign: 'center' }}>
                                <Avatar size={175} src={this.getFile(author_info.fi_id.id)} />
                            </Col>
                            <Col {...cssColResponsiveSpan(24, 12, 12, 8, 8, 8)} >
                                <p><b>{L("ma_tac_gia")}: </b>{author_info.au_code || (L("chua_cap_nhat"))}</p>
                                <p><b>{L("ho_ten")}:</b> {author_info.au_name || (L("chua_cap_nhat"))} </p>
                                <p><b>{L("dia_chi")}:</b> {author_info.au_address || (L("chua_cap_nhat"))}</p>
                                <p><b>{L("ngay_sinh")}:</b> {author_info.au_dob || (L("chua_cap_nhat"))}</p>
                                <p><b>{L("mo_ta")}:</b> {<div style={{ marginTop: "14px" }} dangerouslySetInnerHTML={{ __html: author_info.au_decs! }}></div> || (L("chua_cap_nhat"))} </p>
                            </Col>
                            <Col {...cssColResponsiveSpan(24, 12, 12, 8, 8, 8)} >
                                <p><b>{L("dia_chi_email")}:</b> {author_info.au_email || (L("chua_cap_nhat"))} </p>
                                <p><b>{L("hoc_ham")}:</b> {author_info.au_academic_rank || (L("chua_cap_nhat"))}</p>
                                <p><b>{L("hoc_vi")}: </b>{author_info.au_degree || (L("chua_cap_nhat"))}</p>
                                {/* <p><b>{L("chu_ky")}:</b> {author_info.au_pen_name || (L("chua_cap_nhat"))} </p> */}
                                <p><b>{L("thong_tin_them")}:</b> {<div style={{ marginTop: "14px" }} dangerouslySetInnerHTML={{ __html: author_info.au_infor! }}></div> || (L("chua_cap_nhat"))} </p>
                            </Col>
                        </Row>
                        <Row style={{ justifyContent: "right" }}>
                            <Button title={L('huy')} danger onClick={() => this.onCancel()}>
                                {L("huy")}
                            </Button>
                        </Row>
                    </Card>
                }
            </>
        )
    }
}