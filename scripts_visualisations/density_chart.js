/*--------------------------------------------------------------------------------
----- DENSITY CHART (for the average cart probability density)
--------------------------------------------------------------------------------*/

// Function to initialise the density data
function init_density_data() {
    // Prepare an empty density-ready dataset for the chart use
    const density_ready_dataset = [];

    // Iterate over the global customers dataset to initialise the density dataset
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        // Add the sales amount to the scatterplot-ready dataset
        density_ready_dataset.push(GLOBAL_SALES_DATA[i].amount);
    }

    // Save the completely converted scatterplot-ready dataset
    density_data = density_ready_dataset;
}

// Function to update the density chart and its datapoints
function update_density_chart() {
    // Re-extract every cart price from the global customers data
    init_density_data();

    // Compute the average carts prices histogram bins based on customers data
    let average_cart_bins = d3.histogram().domain(density_x_scale.domain()).thresholds(40)(density_data);

    // Compute the average cart prices density curbe with a Kernel Density Estimation method
    let average_cart_density = kernelDensityEstimator(kernelEpanechnikov(7), density_x_scale.ticks(40))(density_data);

    // Update the density histogram bins based on the updated customers carts prices data
    density_svg.selectAll("rect")
        .data(average_cart_bins)
        .transition()
        .duration(1000)
        .attr("x", function (d) { return density_x_scale(d.x0) + 1; })
        .attr("y", function (d) { return density_y_scale(d.length / density_data.length); })
        .attr("width", function (d) { return density_x_scale(d.x1) - density_x_scale(d.x0) - 1; })
        .attr("height", function (d) { return density_y_scale(0) - density_y_scale(d.length / density_data.length); })
        .style("fill", function (d) { return density_color_scale(d.length / density_data.length); });

    // Update the density curve with the updated customers carts prices data
    density_svg.select(".density-line")
        .datum(average_cart_density)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) { return density_x_scale(d[0]); })
            .y(function (d) { return density_y_scale(d[1]); }));
}


// Initialise the density dataset based on the global customers dataset
let density_data = [];
init_density_data();

// Configure and adjust the dimensions of the density chart
const density_width = 450, density_height = 265;
const density_margins = { top: 20, right: 30, bottom: 30, left: 40 };

// Create the scale for the X-axis and Y-axis, depending on values ranges
const density_x_scale = d3.scaleLinear()
    .domain([30, 205])
    .range([density_margins.left, density_width - density_margins.right]);
const density_y_scale = d3.scaleLinear()
    .domain([0, 0.1])
    .range([density_height - density_margins.bottom, density_margins.top]);

// Create the density chart container
var density_svg = d3.select("#density-chart")
    .attr('width', density_width)
    .attr('height', density_height)
    .attr('margin', density_margins);

// Add the density X-axis to the chart
density_svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (density_height - density_margins.bottom) + ")")
    .call(d3.axisBottom(density_x_scale))
    .append("text")
    .attr("x", density_width - density_margins.right)
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "end")
    .attr("font-weight", "bold");

// Add the density Y-axis to the chart
density_svg.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + density_margins.left + ",0)")
    .call(d3.axisLeft(density_y_scale).ticks(null, "%"));

// Create a dedicated color scale for the density depending on values in datapoints
const density_color_scale = d3.scaleLinear()
    .domain([0, 0.1])
    .range(["rgba(242, 222, 194, 0.8)", "rgba(169, 94, 13, 1)"]);

// Function to compute the density of datapoints
function kernelDensityEstimator(kernel, X) {
    return function (V) {
        return X.map(function (x) {
            return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
    };
}

// Kernel function (retrieved from Internet...) for the Kernel Density Estimation
function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

// Compute the initial data length, the bins formed by density data, and the density function
let n = density_data.length,
    bins = d3.histogram().domain(density_x_scale.domain()).thresholds(40)(density_data),
    density = kernelDensityEstimator(kernelEpanechnikov(7), density_x_scale.ticks(40))(density_data);

// Draw the histogram bins of the density data with the appropriate color scale corresponding to the cart prices
density_svg.insert("g", "*")
    .selectAll("rect")
    .data(bins)
    .enter().append("rect")
    .attr("x", function (d) { return density_x_scale(d.x0) + 1; })
    .attr("y", function (d) { return density_y_scale(d.length / n); })
    .attr("width", function (d) { return density_x_scale(d.x1) - density_x_scale(d.x0) - 1; })
    .attr("height", function (d) { return density_y_scale(0) - density_y_scale(d.length / n); })
    .style("fill", function (d) { return density_color_scale(d.length / n); });

// Draw the density curve of the density data
density_svg.append("path")
    .datum(density)
    .attr("class", "density-line") // Ajout de la classe CSS pour la courbe de densité
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return density_x_scale(d[0]); })
        .y(function (d) { return density_y_scale(d[1]); }));
