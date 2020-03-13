const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Reservation = new Schema(
    {
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
        employee: {
            type: String,
            required: true
        },
        note: {
            type: String,
            required: true
        },
    }
);

module.exports = mongoose.model("Reservation", Reservation);
