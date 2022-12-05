const validatePage = (req, res, next) => {
  const page = req.query.page

  if (!page || +page < 1 || !Number.isInteger(+page)) {
    return res.status(400).send({
      error: 'Invalid page',
    })
  }

  req.page = page
  next()
}

module.exports = { validatePage }
