//https://thecodebarbarian.com/80-20-guide-to-express-error-handling
// guter medium artikel für error handling: https://medium.com/@SigniorGratiano/express-error-handling-674bfdd86139

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
