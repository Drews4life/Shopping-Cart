var express = require("express");

var router = express.Router();

router.get("/", (req, res) => {
    res.send("<h1>Admin area</h1>");
})

router.get("/add-page", (req, res) => {
    var title;
    var slug;
    var content;

    res.render("admin/addPage", {
        title,
        slug,
        content
    });
});

router.post("/add-page", (req, res) => {

    req.checkBody("title", "Title can't be empty").notEmpty();
    req.checkBody("content", "Content can't be empty").notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    if(slug == "") {
        slug = title.replace(/\s+/g, "-").toLowerCase();
    }
    var content = req.body.content;
    var error = req.validationErrors();
    if(error){
        // return res.status(400).send({
        //     errorMessage: "Bad input"
        // });

        res.render("admin/addPage", {
            error,
            title,
            slug,
            content
        });
    } else {
        console.log(`succesfully created a page: ${title} + ${slug} + ${content}`);
    }

    
});


module.exports = router;