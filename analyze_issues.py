import csv
import json

csv_file = "export_Activities.csv"

fixed_true_count = 0
fixed_false_count = 0
fixed_null_count = 0
no_identified_issues = 0
total_inspections = 0

# Dictionary to track inspection types with unfixed issues
inspection_types_with_issues = {}

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
            print(f"Error parsing JSON for activity {row.get('activityId')}")
            continue

        fixed_issues = data.get('fixedIssues')
        identified_issues = data.get('identifiedIssues')

        # Check if there are identified issues
        if not identified_issues or identified_issues == False:
            no_identified_issues += 1
            continue

        # Count based on fixedIssues status
        if fixed_issues == True or fixed_issues == 'true':
            fixed_true_count += 1
        elif fixed_issues == False or fixed_issues == 'false':
            fixed_false_count += 1

            # Track inspection category
            inspection_category = data.get('list', [{}])[0].get('name', 'Unknown')
            if inspection_category not in inspection_types_with_issues:
                inspection_types_with_issues[inspection_category] = 0
            inspection_types_with_issues[inspection_category] += 1
        else:
            fixed_null_count += 1

print("=" * 70)
print("CSV ISSUE ANALYSIS REPORT")
print("=" * 70)
print(f"\nTotal INSPECTION activities: {total_inspections}")
print(f"\nIssues found (with identifiedIssues content):")
print(f"  - Fixed on spot (fixedIssues = true):  {fixed_true_count}")
print(f"  - NOT fixed (fixedIssues = false):     {fixed_false_count}")
print(f"  - Null/other status:                   {fixed_null_count}")
print(f"\nNo identified issues recorded:           {no_identified_issues}")

print(f"\n" + "=" * 70)
print(f"ISSUES TO BE TRACKED IN KANBAN: {fixed_false_count}")
print("=" * 70)

if fixed_false_count > 0:
    print("\nBreakdown by Inspection Type:")
    print("-" * 70)
    for inspection_type, count in sorted(inspection_types_with_issues.items(), key=lambda x: x[1], reverse=True):
        print(f"  {inspection_type}: {count}")

print("\n" + "=" * 70)
