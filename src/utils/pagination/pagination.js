export const paginationUtils = ({ page = 1, limit = 10, total = 0 }) => {
  const pageNum = Math.max(Number(page), 1);

  const limitNum = Math.max(Number(limit), 1);

  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,

    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
      nextPage: pageNum < Math.ceil(total / limitNum) ? pageNum + 1 : null,
      prevPage: pageNum > 1 ? pageNum - 1 : null,
    },
  };
};
