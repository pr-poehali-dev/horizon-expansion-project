"""
Чтение и запись прайс-листа Сталь Групп из таблицы price_list.
GET  /  — возвращает все пары key/value
POST /  — принимает JSON {key: value, ...} и обновляет указанные поля
"""
import json
import os
import psycopg2


CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute('SELECT key, value FROM price_list ORDER BY key')
        rows = cur.fetchall()
        cur.close()
        conn.close()
        prices = {row[0]: float(row[1]) for row in rows}
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps(prices),
        }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        conn = get_conn()
        cur = conn.cursor()
        for key, value in body.items():
            cur.execute(
                'UPDATE price_list SET value = %s WHERE key = %s',
                (float(value), str(key)),
            )
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**CORS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}),
        }

    return {'statusCode': 405, 'headers': CORS, 'body': 'Method Not Allowed'}
