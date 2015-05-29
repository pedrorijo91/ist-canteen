import urllib
import time
import logging
import configReader
import smtplib
import json

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fileHandler = logging.FileHandler("ping.log")
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
fileHandler.setFormatter(formatter)
logging.getLogger().addHandler(fileHandler)

config = configReader.ConfigReader()

lastAns = "[]"

def is_json(myjson):
  try:
    json_object = json.loads(myjson)
  except ValueError, e:
    return False
  return True

def ping():
	url = config.read_url()
	logging.info("Ping " + url)
	data = urllib.urlopen(url).read()
	logging.info("Ans: " + data)
	return data

def notify_email():
	username = config.read_email_account()
	password = config.read_email_password()

	fromaddr = username
	toaddrs = config.read_email_dest()
	msg = "\r\n".join([
	  "From: " + fromaddr,
	  "To: " + str(toaddrs),
	  "Subject: " + config.read_email_subject(),
	  "",
	  config.read_email_body()
	  ])

	logging.info("emailing: " + str(toaddrs))

	server = smtplib.SMTP(config.read_email_server())
	server.starttls()
	server.login(username, password)
	server.sendmail(fromaddr, toaddrs, msg)
	server.quit()

	logging.info("Done emailing")

def ans_changed(ans):
	last_json = json.loads(lastAns)
	ans_json = json.loads(ans)

	sorted_last = sorted([repr(element) for element in last_json])
	sorted_ans = sorted([repr(element) for element in ans_json])

	return sorted_last != sorted_ans

def main():
	global lastAns
	
	sleepTime = int(config.read_sleep_time())

	lastAns = ping()

	while True:
		ans = ping()

		if ans_changed(ans):
			logging.info("Menu has changed!")
			notify_email()
		else:
			logging.info("Still same menu")

		lastAns = ans
		
		logging.info("Going to sleep for " + str(sleepTime) + " seconds (" + str(sleepTime/60) + " mints)")
		time.sleep(sleepTime)

main()
