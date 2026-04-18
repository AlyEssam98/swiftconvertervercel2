export interface ErrorCode {
  code: string;
  title: string;
  description: string;
  fix: string;
}

export const errorCodes: ErrorCode[] = [
  {
    code: 't64',
    title: 'T64 - BIC / Address Validation Error',
    description: 'The T64 error occurs when an institution or clearing code fails BIC validation in SWIFT MT formats.',
    fix: 'Ensure that field 52A, 56A, or 57A contains a valid registered BIC code. When migrating to MX, this maps to proper nested Agent elements.'
  },
  {
    code: 'u03',
    title: 'U03 - Invalid IBAN Format',
    description: 'The U03 error is triggered when the provided account number does not conform to standard IBAN structure for the destination country.',
    fix: 'Verify the country code and checksum of the IBAN in field 59. In MX (pacs.008), this must be strictly formatted under the CreditorAccount <Id><IBAN> element.'
  },
  {
    code: 'c03',
    title: 'C03 - Value Date Mismatch',
    description: 'The C03 error indicates a mismatch between the value date specified in the message and the allowed value date rules for the currency.',
    fix: 'Check the currency holidays and weekend rules for the currency in field 32A. ISO 20022 schemas strictly validate the InterbankSettlementDate format.'
  }
];

export function getErrorCode(code: string): ErrorCode | undefined {
  return errorCodes.find(e => e.code.toLowerCase() === code.toLowerCase());
}

export function getAllErrorCodes(): ErrorCode[] {
  return errorCodes;
}
