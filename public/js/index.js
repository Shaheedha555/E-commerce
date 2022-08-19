// Header Scroll 
// let nav = document.querySelector(".header");
// window.onscroll = function() {
//     if(document.documentElement.scrollTop > 50){
//         nav.classList.add("header-white"); 
//     }else{
//         nav.classList.remove("header-white");
//     }
// }

// nav hide  
// let navBar = document.querySelectorAll(".nav-link");
// let navCollapse = document.querySelector(".navbar-collapse.collapse");
// navBar.forEach(function(a){
//     a.addEventListener("click", function(){
//         navCollapse.classList.toggle("show");
//     })
// })
$(document).on('turbolinks:load', function() {
  setTimeout(function() {
    $('.alert').fadeOut();
  }, 3000);
})

    $("#add-edit").validate({
        
        errorClass: "error fail-alert",
        // validClass: "valid success-alert"
          
      rules: {
        title : {
          required: true,
          minlength: 5
        },
        category:{
          required : true
        } ,
        price: {
          required : true
        },
        description : {
          required : true
        },
        image: {
          extension: "jpg|jpeg|png|ico|bmp"
        },
        banner : {
          required : true,
          extension: "jpg|jpeg|png|ico|bmp"

        }
      },
      messages : {
        title: {
          required: "Add a title",
          minlength: "Title should be at least 5 characters"
        },
       
        category : {
          required : "Select a category"
        },
        price : {
          required : "Add its price"
        },
        description : {
          required : "Add description"
        },
        image : {
          extension :  "Please upload file in these format only (jpg, jpeg, png, ico, bmp)."

        },
        banner : {
          required : "Select an image",
          extension :  "Please upload file in these format only (jpg, jpeg, png, ico, bmp)."
        }
      },
      
    });
   


            $("#user-signup-form").validate({
              errorClass: "error fail-alert",

              rules: {
                name : {
                  required: true,
                  minlength: 4
                },
                email: {
                  required: true,
                  email: true
                },
                contact: {
                  required: true,
                  number : true
                },
                password: {
                  required: true,
                  minlength : 6
                },
                cpassword: {
                  required: true,
                  minlength : 6,
                  equalTo: "#password"

                }
              },
              messages : {
                name: {
                  required : "Please enter your name.",
                  minlength: "Name should be at least 4 characters."
                },
                contact : {
                  required: "Please enter your Mobile no.",
                },
                email: {
                  required: "Please enter your email.",
                  email: "The email should be in the format: abc@domain.tld"
                },
                password: {
                  required: "Please enter your Password.",
                  minlength: "Password should be at least 6 characters."
                },
                cpassword : {
                  required : "Re-enter your Password.",
                  equalTo : "Password is not matching!"
                }
              }
            });


            $("#user-login-form").validate({
              errorClass: "error fail-alert",

              rules: {
                email: {
                  required: true,
                  email: true
                },
                password: {
                  required: true,
                }
                },
              messages : {
                
                email: {
                  required: "Please enter your email.",
                },
                password: {
                  required: "Please enter your Password.",
                }
              
              }
            });

            $("#admin-login-form").validate({
              errorClass: "error fail-alert",

              rules: {
                email: {
                  required: true,
                  email: true
                },
                password: {
                  required: true,
                }
                },
              messages : {
                
                email: {
                  required: "Please enter your email.",
                },
                password: {
                  required: "Please enter your Password.",
                }
              
              }
            });

            $('#password').validate({
              errorClass: "error fail-alert",

              rules:{
                password: {
                  required: true,
                  minlength : 6
                },
                npassword: {
                  required: true,
                  minlength : 6,
  
                },
                cpassword: {
                  required: true,
                  minlength : 6,
                  equalTo: "#cpassword"
  
                }

              },
              messages:{
                password: {
                  required: "Please enter your Password.",
                  minlength: "Password should be at least 6 characters."
                },
                npassword:{
                  required: "Please enter your Password.",
                  minlength: "Password should be at least 6 characters."
                },
                cpassword : {
                  required : "Re-enter your Password.",
                  equalTo : "Password is not matching!"
                }
              }
            })

            $('#add-address').validate({
              errorClass: "error fail-alert",
              rules:{
                name:{
                  required:true,
                  minlength:4
                },
                housename:{
                  required:true,
                  minlength:4
                },
                pin:{
                  required:true,
                  minlength:6
                },
                contact:{
                  required:true,
                  minlength: 10,
                  maxlength: 10

                },
                district:{
                  required:true
                }
              },
              messages:{
                name:{
                  required:'Enter a name',
                  minlength: "Name should be at least 4 characters."
                },
                housename:{
                  required:'Enter housename',
                  minlength:"Housename should be at least 4 characters."
                },
                pin:{
                  required:'Enter pincode',
                  minlength:'Enter a valid pin'
                },
                contact:{
                  required:'Enter contact number',
                  minlength: 'Contact should be 10 digits',
                  maxlength: 'Contact should be 10 digits'

                },
                district:{
                  required:"Choose district"
                }
              }
            })
