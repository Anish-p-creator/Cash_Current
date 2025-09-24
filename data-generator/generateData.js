import { faker } from '@faker-js/faker';
import fs from 'fs-extra';

const transactions = [];
const today = new Date();
// Set the start date to 18 months before today
const startDate = new Date(new Date().setMonth(today.getMonth() - 18));

// Generate about 30 transactions per month for 18 months
for (let i = 0; i < 540; i++) {
    transactions.push({
        id: faker.string.uuid(),
        date: faker.date.between({ from: startDate, to: today }),
        amount: faker.finance.amount({ min: 5, max: 1000, dec: 2 }),
        merchant: faker.company.name(),
        category: faker.commerce.department()
    });
}

// We write the file to the parent directory (the project root)
// so our mock server can easily find it later.
fs.writeJsonSync('../db.json', { transactions }, { spaces: 2 });

console.log('✅ Success! db.json has been created in your main project folder.');