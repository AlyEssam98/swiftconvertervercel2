export interface FieldMapping {
  tag: string;
  name: string;
  mxPath: string;
  description: string;
  example: string;
}

export const mt103Mappings: FieldMapping[] = [
  {
    tag: "20",
    name: "Sender's Reference",
    mxPath: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/InstrId",
    description: "In ISO 20022, the Sender's Reference (Field 20) typically maps to the Instruction Identification. It must be unique within the business day.",
    example: "<InstrId>ABC/123/XYZ</InstrId>"
  },
  {
    tag: "32A",
    name: "Value Date / Currency / Amount",
    mxPath: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt",
    description: "The Value Date and Amount map to the Interbank Settlement Amount. The currency is handled as an attribute (Ccy) of the amount element.",
    example: '<IntrBkSttlmAmt Ccy="USD">10000.00</IntrBkSttlmAmt>\n<IntrBkSttlmDt>2023-10-15</IntrBkSttlmDt>'
  },
  {
    tag: "50A/K",
    name: "Ordering Customer (Debtor)",
    mxPath: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr",
    description: "The Ordering Customer maps to the Debtor. MX requires structured data (Name, PostalAddress) which often requires parsing the unstructured MT lines.",
    example: "<Dbtr>\n  <Nm>John Doe</Nm>\n  <PstlAdr>\n    <Ctry>US</Ctry>\n    <TwnNm>New York</TwnNm>\n  </PstlAdr>\n</Dbtr>"
  },
  {
    tag: "57A",
    name: "Account With Institution (Creditor Agent)",
    mxPath: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt",
    description: "Field 57A maps to the Creditor Agent. This is the financial institution where the beneficiary holds their account.",
    example: "<CdtrAgt>\n  <FinInstnId>\n    <BICFI>BANKUS33XXX</BICFI>\n  </FinInstnId>\n</CdtrAgt>"
  },
  {
    tag: "59",
    name: "Beneficiary Customer (Creditor)",
    mxPath: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr",
    description: "The Beneficiary maps to the Creditor. The account number (IBAN or otherwise) is placed in the CreditorAccount (CdtrAcct) element.",
    example: "<Cdtr>\n  <Nm>Jane Smith</Nm>\n</Cdtr>\n<CdtrAcct>\n  <Id>\n    <IBAN>US1234567890123456</IBAN>\n  </Id>\n</CdtrAcct>"
  },
  {
    tag: "70",
    name: "Remittance Information",
    mxPath: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Ustrd",
    description: "Free-text remittance info (Field 70) maps to the Unstructured (Ustrd) element under Remittance Information.",
    example: "<RmtInf>\n  <Ustrd>Invoice #9982 - Consulting Services</Ustrd>\n</RmtInf>"
  },
  {
    tag: "71A",
    name: "Details of Charges",
    mxPath: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/ChrgBr",
    description: "Charge codes map to a specific enumeration: OUR -> DEBT, BEN -> CRED, SHA -> SHAR.",
    example: "<ChrgBr>SHAR</ChrgBr>"
  }
];

export function getFieldMapping(tag: string): FieldMapping | undefined {
  return mt103Mappings.find(m => m.tag.replace('/', '') === tag.replace('/', ''));
}
