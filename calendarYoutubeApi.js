function formatDateString(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
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

function getLastMonthChannelStatistics(channelId) {
  const oneMonthInMillis = 1000 * 60 * 60 * 24 * 30;
  const today = new Date();
  const lastMonth = new Date(today.getTime() - oneMonthInMillis);
  const metrics = [
    'views',
    'estimatedMinutesWatched',
    'averageViewDuration',
    'subscribersGained'
  ];
  const result = YouTubeAnalytics.Reports.query({
    ids: 'channel==' + channelId,
    startDate: formatDateString(lastMonth),
    endDate: formatDateString(today),
    metrics: metrics.join(','),
    dimensions: 'day',
    sort: 'day'
  });
  if (!result.rows) {
    return [];
  }
  return result.rows.map((r) => ({
    'date': r[0],
    'views': r[1],
    'estimatedMinutesWatched': r[2],
    'averageViewDuration': r[3],
    'subscribersGained': r[4],
  }));
}

function getCalendarEventsByDate(date) {
  const results = CalendarApp.getDefaultCalendar().getEventsForDay(date);
  if (results === null) {
    return [];
  }
  return results.map(e => ({
    'title': e.getTitle(),
    'description': e.getDescription(),
    'guestList': e.getGuestList().map(guest => `${guest.getName()} - ${guest.getEmail()} - ${guest.getGuestStatus()}`),
    'ownedByMe': e.isOwnedByMe(),
    'location': e.getLocation(),
    'myStatus': e.getMyStatus().toString(),
    'startTime': e.getStartTime().toISOString(),
    'endTime': e.getEndTime().toISOString(),
  }));
}

function entrypoint() {
  // const today = new Date();
  // const events = getCalendarEventsByDate(today);
  // console.log('events', events);
  // console.log('events.length', events.length);

  const channelId = 'UCHkkpZ7unPtC9sjzIF2jD1A';

  // const videos = searchVideos('Node JS - API com json server', channelId)
  // console.log('videos', videos);
  // console.log('videos.length', videos.length);
  
  const channelStats = getLastMonthChannelStatistics(channelId)
  console.log('channelStats', channelStats);
}

function doGet(e) {
  var params = JSON.stringify(e);
  console.log('params', params);

  const { channelId } = JSON.parse(params)['parameter'];
  const channelStats = getLastMonthChannelStatistics(channelId);

  const response = {
    'data': channelStats
  };
  console.log('response', response);

  return HtmlService.createHtmlOutput(JSON.stringify(response));
}

// GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?channelId=UCHkkpZ7unPtC9sjzIF2jD1A
