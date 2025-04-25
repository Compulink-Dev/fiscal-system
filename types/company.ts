// types/company.ts
export interface Company {
    id: string;
    _id: string;
    name: string;
    tradeName: string;
    tin: string;
    vatNumber: string;
    station: string;
    accountingSystem: string;
    address: {
      street: string;
      houseNo: string;
      city: string;
      province: string;
    };
    contacts: {
      phoneNo: string;
      email: string;
      mobile: string;
    };
  }


  export interface CompaniesResponse {
    success: boolean;
    companies?: Company[];
    error?: string;
  }