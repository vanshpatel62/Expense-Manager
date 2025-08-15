from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    
    path('dashboard/', views.dashboard, name='dashboard'),
    
    path('accounts/', views.accounts_view, name='accounts'),
    path('accounts/add/', views.add_account, name='add_account'),
    path('accounts/<int:pk>/', views.account_detail, name='account_detail'),
    
    path('transactions/', views.transactions_view, name='transactions'),
    path('transactions/add/', views.add_transaction, name='add_transaction'),
    path('transactions/<int:pk>/edit/', views.edit_transaction, name='edit_transaction'),
    path('transactions/<int:pk>/delete/', views.delete_transaction, name='delete_transaction'),
    
    path('categories/', views.categories_view, name='categories'),
    path('categories/expense/add/', views.add_expense_category, name='add_expense_category'),
    path('categories/income/add/', views.add_income_category, name='add_income_category'),
    
    path('expenses/', views.expenses_view, name='expenses'),
    path('expenses/add/', views.add_expense, name='add_expense'),
    path('expenses/<int:pk>/edit/', views.edit_expense, name='edit_expense'),
    path('expenses/<int:pk>/delete/', views.delete_expense, name='delete_expense'),
    
    path('charts/', views.expense_charts_view, name='expense_charts'),
    
    path('profile/', views.profile_view, name='profile'),
    path('profile/export_transactions_excel/', views.export_transactions_excel, name='export_transactions_excel'),
]