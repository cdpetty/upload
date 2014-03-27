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
from os import path
import signal, sys, requests, getpass

SUB_COMMANDS = ['push', 'pull', 'list', 'init']
NEED_INPUT_STRING = ['push', 'pull']
URL = 'http://localhost:3000'

def log(statement):
  sys.stdout.write(statement)

def die(statement):
  sys.stderr.write('ERROR: ' + statement + '\n')
  sys.exit(1)

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

def obtain_user_info():
  # Check if authentication file exists
  p = path.expanduser('~/.one')
  if path.isfile(p):
    username = ''
    password = ''
    with open(p, 'r') as auth_file:
      auth_file = open(p, 'r')
      username = auth_file.readline().strip()
      password = auth_file.readline()
    return username, password
  else:
    die('Run "one init" to sign into user')
  die('done')
    
def initialize():
  # create new user
  username = raw_input('If you have an account already, input your username: ')
  password = getpass.getpass('Input your password (note: no text will appear on screen): ')
  
  # Create authentication file
  p = path.expanduser('~/.one')
  with open(p, 'w') as auth_file:
    auth_file.write(username + '\n' + password)
  log('Consider yourself: Signed In')
  sys.exit(0)

def push(filenames): 
  # Get auth
  username, password = obtain_user_info()
  route = '/receive/' + username
  data = { 'password': password}
  
  # Upload Files
  for filename in filenames:
    #with open(filename, 'r') as f:
    f = open(filename, 'r')
    files = { 'file': f }
    r = requests.post(URL + route, files=files, data=data)
    

def pull(filenames):
  
  # Get username
  username, password = obtain_user_info()
  del(password)
  
  # Download Files
  for filename in filenames:
    route = '/'.join(['/send', username, filename])
    file = requests.get(URL + route).text
    print file[0:15]
    with open(filename, 'wb') as f:
      f.write(file)

def main():
  
  (options, args) = build_option_parser().parse_args()
  
  if len(args) == 0:
    die('No sub-command chosen')
  elif len(args) == 1 and args[0] in NEED_INPUT_STRING:
    die('No file selected. Must select at least one file')
  elif args[0] not in SUB_COMMANDS:
    die('Invalid sub-command chosen: ' + args[0])
  
  sub_command = args[0]
  files = args[1:]
  
  if sub_command == 'pull':
    pull(files)
  elif sub_command == 'push':
    push(files)
  elif sub_command == 'init':
    initialize()
  


if __name__ =='__main__':
  main()
