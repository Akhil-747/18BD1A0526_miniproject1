var  exp = require("express");
var app = exp();

app.get('/',function(req,res){

    res.send("Hello AKHIL");
});
app.listen(3000);