---
title: "MT202COV vs pacs.009.COV: Handling Cover Payments"
description: "Navigate the complexities of migrating SWIFT cover payments from the legacy MT202COV format to the new pacs.009 ADV."
date: "2026-04-18"
author: "SwiftMX Bridge Engineering"
readTime: "6 min read"
---

## What is a Cover Payment?

In correspondent banking, a **Cover Payment** is used when the ordering bank and the beneficiary bank do not have a direct account relationship. The payment is split into two tracks:
1. The primary instruction (e.g., an MT103) sent directly to the beneficiary bank.
2. The "cover" (the actual movement of funds) sent through intermediary correspondent banks.

In the legacy MT world, the cover payment is sent via an **MT202 COV**.

## The ISO 20022 Equivalent: pacs.009 ADV

Under ISO 20022 and CBPR+, the MT202 COV maps to the **pacs.009 Financial Institution Credit Transfer**. Specifically, it uses a specialized variant known as `pacs.009 ADV` (Advanced).

### The Critical Difference: Underlying Customer Data
Before 2009, standard MT202s were used for cover payments, which hid the underlying customer data from intermediary banks. This was a massive money-laundering risk. The MT202 COV was introduced to mandate the inclusion of the underlying MT103 data (Fields 50, 52, 59, 70).

In the `pacs.009 ADV`, this concept is enforced structurally via the `<UndrlygCstmrCdtTrf>` (Underlying Customer Credit Transfer) XML block.

## Key Mapping Challenges

When converting from MT202 COV to `pacs.009 ADV`, developers must handle nested complexities:

### 1. Sequence B Mapping
The MT202 COV contains a "Sequence B" block, which is essentially a mini-MT103 containing the customer details. 
Your translator must parse the primary MT202 routing data into the main `pacs.009` header, and simultaneously parse the Sequence B block into the deeply nested `<UndrlygCstmrCdtTrf>` structure.

### 2. UETR Synchronization
Both the MT103 and the MT202 COV *must* carry the exact same UETR (Unique End-to-End Transaction Reference) for SWIFT gpi tracking. When generating the `pacs.009 ADV`, the engine must ensure the `<UETR>` element identically matches the primary `pacs.008`.

Using a specialized API like **SwiftMX Bridge** simplifies this process immensely. You submit the MT202 COV string, and the engine automatically handles the bifurcated mapping logic, guaranteeing CBPR+ compliance for your most complex correspondent flows.
