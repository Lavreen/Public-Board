from datetime import datetime
import requests

url = 'https://publicboard.herokuapp.com/app_messages/actions/'
data = {'data': 'buenos_aires', 'key': 'key'}
x = requests.post(url=url, data=data)


def print_ok(num):
    start_color = '\033[92m'
    end_color = '\033[0m'
    print(start_color + "TEST " + str(num) + " PASSED ✅" + end_color)


# testing if we get id in response
def test_resp(x):
    assert x.json()['new_id']
    print_ok(1)


# testing if we id increases
def test_id_inc(x, y):
    assert y.json()['new_id'] - x.json()['new_id'] == 1
    print_ok(2)


# testing if we get message by id
def test_id_exists(id):
    curr_url = url + str(id) + "/"
    resp = requests.get(curr_url)
    assert resp.status_code == 200
    print_ok(3)

    assert resp.json()['data'] == 'buenos_aires'
    print_ok(4)

    assert resp.json()['pub_date'] == str(datetime.date(datetime.today()))
    print_ok(5)

    assert resp.json()['key'] == 'key'
    print_ok(6)


# testing if we get more than one message
def test_more_messages_exists():
    resp = requests.get(url)
    assert len(resp.json()) > 1
    print_ok(7)


def test_put(id):
    curr_url = url + str(id) + "/"
    requests.put(curr_url, data={'data': 'bydgoszcz', 'key': 'klucz'})
    resp = requests.get(curr_url)
    assert resp.json()['data'] == 'bydgoszcz'
    print_ok(8)

    assert resp.json()['key'] == 'klucz'
    print_ok(9)


def test_id_filter(id):
    curr_url = url + "?id_filter=" + str(id)
    resp = requests.get(curr_url)
    assert len(resp.json()) == 2
    print_ok(10)


def test_today_messages():
    curr_url = url + "today_messages/"
    resp = requests.get(curr_url)
    messages = resp.json()
    messages = messages['results']
    for message in messages:
        assert message['pub_date'] == str(datetime.date(datetime.today()))

    print_ok(11)


if __name__ == "__main__":
    x = requests.post(url=url, data=data)

    test_resp(x)

    y = requests.post(url=url, data=data)

    test_id_inc(x, y)

    test_id_exists(x.json()['new_id'])

    test_more_messages_exists()

    test_put(x.json()['new_id'])

    test_id_filter(x.json()['new_id'])

    test_today_messages()