const express=require('express');
const router=express.Router();
const client=require('mongodb').MongoClient;

const url="mongodb+srv://mohan1166:mohan@mongomohan.0nmgc5i.mongodb.net/?retryWrites=true&w=majority";

let dbInstance;

client.connect(url).then((database)=>{
    dbInstance=database.db('MohanLibrary');
    console.log('conected auth');
})

router.get('/',(req,res)=>{
    dbInstance.collection('library').find({}).toArray().then((result)=>{
        res.render('home',{data:result,user:req.session.username});
    })
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post('/login',(req,res)=>{
    dbInstance.collection('users').find().toArray().then((result)=>{
        if(req.session.username!=null){
            res.redirect('/auth/error');
        }
        let flag=false;
        result.forEach(element => {
            if(element.username==req.body.username){
                req.session.username=req.body.username;
                flag=true;
                res.redirect('/user/');
            }
        });
        if(flag==false){
            res.redirect('/auth/error');
        }
    })
})

router.get('/error',(req,res)=>{
    res.render('error',{user:req.session.username});
})

router.get('/success',(req,res,next)=>{
    res.render('sucess',{user:req.session.username});
})

module.exports=router;