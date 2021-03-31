const express = require('express')
const router = express.Router()

const UserCtrl = require('./controllers/user')
const BookingCtrl = require('./controllers/booking')


router.get('', UserCtrl.authMiddleware, BookingCtrl.getUserBookings) // All bookings


router.get('/pending', UserCtrl.authMiddleware, BookingCtrl.getUserPendingBookings)

router.get('/expired', UserCtrl.authMiddleware, BookingCtrl.getUserExpiredBookings)


router.get('/accepted', UserCtrl.authMiddleware, BookingCtrl.getUserAcceptedBookings)

router.get('/finished', UserCtrl.authMiddleware, BookingCtrl.getUserFinishedBookings)

// router.get('/declined', UserCtrl.authMiddleware, BookingCtrl.getUserDeclinedBookings)


router.post('', UserCtrl.authMiddleware, BookingCtrl.createBooking)

router.patch('', UserCtrl.authMiddleware, BookingCtrl.updateBooking)

router.delete('/:id', UserCtrl.authMiddleware, BookingCtrl.deleteBooking)

router.post('/block', UserCtrl.authMiddleware, BookingCtrl.createDateBlockBooking)


module.exports = router