// 

$('a.confirmDeletion').on('click',function(){
    if(!confirm('Confirm deletion'))
    return false
});

let searchForm = document.querySelector('.header .search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    searchForm.classList.remove('active');
    navbar.classList.remove('active');
}

let slides = document.querySelectorAll('.home .slide');
let index = 0;

function next(){
    slides[index].classList.remove('active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('active');
}

function prev(){
    slides[index].classList.remove('active');
    index = (index - 1 + slides.length) % slides.length;
    slides[index].classList.add('active');
}

function readURL(input) {
if(input.files && input.files[0]){
  var reader = new FileReader();
  reader.onload = function(e){
    $('#img-prvw').attr('src',e.target.result).width(100).height(100);
  }
  reader.readAsDataURL(input.files[0])
}
}

$("#image").change(function(){
  readURL(this);
})


function editProfile(){

  $('#edit-profile').toggleClass('hide');

}
function addAddress(){

  $('#add-address').toggleClass('hide');
  
}
function editAddress(index){

  $('#edit-address-'+index).toggleClass('hide');
  
}

if($("[data-fancybox]").length){
  $("[data-fancybox]").fancybox();
}


// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function addToCart(proId,wt){
  $.ajax({
    url : '/cart/add/'+proId,
    method : 'get',
    success : (response)=>{
      if(response.status){
      //  let count =  $("#cart-count").html();
      //  count = parseInt(count)+1 ;
      console.log('succ');
      //   $('#cart-count').html(count);
      location.reload()
      }else{
        console.log('no user');
        location.href= '/login';
      }
    }
  });
}
function removeFromCart(proId,wt){
  $.ajax({
    url : '/cart/delete/'+proId+'/'+wt,
    method : 'get',
    success : (response)=>{
      if(response.status){
      //  let count =  $("#cart-count").html();
      //  count = parseInt(count)-1 ;
      //   $('#cart-count').html(count);
      location.reload()
      }

    }
  });
}
function changeQuantity(proId,wt,price,count){
  let qty = $("#qtyOf"+proId).text();
  
  $.ajax({
    url:'/cart/change-quantity',
    data:{
      proId : proId,
      wt : wt,
      price : price,
      count : count,
      qty : parseInt(qty)
    },
    method : 'post',
    success:(response)=>{
      // if(response.status){
      console.log(response);
      //   if(count > 0){
      //     qty = parseInt(qty) + 1
      //   }else{
      //     qty = parseInt(qty) - 1
  
      //   }
      //   let amt = $("#amtOf"+proId).text();
      //   console.log(amt);
      //   $('#totalOf'+proId).text(qty*parseFloat(amt).toFixed(2));

      //   $('#qtyOf'+proId).text(qty);
      // }

      location.reload()
    }

  })
}

