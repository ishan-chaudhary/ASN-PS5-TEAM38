const express=require('express');
const router=express.Router();
const IndexController=require('../controllers/indexController');

router.get('/',IndexController.homeController);
router.get('/maps/markers',IndexController.getEncounterRecords);
router.get('/maps/chart',IndexController.sendChartData);

module.exports=router;