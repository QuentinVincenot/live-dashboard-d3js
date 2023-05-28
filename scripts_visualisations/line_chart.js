/*--------------------------------------------------------------------------------
----- LINE CHART (for the monthly sales over a complete year)
--------------------------------------------------------------------------------*/

// Function to initialise the line data
function init_line_data() {
    // Prepare an empty line-ready dataset for the chart use
    const line_ready_dataset = [];
    for (let month_id = 0; month_id < 12; month_id++) { line_ready_dataset.push(0); }

    // Iterate over the global customers dataset to initialise the line dataset
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        console.log(GLOBAL_SALES_DATA[i]);
        // Aggregate the sum of sales and the amount of customers per age category
        const month_period = parseInt(GLOBAL_SALES_DATA[i].period.toString().substring(0, 2)) - 1;
        line_ready_dataset[month_period] += GLOBAL_SALES_DATA[i].amount;
    }

    console.log(line_ready_dataset);
    let sum = 0;
    for (let i = 0; i < line_ready_dataset.length; i++) {
        sum += line_ready_dataset[i];
    }
    console.log(sum);

    line_data = line_ready_dataset;
}

// Function to update the line chart and its datapoints
function update_line_chart() {
    // Recompute every monthly total sales
    init_line_data();

    // Update the lines on the line chart with the updated customers data
    line_svg.select(".line")
        .datum(line_data)
        .transition()
        .duration(1000)
        .attr("d", line_chart_line);

    // Update the circles on the line chart with the updated customers data
    line_svg.selectAll("circle")
        .data(line_data)
        .transition()
        .duration(1000)
        .attr("cy", d => line_y_scale(d))
        .attr("fill", d => line_color_scale(d));
}


// Initialise the line dataset based on the global customers dataset
let line_data = [];
init_line_data();

// Configure and adjust the dimensions of the line chart
const line_width = 450, line_height = 265;
const line_margins = { top: 10, right: 15, bottom: 30, left: 45 };
const line_chart_width = line_width - line_margins.left - line_margins.right;
const line_chart_height = line_height - line_margins.top - line_margins.bottom;

// Create the scale for the X-axis and Y-axis, depending on values ranges
const line_x_scale = d3.scaleLinear()
    .domain([1, line_data.length])
    .range([0, line_chart_width]);
const line_y_scale = d3.scaleLinear()
    .domain([0, 10000])
    .range([line_chart_height, 0]);

// Create the line chart container
const line_svg = d3.select("#line-chart")
    .attr("width", line_width)
    .attr("height", line_height)
    .append("g")
    .attr("transform", `translate(${line_margins.left},${line_margins.top})`);

// Add the line X-axis to the chart
line_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${line_chart_height})`)
    .call(d3.axisBottom(line_x_scale));

// Add the line Y-axis to the chart
line_svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(line_y_scale));

// Create the general line objects
const line_chart_line = d3.line()
    .x((d, i) => line_x_scale(i + 1))
    .y(d => line_y_scale(d))
    .curve(d3.curveLinear);

// Create the line on the chart with the appropriate configurations
line_svg.append("path")
    .datum(line_data)
    .attr("class", "line")
    .attr("d", line_chart_line)
    .attr("fill", "none")
    .attr("stroke", "rgba(186, 220, 212, 0.8)")
    .attr("stroke-width", 2);

// Create a dedicated color scale for the line depending on values in datapoints
const line_color_scale = d3.scaleLinear()
    .domain([0, 10000])
    .range(["rgba(186, 220, 212, 0.8)", "rgba(35, 87, 82, 1)"]);

// Create the circles on the line to have a complete line chart
line_svg.selectAll("circle")
    .data(line_data)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => line_x_scale(i + 1))
    .attr("cy", d => line_y_scale(d))
    .attr("r", 5)
    .attr("fill", d => line_color_scale(d))
    .raise();
