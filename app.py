# 1. import Flask
from flask import Flask

# 2. Create an app, being sure to pass __name__
app = Flask(__name__)

# 3. Define what to do when a user hits the index route
@app.route("/")
def home():
    return  render_template('index.html')

app.route('/api/super_bowls')
def super_bowl_table():

    # Establish DB connection
    conn = engine.connect()
    
    query2 = '''
        SELECT
	        *
        FROM
            super_bowl_table
        '''
    
    superbowl_data = pd.read_sql(query2, con=conn)
    superbowl_data_json = superbowl_data.to_json(orient='records')

    conn.close()
    return superbowl_data_json 

if __name__ == "__main__":
    app.run(debug=True)