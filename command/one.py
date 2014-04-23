#!/usr/bin/env python

   ############################
  # _______  _        _______  #
  #(  ___  )( (    /|(  ____ \ #
  #| (   ) ||  \  ( || (    \/ #
  #| |   | ||   \ | || (__     #
  #| |   | || (\ \) ||  __)    #
  #| |   | || | \   || (       #
  #| (___) || )  \  || (____/\ #
  #(_______)|/    )_)(_______/ #
   ############################                       

from optparse import OptionParser, OptionGroup
from os import path, walk
import signal, sys, requests, getpass, compress, logger

SUB_COMMANDS = ['push', 'pull', 'list', 'init', 'create', 'rm']
NEED_INPUT_STRING = ['push', 'pull', 'create', 'rm']
URL = 'http://localhost:3000'
SPACING = ' ' * 2

STDOUT = False
QUIET = False  ### QUIET DOESNT WORK NOW
RECURSE = False
DPATH = '.'

######################################
def build_option_parser():
  
  # Create option parser and Option Groups
  usage = "usage: %prog <command> [options] arg1"
  version = "%prog 0.1"
  parser = OptionParser(usage=usage, version=version)
  push_group = OptionGroup(parser, 'Pull Options', 
                           'These options apply to only the "Pull" subcommand')
  pull_group = OptionGroup(parser, 'Pull Options', 
                           'These options apply to only the "Pull" subcommand')
  
  # Defaults
  parser.set_defaults(quiet=False) #Global
  parser.set_defaults(recurse=False) #Push
  parser.set_defaults(dpath='.', stdout=False) #Pull
  
  
  # Options
  parser.add_option('-q', '--quiet',
                    action='store_true', dest='quiet',
                    help='Limit ouput to stdout') 
  push_group.add_option('-r', '--recurse',
                    action='store_true', dest='recurse',
                    help='recuse into directory and push all files') 
  pull_group.add_option('-d', '--download-path', 
                    action='store', type='string', dest='dpath',
                    help='Specify the folder to place file in')
  pull_group.add_option('-o', '--stdout',
                    action='store_true', dest='stdout',
                    help='Write the files contents to stdout')
  
  # Add option groups
  parser.add_option_group(push_group)
  parser.add_option_group(pull_group)

  return parser

def get_full_path(name):
  return path.join(path.abspath(path.expanduser(DPATH)), name)

def get_relative_path(full_path, base_path):
  return '/'.join(full_path[len(base_path)-1:])
######################################



######################################
def obtain_user_info():
  p = path.expanduser('~/.one')
  if path.isfile(p):
    with open(p, 'r') as auth_file:
      username = auth_file.readline().strip()
      password = auth_file.readline().strip()
    return username, password
  else:
    logger.die('Run "one init" to sign into user')
    
def initialize():
  # create new user
  username = raw_input('If you have an account already, input your username: ')
  password = getpass.getpass('Input your password (note that no text will appear on screen): ')
  p = path.expanduser('~/.one')
  with open(p, 'w') as auth_file:
    auth_file.write(username + '\n' + password + '\nzip')
  logger.log('Consider yourself: Signed In')
  sys.exit(0)
  
def create_user(username, password):
  route = '/initialize'
  data = { 'username': username, 'password': password } 
  r = requests.post(URL + route, data=data)
  logger.end(r.text)
######################################



######################################
def list_files(path):
  username = obtain_user_info()[0]
  route = '/list-files/' + username
  data = {'path': path}
  r = requests.get(URL + route, params=data)
  if r.text:
    logger.log('One contains the following:\n' + r.text)
  else: 
    logger.log('No Stored Files\n')
######################################



######################################
def push(filenames): 
  username, password = obtain_user_info()
  route = '/upload'
  data = { 'username': username, 'password': password }
  
  for name in filenames:
    logger.log('Uploading', name + '.... ')
    p = get_full_path(name)
    
    if path.isdir(p):
      depth = 1
      for folder_path, dirnames, filenames in walk(p):
        logger.log('1')
        logger.log(SPACING * depth, path.basename(folder_path), '\n')
        
        for filename in filenames:
          logger.log(SPACING * (depth + 1), filename, '\n')
          full_path = path.join(folder_path, filename)
          f = open(full_path, 'rb')
          data['path'] = get_relative_path(folder_path.split('/'), p.split('/'))
          files = { 'file': f }
          r = requests.post(URL + route, files=files, data=data)
          #r.close()
        depth += 1
      logger.log('\n')
    else:
      f = open(p, 'r')  
      files = { 'file': f }
      r = requests.post(URL + route, files=files, data=data)
      logger.log('Done\n')

def pull(filenames):
  
  # Get username
  username  = obtain_user_info()[0]
  
  # Download Files
  for name in filenames:
    logger.log('Downloading file: ' + name + '..... ')
    route = '/'.join(['/download', username, name])
    file = requests.get(URL + route).text
    
    if STDOUT:
      log(file + '/n')
    else: 
      full_path = get_full_path(name)
      with open(full_path, 'wb') as f:
        f.write(file)
      logger.log('Download Complete\n')
######################################



######################################
def delete(filenames):
  route = '/delete'
  username, password = obtain_user_info()
  data = { 'username': username, 'password': password }
  
  for filename in filenames:
    data['filename'] = filename
    r = requests.post(URL + route, data=data);
    logger.log('File: ' + filename + ' deleted\n')
######################################



######################################
def main():
  
  global STDOUT, QUIET, RECURSE, DPATH
  (options, args) = build_option_parser().parse_args()

  if len(args) == 0:
    logger.die('No sub-command chosen')
  elif len(args) == 1 and args[0] in NEED_INPUT_STRING:
    logger.die('No file selected. Must select at least one file')
  elif args[0] not in SUB_COMMANDS:
    logger.die('Invalid sub-command chosen - ' + args[0])
  elif args[0] == 'list' and len(args) == 1:
    args.append('')
  
  
  sub_command = args[0]
  files = args[1:]
  STDOUT = options.stdout
  QUIET = options.quiet
  RECURSE = options.recurse
  DPATH = options.dpath
  
  if sub_command == 'pull':
    pull(files)
  elif sub_command == 'push':
    push(files)
  elif sub_command == 'init':
    initialize()
  elif sub_command == 'list':
    list_files(files[0])
  elif sub_command == 'create':
    create_user(files[0], files[1])
  elif sub_command == 'rm':
    delete(files)
  


if __name__ == '__main__':
  def sigint_handler(signal, frame):
    sys.stdout.write('\nCaught Control-C. Exiting now.\n')
    sys.exit(130)
  signal.signal(signal.SIGINT, sigint_handler)
  main()
######################################
