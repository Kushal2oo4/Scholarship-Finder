import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

url = "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/"
headers = {"User-Agent": "Mozilla/5.0"}

response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

# Print page title to confirm success
print("Page title:", soup.title.string)

scholarships = []

# Iterate through each scholarship listing
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
                "description": desc
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
