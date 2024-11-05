const { Category, User } = require("../models");



const addCategory =async (req,res, next) => {
    try {
        const {title, desc} = req.body;
        const {_id} = req.user;

        const isCategoryExist= await Category.findOne({title});
        if(isCategoryExist) {
            res.code = 400;
            throw new Error("Category already Exist")
        }

        const user = await User.findById(_id);
        if(!user) {
            res.code = 400;
            throw new Error("User not found")
        }

        const newCategory = new Category({
            title,
            desc,
            updatedBy: _id,

        });

        await newCategory.save()
        res.status(200).json({
            code: 200,
            status: true,
            message: "Sucess Add Category"
        })


    } catch (error) {
        next(error)
    }
}


const updateCategory = async (req,res,next) => {
    try {
        const {id} = req.params;
        const {_id} = req.user;
        const {title, desc} = req.body;

       //get category by params category id
        const category = await Category.findById(id)
        if(!category) {
            res.code = 404;
            throw new Error("Category not found")
        }

        const isCategoryExist = await Category.findOne({title});
        if(isCategoryExist && isCategoryExist.title === title && String(isCategoryExist._id) !== String(category._id)) {
            res.code = 400;
            throw new Error("Title already Exist")
        }

        //update column
        category.title = title ? title : category.title;
        category.desc = desc;
        category.updatedBy = _id;
        await category.save();

        res.status(200).json({
            code: 200,
            status: true,
            message: "Update Category Successfully",
            data : {
              category
            }
        })

    } catch (error) {
        next(error)
    }
}


const deleteCategory = async (req,res,next) => {
    try {
        const {id} = req.params;

        const category = await Category.findById(id);
        if(!category) {
            res.code = 404
            throw new Error ("Category Not Found")
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            code: 200,
            status: true,
            message: "Delete Category SuccessFully"
        })



    } catch (error) {
        next(error)
    }
}

const getCategory = async (req,res,next) => {
    try {
        const {q, size, page} = req.query;
        let query ={};

        const sizeNumber = parseInt(size) || 10;
        const pageNumber = parseInt(page) || 1;

        if(q) {
            //param i is case-insensitive (huruf besar atau kecil)
            const search= RegExp(q, "i");
            // console.log(search)
            // query = {title : q}
            //with monngo db $or method atau %Like% on sql
            query = {$or: [{title: search}, {desc : search}]};
            console.log(query)
        }
        // count document data 
        const total = await Category.countDocuments(query);
        console.log("Total" + total)
        // total document : sizeNumber
        const pages = Math.ceil(total / sizeNumber);

        const categories = await Category.find(query)
                                         .skip((pageNumber -1 ) * sizeNumber)
                                         .limit(sizeNumber)
                                         .sort({updatedBy: -1 }); // ex: (5-1) * 20 = 80 Data
        res.status(200).json({
            code: 200,
            status: true,
            message: "Get List Category SuccessFully",
            data : {
                categories,
                total,
                pages
            }
        })
    } catch (error) {
       next(error) 
    }
}

const getSingleCategory = async (req,res,next) => {
    try {
        const {id} = req.params;

        const category = await Category.findById(id);
        if(!category) {
            res.code = 404;
            throw new Error("Category Not Found");
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: "Get Category SuccessFuly",
            data: {
                category
            }
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {addCategory, updateCategory, deleteCategory, getCategory, getSingleCategory}