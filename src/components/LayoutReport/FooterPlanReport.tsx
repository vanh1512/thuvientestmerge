import * as React from 'react';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { Col, Row } from 'antd';


export interface IProps {
    footer: string;
}
export default class FooterPlanReport extends AppComponentBase<IProps> {
    render() {
        return (
            (
                this.props.footer == 'plan' ?
                    <div className='noneBorder' style={{ width: "100%", marginTop: '10px' }} >
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <td style={{ width: "33%", textAlign: "left" }}>
                                        <p>Bộ phận HC-TH</p>
                                    </td>
                                    <td style={{ width: "33%" }}>
                                        Phòng kế hoạch duyệt
                                    </td>
                                    <td style={{ width: "33%", textAlign: "center" }}>
                                        <p>Ban giám đốc duyệt</p>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </div >
                    :
                    <div className='noneBorder' style={{ width: "100%", marginTop: '10px' }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <td style={{ width: "33%", textAlign: "left" }}>
                                        <h3> <strong>NGƯỜI PHÊ DUYỆT</strong></h3>
                                    </td>
                                    <td style={{ width: "33%" }}>
                                        <h3> <strong>BAN KIỂM KÊ</strong></h3>
                                    </td>
                                    <td style={{ width: "33%", textAlign: "center" }}>
                                        <h3> <strong>NGƯỜI LẬP BIÊN BẢN</strong></h3>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                    </div>
            )
        );
    }

}

