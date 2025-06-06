const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const GPA_PAGES = [
  'https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-3-6-to-4-0',
  'https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-3-1-to-3-5',
  'https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-2-6-to-3-0',
  'https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-2-1-to-2-5'
];
async function scholarshipscraper() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36');

  const results = [];

  for (let url of GPA_PAGES) {
    console.log(`Scraping listing page: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await autoScroll(page);

    const scholarships = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table#award-grid tbody tr')).slice(0,2);
      return rows.map(row => {
        const linkEl = row.querySelector('a.blacklink');
        const title = linkEl?.innerText?.trim() || '';
        const url = linkEl ? 'https://www.scholarships.com' + linkEl.getAttribute('href') : '';

        const amount= row.querySelector('td:nth-child(3)')?.innerText?.trim() || '';
        let amountValue = null;

        if (amount.startsWith('$')) {
          amountValue = Number(amount.replace(/[^0-9]/g, ''));  // e.g., "$3,000" -> 3000
        }

        const deadline = row.querySelector('td:nth-child(4)')?.innerText?.trim().replace('Due Date:', '').trim() || '';

        return { title, url, amount, amountValue, deadline };
      });
    });

    for (const scholarship of scholarships) {
      try {
        const detailPage = await browser.newPage();
        await detailPage.goto(scholarship.url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const extra = await detailPage.evaluate(() => {
          const text = document.body.innerText.toLowerCase();
          const desc = document.querySelector('div > div > p').textContent;
          
          const regexNumBefore = /(\d+(\.\d+)?)(?=.{0,15}?(gpa|least a|minimum|maintain))/gi;
          const regexKeyBefore = /(gpa|least a|minimum|maintain)(?=.{0,15}?\s*(\d+(\.\d+)?))/gi;

          let matches = [];

          let match;
          while ((match = regexNumBefore.exec(text)) !== null) {
            matches.push(parseFloat(match[1]));
          }

          while ((match = regexKeyBefore.exec(text)) !== null) {
            if (match[2]) matches.push(parseFloat(match[2]));
          }

          let gpa = null;
          if (matches.length > 0) {
            gpa = Math.min(...matches);
          }
          return {
            description: desc.trim(),
            gpa: gpa ? gpa : 0
          };
        });

        scholarship.description = extra.description;
        scholarship.gpa = extra.gpa;
        scholarship.source = 'Scholarships.com';

        await detailPage.close();
      } catch (err) {
        console.warn(`⚠️ Error scraping detail: ${scholarship.url}`, err);
        scholarship.description = '';
        scholarship.gpa = 'Unknown';
      }

      results.push(scholarship);
    }
  }

  await browser.close();

  const validGpaCount = results.filter(sch => {
    const gpaNum = sch.gpa;
    return !isNaN(gpaNum) && gpaNum > 2;
  }).length;

  console.log(`Number of scholarships with GPA > 2: ${validGpaCount}`);

  return results;
}
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        const loaded = document.querySelectorAll('.award-box').length;
        if (loaded >= 25 || totalHeight > 3000) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

module.exports = scholarshipscraper;