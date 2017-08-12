
var express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");

//app config
mongoose.connect("mongodb://localhost/restful_blog");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//index
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        } else{
            res.render("index", {blogs: blogs});
        }
    });
});

//new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//create route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//show rotue
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});


//edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//delete route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server is running");
});