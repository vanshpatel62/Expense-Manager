#!/usr/bin/env python
"""
Script to test the charts functionality
"""
import os
import sys
import django
import json

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_manager.settings')
django.setup()

from expenses.models import User, ExpenseCategory, IncomeCategory, Account, Transaction, Expense
from expenses.views import get_expense_chart_data

def test_charts():
    """Test the charts functionality"""
    print("🧪 Testing charts functionality...")
    
    # Get the first user
    users = User.objects.all()
    if not users.exists():
        print("❌ No users found. Please create a user first.")
        return
    
    user = users.first()
    print(f"👤 Testing with user: {user.username}")
    
    # Test the chart data function
    chart_data = get_expense_chart_data(user)
    
    print(f"📊 Chart data generated:")
    print(f"   Labels: {chart_data['labels']}")
    print(f"   Data: {chart_data['data']}")
    print(f"   Colors: {chart_data['colors']}")
    
    # Check if there are any expenses
    total_expenses = Transaction.objects.filter(
        account__user=user, 
        transaction_type='expense'
    ).count()
    
    total_expense_records = Expense.objects.filter(user=user).count()
    
    print(f"💰 Found {total_expenses} expense transactions")
    print(f"💰 Found {total_expense_records} expense records")
    
    if total_expenses == 0 and total_expense_records == 0:
        print("⚠️  No expense data found. The chart will be empty.")
        print("💡 Add some expense transactions to see the chart in action!")
    else:
        print("✅ Chart data is ready!")
    
    # Test JSON serialization (for JavaScript)
    try:
        json_data = json.dumps(chart_data)
        print("✅ Chart data can be serialized to JSON for JavaScript")
    except Exception as e:
        print(f"❌ Error serializing chart data: {e}")
    
    print("\n🎉 Charts test completed!")

def create_sample_data():
    """Create sample data for testing charts"""
    print("🔧 Creating sample data for charts...")
    
    # Get or create a user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={'email': 'test@example.com'}
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"✅ Created test user: {user.username}")
    else:
        print(f"✅ Using existing user: {user.username}")
    
    # Get or create an account
    account, created = Account.objects.get_or_create(
        user=user,
        account_name='Test Account',
        defaults={'account_type': 'checking', 'current_balance': 1000}
    )
    
    if created:
        print(f"✅ Created test account: {account.account_name}")
    else:
        print(f"✅ Using existing account: {account.account_name}")
    
    # Get expense categories
    categories = ExpenseCategory.objects.all()
    if not categories.exists():
        print("❌ No expense categories found. Please run the category setup first.")
        return
    
    # Create sample expense transactions
    sample_expenses = [
        ('Food', 150),
        ('Transport', 80),
        ('Health', 200),
        ('Food', 75),
        ('Social Life', 120),
    ]
    
    created_count = 0
    for category_name, amount in sample_expenses:
        category = categories.filter(name=category_name).first()
        if category:
            transaction, created = Transaction.objects.get_or_create(
                account=account,
                transaction_type='expense',
                expense_category=category,
                amount=amount,
                description=f'Sample {category_name} expense',
                defaults={'transaction_date': '2024-01-15'}
            )
            if created:
                created_count += 1
                print(f"✅ Created expense: {category_name} - ${amount}")
    
    print(f"🎉 Created {created_count} sample expense transactions!")

def main():
    print("🚀 Testing charts functionality...")
    
    # Create sample data if needed
    create_sample_data()
    
    # Test charts
    test_charts()
    
    print("\n🎉 All tests completed!")

if __name__ == '__main__':
    main() 