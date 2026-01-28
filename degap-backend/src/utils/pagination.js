/**
 * Simple pagination helper that normalizes page/limit
 * and returns skip/limit + metadata.
 */

function getPaginationParams(query, { defaultPage = 1, defaultLimit = 10 } = {}) {
  const page = Number.parseInt(query.page, 10) || defaultPage;
  const limit = Number.parseInt(query.limit, 10) || defaultLimit;

  const safePage = page < 1 ? 1 : page;
  const safeLimit = limit < 1 ? defaultLimit : limit;

  const skip = (safePage - 1) * safeLimit;

  return {
    page: safePage,
    limit: safeLimit,
    skip,
  };
}

function buildPaginationMeta({ page, limit, total }) {
  const pages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    pages,
  };
}

module.exports = {
  getPaginationParams,
  buildPaginationMeta,
};

