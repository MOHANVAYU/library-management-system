/*
    /admin/root --get/done 

    /admin/root/login --get/done
    /admin/root/login --post/done

    /admin/root/logout --get/done

    /admin/root/add/user --get
    /admin/root/add/user --post

    /admin/root/add/book --get
    /admin/root/add/book --post

    /admin/root/userlist --get
 */
const express=require('express');
const router=express.Router();

const client=require('mongodb').MongoClient;
const objid=require('mongodb').ObjectId;

const url="mongodb+srv://mohan1166:mohan@mongomohan.0nmgc5i.mongodb.net/?retryWrites=true&w=majority";

let dbInstance;

client.connect(url).then((database)=>{
    dbInstance=database.db('MohanLibrary');
    console.log('conected admin');
})

router.get('/',(req,res)=>{
    res.redirect('/admin/root');
})

router.get('/root',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/admin/root/login');
    }else{
        res.render('admin',{admin:req.session.username});
    }
})

router.get('/root/login',(req,res)=>{
    res.render('admin-login');
})

router.post('/root/login',(req,res)=>{
    dbInstance.collection('admin').find({admin:req.body.username}).toArray().then(data=>{
        if(req.body.username==data[0].admin && req.body.password==data[0].password){
            req.session.username=data[0].admin;
            res.redirect('/admin/root');
        }else{
            res.redirect('/admin/root/login');
        }
    })
})

router.get('/root/logout',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/admin/root/login');
    }
    else if(req.session.username!='alan'){
        res.redirect('/');
    }else{
        req.session.destroy();
        res.redirect('/');
    }
})

module.exports=router;