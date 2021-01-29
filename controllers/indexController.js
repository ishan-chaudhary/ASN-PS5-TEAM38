const Encounter = require('../models/encounter');
const mailer = require('../mailer/schedule');

const monthNames = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

module.exports.getEncounterRecords = async function (req, res) {
  return res.status(200).json(await Encounter.find({}));
}

module.exports.homeController = async function (req, res) {
  try {
    return res.render('index');
  } catch (err) {
    if (err) { console.log('error in printing list', err); return; }
  }
}

module.exports.sendChartData = async function (req, res) {
  let mmsi = Number(req.query.mmsi);
  let data = await Encounter.aggregate([
    {
      $match: { mmsi: mmsi }
    },
    {
      $addFields: {
        shipmentDate: { $toDate: "$start_time" }
      }
    },
    {
      $addFields: {
        shipmentMonth: { $month: "$shipmentDate" }
      }
    },
    {
      $group: {
        _id: '$shipmentMonth',
        'total': { $sum: 1 },
        'shipname':{$addToSet:'$shipname'}
      }
    },
    {
      $unwind:{path:'$shipname'}
    },
    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: monthNames
            },
            in: {
              $arrayElemAt: ['$$monthsInString', '$_id']
            }
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])
  let bar = {
    labels: [],
    total: []
  }
for(let month in data ){
    bar.labels.push(data[month].month);
    bar.total.push(data[month].total);
    bar.ship = data[month].shipname
  }
  let ship = await Encounter.findOne({mmsi:mmsi}).select('mmsi shipname callsign flag imo');
  return res.status(200).json({bar:bar , ship : ship});
}
