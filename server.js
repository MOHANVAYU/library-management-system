const express=require('express');
const app=express();
const session=require('express-session');
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/auth');
const userRouter=require('./routes/user');
const adminRouter=require('./routes/admin');

const oneDay=100*60*60*24;

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"ashkfhu28@&64*&s",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:oneDay
    }
}))

app.get('/',(req,res)=>{
    if(req.session.username==null){
        res.redirect('/auth/');
    }else{
        res.redirect('/user/');
    }
})

app.use('/auth',authRouter);
app.use('/admin',adminRouter);

app.use('/user',(req,res,next)=>{
    if(req.session.username==null){
        res.redirect('/auth/login');
    }else{
        next();
    }
})

app.use('/user',userRouter);

app.listen(3000,(req,res)=>{
    console.log('server started');
});