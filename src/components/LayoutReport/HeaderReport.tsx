import * as React from 'react';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import AppConsts from '@src/lib/appconst';

export interface IProps {
    titleReport?: string;
}
export default class HeaderReport extends AppComponentBase<IProps> {
    render() {
        return (
            <div className='noneBorder' style={{ width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <td style={{ width: "36%", textAlign: "left" }}>
                                <div style={{ alignItems: "center", textAlign: "center" }}>
                                    <p>{"CƠ QUAN CHỦ QUẢN "}{AppConsts.agency}<br />{AppConsts.library}<br />-------------------</p>
                                </div>
                            </td>
                            <td style={{ width: "19%" }}></td>
                            <td style={{ width: "45%", textAlign: "center" }}>
                                <b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />Độc lập - Tự do - Hạnh phúc<br />-------------------</b>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                <p>Số: .../BC-TV</p>
                            </td>
                            <td></td>
                            <td style={{ textAlign: "center" }}>
                                <i>Tuyên Quang, ngày.....tháng.....năm......</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div >
        );
    }

}

