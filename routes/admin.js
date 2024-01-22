var express=require('express')
var router=express.Router()
var pool=require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');    //jo bhi key bnayenge vo is scartch folder m store rhegi agr ye folder nhi bnaya to temporary folder bnega cookies m jo kia unsafe rhega becos hmne agr cookies ko clear kr dia to data bhi chala jyega
router.get('/loginform',function(req,res,next){   // ye scartch folder server bnayega meri machine pr jaise hi localStorage nam ka object create kia
    
  try{  
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    console.log('keyyyyy',admin)
    if(admin==null)  // agr session nahi bna to productlogin khulega aur agr phle se hi login  hai matlab ki session bna hua hai to dashboard khulna chahiye
    {res.render('productlogin',{message:'',status:false})
    }              //error aya ek nya ki render do baar ho gyi ek action k ander so make sure ki res.render do pages k lie na ho simaultaneously
    else
    {
    res.redirect('/admin/dash_board')
    }
  }
  catch(e){
     res.redirect('/admin/loginform')
  }
})
router.get('/adminlogout',function(req,res,next){
  localStorage.removeItem('ADMIN')
  res.redirect('/admin/loginform')
})

router.get('/dash_board',function(req,res,next){
  var query="select count(*) as countcategory from category;select count(*) as countproducts,sum(stock) as countstock from products;select count(*) as countbrands from brands;"
  //yha pr phli query k baad semicolon dia h becos yha pr hum bunch of queries fire kr rhe hai
  pool.query(query,function(error,result){ //yha pr query m koi ?mark signnai h koi data ana nai hai isleie req.query nai laga
    if(error)
    {//ye error h jab qury m koi mistkae hogi ya server m koi problem hogi and query m mistake hogi to result to milega hi nahi islie khali bheja hua h result ko
      console.log("Error:",error)
      res.render('dashboard',{status:false,message:"Server Error..",result:[]})
    }
    else{
     // console.log("xxxx:",result[0]) //actual me result ek array hai jiske ander bhi ek aur array h i.e result[0] pe ek array hai jis array k ander json from m countcategory likha hua h
     //console.log("xxxx:",result[0].countcategory) just check krne k lie kia tha ye dono console.log
     //yha pr result[0].countcategory se kuch nai milega becos us position pr to ek another array hai aur hme us anothoer arry me se count ko show krvana hai to ham krenge result[0][0].countcategory
     console.log("xxxc:",result[1][0].countstock)
     var admin = JSON.parse(localStorage.getItem('ADMIN'))
     res.render('dashboard',{admin:admin,status:true,message:"Success..",result:result})
    }  //admin key hai json m jo likha h vo kuch aur naam bhi ho sakta hai but jo value hai vo to admin variable m hi hai jisne loacalstorsge ki key(ADMIN) se value fetch ki hai
  })
  
})
router.post('/check_admin_login',function(req,res,next){
  pool.query('select * from admins where (emailid=? or mobileno=?) and password=?',[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
    if(error)       // ---##yha pr sir k error m hmne notice kia k: jab ham email/mobile vale box m credential dalenge tab dono m se koi ek hi chees dalenge to req.body.emailid lia h 2 bar un dono m agr mobile no dala to dono m mobile no set hoga ya agr emailid dali to dono m mailid set hogi
    {               // let  agr mane mobile no dala to aisa ayega dono m se koi ek cheez dono m set hojyegi,where (emailid='7987952870' or mobileno='7987952870')
        console.log("Error",error)
        res.render('productlogin',{message:"Server Error..",status:true})
    }
    else  //jab mne result show kia to usme [{key:value,key:value}] aya aur jab hmne show kia result[0] ko to aya array ki 0th index pr bna hua json only {key:value,key:value} aur jab show kia result[0].adminname to name ftech hoke aa gya...
    {
        if(result.length==1)   // ADMIN nam ki key create krne k baad JSON.stringify() lagaya data bhjena hai islie aur us key m value set ki hai result[0] ki
        {   localStorage.setItem('ADMIN',JSON.stringify(result[0])) //localstorage me key create kr di Admin nam ki ab ise khi bhi access kr sakte hai
            res.redirect('/admin/dash_board')   //redirect me action dena padega naki ejs file vo action hi ejs file ko render krega check ur router
        }
        else
        {
        res.render('productlogin',{message:"Invalid Emailid/Mobileno/Password",status:true})
        }
    }
  })
})

module.exports=router