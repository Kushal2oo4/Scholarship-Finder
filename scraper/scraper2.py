from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from pymongo import MongoClient
import time

def scrape():
    # Setup Chrome options for headless scraping
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')

    # Initialize Chrome driver (make sure chromedriver is in your PATH)
    driver = webdriver.Chrome(options=options)

    # Navigate to scholarships page
    driver.get("https://www.buddy4study.com/scholarships")
    time.sleep(5)  # Wait for the page to load fully

    # Get page source and parse with BeautifulSoup
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    # Find all scholarship blocks
    scholarships_html = soup.find_all('a', class_='Listing_categoriesBox__CiGvQ')

    scholarships = []

    for scholarship in scholarships_html:
        title_tag = scholarship.find('h4', class_='Listing_scholarshipName__VLFMj')
        awards_and_eligibility = scholarship.find_all('div', class_='Listing_rightAward__DxMQV')

        if title_tag and len(awards_and_eligibility) >= 2:
            title = title_tag.get_text(strip=True)

            award_text = awards_and_eligibility[0].get_text(strip=True)
            # Remove first word (like "Award:")
            award = ' '.join(award_text.split()[1:])

            eligibility_text = awards_and_eligibility[1].get_text(strip=True)
            # Remove first word (like "Eligibility:")
            eligibility = ' '.join(eligibility_text.split()[1:])

            scholarships.append({
                "title": title,
                "award": award,
                "eligibility": eligibility
            })

    driver.quit()

    # Insert into MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client.scholarships
    collection = db.scholarship_data

    collection.delete_many({})  # Clear old data
    if scholarships:
        collection.insert_many(scholarships)
        print(f"Inserted {len(scholarships)} scholarships into MongoDB")
    else:
        print("No scholarships found")

if __name__ == "__main__":
    scrape()
