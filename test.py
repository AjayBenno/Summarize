import json
import urllib
import urllib2

APPLICATION_ID = '876cb926'
APPLICATION_KEY ='4c08897c91044cccf31d6a5aa4291036'

def call_api(endpoint, parameters):
  url = 'https://api.aylien.com/api/v1/' + endpoint
  headers = {
      "Accept":                             "application/json",
      "Content-type":                       "application/x-www-form-urlencoded",
      "X-AYLIEN-TextAPI-Application-ID":    APPLICATION_ID,
      "X-AYLIEN-TextAPI-Application-Key":   APPLICATION_KEY
  }
  opener = urllib2.build_opener()
  #print opener
  request = urllib2.Request(url, urllib.urlencode(parameters), headers)
  print request.get_selector()
  response = opener.open(request);
  return json.loads(response.read())

parameters = {"url": 'https://www.washingtonpost.com/politics/trump-blames-sanderss-supporters-for-trouble-at-his-rallies/2016/03/13/ee1e617a-e941-11e5-bc08-3e03a5b41910_story.html?hpid=hp_hp-top-table-main_campaign855p%3Ahomepage%2Fstory'}

summary = call_api("summarize", parameters)

for sums in summary["sentences"]:
  print sums,'\n'
