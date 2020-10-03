var exp = require("express");
var app = exp();
app.get('/color',(req,res) => {
    console.log(req.query.color1);
    res.send("Color is: "+req.query.color1);
    console.log("color is printing");
});

app.listen(3000);