// ----------Imports----------
const {
  RegisterUser,
  LoginUser,
  getAllCustomers,
  GetUserById,
} = require("./User");
const {
  CreateWeighingDevice,
  GetAllDeviceDetails,
  GetAllWeighingDevicesDetails,
  GetWeighingDevicesDataById,
  UpdateWeighingDevice,
  DeleteWeighingDevice,
  GetWeighingDeviceDetailsById,
  GetWeighingDevicesRecentDataById,
} = require("./WeighingDevice");
const {
  CreateWeighingData,
  UpdateWeighingData,
  DeleteWeighingData,
} = require("./WeighingData");
const {
  Createitem,
  GetAllitems,
  GetitemsByUserId,
  Updateitem,
  Deleteitem,
} = require("./item");
const {
  GenerateAccessToken,
  DeleteRefreshToken,
  GetUserInfoByToken,
} = require("./UserToken");
const { SaveFile } = require("./File");
const {
  getCounts,
  getCustomerDeviceCount,
  getCountByDate,
} = require("./Summary");
const { SendNotification } = require("./Notification");

// ----------Exports----------
module.exports = {
  RegisterUser,
  LoginUser,
  getAllCustomers,
  GetUserById,
  GenerateAccessToken,
  DeleteRefreshToken,
  GetUserInfoByToken,
  CreateWeighingDevice,
  GetAllDeviceDetails,
  GetAllWeighingDevicesDetails,
  GetWeighingDevicesDataById,
  GetWeighingDeviceDetailsById,
  GetWeighingDevicesRecentDataById,
  UpdateWeighingDevice,
  DeleteWeighingDevice,
  CreateWeighingData,
  UpdateWeighingData,
  DeleteWeighingData,
  Createitem,
  GetAllitems,
  GetitemsByUserId,
  Updateitem,
  Deleteitem,
  SaveFile,
  getCounts,
  getCustomerDeviceCount,
  getCountByDate,
  SendNotification,
};
