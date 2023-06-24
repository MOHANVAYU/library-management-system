/*
    /admin/root --get/done 

    /admin/root/login --get/done
    /admin/root/login --post/done

    /admin/root/logout --get/done

    /admin/root/add/user --get/done
    /admin/root/add/user --post/done

    /admin/root/add/book --get
    /admin/root/add/book --post

    /admin/root/userlist --get/done
 */
const express=require('express');
const router=express.Router();

const client=require('mongodb').MongoClient;
const objid=require('mongodb').ObjectId;

const url='mongodb://localhost:27017';

let dbInstance;

client.connect(url).then((database)=>{
    dbInstance=database.db('College');
    console.log('conected admin');
})

router.get('/',(req,res)=>{
    res.redirect('/admin/root');
})

router.get('/root',(req,res)=>{
    if(req.session.username==null || req.session.username!='alan'){
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
        let adminUser=req.body.username.trim();
        let adminPwd=req.body.password.trim();
        if(adminUser==data[0].admin && adminPwd==data[0].password){
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

router.get('/root/add/user',(req,res)=>{
    if(req.session.username!='alan'){
        res.redirect('/admin/root/login');
    }else{
        res.render('add-user',{admin:req.session.username,data:false});
    }
});

router.post('/root/add/user',(req,res)=>{
    let user={
        "username":req.body.user.toLowerCase(),
        "borrowed":""
        };
    dbInstance.collection('users').insertOne(user);
    res.render('add-user',{admin:req.session.username,data:true});
});

router.get('/root/userlist',(req,res)=>{
    if(req.session.username!='alan'){
        res.redirect('/admin/root/login');
    }else{
        dbInstance.collection('users').find({}).toArray().then(users=>{
        res.render('userlist',{admin:req.session.username,data:users});
        })
    }
});

module.exports=router;