import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type PlateOptionsType = {
  brandCount?: number,
  SupplierStatus: string
  supplierStatusName: string
}

const initialState: { plateOptions: PlateOptionsType[] } = {
  plateOptions: [{
    SupplierStatus: "SUPPLIER_POINT",
    supplierStatusName: "重点供应链",
  }, {
    SupplierStatus: "SUPPLIER_BLACK",
    supplierStatusName: "黑名单",
  }, {
    SupplierStatus: "SUPPLIER_PUBLIC",
    supplierStatusName: "供应链公海",
  }],
}

export const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState,
  reducers: {
    setPlateoptions(state, action: PayloadAction<PlateOptionsType[]>) {
      state.plateOptions = {
        ...state.plateOptions,
        ...action.payload,
      }
    },
  },
})

export const { setPlateoptions } = dictionarySlice.actions;

export default dictionarySlice.reducer