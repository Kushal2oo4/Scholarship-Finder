const scholarships = [
  {
    title: "Women in STEM Scholarship",
    amount: "Full",
    deadline: "2025-06-10",
    eligibility: "Women pursuing STEM courses",
    link: "https://example.com/apply1"
  },
  {
    title: "Need-Based Grant",
    amount: "Partial",
    deadline: "2025-06-05",
    eligibility: "Low-income background",
    link: "https://example.com/apply2"
  }
];

document.getElementById("profileForm").addEventListener("submit", function(e) {
  e.preventDefault();
  showScholarships();
});

function showScholarships() {
  const container = document.getElementById("scholarshipResults");
  container.innerHTML = "";

  scholarships.forEach((s) => {
    const card = document.createElement("div");
    card.className = "scholarship-card";
    card.innerHTML = `
      <h3>${s.title}</h3>
      <p><strong>Amount:</strong> ${s.amount}</p>
      <p><strong>Deadline:</strong> ${s.deadline}</p>
      <p><strong>Eligibility:</strong> ${s.eligibility}</p>
      <a href="${s.link}" target="_blank">Apply Now</a>
    `;
    container.appendChild(card);
  });
}
