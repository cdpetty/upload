import zipfile, gzip, logger
from os import path, walk


def compress_folder(p):
  auth_p = path.expanduser('~/.one')
  if path.isfile(auth_p):
    with open(auth_p, 'r') as auth_file:
      auth_file.readline()
      auth_file.readline()
      compress_type = auth_file.readline()
    if compress_type == 'zip':
      compress_zip(p)
    elif compress_type == 'tar_ball':
      compress_tar(p)
  else:
    logger.die('Run "one init" to sign into user')

def compress_zip(p):
  
  with zipfile.ZipFile(p + '.zip', 'w') as zf:
    for new_path, dirnames, filenames in walk(p):
      new_path = new_path.replace(path.dirname(p), '')[1:]
      zf.write(new_path)
      for filename in filenames:
        zf.write(path.join(new_path, filename))
  

def compress_tar(p):
  pass

####################

def decomppress(p):
  pass

def decompress_zip(p):
  pass

def decompress_tar(p):
  pass

