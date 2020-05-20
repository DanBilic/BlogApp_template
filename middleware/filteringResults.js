const filteringResults = (model, populate) => async (req, res, next) => {
  let query;
  console.log(req.query);

  //copy query
  const reqQuery = { ...req.query };

  //fields excluded from query
  const fieldsToExclude = ["select", "sort", "page", "limit"];

  //loop over fieldsToExclude and remove them from reqQuery
  fieldsToExclude.forEach((element) => delete reqQuery[element]);
  console.log(reqQuery);

  //query to JSON
  let queryString = JSON.stringify(reqQuery);

  //create operator (gt, gte, lt, lte...)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //posts is the virtual attribute og the model
  query = model.find(JSON.parse(queryString));

  //SELECT field
  //deswegen wurde das req.query objekt kopiert
  //die selct werte werden mit komma aneinandergehängt -> select=name, description
  if (req.query.select) {
    //split entfernt ',' aus einem strinf und gibt ein array zurück die die elemnte des strings enthalten die mit komma getrennt wurden
    const fields = req.query.select.split(",").join(" "); //->join fügt das array zu einem string zusammen getrennt durch das zeichen das als paramter übergeben wurde

    query = query.select(fields);
  }

  //SORT
  if (req.query.sort) {
    const sorting = req.query.sort.split(",").join(" ");
    query = query.sort(sorting);
  } else {
    // - singnalisiert abscteigen nach cretedAt sortieren und + bedeutet aufsteigen
    query = query.sort("-createdAt");
  }

  //PAGINATION
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //POPULATE
  if (populate) {
    query.populate(populate);
  }

  //execute query
  const results = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.filteredResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = filteringResults;
