const MoneroWallet = require('monero-javascript');

class Wallet {
    constructor() {
        this.wallet = new MoneroWallet();
        this.address = '';
        this.balance = 0;
        this.transactions = [];
    }

    async createWallet() {
        this.wallet = await MoneroWallet.createWallet();
        this.address = await this.wallet.getAddress();
        console.log(`Wallet Address: ${this.address}`);
    }

    async getBalance() {
        this.balance = await this.wallet.getBalance();
        console.log(`Balance: ${this.balance}`);
        return this.balance;
    }

    async getTransactionHistory() {
        this.transactions = await this.wallet.getTransactions();
        console.log(`Transaction History: ${JSON.stringify(this.transactions)}`);
        return this.transactions;
    }
}

module.exports = Wallet;