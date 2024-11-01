const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { 
    getPackages, 
    getSinglePackage,
    getAdminPackage,
    deletePackage,
    newPackage,
    updatePackage,
} = require('../controllers/package');
// const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.get('/packages', getPackages);
router.get('/package/:id', getSinglePackage);
router.get('/admin/packages', getAdminPackage);
router.route('/admin/package/:id')
    .delete(deletePackage)
    .put(upload.array('images', 10), updatePackage); // Add upload middleware here

router.post('/admin/package/new', upload.array('images', 10), newPackage);

module.exports = router;