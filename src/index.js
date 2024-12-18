const express = require("express");
const app = express();
app.use(express.json());

const router = express.Router();

//catchAsync function to handle the response and error
function catchAsync(fn) {
  return function (req, res, next) {
    try {
      fn(req, res, next);
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  };
}

//Error constructor
class ApiError extends Error {
  constructor(message, arg1, arg2) {
    super(message);
    this.arg1 = arg1;
    this.arg2 = arg2;
  }
}

//create controller
// const controller = catchAsync((req, res) => {
//   console.log("base");
//   throw new ApiError("dummy error!", "base error", "custom error");
//   res.send({ message: "base url!" });
// });

const controller = catchAsync((req, res) => {
  console.log("base");
  throw new ApiError("error1", "err2", "err3");
  res.send({ message: "base url" });
});

router.get("/base", controller);

app.use("/v1", router);

const errorHandler = (err, req, res, next) => {
  console.log("From error middleware", err.message);
  res.status(500).send({ ...err, message: err.message });
};

app.use(errorHandler);

app.listen(3000, () => {
  console.log("server running...");
});
