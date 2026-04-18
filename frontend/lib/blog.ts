export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'mt103-vs-pacs008-mapping-guide',
    title: 'MT103 vs pacs.008: A Detailed Field-by-Field Mapping Guide',
    description: 'Learn exactly how to map legacy SWIFT MT103 fields to the ISO 20022 pacs.008 format to ensure CBPR+ compliance.',
    date: '2026-04-18',
    author: 'SwiftMX Bridge Engineering',
    readTime: '6 min read',
    content: `
## The Shift to ISO 20022

The financial world is undergoing its biggest messaging transformation in decades. By November 2025, the legacy SWIFT MT (Message Type) format will be fully deprecated for cross-border payments, replaced by the data-rich ISO 20022 XML standard.

For engineers and payment teams, the most critical piece of this puzzle is translating the ubiquitous **MT103 (Single Customer Credit Transfer)** into the new **pacs.008 (FIToFICustomerCreditTransfer)**.

In this guide, we'll break down the core field mappings to help you avoid NACKs (Negative Acknowledgments) and ensure CBPR+ compliance.

---

## Core Principles of MT to MX Translation

Unlike MT messages, which rely on strict block structures and positional tags (e.g., \`50K\`, \`59A\`), ISO 20022 uses a nested XML hierarchy. This means a single line in an MT message often expands into a deeply nested set of XML elements in a pacs.008.

### 1. The Sender and Receiver (Header)
In MT103, routing info is placed in the Basic Header (Block 1) and Application Header (Block 2). 
In MX, this translates to the Business Application Header (BAH - \`head.001.001.01\`), which is completely decoupled from the main \`pacs.008\` payload.

### 2. Transaction Reference (Field 20)
*   **MT103**: \`:20:Sender's Reference\` (16 chars max)
*   **pacs.008**: Maps to the \`<InstrId>\` (Instruction Identification) under \`<CdtTrfTxInf>\`. 
*   *Note*: The End-to-End ID (\`<EndToEndId>\`), which is mandatory in MX, often requires generation if not explicitly provided in the MT or is mapped from field \`:21:\` (Related Reference).

---

## Field-by-Field Mapping Matrix

Here is a simplified look at how the most common MT103 fields map to pacs.008 elements:

| MT103 Tag | MT Field Name | pacs.008 XML Element Path | Notes |
| :--- | :--- | :--- | :--- |
| **32A** | Value Date / Currency / Amount | \`<IntrBkSttlmAmt>\` & \`<IntrBkSttlmDt>\` | In MX, the currency is an attribute of the amount element (\`Ccy="USD"\`). |
| **50A/K** | Ordering Customer | \`<Dbtr>\` (Debtor) | MX requires structured addressing (TownName, Ctry) if available, whereas MT is often unstructured text. |
| **52A/D** | Ordering Institution | \`<DbtrAgt>\` (Debtor Agent) | Must be validated against the BIC directory. |
| **59A/No letter** | Beneficiary Customer | \`<Cdtr>\` (Creditor) & \`<CdtrAcct>\` | Account numbers must be split into the \`<Id>\` elements (IBAN or BBAN). |
| **70** | Remittance Information | \`<RmtInf>\` / \`<Ustrd>\` | MX supports 140 chars per unstructured block, but highly structured remittance is preferred (\`<Strd>\`). |
| **71A** | Details of Charges (OUR/BEN/SHA) | \`<ChrgBr>\` (Charge Bearer) | Maps directly to enum values: \`DEBT\` (OUR), \`CRED\` (BEN), \`SHAR\` (SHA). |

---

## The "Data Truncation" Problem

One of the biggest headaches developers face when building their own parsers is data truncation. ISO 20022 fields are often longer than their MT counterparts. For example, a name field in MX can hold up to 140 characters, while MT limits it to 4x35 blocks. 

However, when converting *from* MT *to* MX, you generally won't lose data. The challenge is strictly parsing the unstructured MT blocks (like Field 50K) into the highly structured \`<PstlAdr>\` (Postal Address) required by CBPR+ rules.

### How SwiftMX Bridge Solves This
Building a resilient parser requires thousands of test cases. SwiftMX Bridge uses a proprietary NLP engine to accurately extract structured data (City, Country, Street) from unstructured MT fields, ensuring your pacs.008 passes strict CBPR+ schema validation.

## Conclusion

Migrating from MT103 to pacs.008 is not a simple 1:1 data mapping exercise; it requires a deep understanding of CBPR+ business rules. By using a validated conversion API like SwiftMX Bridge, your engineering team can skip months of development and focus on core banking features.
    `
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}
