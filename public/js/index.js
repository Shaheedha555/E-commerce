// Header Scroll 
// let nav = document.querySelector(".navbar");
// window.onscroll = function() {
//     if(document.documentElement.scrollTop > 50){
//         nav.classList.add("header-scrolled"); 
//     }else{
//         nav.classList.remove("header-scrolled");
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
$('.carousel').carousel()


function editProfile(){

  $('#edit-profile').toggleClass('hide');

}
function addAddress(){

  $('#add-address').toggleClass('hide');
  
}
