const searchBox = document.getElementById('top-search')
searchBox.onsubmit = (ev) => {
  console.log('submitted top-search with', ev)
  // https://stackoverflow.com/a/26892365/1449799
  const formData = new FormData(ev.target)
  console.log(formData)
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}, ${pair[1]}`);
  }
  ev.preventDefault()
}