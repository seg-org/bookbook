import json
import random
from datetime import datetime, timedelta

# Function to generate a random datetime between two datetime objects
def random_date(start_date, end_date):
    delta = end_date - start_date
    random_seconds = random.randint(0, int(delta.total_seconds()))  # Convert to int
    return start_date + timedelta(seconds=random_seconds)

# Get the current datetime and the datetime for the start of last month
now = datetime.now()
last_month = now.replace(day=1) - timedelta(days=1)  # Get the last day of the previous month
last_month_start = last_month.replace(day=1)  # First day of the last month

# Load the original posts data
with open('posts.json', 'r') as f:
    posts_data = json.load(f)

# Add random createdAt field to each post
for post in posts_data:
    # Generate a random createdAt between last month and now
    post['createdAt'] = random_date(last_month_start, now).isoformat()

# Write the updated posts data back to a new JSON file
with open('posts_with_random_createdAt.json', 'w') as f:
    json.dump(posts_data, f, indent=4)

print("Added random createdAt between last month and now to each post successfully!")
