async function fetchContacts( filters, pageIndex = 1, limit = 100 ) {
  const params = new URLSearchParams(filters).toString();
  const url = `/api/contacts?${params}`;
  console.log(url)

  const response = await fetch( `${url}&page=${pageIndex}&limit=${limit}` )

  if ( ! response.ok )
    throw new Error("Network response was not ok")
  
  return response.json()
}

export default fetchContacts;