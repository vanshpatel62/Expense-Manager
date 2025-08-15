document.addEventListener('DOMContentLoaded', function() {
    // Initialize date fields with today's date
    const initDateFields = () => {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            if (!input.value) {
                const today = new Date().toISOString().split('T')[0];
                input.value = today;
            }
        });
    };

    // Form validation
    const setupFormValidation = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('is-invalid');
                        isValid = false;
                        
                        // Add error message if not exists
                        if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('invalid-feedback')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'invalid-feedback';
                            errorDiv.textContent = 'This field is required';
                            field.parentNode.insertBefore(errorDiv, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('is-invalid');
                        if (field.nextElementSibling && field.nextElementSibling.classList.contains('invalid-feedback')) {
                            field.nextElementSibling.remove();
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger';
                    alertDiv.textContent = 'Please fill all required fields correctly.';
                    form.prepend(alertDiv);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    };

    // Dynamic category selection based on transaction type
    const setupTransactionTypeChange = () => {
        const transactionType = document.getElementById('id_transaction_type');
        const categoryField = document.getElementById('id_category');
        
        if (transactionType && categoryField) {
            const handleTypeChange = () => {
                const isIncome = transactionType.value === 'income';
                const options = categoryField.options;
                
                for (let i = 0; i < options.length; i++) {
                    const option = options[i];
                    const isIncomeCategory = option.getAttribute('data-is-income') === 'true';
                    
                    if (isIncome) {
                        option.style.display = isIncomeCategory ? '' : 'none';
                    } else {
                        option.style.display = isIncomeCategory ? 'none' : '';
                    }
                }
            };
            
            transactionType.addEventListener('change', handleTypeChange);
            handleTypeChange(); // Initialize on page load
        }
    };

    // Auto-format currency inputs
    const setupCurrencyInputs = () => {
        const currencyInputs = document.querySelectorAll('input[type="number"]');
        currencyInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value) {
                    this.value = parseFloat(this.value).toFixed(2);
                }
            });
        });
    };

    // Confirm before delete actions
    const setupDeleteConfirmations = () => {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this item?')) {
                    e.preventDefault();
                }
            });
        });
    };

    // Initialize all functions
    initDateFields();
    setupFormValidation();
    setupTransactionTypeChange();
    setupCurrencyInputs();
    setupDeleteConfirmations();

    // Toast notifications
    const toastEl = document.querySelector('.toast');
    if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});