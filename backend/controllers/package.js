const Package = require('../models/package')
const cloudinary = require('cloudinary')
const APIFeatures = require('../utils/apiFeatures');

exports.getPackages = async (req, res) => {
    const resPerPage = 4;
    const packagesCount = await Package.countDocuments();
    const apiFeatures = new APIFeatures(Package.find(), req.query).search().filter();
    apiFeatures.pagination(resPerPage);
    const packages = await apiFeatures.query;
    let filteredPackageCount = packages.length;

	if (!packages) 
        return res.status(400).json({message: 'error loading packages'})
   return res.status(200).json({
        success: true,
        packages,
		filteredPackageCount,
		resPerPage,
		packagesCount,
		
	})
}

exports.getSinglePackage = async (req, res, next) => {
	const package = await Package.findById(req.params.id);
	if (!package) {
		return res.status(404).json({
			success: false,
			message: 'Package not found'
		})
	}
	return res.status(200).json({
		success: true,
		package
	})
}

exports.getAdminPackage = async (req, res, next) => {

	const packages = await Package.find();
	if (!packages) {
		return res.status(404).json({
			success: false,
			message: 'Package not found'
		})
	}
	return res.status(200).json({
		success: true,
		packages
	})

}

exports.deletePackage = async (req, res, next) => {
	const package = await Package.findByIdAndDelete(req.params.id);
	if (!package) {
		return res.status(404).json({
			success: false,
			message: 'Package not found'
		})
	}

	return res.status(200).json({
		success: true,
		message: 'Package deleted'
	})
}

exports.newPackage = async (req, res, next) => {
    let images = [];

    if (req.files) {
        images = req.files.map(file => file.path); 
    } else if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images || [];
    }

    let imagesLinks = [];

    
    for (let i = 0; i < images.length; i++) {
        try {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'packages', 
                width: 150,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error uploading image to Cloudinary',
                error: error.message,
            });
        }
    }

    req.body.images = imagesLinks; 

    const package = await Package.create(req.body);

    if (!package) {
        return res.status(400).json({
            success: false,
            message: 'Package not created'
        });
    }

    return res.status(201).json({
        success: true,
        package
    });
};

exports.updatePackage = async (req, res) => {
    try {
        let package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({
                success: false,
                message: 'Package not found',
            });
        }

        const updateFields = ['name', 'description', 'price', 'startDate', 'endDate', 'locations', 'features', 'status', 'stocks'];

        updateFields.forEach(field => {
            if (req.body[field]) {
                package[field] = req.body[field];
            }
        });

        // Update availableDates if provided in the request
        if (req.body.availableDates) {
            package.availableDates = req.body.availableDates; // Replace the entire array
        }

        let imagesLinks = [];

        if (req.files && req.files.length > 0) {
            for (const image of package.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }

            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'packages',
                    width: 150,
                    crop: "scale",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
            package.images = imagesLinks;
        } else {
            imagesLinks = package.images;
        }

        package.lastUpdated = Date.now();

        await package.save();

        return res.status(200).json({
            success: true,
            package,
        });
    } catch (error) {
        console.error('Update package error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
