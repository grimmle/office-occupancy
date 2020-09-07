const moment = require("moment");
const express = require("express");
const workplaces = express.Router();
const WorkplaceModel = require("../models/workplace.model");

workplaces.route("")
// GET Request - returns all workplaces if no filters are applied
// filter by hasPC(Boolean), isReserved(Boolean), location(String), search=(String)
// sort by endDate/startDate:-1/1, _id:-1/1
.get((req, res) => {
  var filter = {};
  var date = {};
  var sort = {};
  // FILTERING
  if(req.query.eid !== undefined) filter.eid = req.query.eid;
  if(req.query.hasPC !== undefined) filter.hasPC = req.query.hasPC;
  if(req.query.location !== undefined) filter.location = req.query.location;
  if(req.query.search !== undefined) filter._id = { $regex: req.query.search, $options: "i" };
  if(req.query.startDate !== undefined && req.query.endDate !== undefined) {
    date["reservations.startDate"] = { $lte: req.query.endDate }
    date["reservations.endDate"] = { $gte: req.query.startDate }
  }
  // SORTING
  if(req.query.sort !== undefined) {
    // QUERY SORT
    let [variable, order] = req.query.sort.split(":");
    console.log(variable, order);
    sort[variable.toString()] = order;
  } else {
    // DEFAULT SORT - unreserved workplaces ascending, id ascending
    sort["_id"] = "1";
    sort["reservations"] = "1";
  }
  console.log("DATE: ", date);
  console.log("FILTER: ", filter);
  console.log("SORT: ", sort);
  var query = filter;
  if(Object.keys(date).length !== 0) {
    //query = {$and: [{$or: [date, {reservations: { $exists: true, $eq: [] } }] }, filter]}
  }
  console.log("QUERY: ", query)
  WorkplaceModel.find(query)
  .populate("reservations.employee")
  .sort(sort)
  .then(result => {
    if(req.query.startDate !== undefined || req.query.endDate !== undefined) {
      // only returns reservations overlapping selected daterange
      // removes any reservation from result array that is not within given range
      for(var i = 0; i < result.length; i++){
        for(var j = 0; j < result[i].reservations.length; j++) {
          var start = moment.utc(result[i].reservations[j].startDate)
          var end = moment.utc(result[i].reservations[j].endDate)
          if(start <= moment.utc(req.query.endDate) && end >= moment.utc(req.query.startDate)) {
            //console.log("correct")
          } else {
            //console.log("removed")
            result[i].reservations.splice(j, 1)
            j--
          }
        }
      }
      console.log("isReserved: " + req.query.isReserved)
      if(req.query.isReserved == "false") {
        for(var i = 0; i < result.length; i ++) {
          if(result[i].reservations.length !== 0) {
            result.splice(i, 1);
            i--
          }
        }
      }
    }
    res.send(result);
  })
  .catch(err => {
    res.status(400).send(err);
  });
})
// POST Request - creates a new workplace
// requires _id(String), location(String), hasPC(Boolean)
.post((req, res) => {
  const wp = new WorkplaceModel({
    _id: req.body._id,
    location: req.body.location,
    hasPC: req.body.hasPC,
    reservations: req.body.reservations,
  })
  wp.save()
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    res.status(400).send("Unable to save " +err);
  });
});

workplaces.route("/:id")
// GET Request - returns a single workplace by _id
.get((req, res) => {
  WorkplaceModel.findOne({_id: req.params.id})
  .populate("employee")
  .then(result => {
    console.log(result);
    if(result) res.send(result);
    else {
      res.json({err: "Not found!"});
      console.log("Not found!");
    }
  })
  .catch(err => {
    console.log("Caught error: ${err}");
    return res.status(400).json(err);
  });
})
// PATCH Request - updates a single workplaces by _id
// update values for hasPC(Boolean), location(String)
.patch((req, res) => {
  var update = {};

  if(req.body.hasPC !== undefined) update.hasPC = req.body.hasPC;
  if(req.body.location !== undefined) update.location = req.body.location;
  update = { $set: update };
  console.log(update);

  WorkplaceModel.findOneAndUpdate( {_id: req.params.id}, update, {new: true} )
  .then(result => {
    res.send(result);
  })
  .catch(err => {
    res.status(400).send(err);
  });
})
// DELETE Request - deletes a workplace by _id
.delete((req, res) => {
  WorkplaceModel.deleteOne({ _id: req.params.id })
  .catch(err => {
    res.status(400).send(err);
  })
  .then(result => {
    console.log("Successfully deleted workplace " +req.params.id);
    res.json( {success: "Successfully deleted workplace " +req.params.id} );
  })
});

