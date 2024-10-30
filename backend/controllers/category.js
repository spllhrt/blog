const Category = require('../models/category')
const cloudinary = require('cloudinary')
const APIFeatures = require('../utils/apiFeatures');

exports.getCategories = async (req, res) => {
    const resPerPage = 4;
    const categoriesCount = await Category.countDocuments();
    const apiFeatures = new APIFeatures(Category.find(), req.query).search().filter();
    apiFeatures.pagination(resPerPage);
    const categories = await apiFeatures.query;
    let filteredCategoryCount = categories.length;

	if (!categories) 
        return res.status(400).json({message: 'error loading categories'})
   return res.status(200).json({
        success: true,
        categories,
		filteredCategoryCount,
		resPerPage,
		categoriesCount,
		
	})
}

exports.getSingleCategory = async (req, res, next) => {
	const category = await Category.findById(req.params.id);
	if (!category) {
		return res.status(404).json({
			success: false,
			message: 'Category not found'
		})
	}
	return res.status(200).json({
		success: true,
		category
	})
}

exports.getAdminCategories = async (req, res, next) => {

	const categories = await Product.find();
	if (!categories) {
		return res.status(404).json({
			success: false,
			message: 'Category not found'
		})
	}
	return res.status(200).json({
		success: true,
		categories
	})

}

exports.deleteCategory = async (req, res, next) => {
	const category = await Category.findByIdAndDelete(req.params.id);
	if (!category) {
		return res.status(404).json({
			success: false,
			message: 'Category not found'
		})
	}

	return res.status(200).json({
		success: true,
		message: 'Category deleted'
	})
}

exports.newCategory = async (req, res, next) => {
    let images = [];

    if (req.files) {
        // Process the files uploaded through Multer
        images = req.files.map(file => file.path); // Paths from local storage
    } else if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images || [];
    }

    let imagesLinks = [];

    // Iterate over images to upload to Cloudinary
    for (let i = 0; i < images.length; i++) {
        try {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'categories', // The folder in Cloudinary where images will be stored
                width: 150,
                crop: "scale",
            });

            // Save the image's public_id and secure_url
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

    req.body.images = imagesLinks; // Update images in req.body with Cloudinary links

    const category = await Category.create(req.body);

    if (!category) {
        return res.status(400).json({
            success: false,
            message: 'Category not created'
        });
    }

    return res.status(201).json({
        success: true,
        category
    });
};


exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        if (req.body.name) {
            category.name = req.body.name;
        }

        let imagesLinks = [];

        // If there are new images uploaded, replace the existing images
        if (req.files && req.files.length > 0) {
            // Delete existing images from Cloudinary
            for (const image of category.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }

            // Upload new images to Cloudinary
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'categories',
                    width: 150,
                    crop: "scale",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        } else {
            // Retain existing images if no new images were uploaded
            imagesLinks = category.images;
        }

        category.images = imagesLinks;

        await category.save();

        return res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        console.error('Update category error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
