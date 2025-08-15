from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
import re


class User(AbstractUser):
    # Override username field to remove default validation
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, numbers, spaces, and common symbols allowed.'),
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_('The groups this user belongs to.'),
        related_name='expense_user_set',
        related_query_name='user'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='expense_user_set',
        related_query_name='user'
    )

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    currency = models.CharField(max_length=3, default='INR')
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Account(models.Model):
    ACCOUNT_TYPES = (
        ('cash', 'Cash'),
        ('bank', 'Bank Account'),
        ('credit', 'Credit Card'),
        ('investment', 'Investment'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_type = models.CharField(max_length=10, choices=ACCOUNT_TYPES)
    account_name = models.CharField(
        max_length=100,
        validators=[
            RegexValidator(
                regex=r'.*[a-zA-Z].*',
                message='Account name must contain at least one letter.',
                code='no_alphabets'
            )
        ]
    )
    current_balance = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        if self.account_name and not re.search(r'[a-zA-Z]', self.account_name):
            from django.core.exceptions import ValidationError
            raise ValidationError({'account_name': 'Account name must contain at least one letter.'})

    def __str__(self):
        return f"{self.account_name} ({self.get_account_type_display()})"


class ExpenseCategory(models.Model):
    EXPENSE_CATEGORIES = (
        ('food', 'Food'),
        ('transport', 'Transport'),
        ('social_life', 'Social Life'),
        ('pets', 'Pets'),
        ('apparel', 'Apparel'),
        ('health', 'Health'),
        ('education', 'Education'),
        ('other', 'Other'),
    )
    
    name = models.CharField(max_length=20, choices=EXPENSE_CATEGORIES, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Expense Categories"

    def __str__(self):
        return self.get_name_display()


class IncomeCategory(models.Model):
    INCOME_CATEGORIES = (
        ('salary', 'Salary'),
        ('allowance', 'Allowance'),
        ('bonus', 'Bonus'),
        ('other', 'Other'),
    )
    
    name = models.CharField(max_length=20, choices=INCOME_CATEGORIES, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Income Categories"

    def __str__(self):
        return self.get_name_display()


class TransactionCategory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    is_income = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('transfer', 'Transfer'),
    )
    
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    transaction_date = models.DateField()
    # For income and expense transactions
    expense_category = models.ForeignKey(ExpenseCategory, on_delete=models.SET_NULL, null=True, blank=True)
    income_category = models.ForeignKey(IncomeCategory, on_delete=models.SET_NULL, null=True, blank=True)
    # For transfer transactions
    to_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='transfers_to')
    # Legacy field for backward compatibility
    category = models.ForeignKey(TransactionCategory, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.transaction_type == 'transfer':
            return f"Transfer {self.amount} from {self.account} to {self.to_account}"
        elif self.transaction_type == 'expense':
            return f"Expense {self.amount} - {self.expense_category}"
        elif self.transaction_type == 'income':
            return f"Income {self.amount} - {self.income_category}"
        return f"{self.get_transaction_type_display()} - {self.amount}"


class Category(models.Model):
    CATEGORY_CHOICES = (
        ('food', 'Food'),
        ('clothes', 'Clothes'),
        ('transport', 'Transport'),
        ('entertainment', 'Entertainment'),
        ('health', 'Health'),
        ('education', 'Education'),
        ('utilities', 'Utilities'),
        ('others', 'Others'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.get_name_display()


class Expense(models.Model):
    PAYMENT_METHODS = (
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('other', 'Other'),
    )
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.amount} - {self.category}"
