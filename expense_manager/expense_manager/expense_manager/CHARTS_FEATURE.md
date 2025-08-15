# 📊 Expense Charts Feature

## Overview
The Expense Manager now includes interactive pie charts to visualize expense category distribution for each user. This feature provides both a detailed charts page and a quick overview on the dashboard.

## 🎯 Features

### 1. **Expense Category Pie Charts**
- **Interactive Charts**: Built with Chart.js for smooth, responsive visualizations
- **User-Specific Data**: Each user sees only their own expense data
- **Combined Data Sources**: Aggregates data from both Transaction and Expense models
- **Color-Coded Categories**: Each expense category has a distinct color
- **Percentage Calculations**: Shows both amounts and percentages

### 2. **Navigation Integration**
- **Charts Link**: Added to the main navigation bar with a pie chart icon
- **Easy Access**: One-click access to detailed expense analysis
- **Consistent UI**: Matches the existing design and navigation style

### 3. **Dashboard Overview**
- **Mini Chart**: Small doughnut chart on the dashboard for quick overview
- **Quick Stats**: Shows total expenses and category breakdown
- **Link to Full Chart**: Easy navigation to detailed charts page

## 🛠 Technical Implementation

### Backend Components

#### 1. **Views**
- `expense_charts_view()`: Main charts page view
- `get_expense_chart_data()`: Helper function to aggregate expense data
- Updated `dashboard()` view to include chart data

#### 2. **URL Configuration**
```python
path('charts/', views.expense_charts_view, name='expense_charts')
```

#### 3. **Data Aggregation**
- Combines expense data from both Transaction and Expense models
- Groups by expense category
- Calculates totals and percentages
- Handles missing data gracefully

### Frontend Components

#### 1. **Chart.js Integration**
- CDN-loaded Chart.js library
- Responsive chart configurations
- Interactive tooltips with detailed information
- Custom color schemes

#### 2. **Templates**
- `expense_charts.html`: Main charts page
- Updated `dashboard.html`: Added mini chart
- Updated `base.html`: Added Chart.js and navigation link

#### 3. **Custom Template Filters**
- `chart_filters.py`: Custom Django template filters
- `get_item`: Access dictionary items by key
- `percentage`: Calculate percentage values

## 📱 User Interface

### Charts Page Layout
```
┌─────────────────────────────────────────────────────────┐
│                    Expense Charts                       │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │                 │  │        Summary              │   │
│  │   Pie Chart     │  │  Total Expenses: $1,250    │   │
│  │                 │  │                             │   │
│  │                 │  │  Category Breakdown:        │   │
│  │                 │  │  ● Food: $300 (24%)         │   │
│  │                 │  │  ● Transport: $200 (16%)    │   │
│  │                 │  │  ● Health: $400 (32%)       │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Dashboard Integration
```
┌─────────────────────────────────────────────────────────┐
│                    Dashboard                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │ Recent          │  │    Expense Overview         │   │
│  │ Transactions    │  │                             │   │
│  │                 │  │  ┌─────────────────────┐    │   │
│  │ • Food: $50     │  │  │    Mini Chart       │    │   │
│  │ • Transport: $30│  │  │                     │    │   │
│  │ • Health: $100  │  │  │                     │    │   │
│  │                 │  │  └─────────────────────┘    │   │
│  │                 │  │  [View Full Chart]          │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Chart Features

### Interactive Elements
- **Hover Tooltips**: Show category name, amount, and percentage
- **Legend**: Clickable legend to show/hide categories
- **Responsive Design**: Charts adapt to different screen sizes
- **Smooth Animations**: Chart.js provides smooth transitions

### Color Scheme
```css
Primary Colors:
- Food: #FF6384 (Red)
- Transport: #36A2EB (Blue)
- Health: #FFCE56 (Yellow)
- Social Life: #4BC0C0 (Teal)
- Education: #9966FF (Purple)
- Apparel: #FF9F40 (Orange)
- Pets: #FF6384 (Pink)
- Other: #C9CBCF (Gray)
```

## 📊 Data Sources

### Transaction Model
- `transaction_type = 'expense'`
- `expense_category` field
- `amount` field

### Expense Model
- `category` field (legacy)
- `amount` field

### Data Combination Logic
```python
# Combine data from both models
chart_data = {}

# Add transaction expenses
for item in expense_transactions:
    category_name = item['expense_category__name']
    chart_data[category_name] += float(item['total'])

# Add expense model data
for item in expense_records:
    category_name = item['category__name']
    chart_data[category_name] += float(item['total'])
```

## 🚀 Usage Instructions

### For Users
1. **Access Charts**: Click "Charts" in the navigation bar
2. **View Dashboard Chart**: See mini chart on dashboard
3. **Interactive Features**: Hover over chart segments for details
4. **Legend**: Click legend items to show/hide categories

### For Developers
1. **Add Chart Data**: Use `get_expense_chart_data(user)` helper function
2. **Custom Colors**: Modify the colors array in the view
3. **Chart Configuration**: Adjust Chart.js options in templates
4. **Template Filters**: Add new filters to `chart_filters.py`

## 🧪 Testing

### Test Script
Run the test script to verify functionality:
```bash
python test_charts.py
```

### Manual Testing
1. Create expense transactions with different categories
2. Visit the charts page
3. Verify data accuracy and chart display
4. Test responsive design on different screen sizes

## 🔧 Customization

### Adding New Chart Types
1. Create new view function
2. Add URL pattern
3. Create template with Chart.js configuration
4. Add navigation link

### Modifying Chart Appearance
1. Edit Chart.js options in templates
2. Update color schemes in views
3. Modify CSS styles for layout
4. Adjust responsive breakpoints

## 📈 Future Enhancements

### Potential Features
- **Time-based Charts**: Monthly/yearly expense trends
- **Income Charts**: Income category distribution
- **Account Charts**: Balance distribution across accounts
- **Export Options**: Download charts as images/PDF
- **Filtering**: Date range and category filters
- **Comparison Charts**: Month-over-month comparisons

### Technical Improvements
- **Caching**: Cache chart data for better performance
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: Statistical analysis and insights
- **Mobile Optimization**: Touch-friendly chart interactions

## 🐛 Troubleshooting

### Common Issues
1. **Empty Charts**: No expense data available
2. **Missing Categories**: Categories not created
3. **JavaScript Errors**: Chart.js not loading
4. **Data Mismatch**: Inconsistent data between models

### Solutions
1. Create sample expense transactions
2. Run category setup scripts
3. Check Chart.js CDN availability
4. Verify data aggregation logic

## 📝 Dependencies

### Required Libraries
- **Chart.js**: JavaScript charting library (CDN)
- **Django**: Backend framework
- **Custom Template Filters**: For data manipulation

### Optional Enhancements
- **Bootstrap**: For responsive layout
- **Font Awesome**: For icons
- **jQuery**: For enhanced interactions

---

**Created**: 2024
**Version**: 1.0
**Status**: ✅ Complete and Functional 