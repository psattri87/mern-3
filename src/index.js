// Target: Handling error
// 1. import express
const express = require("express");
//2. initialize express as app
const app = express();
//3. parse express json to app
app.use(express.json());
//4. create express router
const router = express.Router();
//5. catchAsync function to handle the errors
function catchAsync(fn) {
  return function (req, res, next) {
    try {
      fn(req, res);
    } catch (error) {
      next(error);
    }
  };
}
//6. ApiError constructor
class ApiError extends Error {
  constructor(message, arg1, arg2) {
    super(message);
    this.arg1 = arg1;
    this.arg2 = arg2;
  }
}
//7. create controller
const controller = catchAsync((req, res) => {
  console.log("inside controller");
  throw new ApiError("error message content", "error-1", "error-2");
  res.send({ message: "response from controller" });
});

//7. initialize get request on "/base" route
router.get("/base", controller);

//8. define a callback function to handle the error
const errorHandler = (err, req, res, next) => {
  console.log("From error middleware", err.message);
  res.status(500).send({ ...err, message: err.message });
};

//9. define a route
app.use("/v1", router, errorHandler);

//11. start the server
app.listen(3000, () => {
  console.log("server running");
});
