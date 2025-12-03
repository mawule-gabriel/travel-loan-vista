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
    
    if (cleaned.startsWith('233') && cleaned.length === 12) {
        return cleaned;
    }
    
    if (cleaned.length === 10 && /^[2-5]/.test(cleaned)) {
        return '233' + cleaned;
    }
    
    if (cleaned.length === 9 && /^[2-5]/.test(cleaned)) {
        return '233' + cleaned;
    }
    
    throw new Error('Invalid Ghana phone number format. Expected: 233XXXXXXXXX or 0XXXXXXXXX');
};