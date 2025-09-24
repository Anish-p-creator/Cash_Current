import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
import json

# --- 1. DATA LOADING AND PREPARATION ---
print("Step 1: Loading and preparing data...")

try:
    # Load the JSON data from the parent directory
    with open('../db.json', 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: db.json not found in the parent directory. Make sure you've run the data generator.")
    exit()

# Convert the list of transactions into a pandas DataFrame
df = pd.DataFrame(data['transactions'])


# Convert data types for processing
df['date'] = pd.to_datetime(df['date'])
df['amount'] = pd.to_numeric(df['amount'])

# For a spending prediction model, we only care about expenses (positive amounts)
expenses_df = df[df['amount'] > 0].copy()

# --- Categorical Encoding ---
if 'category' in expenses_df.columns:
    category_dummies = pd.get_dummies(expenses_df['category'], prefix='cat')
    expenses_df = pd.concat([expenses_df, category_dummies], axis=1)

# --- Time-based Features ---
expenses_df['day_of_week'] = expenses_df['date'].dt.dayofweek
expenses_df['month'] = expenses_df['date'].dt.month
expenses_df['year'] = expenses_df['date'].dt.year

# Group all expenses by day to get total daily spending and aggregate features
agg_dict = {
    'amount': 'sum',
    'day_of_week': 'first',
    'month': 'first',
    'year': 'first',
}
if 'category' in expenses_df.columns:
    for col in category_dummies.columns:
        agg_dict[col] = 'sum'
daily_features = expenses_df.groupby('date').agg(agg_dict).reset_index()
daily_features = daily_features.sort_values('date')
daily_features = daily_features.rename(columns={'amount': 'total_spending'})

# --- Lag Features ---
for lag in [1, 2, 3]:
    daily_features[f'lag_{lag}'] = daily_features['total_spending'].shift(lag, fill_value=0)

# Create a numerical 'time_index' (days since the first transaction) for the model
daily_features['time_index'] = (daily_features['date'] - daily_features['date'].min()).dt.days
processed_df = daily_features.copy()
print("Data preparation complete.")


# --- 2. MODEL TRAINING ---
print("\nStep 2: Training the Linear Regression model...")


# Prepare the data for scikit-learn
# Features: time_index, day_of_week, month, year, lag features, category dummies
feature_cols = ['time_index', 'day_of_week', 'month', 'year']
feature_cols += [col for col in processed_df.columns if col.startswith('lag_')]
feature_cols += [col for col in processed_df.columns if col.startswith('cat_')]
X = processed_df[feature_cols]
y = processed_df['total_spending']

# Create and train the model
model = LinearRegression()
model.fit(X, y)
print("Model training complete.")


# --- 3. MAKING PREDICTIONS ---
print("\nStep 3: Generating predictions for the next 30 days...")


# Find the last day in our dataset to start predicting from
last_row = processed_df.iloc[-1]


# Sequential prediction for lag features
future_rows = []
future_predictions = []
lag_values = [last_row['total_spending'], last_row['total_spending'], last_row['total_spending']]
for i in range(1, 31):
    future = {}
    future['time_index'] = int(last_row['time_index']) + i
    next_date = last_row['date'] + pd.Timedelta(days=i)
    future['day_of_week'] = next_date.dayofweek
    future['month'] = next_date.month
    future['year'] = next_date.year
    # Lag features: use rolling lag_values
    for lag in [1, 2, 3]:
        future[f'lag_{lag}'] = lag_values[lag-1]
    for col in processed_df.columns:
        if col.startswith('cat_'):
            future[col] = 0
    # Predict for this day
    future_X = pd.DataFrame([future])[feature_cols]
    pred = model.predict(future_X)[0]
    pred = max(pred, 0)
    future_predictions.append(pred)
    # Update lag values for next iteration
    lag_values = [pred] + lag_values[:2]
    future['predicted_spending'] = pred
    future_rows.append(future)


def forecast_days(num_days, last_row, feature_cols, processed_df, model):
    future_rows = []
    future_predictions = []
    lag_values = [last_row['total_spending'], last_row['total_spending'], last_row['total_spending']]
    for i in range(1, num_days + 1):
        future = {}
        future['time_index'] = int(last_row['time_index']) + i
        next_date = last_row['date'] + pd.Timedelta(days=i)
        future['day_of_week'] = next_date.dayofweek
        future['month'] = next_date.month
        future['year'] = next_date.year
        for lag in [1, 2, 3]:
            future[f'lag_{lag}'] = lag_values[lag-1]
        for col in processed_df.columns:
            if col.startswith('cat_'):
                future[col] = 0
        future_X = pd.DataFrame([future])[feature_cols]
        pred = model.predict(future_X)[0]
        pred = max(pred, 0)
        future_predictions.append(pred)
        lag_values = [pred] + lag_values[:2]
        future['predicted_spending'] = pred
        future_rows.append(future)
    return future_predictions


# API-compatible functions
def get_forecasts():
    return {
        '30_day': forecast_days(30, last_row, feature_cols, processed_df, model),
        '6_month': forecast_days(180, last_row, feature_cols, processed_df, model),
        '12_month': forecast_days(365, last_row, feature_cols, processed_df, model)
    }

def get_spending_insights():
    insights = {}
    if 'category' in expenses_df.columns:
        # Calculate total and average spending per category
        category_totals = expenses_df.groupby('category')['amount'].sum()
        category_counts = expenses_df['category'].value_counts()
        avg_per_category = category_totals / category_counts
        overall_avg = expenses_df['amount'].mean()

        # Top 3 categories by total spending
        top_cats = category_totals.sort_values(ascending=False).head(3)
        insights['top_categories'] = [
            {'category': cat, 'total': float(total), 'avg_per_transaction': float(avg_per_category[cat])}
            for cat, total in top_cats.items()
        ]

        # Bottom 3 categories by total spending
        bottom_cats = category_totals.sort_values(ascending=True).head(3)
        insights['bottom_categories'] = [
            {'category': cat, 'total': float(total), 'avg_per_transaction': float(avg_per_category[cat])}
            for cat, total in bottom_cats.items()
        ]

        # Suggestions based on deviation from average
        suggestions = []
        for cat in category_totals.index:
            if avg_per_category[cat] > overall_avg * 1.5:
                suggestions.append(f"Warning: Spending in '{cat}' is much higher than average. Try to set a monthly budget and track your expenses in this category. Tip: Review your recent purchases in '{cat}' and identify non-essential items to cut back.")
            elif avg_per_category[cat] > overall_avg * 1.2:
                suggestions.append(f"Consider reducing spending in '{cat}' (average per transaction: ${avg_per_category[cat]:.2f}). Try meal planning, price comparison, or limiting impulse buys.")
            elif avg_per_category[cat] < overall_avg * 0.8:
                suggestions.append(f"You could consider increasing investment in '{cat}' (average per transaction: ${avg_per_category[cat]:.2f}). If this is an important category, review your priorities.")
        if not suggestions:
            suggestions.append("Your spending is balanced across categories. Good job!")
        insights['suggestions'] = suggestions
    return insights