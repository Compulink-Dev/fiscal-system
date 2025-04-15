import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const invoiceSchema = z.object({
  receiptType: z.enum(['FiscalInvoice', 'CreditNote', 'DebitNote']),
  receiptCurrency: z.string().length(3),
  invoiceNo: z.string().min(1),
  buyerData: z.object({
    buyerRegisterName: z.string().min(1),
    buyerTradeName: z.string().optional(),
    buyerTIN: z.string().optional(),
    VATNumber: z.string().optional(),
    buyerContacts: z.object({
      phoneNo: z.string().optional(),
      email: z.string().email().optional()
    }).optional(),
    buyerAddress: z.object({
      province: z.string().optional(),
      city: z.string().optional(),
      street: z.string().optional(),
      houseNo: z.string().optional()
    }).optional()
  }).optional(),
  receiptNotes: z.string().optional(),
  receiptLinesTaxInclusive: z.boolean().default(true),
  receiptLines: z.array(
    z.object({
      receiptLineType: z.enum(['Sale', 'Discount']),
      receiptLineNo: z.number().min(1),
      receiptLineHSCode: z.string().optional(),
      receiptLineName: z.string().min(1),
      receiptLinePrice: z.number().optional(),
      receiptLineQuantity: z.number().min(0.001),
      receiptLineTotal: z.number(),
      taxCode: z.string().optional(),
      taxPercent: z.number().optional(),
      taxID: z.number().min(1)
    })
  ).min(1),
  receiptTaxes: z.array(
    z.object({
      taxCode: z.string().optional(),
      taxPercent: z.number().optional(),
      taxID: z.number().min(1),
      taxAmount: z.number(),
      salesAmountWithTax: z.number()
    })
  ).min(1),
  receiptPayments: z.array(
    z.object({
      moneyTypeCode: z.enum(['Cash', 'Card', 'MobileWallet', 'Coupon', 'Credit', 'BankTransfer', 'Other']),
      paymentAmount: z.number()
    })
  ).min(1),
  receiptPrintForm: z.enum(['Receipt48', 'InvoiceA4']).default('Receipt48')
});

export function InvoiceForm() {
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      receiptType: 'FiscalInvoice',
      receiptCurrency: 'USD',
      receiptLinesTaxInclusive: true,
      receiptLines: [{
        receiptLineType: 'Sale',
        receiptLineNo: 1,
        receiptLineName: '',
        receiptLineQuantity: 1,
        receiptLineTotal: 0,
        taxID: 1
      }],
      receiptTaxes: [],
      receiptPayments: [{
        moneyTypeCode: 'Cash',
        paymentAmount: 0
      }],
      receiptPrintForm: 'Receipt48'
    }
  });

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    try {
      // Calculate receiptTotal
      const receiptTotal = values.receiptLines.reduce((sum, line) => sum + line.receiptLineTotal, 0);
      
      // Prepare complete invoice data
      const invoiceData = {
        ...values,
        receiptTotal,
        receiptDate: new Date().toISOString(),
        // Add other required fields from session/context
      };

      // Submit to your API
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }

      const result = await response.json();
      // Handle success (redirect, show message, etc.)
      
    } catch (error) {
      console.error('Error submitting invoice:', error);
      // Handle error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Form fields for each part of the invoice */}
        <FormField
          control={form.control}
          name="receiptType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receipt Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select receipt type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="FiscalInvoice">Fiscal Invoice</SelectItem>
                  <SelectItem value="CreditNote">Credit Note</SelectItem>
                  <SelectItem value="DebitNote">Debit Note</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add more fields for buyer data, receipt lines, taxes, payments */}
        
        <Button type="submit">Submit Invoice</Button>
      </form>
    </Form>
  );
}