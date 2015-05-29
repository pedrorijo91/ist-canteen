import ConfigParser

class ConfigReader(object):

	DEFAULT_SLEEP_TIME = 5

	DEFAULT_EMAIL_SUBJECT = "Website has changed "
	DEFAULT_EMAIL_BODY = "The website you've subscribed has changed, check it out"
	RECEIVERS_DELIMITER = ","

	def __init__(self):
		self.config = ConfigParser.ConfigParser()
		self.config.read("config.ini")

	def read_sleep_time(self): #seconds
		if self.config.has_option('time', 'sleep_time'):
			return self.config.getfloat('time', 'sleep_time')
		else:
			return DEFAULT_TIME_SLEEP

	def read_url(self):
		return self.config.get('host', 'url')

	def read_email_server(self):
		return self.config.get('email', 'server')


	def read_email_account(self):
		return self.config.get('email', 'account')

	def read_email_password(self):
		return self.config.get('email', 'password')

	def read_email_dest(self):
		if self.config.has_option('email', 'recipients'):
			return self.config.get('email', 'recipients').split(self.RECEIVERS_DELIMITER)
		else:
			return [read_email_account]

	def read_email_subject(self):
		if self.config.has_option('email', 'subject'):
			return self.config.get('email', 'subject')
		else:
			return DEFAULT_EMAIL_SUBJECT + read_url()

	def read_email_body(self):
		if self.config.has_option('email', 'body'):
			return self.config.get('email', 'body')
		else:
			return DEFAULT_EMAIL_BODY