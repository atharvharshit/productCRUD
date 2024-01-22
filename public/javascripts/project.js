var serverURL="http://localhost:3000" 
function fillCategory()
{
  $.getJSON(`${serverURL}/product/fetch_all_categories`,function(data){
    //alert(JSON.stringify(data))
    data.category.map((item)=>{
        $('#categoryid').append($('<option>').text(item.categoryname).val(item.categoryid))
    })
    $('#categoryid').formSelect();
    
    })
}
// function fillsubcategory ///
function fillSubcategory(cid,selected)
{
  $.getJSON(`${serverURL}/product/fetch_all_subcategories`,{'categoryid':$('#categoryid').val()},function(data){
    //alert(JSON.stringify(data))
    $('#subcategoryid').empty()
    $('#subcategoryid').append($('<option>').text('-Choose SubCategories-'))
    data.subcategory.map((item)=>{
        $('#subcategoryid').append($('<option>').text(item.subcategoryname).val(item.subcategoryid))
    })
    if(selected!='')
    $('#subcategoryid').val(selected)
    $('#subcategoryid').formSelect()

})
}
//fill brands function ////
function fillBrand(cid,setbrand)
{
  $.getJSON(`${serverURL}/product/fetch_all_brands`,{'categoryid':$('#categoryid').val()},function(data){
    //alert(JSON.stringify(data)) 
    $('#brandid').empty()
    $('#brandid').append($('<option>').text('-Choose Brands-'))
    data.brand.map((item)=>{
      $('#brandid').append($('<option>').text(item.brandname).val(item.brandid))
    }) 
    if(setbrand!='')
    $('#brandid').val(setbrand)
    $('#brandid').formSelect()

  })
}

$(document).ready(function(){
 
fillCategory()
$('#categoryid').change(function(){
    fillSubcategory($('#categoryid').val(),'')  //blank bhejne se fillcategory wale fn m selected m kuch nai jaega aur if condition false ho jyegi to sirf getJSON k through choosesubcategories and subcategories dropdown m fill ho jyengi according to category   
    fillBrand($('#categoryid').val(),'')          //lekin selected m jab koi subcategory hogi than dropdown fill hone k bad jis btn p click kia tha us category k according subcategory form m print hoke ayegi i.e selected hoke ayegi...
// starting m record submit krte time koi selected subcategory nahi hogi tab y funda apply hoga blank bhejne wala
})
})