const scholarships = [
  {
    name: "Engineering Excellence Scholarship",
    course: "Engineering",
    minGpa: 7.5,
    locations: ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh"],
    incomeStatus: ["Low", "Middle"],
    caste: ["General", "OBC", "SC", "ST", "EWS"],
    description: "Merit-based scholarship for engineering students with strong academic records.",
  },
  {
    name: "Medical Merit Award",
    course: "Medicine",
    minGpa: 8.0,
    locations: ["Kerala", "Tamil Nadu", "Delhi", "Karnataka"],
    incomeStatus: ["Low", "Middle", "High"],
    caste: ["General", "OBC", "SC", "ST", "EWS"],
    description: "Award for outstanding medical students regardless of income or caste.",
  },
  {
    name: "Arts Diversity Scholarship",
    course: "Arts",
    minGpa: 6.0,
    locations: ["Bihar", "Jharkhand", "Uttar Pradesh", "West Bengal"],
    incomeStatus: ["Low"],
    caste: ["OBC", "SC", "ST", "EWS"],
    description: "Promotes diversity and inclusion for arts students from underprivileged backgrounds.",
  },
  {
    name: "Science Innovators Grant",
    course: "Science",
    minGpa: 7.0,
    locations: ["Maharashtra", "Gujarat", "Delhi", "Karnataka"],
    incomeStatus: ["Middle", "High"],
    caste: ["General", "OBC"],
    description: "Supporting innovative scientific research students with excellent grades.",
  },
  {
    name: "Business Leaders Scholarship",
    course: "Business",
    minGpa: 8.5,
    locations: ["Delhi", "Maharashtra", "Tamil Nadu"],
    incomeStatus: ["Low", "Middle", "High"],
    caste: ["General"],
    description: "For high-achieving business students with leadership qualities.",
  },
  {
    name: "Law Future Champions Award",
    course: "Law",
    minGpa: 7.0,
    locations: ["Delhi", "Uttar Pradesh", "Haryana"],
    incomeStatus: ["Low", "Middle"],
    caste: ["General", "OBC"],
    description: "Supporting future legal experts from low and middle income families.",
  },
  {
    name: "Education Support Fund",
    course: "Education",
    minGpa: 6.5,
    locations: ["Kerala", "Tamil Nadu", "Puducherry"],
    incomeStatus: ["Low"],
    caste: ["SC", "ST", "EWS"],
    description: "Help fund for students studying to be educators from disadvantaged communities.",
  },
  {
    name: "Architecture Creativity Grant",
    course: "Architecture",
    minGpa: 7.0,
    locations: ["Maharashtra", "Delhi", "Karnataka"],
    incomeStatus: ["Middle", "High"],
    caste: ["General", "OBC", "EWS"],
    description: "Award to support creativity and innovation in architecture studies.",
  },
  {
    name: "Agriculture Progress Scholarship",
    course: "Agriculture",
    minGpa: 6.0,
    locations: ["Bihar", "Odisha", "Madhya Pradesh", "Chhattisgarh"],
    incomeStatus: ["Low", "Middle", "High"],
    caste: ["General", "OBC", "SC", "ST"],
    description: "Encourages students pursuing agriculture to improve food security globally.",
  }
];

const form = document.getElementById('scholarshipForm');
const resultsSection = document.getElementById('resultsSection');

function clearResults() {
  resultsSection.innerHTML = '';
}

function displayScholarships(filteredScholarships) {
  clearResults();
  if (filteredScholarships.length === 0) {
    resultsSection.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#666; font-weight:600;">
      No scholarships found matching your criteria.</p>`;
    return;
  }
  filteredScholarships.forEach(sch => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${sch.name}</h3>
      <p>${sch.description}</p>
      <div class="criteria">
        <strong>Course:</strong> ${sch.course} <br/>
        <strong>Min GPA:</strong> ${sch.minGpa} <br/>
        <strong>Locations:</strong> ${sch.locations.join(', ')} <br/>
        <strong>Income Status:</strong> ${sch.incomeStatus.join(', ')} <br/>
        <strong>Caste:</strong> ${sch.caste.join(', ')}
      </div>
    `;
    resultsSection.appendChild(card);
  });
}

function incomeCategory(incomeNumber) {
  if (incomeNumber === null || incomeNumber === undefined || isNaN(incomeNumber)) return '';
  if (incomeNumber < 300000) return "Low";
  if (incomeNumber >= 300000 && incomeNumber <= 1000000) return "Middle";
  return "High";
}

function filterScholarships(inputs) {
  return scholarships.filter(sch => {
    if (sch.course !== inputs.course) return false;
    if (inputs.gpa < sch.minGpa) return false;
    if (!sch.locations.includes(inputs.location)) return false;
    if (inputs.incomeCategory !== '' && !sch.incomeStatus.includes(inputs.incomeCategory)) return false;
    if (inputs.caste !== '' && !sch.caste.includes(inputs.caste)) return false;
    return true;
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const course = document.getElementById('courseInput').value;
  const gpa = parseFloat(document.getElementById('gpaInput').value);
  const location = document.getElementById('locationInput').value;
  const incomeVal = document.getElementById('incomeInput').value;
  const caste = document.getElementById('casteInput').value;

  const incomeNum = incomeVal ? parseFloat(incomeVal) : null;
  const incomeCat = incomeCategory(incomeNum);

  const userInput = { course, gpa, location, incomeCategory: incomeCat, caste };
  const matchedScholarships = filterScholarships(userInput);
  displayScholarships(matchedScholarships);
});
