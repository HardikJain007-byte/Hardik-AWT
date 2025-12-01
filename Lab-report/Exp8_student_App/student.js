// ADD student
document.getElementById("addForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let data = Object.fromEntries(new FormData(e.target).entries());

    let res = await fetch("/students/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    let result = await res.json();
    if (result.success) {
        alert("Student Added!");
        e.target.reset();
        loadStudents();
    }
});

// LOAD all students
async function loadStudents() {
    let res = await fetch("/students");
    let students = await res.json();

    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach(s => {
        table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.roll}</td>
        <td>${s.branch}</td>
        <td>${s.year}</td>
      </tr>
    `;
    });
}
loadStudents();

// HIGHLIGHT SEARCH
async function highlightSearch() {
    let keyword = document.getElementById("searchBox").value.toLowerCase();

    let rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row => row.classList.remove("highlight"));

    if (keyword === "") return;

    rows.forEach(row => {
        let name = row.children[0].textContent.toLowerCase();
        let roll = row.children[1].textContent.toLowerCase();

        if (name.includes(keyword) || roll.includes(keyword)) {
            row.classList.add("highlight");
        }
    });
}