export class LocalizationService {
    private locales: Map<string, Record<string, string>> = new Map();
    private currentLocale: string = 'ar';

    public setLocale(locale: string) {
        this.currentLocale = locale;
    }

    public loadMessages(locale: string, messages: Record<string, string>) {
        this.locales.set(locale, { ...(this.locales.get(locale) || {}), ...messages });
    }

    public trans(key: string, params: Record<string, any> = {}): string {
        const messages = this.locales.get(this.currentLocale) || {};
        let message = messages[key] || key;

        // Simple parameter substitution :param
        for (const [param, value] of Object.entries(params)) {
            message = message.replace(new RegExp(`:${param}`, 'g'), String(value));
        }

        return message;
    }

    // Helper to flatten nested JSON objects (common in i18n files)
    public static flatten(data: any, prefix = ''): Record<string, string> {
        let result: Record<string, string> = {};
        for (const key in data) {
            const value = data[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null) {
                Object.assign(result, LocalizationService.flatten(value, newKey));
            } else {
                result[newKey] = String(value);
            }
        }
        return result;
    }
}
