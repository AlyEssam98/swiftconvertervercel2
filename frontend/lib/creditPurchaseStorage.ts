const PENDING_CREDIT_PURCHASE_KEY = 'pending_credit_purchase';

export interface PendingCreditPurchase {
    packageId: string;
    credits: number;
    baselineBalance: number;
    startedAt: string;
}

const hasWindow = () => typeof window !== 'undefined';

export const savePendingCreditPurchase = (purchase: PendingCreditPurchase) => {
    if (!hasWindow()) {
        return;
    }

    sessionStorage.setItem(PENDING_CREDIT_PURCHASE_KEY, JSON.stringify(purchase));
};

export const loadPendingCreditPurchase = (): PendingCreditPurchase | null => {
    if (!hasWindow()) {
        return null;
    }

    const rawPurchase = sessionStorage.getItem(PENDING_CREDIT_PURCHASE_KEY);
    if (!rawPurchase) {
        return null;
    }

    try {
        const parsedPurchase = JSON.parse(rawPurchase) as Partial<PendingCreditPurchase>;
        if (
            typeof parsedPurchase.packageId !== 'string' ||
            typeof parsedPurchase.credits !== 'number' ||
            typeof parsedPurchase.baselineBalance !== 'number' ||
            typeof parsedPurchase.startedAt !== 'string'
        ) {
            return null;
        }

        return {
            packageId: parsedPurchase.packageId,
            credits: parsedPurchase.credits,
            baselineBalance: parsedPurchase.baselineBalance,
            startedAt: parsedPurchase.startedAt,
        };
    } catch {
        return null;
    }
};

export const clearPendingCreditPurchase = () => {
    if (!hasWindow()) {
        return;
    }

    sessionStorage.removeItem(PENDING_CREDIT_PURCHASE_KEY);
};
