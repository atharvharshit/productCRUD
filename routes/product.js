var express=require('express');
var router=express.Router();
var pool=require('./pool');
var upload=require("./multer");
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/fetch_all_categories',function(req,res,next){
    pool.query("select * from category",function(error,result){
       if(error)
       {res.status(500).json([])}
       else
       {res.status(200).json({category:result})}

    })
})
router.get('/fetch_all_subcategories',function(req,res,next){
    pool.query("select * from subcategory where categoryid=?",[req.query.categoryid],function(error,result){
        if(error)
        {res.status(500).json([])}
        else
        {res.status(200).json({subcategory:result})}
    })
})
router.get('/fetch_all_brands',function(req,res,next){
    pool.query("select * from brands where categoryid=?",[req.query.categoryid],function(error,result){
        if(error)
        {res.status(500).json([])}
        else
        {res.status(200).json({brand:result})}
        
    })
})


router.get('/product',function(req,res,next){
    try{
       var admin=localStorage.getItem('ADMIN')  //yha pr agr key exist kr rai h aur uski value null hai(jab logout hoga tab null hi hogi) to iska mtlab ki koi key nai h scarth folder m mtlab vo login nai h to login page pr bhej dega use
       if(admin==null){
        res.redirect('/admin/loginform')
       }
       res.render('productinterface',{message:''});
    }
    catch(e){
       res.redirect('/admin/loginform')
    }
    
});
router.post('/submitproduct',upload.any(), function(req,res,next){
    console.log('Filedata',req.body)
    console.log('pictureInfo',req.files)
   // var colors=JSON.stringify(req.body.color)
    //console.log('COLOR:',colors)
    pool.query("insert into products(categoryid, subcategoryid, brandid, productname, price, offerprice, ratings, description, stock, status, picture) values(?,?,?,?,?,?,?,?,?,?,?)",[req.body.categoryid,req.body.subcategoryid,req.body.brandid,req.body.productname,req.body.price,req.body.offerprice,req.body.ratings,req.body.description,req.body.stock,req.body.status,req.files[0].filename],function(error,result){
        if(error)
        {
            console.log('Error:',error)
            res.render('productinterface',{message:'Server error....'})
        }
        else{
            console.log('Result:',result)
            res.render('productinterface',{message:'Record Submitted Successfully....'})
        }

    })
})
router.get('/display_all_products',function(req,res,next){
 pool.query("select P.*,(select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=P.subcategoryid) as subcategoryname,(select B.brandname from brands B where B.brandid=P.brandid) as brandname from products P",function(error,result){
    if(error)
    {
        res.render("displayallproducts",{status:false,data:"server error"})
    }
    else{
        if(result.length==0)
        {
            res.render("displayallproducts",{status:false,data:"No records found"})
        }

        res.render("displayallproducts",{status:true,data:result})
    }
 })

})
router.get('/editproductdata',function(req,res,next){

    pool.query("update products set categoryid=?,subcategoryid=?,brandid=?,productname=?,price=?,offerprice=?,ratings=?,description=?,stock=?,status=? where productid=?",[req.query.categoryid,req.query.subcategoryid,req.query.brandid,req.query.productname,req.query.price,req.query.offerprice,req.query.ratings,req.query.description,req.query.stock,req.query.status,req.query.productid],function(error,result){
          if(error)
          {
            console.log("Error:",error)
            res.status(500).json({status:false,message:'Server Error....'})
          }
          else{
           
            res.status(200).json({status:true,message:'Records Editted Successfully...'})
          }
    })
})
router.get('/deleteproductdata',function(req,res,next){
    pool.query("delete from products where productid=?",[req.query.productid],function(error,result){
          if(error)
          {  console.log("Error:",error)
             res.status(500).json({status:false,message:"Server Error..."})
          }
          else{
            res.status(200).json({status:true,message:"Record Deleted Successfully..."})
          }
    })
})

router.post('/updateproductpicture',upload.any(),function(req,res,next){
    console.log('Filedata',req.body) // picture ayi ki nai pata lagega is se
    
    pool.query('update products set picture=? where productid=?',[req.files[0].filename,req.body.productid],function(error,result){
        if(error){
            console.log("Error:",error)
            res.status(500).json({status:false,message:"server error...."})
        }
        else{
            res.status(200).json({status:true,message:"Picture Updated successfully..."})
        }
    })
})




module.exports=router;