from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time

# Setup Chrome options
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Run in headless mode
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')

# Initialize the Chrome driver
driver = webdriver.Chrome(options=options)

# Navigate to the scholarships page
driver.get("https://www.buddy4study.com/scholarships")
time.sleep(5)  # Wait for the page to load completely

# Get the page source and parse it with BeautifulSoup
html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

# Find all scholarship links
scholarships = soup.find_all('a', class_='Listing_categoriesBox__CiGvQ')

# Print the scholarship titles and URLs
for scholarship in scholarships:
    title = scholarship.find('h4', class_='Listing_scholarshipName__VLFMj')
    awards_and_eligibility = scholarship.find_all('div', class_='Listing_rightAward__DxMQV')
    if title and len(awards_and_eligibility) >= 2:
        award_text = awards_and_eligibility[0].get_text(strip=True)
        award_text_no_first = ' '.join(award_text.split()[1:])
        eligibility_text = awards_and_eligibility[1].get_text(strip=True)
        eligibility_text_no_first = ' '.join(eligibility_text.split()[1:])
        print(f"Title: {title.get_text(strip=True)}")
        print(f"Award: {award_text_no_first}")
        print(f"Eligibility: {eligibility_text_no_first}")
        print("-" * 40)

# Close the browser
driver.quit()
