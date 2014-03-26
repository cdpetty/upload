import urllib2, sys, requests
    
  
def upload(filename): 
  url = "http://localhost:3000"
  route = "/receive/clayton"
  files = {'file':open(filename, 'r')}
  data = {'username':'clayton', 'password':'petty'}
  r = requests.post(url + route, files=files, data=data)
  print r.text

def download(filename):
  url = "http://localhost:3000"
  route = "/send/clayton/" + filename
  file = urllib2.urlopen(url + route).read()  
  print file
  f = open('asdf.fdsa', 'w')
  f.write(file)
  f.close()

  
if __name__ == '__main__':
  if sys.argv[1] == 'upload':
    upload(sys.argv[2])
  elif sys.argv[1] == 'download':
    download(sys.argv[2])
  
#download: ping website and save data
#upload: encrypt file and ping website
#http://code.activestate.com/recipes/146306-http-client-to-post-using-multipartform-data/