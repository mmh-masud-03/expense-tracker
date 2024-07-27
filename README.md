# FinTrack

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

FinTrack is a comprehensive finance management application built with Next.js. It helps users manage their budgets, track expenses, record income, and set savings goals with ease. The application offers a user-friendly interface, detailed reports, and real-time insights into financial health.

## Features

- **User Authentication:** Secure registration and login functionality.
- **Budget Management:** Create, read, update, and delete budgets with amount, month, and year.
- **Expense Tracking:** Track expenses with title, amount, category, and date.
- **Income Recording:** Manage income sources with title, amount, category, and date.
- **Savings Plans:** Set and track savings goals with goal title, goal amount, saved amount, and target date.
- **Dashboard:** Real-time balance overview, total income and expense, savings plan, recent transactions, budget vs. actual expense graph, and income vs. expense graph.
- **Expense Page:** Overview of total expenses, top expense categories, and a table with CRUD operations, pagination, sorting, search, and filter by category.
- **Income Page:** Similar to the expense page with income-specific features.
- **Budget Page:** Overview of total budget and remaining budget, line graph of remaining budget percentage, and a table with CRUD operations, pagination, sorting, and filtering by month and year.
- **All Transactions Page:** Overviews of income, expenses, budgets, top categories, savings rate, and detailed tables for each financial entry.
- **Reports Page:** Income and expense components with date range selection, total and top category display, bar and pie charts, and PDF download button.
- **Add Finance Button:** Accessible from every page to add income, expenses, budgets, or savings easily.
- **Notifications:** Alerts when expenses exceed budget or income.

## Screenshots

### Dashboard

![Dashboard](/public/images/dashboard.png)

### Transactions Page

![Transactions Summary](/public/images/transactions1.png)
![Transactions Summary](/public/images/transactions2.png)

### Reports Page

![Income Report](/public/images/income-report.png)
![Expense Report](/public/images/expense-report.png)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mmh-masud-03/expense-tracker.git
   cd your-repo-name
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your environment variables.

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

- Register a new account or log in with an existing account.
- Navigate through the dashboard to get an overview of your financial status.
- Use the Add Finance button to quickly add new income, expenses, budgets, or savings goals.
- View and manage detailed entries for income, expenses, budgets, and savings in their respective pages.
- Generate and download detailed reports in the Reports section.

## Technologies Used

- **Next.js:** React framework for building the application.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **MongoDB:** NoSQL database for storing financial data.
- **Mongoose:** ODM for MongoDB.
- **SWR:** React Hooks library for data fetching.
- **Framer Motion:** Library for animations.
- **React Icons:** Icons for various UI components.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, feel free to reach out to me at [masud20.bup@gmail.com](mailto:masud20.bup@gmail.com).
