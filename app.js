var express= require("express"),
    methodOverride=require("method-override"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose");
    
mongoose.connect('mongodb://localhost:27017/restFul_app', {useNewUrlParser : true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


var blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog= mongoose.model("Blog",blogSchema);


app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log(err);
       }else{
         res.render("index", {blogs:blogs});  
       }
   });
});

app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

app.post("/blogs", function(req,res){
 
   Blog.create(req.body.blog, function(err,newlyPost){
       if(err){
           console.log("new");
       }else{
           res.redirect("/blogs");
       }
   });
});

app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show",{blog:foundBlog});
       }
   });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.render("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    }) ;
});

app.put("/blogs/:id", function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,updateBlog){
       if(err){
           res.redirect("/blogs/:id/edit");
       }else {
           res.redirect("/blogs/"+ req.params.id);
       }
   });
});

app.delete("/blogs/:id", function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      }else {
          res.redirect("/blogs");
      }
  });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});
    