var express = require("express");
var mongoose = require("mongoose");
var {Category} = require("./../models/category");
var router = express.Router();

router.get("/", async(req, res) => {
    res.send("Categs index");
    // var pages = await Page.find({}).sort({sorting: 1});
    // res.render("admin/pages",{
    //     pages
    // })
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
  
        Page.findOne({slug})
        .then((page) => {
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
                
                
                newPage.save()
                .then((result) => {
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

            Page.findById(id)
            .then((page) => {
                page.sorting = count;
                page.save();
            })
            .catch((e) => {
                console.log(e.message);
                return res.send(404).send();
            });
        })(count);
    }
       
});

router.get("/edit-page/:slug", (req, res) => {
   Page.findOne({slug: req.params.slug})
   .then((page) => {
        if(!page){
            return res.status(404).send({
                errorMessage: "Page not found"
            })
        }

        res.render("admin/editPage", {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        })
   })
   .catch((e) => {
    console.log(e.message);
    return res.send(404).send();
});

});

router.post("/edit-page/:slug", (req, res) => {
    
    req.checkBody("title", "Title can't be empty").notEmpty();
    req.checkBody("content", "Content can't be empty").notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    if(slug == "") {
        slug = title.replace(/\s+/g, "-").toLowerCase();
    }
    var content = req.body.content;
    var id = req.body.id;
    var errors = req.validationErrors();
    if(errors){
        res.render("admin/editPage", {
            errors,
            title,
            slug,
            content,
            id
        });
        
    } else {
  
        Page.findOne({slug: slug, _id:{"$ne":id}})
        .then((page) => {
            if(page){
              
                req.flash("danger", "Page slug already exist, try another one");
                return res.render("admin/editPage", {
                    errors,
                    title,
                    slug,
                    content,
                    id
                });
            } else {

                Page.findById(id)
                .then((page) => {
                    if(!page){
                        console.log("Page not found");
                        return res.status(404).send();
                    }
                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    
                    page.save()
                    .then((result) => {
                        req.flash("success", "Page updated.");
                        res.redirect("/admin/pages"); 
                        console.log("saved.");
                    })
                    .catch(e => console.log("unable to save"));
                })
                .catch((e) => {
                    console.log(e.message);
                    return res.send(404).send();
                });
            }
        }).catch((e) => res.status(500).send({
            errorMessage: "Server error"
        }));
    
    }
});

router.get("/delete-page/:id", async(req, res) => {
    await Page.findByIdAndRemove(req.params.id)
    
    req.flash("success", "Page deleted.");
    res.redirect("/admin/pages"); 
    console.log("saved.");
})

       



module.exports = router;