const Place = require("../models/place");
const fs = require("fs");
const ErrorHandler = require("../utils/ErrorHandler");
const hereMaps = require("../utils/hereMaps")

module.exports.index = async (req, res) => {
  const places = await Place.find({});
  const clusteringPlaces = places.map(place => {
    return {
      latitude: place.geometry.coordinates[1],
      longitude: place.geometry.coordinates[0]
    }
  })
  const clusteredPlaces = JSON.stringify(clusteringPlaces)
  
  res.render("places/index", { places, clusteredPlaces });
};

module.exports.storeForm = (req, res) => {
  res.render("places/create");
};

module.exports.store = async (req, res) => {
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));

  const geoCode = await hereMaps.geometry(req.body.place.location)

  const place = new Place(req.body.place);
  place.author = req.user._id;
  place.images = images;
  place.geometry = geoCode
  await place.save();

  req.flash("success_message", "Place added successfully");
  res.redirect("/places");
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  res.render("places/show", { place });
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  res.render("places/edit", { place });
};

module.exports.update = async (req, res) => {
  const geoCode = await hereMaps.geometry(req.body.place.location)

  const place = await Place.findByIdAndUpdate(req.params.id, {
    ...req.body.place,
    geometry: geoCode
  });

  place.images.forEach((image) => {
    fs.unlink(image.url, (err) => new ErrorHandler(err));
  });

  if (req.files && req.files.length > 0) {
    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    place.images = images;
    await place.save();
  }

  req.flash("success_message", "Place updated successfully");
  res.redirect(`/places/${req.params.id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);

  if (place.images.length > 0) {
    place.images.forEach((image) => {
      fs.unlink(image.url, (err) => new ErrorHandler(err));
    });
  }

  await place.deleteOne();

  req.flash("success_message", "Place deleted successfully");
  res.redirect("/places");
};

module.exports.destroyImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    if (!images || images.length === 0) {
      req.flash(
        "error_message",
        "Please select at least on image to be deleted"
      );
      return res.redirect(`/places/${id}/edit`);
    }

    images.forEach((image) => {
      fs.unlinkSync(image);
    });

    await Place.findByIdAndUpdate(id, {
      $pull: { images: { url: { $in: images } } },
    });

    req.flash("success_message", `Succesfully deleted ${images.length} image`);
    return res.redirect(`/places/${id}/edit`);
  } catch (err) {
    req.flash("error_message", "Failed to delete image");
    res.redirect(`/places/${id}/edit`);
  }
};
