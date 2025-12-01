console.log("D3 Lab Loaded");

// Base SVG reference for Experiment 10.1
const svg = d3.select("#chart");

// 6. Experiment 10.1: Create a Bar Chart
const data = [30, 80, 45, 60, 20, 90, 50];

const width = 600;
const height = 300;
const barWidth = width / data.length;

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([0, height]);

svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", d => height - yScale(d))
    .attr("width", barWidth - 2)
    .attr("height", d => yScale(d))
    .attr("fill", "steelblue");

// 7. Experiment 10.2: Create Circles and Rectangles with Interactive Control
// Append a new SVG element for this experiment below the main one
const shapesSvg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 200);

// Create circles
shapesSvg.selectAll("circle")
    .data([50, 150, 250, 350])
    .enter()
    .append("circle")
    .attr("cx", d => d)
    .attr("cy", 80)
    .attr("r", 25)
    .attr("fill", "orange")
    .on("mouseover", function () {
        d3.select(this).attr("fill", "red");
    })
    .on("mouseout", function () {
        d3.select(this).attr("fill", "orange");
    });

// Create rectangles
shapesSvg.selectAll("rect")
    .data([60, 160, 260, 360])
    .enter()
    .append("rect")
    .attr("x", d => d)
    .attr("y", 120)
    .attr("width", 40)
    .attr("height", 30)
    .attr("fill", "green")
    .on("click", function () {
        d3.select(this).attr("fill", "purple");
    });

// 8. Experiment 10.3: Select an Element and Modify Its Properties
d3.select("#myDiv")
    .style("color", "blue")
    .style("font-size", "24px")
    .text("This text is modified by D3");

// 9. Experiment 10.4: Fetch Data from CSV and Populate a Graph
d3.csv("data.csv").then(data => {
    // Convert 'value' from text to numeric
    data.forEach(d => {
        d.value = +d.value;
    });

    const width = 600;
    const height = 300;

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([height, 0]);

    // Append a third SVG element for the CSV chart
    const svg2 = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "teal");
});
