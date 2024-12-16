import { Button, Col, Dropdown, Menu, Row } from "antd"
import AppLongLogo from '@images/logoego_long256.png';
import * as React from "react"
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import { RouterPath } from "@src/lib/appconst";
import "./styles.css";
import { stores } from "@src/stores/storeInitializer";
import { L } from "@src/lib/abpUtility";
interface CustomMenuItem {
    key: string;
    label: JSX.Element;
}
export default class HeaderPage extends AppComponentBase {

    render() {
        const linkLogin = RouterPath.g_login
        const items: CustomMenuItem[] = [
            {
                key: '1',
                label: (
                    <a target="_blank" href={RouterPath.g_opacpage_timeOpen}>
                        Giới thiệu thư viện
                    </a>
                ),
            },
            {
                key: '2',
                label: (
                    <a target="_blank" href={RouterPath.g_opacpage_timeOpen}>
                        Giờ mở cửa
                    </a>
                ),
            },
        ];
        const itemsService: CustomMenuItem[] = [
            {
                key: '1',
                label: (
                    <a target="_blank" href={RouterPath.g_opacpage_borrowreturning}>
                        Dịch vụ mượn trả tài liệu
                    </a>
                ),
            },
            {
                key: '1',
                label: (
                    <a target="_blank" href={RouterPath.g_opacpage_extend}>
                        Dịch vụ gia hạn tài liệu
                    </a>
                ),
            },

        ];
        return (

            <div>
                <Row >
                    <Col span={5} style={{ display: 'flex', justifyContent: 'end' }}>
                        <a href={RouterPath.g_opacpage}> <img src={AppLongLogo} alt="Logo" style={{ width: 200 }} /></a>

                    </Col>
                    <Col span={15} style={{ textAlign: "center" }}>
                        <h1>Chào mừng bạn đến với thư viện tỉnh <span style={{ color: '#1da57a' }}>Tuyên Quang</span></h1>
                        <h4>Mở cửa: 8:15 - 21:00 hàng ngày |  08:00 - 12:00 & 13:00 - 17:00 hàng tuần </h4>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                        {stores.sessionStore.isUserLogin() ?
                            <>
                                <Button type="primary" onClick={() => { window.location.href = RouterPath.admin; }} style={{ borderRadius: 15 }}>Trang quản lý</Button>&nbsp;&nbsp;
                                <Button type="primary" onClick={() => { stores.authenticationStore.logout(); window.location.href = RouterPath.admin; }} style={{ borderRadius: 15 }}>{L("Logout")}</Button>
                            </>
                            :
                            <Button type="primary" style={{ borderRadius: 15 }}><a href={linkLogin}>{L("LogIn")}</a></Button>
                        }
                    </Col>
                </Row>
                <Row style={{ marginTop: 15, backgroundColor: "#1DA57A", justifyContent: "center" }}>
                    {/* Tranng chủ */}
                    <Col><Button className="btnNavbar"><a href={RouterPath.g_opacpage}>Trang chủ</a></Button></Col>
                    {/* Dropdown Giới thiệu */}
                    <Dropdown overlay={(
                        <Menu >
                            {items.map(item => (
                                <Menu.Item key={item.key}>
                                    {item.label}
                                </Menu.Item>
                            ))}
                        </Menu>
                    )} placement="bottomRight" arrow>
                        <Button className="btnNavbar" >Giới thiệu</Button>
                    </Dropdown>
                    <Col><Button className="btnNavbar"><a href={RouterPath.g_opacpage_rules}>Nội quy</a></Button></Col>
                    {/* Dropdown dịch vụ */}
                    <Dropdown overlay={(
                        <Menu>
                            {itemsService.map(item => (
                                <Menu.Item key={item.key}>
                                    {item.label}
                                </Menu.Item>
                            ))}
                        </Menu>
                    )} placement="bottomRight" arrow>
                        <Button className="btnNavbar" >Dịch vụ</Button>
                    </Dropdown>

                </Row>
            </div>
        )
    }
}