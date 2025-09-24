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
expenses_df = df[df['amount'] > 0]

# Group all expenses by day to get total daily spending
daily_spending = expenses_df.set_index('date').resample('D').sum()['amount'].fillna(0)

# Convert our daily spending data back into a DataFrame for the model
processed_df = daily_spending.reset_index()
processed_df.columns = ['date', 'total_spending']

# Create a numerical 'time_index' (days since the first transaction) for the model
processed_df['time_index'] = (processed_df['date'] - processed_df['date'].min()).dt.days
print("Data preparation complete.")


# --- 2. MODEL TRAINING ---
print("\nStep 2: Training the Linear Regression model...")

# Prepare the data for scikit-learn
# X is the input feature (time)
# y is the target variable we want to predict (spending)
X = processed_df[['time_index']] 
y = processed_df['total_spending']

# Create and train the model
model = LinearRegression()
model.fit(X, y) # This is where the "learning" happens
print("Model training complete.")


# --- 3. MAKING PREDICTIONS ---
print("\nStep 3: Generating predictions for the next 30 days...")

# Find the last day in our dataset to start predicting from
last_time_index = processed_df['time_index'].max()

# Create a list of the next 30 days (as numerical indices)
future_indices = np.array(range(last_time_index + 1, last_time_index + 31)).reshape(-1, 1)

# Ask our trained model to predict the spending for these future days
future_predictions = model.predict(future_indices)

# Ensure predictions aren't negative (you can't have negative spending)
future_predictions[future_predictions < 0] = 0

print("\n--- 30-DAY SPENDING FORECAST ---")
for day_num, prediction in enumerate(future_predictions):
    print(f"Day {day_num + 1}: Predicted spending of ${prediction:.2f}")

total_predicted_spending = sum(future_predictions)
print(f"\nTotal predicted spending for the next 30 days: ${total_predicted_spending:.2f}")