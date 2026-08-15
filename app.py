from flask import Flask, render_template, jsonify
import sqlite3
import json
import os
from decimal import Decimal

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), 'scenic.db')

def convert_decimals(obj):
    """将 Decimal 类型转换为 float"""
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_decimals(item) for item in obj]
    return obj

@app.route('/')
def index():
    data_json = '[]'
    connection = None
    
    try:
        connection = sqlite3.connect(DB_PATH)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        cursor.execute("SELECT name, city, rating, review_count, ticket_price, scenic_type FROM scenic")
        data = [dict(row) for row in cursor.fetchall()]
        print(f"✅ 获取 {len(data)} 条数据")
        
        data_converted = convert_decimals(data)
        data_json = json.dumps(data_converted, ensure_ascii=False, separators=(',', ':'))
    except Exception as e:
        print(f"❌ 数据库错误: {e}")
    finally:
        if connection:
            connection.close()
    
    return render_template('index.html', data_json=data_json)

@app.route('/api/data')
def api_data():
    connection = None
    try:
        connection = sqlite3.connect(DB_PATH)
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM scenic LIMIT 5")
        data = [dict(row) for row in cursor.fetchall()]
        data_converted = convert_decimals(data)
        return jsonify({"status": "success", "count": len(data), "data": data_converted})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    finally:
        if connection:
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
