/*--------------------------------------------------------------------------------
----- INPUT STARTING DATA POINTS
--------------------------------------------------------------------------------*/

// Function to initialise data in a global manner, that will serve for all visualisations
function startup_initialise_data() {
    // Initialise an array that will contain all generated customers data
    let customers_datapoints = [];
    // Randomly choose the number of starting customers to generate data
    const number_of_customers = Math.floor(Math.random() * 100) + 500;

    // Generate a defined set of customers, one by one
    for (let i = 0; i < number_of_customers; i++) {
        // Randomly generate a unique ID for the new customer
        let generated_id = Math.floor(Math.random() * Date.now()).toString();

        // Randomly select the age of the new customer
        let generated_age = Math.floor(Math.random() * 90) + 10;

        // Affect the new customer to its right age category
        let generated_category = "80-100";
        if (generated_age >= 10 && generated_age <= 35) { generated_category = "10-35"; }
        else if (generated_age > 35 && generated_age <= 50) { generated_category = "35-50"; }
        else if (generated_age > 50 && generated_age <= 65) { generated_category = "50-65"; }
        else if (generated_age > 65 && generated_age <= 80) { generated_category = "65-80"; }
        else if (generated_age > 80 && generated_age <= 100) { generated_category = "80-100"; }

        // Randomly select a dedicated month for this customer
        const possible_periods = ["01-Jan", "02-Feb", "03-Mar", "04-Apr", "05-May", "06-Jun",
            "07-Jul", "08-Aug", "09-Sep", "10-Oct", "11-Nov", "12-Dec"];
        let generated_period = possible_periods[Math.floor(Math.random() * possible_periods.length)];

        // Randomly affect an amount of sales to this new customer
        const mean_age = 55, max_amount = 180;
        generated_amount = -0.075 * (generated_age - mean_age) * (generated_age - mean_age) + max_amount;
        // Add a random factor of +/-20 to the amount of the new customer
        let amount_random_adjust = Math.floor(Math.random() * 40) - 20;
        generated_amount += amount_random_adjust;

        // Create the complete set of features of the new customer
        const generated_customer = {
            id: generated_id,
            age: generated_age,
            age_category: generated_category,
            period: generated_period,
            amount: generated_amount
        };

        // Add the new customer to the list of all generated customers
        customers_datapoints.push(generated_customer);
    }

    // Affect the generated customers datapoints to the global sales data used for every visualisations
    GLOBAL_SALES_DATA = customers_datapoints;

    // Initialise the total customers/total sales/average cart price KPI cards with the generated customers data
    update_total_customers_KPI_card();
    update_total_sales_KPI_card();
    update_average_cart_KPI_card();
}

// Function to update on a regular basis both data and charts in the dashboard
function update_data_and_charts() {
    // Define the number and the indices of the customers to change/replace
    const number_of_updates = 70;
    let customers_indices_to_replace = [];
    for (let i = 0; i < number_of_updates; i++) {
        // Select a random customer index to change/replace
        let random_index = Math.floor(Math.random() * GLOBAL_SALES_DATA.length);
        customers_indices_to_replace.push(random_index);
    }

    // Change the selected customers with other/new random values for their features
    for (let i = 0; i < customers_indices_to_replace.length; i++) {
        // Randomly generate a unique ID for the new customer
        let generated_id = Math.floor(Math.random() * Date.now()).toString();

        // Randomly adjust the age of the new customer (+/5 regarding the previous customer)
        const previous_customer_age = GLOBAL_SALES_DATA[customers_indices_to_replace[i]].age;
        const random_age_adjust = Math.floor(Math.random() * 10) - 5;
        let generated_age = previous_customer_age + random_age_adjust;
        if (generated_age < 10) { generated_age = 10; }
        if (generated_age > 100) { generated_age = 100; }

        // Affect the new customer to its right age category
        let generated_category = "80-100";
        if (generated_age >= 10 && generated_age <= 35) { generated_category = "10-35"; }
        else if (generated_age > 35 && generated_age <= 50) { generated_category = "35-50"; }
        else if (generated_age > 50 && generated_age <= 65) { generated_category = "50-65"; }
        else if (generated_age > 65 && generated_age <= 80) { generated_category = "65-80"; }
        else if (generated_age > 80 && generated_age <= 100) { generated_category = "80-100"; }

        // Randomly affect an amount of sales to this new customer
        const mean_age = 55, max_amount = 180;
        generated_amount = -0.075 * (generated_age - mean_age) * (generated_age - mean_age) + max_amount;
        // Add a random factor of +/-20 to the amount of the new customer
        let random_amount_adjust = Math.floor(Math.random() * 40) - 20;
        generated_amount += random_amount_adjust;

        // Create the new customer with its brand new features
        const replaced_customer = {
            id: generated_id,
            age: generated_age,
            age_category: generated_category,
            period: GLOBAL_SALES_DATA[i].period,
            amount: generated_amount
        };

        // Replace the old customer by the new generated one
        GLOBAL_SALES_DATA[customers_indices_to_replace[i]] = replaced_customer;
    }

    // Update the total customers/total sales/average cart price KPI cards
    update_total_customers_KPI_card();
    update_total_sales_KPI_card();
    update_average_cart_KPI_card();

    // Update the scatterplot/line/lolipop dedicated data and charts
    update_scatterplot_chart();
    update_line_chart();
    update_lolipop_chart();

    // Update the heatmap/density/donut dedicated data and charts
    update_heatmap_chart();
    update_density_chart();
    update_donut_chart();
}

// Function to update the text value of the total customers KPI card
function update_total_customers_KPI_card() {
    // Update the KPI card value text with the updated total customers number
    d3.select("#total_customers_kpi").text(GLOBAL_SALES_DATA.length.toLocaleString());
}

// Function to update the text value of the total sales KPI card
function update_total_sales_KPI_card() {
    // Compute the total number of sales among every customer
    let total_sales = 0;
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        total_sales += GLOBAL_SALES_DATA[i].amount;
    }
    // Update the KPI card value text with the updated total sales amount
    d3.select("#total_sales_kpi").text(Math.floor(total_sales).toLocaleString());
}

// Function to update the text value of the average cart price KPI card
function update_average_cart_KPI_card() {
    // Compute the total number of sales among every customer
    let total_sales = 0, average_cart = 0;
    for (let i = 0; i < GLOBAL_SALES_DATA.length; i++) {
        total_sales += GLOBAL_SALES_DATA[i].amount;
    }
    // Compute the average cart price by dividing the total sales by the number of customers
    average_cart = total_sales / GLOBAL_SALES_DATA.length;
    // Update the KPI card value text with the updated average cart price
    d3.select("#average_cart_kpi").text(Math.floor(average_cart).toLocaleString());
}


// Call the initialisation function to start with a pool of data points and initialise customers data
let GLOBAL_SALES_DATA = [];
startup_initialise_data();

// Update every chart based on the updated data
setInterval(update_data_and_charts, 2000);
