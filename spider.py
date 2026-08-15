import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

df = pd.read_csv(os.path.join(BASE_DIR, "data", "scenic_data.csv"), encoding="utf-8-sig")

print("===== 数据读取结果 =====")
print("数据行数:", len(df))
print("列名:", df.columns.tolist())
print()

print("===== 前5条数据 =====")
print(df.head())
print()

print("===== 各景区类型数量 =====")
print(df["景区类型"].value_counts())
print()

print("===== 评分统计 =====")
print(df["评分"].describe())
print()

print("===== 各城市景区数量 =====")
print(df["城市"].value_counts())
print()

print("===== 门票价格统计 =====")
print(df["门票价格"].describe())
