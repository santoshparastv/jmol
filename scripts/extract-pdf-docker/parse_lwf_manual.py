#!/usr/bin/env python3
"""
Manual parser for LWF data based on the extracted text structure
"""

# Based on the extracted text, here's the LWF data manually extracted:
LWF_DATA = {
    "Andhra Pradesh": {"employee": 70, "employer": 30, "frequency": "yearly"},
    "Chandigarh": {"employee": 20, "employer": 5, "frequency": "monthly"},
    "Chhattisgarh": {"employee": 45, "employer": 15, "frequency": "half yearly"},
    "Delhi": {"employee": 2.25, "employer": 0.75, "frequency": "half yearly"},
    "Goa": {"employee": 180, "employer": 60, "frequency": "half yearly"},
    "Gujarat": {"employee": 12, "employer": 6, "frequency": "half yearly"},
    "Haryana": {"employee": 50, "employer": 24, "frequency": "monthly"},
    "Karnataka": {"employee": 40, "employer": 20, "frequency": "yearly"},
    "Kerala": {"employee": 45, "employer": 45, "frequency": "half yearly"},
    "Madhya Pradesh": {"employee": 30, "employer": 10, "frequency": "half yearly"},
    "Maharashtra": {"employee": 36, "employer": 12, "frequency": "half yearly"},
    "Odisha": {"employee": 20, "employer": 10, "frequency": "half yearly"},
    "Punjab": {"employee": 20, "employer": 5, "frequency": "monthly"},
    "Tamil Nadu": {"employee": 40, "employer": 20, "frequency": "yearly"},
    "Telangana": {"employee": 5, "employer": 2, "frequency": "yearly"},
    "West Bengal": {"employee": 15, "employer": 3, "frequency": "half yearly"},
}

# Convert to monthly amounts
def convert_to_monthly(data):
    result = {}
    for state, values in data.items():
        freq = values["frequency"]
        if freq == "yearly":
            monthly_emp = round(values["employee"] / 12)
            monthly_empr = round(values["employer"] / 12)
        elif "half" in freq.lower():
            monthly_emp = round(values["employee"] / 6)
            monthly_empr = round(values["employer"] / 6)
        else:  # monthly
            monthly_emp = int(values["employee"])
            monthly_empr = int(values["employer"])
        
        result[state] = {
            "employee": monthly_emp,
            "employer": monthly_empr
        }
    return result

if __name__ == "__main__":
    import json
    monthly_data = convert_to_monthly(LWF_DATA)
    print(json.dumps(monthly_data, indent=2))
