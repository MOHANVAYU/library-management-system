const express=require('express');
const app=express();
const session=require('express-session');
const cookieParser=require('cookie-parser');

const oneDay=100*60*60*24;
const url="mongodb+srv://mohan1166:mohan@mongomohan.0nmgc5i.mongodb.net/?retryWrites=true&w=majority";

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"ashkfhu28@&64*&s",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:oneDay
    }
}))

const client=require('mongodb').MongoClient;
const objid=require('mongodb').ObjectId;

let dbInstance;

client.connect(url).then((database)=>{
    dbInstance=database.db('MohanLibrary');
    console.log('conected');
})

app.get('/',(req,res)=>{
    dbInstance.collection('library').find({}).toArray().then((result)=>{
        res.render('home',{data:result,user:req.session.username});
    })
})

app.get('/profile',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/login');
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

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',(req,res)=>{
    dbInstance.collection('users').find().toArray().then((result)=>{
        if(req.session.username!=null){
            res.redirect('/error');
        }
        let flag=false;
        result.forEach(element => {
            if(element.username==req.body.username){
                req.session.username=req.body.username;
                flag=true;
                res.redirect('/');
            }
        });
        if(flag==false){
            res.redirect('/error');
        }
    })
})

app.get('/logout',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/');
    }
    req.session.destroy();
    res.redirect('/');
})

app.get('/borrow/:id',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/login');
    }else{
        dbInstance.collection('library').find({"_id":new objid(req.params.id)}).toArray().then((doc)=>{
            if(doc[0].status==false){
                res.redirect('/error');
            }else{
                let book=doc[0].title;
                dbInstance.collection('library').updateOne({"title":doc[0].title},{$set:{"status":false,"borrowed":req.session.username}});
                dbInstance.collection('users').find({"username":req.session.username}).toArray().then((data)=>{
                    let arr=data[0].borrowed.split('/');
                    arr.push(book);
                    let result=arr.join('/');
                    dbInstance.collection('users').updateOne({"username":req.session.username},{$set:{"borrowed":result}});
                })
                res.redirect('/success');
            }
        })
    }
})

app.get('/return/:id',(req,res)=>{
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
    res.redirect('/profile');
})

app.get('/admin-home',(req,res)=>{
    res.render('admin-home',{admin:req.session.username});
})

app.get('/error',(req,res)=>{
    res.render('error');
})

app.get('/success',(req,res,next)=>{
    res.render('sucess');
})

app.listen(3000,(req,res)=>{
    console.log('server started');
});