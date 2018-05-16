var express = require("express");
var mongoose = require("mongoose");
var {Category} = require("./../models/category");
var router = express.Router();

router.get("/", async(req, res) => {
    var categories = await Category.find({}).sort({sorting: 1});
    res.render("admin/categories",{
        categories
    })
})

router.get("/add-category", (req, res) => {
    var title = "";
    

    res.render("admin/addCategory", {title});
});

router.post("/add-category", (req, res) => {

    req.checkBody("title", "Title can't be empty").notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, "-").toLowerCase();
   
    var errors = req.validationErrors();
    if(errors){
     

        res.render("admin/addCategory", {
            errors,
            title
        });
        
    } else {
  
        Category.findOne({slug})
        .then((categ) => {
            if(categ){
              
                req.flash("danger", "This category already exist, try another one");
                return res.render("admin/addCategory", {
                    title,
                    slug
                });
            } else {

                let newCategory = new Category({
                    title,
                    slug
                });
                
                
                newCategory.save()
                .then((result) => {
                    if(result) {
                        console.log("Saved huh");
                        req.flash("success", "Category succesfully added.");
                        res.redirect("/admin/categories"); 
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


router.get("/edit-category/:id", (req, res) => {
   Category.findById(req.params.id)
   .then((category) => {
        if(!category){
            return res.status(404).send({
                errorMessage: "Category not found"
            })
        }

        res.render("admin/editCategory", {
            title: category.title,
            id: category._id
        })
   })
   .catch((e) => {
    console.log(e.message);
    return res.send(404).send();
});

});

router.post("/edit-category/:id", (req, res) => {
    
    req.checkBody("title", "Title can't be empty").notEmpty();
    var title = req.body.title;
    var slug = title.replace(/\s+/g, "-").toLowerCase();


    var id = req.params.id;
    var errors = req.validationErrors();
    if(errors){
        res.render("admin/editCategory", {
            errors,
            title,
            id
        });
        
    } else {
  
        Category.findOne({slug: slug, _id:{"$ne":id}})
        .then((category) => {
            if(category){
              
                req.flash("danger", "This category already exist, try another one");
                return res.render("admin/editCategory", {
                    errors,
                    title,
                    id
                });
            } else {

                Category.findById(id)
                .then((category) => {
                    if(!category){
                        console.log("Category not found");
                        return res.status(404).send();
                    }
                    category.title = title;
                    category.slug = slug;
                    
                    category.save()
                    .then((result) => {
                        req.flash("success", "Category updated.");
                        res.redirect("/admin/categories"); 
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

router.get("/delete-category/:id", async(req, res) => {
    await Category.findByIdAndRemove(req.params.id)
    
    req.flash("success", "Category successfully deleted.");
    res.redirect("/admin/categories"); 
    console.log("deleted.");
})

       



module.exports = router;