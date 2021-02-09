import os

# Heroku check
is_heroku = False
if 'IS_HEROKU' in os.environ:
    is_heroku = True

# Flask
from flask import Flask, request, render_template, jsonify

# SQL Alchemy
import sqlalchemy
from sqlalchemy import create_engine

# PyMySQL
import pymysql

# Pandas
import pandas as pd

# JSON
import json

#Joseph was here

# Import your config file(s) and variable(s)
if is_heroku == True:
    # if IS_HEROKU is found in the environment variables, then use the rest
    # NOTE: you still need to set up the IS_HEROKU environment variable on Heroku (it is not there by default)
    remote_db_endpoint = os.environ.get('remote_db_endpoint')
    remote_db_port = os.environ.get('remote_db_port')
    remote_db_name = os.environ.get('remote_db_name')
    remote_db_user = os.environ.get('remote_db_user')
    remote_db_pwd = os.environ.get('remote_db_pwd')
else:
    # use the config.py file if IS_HEROKU is not detected
    from config import remote_db_endpoint, remote_db_port, remote_db_name, remote_db_user, remote_db_pwd

# Configure MySQL connection and connect 
pymysql.install_as_MySQLdb()
engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}:{remote_db_port}/{remote_db_name}")

# Initialize Flask application
app = Flask(__name__)

# Set up your default route
@app.route('/')
def home():
    return render_template('index.html')

# set up the fantasy route
@app.route('/api/fantasy_stats')
def fantasy_stats():

    # Establish DB connection
    conn = engine.connect()
    
    query = '''
        SELECT
	        *
        FROM
            fantasy_stats
	    ORDER BY
	        SEASON DESC,
	        FPTS DESC
        '''
    
    fantasy_stats_data = pd.read_sql(query, con=conn)
    fantasy_stats_json = fantasy_stats_data.to_json(orient='records')

    conn.close()
    return fantasy_stats_json 

#setup the SB route
@app.route('/api/super_bowls')
def super_bowl_table():

    # Establish DB connection
    conn = engine.connect()
    
    query2 = '''
        SELECT
	        *,
            Year - 1 as Season
        FROM
	        super_bowl_stats;
        '''
    
    superbowl_data = pd.read_sql(query2, con=conn)
    superbowl_data_json = superbowl_data.to_json(orient='records')

    conn.close()
    return superbowl_data_json 


#setup the SB route
@app.route('/api/fantasy_stats_summary')
def fantasy_stats_summary():

    # Establish DB connection
    conn = engine.connect()
    
    query = '''
        SELECT
            *
        FROM
            fantasy_stats_summary
    '''
    
    fantasy_stats_df = pd.read_sql(query, con=conn)
    fantasy_stats_json = fantasy_stats_df.to_json(orient='records')

    conn.close()
    return fantasy_stats_json

#setup the player avgs route
@app.route('/api/super_bowl_fantasy_player_avgs')
def super_bowl_fantasy_player_avgs():

    # Establish DB connection
    conn = engine.connect()
    
    query = '''
        SELECT
            *
        FROM
            super_bowl_fantasy_avg_fpts_comparison
    '''
    
    fantasy_stats_df = pd.read_sql(query, con=conn)
    fantasy_stats_json = fantasy_stats_df.to_json(orient='records')

    conn.close()
    return fantasy_stats_json


#setup the player avgs route
@app.route('/api/fantasy_avg_season_performance')
def fantasy_above_average_players():

    # Establish DB connection
    conn = engine.connect()
    
    query = '''
        SELECT
            *
        FROM
            fantasy_avg_season_performance
    '''
    
    fantasy_stats_df = pd.read_sql(query, con=conn)
    fantasy_stats_json = fantasy_stats_df.to_json(orient='records')

    conn.close()
    return fantasy_stats_json





#setup the SB route
@app.route('/api/combined_table')
def combined_df():

    # Establish DB connection
    conn = engine.connect()
    
    query = '''
        SELECT
	        *
        FROM
            fantasy_stats
        INNER JOIN
            super_bowl_stats
        ON
            super_bowl_stats.Season = fantasy_stats.season
        '''
    
    combined_df = pd.read_sql(query, con=conn)
    combined_json = combined_df.to_json(orient='records')

    conn.close()
    return combined_json 

if __name__ == "__main__":
    app.run(debug=True)