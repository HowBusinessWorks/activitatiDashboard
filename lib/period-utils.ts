/**
 * Utility functions for 21-to-21 month periods
 */

export interface Period {
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  label: string // "Oct 21 - Nov 21"
}

const MONTHS_RO = [
  "ianuarie",
  "februarie",
  "martie",
  "aprilie",
  "mai",
  "iunie",
  "iulie",
  "august",
  "septembrie",
  "octombrie",
  "noiembrie",
  "decembrie",
]

const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/**
 * Get the period that contains the given date
 * Returns the period where startDate is on the 21st and endDate is on the 20th of next month
 */
export function getPeriodForDate(date: Date): Period {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  let startMonth = month
  let startYear = year
  let endMonth = month + 1
  let endYear = year

  // If we're before the 21st of current month, the period started last month
  if (day < 21) {
    startMonth = month - 1
    startYear = month === 0 ? year - 1 : year
    endMonth = month
    endYear = year
  } else {
    // We're on or after the 21st, period ends next month on the 20th
    endMonth = month + 1
    endYear = month === 11 ? year + 1 : year
  }

  // Normalize months
  if (startMonth < 0) startMonth = 11
  if (endMonth > 11) endMonth = 0

  const startDate = `${startYear}-${String(startMonth + 1).padStart(2, "0")}-21`
  const endDate = `${endYear}-${String(endMonth + 1).padStart(2, "0")}-20`

  const startMonthName = MONTHS_EN[startMonth]
  const endMonthName = MONTHS_EN[endMonth]

  const label = `${startMonthName} 21 - ${endMonthName} 20`

  return {
    startDate,
    endDate,
    label,
  }
}

/**
 * Get all available periods from a given date going backwards
 * Returns periods sorted from oldest to newest
 */
export function getAvailablePeriods(fromDate: Date, count: number = 12): Period[] {
  const periods: Period[] = []
  let currentDate = new Date(fromDate)

  for (let i = 0; i < count; i++) {
    const period = getPeriodForDate(currentDate)
    periods.unshift(period)

    // Move to previous period (go back to the 21st of previous month)
    currentDate.setMonth(currentDate.getMonth() - 1)
    currentDate.setDate(21)
  }

  return periods
}

/**
 * Get the last 3 periods ending with the period that contains the given date
 */
export function getLastThreePeriods(toDate: Date): Period[] {
  const currentPeriod = getPeriodForDate(toDate)
  const periods: Period[] = [currentPeriod]

  let date = new Date(toDate)
  for (let i = 0; i < 2; i++) {
    date.setMonth(date.getMonth() - 1)
    periods.unshift(getPeriodForDate(date))
  }

  return periods
}

/**
 * Get the previous period relative to a given period
 */
export function getPreviousPeriod(period: Period): Period {
  const startDate = new Date(period.startDate)
  startDate.setMonth(startDate.getMonth() - 1)
  return getPeriodForDate(startDate)
}

/**
 * Get the next period relative to a given period
 */
export function getNextPeriod(period: Period): Period {
  const endDate = new Date(period.endDate)
  endDate.setMonth(endDate.getMonth() + 1)
  return getPeriodForDate(endDate)
}
