# Category System for Expense Manager

## Overview
This update adds a comprehensive category system for both expenses and income transactions, with support for transfer transactions between accounts. **Categories are now shared across all users** - when one user creates a category, it becomes available to all users.

## New Features

### 1. Expense Categories
Predefined expense categories:
- Food
- Transport
- Social Life
- Pets
- Apparel
- Health
- Education
- Other

### 2. Income Categories
Predefined income categories:
- Salary
- Allowance
- Bonus
- Other

### 3. Transaction Types
The system now supports three transaction types:

#### Income Transactions
- Select "Income" as transaction type
- Choose an income category from the dropdown
- Amount is added to the account balance

#### Expense Transactions
- Select "Expense" as transaction type
- Choose an expense category from the dropdown
- Amount is subtracted from the account balance

#### Transfer Transactions
- Select "Transfer" as transaction type
- Choose a destination account from the dropdown
- Amount is moved from source account to destination account

## Dynamic Form Behavior

### Add/Edit Transaction Form
- **Transaction Type Dropdown**: Controls which additional fields are displayed
- **Income Category**: Only shown when "Income" is selected
- **Expense Category**: Only shown when "Expense" is selected
- **To Account**: Only shown when "Transfer" is selected

### JavaScript Functionality
The form uses JavaScript to dynamically show/hide fields based on the selected transaction type:
- When "Income" is selected: Shows income category dropdown
- When "Expense" is selected: Shows expense category dropdown
- When "Transfer" is selected: Shows destination account dropdown

## Database Changes

### New Models
1. **ExpenseCategory**: Stores shared expense categories (available to all users)
2. **IncomeCategory**: Stores shared income categories (available to all users)

### Updated Models
1. **Transaction**: Added fields for new category system
   - `expense_category`: ForeignKey to ExpenseCategory
   - `income_category`: ForeignKey to IncomeCategory
   - `to_account`: ForeignKey to Account (for transfers)

## Shared Category System

### Key Features
- **Global Categories**: All categories are shared across all users
- **No Duplicates**: Each category name is unique across the entire system
- **Automatic Availability**: When a user creates a new category, it's immediately available to all users
- **Consistent Experience**: All users see the same set of categories

### Benefits
- **Collaboration**: Users can see what categories others are using
- **Consistency**: Standardized category names across the platform
- **Efficiency**: No need to recreate the same categories for each user
- **Discovery**: Users can discover useful categories created by others

## Setup Instructions

### 1. Run Migrations
```bash
python manage.py migrate
```

### 2. Populate Default Categories
```bash
python manage.py populate_categories
```

Or run the setup script:
```bash
python setup_categories.py
```

### 3. For New Users
Default categories are automatically created when the first user registers.

## Usage

### Adding Transactions
1. Go to "Add Transaction" page
2. Select transaction type (Income/Expense/Transfer)
3. Fill in required fields based on transaction type
4. Submit the form

### Managing Categories
1. Go to "Categories" page
2. View existing expense and income categories (shared across all users)
3. Add new categories if needed (will be available to all users)

### Viewing Transactions
- Transactions list shows appropriate category information
- Income transactions show income category
- Expense transactions show expense category
- Transfer transactions show destination account

## Technical Implementation

### Models
- `ExpenseCategory`: Shared expense categories with predefined choices
- `IncomeCategory`: Shared income categories with predefined choices
- Updated `Transaction` model with new category fields

### Forms
- `TransactionForm`: Dynamic form with conditional field display
- `ExpenseCategoryForm`: Form for adding expense categories
- `IncomeCategoryForm`: Form for adding income categories

### Views
- Updated transaction views to handle new category system
- Added views for managing expense and income categories
- Automatic category creation for new users

### Templates
- Dynamic transaction forms with JavaScript
- Updated transaction list to show appropriate category information
- Separate category management pages

## Benefits
1. **Better Organization**: Transactions are properly categorized
2. **Improved Reporting**: Can generate reports by category
3. **User-Friendly**: Dynamic forms reduce confusion
4. **Flexible**: Support for transfers between accounts
5. **Scalable**: Easy to add new categories in the future
6. **Shared Knowledge**: Categories are shared across all users
7. **Consistency**: Standardized category system across the platform 