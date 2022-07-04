function callApi(url, method, headers = null){
  const options = { method, muteHttpExceptions: true, contentType: 'application/json' };
  if (headers !== null) {
    fetchOptions.headers = headers;
  }
  const response = UrlFetchApp.fetch(url, options);
  if(response.getResponseCode() != 200){
    throw new Error(response.getContentText());
  }
  return JSON.parse(response.getContentText());
}

function externalApiFetch() {
  const response = callApi('https://geo.qualaroo.com/json/', 'GET');
  // console.log(response);
  // { 
  //   ip: '',
  //   country_code: 'BR',
  //   country_name: 'Brazil',
  //   region_code: 'PR',
  //   region_name: 'Parana',
  //   city: 'Curitiba',
  //   zip_code: '',
  //   time_zone: 'America/Sao_Paulo',
  //   latitude: -00.0000,
  //   longitude: -00.0000,
  //   metro_code: 0
  // }
  const { country_code, region_code, city, time_zone } = response;
  console.log(country_code, region_code, city, time_zone);
}
