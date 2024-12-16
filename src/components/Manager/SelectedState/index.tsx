import * as React from 'react';
import { Select } from 'antd';
import AppComponentBase from '@src/components/Manager/AppComponentBase';
import { eMCardState } from '@src/lib/enumconst';
import { L } from '@src/lib/abpUtility';
const { Option } = Select;

export interface IProps {
    onChangeEnum: (value: boolean|undefined) => void;
    enum_value?: boolean;
    placeholder?: string;
}

export default class SelectState extends AppComponentBase<IProps> {
    state = {
        enum_value: undefined,
    };

    async componentDidMount() {
        if (this.props.enum_value === undefined) {
            this.setState({ enum_value: this.props.enum_value })
        }
        else if (this.props.enum_value === true) {
            this.setState({ enum_value: 1 })
        } else this.setState({ enum_value: 0 })
    }

    onChangeEnumSelected = async(value: number) => {
        await this.setState({ enum_value: value });
        if (this.props.onChangeEnum != undefined) {
            if (this.state.enum_value === 1) {
                this.props.onChangeEnum(true);
            }
            else if(this.state.enum_value === 0) {
                this.props.onChangeEnum(false);
            }
            else {
                this.props.onChangeEnum(undefined);
            }
        }

    }

    render() {
        const { placeholder } = this.props;
        return (
            <Select
                style={{ width: "100%" }}
                onChange={this.onChangeEnumSelected}
                value={this.state.enum_value}
                allowClear={true}
                placeholder={placeholder ? placeholder : L("Select")}
            >
                {Object.values(eMCardState).map((item, index: number) =>
                    <Option key={"Key_enum_" + index} value={item.num}>{L(item.name)}</Option>
                )}
            </Select>
        );
    }

}

