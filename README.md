# cakesNbakes 
A feature-rich E-commerce website for cakes & bakes, made
with NodeJS in the backend, EJS in the frontend, and MongoDB as the
database.
### Features includes:
In user side,
- Registration & verification
- Product list
- Wishlist
- Cart
- Order placement
- Order history <br>

In admin side,

- Dashboard
- Category management
- Product management
- User management 
- Banner management
- Coupon management

### Tools and technologies used : 

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

| Technology          | Description                                        |
|---------------------|----------------------------------------------------|
| Node JS, Express JS | For backend                                        |
| EJS                 | As view engine                                     |
| Mongoose            | Database library                                   |
| CSS and Bootstrap   | For styling                                        |
| Nodemailer          | For sending emails                                 |
| Axios               | For API calls                                      |
| Bcrypt              | For password hashing                               |
| Multer              | For multiple file upload                           |
| JQuery-validation   | Form validation                                    |
| Razorpay            | For payment integration                            |
| Otp-generator       | To generate random OTP                             |
| Chart JS            | To make diagramatic <br>reports on admin dashboard |

# Pages of my website:

## User side :
 
- ### **Homepage** <br>

   Home page is visible for every user entering into website. It contains banners linking into categories, special products, and all categories of      products. If the user is logged in, the name will show on the navbar.
   
   <img src="https://user-images.githubusercontent.com/66831984/208332718-9c6de240-183b-4a55-9a4c-86de3e0937ef.png" width="500"> <br>
 
   **Navbar difference for logged in user and other users**
 
   <img src="https://user-images.githubusercontent.com/66831984/208346053-3ba03d25-a4a9-44aa-831d-4ebd94b7eb2e.png" height="100"> <img src="https://user-images.githubusercontent.com/66831984/208346075-253f5f01-411a-4164-939d-683173319168.png" height="100">

 
 - ### **Register** <br>
 
   User can register by filling the validated form, and then have to verify registered email by opening the link received in the email.<br>
 
   <img src="https://user-images.githubusercontent.com/66831984/208336508-da6f71e9-1225-4264-9c29-cbdc3da91e01.png" width="500"> <br>

