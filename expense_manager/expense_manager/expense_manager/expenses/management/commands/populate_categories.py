from django.core.management.base import BaseCommand
from expenses.models import ExpenseCategory, IncomeCategory


class Command(BaseCommand):
    help = 'Populate default expense and income categories globally'

    def handle(self, *args, **options):
        # Default expense categories
        expense_categories = [
            'food', 'transport', 'social_life', 'pets', 
            'apparel', 'health', 'education', 'other'
        ]
        
        # Default income categories
        income_categories = [
            'salary', 'allowance', 'bonus', 'other'
        ]
        
        created_expense = 0
        created_income = 0
        
        # Create expense categories
        for category_name in expense_categories:
            expense_category, created = ExpenseCategory.objects.get_or_create(
                name=category_name
            )
            if created:
                created_expense += 1
        
        # Create income categories
        for category_name in income_categories:
            income_category, created = IncomeCategory.objects.get_or_create(
                name=category_name
            )
            if created:
                created_income += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_expense} expense categories and {created_income} income categories globally'
            )
        ) 