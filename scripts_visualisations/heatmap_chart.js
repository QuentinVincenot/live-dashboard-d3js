/*--------------------------------------------------------------------------------
----- HEATMAP CHART (for the average amount of sales in every age category)
--------------------------------------------------------------------------------*/

// Function to initialise the scatterplot data
function init_heatmap_data() {
    // Prepare an empty heatmap-ready dataset for the chart use
    const heatmap_ready_dataset = [];

    // Prepare a map to store the sales of group/variable pairs, and another to count the occurrences
    const group_variable_map = new Map();
    const group_variable_counts = new Map();

    // Iterate over the global customers dataset to initialise the heatmap dataset
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        // Compute the various sums of amounts of sales for every group/variable pairs in the global dataset
        const map_key = GLOBAL_SALES_DATA[i].period.toString() + " " + GLOBAL_SALES_DATA[i].age_category.toString();
        if (group_variable_map.has(map_key)) {
            group_variable_map[map_key] += GLOBAL_SALES_DATA[i].amount;
            group_variable_counts[map_key] += 1;
        } else {
            group_variable_map[map_key] = GLOBAL_SALES_DATA[i].amount;
            group_variable_counts[map_key] = 1;
        }
    }

    // Iterate an other time on the group/variable pairs to compute the mean amounts of sales
    for (const key in group_variable_map) {
        // Extract the different parts of the key
        const keys = key.split((" "));
        const period = keys[0], age_category = keys[1];
        let mean_amount = group_variable_map[key] / group_variable_counts[key];
        // Create an adapted/converted format for the scatterplot chart datapoints
        const converted_datapoint = {
            group: period,
            variable: age_category,
            value: mean_amount
        };
        // Add the converted datapoint to the scatterplot-ready dataset
        heatmap_ready_dataset.push(converted_datapoint);
    }

    // Save the completely converted heatmap-ready dataset
    heatmap_data = heatmap_ready_dataset;
}

// Function to update the heatmap chart and its datapoints
function update_heatmap_chart() {
    // Recompute every average sales values by month/age category
    init_heatmap_data();

    // Update the rectangles colors depending on new average sales values
    heatmap_svg.selectAll("rect")
        .data(heatmap_data)
        .transition()
        .duration(1000)
        .style("fill", function (d) { return heatmap_color_scale(d.value) });

    // Update the content of the tooltip
    heatmap_svg.selectAll("rect")
        .on("mousemove", heatmap_mousemove);
}


// Initialise the heatmap dataset based on the global customers dataset
let heatmap_data = [];
init_heatmap_data();

// Configure and adjust the dimensions of the heatmap chart
const heatmap_width = 450, heatmap_height = 265;
const heatmap_margins = { top: 20, right: 20, bottom: 20, left: 40 };
const heatmap_chart_width = heatmap_width - heatmap_margins.left - heatmap_margins.right;
const heatmap_chart_height = heatmap_height - heatmap_margins.top - heatmap_margins.bottom;

// Retrieve the labels of rows/columns : they are the unique identifiers of the columns called 'group' and 'variable'
const heatmap_unique_groups = Array.from(new Set(heatmap_data.map(d => d.group))).sort((a, b) => a.localeCompare(b));
const heatmap_unique_variables = Array.from(new Set(heatmap_data.map(d => d.variable))).sort((a, b) => -a.localeCompare(b));

// Create the scale for the X-axis and Y-axis, depending on values ranges
const heatmap_x_scale = d3.scaleBand()
    .range([0, heatmap_chart_width])
    .domain(heatmap_unique_groups)
    .padding(0.05);
const heatmap_y_scale = d3.scaleBand()
    .range([heatmap_chart_height, 0])
    .domain(heatmap_unique_variables)
    .padding(0.05);

// Create the heatmap chart container
const heatmap_svg = d3.select("#heatmap-chart")
    .attr("width", heatmap_width)
    .attr("height", heatmap_height)
    .append("g")
    .attr("transform", `translate(${heatmap_margins.left}, ${heatmap_margins.top})`);

// Add the heatmap X-axis to the chart
heatmap_svg.append("g")
    .style("font-size", 15)
    .attr("transform", `translate(0, ${heatmap_chart_height})`)
    .call(d3.axisBottom(heatmap_x_scale).tickSize(0))
    .select(".domain").remove()

// Add the heatmap Y-axis to the chart
heatmap_svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(heatmap_y_scale).tickSize(0))
    .select(".domain").remove()

// Create a dedicated color scale for the heatmap depending on values in datapoints
const heatmap_color_scale = d3.scaleLinear()
    .domain([10, 200])
    .range(["rgba(186, 220, 212, 0.8)", "rgba(35, 87, 82, 1)"]);

// Create a specific tooltip object to display when hovering the mouse on the heatmap
const heatmap_tooltip = d3.select("#heatmap-chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

// Configure the various behaviours of tooltips depending on mouse events
const heatmap_mouseover = function (event, d) {
    heatmap_tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
}
const heatmap_mousemove = function (event, d) {
    heatmap_tooltip
        .html("The exact value of<br>this cell is: " + d.value)
        .style("left", (event.x) / 2 + "px")
        .style("top", (event.y) / 2 + "px")
}
const heatmap_mouseleave = function (event, d) {
    heatmap_tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
}

// Configure and add the dedicated contouring squares on the heatmap
heatmap_svg.selectAll()
    .data(heatmap_data, function (d) { return d.group + ':' + d.variable; })
    .join("rect")
    .attr("x", function (d) { return heatmap_x_scale(d.group) })
    .attr("y", function (d) { return heatmap_y_scale(d.variable) })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", heatmap_x_scale.bandwidth())
    .attr("height", heatmap_y_scale.bandwidth())
    .style("fill", function (d) { return heatmap_color_scale(d.value) })
    .style("stroke-width", 2)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", heatmap_mouseover)
    .on("mousemove", heatmap_mousemove)
    .on("mouseleave", heatmap_mouseleave)
