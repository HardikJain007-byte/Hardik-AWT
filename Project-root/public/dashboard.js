let students = []; // will hold latest list

$(document).ready(function () {
    loadAll();

    // handle add / update
    $("#student-form").on("submit", async function (e) {
        e.preventDefault();

        const id = $("#studentId").val();
        const sapId = $("#sapId").val().trim();
        const name = $("#name").val().trim();
        const marks = $("#marks").val();

        if (!sapId || !name) {
            alert("SAP ID and Name are required.");
            return;
        }

        if (marks < 0 || marks > 100) {
            alert("Marks must be between 0 and 100.");
            return;
        }

        try {
            if (id) {
                // update existing
                await fetch(`/api/students/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sapId, name, marks })
                });
            } else {
                // create new
                await fetch("/api/students", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sapId, name, marks })
                });
            }

            resetForm();
            await loadAll();
        } catch (err) {
            console.error(err);
            alert("Error saving student.");
        }
    });
});

async function loadAll() {
    await loadStudents();
    await loadPerformance();
}

// ---------- LOAD STUDENTS & RENDER TABLE ----------
async function loadStudents() {
    const res = await fetch("/api/students");
    students = await res.json();
    renderTable();
}

function renderTable() {
    const tbody = $("#students-table tbody");
    tbody.empty();

    students.forEach((stu) => {
        const row = $(`
      <tr>
        <td>${stu.sapId}</td>
        <td>${stu.name}</td>
        <td>${stu.marks}</td>
        <td>
          <button class="btn btn-small edit-btn">Edit</button>
        </td>
      </tr>
    `);

        row.find(".edit-btn").on("click", () => {
            // fill form with this row's data
            $("#studentId").val(stu._id);
            $("#sapId").val(stu.sapId);
            $("#name").val(stu.name);
            $("#marks").val(stu.marks);
            $("#submitBtn").text("Update Student");
        });

        tbody.append(row);
    });
}

function resetForm() {
    $("#studentId").val("");
    $("#student-form")[0].reset();
    $("#submitBtn").text("Add Student");
}

// ---------- PERFORMANCE: LOAD & RENDER CHARTS ----------
async function loadPerformance() {
    const res = await fetch("/api/performance");
    const perf = await res.json();
    const data = perf.ranges;

    renderBarChart(data);
    renderPieChart(data);
}

function renderBarChart(data) {
    d3.select("#bar-chart").selectAll("*").remove();

    const container = document.getElementById("bar-chart");
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };

    const svg = d3
        .select("#bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([0, innerWidth])
        .padding(0.3);

    const maxCount = d3.max(data, (d) => d.count) || 0;

    const y = d3
        .scaleLinear()
        .domain([0, maxCount])
        .nice()
        .range([innerHeight, 0]);

    g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x));

    g.append("g").call(d3.axisLeft(y).ticks(5));

    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.label))
        .attr("y", (d) => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", (d) => innerHeight - y(d.count))
        .attr("fill", "#38bdf8");

    g.selectAll(".bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.count) - 5)
        .attr("text-anchor", "middle")
        .text((d) => d.count);
}

function renderPieChart(data) {
    d3.select("#pie-chart").selectAll("*").remove();

    const total = d3.sum(data, (d) => d.count);
    if (total === 0) {
        // nothing to show
        return;
    }

    const container = document.getElementById("pie-chart");
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const radius = Math.min(width, height) / 2 - 10;

    const svg = d3
        .select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr(
            "transform",
            `translate(${width / 2},${height / 2})`
        );

    const pie = d3
        .pie()
        .value((d) => d.count)
        .sort(null);

    const arcs = pie(data);

    const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);

    const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.label))
        .range(["#38bdf8", "#a855f7", "#22c55e", "#f97316"]);

    svg
        .selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.label))
        .attr("stroke", "#020617")
        .style("stroke-width", "2px");

    // labels
    svg
        .selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .text((d) => {
            const pct = ((d.data.count / total) * 100).toFixed(0);
            return `${d.data.label} (${pct}%)`;
        });
}