- ### **Login** <br>
  
   User have to enter verified email and password to enter into shop. In case of forgot password, there is an option to set new password by matching OTP received to verified email. <br>
 
   <img src="https://user-images.githubusercontent.com/66831984/208336404-6bd7254a-479b-456c-8393-ab454525e9b4.png" width="500"> <br>
 
   **Forgot password** 
 
   <img width="200" alt="Capture" src="https://user-images.githubusercontent.com/66831984/208337924-d20acd4a-d12e-4e86-9593-d15459905e2c.PNG">

 - ### **Products** <br>
  
   It is the page that listing all products for user. User can click the button for view product, add to wishlist, or add to cart. <br>
 
   <img src="https://user-images.githubusercontent.com/66831984/208337186-e65d35ba-c77c-40ca-a01a-3110972fe4e0.png" width="500"> <br>

   **Hover view on single product**

    <img width="200" alt="prodct" src="https://user-images.githubusercontent.com/66831984/208338048-e2ecca87-a27d-442f-9f82-1efe5d48b06a.PNG">

  - ### **Product details** <br>
  
    The page shows the detailed description of product with price and buttons for add to wishlist and add to cart.
  
    <img src="https://user-images.githubusercontent.com/66831984/208337901-ee108ee0-5307-49ab-acc2-e6a49d95e72d.png" width="500"> <br>
 
  - ### **Wishlist** <br>
  
    User can add and remove products here to save for later and can directly move to cart for placement.

    <img src="https://user-images.githubusercontent.com/66831984/208338260-66b0a17a-ef38-4e8f-9c6a-8a52a26e455a.png" width="500"> <br>
     
  - ### **Cart** <br>
    <img src="https://user-images.githubusercontent.com/66831984/208338433-cdd7f538-8a16-4aff-8278-4fea8998d607.png" width="500"> <br>
   
    User can add or remove products to cart for order placement and can change quantity of products. Discount coupons are also available 
   and can view by clicking the button 'Available coupons'.
 
  - ### **Place order** <br>
    <img src="https://user-images.githubusercontent.com/66831984/208338552-88ed9ce3-ba31-4769-9626-ca9d7773913c.png" width="500"> <br>
   
    User can select or add address for delivery and choose payment method and then place the order. After successful order placement, the window will show the below screen.
    
    **Order success page**
   
     <img width="200" alt="ordr succs" src="https://user-images.githubusercontent.com/66831984/208345170-a11e5ff3-667a-4d52-bc76-9d625939fc76.PNG"> <br>
   
  - ## **Order history** <br>
    <img src="https://user-images.githubusercontent.com/66831984/208345329-649d68d7-c110-4ca2-93a5-405d2b5e3fee.png" width="500"> <br>
   
    User can see previous orders list and on clicking a particular order, the details of that order has shown like the image below. The cancellation of orders is available only for 2 hours from the time of order placement.
   
    <img src="https://user-images.githubusercontent.com/66831984/208345426-18d92c23-d1f1-4d8b-b1b9-5555017ec114.png" width="500"> <br>
   
   - ### **Contact** <br>
   
     This is an active contact form to connect with company. User can send message through this form. There is also a location of the company.

     <img src="https://user-images.githubusercontent.com/66831984/208366491-42d60a48-751b-4cec-b4a1-8cff850a3493.png" width="500"> <br>
    
 ## Admin side :
 
  - ### **Login** <br>
  
     Admin can login by typing predefined email and password and enter to dashboard.

     <img src="https://user-images.githubusercontent.com/66831984/208361451-e0ed6f2d-26e9-4ba4-a46f-de5696781d10.png" width="500"> <br>
      
  - ###  **Dashboard** <br>
  
     Dashboard includes counts of reports and diagramatic representaion of reports

     <img src="https://user-images.githubusercontent.com/66831984/208361850-be67f7ac-e3a5-4d08-9718-74aa1423aeb3.png" width="500"> <br>
     
  - ### **User management** <br>
  
     Admin can view user lists and block or unblock users

     <img src="https://user-images.githubusercontent.com/66831984/208362380-26918473-682e-4bb0-abe6-356e19920ab8.png" width="500"> <br>

  - ### **Category management** <br>
  
     Admin can view all categories, add new category, edit current categories, and remove unwanted categories only if product on that category is empty.

     <img src="https://user-images.githubusercontent.com/66831984/208362821-a9f14c2f-f066-44df-84b1-17ec4fade4e6.png" width="500"> <br>

  - ### **Product management** <br>
    
     Admin can view all products, add new items into categories, remove products and edit product details. There is an option in edit form to add multiple images of products and also there is a checkbox to make product vegan or special to display in those categories. <br>
   
     <img src="https://user-images.githubusercontent.com/66831984/208363466-ae62e9fb-c043-44b0-8a4d-798fd5e266f4.png" width="500"> <br>

    **Edit form for product**
 
     <img src="https://user-images.githubusercontent.com/66831984/208364205-f9b7a7e2-b6d2-449f-96ab-8ea1e475a608.png" width="500"> <br>

 - ### **Order management** <br>
 
     Admin can view all orders and update order status from this page.

     <img src="https://user-images.githubusercontent.com/66831984/208364938-64749c05-7d8a-41f6-a499-8ee2a2ae791a.png" width="500"> <br>

  - ### **Coupon management** <br>
  
     Admin can create discount coupons, remove old coupons or edit coupons from this page

     <img src="https://user-images.githubusercontent.com/66831984/208365092-6938c8b4-8f9d-4052-88fe-7dedae978647.png" width="500"> <br>

- ### **Banner management** <br>

     Admin can add banners to display in homepage with title, description and link to category.

     <img src="https://user-images.githubusercontent.com/66831984/208365283-a7d8b8e9-d9b7-4889-b815-b59a289bc103.png" width="500"> <br>












