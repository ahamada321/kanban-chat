const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },

  isBanned: Boolean,
  isApproved: Boolean,
  isShared: Boolean,
  rating: Number,

  lineURL: String,
  facebook: { type: String, lowercase: true },
  instagram: { type: String, lowercase: true },
  twitter: { type: String, lowercase: true },
  youtube: { type: String, lowercase: true },
  videoLink: { type: String, lowercase: true },

  rentalname: {
    type: String,
    required: "商品名を入力してください",
    max: [128, "商品名は最大128文字までです"],
  },
  province: { type: Object, required: "都道府県を設定してください" },
  address1: String,
  address2: String,
  // hourlyPrice: { type: Number, required: "時給を設定してください" },
  hourlyPrice: { type: Number, default: 5000 },

  selectedCategory: String,
  cardDescription: { type: String, default: "New member" },
  description: { type: String, required: "自己紹介文を入力してください" },

  course1Img: String,
  course1Title: { type: String, default: "Coming soon" },
  course1Description: { type: String, default: "Coming soon" },
  course2Title: String,
  course2Img: String,
  course2Description: String,
  memo: String,

  image: { type: String, required: "プロフィール写真を設定してください" },
  gallery1: String,
  gallery2: String,
  gallery3: String,
  gallery4: String,
  gallery5: String,
  gallery6: String,
  gallery7: String,
  gallery8: String,

  user: { type: Schema.Types.ObjectId, ref: "User" },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  favouritesFrom: [{ type: Schema.Types.ObjectId, ref: "User" }],
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],

  // // Wanna be more simlpify menu below
  // businesshour_enabled_sun: { type: Boolean, default: true },
  // businesshour_startTime_sun: {
  //   hour: { type: Number, default: 10 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_endTime_sun: {
  //   hour: { type: Number, default: 19 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_enabled_mon: { type: Boolean, default: true },
  // businesshour_startTime_mon: {
  //   hour: { type: Number, default: 10 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_endTime_mon: {
  //   hour: { type: Number, default: 19 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_enabled_tue: { type: Boolean, default: true },
  // businesshour_startTime_tue: {
  //   hour: { type: Number, default: 10 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_endTime_tue: {
  //   hour: { type: Number, default: 19 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_enabled_wed: { type: Boolean, default: true },
  // businesshour_startTime_wed: {
  //   hour: { type: Number, default: 10 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_endTime_wed: {
  //   hour: { type: Number, default: 19 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_enabled_thu: { type: Boolean, default: true },
  // businesshour_startTime_thu: {
  //   hour: { type: Number, default: 10 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_endTime_thu: {
  //   hour: { type: Number, default: 19 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_enabled_fri: { type: Boolean, default: true },
  // businesshour_startTime_fri: {
  //   hour: { type: Number, default: 10 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_endTime_fri: {
  //   hour: { type: Number, default: 19 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_enabled_sat: { type: Boolean, default: true },
  // businesshour_startTime_sat: {
  //   hour: { type: Number, default: 10 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
  // businesshour_endTime_sat: {
  //   hour: { type: Number, default: 19 },
  //   minute: { type: Number, default: 0 },
  //   second: { type: Number, default: 0 },
  // },
});

module.exports = mongoose.model("Rental", rentalSchema);
