function callApi(url, method, headers = null){
  const options = { method, muteHttpExceptions: true, contentType: "application/json" };
  if (headers !== null) {
    fetchOptions.headers = headers;
  }
  const response = UrlFetchApp.fetch(url, options);
  if(response.getResponseCode() != 200){
    throw new Error(response.getContentText());
  }
  return JSON.parse(response.getContentText());
}

function searchVideos(query, channelId, maxResults = 10) {
  const results = YouTube.Search.list('id,snippet', {
    channelId,
    q: query,
    maxResults,
  });
  if (results === null) {
    return [];
  }
  return results.items.map((item)=> ({
    'id': item.id.videoId,
    'title': item.snippet.title,
    'description': item.snippet.description,
  }));
}

function getChannelInfo() {
  const response = YouTube.Channels.list('snippet,contentDetails,statistics', {'mine': true});
  const [channel] = response.items;
  return channel;
}

function listVideoCategories() {
  const response = YouTube.VideoCategories.list('id,snippet', {
    hl: 'en_US',
    regionCode: 'BR'
  });
  const categories = response.items;
  return categories.map((category) => ({'id': category.id, 'title': category.snippet.title}));
}

function updateVideo(videoId, title, description, categoryId) {
  const originalTitle = title.replace(/\s-\supdated.*/gi, '');
  console.log('originalTitle', originalTitle);

  // max length = 100 characters
  const updatedTitle = title + ' - updated ' + new Date().toLocaleString();
  console.log('updatedTitle', updatedTitle);

  // const oldTitle = updatedTitle.replace(/\s-\supdated.*/gi, '');
  // console.log('oldTitle', oldTitle);

  const resource = {
    snippet: {
      title: updatedTitle,
      description: description,
      categoryId,
    },
    id: videoId
  };
  YouTube.Videos.update(resource, 'id,snippet');
}

function youtubeApiFetch() {
  const channel = getChannelInfo();
  console.log('channel', channel);
  const channelId = channel.id;

  const categories = listVideoCategories();
  console.log('categories', categories);

  const category = categories.find(category => category.title === 'Science & Technology'); // 28 - Science & Technology
  console.log('category', category);
  const categoryId = category.id;

  const videos = searchVideos('Node JS - API com json server', channelId);
  console.log('videos', videos);

  const video = videos[0];
  const videoId = video.id;
  const videoTitle = video.title;
  const videoDescription = video.description;

  console.log('videoId', videoId);
  console.log('videoTitle', videoTitle);
  console.log('videoDescription', videoDescription);

  updateVideo(videoId, videoTitle, videoDescription, categoryId);
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
