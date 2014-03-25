import urllib2, sys

def upload():
  url = "http://localhost:3000"
  route = "/receive/clayton"
  #f = open('test3', 'r')

def download(filename):
  url = "http://localhost:3000"
  route = "/send/clayton/" + filename
  file = urllib2.urlopen(url + route)
  f = open('asdf.fdsa', 'w')
  f.write(file)
  f.close()

  
if __name__ == '__main__':
  download(sys.argv[1])
  
#download: ping website and save data
#upload: encrypt file and ping website