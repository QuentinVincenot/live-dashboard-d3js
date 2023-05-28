/*--------------------------------------------------------------------------------
----- SCATTERPLOT CHART (for the average cart price relative to customers age)
--------------------------------------------------------------------------------*/

// Function to initialise the scatterplot data
function init_scatterplot_data() {
    // Prepare an empty scatterplot-ready dataset for the chart use
    const scatterplot_ready_dataset = [];

    // Iterate over the global customers dataset to initialise the scatterplot dataset
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        // Create an adapted/converted format for the scatterplot chart datapoints
        const converted_datapoint = {
            x: GLOBAL_SALES_DATA[i].age,
            y: GLOBAL_SALES_DATA[i].amount,
            radius: 5
        };
        // Add the converted datapoint to the scatterplot-ready dataset
        scatterplot_ready_dataset.push(converted_datapoint);
    }

    // Save the completely converted scatterplot-ready dataset
    scatterplot_data = scatterplot_ready_dataset;
}

// Function to update the scatterplot chart and its datapoints
function update_scatterplot_chart() {
    // Iterate over every data points
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        // Update only datapoints who changed
        if (GLOBAL_SALES_DATA[i].age != scatterplot_data[i].x &&
            GLOBAL_SALES_DATA[i].amount != scatterplot_data[i].y) {
            // Update the coordinates of the points in the scatterplot data
            scatterplot_data[i].x = GLOBAL_SALES_DATA[i].age;
            scatterplot_data[i].y = GLOBAL_SALES_DATA[i].amount;

            // Update the dataset linked to the scatterplot chart
            const scatterplot_circles = d3.select("#scatterplot-chart")
                .selectAll("circle")
                .data(scatterplot_data);

            // Update the visual elements (circles positions) of the scatterplot
            scatterplot_circles.filter((d, j) => j === i)
                .transition()
                .duration(1000)
                .attr("cx", d => scatterplot_x_scale(d.x))
                .attr("cy", d => scatterplot_y_scale(d.y));
        }
    }
}


// Initialise the scatterplot dataset based on the global customers dataset
let scatterplot_data = [];
init_scatterplot_data();

// Configure and adjust the dimensions of the scatterplot chart
const scatterplot_width = 450, scatterplot_height = 265;
const scatterplot_margins = { top: 20, right: 20, bottom: 30, left: 30 };
const scatterplot_chart_width = scatterplot_width - scatterplot_margins.left - scatterplot_margins.right;
const scatterplot_chart_height = scatterplot_height - scatterplot_margins.top - scatterplot_margins.bottom;

// Create the scale for the X-axis and Y-axis, depending on values ranges
const scatterplot_x_scale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, scatterplot_chart_width]);
const scatterplot_y_scale = d3.scaleLinear()
    .domain([0, 200])
    .range([scatterplot_chart_height, 0]);

// Create the scatterplot X-axis and Y-axis
const scatterplot_x_axis = d3.axisBottom(scatterplot_x_scale);
const scatterplot_y_axis = d3.axisLeft(scatterplot_y_scale);

// Create the scatterplot chart container
const scatterplot_svg = d3.select("#scatterplot-chart")
    .attr("width", scatterplot_width)
    .attr("height", scatterplot_height)
    .append("g")
    .attr("transform", `translate(${scatterplot_margins.left},${scatterplot_margins.top})`);

// Add the scatterplot X-axis to the chart
scatterplot_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${scatterplot_chart_height})`)
    .call(scatterplot_x_axis);

// Add the scatterplot Y-axis to the chart
scatterplot_svg.append("g")
    .attr("class", "y axis")
    .call(scatterplot_y_axis);

// Create the circles and plot them on the scatterplot chart
const scatterplot_circles = scatterplot_svg.selectAll("circle")
    .data(scatterplot_data)
    .enter()
    .append("circle")
    .attr("cx", d => scatterplot_x_scale(d.x))
    .attr("cy", d => scatterplot_y_scale(d.y))
    .attr("r", 5)
    .attr("fill", "rgba(101, 54, 115, 0.6)");
