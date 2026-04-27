/**
 * Triggers the Lemon Squeezy checkout overlay.
 * Uses a dynamic button click approach which is more reliable than direct Url.Open()
 * as it allows the Lemon Squeezy library to handle initialization and iframe creation.
 * 
 * @param checkoutUrl The Lemon Squeezy checkout URL (should include embed=1)
 */
export async function openLemonSqueezyCheckout(checkoutUrl: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    let ls = window.LemonSqueezy;

    // If not found immediately, wait up to 1 second
    if (!ls) {
        console.log("Lemon Squeezy: Object not found, waiting...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        ls = window.LemonSqueezy;
    }

    if (!ls) {
        console.warn("Lemon Squeezy: Script not available, falling back to direct redirect.");
        window.location.href = checkoutUrl;
        return false;
    }

    // Ensure embed=1 is present
    let url = checkoutUrl;
    if (!url.includes('embed=1')) {
        url += url.includes('?') ? '&embed=1' : '?embed=1';
    }

    console.log("Lemon Squeezy: Triggering checkout overlay");
    
    // Create a temporary link with the required class
    const link = document.createElement('a');
    link.href = url;
    link.className = 'lemonsqueezy-button';
    link.style.display = 'none';
    document.body.appendChild(link);
    
    try {
        // Refresh to scan the new link and then click it
        ls.Refresh();
        link.click();
        return true;
    } catch (e) {
        console.error("Lemon Squeezy: Failed to open overlay", e);
        window.location.href = url;
        return false;
    } finally {
        // Clean up
        setTimeout(() => {
            if (document.body.contains(link)) {
                document.body.removeChild(link);
            }
        }, 1000);
    }
}
