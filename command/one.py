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

from optparse import OptionParser
import signal, sys

def pull(parser):
  
  # Defaults
  parser.set_defaults(dpath='.')
  parser.set_defaults(stdout=False)
  
  # Options
  parser.add_option('-d', '--download-path', 
                    action='store', type='string', dest='dpath',
                    help='Specify the folder to place file in')
  parser.add_option('-o', '--stdout',
                    action='store', type='store_true', dest='stdout',
                    help='Write the files contents to stdout')
  # complete
  return parser

def push(parser):

  # Defaults
  parser.set_defaults()
  
  # Options
  parser.add_option('-r', '--recurse',
                    action='store', type-'store_true', dest='recurse',
                    help='recuse into directory and push all files')
  

def composeOptions(sub_command):
  
  # Create option parser
  usage = "usage: %prog <command> [options] arg1"
  version = "%prog 0.1"
  parser = OptionParser(usage=usage, version=version)
  
  # Global Defaults
  parser.set_defaults(quiet=False)
  
  # Global Options
  parser.add_option('-q', '--quiet',
                    action='store', type='store_true', dest='quiet',
                    help='Limit ouput to stdout')
  
  # COMPLETE VERSION OPTION
  parser.add_option('-v', '--version')
  
  
                      

  
if __name__ =='__main__':
  main()