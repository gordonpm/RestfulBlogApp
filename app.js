//reference sites:
// lipsum.com
// unsplash.com
// 

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),  // for retrieving data from request body(req.body)
    mongoose = require("mongoose"), 
    expressSanitizer = require("express-sanitizer"), // for cleaning up blog content with malicious code/scripts
    methodOverride = require("method-override"); // used for PUT/DELETE requests since HTML forms only support GET/POST
    
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now} //auto generate date in mongodb
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b3e15241ba7313b5f3fd348dd1f18704&auto=format&fit=crop&w=800&q=60",
//     body: "Cyclist in the mountains"
// }, function(err, blogCreated){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("blog created in db");
//         console.log(blogCreated);
//     }
// });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if (err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: allBlogs});
        }
    })
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            console.log("new blog created");
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog: foundBlog});        
        }
    })
    
});

// UPDATE route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Server started");
// });

app.listen(3000, () => {
    console.log("Server started");
})