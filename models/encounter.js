const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EncounterSchema = new Schema({

  "mmsi": Number,
  "shipname": String,
  "callsign": String,
  "flag": String,
  "imo": Number,
  "first_timestamp": Date,
  "last_timestamp": Date,
  "fishing_vessel_mmsi": Number,
  "transshipment_vessel_mmsi": Number,
  "start_time": Date,
  "end_time": Date,
  "mean_latitude": Number,
  "mean_longitude": Number,
  "duration_hr": Number,
  "median_distance_km": Number,
  "median_speed_knots": Number

}, { strict: false });
const Encounter = mongoose.model('Encounter', EncounterSchema);

module.exports = Encounter;