export interface PendingCreditPurchase {
  credits: number;
  baselineBalance: number;
  timestamp: number;
}

const STORAGE_KEY = 'pending_credit_purchase';

export const savePendingCreditPurchase = (purchase: PendingCreditPurchase) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchase));
};

export const loadPendingCreditPurchase = (): PendingCreditPurchase | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  
  try {
    const purchase = JSON.parse(data) as PendingCreditPurchase;
    // Expire after 1 hour
    if (Date.now() - purchase.timestamp > 3600000) {
      clearPendingCreditPurchase();
      return null;
    }
    return purchase;
  } catch (e) {
    return null;
  }
};

export const clearPendingCreditPurchase = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};