function getPrice(proId,proprice,cartprice,wt){
  let qty = $("#qtyOf"+proId).text();

  $.ajax({
    url:'/cart/change-weight',
    data:{
      proId:proId,
      proprice :proprice,
      cartprice,cartprice,
      wt : wt,
      qty:qty
    },
    method : 'post',
    success:(response)=>{
      if(response.status){

      //   console.log(amt);
     
      //   if(wt==0.5) {
      //     amt = parseFloat( (proprice * wt) + proprice*10/100).toFixed(2);
      //  }
      //   else if(wt==1){amt = proprice}
      //   else{amt = parseFloat((proprice * wt) - proprice*10/100).toFixed(2) }
       
      //   $("#totalOf"+proId).text(amt)
      //  $("#amtOf"+proId).text(amt);
 
      location.reload()
      }

    }

  })
}
function showCategories(){
  document.getElementById('cat-head').style.display='block';
  document.getElementById('cat-head-sm').style.display='none'
}

function addToWishlist(proId){
  $.ajax({
    url : '/wishlist/add/'+proId,
    method : 'get',
    success : (response)=>{
      if(response.status){
      //  let count =  $("#cart-count").html();
      //  count = parseInt(count)+1 ;
      //   $('#cart-count').html(count);
      location.reload()
      }
    }
  });
}
function addToCartAndRemove(proId){
  $.ajax({
    url : '/cart/add/'+proId,
    method : 'get',
    success : (response)=>{
      if(response.status){
        removeFromWishlist(proId);
      location.reload()
      }
    }
  });
}
function removeFromWishlist(proId){
  $.ajax({
    url : '/wishlist/delete/'+proId,
    method : 'get',
    success : (response)=>{
      if(response.status){
      //  let count =  $("#cart-count").html();
      //  count = parseInt(count)-1 ;
      //   $('#cart-count').html(count);
      location.reload()
      }

    }
  });
}

function selectAddress(addressIndex){
  $.ajax({
    url: '/cart/place-order/select-address',
    method : 'post',
    data : {
      addressIndex: addressIndex 
    },
    success : (response)=>{
      if(response.status){
        
        location.reload()
        console.log(response);
      }
    }
  })
}

$('#payment-form').validate({

  errorClass: "error fail-alert",
  rules : {
    payment : {
      required : true 
    }
  },
  messges : {
    payment : {
      required : 'Select payment method'
    }
  },
  errorPlacement: function(error, element) 
  {
      if ( element.is(":radio") ) 
      {
          error.insertBefore( $(element).parents('.pay-form'))
      }
      else 
      { // This is the default behavior 
          error.insertAfter( element );
      }
   }
})

$("#payment-form").submit((e)=>{
  e.preventDefault()
  $.ajax({
    url : '/cart/payment',
    method : 'post',
    data : $('#payment-form').serialize(),
    success : (response)=>{
      // alert(response)
      if(response.codStatus == 'placed'){
        console.log(response)
        console.log(response.status)

        location.href = '/cart/place-order/success'
      }else{
        console.log(response +'response');
        razorpayPayment(response);
      }
    }
  })
})

function razorpayPayment(order){
  var options = {
    "key": "rzp_test_M7kqvBj4orNzLd", // Enter the Key ID generated from the Dashboard
    "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "cakes.N.bakes",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      console.log('verify fn');
        verifyPayment(response,order);
    },
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
rzp1.open();

}

function verifyPayment(payment,order){
  $.ajax({
    url : '/cart/verify-payment',
    data : {
      payment,
      order
    },
    method : 'post',
    success : (response)=>{
      if(response.status){
        
        location.href = '/cart/place-order/success'

      }
    }
  })
}

function cancelOrder(id){
  $.ajax({
    url : '/orders/order-cancel/'+id,
    method : 'get',
    success : (response)=>{
      if(response.status){
        location.reload()
      }
    }
  })
}

function changeStatus(id){
  let status = document.getElementById("update-order-status").value;
  console.log('changed ', status , id);
  $.ajax({
    url : '/admin/orders/change-status/'+id,
    method : 'post',
    data : {
      status

    },
    success : (response)=>{
      console.log('response got');
      if(response.status){
      console.log('response true');
        location.reload();
      }
    }
  })
}



// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("modal-close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function applyCoupon(){
  let coupon = $('#coupon').val();
  alert(coupon);
  $.ajax({
    url : '/cart/discount-coupon/',
    method : 'post',
    data : {
      coupon

    },
    success : (response)=>{
      console.log('response got');
      if(response.status){
      console.log('response true');
        location.reload();
      }else{
        location.reload();

      }
    }
  })
}