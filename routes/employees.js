const express = require("express");
const employees = express.Router();

const EmployeeModel = require("../models/employee.model");

employees.route("")
// GET Request - returns all employees
.get((req,res) => {
  EmployeeModel.find()
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    res.status(400).send("Error while getting all employees");
  })
})
// POST Request - add a new employee
.post((req, res) => {
  const em = new EmployeeModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  })
  em.save()
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    res.status(400).send("Unable to save " +err);
  });
})

module.exports = employees;
