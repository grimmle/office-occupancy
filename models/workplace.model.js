const mongoose = require("mongoose");
const Employee = require("./employee.model");
const Schema = mongoose.Schema;

const Workplace = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    hasPC: {
      type: Boolean,
      required: true
    },
    reservations: [
      { startDate: {
        type: Date,
        default: undefined
      },
      endDate: {
        type: Date,
        default: undefined
      },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: undefined
      },
      note: {
        type: String,
        default: ""
      }
    }
  ],
}
);

module.exports = mongoose.model("Workplace", Workplace);
