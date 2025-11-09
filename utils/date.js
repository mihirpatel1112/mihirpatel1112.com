export function sortListDateLatest(list, dateProp) {
  return list.sort((a, b) => {
    const dateStrA = a[dateProp];
    const dateStrB = b[dateProp];

    // DD/MM/YYYY format
    const [dayA, monthA, yearA] = dateStrA.split("/").map(Number);
    const [dayB, monthB, yearB] = dateStrB.split("/").map(Number);

    // Creating date objects
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    // Sorting latest first (descending)
    return dateB.getTime() - dateA.getTime();
  });
}

export function breakListIntoYears(list, dateProp) {
  const yearGroups = {};

  list.forEach((item) => {
    const dateStr = item[dateProp];
    // DD/MM/YYYY format
    const [day, month, year] = dateStr.split("/").map(Number);

    if (!yearGroups[year]) {
      yearGroups[year] = [];
    }
    yearGroups[year].push(item);
  });

  // Convert to array of objects with year and items
  return Object.keys(yearGroups)
    .sort((a, b) => Number(b) - Number(a)) // Sort years descending (latest first)
    .map((year) => ({
      year: year,
      items: yearGroups[year],
    }));
}
