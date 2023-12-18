// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://pravin:pass123@cluster0.xlle609.mongodb.net/blogDB', { 
    useNewUrlParser: true  });

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
}, { timestamps: true }); // Added timestamps for createdAt and updatedAt

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const Contact = mongoose.model('Contact', contactSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set('view engine', 'ejs');

const carouselImages = [
    "/images/blogging1.png",
    "/images/index.jpg",
    "https://via.placeholder.com/800x400"
];

app.get("/", async function (req, res) {
    try {
        const blogPosts = await BlogPost.find({}).sort({ createdAt: -1 }).limit(3);
        res.render("home", { blogposts: blogPosts, carouselImages: carouselImages });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/posts", async function (req, res) {
    try {
        var searchitem = req.query.q;
        const blogPost = await BlogPost.findOne({ title: searchitem });

        if (blogPost) {
            res.render("user", { tatal: blogPost.title, content: blogPost.content });
        } else {
            console.log("match does not found");
            res.status(404).send("Blog post not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/about", function (req, res) {
    res.render("about.ejs", { aboutp: aboutContent });
});

app.get("/contact", function (req, res) {
    res.render("contact", { contactinfo: contactContent });
});

app.post("/contact", async function (req, res) {
    const newContact = new Contact({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
    });

    try {
        await newContact.save();
        console.log("Contact form submission saved to database");
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.redirect("/contact");
    }
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", async function (req, res) {
    const newBlogPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
    });

    try {
        await newBlogPost.save();
        console.log("Blog post saved to database");
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.redirect("/compose");
    }
});

app.get("/posts/:userid", async function (req, res) {
    try {
        var searchitem = req.body.q;
        const blogPost = await BlogPost.findOne({ $or: [{ title: req.params.userid }, { title: searchitem }] });

        if (blogPost) {
            res.render("user", { tatal: blogPost.title, content: blogPost.content });
        } else {
            console.log("match does not found");
            res.status(404).send("Blog post not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/terms",async function (req,res){
    try
    {
        res.render("terms");
    }
    catch(err)
    {
        console.log("error occurs in terms page"+err);
    }
});
app.get("/help",async function (req,res){
    try
    {
        res.render("help");
    }
    catch(err)
    {
        console.log("error occurs in help page"+err);
    }
});


app.listen(3000, function () {
    console.log("Server started on port 3000");
});
