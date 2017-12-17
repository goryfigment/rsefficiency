from django.shortcuts import render
from rsefficiency.modules.base import get_base_url
import json
import os
from django.http import HttpResponse


def quest_index(request):
    try:
        file_path = os.path.join(os.path.dirname(__file__), 'static_data/member_quests.json')
        member_quests = json.loads(open(file_path).read())
    except:
        data = {'success': False, 'error_id': 2, 'error_msg:': 'IO Error', 'directory': file_path}
        return HttpResponse(json.dumps(data), 'application/json')

    try:
        file_path = os.path.join(os.path.dirname(__file__), 'static_data/f2p_quests.json')
        f2p_quests = json.loads(open(file_path).read())
    except:
        data = {'success': False, 'error_id': 2, 'error_msg:': 'IO Error', 'directory': file_path}
        return HttpResponse(json.dumps(data), 'application/json')

    data = {
        'base_url': get_base_url(),
        'f2p_quests': json.dumps(f2p_quests),
        'member_quests': json.dumps(member_quests),
        'quest': {}
    }

    return render(request, 'quest.html', data)


def quest(request, quest_name):
    try:
        file_path = os.path.join(os.path.dirname(__file__), 'static_data/quests.json')
        quests = json.loads(open(file_path).read())
    except:
        data = {'success': False, 'error_id': 2, 'error_msg:': 'IO Error', 'directory': file_path}
        return HttpResponse(json.dumps(data), 'application/json')

    quest_data_name = quest_name.strip().lower().replace('-', '_')

    if quest_data_name in quests:
        data = {
            'base_url': get_base_url(),
            'f2p_quests': {},
            'member_quests': {},
            'quest': json.dumps(quests[quest_data_name])
        }

        return render(request, 'quest.html', data)
    else:
        print 'fk u'
        html = 'quests/' + quest_data_name + '.html'
        return render(request, html)
