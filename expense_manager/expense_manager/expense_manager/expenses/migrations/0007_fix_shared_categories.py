# Generated manually to fix shared categories

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('expenses', '0006_transaction_to_account_expensecategory_and_more'),
    ]

    operations = [
        # Add unique constraint to ExpenseCategory name
        migrations.AlterField(
            model_name='expensecategory',
            name='name',
            field=models.CharField(choices=[('food', 'Food'), ('transport', 'Transport'), ('social_life', 'Social Life'), ('pets', 'Pets'), ('apparel', 'Apparel'), ('health', 'Health'), ('education', 'Education'), ('other', 'Other')], max_length=20, unique=True),
        ),
        # Add unique constraint to IncomeCategory name
        migrations.AlterField(
            model_name='incomecategory',
            name='name',
            field=models.CharField(choices=[('salary', 'Salary'), ('allowance', 'Allowance'), ('bonus', 'Bonus'), ('other', 'Other')], max_length=20, unique=True),
        ),
        # Remove unique_together constraint from ExpenseCategory
        migrations.AlterUniqueTogether(
            name='expensecategory',
            unique_together=set(),
        ),
        # Remove unique_together constraint from IncomeCategory
        migrations.AlterUniqueTogether(
            name='incomecategory',
            unique_together=set(),
        ),
    ] 