/*--------------------------------------------------------------------------------
----- LOLIPOP CHART (for the average cart price by customer age category)
--------------------------------------------------------------------------------*/

// Function to initialise the lolipop data
function init_lolipop_data() {
    // Prepare an empty lolipop-ready dataset for the chart use
    const lolipop_ready_dataset = [];

    // Prepare a map to store the sales per age category, and another to count the occurrences
    const age_category_sales_map = new Map();
    const age_category_counts = new Map();

    // Iterate over the global customers dataset to initialise the lolipop dataset
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        // Aggregate the sum of sales and the amount of customers per age category
        const map_key = GLOBAL_SALES_DATA[i].age_category.toString();
        if (age_category_sales_map.has(map_key)) {
            age_category_sales_map[map_key] += GLOBAL_SALES_DATA[i].amount;
            age_category_counts[map_key] += 1;
        } else {
            age_category_sales_map[map_key] = GLOBAL_SALES_DATA[i].amount;
            age_category_counts[map_key] = 1;
        }
    }

    // Iterate an other time on the age categories to compute the mean amounts of sales
    for (const key in age_category_sales_map) {
        // Compute the mean amount of sales for the current age category
        let mean_amount = age_category_sales_map[key] / age_category_counts[key];
        // Create an appropriate datapoint in the format of the expected lolipop dataset
        const converted_datapoint = {
            category: key,
            value: mean_amount
        };
        // Add the converted datapoint to the lolipop-ready dataset
        lolipop_ready_dataset.push(converted_datapoint);
    }

    // Save the completely converted lolipop-ready dataset
    lolipop_data = lolipop_ready_dataset;

    // Sort the age categories by ascending order
    lolipop_data.sort((a, b) => a.category.localeCompare(b.category));
}

// Function to update the lolipop chart and its datapoints
function update_lolipop_chart() {
    // Recompute every average sales values by age category
    init_lolipop_data();

    // Update the data linked to the lolipop general elements
    const lolipops = lolipop_svg.selectAll(".lolipop")
        .data(lolipop_data);

    // Update the lolipop lines with the new average sales values by age category
    lolipops.select("line")
        .transition()
        .duration(1000)
        .attr("stroke", (d, i) => lolipop_color_scale(d.value))
        .attr("x2", d => lolipop_x_scale(d.value));

    // Update the lolipop circles with the new average sales values by age category
    lolipops.select("circle")
        .transition()
        .duration(1000)
        .attr("fill", (d, i) => lolipop_color_scale(d.value))
        .attr("cx", d => lolipop_x_scale(d.value));
}


// Initialise the scatterplot dataset based on the global customers dataset
let lolipop_data = [];
init_lolipop_data();

// Configure and adjust the dimensions of the lolipop chart
const lolipop_width = 450, lolipop_height = 265;
const lolipop_margins = { top: 20, right: 20, bottom: 30, left: 60 };
const lolipop_chart_width = lolipop_width - lolipop_margins.left - lolipop_margins.right;
const lolipop_chart_height = lolipop_height - lolipop_margins.top - lolipop_margins.bottom;

// Create the scale for the X-axis and Y-axis, depending on values ranges
const lolipop_x_scale = d3.scaleLinear()
    .domain([0, 200])
    .range([0, lolipop_chart_width]);
const lolipop_y_scale = d3.scaleBand()
    .domain(lolipop_data.map(d => d.category))
    .range([0, lolipop_chart_height])
    .padding(0.1);

// Create the lolipop X-axis and Y-axis
const lolipop_x_axis = d3.axisBottom(lolipop_x_scale);
const lolipop_y_axis = d3.axisLeft(lolipop_y_scale).tickSize(0).tickFormat("");

// Create the lolipop chart container
const lolipop_svg = d3.select("#lolipop-chart")
    .attr("width", lolipop_width)
    .attr("height", lolipop_height);

// Add the lolipop X-axis to the chart
lolipop_svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${lolipop_margins.left}, ${lolipop_margins.top + lolipop_chart_height})`)
    .call(lolipop_x_axis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("transform", "translate(10, 0)");

// Add the lolipop Y-axis to the chart
const lolipop_yAxisGroup = lolipop_svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${lolipop_margins.left}, ${lolipop_margins.top})`)
    .call(lolipop_y_axis);

// Create a dedicated color scale for the lolipop depending on values in datapoints
const lolipop_color_scale = d3.scaleLinear()
    .domain([0, 200])
    .range(["rgba(242, 222, 194, 0.8)", "rgba(169, 94, 13, 1)"]);

// Create the general lolipop objects
const lolipops = lolipop_svg.selectAll(".lolipop")
    .data(lolipop_data)
    .enter()
    .append("g")
    .attr("class", "lolipop")
    .attr("transform", d => `translate(${lolipop_margins.left}, ${lolipop_margins.top + lolipop_y_scale(d.category)})`);

// Create the lines to create the lolipop handles
lolipops.append("line")
    .attr("x1", 0)
    .attr("y1", lolipop_y_scale.bandwidth() / 2)
    .attr("x2", 0)
    .attr("y2", lolipop_y_scale.bandwidth() / 2)
    .attr("stroke", (d, i) => lolipop_color_scale(d.value))
    .attr("stroke-width", 2)
    .transition()
    .duration(1000)
    .attr("x2", d => lolipop_x_scale(d.value));

// Create the cricles at the end of the lolipops
lolipops.append("circle")
    .attr("cx", 0)
    .attr("cy", lolipop_y_scale.bandwidth() / 2)
    .attr("r", 5)
    .attr("fill", (d, i) => lolipop_color_scale(d.value))
    .transition()
    .duration(1000)
    .attr("cx", d => lolipop_x_scale(d.value));

// Add the age categories texts on the left margin of the lolipop chart
lolipops.append("text")
    .attr("class", "label")
    .attr("x", 15 - lolipop_margins.left)
    .attr("y", lolipop_y_scale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => d.category)
    .style("font-family", "sans-serif")
    .style("font-size", "10px");
