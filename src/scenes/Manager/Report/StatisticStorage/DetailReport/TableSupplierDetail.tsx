import { SupplierDto } from '@src/services/services_autogen';
import { stores } from '@src/stores/storeInitializer';
import * as React from 'react';

export interface IProps {
    su_id_arr: number[];
    title: string;
    titleTable: string,
    onCancel: () => void;
}

export default class TableSupplierDetail extends React.Component<IProps>{
    componentRef: any | null = null;

    state = {
        isLoadDone: false,
        skipCount: 0,
        currentPage: 1,
        pageSize: 10,
    };
    listInforSupplier: SupplierDto[] = [];
    // async componentDidMount() {
    //     await this.getAll();
    // }
    // async getAll() {
    //     this.setState({ isLoadDone: false });
    //     await stores.supplierStore.getAll(undefined, undefined, undefined,);
    //     this.listInforSupplier = await stores.supplierStore.getAllByIdArr(this.props.su_id_arr, this.state.skipCount, this.state.pageSize);
    //     this.setState({ isLoadDone: true });
    // }


    render(){
        return(
            <div>11111111121111</div>
        )
    }
}