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

# 30-day forecast
future_predictions_30 = forecast_days(30, last_row, feature_cols, processed_df, model)
print("\n--- 30-DAY SPENDING FORECAST ---")
for day_num, prediction in enumerate(future_predictions_30):
    print(f"Day {day_num + 1}: Predicted spending of ${prediction:.2f}")
total_predicted_spending_30 = sum(future_predictions_30)
print(f"\nTotal predicted spending for the next 30 days: ${total_predicted_spending_30:.2f}")

# 6-month forecast
future_predictions_180 = forecast_days(180, last_row, feature_cols, processed_df, model)
print("\n--- 6-MONTH (180 DAYS) SPENDING FORECAST ---")
print(f"Total predicted spending for the next 6 months: ${sum(future_predictions_180):.2f}")

# 12-month forecast
future_predictions_365 = forecast_days(365, last_row, feature_cols, processed_df, model)
print("\n--- 12-MONTH (365 DAYS) SPENDING FORECAST ---")
print(f"Total predicted spending for the next 12 months: ${sum(future_predictions_365):.2f}")

# --- Insights based on category spending ---
if 'category' in expenses_df.columns:
    print("\n--- SPENDING INSIGHTS ---")
    # Calculate total and average spending per category
    category_totals = expenses_df.groupby('category')['amount'].sum()
    category_counts = expenses_df['category'].value_counts()
    avg_per_category = category_totals / category_counts
    overall_avg = expenses_df['amount'].mean()

    # Top 3 categories by total spending
    top_cats = category_totals.sort_values(ascending=False).head(3)
    print("Top 3 spending categories:")
    for cat, total in top_cats.items():
        print(f"- {cat}: ${total:.2f} (avg per transaction: ${avg_per_category[cat]:.2f})")

    # Bottom 3 categories by total spending
    bottom_cats = category_totals.sort_values(ascending=True).head(3)
    print("\nLowest 3 spending categories:")
    for cat, total in bottom_cats.items():
        print(f"- {cat}: ${total:.2f} (avg per transaction: ${avg_per_category[cat]:.2f})")

    # Suggestions based on deviation from average
    print("\nSuggestions:")
    any_suggestion = False
    for cat in category_totals.index:
        if avg_per_category[cat] > overall_avg * 1.5:
            print(f"Warning: Spending in '{cat}' is much higher than average. Try to set a monthly budget and track your expenses in this category.")
            print(f"Tip: Review your recent purchases in '{cat}' and identify non-essential items to cut back.")
            any_suggestion = True
        elif avg_per_category[cat] > overall_avg * 1.2:
            print(f"Consider reducing spending in '{cat}' (average per transaction: ${avg_per_category[cat]:.2f}). Try meal planning, price comparison, or limiting impulse buys.")
            any_suggestion = True
        elif avg_per_category[cat] < overall_avg * 0.8:
            print(f"You could consider increasing investment in '{cat}' (average per transaction: ${avg_per_category[cat]:.2f}). If this is an important category, review your priorities.")
            any_suggestion = True
    if not any_suggestion:
        print("Your spending is balanced across categories. Good job!")