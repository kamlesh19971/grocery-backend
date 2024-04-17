exports.pagination = ({
  page = 0,
  perPage = 20,
  sortField,
  sortOrder = -1,
}) => {
  let result = [];

  if (sortField) {
    result.push({ $sort: { [sortField]: sortOrder } });
  }

  result.push({ $skip: parseInt(page) * parseInt(perPage) });
  result.push({ $limit: parseInt(perPage) });

  console.log(result);
  return result;
};
