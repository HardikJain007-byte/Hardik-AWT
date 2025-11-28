console.log("D3 Lab Loaded");

// Basic SVG reference
const svg = d3.select("#chart");

// const data = [30, 80, 45, 60, 20, 90, 50];

// const width = 600;
// const height = 300;
// const barWidth = width / data.length;

// const yScale = d3.scaleLinear()
//     .domain([0, d3.max(data)])
//     .range([0, height]);

// svg.selectAll("rect")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("x", (d, i) => i * barWidth)
//     .attr("y", d => height - yScale(d))
//     .attr("width", barWidth - 2)
//     .attr("height", d => yScale(d))
//     .attr("fill", "steelblue");

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
