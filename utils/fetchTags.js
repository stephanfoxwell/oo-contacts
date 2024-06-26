async function fetchTags() { 
  const url = `/api/tags`
  const response = await fetch( `${url}` );

  if ( ! response.ok )
    throw new Error("Network response was not ok");
  
  return response.json()
}

export default fetchTags;