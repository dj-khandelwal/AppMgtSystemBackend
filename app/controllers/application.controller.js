const db = require("../models");
const Application = db.applications;
const AppStatus = Application.AppStatus;

const getPagination = (page, size) => {
    page -= 1;
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
  
    return { offset, limit };
  };

// Create and Save a new Tutorial
exports.create = (req, res) => {
    if (!req.body.companyName) {
        res.status(400).send({ message: "companyName can not be empty!" });
        return;
    }
    if (!req.body.position) {
        res.status(400).send({ message: "position can not be empty!" });
        return;
    }
    
    // Create a Tutorial
    const application = new Application({
        companyName: req.body.companyName,
        position: req.body.position,
        dateOfApplication: req.body.dateOfApplication ? req.body.dateOfApplication : Date.now(),
        lastUpdate: Date.now(),
        status: AppStatus.Applied,
        notes: req.body.notes ? notes : ""
    });

    // Save Tutorial in the database
    application
        .save(application)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while creating the application."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const { page, size } = req.query;
    const { offset, limit } = getPagination(page, size);
    Application.paginate({}, {sort: { lastUpdate : -1 }}, {offset, limit})
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                applications: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page,
              });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving applications."
            });
        });
    
};

exports.findByCompanyName = (req, res) => {
    const companyName = req.params.cName;
    if (!companyName) {
        return res.status(400).send({
          message: "No companyName provided!"
        });
    }
    const { page, size } = req.query;
    const { offset, limit } = getPagination(page, size);
    var condition = { companyName: { $regex: new RegExp(companyName), $options: "i" } };

    Application.paginate(condition, {sort: { lastUpdate : -1 }}, { offset, limit })
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page,
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while retrieving applications."
            });
        });
    
};
// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Application.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Application with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Application with id=" + id });
      });
};

// Update a Tutorial by the id in the request
exports.updateById = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
    }
    
    const id = req.params.id;

    Application.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Application with id = ${id}. Maybe Application was not found!`
                });
            } else res.send({ message: "Application was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Application with id = " + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Application.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Application with id = ${id}. Maybe Application was not found!`
                });
            } else {
                res.send({
                    message: "Application was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Application with id = " + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Application.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Applications were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all applications."
            });
        });
};

// Find all published Tutorials
exports.findAllOpen = (req, res) => {
    const { page, size } = req.query;
    const { offset, limit } = getPagination(page, size);
    
    Application.paginate({ status: { $nin: [AppStatus.Rejected, AppStatus.Offer]} }, {sort: { lastUpdate : -1 }}, { offset, limit })
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                applications: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page,
              });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving applications."
            });
        });  
};

exports.test = (req, res) => {
    console.log("HELLO: TEST");
    res.json({ message: "Welcome to the application management system Now!" });
};
