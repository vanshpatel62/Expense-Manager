#!/usr/bin/env python
"""
Script to fix transfer transactions that have the same source and destination account
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_manager.settings')
django.setup()

from django.db import models
from expenses.models import Transaction

def fix_same_account_transfers():
    """Fix transactions where source and destination accounts are the same"""
    print("🔧 Fixing same account transfers...")
    
    # Find transactions where account == to_account
    problematic_transactions = Transaction.objects.filter(
        transaction_type='transfer',
        account=models.F('to_account')
    )
    
    print(f"Found {problematic_transactions.count()} problematic transfer transactions")
    
    fixed_count = 0
    for transaction in problematic_transactions:
        print(f"Fixing transaction {transaction.id}: {transaction.account} -> {transaction.to_account}")
        
        # Revert the balance changes
        transaction.account.current_balance += transaction.amount
        transaction.account.save()
        
        # Delete the transaction
        transaction.delete()
        fixed_count += 1
    
    print(f"✅ Fixed {fixed_count} problematic transfer transactions")

def main():
    print("🚀 Fixing transfer transaction issues...")
    fix_same_account_transfers()
    print("🎉 Transfer issue fix completed!")

if __name__ == '__main__':
    main() 