"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

// Blog Controller:

const Blog = require("../models/blog");
const CustomError = require("../errors/customError");
const { default: redocExpressMiddleware } = require("redoc-express");

module.exports = {
  list: async (req, res) => {
    /*    
            #swagger.tags = ["Blogs"]
            #swagger.summary = "List Blogs"
            #swagger.description = `
                You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                    <li>URL/?<b>limit=10&page=1</b></li>
                </ul>
            `
        */

    let customFilter = {};
    if (req.query?.author) {
      customFilter = { userId: req.query.author };
    }

    if (req.query?.category) {
      customFilter = { categoryId: req.query.category };
    }

    // console.log(customFilter);

    const data = await res.getModelList(Blog, customFilter, [
      {
        path: "userId",
        select: "username firstName lastName image isActive",
        match: { isActive: true },
      },
      {
        path: "categoryId",
        select: "name",
      },
      {
        path: "comments",
      },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Blog, customFilter),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Create Blog"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Blog 1"
                }
            }
        */

    const data = await Blog.create(req.body);

    res.status(200).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Get Single Blog"
        */

    if (req.params.id) {
      const data = await Blog.findOne({ _id: req.params.id }).populate([
        {
          path: "userId",
          select: "username firstName lastName image",
        },
        {
          path: "categoryId",
          select: "name",
        },
        {
          path: "comments",
          populate: {
            path: "userId",
            select: "username firstName lastName image",
          },
        },
      ]);

      if (data) {
        await data.incrementVisitors();
      }

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Blog),
        data,
      });
    } else {
      const data = await res.getModelList(Blog);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Blog),
        data,
      });
    }
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Update Blog"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Blog 1"
                }
            }
        */

    const data = await Blog.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(200).send({
      error: false,
      new: await Blog.findOne({ _id: req.params.id }),
      data,
    });
  },

  deleteBlog: async (req, res) => {
    /*
            #swagger.tags = ["Blogs"]
            #swagger.summary = "Delete Blog"
        */

    const data = await Blog.deleteOne({ _id: req.params.id });

    res.status(200).send({
      error: !data.deletedCount,
      data,
    });
  },

  addRemoveLike: async (req, res) => {
    /*
        #swagger.tags = ["Blogs"]
        #swagger.summary = "Add or Remove Like from a Blog"
        #swagger.description = "This endpoint allows a user to add or remove their like from a specific blog post."
        #swagger.parameters['id'] = {
            description: "ID of the blog post",
            required: true,
            type: "string",
            in: "path"
        }

    */
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new CustomError("Blog not found", 404);
    }

    if (blog.userId.toString() === userId.toString()) {
      throw new CustomError("You cannot like your own blog", 400);
    }

    const likeIndex = blog.likes.indexOf(userId);
    if (likeIndex === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.status(200).send({
      error: false,
      message: likeIndex === -1 ? "Like added" : "Like removed",
      data: {
        likesCount: blog.likes.length,
      },
    });
  },
};
