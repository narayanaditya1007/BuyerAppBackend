const User = require('../models/User')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const DOMAIN= "http://localhost:5000"
const ROUTE= "/commerce/:platformId/:productId"
async function login(req,res){
    try{
        const user=await User.findOne({email: req.body.email});
        console.log(user)
        if(!user){
            res.send("User not found")
            throw new Error("User not found");
        }
        // console.log("111");
        console.log(req.body.password);
        console.log(user.password)
        const isMatch = await bcrypt.compare(req.body.password,user.password);
        // console.log("222");
        if(!isMatch){
            res.send("Incorrect Password");
            throw new Error("Incorrect Password");
        }
        const token = jwt.sign({email: user.email},process.env.SECRET_KEY);
        console.log("yha tak to ho gya");
        res.cookie("jwtToken",token,{
            httpOnly: true
        }).send({user,token});
    }
    catch(err){
        console.log(err);
    }
}

async function signup(req,res){
    try{
        console.log("hello");
        const existUser = await User.findOne({email:req.body.email});
        if(existUser){
            console.log("user exists");
            res.send("Email already exists, Try loggin in")
            throw new Error("Email already exists, Try loggin in")
        }
        const hashPass = await bcrypt.hash(req.body.password,10);
        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password: hashPass,
            phone: req.body.phone,
            address:{
                locality:req.body.address.locality,
                city: req.body.address.city,
                state:req.body.address.state,
                country: req.body.address.country,
                postal_code: req.body.address.postal_code
            },
            wishlist:[],
            cart:[]
        });
        console.log(user)
        await user.save();
        res.status(201).send(user);
    }
    catch(err){
        console.log(err);
    }
}

async function logout(req,res){
    try{
        res.clearCookie('jwtToken').send("Logout Done")
    }
    catch(err){
        console.log(err);
    }
}

async function getMyDetails(req,res){
    try{
        const user = await User.findById(req.body.UserId);
        res.send(user);
    }
    catch(err){
        console.log(err);
    }
}

async function updateDetails(req,res){
    try{
        const user = await User.findById(req.body.UserId);
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        await user.save();
        res.send(user)
    }
    catch(err){
        console.log(err);
    }
}

async function getWishlist(req,res){
    try{
        const user =await User.findById(req.body.UserId)
        const wishlist = user.wishlist;
        let detailWishlist=[];
        // console.log(process.env.TOKEN);
        await Promise.all(wishlist.map(async (pro)=>{
            const domain=DOMAIN;
            const route=ROUTE.replace(':platformId',pro.platform_id).replace(':productId',pro.product_id);
            console.log(domain+route);
            console.log(process.env.TOKEN);
            const response = await fetch(domain+route,{
                method: "GET",
                headers: {
                  "Authorization": "Bearer "+process.env.TOKEN,
                  "Content-type": "application/json; charset=UTF-8"
                }
              })
            const product =await response.json();
            console.log(product);
            detailWishlist = [...detailWishlist,product];
        }))
        res.send(detailWishlist)
    }
    catch(err){
        console.log(err);
    }
}

async function getCart(req,res){
    try{
        const user =await User.findById(req.body.UserId)
        const cart = user.cart;
        let detailCart=[];
        // console.log(process.env.TOKEN);
        await Promise.all(cart.map(async (pro)=>{
            const domain=DOMAIN;
            const route=ROUTE.replace(':platformId',pro.platform_id).replace(':productId',pro.product_id);
            console.log(domain+route);
            console.log(process.env.TOKEN);
            const response = await fetch(domain+route,{
                method: "GET",
                headers: {
                  "Authorization": "Bearer "+process.env.TOKEN,
                  "Content-type": "application/json; charset=UTF-8"
                }
              })
            const product =await response.json();
            console.log(product);
            detailCart = [...detailCart,product];
        }))
        res.send(detailCart)
    }
    catch(err){
        console.log(err);
    }
}


async function addWishlist(req,res){
    try{
        const user =await User.findById(req.body.UserId)
        const wishobj = {
                            platform_id:req.body.platformId,
                            product_id:req.body.productId
                        }
        let found = false;
        user.wishlist.forEach((pro)=>{
            console.log(pro);
            if(pro.platform_id.equals(wishobj.platform_id) && pro.product_id.equals(wishobj.product_id)){
                found = true;
                return;
            }
        })
        if(!found){
            user.wishlist = [...user.wishlist,{platform_id:req.body.platformId,product_id:req.body.productId}];
            await user.save();
            res.send(user.wishlist)
        }
        else{
            res.send("already in wishlist")
        }

        
    }
    catch(err){
        console.log(err);
    }
}


async function addCart(req,res){
    try{
        const user =await User.findById(req.body.UserId)
        const cartobj = {
            platform_id:req.body.platformId,
            product_id:req.body.productId
        }
        let found = false;
        user.cart.forEach((pro)=>{
            console.log(pro);
            if(pro.platform_id.equals(cartobj.platform_id) && pro.product_id.equals(cartobj.product_id)){
                found = true;
                return;
            }
        })
        if(!found){
            user.cart = [...user.cart,{platform_id:req.body.platformId,product_id:req.body.productId}];
            await user.save();
            res.send(user.cart)
        }
        else{
            res.send("already in cart")
        }
    }
    catch(err){
        console.log(err);
    }
}


async function removeWishlist(req,res){
    try{
        const user =await User.findById(req.body.UserId)
        user.wishlist = user.wishlist.filter(({platform_id,product_id})=>{
            if(platform_id.equals(req.body.platformId) && product_id.equals(req.body.productId))return false;
            return true;
        })
        await user.save();
        res.send(user.wishlist)
    }
    catch(err){
        console.log(err);
    }
}


async function removeCart(req,res){
    try{
        const user =await User.findById(req.body.UserId)
        user.cart = user.cart.filter(({platform_id,product_id})=>{
            if(platform_id.equals(req.body.platformId) && product_id.equals(req.body.productId))return false;
            return true;
        })
        await user.save();
        res.send(user.cart)
    }
    catch(err){
        console.log(err);
    }
}


module.exports = {
    login,
    signup,
    logout,
    getMyDetails,
    updateDetails,
    getWishlist,
    getCart,
    addWishlist,
    addCart,
    removeWishlist,
    removeCart
}