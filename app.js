const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Product Catalogue, Delivery Rules, and Offers
const catalogue = {
    R01: { code: 'R01', price: 32.95 }, // Red Plate
    G01: { code: 'G01', price: 24.95 }, // Green Plate
    B01: { code: 'B01', price: 7.95 },  // Blue Plate
};

const deliveryRules = {
    standardDeliveryCost: 4.95,
    discountedDeliveryCost: 2.95,
    freeDeliveryThreshold: 90,
    discountedDeliveryThreshold: 50,
};

const offers = [
    {
        productCode: 'R01',
        offerType: 'half-price-on-second', // "buy one, get second half price"
    },
];

// Basket Class Definition
class Basket {
    constructor(catalogue, deliveryRules, offers) {
        this.catalogue = catalogue;
        this.deliveryRules = deliveryRules;
        this.offers = offers;
        this.items = [];
    }

    add(productCode) {
        if (this.catalogue[productCode]) {
            this.items.push(productCode);
        } else {
            console.log(`Product with code ${productCode} not found.`);
        }
    }

    calculateDelivery(total) {
        if (total >= this.deliveryRules.freeDeliveryThreshold) {
            return 0;
        } else if (total >= this.deliveryRules.discountedDeliveryThreshold) {
            return this.deliveryRules.discountedDeliveryCost;
        } else {
            return this.deliveryRules.standardDeliveryCost;
        }
    }

    applyOffers() {
        let total = 0;
        let redPlatesCount = 0;

        for (const productCode of this.items) {
            const product = this.catalogue[productCode];
            if (productCode === 'R01') {
                redPlatesCount += 1;
                if (redPlatesCount % 2 === 0) {
                    total += product.price / 2;
                } else {
                    total += product.price;
                }
            } else {
                total += product.price;
            }
        }
        return total;
    }

    total() {
        let subtotal = this.applyOffers();
        let delivery = this.calculateDelivery(subtotal);
        return subtotal + delivery;
    }

    clear() {
        this.items = [];
    }

    getItems() {
        return this.items;
    }
}

// Initialize basket
const basket = new Basket(catalogue, deliveryRules, offers);

// Create server to handle requests
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Set the headers for the response
    res.setHeader('Content-Type', 'application/json');

    // Handle routes
    if (path === '/products' && method === 'GET') {
        // List available products
        res.statusCode = 200;
        res.end(JSON.stringify(catalogue));

    } else if (path === '/add' && method === 'POST') {
        // Add product to basket
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const { productCode } = querystring.parse(body);
            if (productCode) {
                basket.add(productCode);
                res.statusCode = 200;
                res.end(JSON.stringify({ message: `Added ${productCode} to the basket`, basket: basket.getItems() }));
            } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ message: 'Product code is required' }));
            }
        });

    } else if (path === '/total' && method === 'GET') {
        // Get total cost of the basket
        const total = basket.total();
        res.statusCode = 200;
        res.end(JSON.stringify({ total }));

    } else if (path === '/clear' && method === 'POST') {
        // Clear the basket
        basket.clear();
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Basket has been cleared' }));

    } else {
        // 404 for any unknown route
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
