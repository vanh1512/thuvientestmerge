import { action, observable } from 'mobx';
import http from '@services/httpService';
import { GDocumentDto, GDocumentService } from '@src/services/services_autogen';


class GDocument {
    private gDocument: GDocumentService;
    @observable gDocumentListDto: GDocumentDto[] = [];
    @observable total: number = 0;
    constructor() {
        this.gDocument = new GDocumentService("", http);
    }
    @action
    public getByView = async (do_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
        this.gDocumentListDto = [];
        let result = await this.gDocument.getByView(do_search, skipCount, maxResultCount)
        if (result != undefined && result.items != undefined) {
            this.gDocumentListDto = result.items;
        }
    }
    @action
    public getByBorrow = async (do_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
        this.gDocumentListDto = [];
        let result = await this.gDocument.getByBorrow(do_search, skipCount, maxResultCount)
        if (result != undefined && result.items != undefined) {
            this.gDocumentListDto = result.items;
        }
    }
    @action
    public getNewest = async (do_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
        this.gDocumentListDto = [];
        let result = await this.gDocument.getNewest(do_search, skipCount, maxResultCount)
        if (result != undefined && result.items != undefined) {
            this.gDocumentListDto = result.items;
        }
    }
    @action
    public getDocuments = async (do_search: string | undefined, skipCount: number | undefined, maxResultCount: number | undefined) => {
        this.gDocumentListDto = [];
        let result = await this.gDocument.getDocuments(do_search, skipCount, maxResultCount)
        if (result != undefined && result.items != undefined) {
            this.gDocumentListDto = result.items;
        }
    }

}
export default GDocument;