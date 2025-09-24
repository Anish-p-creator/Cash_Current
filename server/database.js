// A simple in-memory "database" for the hackathon.
// In a real app, you would replace this with MongoDB, PostgreSQL, etc.
class InMemoryDatabase {
    constructor() {
        this.accounts = [
             // Some mock data to make the UI look good initially
            { accountName: 'Emergency Fund', balance: 8950.15, accountNumber: '...5678' },
            { accountName: 'Rewards Card', balance: 1250.75, accountNumber: '...4321' },
        ];
        this.transactions = [
             // Mock data
            { date: 'Sep 24', description: 'Whole Foods Market', amount: -95.45, category: 'Groceries' },
            { date: 'Sep 24', description: 'Payroll Deposit', amount: 2500, category: 'Income' },
        ];
    }

    addAccount(account) {
        // Avoid adding duplicate accounts
        if (!this.accounts.some(a => a.accountNumber === account.accountNumber)) {
            this.accounts.push(account);
        }
    }

    addTransaction(transaction) {
        // A real implementation would check for duplicate transactions
        this.transactions.push(transaction);
    }

    getAccounts() {
        return this.accounts;
    }

    getTransactions() {
        // Sort by date descending (most recent first)
        return this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// Export a singleton instance so the whole app shares one database.
const db = new InMemoryDatabase();

module.exports = { db };