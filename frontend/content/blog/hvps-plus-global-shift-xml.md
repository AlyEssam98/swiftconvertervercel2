---
title: "High-Value Payment Systems (HVPS+): The Global Shift to XML"
description: "An overview of how domestic RTGS systems like CHAPS, TARGET2, and Fedwire are migrating to ISO 20022 and what it means for banks."
date: "2026-04-18"
author: "SwiftMX Bridge Strategy"
readTime: "4 min read"
---

## Beyond SWIFT: The Domestic Migration

While the SWIFT CBPR+ migration often dominates headlines, there is an equally massive migration occurring domestically. **High-Value Payment Systems (HVPS)**—the Real-Time Gross Settlement (RTGS) rails operated by central banks—are all shifting to ISO 20022.

*   **Europe (TARGET2)**: Migrated in March 2023.
*   **UK (CHAPS)**: Migrated in June 2023.
*   **US (Fedwire/CHIPS)**: Migrating in March 2024 (CHIPS) and March 2025 (Fedwire).

## What is HVPS+?

Just as CBPR+ defines the rules for cross-border ISO 20022 payments, **HVPS+** defines the global usage guidelines for domestic high-value clearings. 

The goal of HVPS+ is harmonization. Historically, every domestic RTGS used a proprietary format (e.g., Fedwire's FAIM format). A bank operating globally had to maintain a dozen different parsers. Under HVPS+, CHAPS, TARGET2, and Fedwire will all use standard `pacs.008` and `pacs.009` XML messages, structurally identical to cross-border SWIFT messages.

## The Coexistence Chaos

For global banks, the differing timelines create a nightmare. 
A bank might receive a cross-border `pacs.008` from Europe via SWIFT, but must settle it domestically via US Fedwire, which (until 2025) still requires a legacy flat-file format.

### The Solution: A Unified Gateway
Banks cannot afford to build hardcoded translations for every possible combination (e.g., SWIFT MX to Fedwire Legacy, CHAPS MX to SWIFT MT). 

Instead, institutions must deploy a centralized routing and translation engine like **SwiftMX Bridge**. By speaking all dialects of MT and MX natively, the engine can intercept a message from any rail, map the data into a canonical internal model, and instantly output the correct format required by the destination rail—be it CBPR+, HVPS+, or legacy MT.
