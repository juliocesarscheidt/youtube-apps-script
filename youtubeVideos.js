function getChannelInfo() {
  const response = YouTube.Channels.list('snippet,contentDetails,statistics', {'mine': true});
  const [channel] = response.items;
  return channel;
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
  const updatedTitle = originalTitle + ' - updated ' + new Date().toLocaleString();
  console.log('updatedTitle', updatedTitle);

  const resource = {
    snippet: {
      title: updatedTitle,
      description: description,
      categoryId,
    },
    id: videoId
  };
  console.log('resource', resource);

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
  const { id, title, description } = video;

  console.log('id', id);
  console.log('title', title);
  console.log('description', description);

  updateVideo(id, title, description, categoryId);
}