const express=require('express');
const router=express.Router();

const client=require('mongodb').MongoClient;
const objid=require('mongodb').ObjectId;

const url='mongodb://localhost:27017';

let dbInstance;

client.connect(url).then((database)=>{
    dbInstance=database.db('College');
    console.log('conected user');
})

router.get('/',(req,res)=>{
    dbInstance.collection('library').find({}).toArray().then((result)=>{
        res.render('home',{data:result,user:req.session.username});
    })
})

router.get('/profile',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/auth/login');
    }else{
        const name=req.session.username;
        dbInstance.collection('users').find({ username: name }).toArray().then((result)=>{
            if(result.length===0){
                dbInstance.collection('users').find({ username: name }).toArray().then((result)=>{
                    const book_arr=result[0].borrowed.split('/');
                    dbInstance.collection('library').find({title:{$in :book_arr}}).toArray().then((result)=>{
                        res.render('profile',{data:result,user:req.session.username});
                    })
                })
            }
            const book_arr=result[0].borrowed.split('/');
            dbInstance.collection('library').find({title:{$in :book_arr}}).toArray().then((result)=>{
                res.render('profile',{data:result,user:req.session.username});
            })
        });
    }
})

router.get('/borrow/:id',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/auth/login');
    }else{
        dbInstance.collection('library').find({"_id":new objid(req.params.id)}).toArray().then((doc)=>{
            if(doc[0].status==false){
                res.redirect('/auth/error');
            }else{
                let book=doc[0].title;
                dbInstance.collection('library').updateOne({"title":doc[0].title},{$set:{"status":false,"borrowed":req.session.username}});
                dbInstance.collection('users').find({"username":req.session.username}).toArray().then((data)=>{
                    let arr=data[0].borrowed.split('/');
                    arr.push(book);
                    let result=arr.join('/');
                    dbInstance.collection('users').updateOne({"username":req.session.username},{$set:{"borrowed":result}});
                })
                res.redirect('/auth/success');
            }
        })
    }
})

router.get('/return/:id',(req,res)=>{
    dbInstance.collection('library').find({"_id":new objid(req.params.id)}).toArray().then((document)=>{
        dbInstance.collection('library').updateOne({"_id":new objid(req.params.id)},{$set:{"status":true,"borrowed":''}});
        let title=document[0].title;
        dbInstance.collection('users').find({"username":req.session.username}).toArray().then((doc)=>{
            let book=doc[0].borrowed;
            let arr = book.split('/');
            let indexToRemove = arr.indexOf(title);
            if (indexToRemove > -1) {
                arr.splice(indexToRemove, 1); 
            }
            let result = arr.join('/');
            dbInstance.collection('users').updateOne({"username":req.session.username},{$set:{"borrowed":result}});
        })
    })
    res.redirect('/user/profile');
})

router.get('/logout',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/');
    }
    req.session.destroy();
    res.redirect('/');
})

module.exports=router;