from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Account, TransactionCategory, Transaction, Category, Expense, UserProfile, ExpenseCategory, IncomeCategory


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'phone')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone', 'address')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'account_type', 'account_name', 'current_balance')
    list_filter = ('account_type', 'user')
    search_fields = ('account_name', 'user__username')
    list_select_related = ('user',)


@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    list_filter = ('name',)
    search_fields = ('name',)


@admin.register(IncomeCategory)
class IncomeCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    list_filter = ('name',)
    search_fields = ('name',)


@admin.register(TransactionCategory)
class TransactionCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_income')
    list_filter = ('is_income', 'user')
    search_fields = ('name', 'user__username')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('account', 'transaction_type', 'amount', 'transaction_date', 'expense_category', 'income_category', 'to_account')
    list_filter = ('transaction_type', 'account__account_type', 'transaction_date')
    search_fields = ('description', 'amount')
    date_hierarchy = 'transaction_date'
    list_select_related = ('account', 'expense_category', 'income_category', 'to_account')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('amount', 'category', 'user', 'date', 'payment_method')
    list_filter = ('user', 'category', 'payment_method', 'date')
    search_fields = ('description', 'amount')
    date_hierarchy = 'date'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'currency', 'monthly_budget')
    search_fields = ('user__username',)


admin.site.register(User, CustomUserAdmin)
admin.site.site_header = "Expense Manager Administration"
