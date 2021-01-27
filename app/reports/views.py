from django.shortcuts import render
from django.views import generic
from django.views.decorators.csrf import csrf_exempt
from . import models as myModels
from django.http import JsonResponse
from . import utils
import nltk

nltk.downloader.download('vader_lexicon')


class SingleReport(generic.DetailView):
    model = myModels.Report


class ListReports(generic.ListView):
    model = myModels.Report

    def get_queryset(self):
        return myModels.Report.objects.filter(user=self.request.user)


@csrf_exempt
def create_report(request):
    user = request.user
    name = request.POST.get('name')
    keyword = request.POST.get('keyword')
    language = request.POST.get('language')
    time_interval = request.POST.get('start') + " / " + request.POST.get('end')
    myReport = ''
    reports = myModels.Report.objects.filter(name=name, user=user)
    if reports is not None and len(reports) > 0:
        myReport = reports[0]

    if myReport == '':
        myReport = myModels.Report.objects.create(name=name, time_interval=time_interval, keyword=keyword, user=user,
                                                  language=language)
    if myReport is None:  # report could not saved
        temp_result = {'data': "report could not saved"}
        return JsonResponse(temp_result, safe=False)

    return JsonResponse("report is created", safe=False)


@csrf_exempt
def collect_tweets(request):
    user = request.user
    name = request.POST.get('name')
    keyword = request.POST.get('keyword')
    language = request.POST.get('language')
    start_date = request.POST.get('start')
    end_date = request.POST.get('end')
    count = request.POST.get('count')
    myReport = ''
    reports = myModels.Report.objects.filter(name=name, user=user)
    if reports is not None and len(reports) > 0:
        myReport = reports[0]

    if myReport is None:  # report could not saved
        temp_result = {'data': "report could not saved"}
        return JsonResponse(temp_result, safe=False)

    print("starting..")
    utils.get_tweets_via_tweepy(myReport, keyword, language, start_date, end_date, count)
    print("finishing..")
    return JsonResponse(start_date, safe=False)


def report_collect_tweet(request):
    return render(request, 'reports/report_collect_tweet.html')


@csrf_exempt
def get_tweets(request):
    name = request.POST.get('name')
    reports = myModels.Report.objects.filter(name=name, user=request.user)
    tweets = myModels.Tweet.objects.filter(report=reports[0])
    myReport = reports[0]
    myReport.tweet_count = str(len(tweets))
    myReport.save(update_fields=['tweet_count'])
    tweets_t = [
        [tw.tweet_id, tw.creation_date, tw.tweet_text, tw.lang, tw.retweet_count,
         tw.like_count, tw.hashtag_string, tw.context_domain_string, tw.context_entity_string, tw.sentiment] for tw in
        tweets]
    tweets_t = {'data': tweets_t}

    return JsonResponse(tweets_t, safe=False)


@csrf_exempt
def analyze_tweets(request):
    name = request.POST.get('name')
    reports = myModels.Report.objects.filter(name=name, user=request.user)
    tweets = myModels.Tweet.objects.filter(report=reports[0])
    for tw in tweets:
        print(tw.tweet_id)
        sentiment = utils.get_sentiment(tw.tweet_text)
        tw.sentiment = sentiment
        tw.save(update_fields=['sentiment'])

    return JsonResponse('ok', safe=False)


@csrf_exempt
def draw_charts(request):
    name = request.POST.get('name')
    reports = myModels.Report.objects.filter(name=name, user=request.user)
    tweets = myModels.Tweet.objects.filter(report=reports[0])
    positive = 0
    negative = 0
    neutral = 0
    for tw in tweets:
        if tw.sentiment == 'positive':
            positive += 1
        elif tw.sentiment == 'negative':
            negative += 1
        else:
            neutral += 1

    sentiment_graph_object = [['positive', positive],
                              ['negative', negative],
                              ['neutral', neutral], ]

    sentiment_graph_object = {'data': sentiment_graph_object}

    return JsonResponse(sentiment_graph_object, safe=False)
