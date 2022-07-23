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
let navBar = document.querySelectorAll(".nav-link");
let navCollapse = document.querySelector(".navbar-collapse.collapse");
navBar.forEach(function(a){
    a.addEventListener("click", function(){
        navCollapse.classList.toggle("show");
    })
})

$(document).ready(function () {
    $('#example').DataTable();
});

$('a.confirmDeletion').on('click',function(){
    if(!confirm('Confirm deletion'))
    return false
});