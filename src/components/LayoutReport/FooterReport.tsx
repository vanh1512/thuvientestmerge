import * as React from 'react';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { Col, Row } from 'antd';


export interface IProps {
    titleReport?: string;
}
export default class FooterReport extends AppComponentBase<IProps> {
    render() {
        return (
            <div className='noneBorder' style={{ width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <td style={{ width: "36%", textAlign: "left" }}>
                                <div style={{ alignItems: "left", textAlign: "left" }}>
                                    <p>{"Nơi nhận:"}<br />-Như trên;<br />-Lưu: ...</p>
                                </div>
                            </td>
                            <td style={{ width: "31%" }}></td>

                        </tr>
                        <tr>
                            <td style={{ width: "67%" }}></td>
                            <td style={{ width: "33%", textAlign: "center" }}>
                                <b>THỦ TRƯỞNG ĐƠN VỊ<br />{"(Ký, ghi rõ họ tên và đóng dấu)"}<br /></b>
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }

}

