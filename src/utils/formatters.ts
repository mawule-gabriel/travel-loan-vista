export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-GH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(dateObj);
};

export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('233')) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    if (cleaned.length === 10) {
        return `+233 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
};

export const formatGhanaCard = (cardNumber: string): string => {
    return cardNumber.toUpperCase();
};

export const normalizePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    
    // Already in international format: 233XXXXXXXXX (12 digits)
    if (cleaned.startsWith('233') && cleaned.length === 12) {
        return cleaned;
    }
    
    // Local format with leading 0: 0XXXXXXXXX (10 digits)
    // Strip the 0 and prepend 233
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
        const withoutZero = cleaned.substring(1);
        if (/^[2-5]/.test(withoutZero)) {
            return '233' + withoutZero;
        }
    }
    
    // 9 digits starting with 2-5 (no country code, no leading 0)
    if (cleaned.length === 9 && /^[2-5]/.test(cleaned)) {
        return '233' + cleaned;
    }
    
    throw new Error('Invalid Ghana phone number format. Expected: 233XXXXXXXXX or 0XXXXXXXXX');
};