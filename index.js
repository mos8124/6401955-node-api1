const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "157.245.59.56",
  user: "u6401955",
  password: "6401955",
  database: "u6401955_8_3",
  port: 3366,
});

var app = express();
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({
    status: "ok",
    message: "Api Start",
  });
});

app.get("/customers", function (req, res) {
  connection.query("SELECT * FROM a1_customer", function (err, results) {
    console.log(results); //แสดงผลที่ console
    res.json(results); //ตอบกลับ request
  });
});

app.get("/products", function (req, res) {
  connection.query(
    `SELECT * FROM a1_food`,
    function (err, results) {
      res.json(results);
    }
  );
});

app.get("/orders", function (req, res) {
  connection.query(
    `SELECT O.order_id, C.Firstname AS customer, P.ชื่อสินค้า AS Product_Name, O.quantity
    FROM a1_order O
    LEFT JOIN a1_customer C ON O.customer_id = C.ID
    LEFT JOIN a1_food P ON O.product_id = P.ID; `,
    function (err, results) {
      res.json(results);
    }
  );
});

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get("/top_customers", function (req, res) {
  connection.query(
    `SELECT C.FirstName, SUM(O.quantity*P.ราคา) AS price_sum FROM a1_customer AS C INNER JOIN a1_order AS O ON C.ID = O.customer_id INNER JOIN a1_food AS P ON O.product_id = P.ID GROUP BY C.ID ORDER BY price_sum DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get('/top_products', function(req, res){
  connection.query(
    `SELECT O.id, P.ชื่อสินค้า, O.quantity, SUM(O.quantity) as Total_QTY FROM a1_order as O INNER JOIN a1_food as P ON O.product_id = P.ID GROUP BY O.id, P.ชื่อสินค้า, O.quantity, P.ราคา ORDER BY Total_QTY DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});




app.post('/orders', function(req, res) {
  const values = req.body
  console.log(values)
  connection.query(
    'INSERT INTO a1_order (order_id, customer_id, product_id, quantity) VALUES ?', [values],
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})


app.listen(5000, () => {
  console.log("Server is started.");
});