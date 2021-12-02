const db = {
    save(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get<T>(key: string, defaultValue:any = {}): T {
        return JSON.parse(localStorage.getItem(key) as any) || defaultValue;
    },
    remove(key: string): void {
        localStorage.removeItem(key);
    },
    clear(): void {
        localStorage.clear();
    }
};

export default db;
