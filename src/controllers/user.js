"use strict";

/* ------------------------------------------------- */
/*                  BLOGMOTION API                   */
/* ------------------------------------------------- */

// User Controller:

const User = require("../models/user");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

module.exports = {
  list: async (req, res) => {
    /*    
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
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

    const data = await res.getModelList(User);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User),
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "User 1"
                }
            }
        */

    const data = await User.create(req.body);

    res.status(200).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */

    if (req.params.id) {
      const data = await User.findOne({ _id: req.params.id }).populate([
        {
          path: "notes",
          select: "content _id -userId",
        },
      ]);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(User),
        data,
      });
    } else {
      const data = await res.getModelList(User);

      res.status(200).send({
        error: false,
        details: await res.getModelListDetails(User),
        data,
      });
    }
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "name": "User 1"
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

  deleteUser: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */

    const data = await User.deleteOne({ _id: req.params.id });

    res.status(200).send({
      error: !data.deletedCount,
      data,
    });
  },

  deleteMe: async (req, res) => {
    /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Deactivate User"
    #swagger.description = "Sets the active status of the logged-in user to false, effectively deactivating their account."
  */

    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  },

  updateMe: async (req, res) => {
    // 1) Filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "firstName", "email", "lastName");

    // 2) Find the user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // 3) Update allowed fields
    Object.keys(filteredBody).forEach((field) => {
      user[field] = filteredBody[field];
    });

    // 4) Save the user (to trigger password hashing and other pre-save hooks)
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
};
