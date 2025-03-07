export async function loadData(category, publisher, series, vol) {
  const path = `articles/${category}/${publisher}/${series}-${vol}.json`;
  // console.log(path)
  return await fetch(path).then(res => res.json())
}
