"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

// Note Controller:

const Note = require("../models/note");
const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    /*    
            #swagger.tags = ["Notes"]
            #swagger.summary = "List Notes"
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

    const data = await res.getModelList(Note);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Note),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Notes"]
            #swagger.summary = "Create Note"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Note 1"
                }
            }
        */

    const data = await Note.create(req.body);

    await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { notes: data._id } },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Notes"]
            #swagger.summary = "Get Single Note"
        */

    if (req.params.id) {
      const data = await Note.findOne({ _id: req.params.id });

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Note),
        data,
      });
    } else {
      const data = await res.getModelList(Note);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Note),
        data,
      });
    }
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Notes"]
            #swagger.summary = "Update Note"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "Note 1"
                }
            }
        */

    const data = await Note.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(200).send({
      error: false,
      new: await Note.findOne({ _id: req.params.id }),
      data,
    });
  },

  deleteNote: async (req, res) => {
    /*
            #swagger.tags = ["Notes"]
            #swagger.summary = "Delete Note"
        */

    const data = await Note.deleteOne({ _id: req.params.id });

    res.status(200).send({
      error: !data.deletedCount,
      data,
    });
  },
};
