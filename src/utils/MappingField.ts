import { DetailsData } from "../component/InfoCom";

export function handleMappingFieldRequired(data: DetailsData[]) {
  return data.map(item => {
    if (item.key == "contract_no"
      || item.key == "address"
      || item.key == "contact_subject"
      || item.key == "contract"
      || item.key == "cooperation"
      || item.key == "cooperation_time"
      || item.key == "supplier_name"
      || item.key == "brand"
      || item.key == "plate") {
      return {
        ...item,
        require: true,
      }
    } else {
      return {
        ...item,
        require: false,
      }
    }
  })
}

export function handleMappingFieldRequiredForAccount(data: DetailsData[]) {
  return data.map(item => {
    if (item.key == "accounts_bank_card"
      || item.key == "accounts_bank_addr"
      || item.key == "invoice_title"
      || item.key == "accounts_name") {
      return {
        ...item,
        require: true,
      }
    } else {
      return {
        ...item,
        require: false,
      }
    }
  })
}

export function handleMappingFieldRequiredForFileData(data: DetailsData[]) {
  return data.map(item => {
    if (item.key == "business_code"
      || item.key == "min_order_quantity"
      || item.key == "stock_up"
      || item.key == "sample_fee"
      || item.key == "goods_name"
      || item.key == "spec_name"
      || item.key == "cost") {
      return {
        ...item,
        require: true,
      }
    } else {
      return {
        ...item,
        require: false,
      }
    }
  })
}