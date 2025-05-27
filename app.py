from flask import Flask, render_template, request
import requests

app = Flask(__name__)
#!Generate the API key from openweathermap.org
#!Then replace the API Key below with your own
API_KEY = '#Replace this' 

@app.route('/', methods=['GET', 'POST'])
def index():
    weather = None
    error = None

    if request.method == 'POST':
        city = request.form.get('city')
        if city:
            url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
            try:
                response = requests.get(url)
                data = response.json()
                if response.status_code == 200:
                    weather = {
                        'city': city.title(),
                        'temperature': round(data['main']['temp'], 1), #!Temperature generated in celsius
                        'description': data['weather'][0]['description'].title(), #!Choosing the weather description
                        'icon': data['weather'][0]['icon'], #!Making the weather icon
                        'main': data['weather'][0]['main'],  #!Checking for the weather type
                        'local_time': data['dt'] + data['timezone'] #!Checking for the time of day
                    }
                else:
                    #!General error handling for city not being found or other issues based off of that.
                    error = data.get("message", "City not found.")
            except requests.exceptions.RequestException as e:
                error = "API request failed: " + str(e)
        else:
            error = "Please enter a city name."

    return render_template('index.html', weather=weather, error=error)

if __name__ == '__main__':
    app.run(debug=True)
