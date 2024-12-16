
import * as React from "react"
import AppComponentBase from "@src/components/Manager/AppComponentBase";
import HeaderPage from "./MainPage/Header";
import Container from "./MainPage/Container";
import Footer from "./MainPage/Footer";

export default class MainPage extends AppComponentBase {
    render() {
        return (
            <div>
                <HeaderPage />
                <Container />
                <div>
                <Footer />
                </div>
            </div>
        )
    }
}