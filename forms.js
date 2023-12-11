function externalApiFetch() {
  const id = '12vGcsKU9SB7ZNgX1XKcpYSDkQVr0fN99qNaDUTwwB58'
  const form = FormApp.openById(id);
  // Logger.log(form);

  Logger.log('Published URL: ' + form.getPublishedUrl());

  const responses = {};
  const formResponses = form.getResponses();

  for (let i = 0; i < formResponses.length; i++) {
    const formResponse = formResponses[i];
    const email = formResponse.getRespondentEmail();
    Logger.log("email %s", email);
    responses[email] = [];
    const timestamp = formResponse.getTimestamp().toISOString();
    Logger.log("timestamp %s", timestamp);

    const itemResponses = formResponse.getGradableItemResponses();
    
    for (let j = 0; j < itemResponses.length; j++) {
      const itemResponse = itemResponses[j];
  
      Logger.log('Response #%s to the question "%s" was "%s"',
        (i + 1).toString(),
        itemResponse.getItem().getTitle(),
        itemResponse.getResponse());

      responses[email].push({
        'question': itemResponse.getItem().getTitle(),
        'anwser': itemResponse.getResponse(),
        'timestamp': timestamp,
      });
    }
  }

  Logger.log(responses);
}
