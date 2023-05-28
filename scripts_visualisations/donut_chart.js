/*--------------------------------------------------------------------------------
----- DONUT CHART (for the amount of customers in every age category)
--------------------------------------------------------------------------------*/

// Function to initialise the donut data
function init_donut_data() {
    // Prepare an empty donut-ready dataset for the chart use
    const donut_ready_dataset = [];

    // Prepare a map to store the number of customers per age category
    const age_category_counts = new Map();

    // Iterate over the global customers dataset to initialise the donut dataset
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        // Aggregate the sum of sales and the amount of customers per age category
        const map_key = GLOBAL_SALES_DATA[i].age_category.toString();
        if (age_category_counts.has(map_key)) {
            age_category_counts[map_key] += 1;
        } else {
            age_category_counts[map_key] = 1;
        }
    }

    // Iterate an other time on the age categories to convert the donut datapoints to the right format
    for (const key in age_category_counts) {
        // Create an appropriate datapoint in the format of the expected donut dataset
        const converted_datapoint = {
            category: key,
            value: age_category_counts[key]
        };
        // Add the converted datapoint to the lolipop-ready dataset
        donut_ready_dataset.push(converted_datapoint);
    }

    // Save the completely converted donut-ready dataset
    donut_data = donut_ready_dataset;

    // Sort the age categories by ascending order
    donut_data.sort((a, b) => a.category.localeCompare(b.category));
}

// Function to update the donut chart and its datapoints
function update_donut_chart() {
    // Re-extract every customers count per age category from the global customers data
    init_donut_data();

    // Update the donut data slices with the updated customers data
    var updateSlices = donut_svg.selectAll('.slice')
        .data(pie(donut_data));

    // Update the donut slices
    updateSlices.select('path')
        .transition()
        .duration(1000)
        .attrTween('d', arcTween);

    // Update the donut slices labels
    updateSlices.select('text')
        .transition()
        .duration(1000)
        .attrTween('transform', categoryArcTween);
}


// Initialise the donut dataset based on the global customers dataset
let donut_data = [];
init_donut_data();

// Configure and adjust the dimensions of the donut chart
const donut_width = 450, donut_height = 265,
    donut_radius = Math.min(donut_width, donut_height) / 2;

// Create the donut chart container
var donut_svg = d3.select('#donut-chart')
    .attr('width', donut_width)
    .attr('height', donut_height)
    .append('g')
    .attr('transform', 'translate(' + donut_width / 2 + ',' + donut_height / 2 + ')');

// Configure the donut arcs generation and parameters
var donut_arc = d3.arc()
    .innerRadius(donut_radius * 0.75)
    .outerRadius(donut_radius);

// Create a dedicated color scale for the donut depending on the age categories
const donut_color_scale = d3.scaleLinear()
    .domain([0, 4])
    .range(["rgba(217, 205, 232, 0.8)", "rgba(101, 54, 115, 1)"]);

// Initialisation of the initial pie chart and slices sizes
var pie = d3.pie()
    .value(function (d) { return d.value; })
    .sort(null);

// Interpolation function to have a smooth arc update (retrieved from Internet...)
function arcTween(d) {
    var interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(0);
    return function (t) {
        return donut_arc(interpolate(t));
    };
}

// Interpolation function to have a smooth label update (retrieved from Internet...)
function categoryArcTween(d) {
    var interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(0);
    return function (t) {
        var updatedD = interpolate(t);
        return 'translate(' + donut_arc.centroid(updatedD) + ')';
    };
}

// Add the slices sizes to the donut chart
var slices = donut_svg.selectAll('slice')
    .data(pie(donut_data))
    .enter()
    .append('g')
    .attr('class', 'slice');

// Add the slices colors to the donut chart
slices.append('path')
    .attr('fill', function (d, i) { return donut_color_scale(i); })
    .transition()
    .duration(1000)
    .attrTween('d', arcTween);

// Add the slices labels texts to the donut chart
slices.append('text')
    .attr('transform', function (d) { return 'translate(' + donut_arc.centroid(d) + ')'; })
    .attr('dy', '0.35em')
    .text(function (d) { return d.data.category; })
    .style("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .transition()
    .duration(1000)
    .attrTween('transform', categoryArcTween);
