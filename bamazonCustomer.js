const inquirer = require('inquirer');
const mysql = require('mysql');
const { table } = require('table');
const formatCurrency = require('format-currency')

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw (err);
    console.log("Connected as ID: " + connection.threadId + "\n");
    listProducts()
});

function listProducts() {
    console.log("Listing all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw (err)
        const response = res
        let data, output;
        data = [
            ['ID', 'Product Name', 'Category', 'Price', 'Quantity'],
            [res[0].item_id, res[0].product_name, res[0].department_name, "$" + formatCurrency(res[0].price), res[0].stock_quantity],
            [res[1].item_id, res[1].product_name, res[1].department_name, "$" + formatCurrency(res[1].price), res[1].stock_quantity],
            [res[2].item_id, res[2].product_name, res[2].department_name, "$" + formatCurrency(res[2].price), res[2].stock_quantity],
            [res[3].item_id, res[3].product_name, res[3].department_name, "$" + formatCurrency(res[3].price), res[3].stock_quantity],
            [res[4].item_id, res[4].product_name, res[4].department_name, "$" + formatCurrency(res[4].price), res[4].stock_quantity],
            [res[5].item_id, res[5].product_name, res[5].department_name, "$" + formatCurrency(res[5].price), res[5].stock_quantity],
            [res[6].item_id, res[6].product_name, res[6].department_name, "$" + formatCurrency(res[6].price), res[6].stock_quantity],
            [res[7].item_id, res[7].product_name, res[7].department_name, "$" + formatCurrency(res[7].price), res[7].stock_quantity],
            [res[8].item_id, res[8].product_name, res[8].department_name, "$" + formatCurrency(res[8].price), res[8].stock_quantity],
            [res[9].item_id, res[9].product_name, res[9].department_name, "$" + formatCurrency(res[9].price), res[9].stock_quantity],
        ];

        output = table(data)
        console.log(output);

        inquirer
            .prompt([
                {
                    type: "number",
                    message: "What is the Id of the product you wish to buy?",
                    name: 'itemId'
                },
                {
                    type: "number",
                    message: "How many do you need?",
                    name: 'quantity'
                },
            ])
            .then(function(inqRes){
                const id = inqRes.itemId - 1;
                const purchaseQuantity = inqRes.quantity;
        
                if (purchaseQuantity > response[id].stock_quantity){
                    console.log('\n------------------------------------------');
                    console.log("EEEERRRRRRRRRRROOOOOOORRRRR! \n   Not enough in stock!");
                    console.log('------------------------------------------\n');
                    connection.end()
                } else {
                    console.log("\nOrder Received!");
                    console.log('------------------------------------------');
                    console.log(purchaseQuantity + " x " + response[id].product_name);
                    console.log('------------------------------------------');
                    console.log("Total: $" + formatCurrency((purchaseQuantity * response[id].price)));
                    console.log('------------------------------------------\n');
                    subtractQuantity(id, purchaseQuantity)
                }
                
                
            })

        
    })
};

function subtractQuantity(id, quantity){
    const sql = `
    UPDATE products
    SET stock_quantity = stock_quantity - ${quantity}
    WHERE item_id = ${id + 1}
    `;

    // console.log(sql);
    
    connection.query(sql, function(err){
        if (err) throw(err)
    } )
    connection.end()
}
