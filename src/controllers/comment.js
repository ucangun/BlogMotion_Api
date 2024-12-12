"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

// Comment Controller:

const Comment = require("../models/comment");
const Blog = require("../models/blog");

module.exports = {
  list: async (req, res) => {
    /*    
            #swagger.tags = ["Comments"]
            #swagger.summary = "List Comments"
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

    const data = await res.getModelList(Comment);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Create Comment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Comment 1"
                }
            }
        */

    const data = await Comment.create(req.body);

    await Blog.findByIdAndUpdate(
      req.body.blogId,
      { $push: { comments: data._id } },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Get Single Comment"
        */

    if (req.params.id) {
      const data = await Comment.findOne({ _id: req.params.id });

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Comment),
        data,
      });
    } else {
      const data = await res.getModelList(Comment);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Comment),
        data,
      });
    }
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Update Comment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Comment 1"
                }
            }
        */

    const data = await User.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(200).send({
      error: false,
      new: await User.findOne({ _id: req.params.id }),
      data,
    });
  },

  deleteComment: async (req, res) => {
    /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Delete Comment"
        */

    const data = await User.deleteOne({ _id: req.params.id });

    res.status(200).send({
      error: !data.deletedCount,
      data,
    });
  },
};
