import * as React from 'react';
import { Input, Row, } from 'antd';
import { L } from '@src/lib/abpUtility';

export interface Iprops {
    name: string;
    onChangeName: (name: string) => void;
}
export default class CreateOrUpdateNameRoles extends React.Component<Iprops> {
    state = {
        isLoadDone: false,
        name: "",
    };
    async componentDidMount() {
        await this.setState({ isLoading: true });
        if (this.props.name != undefined) {
            this.setState({ name: this.props.name })
        }
        await this.setState({ isLoading: false });
    }
    componentDidUpdate(prevProps) {
        if (this.props.name !== prevProps.name) {
            this.setState({ name: this.props.name });
        }
    }

    onChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await this.setState({ name: e.target.value })
        if (this.props.onChangeName != undefined) {
            this.props.onChangeName(this.state.name);
        }
    }
    render() {
        return (
            <Row>
                <Input maxLength={50} value={this.state.name} onChange={(e) => this.onChangeName(e)} />
                <i>{L("chu_y_toi_da_50_ky_tu")}</i>
            </Row>
        )
    }
}