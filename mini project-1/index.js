var express= require('express');
var app=express();

let server=require('./server.js');
let middleware=require('./middleware.js');

const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const MongoClient=require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbName='HospitalManagment'
let db
MongoClient.connect(url,{useUnifiedTopology: true},(err,client)=>{
    if (err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database: ${dbName}`)
});

//Read Hospital Details    //OK
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Reading data from Hospital Collection")
    var data=db.collection('HospitalDetails').find().toArray().then(result=> res.json(result));
});

//Read ventilator Details   //OK
app.get('/ventilatordetails',middleware.checkToken,function(req,res){
    console.log("Reading data from Ventilator Collection");
    var data=db.collection('VentilatorDetails').find().toArray().then(result=> res.json(result));
});

//Search Ventilator By Status   //OK
app.post('/searchventbystatus',middleware.checkToken,function(req,res){
    var status=req.body.status;
    console.log(status);
    console.log("Searching Ventilators By Status");
    var data=db.collection('VentilatorDetails').find({"status": status}).toArray().then(result=> res.json(result));

});

//Search Ventilator By HospitalName  //OK
app.post('/searchventbyhospname',middleware.checkToken,function(req,res){
    var name=req.query.name;
    console.log(name);
    console.log("Searching Ventilators By HospName");
    var data=db.collection('VentilatorDetails').find({"name":new RegExp(name,'i')}).toArray().then(result=> res.json(result));
});

//Search Hospital By Name   //OK
app.post('/searchhospbyname',middleware.checkToken,function(req,res){
    var Name=req.body.name;
    console.log("Searching Hospital By Name");
    var data=db.collection('HospitalDetails').find({"name":new RegExp(Name,'i')}).toArray().then(result=> res.json(result));
});

//Update Ventilator Details  //OK
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ ventilatorId : req.body.ventilatorId };
    console.log(ventid);
    var newvalue={ $set: { status:req.body.status } };
    console.log(newvalue);
    db.collection("VentilatorDetails").updateOne(ventid, newvalue, function(err, result){
        res.json("1 Ventilator Updated");
        console.log("Updated")
        if(err) throw err;
    });
});

//Add Ventilator //OK
app.post('/addventilator',middleware.checkToken, (req,res)=> {
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hId:hId, ventilatorId:ventilatorId, status:status, name:name
    };
    db.collection('VentilatorDetails').insertOne(item, function(err, result){
        res.json('Item Inserted');
    });
});

//Delete Ventilator By Id //OK
app.delete('/deleteventbyid',middleware.checkToken,(req, res) => {
    var query = req.body.ventilatorId;
    console.log(query);
    var q1 = { ventilatorId:query };
    db.collection('VentilatorDetails').deleteOne(q1, function(err, result){
        if(err) throw err;
        res.json("1 Ventilator Deleted");
     });
});
app.listen(2080);