# Import General Packages
import os

import pandas as pd
import flask
from flask import request
from flask_restful import abort
from flask_cors import CORS
import csv

# Import Machine Learning Packages
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

app = flask.Flask(__name__)
app.config["DEBUG"] = True

# Allow cross-origin
CORS(app)
cors = CORS(app, resources={
    r"/": {
        "origins": "*"
    }
})

# Load the dataset csv file
csv_data = pd.read_csv("dataset.csv")

# Import & use the customized tokenizer function
global vectorizer
vectorizer = TfidfVectorizer()
global train_needed
train_needed = None
global model
global email_url
global prediction


# Function to train the Machine Learning model
@app.route('/', methods=['POST'])  # create the API using flask and get the / route
def train_model():
    print("===== train_model function is started =====")
    global vectorizer
    global train_needed
    global model
    browser_url_array = []
    global email_url
    global prediction
    prediction = ""
    print("train_needed: ", train_needed)
    browser_url = str(request.json['browser_url'])

    # this functions starts if the model is not trained before or the URL
    # which is coming from the front-end is null
    if train_needed is None or browser_url == "":
        Y = csv_data["label"]
        X = csv_data["url"]

        # Store the vectorized data into X variable
        X = vectorizer.fit_transform(X)

        # Split data into training and test sets (8:2 ratio)
        # random_state: Random start point of the data training process
        X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=20)

        # Fit data into the Machine Learning model
        # Limit the iterations to 1000
        # So that the algorithm will not rotate without getting any answer
        model = LogisticRegression(max_iter=1000)
        model.fit(X_train, Y_train)

        # Generate the accuracy of the model
        accuracy = (model.score(X_test, Y_test) * 100)

        # save the trained model into a pickle file
        # joblib.dump(model, 'TrainedModel.pkl')
        # pickle.dump(model, open('model.pkl', 'wb'))

        print("Model trained successfully")
        print("Accuracy: ", accuracy)
        train_needed = False
        email_url = ""

        obj = {
            "status": "success",
            "prediction": "trained"
        }
        return obj

    else:
        if not request.json:  # if parameters not exists return 400 error
            abort(400)

        # get the input values
        browser_url = str(request.json['browser_url'])

        browser_url_array.append(browser_url)
        print(browser_url_array)

        whitelisted_status = check_white_listed(browser_url)

        # if true
        if whitelisted_status:
            print("The URL's domain is white listed")
            prediction = "good"

        else:
            print("The URL's domain is NOT white listed")
            browser_url_array = vectorizer.transform(browser_url_array)
            prediction = model.predict(browser_url_array)
            prediction = prediction[0]

        print("Pred: ", prediction)

        obj = {
            "status": "success",
            "prediction": prediction
        }

        # calling store_history() to store the results in a text file
        store_history(browser_url, prediction)
        email_url = browser_url

        return obj


# Email links checker
# this function is used to check links in Emails
@app.route('/email', methods=['POST'])
def prediction_for_emails():
    print("===== prediction_for_emails function is starting =====")

    # clear the content in the email:report.txt file
    # it clears the previous data before writing new data into it
    open('email_report.txt', 'w').close()
    print("Previous email report data cleared successfully")

    global model
    email_report_array = []
    global email_url
    is_email = "web"
    final_email_status = "good"

    try:
        # check whether the current browser tab is in an email domain
        email_url = domain_breaker(email_url)
        if email_url == "mail.google.com":
            is_email = "email"

        email_urls = str(request.json['email_urls'])

        # remove special characters by replacing ""
        # and separate urls by the comma (",")
        seperated_email_urls = email_urls.replace("[", "").replace("]", "").replace("'", "").split(",")

        for i in range(len(seperated_email_urls)):
            whitelisted_status = check_white_listed(seperated_email_urls[i])

            # if whitelisted
            if whitelisted_status:
                prediction = "good"

            else:
                email_url_array = []
                email_url_array.append(seperated_email_urls[i])
                email_url_array = vectorizer.transform(email_url_array)
                prediction = model.predict(email_url_array)
                prediction = prediction[0]

                if prediction == "bad":
                    final_email_status = "bad"

            domain_of_url = domain_breaker(seperated_email_urls[i])
            email_report_array.append([domain_of_url, prediction])

        # write email urls into a txt file
        # Open the file for writing
        # only writes if only an email domain
        if is_email == "email":
            with open('email_report.txt', 'a') as f:

                for j in range(len(email_report_array)):
                    f.write("" + email_report_array[j][0] + "," + email_report_array[j][1])
                    f.write('\n')
            f.close()

            print("email report success")

        obj = {
            "status": "success",
            "prediction": final_email_status,
            "is_email": is_email
        }

    except Exception as ex:
        print(ex)
        obj = {
            "status": "failed",
            "prediction": final_email_status,
            "is_email": is_email
        }
    read_email_report()
    print(obj)
    return obj


