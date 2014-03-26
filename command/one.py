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
import signal, sys, requests

SUB_COMMANDS = ['push', 'pull', 'list']
NEED_INPUT_STRING = ['push', 'pull']

def log(statement):
  sys.stdout.write(statement)

def die(statement):
  sys.stderr.write('ERROR: ' + statement + '\n')
  sys.exit(1)

def pull():
  pass

def push():
  pass
 

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
  # COMPLETE VERSION OPTION
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

def upload(filenames): 
  url = "http://localhost:3000"
  route = "/receive/clayton"
  data = {'username':'clayton', 'password':'petty'}
  for file in filenames:
    files = {'file':open(file, 'r')}
    r = requests.post(url + route, files=files, data=data)
    print r.text

def download(filenames):
  url = "http://localhost:3000"
  for filename in filenames:
    route = "/send/clayton/" + filename
    file = requests.get(url + route).text
    f = open(filename, 'w')
    f.write(file)
    f.close()

def main():
  
  (options, args) = build_option_parser().parse_args()
  
  if len(args) == 0:
    die('No sub-command chosen')
  elif len(args) == 1 and args[0] in NEED_INPUT_STRING:
    die('No file selected. Must select at least one file')
  elif args[0] not in SUB_COMMANDS:
    die('Invalid sub-command chosen: ' + args[0])
  
  sub_command = args[0]
  
  if sub_command == 'pull':
    download(args[1:])
  elif sub_command == 'push':
    upload(args[1:])
  

  
if __name__ =='__main__':
  main()
