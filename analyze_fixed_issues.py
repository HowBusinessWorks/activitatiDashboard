import csv
import json
from collections import defaultdict
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

csv_file = "export_Activities.csv"

fixed_false_count = 0
fixed_other_count = 0
fixed_values = defaultdict(int)
fixed_examples = defaultdict(list)

total_inspections = 0

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)

    for row in reader:
        # Only look at INSPECTION type
        if row.get('type') != 'INSPECTION':
            continue

        total_inspections += 1

        # Parse the JSON data
        try:
            data = json.loads(row.get('data', '{}'))
        except json.JSONDecodeError:
            continue

        fixed_issues = data.get('fixedIssues')

        # Check if there are identified issues
        identified_issues = data.get('identifiedIssues')
        if not identified_issues or identified_issues == False:
            continue

        # Count and categorize
        if fixed_issues == False or fixed_issues == 'false':
            fixed_false_count += 1
        else:
            fixed_other_count += 1
            fixed_values[str(fixed_issues)] += 1

            # Keep examples (max 3 per type)
            if len(fixed_examples[str(fixed_issues)]) < 3:
                fixed_examples[str(fixed_issues)].append({
                    'activity_id': row.get('activityId'),
                    'value': str(fixed_issues)[:100]  # First 100 chars
                })

print("=" * 80)
print("FIXED ISSUES ANALYSIS - Activities with Identified Issues")
print("=" * 80)
print(f"\nTotal INSPECTION activities: {total_inspections}")
print(f"\nActivities WITH identified issues:")
print(f"  fixedIssues = false:        {fixed_false_count}")
print(f"  fixedIssues = other:        {fixed_other_count}")
print(f"  TOTAL:                      {fixed_false_count + fixed_other_count}")

print("\n" + "=" * 80)
print("BREAKDOWN OF NON-FALSE VALUES:")
print("=" * 80)

for value, count in sorted(fixed_values.items(), key=lambda x: x[1], reverse=True):
    print(f"\nValue type: {value}")
    print(f"Count: {count}")
    print(f"Examples:")
    for example in fixed_examples[value]:
        print(f"  - Activity {example['activity_id']}: {example['value']}")

print("\n" + "=" * 80)
print(f"SUMMARY:")
print(f"  Issues to track in Kanban (fixedIssues=false): {fixed_false_count}")
print(f"  Issues with fix descriptions (fixedIssues=text): {fixed_other_count}")
print("=" * 80)