# function to get email report
# this function read all the values inside the emil_report.txt file and
# send them to the front end application
@app.route('/email/report', methods=['GET'])
def read_email_report():
    print("===== read_email_report function is running =====")
    # report_data = []
    #
    # try:
    #     # reading the text file
    #     with open('email_report.txt', 'r') as f:
    #         # add all the details in the text file to an array
    #         for line in f:
    #             # adding line by line into the array
    #             line = line.rstrip('\n')
    #             url = line.split(",")[0]
    #             status = line.split(",")[1]
    #             report_data.append([url, status])

    try:
        report_data = []
        status_array = []

        # reading the text file
        with open('email_report.txt', 'r') as f:
            # add all the details in the text file to an array
            for line in f:
                # adding line by line into the array
                line = line.rstrip('\n')
                status_in_line = line.rstrip('\n').split(',')[1]
                report_data.append(line)
                status_array.append(status_in_line)

            print(report_data)

            obj = {
                "status": "success",
                "report": report_data
            }
    except Exception as ex:
        obj = {
            "status": "failed",
            "report": report_data
        }
    return obj


# This function is used to check whether url domain is white-listed
def check_white_listed(browser_url):
    print("===== check_white_listed function is running =====")

    try:
        domain = domain_breaker(browser_url)
        whitelisted_status = False

        # read the domains.txt file
        file = open("whitelist.txt", "r")
        white_list = file.read().split()

        for i in white_list:
            if i == domain:
                print("the domain is whitelisted")
                whitelisted_status = True
                break
    except:
        whitelisted_status = False

    return whitelisted_status


# This function is used to extract domains from the browser URL
def domain_breaker(browser_url):
    # read the domains.txt file
    file = open("domains.txt", "r")
    domain_list = file.read().split()
    similar_domain_count = 0
    get_last_similar_domain = ""

    for i in domain_list:
        # convert to simple letters
        i = i.lower()

        # adding a "." to the starting of the domain
        i_dot = "." + i

        # check whether the domain is available in the given URL
        availability = i_dot in browser_url

        # varify other validations if available
        if availability:
            get_last_similar_domain = i_dot

            if i_dot == ".co":
                # similar_domain_count += 1
                get_last_similar_domain = i_dot
                continue
            else:
                break

    # get the tailing part of domain in the URL
    final_url1 = browser_url.split(get_last_similar_domain)
    final_url2 = final_url1[0] + get_last_similar_domain

    # get the starting part of domain in the URL
    final_url3 = final_url2.split("://")
    final_url4 = final_url3[1]

    return final_url4


# function to store predicted history in a text file
def store_history(browser_url, prediction):
    print("===== store_history function is starting =====")
    domain = domain_breaker(browser_url)

    obj = {
        "domain": domain,
        "prediction": prediction
    }

    # writing into a text file
    # Open the file for writing
    with open('report.txt', 'a') as f:
        f.write("" + domain + "," + prediction)
        f.write('\n')
        f.close()

    print("report success")
    return obj


# function to get report data
@app.route('/report', methods=['GET'])  # create the API using flask and get the / route
def get_report():
    print("===== get_report function is working =====")
    report_data = []
    status_array = []

    # reading the text file
    with open('report.txt', 'r') as f:
        # add all the details in the text file to an array
        for line in f:
            # adding line by line into the array
            line = line.rstrip('\n')
            status_in_line = line.rstrip('\n').split(',')[1]
            report_data.append(line)
            status_array.append(status_in_line)

    # add total count of good & bad statuses into variables
    good_status_count = status_array.count("good")
    bad_status_count = status_array.count("bad")
    total_status_count = good_status_count + bad_status_count

    print("good_status_count : ", good_status_count)
    print("bad_status_count : ", bad_status_count)
    print("total_status_count : ", total_status_count)

    # only return last 10 report data
    obj = {
        "status": "success",
        "report": report_data[-10:],
        "good_status_count": good_status_count,
        "bad_status_count": bad_status_count,
        "total_status_count": total_status_count
    }

    return obj


# function to grow the dataset automatically and
# get the current dataset size and send to the front end
@app.route('/dataset/grow', methods=['POST'])
def grow_dataset():
    print("===== grow_dataset function is running =====")
    global prediction
    browser_url = str(request.json['browser_url'])

    try:
        if browser_url != "":
            # insert data into the dataset.csv file
            with open('dataset.csv', 'a', newline='', encoding="utf8") as csvfile:
                # creating a csv dict writer object
                row = [str(browser_url), str(prediction)]
                writer = csv.writer(csvfile)
                writer.writerow(row)
                print("Dataset grown successfully")

        # Read the CSV file into a pandas DataFrame object
        df = pd.read_csv('dataset.csv')

        # Get the number of lines in the CSV file
        num_lines = df.shape[0]

        obj = {
            "status": "success",
            "size": num_lines
        }
        return obj

    except Exception as ex:
        obj = {
            "status": "failed",
            "size": 0
        }
        print(ex)
        return obj


# function add data into whitelist.txt file
@app.route('/whitelist/add', methods=['POST'])
def add_to_white_list():
    print("===== add_to_white_list function is running =====")
    browser_url = str(request.json['browser_url'])

    try:
        if browser_url != "":
            domain = domain_breaker(browser_url)
            with open('whitelist.txt', 'a', newline='') as textFile:
                # creating a csv dict writer object
                row = [domain]
                writer = csv.writer(textFile)
                writer.writerow(row)
                print("Dataset grown successfully")

        else:
            print("Url is null. Whitelist function failed!")

        obj = {
            "status": "success",
        }
    except Exception as ex:
        print("Whitelist function failed!")
        print(ex)

        obj = {
            "status": "failed",
        }

    return obj


# the back-end application is running on port '5000'
app.run(port=5001)
