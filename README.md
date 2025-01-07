## Plates Co Sales System
This is a simple proof-of-concept for a sales system built using Node.js without any frameworks. The system allows users to add products to a basket, apply special offers, and calculate the total cost of their order, including delivery charges.

## Features
Product Catalog: Three products (Red Plate, Green Plate, Blue Plate) with associated prices.
Delivery Charges: Based on the total order value.
Orders under $50: $4.95 delivery.
Orders under $90: $2.95 delivery.
Orders of $90 or more: Free delivery.
Special Offers: The offer "Buy one Red Plate, get the second one at half price."

## Setup and Usage
*Clone the repository:*
git clone https://github.com/ashrithashetty8/plates_co-leanscale-ashritha
cd plates_co-leanscale-ashritha

*Install Node.js* 
Ensure that Node.js is installed. You can download and install it from https://nodejs.org/.

*Run the server*
Start the server by running the following command:
"node app.js"
The server will now be running at http://localhost:3000.

## Endpoints

### 1. GET /products
    Lists all available products in the catalogue.

    *Request Example:*
    GET : http://localhost:3000/products

    *Response Example:*
    {
        "R01": { "code": "R01", "price": 32.95 },
        "G01": { "code": "G01", "price": 24.95 },
        "B01": { "code": "B01", "price": 7.95 }
    }

### 2. POST /add
    Adds a product to the basket by providing the product code in the request body.

    *Request Example:*
    POST : http://localhost:3000/add
    Content-Type: application/x-www-form-urlencoded
    productCode=R01

    *Response Example:*
    {
        "message": "Added R01 to the basket",
        "basket": ["R01"]
    }

### 3. GET /total
    Calculates and returns the total cost of the basket, considering products, offers, and delivery charges.

    *Request Example:*
    GET : http://localhost:3000/total

    *Response Example:*
    {
        "total": 32.95
    }

### 4. POST /clear
    Clears all items in the basket.
    
    *Request Example:*
    POST : http://localhost:3000/clear
    
    *Response Example:*
    {
        "message": "Basket has been cleared"
    }

## Testing the API
*You can test the endpoints using tools like Postman.*
