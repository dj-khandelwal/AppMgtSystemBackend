module.exports = app => {
  const applications = require("../controllers/application.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/applications/api/create", applications.create);
  // Retrieve all Tutorials
  router.get("/applications/api/findAll", applications.findAll);
  router.get("/applications/api/test", applications.test);

  router.get("/applications/api/find/:id", applications.findOne);

  router.put("/applications/api/updateById/:id", applications.updateById);

  router.delete("/applications/api/delete/:id", applications.delete);
  // Create a new Tutorial
  router.delete("/applications/api/deleteAll", applications.deleteAll);
  
  router.get("/applications/api/findByCompanyName/:cName", applications.findByCompanyName);
  router.get("/applications/api/open", applications.findAllOpen);

  app.use(router);
};