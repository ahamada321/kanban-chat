const Rental = require("./models/rental");
const User = require("./models/user");
const { normalizeErrors } = require("./helpers/mongoose");

exports.getRentalById = function (req, res) {
  const rentalId = req.params.id;

  Rental.findById(rentalId)
    .populate("user") // Need to consider security in future.
    .populate("bookings", "startAt endAt status _id") // Need to consider security in future.
    .exec(function (err, foundRental) {
      if (err) {
        return res.status(422).send({
          errors: {
            title: "Rental error!",
            detail: "Could not find Rental!",
          },
        });
      }
      return res.json(foundRental);
    });
};

exports.getRentals = function (req, res) {
  const { page, limit } = req.query;
  const { selectedCategory, rentalname } = req.body;

  if (!rentalname) {
    if (!selectedCategory) {
      Rental.aggregate(
        [
          { $match: { isShared: true } }, // Filtering to teachers
          {
            $facet: {
              metadata: [{ $count: "total" }, { $addFields: { page: page } }],
              foundRentals: [
                { $skip: (page - 1) * limit },
                { $limit: Number(limit) },
              ],
            },
          },
        ],
        function (err, result) {
          if (err) {
            return res
              .status(422)
              .send({ errors: normalizeErrors(err.errors) });
          }
          return res.json(result);
        }
      );
    } else {
      Rental.aggregate(
        [
          {
            $match: {
              isShared: true,
              selectedCategory: { $in: selectedCategory },
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }, { $addFields: { page: page } }],
              foundRentals: [
                { $skip: (page - 1) * limit },
                { $limit: Number(limit) },
              ],
            },
          },
        ],
        function (err, result) {
          if (err) {
            return res
              .status(422)
              .send({ errors: normalizeErrors(err.errors) });
          }
          return res.json(result);
        }
      );
    }
  } else {
    if (!selectedCategory) {
      Rental.aggregate(
        [
          {
            $match: {
              isShared: true,
              rentalname: {
                $regex: rentalname,
                $options: "i",
              },
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }, { $addFields: { page: page } }],
              foundRentals: [
                { $skip: (page - 1) * limit },
                { $limit: Number(limit) },
              ],
            },
          },
        ],
        function (err, result) {
          if (err) {
            return res
              .status(422)
              .send({ errors: normalizeErrors(err.errors) });
          }
          return res.json(result);
        }
      );
    } else {
      Rental.aggregate(
        [
          {
            $match: {
              isShared: true,
              selectedCategory: { $in: selectedCategory },
              rentalname: {
                $regex: rentalname,
                $options: "i",
              },
            },
          },
          {
            $facet: {
              metadata: [{ $count: "total" }, { $addFields: { page: page } }],
              foundRentals: [
                { $skip: (page - 1) * limit },
                { $limit: Number(limit) },
              ],
            },
          },
        ],
        function (err, result) {
          if (err) {
            return res
              .status(422)
              .send({ errors: normalizeErrors(err.errors) });
          }
          return res.json(result);
        }
      );
    }
  }
};

exports.getOwnerRentals = function (req, res) {
  const user = res.locals.user;
  const { page, limit } = req.query;

  if (user.userRole === "Admin") {
    // Rental.find({})
    //   .populate("bookings")
    //   .exec(function (err, foundRentals) {
    //     if (err) {
    //       return res.status(422).send({ errors: normalizeErrors(err.errors) });
    //     }
    //     return res.json(foundRentals);
    //   });
    Rental.aggregate(
      [
        {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { page: page } }],
            foundRentals: [
              { $skip: (page - 1) * limit },
              { $limit: Number(limit) },
            ],
          },
        },
      ],
      function (err, result) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json(result);
      }
    );
  } else {
    // Rental.find({ user })
    //   .populate("bookings")
    //   .exec(function (err, foundRentals) {
    //     if (err) {
    //       return res.status(422).send({ errors: normalizeErrors(err.errors) });
    //     }
    //     return res.json(foundRentals);
    //   });
    Rental.aggregate(
      [
        { $match: { user: user._id } }, // Filtering to teachers
        {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { page: page } }],
            foundRentals: [
              { $skip: (page - 1) * limit },
              { $limit: Number(limit) },
            ],
          },
        },
      ],
      function (err, result) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json(result);
      }
    );
  }
};

exports.getUserFavouriteRentals = function (req, res) {
  const user = res.locals.user;

  Rental.find({ favouritesFrom: user }, function (err, foundRentals) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    return res.json(foundRentals);
  });
};

exports.deleteRental = function (req, res) {
  const user = res.locals.user;
  const rentalId = req.params.id;

  Rental.findById(rentalId)
    .populate("user", "_id")
    .populate({
      path: "bookings",
      select: "startAt",
      match: { startAt: { $gt: new Date() } }, // &gt: greater than. <- Pick up future than now.
    })
    .exec(function (err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      if (user.userRole !== "Admin" && user.id !== foundRental.user.id) {
        return res.status(422).send({
          errors: {
            title: "Invalid user!",
            detail: "You are not rental owner!",
          },
        });
      }
      if (foundRental.bookings.length > 0) {
        return res.status(422).send({
          errors: {
            title: "Active bookings!",
            detail: "Can not delete rental with active bookings!",
          },
        });
      }
      foundRental.remove(function (err) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json({ status: "deleted" });
      });
    });
};

exports.updateRental = function (req, res) {
  const rentalId = req.params.id;
  const rentalData = req.body;
  const user = res.locals.user;

  Rental.findById(rentalId)
    .populate("user", "_id")
    .exec(function (err, foundRental) {
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) });
      }
      if (user.userRole !== "Admin" && foundRental.user.id !== user.id) {
        return res.status(422).send({
          errors: {
            title: "Invalid user!",
            detail: "You are not rental owner!",
          },
        });
      }

      foundRental.updateOne(rentalData, function (err) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json({ status: "updated" });
      });
    });
};

exports.toggleFavourite = function (req, res) {
  const user = res.locals.user;
  const rentalId = req.params.id;

  Rental.findById(rentalId, function (err, foundRental) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }

    const index = foundRental.favouritesFrom.indexOf(user.id);
    if (index >= 0) {
      foundRental.favouritesFrom.splice(index, 1); // Dlete user from array.
    } else {
      foundRental.favouritesFrom.push(user);
    }

    return res.json({ status: "updated" });
  });
};

exports.createRental = function (req, res) {
  const rental = new Rental(req.body);
  rental.user = res.locals.user;

  Rental.create(rental, function (err, newRental) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    User.updateOne(
      { _id: rental.user.id },
      { $push: { rentals: newRental } },
      function (err, result) {
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        return res.json(result);
      }
    );
  });
};