workplaces.route("/:id/reservations")
// GET request - returns all reservations of one workplace
.get((req, res) => {
  WorkplaceModel.findOne({ _id: req.params.id })
  .then(result => {
    res.send(result.reservations);
  })
  .catch(err => {
    res.status(400).send(err);
  });
})
// POST request - adds a reservation to a workplace
// requires startDate(Date), endDate(Date), employee(Employee)
// optional note(String)
.post((req, res) => {
  WorkplaceModel.findOne( {_id: req.params.id} )
  .then(result => {
    const reservation = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      employee: req.body.employee,
      note: req.body.note
    }
    if(result.reservations.length === 0) {
      result.reservations.push(reservation);
    } else {
      // CHECK OVERLAPPING
      for(var i = 0; i< result.reservations.length; i++) {
        var a = new Date(result.reservations[i].startDate)
        var b = new Date(reservation.endDate)
        var c = new Date(result.reservations[i].endDate)
        var d = new Date(reservation.startDate)
        //reservations.startDate <= new.startDate && reservations.enddate >= new.endDate
        if(a <= d && c >= b) return res.status(400).json( {"error": "Daterange overlaps with an existing reservation. Case 1"} )
        //reservations.startDate >= new.startDate && reservation.startDate <= new.endDate
        else if(a >= d && a <= b) return res.status(400).json( {"error": "Daterange overlaps with an existing reservation. Case 2"} )
        //reservations.endDate >= new.startDate && reservations.endDate <= new.endDate
        else if(c >= d && c <= b) return res.status(400).json( {"error": "Daterange overlaps with an existing reservation. Case 3"} )
        //reservations.startDate >= new.startDate && reservations.endDate <= new.enddate
        else if(a >= d && c <= b) return res.status(400).json( {"error": "Daterange overlaps with an existing reservation. Case 4"} )
      }
      var temp;
      // reservations are sorted by startDate
      // adds new reservation at correct index
      for(var i = 0; i < result.reservations.length; i++) {
        var d1 = new Date(result.reservations[i].startDate)
        var d2 = new Date(reservation.startDate)
        if(d1 < d2) {
          temp = i + 1;
        }
      }
      result.reservations.splice(temp, 0, reservation)
    }
    result.save(function(err) {
      if(err) {
        console.log("ERROR while saving")
      }
    });
    res.send(result);
  })
  .catch(err => {
    res.status(400).send(err);
  });
})

workplaces.route("/:id/reservations/:rid")
// GET request - returns reservation with given id
.get((req, res) => {
  WorkplaceModel.findOne({ _id: req.params.id, "reservations._id": req.params.rid})
  .then(result => {
    for(var i = 0; i < result.reservations.length; i++) {
      console.log(req.params.rid)
      if(result.reservations[i]._id == req.params.rid) {
        res.send(result.reservations[i]);
      }
    }
  })
  .catch(err => {
    res.status(400).send(err);
  });
})
// UPDATE request - updates given values of a reservation
.patch((req, res) => {
  if(req.body) {
    WorkplaceModel.findOne({ _id: req.params.id, "reservations._id": req.params.rid})
    .then(result => {
      for(var i = 0; i < result.reservations.length; i++) {
        if(result.reservations[i]._id == req.params.rid) {
          if(req.body.note !== undefined) result.reservations[i].note = req.body.note
          if(req.body.startDate !== undefined && new Date(req.body.startDate) <= result.reservations[i].endDate) result.reservations[i].startDate = new Date(req.body.startDate)
          if(req.body.endDate !== undefined && new Date(req.body.endDate) >= result.reservations[i].startDate) result.reservations[i].endDate = new Date(req.body.endDate)
          if(req.body.employee !== undefined) result.reservations[i].employee = req.body.employee
          result.save(function(err) {
            if(err) {
              console.log("ERROR while saving")
            }
          });
          res.send(result.reservations[i]);
        }
      }
    })
    .catch(err => {
      res.status(400).send(err);
    });
  } else {
    console.log("No values for PATCH given")
  }
})
// DELETE request - deletes a reservation by _id
.delete((req, res) => {
  WorkplaceModel.findOne({ _id: req.params.id, "reservations._id": req.params.rid})
  .then(result => {
    for(var i = 0; i < result.reservations.length; i++) {
      console.log(req.params.rid)
      if(result.reservations[i]._id == req.params.rid) {
        result.reservations.splice(i, 1)
        result.save(function(err) {
          if(err) {
            console.log("ERROR while saving")
          }
        });
        res.json( {success: "Successfully deleted reservation " +req.params.rid} );
      }
    }
  })
  .catch(err => {
    res.status(400).send(err);
  });
})

module.exports = workplaces;
