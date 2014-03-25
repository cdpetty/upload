import urllib2, sys, httplib, mimetypes

import httplib, mimetypes

def post_multipart(host, selector, fields, files):
    """
    Post fields and files to an http host as multipart/form-data.
    fields is a sequence of (name, value) elements for regular form fields.
    files is a sequence of (name, filename, value) elements for data to be uploaded as files
    Return the server's response page.
    """
    content_type, body = encode_multipart_formdata(fields, files)
    h = httplib.HTTP(host)
    h.putrequest('POST', selector)
    h.putheader('content-type', content_type)
    h.putheader('content-length', str(len(body)))
    h.endheaders()
    h.send(body)
    errcode, errmsg, headers = h.getreply()
    return h.file.read()

def encode_multipart_formdata(fields, files):
    """
    fields is a sequence of (name, value) elements for regular form fields.
    files is a sequence of (name, filename, value) elements for data to be uploaded as files
    Return (content_type, body) ready for httplib.HTTP instance
    """
    BOUNDARY = '----------ThIs_Is_tHe_bouNdaRY_$'
    CRLF = '\r\n'
    L = []
    for (key, value) in fields:
        L.append('--' + BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"' % key)
        L.append('')
        L.append(value)
    for (key, filename, value) in files:
        L.append('--' + BOUNDARY)
        L.append('Content-Disposition: form-data; name="%s"; filename="%s"' % (key, filename))
        L.append('Content-Type: %s' % get_content_type(filename))
        L.append('')
        L.append(value)
    L.append('--' + BOUNDARY + '--')
    L.append('')
    body = CRLF.join(L)
    content_type = 'multipart/form-data; boundary=%s' % BOUNDARY
    return content_type, body

def get_content_type(filename):
    return mimetypes.guess_type(filename)[0] or 'application/octet-stream'
    
  
def upload(filename):
  url = "http://localhost:3000"
  route = "/receive/clayton"
  print post_multipart('localhost:3000', '/receive/clayton', None, ('file', filename, ''))

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