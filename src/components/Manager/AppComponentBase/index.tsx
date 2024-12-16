import * as React from 'react';
import FileSaver from 'file-saver';
import { L, isGranted } from '@src/lib/abpUtility';
import { AppConsts } from '@src/lib/appconst';
// import * as XLSX from 'xlsx';
import * as XLSX from "xlsx";
import MineTypeConst from '@src/lib/minetypeConst';
import { AttachmentItem, FileDocument, FileDocumentDto, FilesDto, FilesOfUserDto, FolderDto } from '@src/services/services_autogen';
import { message } from 'antd';
declare var abp: any;
declare var document: any;
class AppComponentBase<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
	L(key: string, sourceName?: string): string {
		return L(key);
	}

	isGranted(permissionName: string): boolean {
		return isGranted(permissionName);
	}
	getFile(fi_id: number | undefined) {
		if (fi_id == undefined) {
			message.error(L("khong_co_tep_dinh_kem"));
			return "";
		}
		let path = encodeURI(fi_id + "");
		var encryptedAuthToken = abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName);

		return AppConsts.remoteServiceBaseUrl + "download/file?path=" + path + "&" + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken);
	}
	getFileDocument(item: FileDocumentDto) {
		if (item.fi_do_id == undefined) {
			message.error(L("khong_co_tep_dinh_kem"))
		}
		let path = encodeURI(item.fi_do_path + "");
		return AppConsts.remoteServiceBaseUrl + "download/fileDocument?path=" + path;
	}
	getFileOfUser(item: FilesOfUserDto) {
		if (item.fi_us_id == undefined) {
			message.error(L("khong_co_tep_dinh_kem"))
		}
		let path = encodeURI(item.fi_us_path + "");
		return AppConsts.remoteServiceBaseUrl + "download/fileOfUser?path=" + path;
	}
	getFolder(item: FolderDto) {
		if (item.fo_id == undefined) {
			message.error(L("khong_co_tep_dinh_kem"))
		}
		let path = encodeURI(item.fo_link + "");
		var encryptedAuthToken = abp.utils.getCookieValue(AppConsts.authorization.encrptedAuthTokenName);
		return AppConsts.remoteServiceBaseUrl + "download/folder?path=" + path + "&" + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken);
	}
	print = (id) => {
		let oldPage = document.body.innerHTML;
		let printableElements = document.getElementById(id).innerHTML;

		document.body.innerHTML = printableElements;
		window.print();
		window.close();
		document.body.innerHTML = oldPage;
		// Modal.error({title: "Thông báo",content: "Không thể kết nối máy in, Kiểm tra lại kết nối của bạn!"});

	}

	printTag(id: string, headerPrint?: string | undefined) {
		let popupWinindow;
		let innerContents = document.getElementById(id).innerHTML;
		popupWinindow = window.open('', '_blank', 'width=700,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
		popupWinindow.document.open();
		let contentHTML = "<html><head> ";
		contentHTML += "<style>";
		contentHTML += ".no-print  { display: none;}";

		contentHTML += ".noneBorder table, .noneBorder th, .noneBorder td {border: none !important;}";
		contentHTML += "@page {";
		contentHTML += "size: auto;";
		// contentHTML+="margin-left: 20mm;}" ;
		contentHTML += "@media print {";

		contentHTML += "#labelClass {page-break-before:always; }";
		contentHTML += "html, body {";
		// contentHTML+="margin: 0px; " ;
		// contentHTML+="font-size: 17px; " ;
		// contentHTML+="width: 300mm;" ;
		// contentHTML+="height: 100mm;";
		contentHTML += "}";
		contentHTML += "table {width: 100%;}";
		contentHTML += "table, th, td {border: 0.01em solid black; border-collapse: collapse; text-align: center;}";
		contentHTML += "td {padding:0px 7px}";
		contentHTML += "}</style></head>";
		contentHTML += "<body onload='window.print()'>" + innerContents + "</html>";
		popupWinindow.document.write(contentHTML);
		popupWinindow.document.close();
	}
	exportHTMLToExcel(id: string, name = "Mlibrary") {
		var element = document.getElementById(id);
		const workbook = XLSX.utils.book_new();
		if (element != undefined) {
			var wsNIA = XLSX.utils.table_to_sheet(element);
			XLSX.utils.book_append_sheet(workbook, wsNIA, name);
		}
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer', bookSST: true, cellDates: true, });
		const data1 = new Blob([excelBuffer,], { type: fileType, });
		FileSaver.saveAs(data1, name + ".xlsx");
	}

	exportHTMLToDoc = async (id: string, name: string) => {
		let header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
			"xmlns:w='urn:schemas-microsoft-com:office:word' " +
			"xmlns='http://www.w3.org/TR/REC-html40'>" +
			"<head><meta charset='utf-8'>" +
			"<style type=\"text/css\">" +
			"@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}" +
			"div.WordSection1 {page: WordSection1;}" +
			"ul.ant-pagination {display:none; }" +
			"table {width: 100%; font: 17px Calibri;}" +
			"table, th, td {border: solid 1px black; border-collapse: collapse;padding: 2px 3px; text-align: center;}" +
			".noneBorder table, .noneBorder th, .noneBorder td {border: none !important;}" +
			"</style></head><body>";
		let footer = "</body></html>";
		let sourceHTML = header + document.getElementById(id).innerHTML + footer;
		let source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
		let fileDownload = document.createElement("a");
		document.body.appendChild(fileDownload);
		fileDownload.href = source;
		fileDownload.download = name + '.doc';
		fileDownload.click();
		document.body.removeChild(fileDownload);
	}

	get languages() {
		return abp.localization.languages.filter((val: any) => {
			return !val.isDisabled;
		});
	}
	displayNumberOnUI = (e: number | undefined): string => {
		return "" + AppConsts.formatNumber(e) + "";
	}
	// async changeLanguage(languageName: string) {
	// 	await stores.userStore!.changeLanguage(languageName);

	// 	abp.utils.setCookieValue(
	// 		'Abp.Localization.CultureName',
	// 		languageName,
	// 		new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
	// 		abp.appPath
	// 	);

	// 	window.location.reload();
	// }

	get currentLanguage() {
		return abp.localization.currentLanguage;
	}
}

export default AppComponentBase;
