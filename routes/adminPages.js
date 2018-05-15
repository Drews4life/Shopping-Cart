var express = require("express");
var mongoose = require("mongoose");
var {Page} = require("./../models/pages");
var router = express.Router();

router.get("/", async(req, res) => {
    var pages = await Page.find({}).sort({sorting: 1});
    res.render("admin/pages",{
        pages
    })
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
    var errors = req.validationErrors();
    if(errors){
        // return res.status(400).send({
        //     errorMessage: "Bad input"
        // });

        res.render("admin/addPage", {
            errors,
            title,
            slug,
            content
        });
        
    } else {
  
        Page.findOne({slug}).then((page) => {
            if(page){
              
                req.flash("danger", "Page slug already exist, try another one");
                return res.render("admin/addPage", {
                    title,
                    slug,
                    content
                });
            } else {

                let newPage = new Page({
                    title,
                    slug,
                    content,
                    sorting: 100
                });
                
                
                newPage.save().then((result) => {
                    if(result) {
                        console.log("Saved huh");
                        req.flash("success", "Page added.");
                        res.redirect("/admin/pages"); 
                    } else {
                        return res.status(500).send({
                            errorMessage: "Internal error"
                        });
                    }
                }).catch((e) => console.log(e.message));
                     

            }
        }).catch((e) => res.status(500).send({
            errorMessage: "Server error"
        }));
       
    }

});

router.post("/reorder-pages", (req, res) => {
    var ids = req.body["id[]"];
    var count = 0;

    for (let i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;
        (function(count){

            Page.findById(id).then((page) => {
                page.sorting = count;
                page.save();
            }).catch((e) => console.log(e.message));
            
        })(count);
    }
       
});



module.exports = router;