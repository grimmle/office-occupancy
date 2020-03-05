const assert = require("assert");
const WorkplaceModel = require("../models/workplace.model");

describe('get requests', function(){
  it('get all workplaces returns array', function(){
    WorkplaceModel.find({})
    .then(result => {
      assert(Array.isArray(result));
    });
  })
})
