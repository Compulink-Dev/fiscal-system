import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  receiptType: { type: String, enum: ['FiscalInvoice', 'CreditNote', 'DebitNote'], required: true },
  receiptCurrency: { type: String, required: true },
  receiptCounter: { type: Number, required: true },
  receiptGlobalNo: { type: Number, required: true },
  invoiceNo: { type: String, required: true },
  buyerData: {
    buyerRegisterName: String,
    buyerTradeName: String,
    buyerTIN: String,
    VATNumber: String,
    buyerContacts: {
      phoneNo: String,
      email: String
    },
    buyerAddress: {
      province: String,
      city: String,
      street: String,
      houseNo: String
    }
  },
  receiptNotes: String,
  receiptDate: { type: Date, required: true },
  creditDebitNote: {
    receiptID: mongoose.Schema.Types.ObjectId,
    deviceID: Number,
    receiptGlobalNo: Number,
    fiscalDayNo: Number
  },
  receiptLinesTaxInclusive: { type: Boolean, required: true },
  receiptLines: [{
    receiptLineType: { type: String, enum: ['Sale', 'Discount'], required: true },
    receiptLineNo: { type: Number, required: true },
    receiptLineHSCode: String,
    receiptLineName: { type: String, required: true },
    receiptLinePrice: Number,
    receiptLineQuantity: { type: Number, required: true },
    receiptLineTotal: { type: Number, required: true },
    taxCode: String,
    taxPercent: Number,
    taxID: { type: Number, required: true }
  }],
  receiptTaxes: [{
    taxCode: String,
    taxPercent: Number,
    taxID: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    salesAmountWithTax: { type: Number, required: true }
  }],
  receiptPayments: [{
    moneyTypeCode: { type: String, enum: ['Cash', 'Card', 'MobileWallet', 'Coupon', 'Credit', 'BankTransfer', 'Other'], required: true },
    paymentAmount: { type: Number, required: true }
  }],
  receiptTotal: { type: Number, required: true },
  receiptPrintForm: { type: String, enum: ['Receipt48', 'InvoiceA4'], default: 'Receipt48' },
  receiptDeviceSignature: {
    hash: String,
    signature: String
  },
  receiptServerSignature: {
    hash: String,
    signature: String,
    certificateThumbprint: String
  },
  receiptID: String,
  serverDate: Date,
  status: { type: String, enum: ['draft', 'submitted', 'fiscalized', 'failed'], default: 'draft' },
  validationErrors: [String],
  fiscalDayNo: Number,
  createdAt: { type: Date, default: Date.now }
});

export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);