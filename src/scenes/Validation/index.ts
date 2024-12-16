import { L } from "@src/lib/abpUtility";
import AppConsts from "@src/lib/appconst";

const rules = {
  no_kytudacbiet: {
    pattern: /^(?![!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$)/,
    message: L("khong_hop_le"),
  },
  subfield_code: {
    pattern: /^\$[a-zA-Z0-9]*$/,
    message: L("khong_hop_le"),
  },
  noAllSpaces: {
    validator: (_: any, value: any) => {
      return new Promise<void>((resolve, reject) => {
        if (value && value.trim() === "") {
          reject(L("khong_hop_le"));
        } else {
          resolve();
        }
      });
    },
  },
  required: { required: true, message: L("ThisFieldIsRequired") },
  noSpaces: {
    pattern: /^\S*$/,
    message: L("khong_duoc_chua_khoang_trang"),
  },
  maxName: {
    max: AppConsts.maxLength.name,
    message: L("nhap_qua_so_luong_ky_tu"),
  },
  emailAddress: {
    max: AppConsts.maxLength.email,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g,
    message: L("email_khong_dung"),
  },

  cccd: {
    pattern: /^[0-9]{12}$/,
    message: L("so_can_cuoc_cong_dan_khong_hop_le"),
  },

  address: {
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: L("it_nhat_nam_ky_tu"),
  },
  phone: {
    pattern: /^[\+]?[(]?[0-9]{1,3}[)]?[\ ]?[-\s\.]?[0-9]{9}$/,
    message: L("so_dien_thoai_khong_hop_le"),
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,32}$/,
    min: AppConsts.maxLength.password,
    message: L(
      L("PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber")
    ),
  },
  description: {
    max: AppConsts.maxLength.description,
    message: L("nhap_qua_so_luong_ky_tu"),
  },
  // surName: {
  // 	pattern: /^[a-zA-Z]$/,
  // 	message: L("ho_khong_hop_le"),
  // },
  userName: {
    pattern: /^[a-zA-Z][a-zA-Z0-9_]{4,}$/,
    message: L(
      L("ky_tu_dau_tien_la_chu_it_nhat_nam_ky_tu_khong_chua_ky_tu_tieng_viet")
    ),
  },
  chucai_so_kytudacbiet: {
    // pattern: /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()+]*$/,
    pattern: /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-Z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ!@#$%^&*()+_ ]*$/,
    message: L("khong_hop_le"),
  },
  chucai_so: {
    // pattern: /^[a-zA-Z][a-zA-Z0-9!@#$%^&*()+]*$/,
    pattern: /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-Z0-9àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ_ ]*$/,
    message: L("khong_hop_le"),
  },
  so_kytudacbiet: {
    pattern: /^[0-9!@#$%^&*()+_ ]*$/,
    message: L("khong_hop_le"),
  },
  onlyLetter: {
    pattern: /^[a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ][a-zA-ZàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệđìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÈÉẺẼẸÊẾỀỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ_ ]*$/,
    message: L("khong_hop_le"),
  },
  numberOnly: {
    pattern: /^[0-9]\d*$/,
    message: L("chi_nhap_so_nguyen_duong"),
  },
  website: {
    pattern: /^[a-zA-Z0-9!@#$%^&*()+_./]*$/,
    message: L("khong_hop_le"),
  },
  no_number: {
    pattern: /^(?=.*[^\d])[\s\S]*$/,
    message: L("khong_hop_le"),
  },
  isbn: {
    min:10,
    pattern: /^[0-9]{1,5}-[0-9]{1,5}-[0-9]{1,4}-[0-9]{1,5}-[0-9]{1,5}$/,
    message: L("khong_hop_le"),
  }
};

export default rules;
