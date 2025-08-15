from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.exceptions import ValidationError
import re
from .models import *


class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Username'
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Password'
    }))


class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form-control',
        'placeholder': 'Email'
    }))
    phone = forms.CharField(max_length=15, required=False, widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Phone (optional)'
    }))
    address = forms.CharField(widget=forms.Textarea(attrs={
        'class': 'form-control',
        'placeholder': 'Address (optional)',
        'rows': 3
    }), required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'address', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Username'
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Custom help text for username
        self.fields['username'].help_text = 'Required. Letters, numbers, spaces, and common symbols allowed.'
        self.fields['password1'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Password'
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Confirm Password'
        })


class DateInput(forms.DateInput):
    input_type = 'date'


class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ['account_type', 'account_name', 'current_balance']
        widgets = {
            'account_type': forms.Select(attrs={'class': 'form-select'}),
            'account_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter account name'
            }),
            'current_balance': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': '0.00',
                'step': '0.01'
            }),
        }

    def clean_account_name(self):
        account_name = self.cleaned_data.get('account_name')
        if account_name and not re.search(r'[a-zA-Z]', account_name):
            raise ValidationError('Account name must contain at least one letter.')
        return account_name


class TransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'account', 'amount', 'description', 'transaction_date', 
                 'expense_category', 'income_category', 'to_account']
        widgets = {
            'transaction_date': DateInput(),
            'account': forms.Select(attrs={'class': 'form-select'}),
            'transaction_type': forms.Select(attrs={'class': 'form-select'}),
            'expense_category': forms.Select(attrs={'class': 'form-select'}),
            'income_category': forms.Select(attrs={'class': 'form-select'}),
            'to_account': forms.Select(attrs={'class': 'form-select'}),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields['account'].queryset = Account.objects.filter(user=user)
            self.fields['to_account'].queryset = Account.objects.filter(user=user)
            # Show all categories since they are now shared
            self.fields['expense_category'].queryset = ExpenseCategory.objects.all()
            self.fields['income_category'].queryset = IncomeCategory.objects.all()
            
            # Set initial empty choices
            self.fields['expense_category'].empty_label = "Select expense category"
            self.fields['income_category'].empty_label = "Select income category"
            self.fields['to_account'].empty_label = "Select destination account"


class ExpenseCategoryForm(forms.ModelForm):
    class Meta:
        model = ExpenseCategory
        fields = ['name']
        widgets = {
            'name': forms.Select(attrs={'class': 'form-select'}),
        }


class IncomeCategoryForm(forms.ModelForm):
    class Meta:
        model = IncomeCategory
        fields = ['name']
        widgets = {
            'name': forms.Select(attrs={'class': 'form-select'}),
        }


class TransactionCategoryForm(forms.ModelForm):
    class Meta:
        model = TransactionCategory
        fields = ['name', 'is_income']
        widgets = {
            'is_income': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name']


class ExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        fields = ['amount', 'description', 'category', 'date', 'payment_method']
        widgets = {
            'date': DateInput(),
            'payment_method': forms.Select(attrs={'class': 'form-select'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)
        if user:
            # Use ExpenseCategory instead of Category since categories are now shared
            self.fields['category'].queryset = ExpenseCategory.objects.all()
            self.fields['category'].empty_label = "Select expense category"


class UserProfileForm(forms.ModelForm):
    CURRENCY_CHOICES = [
        ('INR', 'Indian Rupee (₹)'),
        ('USD', 'US Dollar ($)'),
        ('EUR', 'Euro (€)'),
        ('GBP', 'British Pound (£)'),
        ('JPY', 'Japanese Yen (¥)'),
        ('CAD', 'Canadian Dollar (C$)'),
        ('AUD', 'Australian Dollar (A$)'),
    ]
    
    currency = forms.ChoiceField(
        choices=CURRENCY_CHOICES,
        initial='INR',
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    class Meta:
        model = UserProfile
        fields = ['currency', 'monthly_budget']
        widgets = {
            'monthly_budget': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': '0.00',
                'step': '0.01'
            }),
        }
