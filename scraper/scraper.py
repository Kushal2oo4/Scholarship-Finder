import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

url = "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/"
headers = {"User-Agent": "Mozilla/5.0"}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

print("Page title:", soup.title.string)

scholarships = []

for item in soup.select(".scholarship-listing"):
    try:
        title_elem = item.select_one(".scholarship-title")
        link_elem = item.select_one("a")
        desc_elem = item.select_one(".scholarship-description")

        if title_elem and link_elem and desc_elem:
            title = title_elem.get_text(strip=True)
            link = "https://www.scholarships.com" + link_elem["href"]
            desc = desc_elem.get_text(strip=True)

            scholarships.append({
                "title": title,
                "link": link,
                "description": desc,
                "course": "Any",                 # Default value
                "gpa": 0.0,                      # Default value
                "location": "Any",               # Default value
                "amount": "Unknown",             # Placeholder
                "deadline": None,                # Could be updated later
                "incomeStatus": "Any",           # Default value
                "specialCategory": "None"        # Default value
            })
    except Exception as e:
        print("Error parsing an item:", e)

print(f"Found {len(scholarships)} scholarships.")
print(scholarships[:3])

if scholarships:
    client = MongoClient("mongodb://localhost:27017")
    db = client["scholarshipDB"]
    collection = db["scholarships"]

    collection.insert_many(scholarships)
    print("Inserted into MongoDB")
else:
    print("No scholarships found to insert.")
