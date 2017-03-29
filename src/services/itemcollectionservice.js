const DateDiff = require('../lib/datediff')

function sortItemDate (a, b) {
  const diff = Date.parse(b.created_on) - Date.parse(a.created_on)
  if (diff > 0) {
    return 1
  } else if (diff < 0) {
    return -1
  }
  return 0
}

function getTimeSinceLastAddedItem (items) {
  // filter invalid dates and Sort the item by date
  const sorted = items
    .filter(item => (item.created_on && Date.parse(item.created_on)))
    .sort(sortItemDate)

  if (sorted.length === 0) return null

  // Figure out how long sinse now for the latest item
  const now = new Date().toISOString().substring(0, 10)
  const shortCreated = sorted[0].created_on.substring(0, 10)

  const [amount, unit] = DateDiff.timeDiffHuman(shortCreated, now).split(' ')
  return { amount, unit }
}

function getItemsAddedInLastYear (items) {
  const then = new Date().getTime() - DateDiff.YEAR
  return items.filter(item => (item.created_on && Date.parse(item.created_on) >= then))
}

module.exports = {
  getTimeSinceLastAddedItem,
  getItemsAddedInLastYear
}
